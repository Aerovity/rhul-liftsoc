"use client";

import { useSyncExternalStore } from "react";
import { SESSIONS } from "@/content";

const TZ = "Europe/London";
const SESSION_MS = 60 * 60 * 1000;

/* one shared one-second clock; null on the server so the markup is stable */
const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
};
const getSecond = () => Math.floor(Date.now() / 1000);
const getServerSecond = () => null;

const londonParts = new Intl.DateTimeFormat("en-GB", {
  timeZone: TZ,
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hourCycle: "h23",
});

/** London wall-clock time of an instant, expressed as if it were UTC. */
function londonWall(ms: number) {
  const p = Object.fromEntries(londonParts.formatToParts(ms).map((x) => [x.type, Number(x.value)]));
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
}

/** The instant at which London's clocks read the given wall time. */
function fromLondonWall(wallMs: number) {
  return wallMs - (londonWall(wallMs) - wallMs);
}

function nextSession(now: number) {
  const today = new Date(londonWall(now));
  let best: { start: number; end: number; session: (typeof SESSIONS)[number] } | null = null;
  for (let ahead = 0; ahead < 9; ahead++) {
    const date = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + ahead),
    );
    for (const session of SESSIONS) {
      if (date.getUTCDay() !== session.day) continue;
      date.setUTCHours(session.hour, session.minute, 0, 0);
      const start = fromLondonWall(date.getTime());
      const end = start + SESSION_MS;
      if (end > now && (!best || start < best.start)) best = { start, end, session };
    }
  }
  return best;
}

const p2 = (n: number) => String(n).padStart(2, "0");

export function Countdown() {
  const second = useSyncExternalStore(subscribe, getSecond, getServerSecond);

  let title = "Next session in";
  let clock = "00D 00H 00M 00S";
  let label = "Group gym session at the RHUL gym.";

  const next = second === null ? null : nextSession(second * 1000);
  if (next) {
    const now = second! * 1000;
    if (next.start <= now) {
      title = "On the floor right now";
      clock = "LIVE NOW";
    } else {
      let s = Math.floor((next.start - now) / 1000);
      const d = Math.floor(s / 86400);
      s %= 86400;
      const h = Math.floor(s / 3600);
      s %= 3600;
      clock = `${p2(d)}D ${p2(h)}H ${p2(Math.floor(s / 60))}M ${p2(s % 60)}S`;
    }
    label = `${next.session.name}, ${next.session.time}. ${label}`;
  }

  return (
    <div className="sessions__now">
      <div className="sessions__status label" data-fade="">
        <span className="sessions__dot" data-live-dot="" />
        <span>{title}</span>
      </div>
      <div className="countdown" data-countdown="" role="timer" aria-live="off">
        {clock}
      </div>
      <div className="lede" data-fade="">
        {label}
      </div>
    </div>
  );
}
