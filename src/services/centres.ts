import { http } from "./api";

export type Centre = {
  id: string;
  name: string;       // db.json field - used for display
  email: string;
  password: string;
};

export async function getAllCentres() {
  return http<Centre[]>("/centres");
}

export async function getCentresMap() {
  const centres = await getAllCentres();
  return new Map(centres.map((c) => [c.id, c]));
}
