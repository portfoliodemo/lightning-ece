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

  /** Optional start and end time for the shift (HH:mm format) */
  startTime?: string;
  endTime?: string;

  /** Optional alias for createdAt used by some UIs */
  timestamp?: string;
}







// // src/types/Request.ts

// /** All valid states for a booking request. */
// export const REQUEST_STATUSES = [
//     "Pending",
//     "Accepted",
//     "Declined",
//     "Cancelled",
//     "Completed",
//     "Expired",
//   ] as const;
  
// export type RequestStatus = typeof REQUEST_STATUSES[number];

// /**
//  * A request created by a Childcare Centre and sent to an ECE.
//  * We keep a minimal core (ids, status, timestamps) and allow
//  * a few denormalized fields for easy rendering in dashboards.
//  */
// export interface EceRequest {
//   /** Unique identifier for the request */
//   id: string;

//   /** ID of the targeted ECE user */
//   eceId: string;

//   /** ID of the Childcare Centre that created the request */
//   centreId: string;

//   /** Status of the request's lifecycle */
//   status: RequestStatus;

//   /** ISO datetime when the request was created */
//   createdAt: string;

//   /** ISO datetime when the request last changed (optional) */
//   updatedAt?: string;

//   /** Optional date (ISO) that the centre is requesting */
//   date?: string;

//   /** Optional message from the centre to the ECE */
//   message?: string;

//   /**
//    * Denormalized display fields to avoid extra lookups in UI.
//    * These are optional and can be filled at creation time.
//    */
//   centreName?: string;
//   eceName?: string;

//   /** Optional alias for createdAt used by some UIs */
//   timestamp?: string;
// }
