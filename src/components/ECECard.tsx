// src/components/ECECard.tsx
import type { ECEUser } from "../types/ECE";

type ECECardProps = {
  ece: ECEUser;
  onBookRequest?: (eceId: string) => void;     // Parent triggers request creation
  onViewProfile?: (eceId: string) => void;     // Parent shows full profile/details
};

export default function ECECard({ ece, onBookRequest, onViewProfile }: ECECardProps) {
  return (
    <div className="ece-card border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200">
      {/* Header Info */}
      <div className="flex flex-col items-center mb-4 text-center">
        <h2 className="text-xl font-semibold">{ece.fullName}</h2>
        <p className="text-gray-600">{ece.email}</p>
        <p className="text-gray-500">Role: {ece.role}</p>

        <p
          className={`text-sm font-medium ${
            ece.available ? "text-green-600" : "text-red-500"
          }`}
        >
          {ece.available ? "Available" : "Not Available"}
        </p>
      </div>

      {/* Primary action */}
      <div className="card-button-container">
        <button
          disabled={!ece.available}
          onClick={() => onBookRequest?.(ece.id)}
          className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition-colors duration-200
            ${
              ece.available
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          {ece.available ? "Request to Book" : "Not Available"}
        </button>

        {/* Secondary action: view more details */}
        <button
          onClick={() => onViewProfile?.(ece.id)}
          className="w-full mt-2 py-2 px-4 rounded-lg border text-blue-600 font-medium hover:bg-gray-100 transition-colors duration-200"
        >
          View Profile
        </button>
      </div>

      {/* Optional extra details (basic preview) */}
      {ece.bio || ece.phone || ece.qualifications ? (
        <div className="mt-4 space-y-2 text-sm text-gray-700">
          {ece.bio && <p>Bio: {ece.bio}</p>}
          {ece.phone && <p>Phone: {ece.phone}</p>}
          {ece.qualifications && ece.qualifications.length > 0 && (
            <p>Qualifications: {ece.qualifications.join(", ")}</p>
          )}
        </div>
      ) : null}
    </div>
  );
}







// // src/components/ECECard.tsx
// import type { ECEUser } from "../types/ECE";

// type ECECardProps = {
//   ece: ECEUser;
//   onBookRequest?: (eceId: string) => void; // callback for parent components
// };

// export default function ECECard({ ece, onBookRequest }: ECECardProps) {
//   return (
//     <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200">
//       {/* Header Info */}
//       <div className="flex flex-col items-center mb-4 text-center">
//         <h2 className="text-xl font-semibold">{ece.fullName}</h2>
//         <p className="text-gray-600">{ece.email}</p>
//         <p className="text-gray-500">Role: {ece.role}</p>

//         <p
//           className={`text-sm font-medium ${
//             ece.available ? "text-green-600" : "text-red-500"
//           }`}
//         >
//           {ece.available ? "Available" : "Not Available"}
//         </p>
//       </div>

//       {/* Primary action */}
//       <button
//         disabled={!ece.available}
//         onClick={() => onBookRequest?.(ece.id)}
//         className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition-colors duration-200
//           ${
//             ece.available
//               ? "bg-blue-500 hover:bg-blue-600"
//               : "bg-gray-400 cursor-not-allowed"
//           }`}
//       >
//         {ece.available ? "Request to Book" : "Not Available"}
//       </button>

//       {/* Optional extra details (expand later when needed) */}
//       {ece.bio || ece.phone || ece.qualifications ? (
//         <div className="mt-4 space-y-2 text-sm text-gray-700">
//           {ece.bio && <p>Bio: {ece.bio}</p>}
//           {ece.phone && <p>Phone: {ece.phone}</p>}
//           {ece.qualifications && ece.qualifications.length > 0 && (
//             <p>Qualifications: {ece.qualifications.join(", ")}</p>
//           )}
//         </div>
//       ) : null}
//     </div>
//   );
// }



// // import type { ECEUser } from '../types/ECE';

// // type ECECardProps = {
// //   ece: ECEUser;
// // };

// // export default function ECECard({ ece }: ECECardProps) {
// //   return (
// //     <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200">
// //         <div className="flex flex-col items-center mb-4">
// //         <h2 className="text-xl font-semibold">{ece.fullName}</h2>
// //             <p className="text-gray-600">{ece.email}</p>
// //             <p className="text-gray-500">Role: {ece.role}</p>
// //             <p className={`text-sm ${ece.available ? 'text-green-500' : 'text-red-500'}`}>
// //             {ece.available ? 'Available' : 'Not Available'}
// //             </p>
// //         </div>
// //         <button 
// //             disabled={!ece.available}
// //             className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition-colors duration-200 
// //                 ${ece.available 
// //                     ? 'bg-blue-500 hover:bg-blue-600' 
// //                     : 'bg-gray-400 cursor-not-allowed'
// //                 }`}
// //                 > 
// //                     {ece.available ? 'Request to Book' : 'Not Available'}
// //                 </button>

// //         {/* Future ideas */}
// //         {/* <div className="space-y-2">
// //             <p className="text-gray-700">Bio: {ece.bio || 'No bio available'}</p>
// //             <p className="text-gray-700">Phone: {ece.phone || 'No phone number available'}</p>
// //             <p className="text-gray-700">Address: {ece.address || 'No address available'}</p>
// //             <p className="text-gray-700">Qualifications: {ece.qualifications?.join(', ') || 'No qualifications listed'}</p>
// //             // Certifications?
// //             <p className="text-gray-700">Ratings: {ece.ratings ? ece.ratings.toFixed(1) : 'No ratings yet'}</p>
// //             <p className="text-gray-700">Reviews: {ece.reviews?.length || 0} reviews</p>
// //             <p className="text-gray-700">Bookings: {ece.bookings?.length || 0} bookings</p>
// //             <p className="text-gray-700">Notifications: {ece.notifications?.length || 0} notifications</p>
// //         </div> */}

// //     </div>

// //   );
// // }


// // //     },
// // //       {
// // //         reviewer: 'Parent of Timmy',
// // //         comment: 'Alice has been a wonderful addition to our centre. Timmy loves her!',
// // //         rating: 5,
// // //         date: '2023-09-15',
// // //       },
// // //     ],
// // //     bookings: [
// // //       {
// // //         bookingId: 'booking1',
// // //         date: '2023-10-15',
// // //         time: '10:00 AM',
// // //         status: 'confirmed',
// // //       },
// // //       {
// // //         bookingId: 'booking2',
// // //         date: '2023-10-20',
// // //         time: '2:00 PM',
// // //         status: 'pending',
// // //       },
// // //     ],
// // //     notifications: [         