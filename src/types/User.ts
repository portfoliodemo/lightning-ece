export type UserRole = "ECE" | "Childcare Centre" | "Admin";

// This type defines the base structure for a user in the application.
export type BaseUser = {
  id: string; // Unique identifier for the user
  firstName: string;
  lastName: string;
  fullName: string; // Full name of the user
  email: string;
  password: string;
  role: UserRole;
};