import bcrypt from "bcryptjs";
import { User } from "../models/User.js";

export const ensureAdmin = async () => {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return;
  }

  const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existing) {
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await User.create({
    email: ADMIN_EMAIL.toLowerCase(),
    passwordHash,
    role: "admin"
  });
};
