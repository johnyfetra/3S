const STORAGE_KEY = "reportCards3S.v1";

const defaultData = {
  settings: {
    schoolName: "3S Academy",
    academicYear: "2026",
    passingScore: 50,
    terms: ["Term 1", "Term 2", "Term 3"]
  },
  activeTerm: "Term 1",
  subjects: [
    { id: cryptoId(), name: "Mathematics", max: 100 },
    { id: cryptoId(), name: "English", max: 100 },
    { id: cryptoId(), name: "Science", max: 100 }
  ],
  students: [],
  grades: {},
  principalComments: {}
};

let state = loadState();
let selectedStudentId = state.students[0]?.id || "";
let toastTimer = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const els = {
  pageTitle: $("#pageTitle"),
  activeTerm: $("#activeTerm"),
  printButton: $("#printButton"),
  seedDemoButton: $("#seedDemoButton"),
  studentCount: $("#studentCount"),
  subjectCount: $("#subjectCount"),
  classAverage: $("#classAverage"),
  completedGrades: $("#completedGrades"),
  recentStudents: $("#recentStudents"),
  leaderboard: $("#leaderboard"),
  studentSearch: $("#studentSearch"),
  studentsList: $("#studentsList"),
  studentForm: $("#studentForm"),
  studentId: $("#studentId"),
  studentName: $("#studentName"),
  studentCode: $("#studentCode"),
  studentClass: $("#studentClass"),
  studentSection: $("#studentSection"),
  studentGuardian: $("#studentGuardian"),
  studentRemarks: $("#studentRemarks"),
  clearStudentForm: $("#clearStudentForm"),
  subjectForm: $("#subjectForm"),
  subjectName: $("#subjectName"),
  subjectMax: $("#subjectMax"),
  subjectsList: $("#subjectsList"),
  gradeStudentSelect: $("#gradeStudentSelect"),
  gradeInputs: $("#gradeInputs"),
  reportStudentSelect: $("#reportStudentSelect"),
  principalComment: $("#principalComment"),
  saveCommentButton: $("#saveCommentButton"),
  reportSheet: $("#reportSheet"),
  exportCsvButton: $("#exportCsvButton"),
  settingsForm: $("#settingsForm"),
  schoolName: $("#schoolName"),
  academicYear: $("#academicYear"),
  passingScore: $("#passingScore"),
  termsInput: $("#termsInput"),
  exportJsonButton: $("#exportJsonButton"),
  importJsonInput: $("#importJsonInput"),
  resetButton: $("#resetButton"),
  toast: $("#toast")
};

document.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  renderAll();
});

function cryptoId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return structuredClone(defaultData);

  try {
    const parsed = JSON.parse(stored);
    return {
      ...structuredClone(defaultData),
      ...parsed,
      settings: { ...defaultData.settings, ...parsed.settings },
      subjects: parsed.subjects || [],
      students: parsed.students || [],
      grades: parsed.grades || {},
      principalComments: parsed.principalComments || {}
    };
  } catch {
    return structuredClone(defaultData);
  }
}

function saveState(message) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (message) showToast(message);
}

function bindEvents() {
  $$(".nav-tab").forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.view));
  });

  $$("[data-view-jump]").forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.viewJump));
  });

  els.activeTerm.addEventListener("change", () => {
    state.activeTerm = els.activeTerm.value;
    saveState("Term changed");
    renderAll();
  });

  els.printButton.addEventListener("click", () => {
    showView("reports");
    window.print();
  });

  els.seedDemoButton.addEventListener("click", seedDemoData);
  els.studentSearch.addEventListener("input", renderStudents);
  els.studentForm.addEventListener("submit", saveStudent);
  els.clearStudentForm.addEventListener("click", clearStudentForm);
  els.subjectForm.addEventListener("submit", saveSubject);
  els.gradeStudentSelect.addEventListener("change", () => {
    selectedStudentId = els.gradeStudentSelect.value;
    renderGradeInputs();
  });
  els.reportStudentSelect.addEventListener("change", () => {
    selectedStudentId = els.reportStudentSelect.value;
    syncSelectedStudent();
    renderReport();
  });
  els.saveCommentButton.addEventListener("click", savePrincipalComment);
  els.exportCsvButton.addEventListener("click", exportCsv);
  els.settingsForm.addEventListener("submit", saveSettings);
  els.exportJsonButton.addEventListener("click", exportJson);
  els.importJsonInput.addEventListener("change", importJson);
  els.resetButton.addEventListener("click", resetData);
}

function showView(view) {
  $$(".nav-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.view === view));
  $$(".view").forEach((panel) => panel.classList.toggle("active", panel.id === `${view}View`));
  els.pageTitle.textContent = view[0].toUpperCase() + view.slice(1);
}

function renderAll() {
  ensureActiveTerm();
  syncSelectedStudent();
  renderTermSelect();
  renderDashboard();
  renderStudents();
  renderSubjects();
  renderStudentSelects();
  renderGradeInputs();
  renderSettings();
  renderReport();
}

function ensureActiveTerm() {
  if (!state.settings.terms.includes(state.activeTerm)) {
    state.activeTerm = state.settings.terms[0] || "Term 1";
  }
}

function syncSelectedStudent() {
  if (!state.students.some((student) => student.id === selectedStudentId)) {
    selectedStudentId = state.students[0]?.id || "";
  }
  if (els.gradeStudentSelect.value !== selectedStudentId) els.gradeStudentSelect.value = selectedStudentId;
  if (els.reportStudentSelect.value !== selectedStudentId) els.reportStudentSelect.value = selectedStudentId;
}

function renderTermSelect() {
  els.activeTerm.innerHTML = state.settings.terms
    .map((term) => `<option value="${escapeHtml(term)}">${escapeHtml(term)}</option>`)
    .join("");
  els.activeTerm.value = state.activeTerm;
}

function renderDashboard() {
  const averages = state.students.map((student) => studentAverage(student.id)).filter((value) => value !== null);
  const classAverage = averages.length ? average(averages) : null;
  const possibleGrades = state.students.length * state.subjects.length;
  const enteredGrades = state.students.reduce((count, student) => {
    return count + state.subjects.filter((subject) => getGrade(student.id, subject.id) !== "").length;
  }, 0);

  els.studentCount.textContent = state.students.length;
  els.subjectCount.textContent = state.subjects.length;
  els.classAverage.textContent = classAverage === null ? "--" : `${classAverage.toFixed(1)}%`;
  els.completedGrades.textContent = possibleGrades ? `${Math.round((enteredGrades / possibleGrades) * 100)}%` : "0%";

  els.recentStudents.innerHTML = state.students.slice(0, 6).map((student) => {
    const avg = studentAverage(student.id);
    return `
      <tr>
        <td>${escapeHtml(student.name)}</td>
        <td>${escapeHtml(joinClass(student))}</td>
        <td>${avg === null ? "--" : `${avg.toFixed(1)}%`}</td>
        <td>${statusPill(avg)}</td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="4"><div class="empty-state">Add students to start the class dashboard.</div></td></tr>`;

  const ranked = [...state.students]
    .map((student) => ({ student, avg: studentAverage(student.id) }))
    .filter((entry) => entry.avg !== null)
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 5);

  els.leaderboard.innerHTML = ranked.map((entry, index) => `
    <div class="leader-row">
      <div>
        <p class="item-title">${index + 1}. ${escapeHtml(entry.student.name)}</p>
        <p class="item-meta">${escapeHtml(joinClass(entry.student))}</p>
      </div>
      <strong>${entry.avg.toFixed(1)}%</strong>
    </div>
  `).join("") || `<div class="empty-state">Top performers appear after grades are entered.</div>`;
}

function renderStudents() {
  const query = els.studentSearch.value.trim().toLowerCase();
  const students = state.students.filter((student) => {
    return [student.name, student.code, student.className, student.section]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  els.studentsList.innerHTML = students.map((student) => `
    <article class="student-item ${student.id === selectedStudentId ? "active" : ""}">
      <div>
        <p class="item-title">${escapeHtml(student.name)}</p>
        <p class="item-meta">${escapeHtml(student.code || "No ID")} · ${escapeHtml(joinClass(student))}</p>
      </div>
      <div class="mini-actions">
        <button class="icon-button" type="button" title="Select" data-select-student="${student.id}">✓</button>
        <button class="icon-button" type="button" title="Edit" data-edit-student="${student.id}">✎</button>
        <button class="icon-button" type="button" title="Delete" data-delete-student="${student.id}">×</button>
      </div>
    </article>
  `).join("") || `<div class="empty-state">No students found.</div>`;

  $$("[data-select-student]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedStudentId = button.dataset.selectStudent;
      syncSelectedStudent();
      renderAll();
      showToast("Student selected");
    });
  });
  $$("[data-edit-student]").forEach((button) => {
    button.addEventListener("click", () => fillStudentForm(button.dataset.editStudent));
  });
  $$("[data-delete-student]").forEach((button) => {
    button.addEventListener("click", () => deleteStudent(button.dataset.deleteStudent));
  });
}

function renderSubjects() {
  els.subjectsList.innerHTML = state.subjects.map((subject) => `
    <article class="subject-item">
      <div>
        <p class="item-title">${escapeHtml(subject.name)}</p>
        <p class="item-meta">Maximum score: ${Number(subject.max) || 100}</p>
      </div>
      <button class="icon-button" type="button" title="Delete subject" data-delete-subject="${subject.id}">×</button>
    </article>
  `).join("") || `<div class="empty-state">Add subjects before entering grades.</div>`;

  $$("[data-delete-subject]").forEach((button) => {
    button.addEventListener("click", () => deleteSubject(button.dataset.deleteSubject));
  });
}

function renderStudentSelects() {
  const options = state.students.map((student) => `<option value="${student.id}">${escapeHtml(student.name)}</option>`).join("");
  const empty = `<option value="">No students yet</option>`;
  els.gradeStudentSelect.innerHTML = options || empty;
  els.reportStudentSelect.innerHTML = options || empty;
  els.gradeStudentSelect.value = selectedStudentId;
  els.reportStudentSelect.value = selectedStudentId;
}

function renderGradeInputs() {
  const student = state.students.find((item) => item.id === selectedStudentId);
  if (!student) {
    els.gradeInputs.innerHTML = `<div class="empty-state">Choose or add a student to enter scores.</div>`;
    return;
  }

  els.gradeInputs.innerHTML = state.subjects.map((subject) => `
    <div class="grade-row">
      <label>
        ${escapeHtml(subject.name)}
        <input
          type="number"
          min="0"
          max="${Number(subject.max) || 100}"
          value="${escapeHtml(getGrade(student.id, subject.id))}"
          data-grade-subject="${subject.id}"
          aria-label="${escapeHtml(subject.name)} score"
        >
      </label>
      <span class="item-meta">out of ${Number(subject.max) || 100}</span>
    </div>
  `).join("") || `<div class="empty-state">Add subjects to build the grade book.</div>`;

  $$("[data-grade-subject]").forEach((input) => {
    input.addEventListener("input", () => saveGrade(student.id, input.dataset.gradeSubject, input.value));
  });
}

function renderSettings() {
  els.schoolName.value = state.settings.schoolName;
  els.academicYear.value = state.settings.academicYear;
  els.passingScore.value = state.settings.passingScore;
  els.termsInput.value = state.settings.terms.join(", ");
}

function renderReport() {
  const student = state.students.find((item) => item.id === selectedStudentId);
  if (!student) {
    els.principalComment.value = "";
    els.reportSheet.innerHTML = `<div class="empty-state">Select a student to preview a report card.</div>`;
    return;
  }

  const principalKey = commentKey(student.id);
  els.principalComment.value = state.principalComments[principalKey] || "";
  const avg = studentAverage(student.id);
  const rows = state.subjects.map((subject) => {
    const raw = getGrade(student.id, subject.id);
    const percentage = raw === "" ? null : (Number(raw) / (Number(subject.max) || 100)) * 100;
    return `
      <tr>
        <td>${escapeHtml(subject.name)}</td>
        <td>${raw === "" ? "--" : escapeHtml(raw)}</td>
        <td>${Number(subject.max) || 100}</td>
        <td>${percentage === null ? "--" : `${percentage.toFixed(1)}%`}</td>
        <td>${statusPill(percentage)}</td>
      </tr>
    `;
  }).join("");

  els.reportSheet.innerHTML = `
    <div class="report-head">
      <div>
        <p class="eyebrow">Official report card</p>
        <h2>${escapeHtml(state.settings.schoolName)}</h2>
        <div class="report-meta">
          <span>${escapeHtml(state.activeTerm)} · ${escapeHtml(state.settings.academicYear)}</span>
          <span>${escapeHtml(student.name)} · ${escapeHtml(student.code || "No student ID")}</span>
          <span>${escapeHtml(joinClass(student))}</span>
        </div>
      </div>
      <div class="status-pill ${avg === null ? "status-empty" : avg >= state.settings.passingScore ? "status-pass" : "status-risk"}">
        ${avg === null ? "Pending" : avg >= state.settings.passingScore ? "Promising" : "Needs support"}
      </div>
    </div>
    <div class="report-summary">
      <div class="summary-box"><span>Average</span><strong>${avg === null ? "--" : `${avg.toFixed(1)}%`}</strong></div>
      <div class="summary-box"><span>Grade</span><strong>${letterGrade(avg)}</strong></div>
      <div class="summary-box"><span>Result</span><strong>${avg === null ? "Pending" : avg >= state.settings.passingScore ? "Pass" : "Review"}</strong></div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Subject</th>
          <th>Score</th>
          <th>Max</th>
          <th>Percent</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>${rows || `<tr><td colspan="5">No subjects have been added.</td></tr>`}</tbody>
    </table>
    <div class="remarks-grid">
      <div class="remark-box">
        <h4>Teacher remarks</h4>
        <p>${escapeHtml(student.remarks || "No teacher remarks yet.")}</p>
      </div>
      <div class="remark-box">
        <h4>Principal comment</h4>
        <p>${escapeHtml(state.principalComments[principalKey] || "No principal comment yet.")}</p>
      </div>
    </div>
  `;
}

function saveStudent(event) {
  event.preventDefault();
  const id = els.studentId.value || cryptoId();
  const student = {
    id,
    name: els.studentName.value.trim(),
    code: els.studentCode.value.trim(),
    className: els.studentClass.value.trim(),
    section: els.studentSection.value.trim(),
    guardian: els.studentGuardian.value.trim(),
    remarks: els.studentRemarks.value.trim()
  };

  if (!student.name) return;

  const existingIndex = state.students.findIndex((item) => item.id === id);
  if (existingIndex >= 0) state.students[existingIndex] = student;
  else state.students.unshift(student);

  selectedStudentId = id;
  clearStudentForm();
  saveState("Student saved");
  renderAll();
}

function fillStudentForm(id) {
  const student = state.students.find((item) => item.id === id);
  if (!student) return;
  els.studentId.value = student.id;
  els.studentName.value = student.name;
  els.studentCode.value = student.code || "";
  els.studentClass.value = student.className || "";
  els.studentSection.value = student.section || "";
  els.studentGuardian.value = student.guardian || "";
  els.studentRemarks.value = student.remarks || "";
}

function clearStudentForm() {
  els.studentForm.reset();
  els.studentId.value = "";
}

function deleteStudent(id) {
  const student = state.students.find((item) => item.id === id);
  if (!student || !confirm(`Delete ${student.name} and their grades?`)) return;
  state.students = state.students.filter((item) => item.id !== id);
  delete state.grades[id];
  Object.keys(state.principalComments).forEach((key) => {
    if (key.startsWith(`${id}::`)) delete state.principalComments[key];
  });
  saveState("Student deleted");
  renderAll();
}

function saveSubject(event) {
  event.preventDefault();
  const name = els.subjectName.value.trim();
  const max = Number(els.subjectMax.value) || 100;
  if (!name) return;
  state.subjects.push({ id: cryptoId(), name, max });
  els.subjectForm.reset();
  els.subjectMax.value = 100;
  saveState("Subject added");
  renderAll();
}

function deleteSubject(id) {
  const subject = state.subjects.find((item) => item.id === id);
  if (!subject || !confirm(`Delete ${subject.name} from all report cards?`)) return;
  state.subjects = state.subjects.filter((item) => item.id !== id);
  Object.values(state.grades).forEach((studentTerms) => {
    Object.values(studentTerms).forEach((termGrades) => delete termGrades[id]);
  });
  saveState("Subject deleted");
  renderAll();
}

function saveGrade(studentId, subjectId, value) {
  const subject = state.subjects.find((item) => item.id === subjectId);
  const max = Number(subject?.max) || 100;
  const numberValue = value === "" ? "" : Math.max(0, Math.min(max, Number(value)));

  state.grades[studentId] ||= {};
  state.grades[studentId][state.activeTerm] ||= {};
  state.grades[studentId][state.activeTerm][subjectId] = numberValue;
  saveState();
  renderDashboard();
  renderReport();
}

function savePrincipalComment() {
  if (!selectedStudentId) return;
  state.principalComments[commentKey(selectedStudentId)] = els.principalComment.value.trim();
  saveState("Comment saved");
  renderReport();
}

function saveSettings(event) {
  event.preventDefault();
  const terms = els.termsInput.value.split(",").map((term) => term.trim()).filter(Boolean);
  state.settings = {
    schoolName: els.schoolName.value.trim() || "School",
    academicYear: els.academicYear.value.trim() || new Date().getFullYear().toString(),
    passingScore: Number(els.passingScore.value) || 50,
    terms: terms.length ? terms : ["Term 1"]
  };
  ensureActiveTerm();
  saveState("Settings saved");
  renderAll();
}

function getGrade(studentId, subjectId) {
  return state.grades[studentId]?.[state.activeTerm]?.[subjectId] ?? "";
}

function studentAverage(studentId) {
  const percentages = state.subjects
    .map((subject) => {
      const raw = getGrade(studentId, subject.id);
      if (raw === "") return null;
      return (Number(raw) / (Number(subject.max) || 100)) * 100;
    })
    .filter((value) => value !== null && !Number.isNaN(value));

  return percentages.length ? average(percentages) : null;
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function statusPill(value) {
  if (value === null || Number.isNaN(value)) return `<span class="status-pill status-empty">Pending</span>`;
  if (value >= state.settings.passingScore) return `<span class="status-pill status-pass">Pass</span>`;
  return `<span class="status-pill status-risk">Review</span>`;
}

function letterGrade(value) {
  if (value === null || Number.isNaN(value)) return "--";
  if (value >= 90) return "A";
  if (value >= 80) return "B";
  if (value >= 70) return "C";
  if (value >= 60) return "D";
  return "E";
}

function joinClass(student) {
  return [student.className || "Unassigned", student.section].filter(Boolean).join(" ");
}

function commentKey(studentId) {
  return `${studentId}::${state.activeTerm}`;
}

function exportCsv() {
  const rows = [
    ["Student", "Student ID", "Class", "Term", "Subject", "Score", "Max", "Percent"]
  ];

  state.students.forEach((student) => {
    state.subjects.forEach((subject) => {
      const raw = getGrade(student.id, subject.id);
      const percent = raw === "" ? "" : ((Number(raw) / (Number(subject.max) || 100)) * 100).toFixed(1);
      rows.push([student.name, student.code || "", joinClass(student), state.activeTerm, subject.name, raw, subject.max, percent]);
    });
  });

  downloadFile(`report-cards-${state.activeTerm}.csv`, rows.map(toCsvRow).join("\n"), "text/csv");
  showToast("CSV exported");
}

function exportJson() {
  downloadFile("report-cards-backup.json", JSON.stringify(state, null, 2), "application/json");
  showToast("Backup exported");
}

function importJson(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      state = { ...structuredClone(defaultData), ...imported };
      selectedStudentId = state.students[0]?.id || "";
      saveState("Backup imported");
      renderAll();
    } catch {
      showToast("Import failed");
    }
    event.target.value = "";
  };
  reader.readAsText(file);
}

function resetData() {
  if (!confirm("Clear every student, subject, grade, and setting stored in this browser?")) return;
  state = structuredClone(defaultData);
  selectedStudentId = "";
  saveState("Local data cleared");
  renderAll();
}

function seedDemoData() {
  const math = state.subjects[0]?.id || cryptoId();
  const english = state.subjects[1]?.id || cryptoId();
  const science = state.subjects[2]?.id || cryptoId();
  state.subjects = [
    { id: math, name: "Mathematics", max: 100 },
    { id: english, name: "English", max: 100 },
    { id: science, name: "Science", max: 100 },
    { id: cryptoId(), name: "History", max: 100 }
  ];
  state.students = [
    { id: cryptoId(), name: "Amina Rahman", code: "S-001", className: "Grade 8", section: "A", guardian: "Nadia Rahman", remarks: "Works carefully and participates with confidence." },
    { id: cryptoId(), name: "Jonas Lee", code: "S-002", className: "Grade 8", section: "A", guardian: "Mina Lee", remarks: "Strong reasoning skills with steady class effort." },
    { id: cryptoId(), name: "Maya Stone", code: "S-003", className: "Grade 8", section: "B", guardian: "Alex Stone", remarks: "Creative, attentive, and improving in written work." }
  ];
  state.grades = {};
  state.students.forEach((student, index) => {
    state.grades[student.id] = {
      [state.activeTerm]: {}
    };
    state.subjects.forEach((subject, subjectIndex) => {
      state.grades[student.id][state.activeTerm][subject.id] = Math.min(100, 72 + index * 6 + subjectIndex * 3);
    });
  });
  selectedStudentId = state.students[0].id;
  saveState("Demo data loaded");
  renderAll();
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function toCsvRow(row) {
  return row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("show");
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2200);
}
