import { http } from "./api";
import type { ECEUser } from "../types/ECE";

export async function getAllEces() {
  return http<ECEUser[]>("/eces");
}

export async function getEceMap() {
  const eces = await getAllEces();
  return new Map(eces.map((e) => [e.id, e]));
}
