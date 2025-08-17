export type Review = {
    reviewer: string; // Name of the reviewer
    comment: string; // Review comment
    rating: number; // Rating given by the reviewer
    date: string; // Date of the review
    eceId: string; // ID of the ECE user being reviewed
    centreId?: string; // Optional ID of the childcare centre being reviewed
  };