export type Role = "super_admin" | "admin" | "teacher" | "parent";

export type UserSession = {
  accessToken: string;
  refreshToken: string;
  role: Role;
  fullName: string;
  forcePasswordReset: boolean;
};

export type PresenceUser = {
  id: string;
  name: string;
  role: Role;
  status: "online" | "idle" | "offline";
  loggedInAt: string;
  sessionDuration: string;
  location: string;
};

export type Bimester = 1 | 2 | 3 | 4 | 5;

export type Mention = "A+" | "A" | "B+" | "B" | "C+" | "C" | "D" | "F";

export type ReportCardSubject = {
  subject: string;
  testScore: number;
  examScore: number;
  average: number;
  coefficient: number;
  weightedScore: number;
  remark: string;
  mention: Mention;
};

export type SchoolSection = "primary" | "middle_school" | "high_school";

export type Student = {
  id: string;
  code: string;
  full_name: string;
  section: SchoolSection;
  grade_level: number;
  class_name: string;
  guardian_name?: string | null;
};

export type TeacherAssignment = {
  assignment_id: string;
  academic_year: string;
  class_id: string;
  class_name: string;
  grade_level: number;
  section: SchoolSection;
  subject_id: string;
  subject_name: string;
  coefficient: string;
  is_class_responsible: boolean;
  students: Student[];
};

export type GradeEntry = {
  id: string;
  student_id: string;
  assignment_id: string;
  academic_year: string;
  bimester: number;
  test_score: string;
  exam_score: string;
  average: string;
  coefficient: string;
  weighted_score: string;
  mention: Mention;
  teacher_remark?: string | null;
  status: "draft" | "submitted" | "locked";
};

export type User = {
  id: string;
  username: string;
  full_name: string;
  role: Role;
  status: "active" | "blocked";
  force_password_reset: boolean;
  last_seen_at?: string | null;
};

export type Teacher = {
  id: string;
  user_id?: string | null;
  employee_code: string;
  full_name: string;
  subjects: string[];
  phone?: string | null;
  current_location?: string | null;
  status: string;
};

export type SchoolClass = {
  id: string;
  academic_year: string;
  name: string;
  section: SchoolSection;
  grade_level: number;
  responsible_teacher_id?: string | null;
  room_label?: string | null;
};

export type Subject = {
  id: string;
  code: string;
  name: string;
  section?: SchoolSection | null;
  default_coefficient: string;
};

export type TeachingAssignmentRead = {
  id: string;
  academic_year: string;
  teacher_id: string;
  class_id: string;
  subject_id: string;
  coefficient: string;
  status: "active" | "archived";
};

export type Classroom = {
  id: string;
  name: string;
  capacity: number;
  building?: string | null;
};

export type ScheduleEntry = {
  id: string;
  teacher_id: string;
  classroom_id: string;
  subject: string;
  class_name: string;
  weekday: number;
  starts_at: string;
  ends_at: string;
};
