/** Everything a committee member might want to edit lives here. */

export const LINKS = {
  instagram: "https://www.instagram.com/rhul.lifting.society/",
  instagramHandle: "@rhul.lifting.society",
  membership: "https://www.su.rhul.ac.uk/sports/a-z/liftingsociety/",
  email: "lifting@royalholloway.su",
};

export const LIFTS = ["Squat", "Bench", "Deadlift", "Muscle up", "Overhead press"];

export const TAGLINES = ["Find your spotter", "Join the den", "Every level welcome"];

export const DISCIPLINES = [
  {
    name: "Powerlifting",
    href: "#sessions",
    blurb:
      "Squat, bench, deadlift. Form first, numbers follow. In house meets at the RHUL gym are in the works.",
  },
  {
    name: "Bodybuilding",
    href: "#sessions",
    blurb: "Hypertrophy, splits, posing practice and the eternal debate about chest day.",
  },
  {
    name: "Calisthenics",
    href: "#sessions",
    blurb: "Pull ups, dips, levers, handstands. Your bodyweight is the barbell.",
  },
  {
    name: "Socials",
    href: "#den",
    blurb:
      "The part nobody warns you about. Expos, pub nights and the friends you meet between sets.",
  },
];

/** The Den gallery. `shape` sets the frame; `shift` staggers it vertically (vh). */
export const DEN_PHOTOS = [
  {
    src: "/assets/photos/expo-lineup.webp",
    alt: "Four members at the expo",
    caption: "Expo day, the lineup",
    shape: "tall",
    width: "clamp(260px,28vw,440px)",
    shift: -5,
  },
  {
    src: "/assets/photos/flower-wall.webp",
    alt: "Members on a bench in front of a flower wall",
    caption: "Flower wall, last orders",
    shape: "wide",
    width: "clamp(320px,42vw,680px)",
    shift: 8,
  },
  {
    src: "/assets/photos/expo-flex.webp",
    alt: "The flex off at the expo",
    caption: "The flex off",
    shape: "tall",
    width: "clamp(260px,26vw,420px)",
    shift: -9,
  },
  {
    src: "/assets/photos/tent-social.webp",
    alt: "A full tent of members at a social",
    caption: "The tent",
    shape: "tall",
    width: "clamp(260px,30vw,460px)",
    shift: 6,
  },
  {
    src: "/assets/photos/mural-night.webp",
    alt: "Members in front of a painted underpass mural",
    caption: "Underpass, after hours",
    shape: "tall",
    width: "clamp(260px,27vw,430px)",
    shift: -4,
  },
] as const;

/** Weekly sessions. `day` follows Date#getDay (0 = Sunday). Each runs one hour. */
export const SESSIONS = [
  {
    day: 1,
    hour: 21,
    minute: 0,
    short: "MON",
    name: "Monday",
    time: "21:00 to 22:00",
    range: "21:00 → 22:00",
    blurb:
      "Group session led by experienced members. Committee on the floor. Beginners very welcome.",
    inverted: false,
  },
  {
    day: 5,
    hour: 20,
    minute: 30,
    short: "FRI",
    name: "Friday",
    time: "20:30 to 21:30",
    range: "20:30 → 21:30",
    blurb: "Same format, earlier start. Train with the crew, then head into the weekend together.",
    inverted: true,
  },
] as const;

export const COMMITTEE = [
  { role: "President", name: "Denzel Ko" },
  { role: "Vice President", name: "Stan Bowden" },
  { role: "Secretary", name: "Jarema Gatkowski" },
  { role: "Treasurer", name: "Yu Tommaso Jin" },
];
