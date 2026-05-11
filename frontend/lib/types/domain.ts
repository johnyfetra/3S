export type Role = "super_admin" | "admin" | "teacher" | "parent";

export type UserSession = {
  accessToken: string;
  refreshToken: string;
  role: Role;
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

