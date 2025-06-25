export type User = {
  fullName: string;
  email: string;
  password: string;
  role: "ECE" | "Childcare Centre";
  available?: boolean;
};


// Potential User Fields
// export type User = {
//   fullName: string;
//   email: string;
//   password: string;
//   role: "ECE" | "Childcare Centre";
//   available?: boolean;
//   availability?: {
//     monday?: string;
//     tuesday?: string;
//     wednesday?: string;
//     thursday?: string;
//     friday?: string;
//     saturday?: string;
//     sunday?: string;
//   };
//   qualifications?: string[];
//   ratings?: number;
//   reviews?: {
//     reviewer: string;
//     comment: string;
//     rating: number;
//     date: string;
//   }[];
//   bookings?: {
//     bookingId: string;  // Unique identifier for the booking  
//     date: string;      // Date of the booking
//     time: string;      // Time of the booking
//     status: "confirmed" | "pending" | "cancelled"; // Status of the booking
//   }[];
//   notifications?: {
//     id: string;        // Unique identifier for the notification
//     message: string;  // Notification message
//     date?: string;    // Optional date for the notification
//   }[];
//   id?: string;        // Unique identifier for the user
//   phone?: string;     // Optional phone number
//   address?: string;  // Optional address
//   profilePicture?: string; // Optional URL for the profile picture
//   bio?: string;       // Optional biography or description
//   [key: string]: any; // Allows for additional fields if needed
//   // This allows for flexibility in the User type to accommodate future changes
//   // and additional properties without breaking the type definition.
//   // Add any additional fields you need
// };