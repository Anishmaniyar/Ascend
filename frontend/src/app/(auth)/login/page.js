import { redirect } from "next/navigation";

// Google OAuth handles both sign-up and sign-in — no separate login flow needed.
export default function LoginPage() {
  redirect("/register");
}
