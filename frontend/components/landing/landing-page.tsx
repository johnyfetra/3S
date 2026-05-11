"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart3, CalendarCheck, GraduationCap, MessageSquare, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OrbitGrid } from "@/components/animations/orbit-grid";

const features = [
  { icon: ShieldCheck, title: "Secure RBAC", text: "Centralized permissions for super admins, admins, teachers, and parents." },
  { icon: CalendarCheck, title: "Smart Timetables", text: "Conflict detection for teachers, rooms, classes, and overloads." },
  { icon: BarChart3, title: "Academic Intelligence", text: "Validation engine compares preparation cards against real logbooks." },
  { icon: MessageSquare, title: "Realtime Messaging", text: "Typing, reactions, delivery state, announcements, and voice workflows." }
];

const stats = [
  ["5", "Bimesters per year"],
  ["12", "Grade levels"],
  ["10", "High-school subjects"],
  ["24/7", "Monitoring"]
];

export function LandingPage() {
  return (
    <main className="overflow-hidden bg-[#fffaf1] text-ink dark:bg-[#0d0d0d] dark:text-white">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-black/10 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-black/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-3 font-black">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-amber-300 text-black">3S</span>
            School ERP
          </Link>
          <div className="hidden items-center gap-2 md:flex">
            <Link href="#features" className="px-3 py-2 text-sm font-semibold text-black/70 dark:text-white/70">Features</Link>
            <Link href="#contact" className="px-3 py-2 text-sm font-semibold text-black/70 dark:text-white/70">Contact</Link>
            <Link href="/login"><Button>Login</Button></Link>
          </div>
        </div>
      </nav>

      <section className="relative min-h-[92vh] px-4 pt-28">
        <OrbitGrid />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
              Enterprise academic operations
            </p>
            <h1 className="max-w-4xl text-5xl font-black leading-[1.02] md:text-7xl">
              School ERP
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-black/68 dark:text-white/68">
              A secure, realtime school management platform for academic monitoring, report cards,
              preparation cards, smart timetables, messaging, and parent visibility.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login"><Button>Login <ArrowRight size={18} /></Button></Link>
              <Link href="#contact"><Button variant="secondary">Contact School</Button></Link>
              <Link href="#features"><Button variant="ghost">Learn More</Button></Link>
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
                  <p className="text-xs uppercase tracking-[0.16em] text-amber-300">Live monitoring</p>
                  <h2 className="text-2xl font-black">Super Admin Command</h2>
                </div>
                <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-sm text-emerald-200">Online</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {stats.map(([value, label]) => (
                  <div key={label} className="rounded-lg border border-white/10 bg-white/8 p-4">
                    <p className="text-3xl font-black text-amber-300">{value}</p>
                    <p className="text-sm text-white/62">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-white/10 bg-white/8 p-4">
                <p className="text-sm text-white/62">Teacher John Doe</p>
                <p className="font-semibold">Online now - Logged in at 07:12 AM - Session duration: 2h14m - Antananarivo</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="mx-auto grid max-w-7xl gap-4 px-4 py-16 md:grid-cols-4">
        {features.map((feature, index) => (
          <motion.div key={feature.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
            <Card className="h-full">
              <feature.icon className="mb-5 text-amber-600" size={28} />
              <h3 className="text-xl font-black">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-black/62 dark:text-white/62">{feature.text}</p>
            </Card>
          </motion.div>
        ))}
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-16 lg:grid-cols-2">
        <Card>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-700">Animated timetable preview</p>
          <div className="mt-6 grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }).map((_, index) => (
              <motion.div key={index} className="h-16 rounded-lg bg-amber-100 dark:bg-white/10" whileHover={{ scale: 1.04 }} />
            ))}
          </div>
        </Card>
        <Card>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-700">Report card preview</p>
          <div className="mt-6 space-y-3">
            {["Mathematics", "English", "Science", "History"].map((subject, index) => (
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
          <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-300">Contact section</p>
          <h2 className="mt-3 text-4xl font-black">Bring realtime academic operations to your school.</h2>
          <p className="mt-4 max-w-2xl text-white/68">Request onboarding, platform configuration, teacher training, and data migration support.</p>
          <div className="mt-7"><Button className="bg-amber-300 text-black hover:bg-amber-400">Contact School</Button></div>
        </div>
      </section>

      <footer className="border-t border-black/10 px-4 py-8 text-center text-sm text-black/58 dark:border-white/10 dark:text-white/58">
        School ERP - Secure academic management for modern institutions.
      </footer>
    </main>
  );
}

