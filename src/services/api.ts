// src/services/api.ts
import type { BaseUser } from "../types/User";

const BASE_URL = "http://localhost:5000";

export async function http<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP error ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

/**
 * Lookup a user in centres or eces and return a normalized BaseUser.
 * json-server returns [] if none found; we return null if not found.
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<BaseUser | null> => {
  try {
    // Try centres
    const centres = await http<any[]>(
      `/centres?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    );
    if (centres.length > 0) {
      const c = centres[0];
      return {
        id: c.id,
        email: c.email,
        password: c.password,
        role: "Childcare Centre",
        // normalise names so UI can rely on fullName
        fullName: c.name ?? `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim(),
        firstName: c.firstName ?? "",
        lastName: c.lastName ?? "",
      };
    }

    // Then try eces
    const eces = await http<any[]>(
      `/eces?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    );
    if (eces.length > 0) {
      const e = eces[0];
      const fullName = e.fullName ?? `${e.firstName ?? ""} ${e.lastName ?? ""}`.trim();
      // try to split first/last from fullName if missing
      let firstName = e.firstName ?? "";
      let lastName = e.lastName ?? "";
      if (!firstName && fullName) {
        const parts = fullName.split(" ");
        firstName = parts.shift() ?? "";
        lastName = parts.join(" ");
      }
      return {
        id: e.id,
        email: e.email,
        password: e.password,
        role: "ECE",
        fullName: fullName || e.email,
        firstName,
        lastName,
      };
    }

    return null;
  } catch (err) {
    console.error("Login error:", err);
    return null;
  }
};

/**
 * Register a new user (POST to /eces or /centres depending on role).
 * Returns true on success, false on failure.
 */
export async function registerUser(user: any): Promise<boolean> {
  try {
    const endpoint = user.role === "ECE" ? "/eces" : "/centres";

    const payload =
      user.role === "ECE"
        ? {
            id: user.id,
            fullName: user.fullName ?? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
          }
        : {
            id: user.id,
            // centres in your db.json use "name"
            name: user.name ?? user.centreName,
            email: user.email,
            password: user.password,
          };

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return res.ok;
  } catch (err) {
    console.error("Error registering user:", err);
    return false;
  }
}






// Old version below for reference






// import type { BaseUser } from "../types/User";

// const API_URL = "http://localhost:5000/users"; 

// export const loginUser = async (
//   email: string,
//   password: string
// ): Promise<BaseUser | null> => {
//   try {
//     // First, check centres
//     const centreRes = await fetch(
//       `${API_URL}/centres?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
//     );
//     const centres = await centreRes.json();
//     if (centres.length > 0) {
//       return { ...centres[0], role: "Childcare Centre" };
//     }

//     // Then check eces
//     const eceRes = await fetch(
//       `${API_URL}/eces?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
//     );
//     const eces = await eceRes.json();
//     if (eces.length > 0) {
//       return { ...eces[0], role: "ECE" };
//     }

//     return null; // No match
//   } catch (err) {
//     console.error("Login error:", err);
//     return null;
//   }
// };

// export async function http<T>(
//   path: string,
//   options?: RequestInit
// ): Promise<T> {
//   const res = await fetch(`${BASE_URL}${path}`, options);
//   if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
//   return res.json();
// }

// export async function registerUser(user: any) {
//   try {
//     const res = await fetch(API_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(user),
//     });

//     if (!res.ok) {
//       throw new Error("Failed to register user");
//     }

//     return true; // success
//   } catch (error) {
//     console.error("Error registering user:", error);
//     return false;
//   }
// }