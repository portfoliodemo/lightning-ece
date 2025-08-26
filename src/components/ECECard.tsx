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