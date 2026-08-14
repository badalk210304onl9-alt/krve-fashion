import Link from "next/link";

import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  Sparkles,
  Users,
} from "lucide-react";

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fb]">
      {/* HERO */}
      <section className="bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <Sparkles
                size={16}
                className="text-blue-300"
              />

              <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-200">
                Careers at KRVE
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Build, Learn & Grow
              <span className="block text-blue-400">
                With KRVE
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Join KRVE through live business projects,
              internships and future career opportunities
              across fashion, e-commerce, technology,
              marketing and business operations.
            </p>
          </div>
        </div>
      </section>

      {/* CAREER OPPORTUNITIES */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
              Opportunities
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Explore Opportunities at KRVE
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Choose an opportunity that matches your
              experience, skills and career goals.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {/* LIVE PROJECT */}
            <article className="group flex min-h-[340px] flex-col rounded-[28px] border border-blue-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <GraduationCap size={28} />
              </div>

              <div className="mt-6">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-black text-slate-950">
                    Live Business Projects
                  </h3>

                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                    Open
                  </span>
                </div>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Work on real KRVE business challenges in
                  marketing, sales, finance, HR, operations,
                  product research, technology and customer
                  experience.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Duration
                  </p>

                  <p className="mt-1 text-sm font-black text-slate-900">
                    4–6 Weeks
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Certificate
                  </p>

                  <p className="mt-1 text-sm font-black text-slate-900">
                    Verified
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-6">
                <Link
                  href="/careers/live-projects"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 text-sm font-black text-white transition hover:bg-blue-800"
                >
                  Explore Live Projects

                  <ArrowRight size={17} />
                </Link>
              </div>
            </article>

            {/* INTERNSHIP */}
            <article className="flex min-h-[340px] flex-col rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
                <BriefcaseBusiness size={27} />
              </div>

              <div className="mt-6">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-black text-slate-950">
                    Internships
                  </h3>

                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700">
                    Coming Soon
                  </span>
                </div>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Structured internship opportunities for
                  students and early-career professionals
                  interested in building practical business
                  experience with KRVE.
                </p>
              </div>

              <div className="mt-auto pt-6">
                <button
                  type="button"
                  disabled
                  className="h-12 w-full cursor-not-allowed rounded-xl bg-slate-100 px-5 text-sm font-black text-slate-400"
                >
                  Applications Opening Soon
                </button>
              </div>
            </article>

            {/* JOBS */}
            <article className="flex min-h-[340px] flex-col rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Users size={27} />
              </div>

              <div className="mt-6">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-black text-slate-950">
                    Full-Time Careers
                  </h3>

                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Future
                  </span>
                </div>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Future opportunities to join KRVE's core
                  team across business, fashion, technology
                  and operations.
                </p>
              </div>

              <div className="mt-auto pt-6">
                <button
                  type="button"
                  disabled
                  className="h-12 w-full cursor-not-allowed rounded-xl bg-slate-100 px-5 text-sm font-black text-slate-400"
                >
                  No Open Positions
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* WHY KRVE */}
      <section className="border-t border-slate-200 bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                Why KRVE
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-950">
                Experience a Real Business Environment
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                KRVE opportunities are designed around
                practical business exposure rather than
                classroom-only assignments.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                [
                  "Real Projects",
                  "Work on actual KRVE business challenges.",
                ],
                [
                  "Performance Evaluation",
                  "Structured scoring and project assessment.",
                ],
                [
                  "Business Exposure",
                  "Understand how an early-stage venture operates.",
                ],
                [
                  "Growth Opportunities",
                  "Top performers may be considered for future opportunities.",
                ],
              ].map(
                ([title, description]) => (
                  <div
                    key={title}
                    className="rounded-2xl bg-slate-50 p-5"
                  >
                    <h3 className="font-black text-slate-950">
                      {title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {description}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
