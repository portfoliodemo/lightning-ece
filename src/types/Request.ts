// src/types/Request.ts

/** All valid states for a booking request. */
export const REQUEST_STATUSES = [
    "Pending",
    "Accepted",
    "Declined",
    "Cancelled",
    "Completed",
    "Expired",
  ] as const;
  
  export type RequestStatus = typeof REQUEST_STATUSES[number];
  
  /**
   * A request created by a Childcare Centre and sent to an ECE.
   * We keep a minimal core (ids, status, timestamps) and allow
   * a few denormalized fields for easy rendering in dashboards.
   */
  export interface EceRequest {
    /** Unique identifier for the request */
    id: string;
  
    /** ID of the targeted ECE user */
    eceId: string;
  
    /** ID of the Childcare Centre that created the request */
    centreId: string;
  
    /** Status of the request's lifecycle */
    status: RequestStatus;
  
    /** ISO datetime when the request was created */
    createdAt: string;
  
    /** ISO datetime when the request last changed (optional) */
    updatedAt?: string;
  
    /** Optional date (ISO) that the centre is requesting */
    date?: string;
  
    /** Optional message from the centre to the ECE */
    message?: string;
  
    /**
     * Denormalized display fields to avoid extra lookups in UI.
     * These are optional and can be filled at creation time.
     */
    centreName?: string;
    eceName?: string;
  
    /** Optional alias for createdAt used by some UIs */
    timestamp?: string;
  }
  


// Version 1 

// export type RequestStatus = "Pending" | "Accepted" | "Declined" | "Cancelled" | "Completed" | "Expired";

// // This type defines the structure for a request made by an ECE user to book a childcare centre.
// export type EceRequest = { 
//     id: string; // Unique identifier for the request
//     eceId: string; // ID of the ECE user
//     centreId: string; // ID of the childcare centre
//     createdAt: string; // Date when the request was created
//     updatedAt?: string; // Optional date when the request was last updated
//     status: RequestStatus;  // Status of the request (Pending, Accepted, Declined, Cancelled)
//     date?: string; // Date for the requested booking
//     message?: string; // Optional message or note for the request
//     centreName?: string; // Optional name of the childcare centre
//     timestamp?: string; // Optional timestamp of the request creation
//     // eceName?: string; // Optional name of the ECE user making the request
// };