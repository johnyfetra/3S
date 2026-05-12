from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.academics.domain import calculate_bimester_average, calculate_weighted_score, resolve_mention
from app.academics.models import GradeEntry, SchoolClass, Subject, TeachingAssignment
from app.academics.schemas import (
    GradeEntryCreate,
    GradeEntryRead,
    GradeEntryUpdate,
    SchoolClassCreate,
    SchoolClassRead,
    SchoolClassUpdate,
    SubjectCreate,
    SubjectRead,
    SubjectUpdate,
    TeacherAssignmentSummary,
    TeachingAssignmentCreate,
    TeachingAssignmentRead,
    TeachingAssignmentUpdate,
)
from app.auth.dependencies import CurrentUser, get_current_user
from app.core.exceptions import DomainError
from app.db.session import get_db_session
from app.security.rbac import Permission, Role, require_permission
from app.shared.crud import CrudRouterFactory
from app.students.models import Student
from app.teachers.models import TeacherProfile

classes_router = CrudRouterFactory(
    prefix="/academic/classes",
    tags=["academic-classes"],
    model=SchoolClass,
    read_schema=SchoolClassRead,
    create_permission=Permission.MANAGE_TIMETABLE,
    update_permission=Permission.MANAGE_TIMETABLE,
    delete_permission=Permission.MANAGE_TIMETABLE,
).build(SchoolClassCreate, SchoolClassUpdate)

subjects_router = CrudRouterFactory(
    prefix="/academic/subjects",
    tags=["academic-subjects"],
    model=Subject,
    read_schema=SubjectRead,
    create_permission=Permission.MANAGE_TIMETABLE,
    update_permission=Permission.MANAGE_TIMETABLE,
    delete_permission=Permission.MANAGE_TIMETABLE,
).build(SubjectCreate, SubjectUpdate)

assignments_router = CrudRouterFactory(
    prefix="/academic/assignments",
    tags=["academic-assignments"],
    model=TeachingAssignment,
    read_schema=TeachingAssignmentRead,
    create_permission=Permission.MANAGE_TIMETABLE,
    update_permission=Permission.MANAGE_TIMETABLE,
    delete_permission=Permission.MANAGE_TIMETABLE,
).build(TeachingAssignmentCreate, TeachingAssignmentUpdate)

teacher_workspace_router = APIRouter(prefix="/teacher-workspace", tags=["teacher-workspace"])


async def _get_teacher_for_user(session: AsyncSession, user: CurrentUser) -> TeacherProfile:
    result = await session.execute(select(TeacherProfile).where(TeacherProfile.user_id == user.id))
    teacher = result.scalar_one_or_none()
    if teacher is None:
        raise DomainError("Teacher profile not found for this user", status_code=404)
    return teacher


async def _get_assignment_for_teacher(
    session: AsyncSession,
    assignment_id: UUID,
    user: CurrentUser,
) -> TeachingAssignment:
    assignment = await session.get(TeachingAssignment, assignment_id)
    if assignment is None:
        raise DomainError("Teaching assignment not found", status_code=404)

    if Role(user.role) in {Role.SUPER_ADMIN, Role.ADMIN}:
        return assignment

    teacher = await _get_teacher_for_user(session, user)
    if assignment.teacher_id != teacher.id:
        raise DomainError("You can only manage grades for your own classes and subjects", status_code=403)
    return assignment


@teacher_workspace_router.get("/me", response_model=list[TeacherAssignmentSummary])
async def my_teacher_workspace(
    user: CurrentUser = Depends(require_permission(Permission.ENTER_GRADES)),
    session: AsyncSession = Depends(get_db_session),
) -> list[TeacherAssignmentSummary]:
    teacher = await _get_teacher_for_user(session, user)
    result = await session.execute(
        select(TeachingAssignment, SchoolClass, Subject)
        .join(SchoolClass, TeachingAssignment.class_id == SchoolClass.id)
        .join(Subject, TeachingAssignment.subject_id == Subject.id)
        .where(TeachingAssignment.teacher_id == teacher.id)
        .order_by(SchoolClass.grade_level.asc(), SchoolClass.name.asc(), Subject.name.asc())
    )
    rows = result.all()
    summaries: list[TeacherAssignmentSummary] = []
    for assignment, school_class, subject in rows:
        students_result = await session.execute(
            select(Student)
            .where(
                Student.section == school_class.section,
                Student.grade_level == school_class.grade_level,
                Student.class_name == school_class.name,
            )
            .order_by(Student.full_name.asc())
        )
        summaries.append(
            TeacherAssignmentSummary(
                assignment_id=assignment.id,
                academic_year=assignment.academic_year,
                class_id=school_class.id,
                class_name=school_class.name,
                grade_level=school_class.grade_level,
                section=school_class.section,
                subject_id=subject.id,
                subject_name=subject.name,
                coefficient=assignment.coefficient,
                is_class_responsible=school_class.responsible_teacher_id == teacher.id,
                students=list(students_result.scalars().all()),
            )
        )
    return summaries


@teacher_workspace_router.get("/grades", response_model=list[GradeEntryRead])
async def list_assignment_grades(
    assignment_id: UUID = Query(),
    bimester: int = Query(ge=1, le=5),
    user: CurrentUser = Depends(require_permission(Permission.ENTER_GRADES)),
    session: AsyncSession = Depends(get_db_session),
) -> list[GradeEntry]:
    await _get_assignment_for_teacher(session, assignment_id, user)
    result = await session.execute(
        select(GradeEntry)
        .where(GradeEntry.assignment_id == assignment_id, GradeEntry.bimester == bimester)
        .order_by(GradeEntry.created_at.desc())
    )
    return list(result.scalars().all())


@teacher_workspace_router.post("/grades", response_model=GradeEntryRead, status_code=201)
async def upsert_grade(
    payload: GradeEntryCreate,
    user: CurrentUser = Depends(require_permission(Permission.ENTER_GRADES)),
    session: AsyncSession = Depends(get_db_session),
) -> GradeEntry:
    assignment = await _get_assignment_for_teacher(session, payload.assignment_id, user)
    school_class = await session.get(SchoolClass, assignment.class_id)
    student = await session.get(Student, payload.student_id)
    if school_class is None or student is None:
        raise DomainError("Class or student not found", status_code=404)
    if (
        student.section != school_class.section
        or student.grade_level != school_class.grade_level
        or student.class_name != school_class.name
    ):
        raise DomainError("This student is not enrolled in the assignment class", status_code=422)

    average = calculate_bimester_average(payload.test_score, payload.exam_score)
    grade_result = await session.execute(
        select(GradeEntry).where(
            GradeEntry.student_id == payload.student_id,
            GradeEntry.assignment_id == payload.assignment_id,
            GradeEntry.academic_year == payload.academic_year,
            GradeEntry.bimester == payload.bimester,
        )
    )
    grade = grade_result.scalar_one_or_none()
    values = payload.model_dump()
    values.update(
        average=average,
        coefficient=assignment.coefficient,
        weighted_score=calculate_weighted_score(average, assignment.coefficient),
        mention=resolve_mention(average),
    )

    if grade is None:
        grade = GradeEntry(**values)
        session.add(grade)
    else:
        for field, value in values.items():
            setattr(grade, field, value)

    await session.commit()
    await session.refresh(grade)
    return grade


@teacher_workspace_router.patch("/grades/{grade_id}", response_model=GradeEntryRead)
async def update_grade(
    grade_id: UUID,
    payload: GradeEntryUpdate,
    user: CurrentUser = Depends(require_permission(Permission.ENTER_GRADES)),
    session: AsyncSession = Depends(get_db_session),
) -> GradeEntry:
    grade = await session.get(GradeEntry, grade_id)
    if grade is None:
        raise DomainError("Grade not found", status_code=404)
    assignment = await _get_assignment_for_teacher(session, grade.assignment_id, user)
    changes = payload.model_dump(exclude_unset=True)
    for field, value in changes.items():
        setattr(grade, field, value)
    grade.average = calculate_bimester_average(grade.test_score, grade.exam_score)
    grade.coefficient = assignment.coefficient
    grade.weighted_score = calculate_weighted_score(grade.average, assignment.coefficient)
    grade.mention = resolve_mention(grade.average)
    await session.commit()
    await session.refresh(grade)
    return grade
