"use client";

import { AppShell } from "@/components/layouts/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/use-translation";

const reactions = ["👍", "❤️", "😂", "😮", "😢", "👏"];

export default function MessagingPage() {
  const { t } = useTranslation();
  return (
    <AppShell>
      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <Card>
          <h2 className="text-xl font-black">{t.messaging.conversations}</h2>
          <div className="mt-4 grid gap-2">
            {t.messaging.chats.map((chat) => (
              <button key={chat} className="rounded-lg border border-black/10 bg-black/[0.03] p-3 text-left font-semibold text-black/75 transition hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.03] dark:text-white/80 dark:hover:bg-white/[0.07]">{chat}</button>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-black">{t.messaging.chats[0]}</h2>
          <div className="mt-5 grid gap-3">
            <div className="max-w-lg rounded-lg bg-amber-300/15 p-4 text-amber-100">{t.messaging.firstMessage}</div>
            <div className="ml-auto max-w-lg rounded-lg bg-black p-4 text-white">{t.messaging.secondMessage}</div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">{reactions.map((reaction) => <button key={reaction} className="h-10 w-10 rounded-full border border-black/10 bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.04]">{reaction}</button>)}</div>
          <div className="mt-5 flex gap-3">
            <input className="min-h-11 flex-1 rounded-lg border border-black/10 bg-white px-3 text-black outline-none placeholder:text-black/40 dark:border-white/10 dark:bg-black dark:text-white dark:placeholder:text-white/40" placeholder={t.messaging.placeholder} />
            <Button>{t.common.send}</Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
