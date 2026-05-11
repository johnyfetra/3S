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
              <button key={chat} className="rounded-lg border border-black/10 p-3 text-left font-semibold dark:border-white/10">{chat}</button>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-black">{t.messaging.chats[0]}</h2>
          <div className="mt-5 grid gap-3">
            <div className="max-w-lg rounded-lg bg-amber-100 p-4 dark:bg-amber-300/15">{t.messaging.firstMessage}</div>
            <div className="ml-auto max-w-lg rounded-lg bg-black p-4 text-white">{t.messaging.secondMessage}</div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">{reactions.map((reaction) => <button key={reaction} className="h-10 w-10 rounded-full border border-black/10 dark:border-white/10">{reaction}</button>)}</div>
          <div className="mt-5 flex gap-3">
            <input className="min-h-11 flex-1 rounded-lg border border-black/10 px-3 dark:border-white/10 dark:bg-black" placeholder={t.messaging.placeholder} />
            <Button>{t.common.send}</Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
