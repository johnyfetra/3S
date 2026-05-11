"use client";

import { motion } from "framer-motion";
import type { PresenceUser } from "@/lib/types/domain";
import { useTranslation } from "@/lib/i18n/use-translation";

const users: PresenceUser[] = [
  { id: "1", name: "John Doe", role: "teacher", status: "online", loggedInAt: "07:12 AM", sessionDuration: "2h14m", location: "Antananarivo" },
  { id: "2", name: "Miora R.", role: "parent", status: "idle", loggedInAt: "08:04 AM", sessionDuration: "52m", location: "Antananarivo" },
  { id: "3", name: "Admin Rakoto", role: "admin", status: "online", loggedInAt: "06:40 AM", sessionDuration: "3h01m", location: "Ivato" }
];

export function MonitoringGrid() {
  const { t } = useTranslation();
  return (
    <div className="grid gap-3">
      {users.map((user, index) => (
        <motion.article
          key={user.id}
          className="rounded-lg border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/5"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.08 }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-black">{user.role === "teacher" ? `${t.monitoring.teacher} ` : ""}{user.name}</p>
              <p className="text-sm text-black/58 dark:text-white/58">
                {t.monitoring[user.status]} {t.monitoring.now} - {t.monitoring.loggedIn} {user.loggedInAt} - {t.monitoring.session}: {user.sessionDuration} - {user.location}
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800 dark:bg-emerald-400/20 dark:text-emerald-200">{t.monitoring[user.status]}</span>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
