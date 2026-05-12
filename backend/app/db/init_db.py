from datetime import time
from decimal import Decimal

from sqlalchemy import select
from app.academics.domain import calculate_bimester_average, calculate_weighted_score, resolve_mention
from app.academics.models import GradeEntry, SchoolClass, Subject, TeachingAssignment
from app.admins.models import AdminProfile
from app.announcements.models import Announcement
from app.audit_logs.models import AuditLog
from app.auth.security import hash_password
from app.db.base import Base
from app.db.session import AsyncSessionLocal, engine
from app.logbooks.models import LogbookRecord
from app.messaging.models import Conversation, Message
from app.notifications.models import Notification
from app.parents.models import ParentProfile
from app.preparation_cards.models import PreparationCard
from app.report_cards.models import ReportCard, ReportCardLine
from app.schedules.models import Classroom, ScheduleEntry
from app.security.rbac import Role
from app.students.models import SchoolSection, Student
from app.teachers.models import TeacherProfile
from app.users.models import User


async def _get_or_create_user(session, *, username: str, password: str, full_name: str, role: Role) -> User:
    result = await session.execute(select(User).where(User.username == username))
    user = result.scalar_one_or_none()
    if user is not None:
        return user
    user = User(
        username=username,
        password_hash=hash_password(password),
        full_name=full_name,
        role=role,
        force_password_reset=False,
    )
    session.add(user)
    await session.flush()
    return user


async def _get_or_create_teacher(
    session,
    *,
    user: User,
    employee_code: str,
    full_name: str,
    subjects: list[str],
    phone: str,
) -> TeacherProfile:
    result = await session.execute(select(TeacherProfile).where(TeacherProfile.employee_code == employee_code))
    teacher = result.scalar_one_or_none()
    if teacher is not None:
        return teacher
    teacher = TeacherProfile(
        user_id=user.id,
        employee_code=employee_code,
        full_name=full_name,
        subjects=subjects,
        phone=phone,
        current_location="Antananarivo",
        status="active",
    )
    session.add(teacher)
    await session.flush()
    return teacher


async def _get_or_create_class(
    session,
    *,
    academic_year: str,
    name: str,
    section: SchoolSection,
    grade_level: int,
    responsible_teacher_id,
    room_label: str,
) -> SchoolClass:
    result = await session.execute(
        select(SchoolClass).where(
            SchoolClass.academic_year == academic_year,
            SchoolClass.section == section,
            SchoolClass.grade_level == grade_level,
            SchoolClass.name == name,
        )
    )
    school_class = result.scalar_one_or_none()
    if school_class is not None:
        return school_class
    school_class = SchoolClass(
        academic_year=academic_year,
        name=name,
        section=section,
        grade_level=grade_level,
        responsible_teacher_id=responsible_teacher_id,
        room_label=room_label,
    )
    session.add(school_class)
    await session.flush()
    return school_class


async def _get_or_create_subject(
    session,
    *,
    code: str,
    name: str,
    section: SchoolSection,
    default_coefficient: Decimal,
) -> Subject:
    result = await session.execute(select(Subject).where(Subject.code == code))
    subject = result.scalar_one_or_none()
    if subject is not None:
        return subject
    subject = Subject(code=code, name=name, section=section, default_coefficient=default_coefficient)
    session.add(subject)
    await session.flush()
    return subject


async def _get_or_create_assignment(
    session,
    *,
    academic_year: str,
    teacher_id,
    class_id,
    subject_id,
    coefficient: Decimal,
) -> TeachingAssignment:
    result = await session.execute(
        select(TeachingAssignment).where(
            TeachingAssignment.academic_year == academic_year,
            TeachingAssignment.teacher_id == teacher_id,
            TeachingAssignment.class_id == class_id,
            TeachingAssignment.subject_id == subject_id,
        )
    )
    assignment = result.scalar_one_or_none()
    if assignment is not None:
        return assignment
    assignment = TeachingAssignment(
        academic_year=academic_year,
        teacher_id=teacher_id,
        class_id=class_id,
        subject_id=subject_id,
        coefficient=coefficient,
    )
    session.add(assignment)
    await session.flush()
    return assignment


async def initialize_database() -> None:
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        superadmin = await _get_or_create_user(
            session,
            username="superadmin",
            password="ChangeMe123!",
            full_name="Super Administrator",
            role=Role.SUPER_ADMIN,
        )
        admin = await _get_or_create_user(
            session,
            username="admin.school",
            password="Admin123!",
            full_name="Rindra Admin",
            role=Role.ADMIN,
        )
        teacher_john_user = await _get_or_create_user(
            session,
            username="teacher.john",
            password="Teacher123!",
            full_name="John Doe",
            role=Role.TEACHER,
        )
        teacher_marie_user = await _get_or_create_user(
            session,
            username="teacher.marie",
            password="Teacher123!",
            full_name="Marie Razafindrakoto",
            role=Role.TEACHER,
        )
        teacher_andry_user = await _get_or_create_user(
            session,
            username="teacher.andry",
            password="Teacher123!",
            full_name="Andry Rakotomalala",
            role=Role.TEACHER,
        )
        parent_user = await _get_or_create_user(
            session,
            username="parent.demo",
            password="Parent123!",
            full_name="Parent Demo",
            role=Role.PARENT,
        )

        admin_profile_result = await session.execute(select(AdminProfile).where(AdminProfile.user_id == admin.id))
        if admin_profile_result.scalar_one_or_none() is None:
            session.add(AdminProfile(user_id=admin.id, full_name=admin.full_name, department="Scolarité", phone="+261 34 10 000 00"))

        parent_profile_result = await session.execute(select(ParentProfile).where(ParentProfile.user_id == parent_user.id))
        if parent_profile_result.scalar_one_or_none() is None:
            session.add(ParentProfile(user_id=parent_user.id, full_name=parent_user.full_name, phone="+261 34 20 000 00", address="Antananarivo"))

        teacher_john = await _get_or_create_teacher(
            session,
            user=teacher_john_user,
            employee_code="T-001",
            full_name=teacher_john_user.full_name,
            subjects=["Maths", "PC"],
            phone="+261 34 00 000 01",
        )
        teacher_marie = await _get_or_create_teacher(
            session,
            user=teacher_marie_user,
            employee_code="T-002",
            full_name=teacher_marie_user.full_name,
            subjects=["Français", "Malagasy"],
            phone="+261 34 00 000 02",
        )
        teacher_andry = await _get_or_create_teacher(
            session,
            user=teacher_andry_user,
            employee_code="T-003",
            full_name=teacher_andry_user.full_name,
            subjects=["Anglais", "Histo-Géo"],
            phone="+261 34 00 000 03",
        )

        classes = [
            await _get_or_create_class(
                session,
                academic_year="2026",
                name="8e",
                section=SchoolSection.MIDDLE_SCHOOL,
                grade_level=8,
                responsible_teacher_id=teacher_john.id,
                room_label="Salle 8",
            ),
            await _get_or_create_class(
                session,
                academic_year="2026",
                name="9e",
                section=SchoolSection.MIDDLE_SCHOOL,
                grade_level=9,
                responsible_teacher_id=teacher_marie.id,
                room_label="Salle 9",
            ),
            await _get_or_create_class(
                session,
                academic_year="2026",
                name="10e",
                section=SchoolSection.HIGH_SCHOOL,
                grade_level=10,
                responsible_teacher_id=teacher_andry.id,
                room_label="Salle 10",
            ),
        ]

        for name, capacity, building in (("Salle 8", 32, "Bloc A"), ("Salle 9", 30, "Bloc A"), ("Laboratoire PC", 24, "Bloc B"), ("Salle 10", 34, "Bloc C")):
            classroom_result = await session.execute(select(Classroom).where(Classroom.name == name))
            if classroom_result.scalar_one_or_none() is None:
                session.add(Classroom(name=name, capacity=capacity, building=building))
        await session.flush()

        subject_specs = [
            ("MAL", "Malagasy", SchoolSection.MIDDLE_SCHOOL, Decimal("3")),
            ("FR", "Français", SchoolSection.MIDDLE_SCHOOL, Decimal("2")),
            ("ANG", "Anglais", SchoolSection.MIDDLE_SCHOOL, Decimal("2")),
            ("HG", "Histo-Géo", SchoolSection.MIDDLE_SCHOOL, Decimal("3")),
            ("MATHS", "Maths", SchoolSection.MIDDLE_SCHOOL, Decimal("3")),
            ("PC", "PC", SchoolSection.MIDDLE_SCHOOL, Decimal("2")),
            ("SVT", "SVT", SchoolSection.MIDDLE_SCHOOL, Decimal("3")),
            ("INFO", "INFO", SchoolSection.MIDDLE_SCHOOL, Decimal("1")),
            ("EPS", "EPS", SchoolSection.MIDDLE_SCHOOL, Decimal("1")),
            ("PHILO", "Philosophie", SchoolSection.HIGH_SCHOOL, Decimal("2")),
        ]
        subjects = {
            code: await _get_or_create_subject(
                session,
                code=code,
                name=name,
                section=section,
                default_coefficient=coefficient,
            )
            for code, name, section, coefficient in subject_specs
        }

        assignments = [
            await _get_or_create_assignment(session, academic_year="2026", teacher_id=teacher_john.id, class_id=classes[0].id, subject_id=subjects["MATHS"].id, coefficient=Decimal("3")),
            await _get_or_create_assignment(session, academic_year="2026", teacher_id=teacher_john.id, class_id=classes[0].id, subject_id=subjects["PC"].id, coefficient=Decimal("2")),
            await _get_or_create_assignment(session, academic_year="2026", teacher_id=teacher_marie.id, class_id=classes[0].id, subject_id=subjects["FR"].id, coefficient=Decimal("2")),
            await _get_or_create_assignment(session, academic_year="2026", teacher_id=teacher_marie.id, class_id=classes[0].id, subject_id=subjects["MAL"].id, coefficient=Decimal("3")),
            await _get_or_create_assignment(session, academic_year="2026", teacher_id=teacher_andry.id, class_id=classes[0].id, subject_id=subjects["ANG"].id, coefficient=Decimal("2")),
            await _get_or_create_assignment(session, academic_year="2026", teacher_id=teacher_andry.id, class_id=classes[0].id, subject_id=subjects["HG"].id, coefficient=Decimal("3")),
            await _get_or_create_assignment(session, academic_year="2026", teacher_id=teacher_john.id, class_id=classes[1].id, subject_id=subjects["MATHS"].id, coefficient=Decimal("3")),
            await _get_or_create_assignment(session, academic_year="2026", teacher_id=teacher_marie.id, class_id=classes[1].id, subject_id=subjects["FR"].id, coefficient=Decimal("2")),
        ]

        student_specs = [
            ("ST-001", "Miora Rakoto", "8e", 8, SchoolSection.MIDDLE_SCHOOL),
            ("ST-002", "Nantenaina Rabe", "8e", 8, SchoolSection.MIDDLE_SCHOOL),
            ("ST-003", "Tiana Randrianarisoa", "8e", 8, SchoolSection.MIDDLE_SCHOOL),
            ("ST-004", "Hasina Andriamampianina", "8e", 8, SchoolSection.MIDDLE_SCHOOL),
            ("ST-005", "Fanja Rasoanaivo", "9e", 9, SchoolSection.MIDDLE_SCHOOL),
            ("ST-006", "Toky Ranaivoson", "9e", 9, SchoolSection.MIDDLE_SCHOOL),
            ("ST-007", "Mialy Raveloson", "10e", 10, SchoolSection.HIGH_SCHOOL),
        ]
        students_by_code: dict[str, Student] = {}
        for code, full_name, class_name, grade_level, section in student_specs:
            student_result = await session.execute(select(Student).where(Student.code == code))
            student = student_result.scalar_one_or_none()
            if student is None:
                student = Student(
                    code=code,
                    full_name=full_name,
                    section=section,
                    grade_level=grade_level,
                    class_name=class_name,
                    guardian_name=parent_user.full_name,
                    parent_user_id=parent_user.id if code in {"ST-001", "ST-002"} else None,
                )
                session.add(student)
                await session.flush()
            students_by_code[code] = student

        grade_seed = [
            ("ST-001", assignments[0], 1, Decimal("11.50"), Decimal("29.25"), "Peut mieux faire"),
            ("ST-001", assignments[1], 1, Decimal("17.00"), Decimal("23.00"), "Assez bien"),
            ("ST-001", assignments[2], 1, Decimal("10.00"), Decimal("25.00"), "Passable"),
            ("ST-001", assignments[3], 1, Decimal("13.33"), Decimal("37.50"), "Travaille"),
            ("ST-002", assignments[0], 1, Decimal("15.00"), Decimal("34.00"), "Bien"),
            ("ST-003", assignments[0], 1, Decimal("9.50"), Decimal("22.00"), "À renforcer"),
            ("ST-004", assignments[0], 1, Decimal("16.00"), Decimal("38.00"), "Très bien"),
        ]
        for student_code, assignment, bimester, test_score, exam_score, remark in grade_seed:
            student = students_by_code[student_code]
            grade_result = await session.execute(
                select(GradeEntry).where(
                    GradeEntry.student_id == student.id,
                    GradeEntry.assignment_id == assignment.id,
                    GradeEntry.academic_year == "2026",
                    GradeEntry.bimester == bimester,
                )
            )
            if grade_result.scalar_one_or_none() is None:
                average = calculate_bimester_average(test_score, exam_score)
                session.add(
                    GradeEntry(
                        student_id=student.id,
                        assignment_id=assignment.id,
                        academic_year="2026",
                        bimester=bimester,
                        test_score=test_score,
                        exam_score=exam_score,
                        average=average,
                        coefficient=assignment.coefficient,
                        weighted_score=calculate_weighted_score(average, assignment.coefficient),
                        mention=resolve_mention(average),
                        teacher_remark=remark,
                        status="draft",
                    )
                )

        classrooms_result = await session.execute(select(Classroom))
        classrooms = {classroom.name: classroom for classroom in classrooms_result.scalars().all()}
        schedule_seed = [
            (teacher_john.id, classrooms["Salle 8"].id, "Maths", "8e", 1, time(8, 0), time(9, 0)),
            (teacher_marie.id, classrooms["Salle 8"].id, "Français", "8e", 1, time(9, 0), time(10, 0)),
            (teacher_john.id, classrooms["Laboratoire PC"].id, "PC", "8e", 2, time(10, 0), time(11, 0)),
            (teacher_andry.id, classrooms["Salle 9"].id, "Anglais", "9e", 3, time(8, 0), time(9, 0)),
        ]
        for teacher_id, classroom_id, subject_name, class_name, weekday, starts_at, ends_at in schedule_seed:
            schedule_result = await session.execute(
                select(ScheduleEntry).where(
                    ScheduleEntry.teacher_id == teacher_id,
                    ScheduleEntry.classroom_id == classroom_id,
                    ScheduleEntry.class_name == class_name,
                    ScheduleEntry.weekday == weekday,
                    ScheduleEntry.starts_at == starts_at,
                    ScheduleEntry.ends_at == ends_at,
                )
            )
            if schedule_result.scalar_one_or_none() is None:
                session.add(
                    ScheduleEntry(
                        teacher_id=teacher_id,
                        classroom_id=classroom_id,
                        subject=subject_name,
                        class_name=class_name,
                        weekday=weekday,
                        starts_at=starts_at,
                        ends_at=ends_at,
                    )
                )

        announcement_result = await session.execute(select(Announcement).where(Announcement.title == "Conseil de classe Bimestre 1"))
        if announcement_result.scalar_one_or_none() is None:
            session.add(
                Announcement(
                    author_user_id=superadmin.id,
                    title="Conseil de classe Bimestre 1",
                    body="Les notes du Bimestre 1 doivent être complétées avant vendredi.",
                    pinned=True,
                    audience_roles=["admin", "teacher"],
                    attachment_urls=[],
                    read_by_user_ids=[],
                )
            )

        conversation_result = await session.execute(select(Conversation).where(Conversation.title == "Administration - Professeurs"))
        conversation = conversation_result.scalar_one_or_none()
        if conversation is None:
            conversation = Conversation(
                title="Administration - Professeurs",
                participant_user_ids=[str(admin.id), str(teacher_john_user.id), str(teacher_marie_user.id)],
                is_group=True,
            )
            session.add(conversation)
            await session.flush()
            session.add(
                Message(
                    conversation_id=conversation.id,
                    sender_user_id=admin.id,
                    body="Merci de vérifier vos classes et de saisir les notes manquantes.",
                    attachment_urls=[],
                    reactions=[],
                    status="delivered",
                )
            )

        await session.commit()
