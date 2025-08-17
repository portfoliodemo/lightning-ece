import type { BaseUser } from "./User";

export type ChildcareCentreUser = BaseUser & {
    role: "Childcare Centre";
    centreName: string; // Name of the childcare centre
    location: string; // Location of the childcare centre
  };