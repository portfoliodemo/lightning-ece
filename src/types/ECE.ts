import type { BaseUser } from "./User";

export type ECEUser = BaseUser & {
    role: "ECE";
    available?: boolean; 
    qualifications?: string[];
    certificates?: string[]; // Optional field for ECE-specific certificates
    bio?: string; // Optional biography or description
    profilePicture?: string; // Optional URL for the profile picture
    phone?: string; // Optional phone number
    address?: string; // Optional address

    // availability?: {
    //   [day: string]: { start: string; end: string } | null; // Availability for each day of the week
    //   // Example: { monday: { start: "9:00 AM", end: "5:00 PM" }, tuesday: { start: "9:00 AM", end: "5:00 PM" } }
    // };
      // ratings?: number;
    // reviews?: {
    //   reviewer: string;
    //   comment: string;
    //   rating: number;
    //   date: string;
    // }[];
    // notifications?: {
    //   id: string; // Unique identifier for the notification
    //   message: string; // Notification message
    //   date?: string; // Optional date for the notification
    // }[];
  };

  // End of ECEUser type