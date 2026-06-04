export type UserRole = "candidate" | "employer";

export type Profile = {
  id: string;
  role: UserRole;
  fullName: string | null;
  email: string | null;
  avatarUrl: string | null;
  createdAt: string;
};
