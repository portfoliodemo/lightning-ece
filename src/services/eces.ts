// src/services/eces.ts
import type { BaseUser } from "../types/User";

const API_URL = "http://localhost:5000"; // adjust if needed

export async function getAllEces(): Promise<BaseUser[]> {
  const res = await fetch(`${API_URL}/eces`);
  if (!res.ok) throw new Error("Failed to fetch ECEs");
  return res.json();
}
