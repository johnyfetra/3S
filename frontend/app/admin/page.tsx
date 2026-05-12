"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, CalendarDays, GraduationCap, Layers3, Plus, RefreshCw, ShieldCheck, Users } from "lucide-react";
import { AppShell } from "@/components/layouts/app-shell";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { Classroom, ScheduleEntry, SchoolClass, Student, Subject, Teacher, TeachingAssignmentRead, User } from "@/lib/types/domain";

type CatalogState = {
  users: User[];
  teachers: Teacher[];
  students: Student[];
  classes: SchoolClass[];
  subjects: Subject[];
  assignments: TeachingAssignmentRead[];
  classrooms: Classroom[];
  schedules: ScheduleEntry[];
};

const emptyCatalog: CatalogState = {
  users: [],
  teachers: [],
  students: [],
  classes: [],
  subjects: [],
  assignments: [],
  classrooms: [],
  schedules: []
};

const fieldClass = "min-h-10 rounded-lg border border-black/10 bg-white px-3 text-sm outline-none focus:border-orange-500 dark:border-white/10 dark:bg-black/20";

function nameById<T extends { id: string }>(items: T[], id: string, pick: (item: T) => string) {
  return items.find((item) => item.id === id) ? pick(items.find((item) => item.id === id) as T) : "-";
}

export default function AdminPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [catalog, setCatalog] = useState<CatalogState>(emptyCatalog);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userForm, setUserForm] = useState({ username: "teacher.new", password: "Teacher123!", full_name: "", role: "teacher" });
  const [classForm, setClassForm] = useState({ academic_year: "2026", name: "9e", section: "middle_school", grade_level: "9", responsible_teacher_id: "", room_label: "" });
  const [subjectForm, setSubjectForm] = useState({ code: "FR", name: "Français", section: "middle_school", default_coefficient: "2" });
  const [teacherForm, setTeacherForm] = useState({ user_id: "", employee_code: "T-002", full_name: "", subjects: "Français", phone: "" });
  const [studentForm, setStudentForm] = useState({ code: "ST-003", full_name: "", section: "middle_school", grade_level: "8", class_name: "8e", guardian_name: "" });
  const [assignmentForm, setAssignmentForm] = useState({ academic_year: "2026", teacher_id: "", class_id: "", subject_id: "", coefficient: "2" });
  const [scheduleForm, setScheduleForm] = useState({ teacher_id: "", classroom_id: "", subject: "", class_name: "", weekday: "1", starts_at: "08:00", ends_at: "09:00" });

  const teacherUsers = useMemo(() => catalog.users.filter((user) => user.role === "teacher"), [catalog.users]);

  async function loadCatalog() {
    if (!accessToken) return;
    setError(null);
    try {
      const [users, teachers, students, classes, subjects, assignments, classrooms, schedules] = await Promise.all([
        apiRequest<User[]>("/users", { accessToken }),
        apiRequest<Teacher[]>("/teachers", { accessToken }),
        apiRequest<Student[]>("/students", { accessToken }),
        apiRequest<SchoolClass[]>("/academic/classes", { accessToken }),
        apiRequest<Subject[]>("/academic/subjects", { accessToken }),
        apiRequest<TeachingAssignmentRead[]>("/academic/assignments", { accessToken }),
        apiRequest<Classroom[]>("/classrooms", { accessToken }),
        apiRequest<ScheduleEntry[]>("/schedules", { accessToken })
      ]);
      const fetchedTeacherUsers = users.filter((user) => user.role === "teacher");
      setCatalog({ users, teachers, students, classes, subjects, assignments, classrooms, schedules });
      setClassForm((current) => ({ ...current, responsible_teacher_id: current.responsible_teacher_id || teachers[0]?.id || "" }));
      setTeacherForm((current) => ({ ...current, user_id: current.user_id || fetchedTeacherUsers[0]?.id || "" }));
      setAssignmentForm((current) => ({
        ...current,
        teacher_id: current.teacher_id || teachers[0]?.id || "",
        class_id: current.class_id || classes[0]?.id || "",
        subject_id: current.subject_id || subjects[0]?.id || ""
      }));
      setScheduleForm((current) => ({
        ...current,
        teacher_id: current.teacher_id || teachers[0]?.id || "",
        classroom_id: current.classroom_id || classrooms[0]?.id || "",
        subject: current.subject || subjects[0]?.name || "",
        class_name: current.class_name || classes[0]?.name || ""
      }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Chargement ERP impossible");
    }
  }

  useEffect(() => {
    loadCatalog();
  }, [accessToken]);

  async function createItem(path: string, payload: object, success: string) {
    if (!accessToken) return;
    setError(null);
    try {
      await apiRequest(path, { accessToken, method: "POST", body: JSON.stringify(payload) });
      setMessage(success);
      await loadCatalog();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Action impossible");
    }
  }

  const metrics = [
    { label: "Classes", value: catalog.classes.length, icon: Layers3 },
    { label: "Professeurs", value: catalog.teachers.length, icon: GraduationCap },
    { label: "Matières", value: catalog.subjects.length, icon: BookOpen },
    { label: "Emplois du temps", value: catalog.schedules.length, icon: CalendarDays }
  ];

  return (
    <AppShell>
      <div className="grid gap-5">
        <Card>
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-600 dark:text-amber-300">ERP académique</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Gestion centrale de l’école</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-black/58 dark:text-white/58">
                Administration des utilisateurs, professeurs, classes, matières, affectations, élèves et emploi du temps avec des permissions serveur.
              </p>
            </div>
            <button onClick={loadCatalog} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-black/10 px-3 text-sm font-medium hover:bg-black/[0.04] dark:border-white/10 dark:hover:bg-white/[0.06]">
              <RefreshCw size={16} />
              Actualiser
            </button>
          </div>
        </Card>

        {error ? <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm font-medium text-red-700 dark:text-red-200">{error}</div> : null}
        {message ? <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm font-medium text-emerald-700 dark:text-emerald-200">{message}</div> : null}

        <div className="grid gap-4 md:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.label} className="flex items-center gap-3">
              <metric.icon className="text-orange-600 dark:text-amber-300" size={21} />
              <div>
                <p className="text-sm text-black/52 dark:text-white/52">{metric.label}</p>
                <p className="text-2xl font-semibold">{metric.value}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <Card>
            <h3 className="text-lg font-semibold tracking-tight">Créer un utilisateur et son rôle</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input className={fieldClass} value={userForm.username} onChange={(event) => setUserForm({ ...userForm, username: event.target.value })} placeholder="Username" />
              <input className={fieldClass} value={userForm.full_name} onChange={(event) => setUserForm({ ...userForm, full_name: event.target.value })} placeholder="Nom complet" />
              <input className={fieldClass} value={userForm.password} onChange={(event) => setUserForm({ ...userForm, password: event.target.value })} placeholder="Mot de passe" />
              <select className={fieldClass} value={userForm.role} onChange={(event) => setUserForm({ ...userForm, role: event.target.value })}>
                <option value="admin">Admin</option>
                <option value="teacher">Professeur</option>
                <option value="parent">Parent</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            <button className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-orange-600 px-3 text-sm font-medium text-white hover:bg-orange-500" onClick={() => createItem("/users", userForm, "Utilisateur créé")}>
              <Users size={16} />
              Créer l’utilisateur
            </button>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold tracking-tight">Créer une classe</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input className={fieldClass} value={classForm.academic_year} onChange={(event) => setClassForm({ ...classForm, academic_year: event.target.value })} placeholder="Année" />
              <input className={fieldClass} value={classForm.name} onChange={(event) => setClassForm({ ...classForm, name: event.target.value })} placeholder="Nom classe" />
              <select className={fieldClass} value={classForm.section} onChange={(event) => setClassForm({ ...classForm, section: event.target.value })}>
                <option value="primary">Primaire</option>
                <option value="middle_school">Collège</option>
                <option value="high_school">Lycée</option>
              </select>
              <input className={fieldClass} value={classForm.grade_level} onChange={(event) => setClassForm({ ...classForm, grade_level: event.target.value })} placeholder="Niveau" />
              <select className={fieldClass} value={classForm.responsible_teacher_id} onChange={(event) => setClassForm({ ...classForm, responsible_teacher_id: event.target.value })}>
                <option value="">Responsable</option>
                {catalog.teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.full_name}</option>)}
              </select>
              <input className={fieldClass} value={classForm.room_label} onChange={(event) => setClassForm({ ...classForm, room_label: event.target.value })} placeholder="Salle" />
            </div>
            <button className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-orange-600 px-3 text-sm font-medium text-white hover:bg-orange-500" onClick={() => createItem("/academic/classes", { ...classForm, grade_level: Number(classForm.grade_level), responsible_teacher_id: classForm.responsible_teacher_id || null }, "Classe créée")}>
              <Plus size={16} />
              Créer la classe
            </button>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold tracking-tight">Créer une matière</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input className={fieldClass} value={subjectForm.code} onChange={(event) => setSubjectForm({ ...subjectForm, code: event.target.value })} placeholder="Code" />
              <input className={fieldClass} value={subjectForm.name} onChange={(event) => setSubjectForm({ ...subjectForm, name: event.target.value })} placeholder="Matière" />
              <select className={fieldClass} value={subjectForm.section} onChange={(event) => setSubjectForm({ ...subjectForm, section: event.target.value })}>
                <option value="primary">Primaire</option>
                <option value="middle_school">Collège</option>
                <option value="high_school">Lycée</option>
              </select>
              <input className={fieldClass} value={subjectForm.default_coefficient} onChange={(event) => setSubjectForm({ ...subjectForm, default_coefficient: event.target.value })} placeholder="Coefficient" />
            </div>
            <button className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-orange-600 px-3 text-sm font-medium text-white hover:bg-orange-500" onClick={() => createItem("/academic/subjects", { ...subjectForm, default_coefficient: Number(subjectForm.default_coefficient) }, "Matière créée")}>
              <Plus size={16} />
              Créer la matière
            </button>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold tracking-tight">Créer un profil professeur</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <select className={fieldClass} value={teacherForm.user_id} onChange={(event) => setTeacherForm({ ...teacherForm, user_id: event.target.value })}>
                <option value="">Utilisateur lié</option>
                {teacherUsers.map((user) => <option key={user.id} value={user.id}>{user.full_name}</option>)}
              </select>
              <input className={fieldClass} value={teacherForm.employee_code} onChange={(event) => setTeacherForm({ ...teacherForm, employee_code: event.target.value })} placeholder="Matricule" />
              <input className={fieldClass} value={teacherForm.full_name} onChange={(event) => setTeacherForm({ ...teacherForm, full_name: event.target.value })} placeholder="Nom complet" />
              <input className={fieldClass} value={teacherForm.subjects} onChange={(event) => setTeacherForm({ ...teacherForm, subjects: event.target.value })} placeholder="Matières séparées par virgule" />
            </div>
            <button className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-orange-600 px-3 text-sm font-medium text-white hover:bg-orange-500" onClick={() => createItem("/teachers", { ...teacherForm, user_id: teacherForm.user_id || null, subjects: teacherForm.subjects.split(",").map((item) => item.trim()).filter(Boolean), status: "active" }, "Professeur créé")}>
              <Plus size={16} />
              Créer le professeur
            </button>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold tracking-tight">Inscrire un élève</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input className={fieldClass} value={studentForm.code} onChange={(event) => setStudentForm({ ...studentForm, code: event.target.value })} placeholder="Code élève" />
              <input className={fieldClass} value={studentForm.full_name} onChange={(event) => setStudentForm({ ...studentForm, full_name: event.target.value })} placeholder="Nom élève" />
              <input className={fieldClass} value={studentForm.class_name} onChange={(event) => setStudentForm({ ...studentForm, class_name: event.target.value })} placeholder="Classe" />
              <input className={fieldClass} value={studentForm.grade_level} onChange={(event) => setStudentForm({ ...studentForm, grade_level: event.target.value })} placeholder="Niveau" />
            </div>
            <button className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-orange-600 px-3 text-sm font-medium text-white hover:bg-orange-500" onClick={() => createItem("/students", { ...studentForm, grade_level: Number(studentForm.grade_level) }, "Élève inscrit")}>
              <Plus size={16} />
              Inscrire
            </button>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold tracking-tight">Affecter prof / classe / matière</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <select className={fieldClass} value={assignmentForm.teacher_id} onChange={(event) => setAssignmentForm({ ...assignmentForm, teacher_id: event.target.value })}>
                {catalog.teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.full_name}</option>)}
              </select>
              <select className={fieldClass} value={assignmentForm.class_id} onChange={(event) => setAssignmentForm({ ...assignmentForm, class_id: event.target.value })}>
                {catalog.classes.map((schoolClass) => <option key={schoolClass.id} value={schoolClass.id}>{schoolClass.name}</option>)}
              </select>
              <select className={fieldClass} value={assignmentForm.subject_id} onChange={(event) => setAssignmentForm({ ...assignmentForm, subject_id: event.target.value })}>
                {catalog.subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
              </select>
              <input className={fieldClass} value={assignmentForm.coefficient} onChange={(event) => setAssignmentForm({ ...assignmentForm, coefficient: event.target.value })} placeholder="Coeff" />
            </div>
            <button className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-orange-600 px-3 text-sm font-medium text-white hover:bg-orange-500" onClick={() => createItem("/academic/assignments", { ...assignmentForm, coefficient: Number(assignmentForm.coefficient), status: "active" }, "Affectation créée")}>
              <ShieldCheck size={16} />
              Affecter
            </button>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold tracking-tight">Créer un créneau d’emploi du temps</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <select className={fieldClass} value={scheduleForm.teacher_id} onChange={(event) => setScheduleForm({ ...scheduleForm, teacher_id: event.target.value })}>
                {catalog.teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.full_name}</option>)}
              </select>
              <select className={fieldClass} value={scheduleForm.classroom_id} onChange={(event) => setScheduleForm({ ...scheduleForm, classroom_id: event.target.value })}>
                {catalog.classrooms.map((classroom) => <option key={classroom.id} value={classroom.id}>{classroom.name}</option>)}
              </select>
              <input className={fieldClass} value={scheduleForm.subject} onChange={(event) => setScheduleForm({ ...scheduleForm, subject: event.target.value })} placeholder="Matière" />
              <input className={fieldClass} value={scheduleForm.class_name} onChange={(event) => setScheduleForm({ ...scheduleForm, class_name: event.target.value })} placeholder="Classe" />
              <input className={fieldClass} value={scheduleForm.weekday} onChange={(event) => setScheduleForm({ ...scheduleForm, weekday: event.target.value })} placeholder="Jour 1-7" />
              <div className="grid grid-cols-2 gap-2">
                <input className={fieldClass} type="time" value={scheduleForm.starts_at} onChange={(event) => setScheduleForm({ ...scheduleForm, starts_at: event.target.value })} />
                <input className={fieldClass} type="time" value={scheduleForm.ends_at} onChange={(event) => setScheduleForm({ ...scheduleForm, ends_at: event.target.value })} />
              </div>
            </div>
            <button className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-orange-600 px-3 text-sm font-medium text-white hover:bg-orange-500" onClick={() => createItem("/schedules", { ...scheduleForm, weekday: Number(scheduleForm.weekday) }, "Créneau créé")}>
              <Plus size={16} />
              Créer le créneau
            </button>
          </Card>
        </div>

        <Card>
          <h3 className="text-lg font-semibold tracking-tight">Vue opérationnelle</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[980px] border-separate border-spacing-y-2 text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.14em] text-black/45 dark:text-white/45">
                <tr>
                  <th className="px-3 py-2">Professeur</th>
                  <th className="px-3 py-2">Classe</th>
                  <th className="px-3 py-2">Matière</th>
                  <th className="px-3 py-2">Coefficient</th>
                  <th className="px-3 py-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {catalog.assignments.map((assignment) => (
                  <tr key={assignment.id} className="bg-black/[0.03] dark:bg-white/[0.04]">
                    <td className="rounded-l-lg px-3 py-3">{nameById(catalog.teachers, assignment.teacher_id, (teacher) => teacher.full_name)}</td>
                    <td className="px-3 py-3">{nameById(catalog.classes, assignment.class_id, (schoolClass) => schoolClass.name)}</td>
                    <td className="px-3 py-3">{nameById(catalog.subjects, assignment.subject_id, (subject) => subject.name)}</td>
                    <td className="px-3 py-3">{assignment.coefficient}</td>
                    <td className="rounded-r-lg px-3 py-3">{assignment.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
