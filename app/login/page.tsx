import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = { title: "Вход — Florida Analytics" };

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
