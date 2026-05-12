"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";
import { apiRequest } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { Role } from "@/lib/types/domain";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useTranslation } from "@/lib/i18n/use-translation";

type LoginResponse = {
  access_token: string;
  refresh_token: string;
  force_password_reset: boolean;
  role: Role;
  username: string;
  full_name: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const setSession = useAuthStore((state) => state.setSession);
  const [username, setUsername] = useState("superadmin");
  const [password, setPassword] = useState("ChangeMe123!");
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    try {
      const response = await apiRequest<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password })
      });
      setSession({
        username: response.username,
        role: response.role,
        fullName: response.full_name,
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        forcePasswordReset: response.force_password_reset
      });
      router.push("/dashboard");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t.login.failed);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f8f1e4] px-4 text-[#111111]">
      <section className="w-full max-w-md rounded-lg border border-[#d7c7ad] bg-white p-7 shadow-[0_24px_70px_rgba(17,17,17,0.16)]">
        <div className="mb-7">
          <div className="mb-5 flex justify-end">
            <LanguageSwitcher compact />
          </div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#9a4f00]">{t.login.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-black text-[#111111]">{t.login.title}</h1>
          <p className="mt-2 text-sm font-medium text-[#51473b]">{t.login.help}</p>
        </div>
        <form className="grid gap-4" onSubmit={submit}>
          <label className="grid gap-2 text-sm font-bold text-[#201b16]">
            {t.login.username}
            <span className="flex items-center gap-2 rounded-lg border border-[#9d8f7d] bg-[#fffaf2] px-3 text-[#111111] focus-within:border-[#b45309] focus-within:ring-4 focus-within:ring-[#f59e0b]/20">
              <User size={18} aria-hidden="true" />
              <input className="min-h-11 flex-1 bg-transparent font-semibold text-[#111111] outline-none placeholder:text-[#6d6257]" value={username} onChange={(event) => setUsername(event.target.value)} />
            </span>
          </label>
          <label className="grid gap-2 text-sm font-bold text-[#201b16]">
            {t.login.password}
            <span className="flex items-center gap-2 rounded-lg border border-[#9d8f7d] bg-[#fffaf2] px-3 text-[#111111] focus-within:border-[#b45309] focus-within:ring-4 focus-within:ring-[#f59e0b]/20">
              <Lock size={18} aria-hidden="true" />
              <input className="min-h-11 flex-1 bg-transparent font-semibold text-[#111111] outline-none placeholder:text-[#6d6257]" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </span>
          </label>
          {error ? <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p> : null}
          <button className="min-h-12 rounded-lg bg-[#111111] px-4 text-base font-black text-white transition hover:bg-[#3b2a17] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b]" type="submit">
            {t.login.submit}
          </button>
        </form>
      </section>
    </main>
  );
}
