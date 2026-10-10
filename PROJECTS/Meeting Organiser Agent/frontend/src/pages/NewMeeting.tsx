import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { Nav } from "../components/Nav";
import { Slot, SlotCard } from "../components/SlotCard";

export const NewMeeting: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [attendeeEmails, setAttendeeEmails] = useState("attendee1@meetingorganizer.internal, coordinator@meetingorganizer.internal");
  
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdMeetingId, setCreatedMeetingId] = useState<number | null>(null);
  const [rankedSlots, setRankedSlots] = useState<Slot[]>([]);

  const navigate = useNavigate();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const emails = attendeeEmails
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    try {
      const res = await api.post<any>("/meetings", {
        title,
        description,
        duration_minutes: Number(durationMinutes),
        attendee_emails: emails,
      });

      setCreatedMeetingId(res.meeting.id);
      setRankedSlots(res.slots || []);
    } catch (err: any) {
      setError(err.message || "Failed to calculate ranked meeting slots.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSlot = async (slot: Slot) => {
    if (!createdMeetingId) return;
    setBookingLoading(true);
    setError(null);

    try {
      await api.post(`/meetings/${createdMeetingId}/confirm`, {
        selected_start_time: slot.start_time,
        selected_end_time: slot.end_time,
      });
      navigate("/meetings");
    } catch (err: any) {
      setError(err.message || "Failed to confirm meeting slot and book room.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <Nav />

      <main className="max-w-[1280px] w-full mx-auto px-6 py-10 flex-1">
        <header className="mb-10 border-b border-rule-strong pb-4">
          <h1 className="font-serif text-4xl text-ink tracking-tight">New Meeting</h1>
        </header>

        {error && (
          <div className="border-l-2 border-accent pl-3 py-2 mb-8 text-sm text-accent bg-accent-wash">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Form */}
          <div className="lg:col-span-5 border-t border-rule-strong pt-4">
            <h2 className="label text-soft mb-6">01 — Request Details</h2>
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="block label text-soft mb-1">Meeting Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Quarterly Planning Sync"
                  className="w-full input-underline"
                />
              </div>

              <div>
                <label className="block label text-soft mb-1">Description / Topic</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Review key objectives, budget allocation, and action items."
                  className="w-full input-underline resize-none"
                />
              </div>

              <div>
                <label className="block label text-soft mb-1">Duration (minutes)</label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full input-underline bg-transparent"
                >
                  <option value={30}>30 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={90}>90 minutes</option>
                </select>
              </div>

              <div>
                <label className="block label text-soft mb-1">Attendee Emails (comma-separated)</label>
                <input
                  type="text"
                  required
                  value={attendeeEmails}
                  onChange={(e) => setAttendeeEmails(e.target.value)}
                  className="w-full input-underline"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50"
              >
                {loading ? "Finding Slots..." : "Calculate Best Slots"}
              </button>
            </form>
          </div>

          {/* Right: Ranked Slots */}
          <div className="lg:col-span-7 border-t border-rule-strong pt-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="label text-soft">02 — Ranked Available Slots</h2>
              {rankedSlots.length > 0 && (
                <span className="label text-faint font-mono">{rankedSlots.length} slots found</span>
              )}
            </div>

            {rankedSlots.length === 0 ? (
              <div className="border-t border-rule py-12 text-center font-serif italic text-soft">
                Fill in the meeting details and click "Calculate Best Slots" to see ranked options.
              </div>
            ) : (
              <div className="border-t border-rule">
                {rankedSlots.map((slot) => (
                  <SlotCard
                    key={slot.slot_index}
                    slot={slot}
                    onSelect={handleConfirmSlot}
                    isSelecting={bookingLoading}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
