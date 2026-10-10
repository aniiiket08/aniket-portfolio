import React from "react";

export interface Slot {
  slot_index: number;
  start_time: string;
  end_time: string;
  score: number;
  reason: string;
  conflicts: string[];
}

interface SlotCardProps {
  slot: Slot;
  onSelect: (slot: Slot) => void;
  isSelecting?: boolean;
}

export const SlotCard: React.FC<SlotCardProps> = ({ slot, onSelect, isSelecting }) => {
  const startDt = new Date(slot.start_time);
  const endDt = new Date(slot.end_time);

  const formattedDate = startDt.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const formattedTime = `${startDt.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })} – ${endDt.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })}`;

  return (
    <div className="border-b border-rule py-4 flex items-baseline justify-between hover:bg-tint transition-colors px-2">
      <div className="space-y-1">
        <div className="flex items-baseline space-x-3">
          <span className="label text-soft font-mono">0{slot.slot_index}</span>
          <span className="font-serif text-lg text-ink">
            {formattedDate}, {formattedTime}
          </span>
        </div>
        <p className="font-serif italic text-sm text-soft pl-7">
          {slot.reason}
        </p>
      </div>

      <button
        onClick={() => onSelect(slot)}
        disabled={isSelecting}
        className="label text-ink hover:text-accent underline transition-colors disabled:opacity-50 ml-4"
      >
        {isSelecting ? "Booking..." : "Select →"}
      </button>
    </div>
  );
};
