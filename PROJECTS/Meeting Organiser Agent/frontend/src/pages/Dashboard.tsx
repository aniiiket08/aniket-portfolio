import React from "react";
import { Nav } from "../components/Nav";

export const Dashboard: React.FC = () => {
  const todayFormatted = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <Nav />

      <main className="max-w-[1280px] w-full mx-auto px-6 py-10 flex-1">
        {/* Header */}
        <header className="mb-12 border-b border-rule-strong pb-4 flex justify-between items-baseline">
          <h1 className="font-serif text-4xl md:text-5xl text-ink tracking-tight">
            {todayFormatted}
          </h1>
          <button className="btn-primary">
            + New Meeting
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Column: Numbered Sections */}
          <div className="lg:col-span-8 space-y-12">
            {/* Section 01 */}
            <section className="border-t border-rule-strong pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="label text-soft">01 — Awaiting Approval</span>
                <span className="label text-faint font-mono">0 items</span>
              </div>
              <div className="border-t border-rule py-8 text-center text-soft font-serif italic">
                No minutes or agendas awaiting approval.
              </div>
            </section>

            {/* Section 02 */}
            <section className="border-t border-rule-strong pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="label text-soft">02 — This Week</span>
                <span className="label text-faint font-mono">0 meetings</span>
              </div>
              <div className="border-t border-rule py-8 text-center text-soft font-serif italic">
                No meetings scheduled for this week.
              </div>
            </section>

            {/* Section 03 */}
            <section className="border-t border-rule-strong pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="label text-soft">03 — Overdue Action Items</span>
                <span className="label text-faint font-mono">0 overdue</span>
              </div>
              <div className="border-t border-rule py-8 text-center text-soft font-serif italic">
                No overdue action items.
              </div>
            </section>
          </div>

          {/* Right Column: Stat Blocks */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="border-t border-rule-strong pt-4">
              <div className="font-serif text-6xl text-ink leading-none mb-2">0</div>
              <div className="label text-soft">Meetings this month</div>
            </div>

            <div className="border-t border-rule pt-4">
              <div className="font-serif text-6xl text-ink leading-none mb-2">100%</div>
              <div className="label text-soft">Actions closed on time</div>
            </div>

            <div className="border-t border-rule pt-4">
              <div className="font-serif text-6xl text-ink leading-none mb-2">0</div>
              <div className="label text-soft">Minutes approved</div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};
