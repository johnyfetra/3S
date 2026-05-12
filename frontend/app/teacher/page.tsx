"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, CheckCircle2, ClipboardList, Save, ShieldCheck, Users } from "lucide-react";
import { AppShell } from "@/components/layouts/app-shell";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { GradeEntry, TeacherAssignment } from "@/lib/types/domain";

type DraftGrade = {
  test_score: string;
  exam_score: string;
  teacher_remark: string;
};

function calculateAverage(testScore: string, examScore: string) {
  const ds = Number(testScore || 0);
  const exam = Number(examScore || 0);
  return ((ds + exam) / 3).toFixed(2);
}

export default function TeacherPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const username = useAuthStore((state) => state.username);
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
  const [bimester, setBimester] = useState(1);
  const [grades, setGrades] = useState<GradeEntry[]>([]);
  const [drafts, setDrafts] = useState<Record<string, DraftGrade>>({});
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedAssignment = useMemo(
    () => assignments.find((assignment) => assignment.assignment_id === selectedAssignmentId),
    [assignments, selectedAssignmentId]
  );

  useEffect(() => {
    if (!accessToken) return;
    let mounted = true;
    apiRequest<TeacherAssignment[]>("/teacher-workspace/me", { accessToken })
      .then((items) => {
        if (!mounted) return;
        setAssignments(items);
        setSelectedAssignmentId(items[0]?.assignment_id ?? "");
      })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Chargement impossible"));
    return () => {
      mounted = false;
    };
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken || !selectedAssignmentId) return;
    apiRequest<GradeEntry[]>(`/teacher-workspace/grades?assignment_id=${selectedAssignmentId}&bimester=${bimester}`, {
      accessToken
    })
      .then((items) => {
        setGrades(items);
        setDrafts(
          Object.fromEntries(
            items.map((grade) => [
              grade.student_id,
              {
                test_score: String(grade.test_score),
                exam_score: String(grade.exam_score),
                teacher_remark: grade.teacher_remark ?? ""
              }
            ])
          )
        );
      })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Notes indisponibles"));
  }, [accessToken, selectedAssignmentId, bimester]);

  async function saveGrade(studentId: string) {
    if (!selectedAssignment || !accessToken) return;
    const draft = drafts[studentId];
    if (!draft?.test_score || !draft?.exam_score) {
      setError("DS et examen sont obligatoires pour enregistrer une note.");
      return;
    }
    setError(null);
    setStatus("Enregistrement en cours...");
    try {
      const saved = await apiRequest<GradeEntry>("/teacher-workspace/grades", {
        accessToken,
        method: "POST",
        body: JSON.stringify({
          student_id: studentId,
          assignment_id: selectedAssignment.assignment_id,
          academic_year: selectedAssignment.academic_year,
          bimester,
          test_score: Number(draft.test_score),
          exam_score: Number(draft.exam_score),
          teacher_remark: draft.teacher_remark,
          status: "draft"
        })
      });
      setGrades((current) => [saved, ...current.filter((grade) => grade.student_id !== studentId)]);
      setStatus("Note enregistrée.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Enregistrement impossible");
      setStatus(null);
    }
  }

  return (
    <AppShell>
      <div className="grid gap-5">
        <Card className="overflow-hidden">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-600 dark:text-amber-300">Espace enseignant</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Saisie des notes par classe et matière</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-black/58 dark:text-white/58">
                Chaque enseignant voit uniquement ses affectations. Une classe garde un seul responsable, tandis qu’une matière peut être partagée par plusieurs enseignants.
              </p>
            </div>
            <div className="grid gap-2 rounded-lg border border-black/10 bg-black/[0.03] p-3 text-sm dark:border-white/10 dark:bg-white/[0.04]">
              <span className="text-black/50 dark:text-white/50">Connecté</span>
              <span className="font-medium">{username ?? "teacher.john"}</span>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <label className="grid gap-2 text-sm font-medium text-black/62 dark:text-white/62">
              Classe et matière
              <select
                className="min-h-11 rounded-lg border border-black/10 bg-white px-3 text-black outline-none transition focus:border-orange-500 dark:border-white/10 dark:bg-white/[0.06] dark:text-white"
                value={selectedAssignmentId}
                onChange={(event) => setSelectedAssignmentId(event.target.value)}
              >
                {assignments.map((assignment) => (
                  <option key={assignment.assignment_id} value={assignment.assignment_id}>
                    {assignment.class_name} - {assignment.subject_name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-black/62 dark:text-white/62">
              Bimestre
              <select
                className="min-h-11 rounded-lg border border-black/10 bg-white px-3 text-black outline-none transition focus:border-orange-500 dark:border-white/10 dark:bg-white/[0.06] dark:text-white"
                value={bimester}
                onChange={(event) => setBimester(Number(event.target.value))}
              >
                {[1, 2, 3, 4, 5].map((item) => (
                  <option key={item} value={item}>
                    Bimestre {item}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid content-end">
              <div className="flex min-h-11 items-center gap-2 rounded-lg border border-orange-500/20 bg-orange-500/10 px-3 text-sm font-medium text-orange-700 dark:text-amber-200">
                <ShieldCheck size={18} />
                {selectedAssignment?.is_class_responsible ? "Responsable de cette classe" : "Professeur affecté"}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="flex items-center gap-3">
            <Users className="text-orange-600 dark:text-amber-300" size={22} />
            <div>
              <p className="text-sm text-black/52 dark:text-white/52">Élèves</p>
              <p className="text-xl font-semibold">{selectedAssignment?.students.length ?? 0}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <BookOpen className="text-orange-600 dark:text-amber-300" size={22} />
            <div>
              <p className="text-sm text-black/52 dark:text-white/52">Matière</p>
              <p className="text-xl font-semibold">{selectedAssignment?.subject_name ?? "-"}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <ClipboardList className="text-orange-600 dark:text-amber-300" size={22} />
            <div>
              <p className="text-sm text-black/52 dark:text-white/52">Notes saisies</p>
              <p className="text-xl font-semibold">{grades.length}</p>
            </div>
          </Card>
        </div>

        <Card>
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Carnet de notes</h2>
              <p className="mt-1 text-sm text-black/52 dark:text-white/52">DS sur 20, examen sur 40, moyenne automatiquement ramenée sur 20.</p>
            </div>
            {status ? (
              <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 size={16} />
                {status}
              </span>
            ) : null}
          </div>

          {error ? <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm font-medium text-red-700 dark:text-red-200">{error}</div> : null}

          {!accessToken ? (
            <div className="rounded-lg border border-orange-500/20 bg-orange-500/10 p-4 text-sm text-orange-800 dark:text-amber-200">
              Connecte-toi avec <span className="font-semibold">teacher.john</span> / <span className="font-semibold">Teacher123!</span> pour tester la saisie réelle.
            </div>
          ) : null}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] border-separate border-spacing-y-2 text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.14em] text-black/45 dark:text-white/45">
                <tr>
                  <th className="px-3 py-2 font-semibold">Élève</th>
                  <th className="px-3 py-2 font-semibold">DS /20</th>
                  <th className="px-3 py-2 font-semibold">Examen /40</th>
                  <th className="px-3 py-2 font-semibold">Moyenne</th>
                  <th className="px-3 py-2 font-semibold">Coeff</th>
                  <th className="px-3 py-2 font-semibold">Observation</th>
                  <th className="px-3 py-2 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {(selectedAssignment?.students ?? []).map((student) => {
                  const existing = grades.find((grade) => grade.student_id === student.id);
                  const draft = drafts[student.id] ?? {
                    test_score: existing?.test_score ?? "",
                    exam_score: existing?.exam_score ?? "",
                    teacher_remark: existing?.teacher_remark ?? ""
                  };
                  return (
                    <tr key={student.id} className="rounded-lg bg-black/[0.03] dark:bg-white/[0.04]">
                      <td className="rounded-l-lg px-3 py-3">
                        <p className="font-medium">{student.full_name}</p>
                        <p className="text-xs text-black/45 dark:text-white/45">{student.code}</p>
                      </td>
                      <td className="px-3 py-3">
                        <input
                          className="h-10 w-24 rounded-lg border border-black/10 bg-white px-3 outline-none focus:border-orange-500 dark:border-white/10 dark:bg-black/20"
                          inputMode="decimal"
                          value={draft.test_score}
                          onChange={(event) =>
                            setDrafts((current) => ({ ...current, [student.id]: { ...draft, test_score: event.target.value } }))
                          }
                        />
                      </td>
                      <td className="px-3 py-3">
                        <input
                          className="h-10 w-24 rounded-lg border border-black/10 bg-white px-3 outline-none focus:border-orange-500 dark:border-white/10 dark:bg-black/20"
                          inputMode="decimal"
                          value={draft.exam_score}
                          onChange={(event) =>
                            setDrafts((current) => ({ ...current, [student.id]: { ...draft, exam_score: event.target.value } }))
                          }
                        />
                      </td>
                      <td className="px-3 py-3 font-medium">{draft.test_score && draft.exam_score ? calculateAverage(draft.test_score, draft.exam_score) : existing?.average ?? "-"}</td>
                      <td className="px-3 py-3">{selectedAssignment?.coefficient ?? "-"}</td>
                      <td className="px-3 py-3">
                        <input
                          className="h-10 w-full rounded-lg border border-black/10 bg-white px-3 outline-none focus:border-orange-500 dark:border-white/10 dark:bg-black/20"
                          value={draft.teacher_remark}
                          onChange={(event) =>
                            setDrafts((current) => ({ ...current, [student.id]: { ...draft, teacher_remark: event.target.value } }))
                          }
                        />
                      </td>
                      <td className="rounded-r-lg px-3 py-3">
                        <button
                          type="button"
                          onClick={() => saveGrade(student.id)}
                          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-orange-600 px-3 text-sm font-medium text-white transition hover:bg-orange-500"
                        >
                          <Save size={16} />
                          Enregistrer
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
