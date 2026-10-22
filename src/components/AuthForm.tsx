"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Props = { mode: "login" | "register" };

function errorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object" || !("message" in payload)) return fallback;
  const message = (payload as { message?: unknown }).message;
  if (Array.isArray(message)) return message.map(String).join(". ");
  return typeof message === "string" ? message : fallback;
}

export function AuthForm({ mode }: Props) {
  const router = useRouter();
  const isRegister = mode === "register";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (isRegister && password !== passwordRepeat) {
      setError("Пароли не совпадают");
      return;
    }
    if (password.length < 8) {
      setError("Пароль должен содержать не менее 8 символов");
      return;
    }

    setPending(true);
    try {
      if (isRegister) {
        const availabilityResponse = await fetch(`/api/auth/registered?email=${encodeURIComponent(email.trim())}`, { cache: "no-store" });
        const availability = await availabilityResponse.json().catch(() => null) as { registered?: boolean } | null;
        if (!availabilityResponse.ok) throw new Error(errorMessage(availability, "Не удалось проверить email"));
        if (availability?.registered) throw new Error("Аккаунт с такой почтой уже зарегистрирован");
      }

      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(errorMessage(payload, isRegister ? "Не удалось зарегистрироваться" : "Не удалось войти"));
      router.replace("/analytics/flowwow/orders");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Произошла ошибка");
    } finally {
      setPending(false);
    }
  }

  const inputClassName = "h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-9">
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-600">Florida Analytics</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">{isRegister ? "Регистрация" : "Вход"}</h1>
          <p className="mt-2 text-sm text-slate-500">{isRegister ? "Создайте аккаунт для работы с аналитикой" : "Введите данные своего аккаунта"}</p>
        </div>
        <form className="space-y-5" onSubmit={submit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
            <input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="user@example.com" className={inputClassName} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Пароль</span>
            <input type="password" autoComplete={isRegister ? "new-password" : "current-password"} required minLength={8} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} className={inputClassName} />
          </label>
          {isRegister && (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Повторите пароль</span>
              <input type="password" autoComplete="new-password" required minLength={8} maxLength={128} value={passwordRepeat} onChange={(event) => setPasswordRepeat(event.target.value)} className={inputClassName} />
            </label>
          )}
          {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <button type="submit" disabled={pending} className="h-12 w-full rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
            {pending ? "Подождите…" : isRegister ? "Зарегистрироваться" : "Войти"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          {isRegister ? "Уже есть аккаунт?" : "Нет аккаунта?"}{" "}
          <Link className="font-semibold text-emerald-700 hover:text-emerald-800" href={isRegister ? "/login" : "/register"}>
            {isRegister ? "Войти" : "Зарегистрироваться"}
          </Link>
        </p>
      </div>
    </div>
  );
}
