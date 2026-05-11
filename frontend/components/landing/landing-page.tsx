"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart3, CalendarCheck, GraduationCap, MessageSquare, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OrbitGrid } from "@/components/animations/orbit-grid";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useTranslation } from "@/lib/i18n/use-translation";

const featureIcons = [ShieldCheck, CalendarCheck, BarChart3, MessageSquare];

const statValues = ["5", "12", "10", "24/7"];

export function LandingPage() {
  const { t } = useTranslation();
  const stats = [
    t.landing.statsBimesters,
    t.landing.statsGrades,
    t.landing.statsSubjects,
    t.landing.statsMonitoring
  ];

  return (
    <main className="overflow-hidden bg-[#fffaf1] text-ink dark:bg-[#0d0d0d] dark:text-white">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-black/10 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-black/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-3 font-black">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-amber-300 text-black">3S</span>
            {t.landing.title}
          </Link>
          <div className="hidden items-center gap-2 md:flex">
            <Link href="#features" className="px-3 py-2 text-sm font-semibold text-black/70 dark:text-white/70">{t.landing.navFeatures}</Link>
            <Link href="#contact" className="px-3 py-2 text-sm font-semibold text-black/70 dark:text-white/70">{t.landing.navContact}</Link>
            <LanguageSwitcher compact />
            <Link href="/login"><Button>{t.common.login}</Button></Link>
          </div>
        </div>
      </nav>

      <section className="relative min-h-[92vh] px-4 pt-28">
        <OrbitGrid />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
              {t.landing.eyebrow}
            </p>
            <h1 className="max-w-4xl text-5xl font-black leading-[1.02] md:text-7xl">
              {t.landing.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-black/68 dark:text-white/68">
              {t.landing.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login"><Button>{t.common.login} <ArrowRight size={18} /></Button></Link>
              <Link href="#contact"><Button variant="secondary">{t.common.contactSchool}</Button></Link>
              <Link href="#features"><Button variant="ghost">{t.common.learnMore}</Button></Link>
            </div>
          </motion.div>

          <motion.div
            className="glass rounded-lg p-4"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="rounded-lg bg-black p-4 text-white">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-amber-300">{t.landing.liveMonitoring}</p>
                  <h2 className="text-2xl font-black">{t.landing.command}</h2>
                </div>
                <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-sm text-emerald-200">{t.common.online}</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {stats.map((label, index) => (
                  <div key={label} className="rounded-lg border border-white/10 bg-white/8 p-4">
                    <p className="text-3xl font-black text-amber-300">{statValues[index]}</p>
                    <p className="text-sm text-white/62">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-white/10 bg-white/8 p-4">
                <p className="text-sm text-white/62">{t.landing.teacherExample}</p>
                <p className="font-semibold">{t.landing.teacherStatus}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="mx-auto grid max-w-7xl gap-4 px-4 py-16 md:grid-cols-4">
        {t.landing.features.map(([title, text], index) => {
          const FeatureIcon = featureIcons[index];
          return (
          <motion.div key={title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
            <Card className="h-full">
              <FeatureIcon className="mb-5 text-amber-600" size={28} />
              <h3 className="text-xl font-black">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-black/62 dark:text-white/62">{text}</p>
            </Card>
          </motion.div>
        );
        })}
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-16 lg:grid-cols-2">
        <Card>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-700">{t.landing.timetablePreview}</p>
          <div className="mt-6 grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }).map((_, index) => (
              <motion.div key={index} className="h-16 rounded-lg bg-amber-100 dark:bg-white/10" whileHover={{ scale: 1.04 }} />
            ))}
          </div>
        </Card>
        <Card>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-700">{t.landing.reportPreview}</p>
          <div className="mt-6 space-y-3">
            {t.landing.subjects.map((subject, index) => (
              <div key={subject} className="flex items-center justify-between rounded-lg border border-black/10 p-3 dark:border-white/10">
                <span>{subject}</span>
                <motion.strong initial={{ width: 0 }} whileInView={{ width: `${84 - index * 5}%` }} className="h-2 rounded-full bg-amber-400 text-transparent" />
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-lg bg-black p-8 text-white md:p-12">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-300">{t.landing.contactSection}</p>
          <h2 className="mt-3 text-4xl font-black">{t.landing.contactTitle}</h2>
          <p className="mt-4 max-w-2xl text-white/68">{t.landing.contactText}</p>
          <div className="mt-7"><Button className="bg-amber-300 text-black hover:bg-amber-400">{t.common.contactSchool}</Button></div>
        </div>
      </section>

      <footer className="border-t border-black/10 px-4 py-8 text-center text-sm text-black/58 dark:border-white/10 dark:text-white/58">
        {t.landing.footer}
      </footer>
    </main>
  );
}
