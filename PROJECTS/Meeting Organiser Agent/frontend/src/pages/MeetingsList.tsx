import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { Nav } from "../components/Nav";

interface Meeting {
  id: number;
  title: str;
  description: str | null;
  duration_minutes: number;
  start_time: str | null;
  end_time: str | null;
  status: string;
  created_at: string;
}

export const MeetingsList: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<Meeting[]>("/meetings")
      .then((data) => setMeetings(data))
      .catch((err) => setError(err.message || "Could not load meetings."))
      .finally(() => setLoading(false));
  }, []);

  const getStatusMarker = (status: string) => {
    switch (status) {
      case "room_booked":
      case "scheduled":
      case "agenda_approved":
      case "minutes_approved":
        return <span className="inline-block w-1.5 h-1.5 bg-ok mr-2" />;
      case "requested":
      case "slots_proposed":
        return <span className="inline-block w-1.5 h-1.5 bg-warn mr-2" />;
      default:
        return <span className="inline-block w-1.5 h-1.5 bg-faint mr-2" />;
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <Nav />

      <main className="max-w-[1280px] w-full mx-auto px-6 py-10 flex-1">
        <header className="mb-10 border-b border-rule-strong pb-4 flex justify-between items-baseline">
          <h1 className="font-serif text-4xl text-ink tracking-tight">Meetings</h1>
          <Link to="/meetings/new" className="btn-primary">
            + New Meeting
          </Link>
        </header>

        {error && (
          <div className="border-l-2 border-accent pl-3 py-2 mb-8 text-sm text-accent bg-accent-wash">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center font-serif text-soft">Loading meetings...</div>
        ) : meetings.length === 0 ? (
          <div className="border-t border-rule py-16 text-center font-serif italic text-soft">
            No meetings found. Schedule one to get started.
          </div>
        ) : (
          <div className="border-t border-rule-strong">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-rule-strong">
                  <th className="py-3 px-2 label text-soft">Ref ID</th>
                  <th className="py-3 px-2 label text-soft">Title</th>
                  <th className="py-3 px-2 label text-soft">Date & Time</th>
                  <th className="py-3 px-2 label text-soft">Duration</th>
                  <th className="py-3 px-2 label text-soft">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {meetings.map((m) => {
                  const startStr = m.start_time
                    ? new Date(m.start_time).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Not set";

                  return (
                    <tr key={m.id} className="hover:bg-tint transition-colors">
                      <td className="py-4 px-2 font-mono text-sm text-soft">#{m.id}</td>
                      <td className="py-4 px-2 font-serif text-ink font-medium">{m.title}</td>
                      <td className="py-4 px-2 font-mono text-sm text-soft">{startStr}</td>
                      <td className="py-4 px-2 font-mono text-sm text-soft">{m.duration_minutes}m</td>
                      <td className="py-4 px-2 label">
                        {getStatusMarker(m.status)}
                        <span className="text-soft uppercase">{m.status.replace("_", " ")}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};
