import { createHash, randomBytes } from "node:crypto";

export function createBookingAccessToken() {
  return randomBytes(32).toString("hex");
}

export function hashBookingAccessToken(token) {
  return createHash("sha256").update(token).digest("hex");
}
