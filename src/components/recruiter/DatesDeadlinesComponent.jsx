import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FaCalendarDays } from "react-icons/fa6";
import { hackathonData } from "@/utils/store";
import { X } from "lucide-react"; // or use any icon you prefer

const DatesDeadlinesComponent = () => {
  // Initialize from hackathonData.dates_deadlines or empty array
  const [events, setEvents] = useState(() =>
    Array.isArray(hackathonData.dates_deadlines)
      ? [...hackathonData.dates_deadlines]
      : []
  );
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [time, setTime] = useState("");

  // Keep hackathonData.dates_deadlines in sync with local state
  useEffect(() => {
    hackathonData.dates_deadlines = [...events];
  }, [events]);

  const handleAddEvent = () => {
    if (title && deadline && time) {
      const newEvent = { title, deadline, time };
      setEvents((prev) => [...prev, newEvent]);
      setTitle("");
      setDeadline("");
      setTime("");
      setOpen(false);
    }
  };

  const handleDeleteEvent = (idx) => {
    setEvents((events) => {
      const updated = [...events];
      updated.splice(idx, 1);
      return updated;
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Important dates & deadlines?</h2>
        <Button onClick={() => setOpen(true)}>Add Event</Button>
      </div>
      <div>
        {events.length === 0 && <div>No events added.</div>}
        {events.map((event, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-2 rounded-md border w-fit mb-2"
            style={{ minWidth: 260 }}
          >
            <span className="w-8 h-8 flex items-center justify-center rounded bg-muted p-1">
              <FaCalendarDays className="w-6 h-6 text-primary" />
            </span>
            <div>
              <div className="text-sm text-muted-foreground">{event.title}</div>
              <div className="font-medium text-base">
                {formatDeadline(event.deadline, event.time)}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={() => handleDeleteEvent(idx)}
              aria-label="Delete"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={handleAddEvent}
              disabled={!title || !deadline || !time}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function formatDeadline(dateStr, timeStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const options = { day: "2-digit", month: "short", year: "2-digit" };
  const datePart = date.toLocaleDateString("en-GB", options).replace(",", "");
  let timePart = "11:59 PM IST";
  if (timeStr) {
    // Format time as h:mm AM/PM IST
    const [h, m] = timeStr.split(":");
    let hour = Number(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    timePart = `${hour}:${m} ${ampm} IST`;
  }
  return `${datePart}, ${timePart}`;
}

export default DatesDeadlinesComponent;
