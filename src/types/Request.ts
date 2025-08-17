export type Request = { 
    id: string; // Unique identifier for the request
    eceId: string; // ID of the ECE user
    centreId: string; // ID of the childcare centre
    createdAt: Date; // Date when the request was created
    updatedAt?: Date; // Optional date when the request was last updated
    status: "Pending" | "Accepted" | "Declined"; // Status of the request};
};