export type Notification = {
    id: string; // Unique identifier for the notification
    message: string; // Notification message
    date?: string; // Optional date for the notification
    userId: string; // ID of the user receiving the notification
    read: boolean; // Indicates if the notification has been read
    type: "Booking" | "Request" | "Review"; // Type of notification
    relatedId?: string; // Optional ID of the related entity (e.g., booking, request, review)
    // This allows for flexibility in the Notification type to accommodate different types of notifications
    // and their specific requirements without breaking the type definition.
    // Add any additional fields you need
  };