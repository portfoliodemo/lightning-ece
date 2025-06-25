import type { User } from '../types/User';

export const mockEces: User[] = [
  {
    fullName: 'Alice Johnson',
    email: 'alice@wonderland.com',
    password: 'password123',
    role: 'ECE',
    available: true,
  },
  {
    fullName: 'Bob Smith',
    email: 'bobsmitty@email.com',
    password: 'heybob11',
    role: 'ECE',
    available: false,
  },
  {
    fullName: 'Charlie Brown',
    email: 'snoopy@redbaron.com',
    password: 'charlie123',
    role: 'ECE',
    available: true,
  },
];

// Mock ECE user list 
// export const mockEces: User[] = [
//   {
//     id: '1',
//     fullName: 'Alice Johnson',
//     email: 'alice@daycaredreamer.com',
//     password: 'password123',
//     role: 'ECE',
//     phone: '123-456-7890',
//     address: '123 Dreamland Ave, Wonderland',
//     profilePicture: 'https://example.com/profile-pic-alice.jpg',
//     bio: 'Passionate ECE with 5 years of experience in early childhood education.',
//     available: true,
//     availability: {
//       monday: '9:00 AM - 5:00 PM',
//       tuesday: '9:00 AM - 5:00 PM',
//       wednesday: '9:00 AM - 5:00 PM',
//       thursday: '9:00 AM - 5:00 PM',
//       friday: '9:00 AM - 5:00 PM',
//       saturday: '10:00 AM - 2:00 PM',
//       sunday: 'Unavailable',
//     },
//     qualifications: [
//       'Bachelor of Early Childhood Education',
//       'Certified in First Aid and CPR',
//       'Specialized in Child Development',
//     ],
//     ratings: 4.8,
//     reviews: [
//       {
//         reviewer: 'Little Hands Montessori',
//         comment: 'Alice is fantastic with our daycare centre! Highly recommend her.',
//         rating: 5,
//         date: '2023-10-01',
//         },
//     ],
//     bookings: [
//       {
//         bookingId: 'b1',
//         childcareCentre: 'Little Hands',
//         date: '2023-10-15',
//         time: '9:00 AM - 1:00 PM',
//         status: 'confirmed',
//       },
//       {
//         bookingId: 'b2',
//         childcareCentre: 'Tiny Tots',
//         date: '2023-10-20',
//         time: '10:00 AM - 2:00 PM',
//         status: 'pending',
//       },
//     ],
//     notifications: [
//       {
//         id: 'n1',
//         message: 'New booking request from Tiny Tots for 2023-10-20.',
//         date: '2023-10-10',
//         read: false,
//       },
//       {
//         id: 'n2',
//         message: 'Reminder: Your availability for next week is set.',
//         date: '2023-10-12',
//         read: true,
//       },
//     ],
//     messages: [
//       {
//         id: 'm1',
//         sender: 'Little Hands',
//         content: 'Can you confirm your availability for next week?',
//         date: '2023-10-11',
//         read: false,
//       },
//       {
//         id: 'm2',
//         sender: 'Tiny Tots',
//         content: 'Looking forward to your visit on 2023-10-20!',
//         date: '2023-10-13',
//         read: true,
//       },
//     ],
//     settings: {
//       notificationsEnabled: true,
//       darkMode: false, // Example setting
//     },
//     createdAt: '2023-01-15',
//     updatedAt: '2023-10-01',
//   },
//   // Generate more mock ECE users as needed
//   {
//     id: '2',
//     fullName: 'Bob Smith',
//     email: 'bob@daycarebob.com',
//     password: 'password123',
//     role: 'ECE',
//     phone: '123-456-7890',
//     address: '123 Bob Ave, Wonderland',
//     profilePicture: 'https://example.com/profile-pic-alice.jpg',
//     bio: 'Passionate ECE with 3 years of experience in early childhood education.',
//     available: false,
//     availability: {
//       monday: '9:00 AM - 2:00 PM',
//       tuesday: '9:00 AM - 2:00 PM',
//       wednesday: '9:00 AM - 2:00 PM',
//       thursday: '9:00 AM - 2:00 PM',
//       friday: '9:00 AM - 2:00 PM',
//       saturday: '10:00 AM - 2:00 PM',
//       sunday: 'Unavailable',
//     },
//     qualifications: [
//       'Bachelor of Early Childhood Education',
//       'Certified in First Aid and CPR',
//       'Specialized in Child Development',
//     ],
//     ratings: 4.8,
//     reviews: [
//       {
//         reviewer: 'Little Hands Montessori',
//         comment: 'Bob is fantastic with our daycare centre! Highly recommend him.',
//         rating: 5,
//         date: '2023-10-01',
//         },
//     ],
//     bookings: [
//       {
//         bookingId: 'b1',
//         childcareCentre: 'Little Hands',
//         date: '2023-10-15',
//         time: '9:00 AM - 1:00 PM',
//         status: 'confirmed',
//       },
//       {
//         bookingId: 'b2',
//         childcareCentre: 'Tiny Tots',
//         date: '2023-10-20',
//         time: '10:00 AM - 2:00 PM',
//         status: 'pending',
//       },
//     ],
//     notifications: [
//       {
//         id: 'n1',
//         message: 'New booking request from Tiny Tots for 2023-10-20.',
//         date: '2023-10-10',
//         read: false,
//       },
//       {
//         id: 'n2',
//         message: 'Reminder: Your availability for next week is set.',
//         date: '2023-10-12',
//         read: true,
//       },
//     ],
//     messages: [
//       {
//         id: 'm1',
//         sender: 'Little Hands',
//         content: 'Can you confirm your availability for next week?',
//         date: '2023-10-11',
//         read: false,
//       },
//       {
//         id: 'm2',
//         sender: 'Tiny Tots',
//         content: 'Looking forward to your visit on 2023-10-20!',
//         date: '2023-10-13',
//         read: true,
//       },
//     ],
//     settings: {
//       notificationsEnabled: true,
//       darkMode: false, // Example setting
//     },
//     createdAt: '2023-01-15',
//     updatedAt: '2023-10-01',
//   },
// ];
// Add more mock ECE users as needed
// This mock data can be used to simulate ECE user profiles in the application
// and test various features like bookings, notifications, and messages.