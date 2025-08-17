export type UserRole = "ECE" | "Childcare Centre";

export type BaseUser = {
  id: string; // Unique identifier for the user
  firstName: string;
  lastName: string;
  fullName: string; // Full name of the user
  email: string;
  password: string;
  role: UserRole;
};