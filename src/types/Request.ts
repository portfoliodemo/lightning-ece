export type RequestStatus = "Pending" | "Accepted" | "Declined" | "Cancelled" | "Completed" | "Expired";

// This type defines the structure for a request made by an ECE user to book a childcare centre.
export type EceRequest = { 
    id: string; // Unique identifier for the request
    eceId: string; // ID of the ECE user
    centreId: string; // ID of the childcare centre
    createdAt: string; // Date when the request was created
    updatedAt?: string; // Optional date when the request was last updated
    status: RequestStatus;  // Status of the request (Pending, Accepted, Declined, Cancelled)
    date?: string; // Date for the requested booking
    message?: string; // Optional message or note for the request
    // centreName?: string; // Optional name of the childcare centre
    // eceName?: string; // Optional name of the ECE user making the request
};