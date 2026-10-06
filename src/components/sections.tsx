import Image from "next/image";
import { Fragment } from "react";
import { Countdown } from "@/components/Countdown";
import { Logo } from "@/components/Logo";
import { split } from "@/components/Split";
import {
  COMMITTEE,
  DEN_PHOTOS,
  DISCIPLINES,
  LIFTS,
  LINKS,
  SESSIONS,
  TAGLINES,
} from "@/content";

const pad2 = (n: number) => String(n).padStart(2, "0");

function Star() {
  return (
    <svg className="marquee__star" viewBox="-10 -10 20 20" aria-hidden="true">
      <path d="M0 -10 L2.35 -3.24 L9.51 -3.09 L3.8 1.24 L5.88 8.09 L0 4 L-5.88 8.09 L-3.8 1.24 L-9.51 -3.09 L-2.35 -3.24 Z" />
    </svg>
  );
}

/** A marquee track holds its content twice so the loop at -50% is seamless. */
function Marquee({
  items,
  variant,
  outlineOdd = false,
}: {
  items: string[];
  variant: "lifts" | "light";
  outlineOdd?: boolean;
}) {
  const group = (hidden: boolean) => (
    <div className="marquee__group" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <Fragment key={item}>
          <span className={outlineOdd && i % 2 ? "marquee__outline" : undefined}>{item}</span>
          <Star />
        </Fragment>
      ))}
    </div>
  );
  return (
    <div className={`marquee marquee--${variant}`}>
      <div className="marquee__track" data-marquee-track="" data-dir={variant === "light" ? "r" : undefined}>
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}

export function Loader() {
  return (
    <div className="loader" data-loader="">
      <Logo
        className="loader__logo"
        data-loader-logo=""
        useProps={{ fill: "#f2f1ee", stroke: "#f2f1ee", strokeWidth: 0.7, "data-draw": "" }}
      />
      <div className="loader__name label label--muted">
        Royal Holloway
        <br />
        Lifting Society
      </div>
      <div className="loader__count" data-count="">
        000
      </div>
    </div>
  );
}

export function Overlays() {
  return (
    <>
      <div className="cursor-dot" data-cursor-dot="" aria-hidden="true" />
      <div className="grain" data-grain="" aria-hidden="true" />
    </>
  );
}

export function Nav() {
  return (
    <header className="nav" data-nav="">
      <a href="#top" className="nav__brand" aria-label="Lift Soc, back to top">
        <Logo className="nav__logo" viewBox="0 0 238 270" fill="#fff" />
        <span className="nav__name">LIFT SOC</span>
      </a>
      <nav className="nav__links label" aria-label="Sections">
        <a href="#train">Train</a>
        <a href="#den">The Den</a>
        <a href="#sessions">Sessions</a>
        <a href="#committee">Committee</a>
      </nav>
      <a href="#join" className="nav__join pill label" data-magnetic="">
        Join <span className="nav__join-dot" />
      </a>
    </header>
  );
}

export function Hero() {
  return (
    <section id="top" className="hero" data-hero="">
      <div className="hero__stage">
        <div className="hero__big" data-hero-big="" aria-hidden="true">
          <span data-hero-l="">LIFT</span>
          <span data-hero-r="">SOC</span>
        </div>
        <canvas className="hero__gl" data-gl="" aria-hidden="true" />
        <div className="hero__ui" data-hero-ui="">
          <h1 className="hero__title" data-split="hero" data-hero-title="">
            {split(
              <>
                Strength is
                <br />
                <em>a team sport.</em>
              </>,
              "words",
              true,
            )}
          </h1>
          <div className="hero__meta label label--muted" data-hero-fade="">
            Royal Holloway
            <br />
            Lifting Society
            <br />
            Egham, Surrey
          </div>
          <div className="hero__meta hero__meta--right label" data-hero-fade="">
            <span>Mon 21:00 / Fri 20:30</span>
            <span className="hero__scroll">
              Scroll
              <span className="hero__scroll-track">
                <span className="hero__scroll-tick" data-scroll-tick="" />
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LiftsMarquee() {
  return <Marquee items={LIFTS} variant="lifts" outlineOdd />;
}

export function About() {
  return (
    <section id="about" className="about split-row">
      <div className="split-row__label label label--muted" data-fade="">
        (01) The society
      </div>
      <div className="split-row__body about__body">
        <p className="about__statement" data-words="">
          {split(
            <>
              Lifting weights can be a solitary pursuit. We built the opposite. A home for
              powerlifters, bodybuilders and calisthenics athletes, first timers and seasoned
              lifters, where <em>nobody trains alone.</em>
            </>,
            "words",
          )}
        </p>
        <div className="about__foot">
          <p className="about__note" data-fade="">
            Stop by a session, follow us on Instagram or just say hi to one of us in the gym. You
            will leave with a programme, a spotter and probably a group chat.
          </p>
          <a
            href={LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="about__link label"
            data-fade=""
            data-magnetic=""
          >
            {LINKS.instagramHandle} â†—
          </a>
        </div>
      </div>
    </section>
  );
}

export function Disciplines() {
  return (
    <section id="train" className="section">
      <div className="section-head">
        <div className="label label--muted" data-fade="">
          (02) How we train
        </div>
        <h2 className="headline" data-split="" style={{ maxWidth: 700 }}>
          {split(
            <>
              Four ways in. <em>Pick one, or all of them.</em>
            </>,
            "words",
            true,
          )}
        </h2>
      </div>
      <div className="disc-list">
        {DISCIPLINES.map((d, i) => (
          <a key={d.name} href={d.href} className="disc" data-disc="">
            <span className="disc__num label">{pad2(i + 1)}</span>
            <span className="disc__name" data-disc-name="">
              {d.name}
            </span>
            <span className="disc__blurb">{d.blurb}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export function Den() {
  return (
    <section id="den" className="den" data-hscroll="">
      <div className="den__stage">
        <div className="den__bg" data-h-bg="" aria-hidden="true">
          Off the platform
        </div>
        <div className="den__top label label--muted">
          <span>(03) The den</span>
          <span className="den__progress" aria-hidden="true">
            <span className="den__count" data-h-count="">
              01
            </span>
            <span className="den__bar">
              <span className="den__bar-fill" data-h-bar="" />
            </span>
            <span>{pad2(DEN_PHOTOS.length)}</span>
          </span>
        </div>
        <div className="den__track" data-h-track="">
          <div className="den__intro">
            <h2 className="den__title">
              The
              <br />
              Den
            </h2>
            <p className="lede">
              Sessions end. The society does not. Expos, pub tents, underpasses at midnight. This
              is what happens <em>off the platform.</em>
            </p>
          </div>
          {DEN_PHOTOS.map((p, i) => (
            <figure
              key={p.src}
              className="den__figure"
              style={{ width: p.width, transform: `translateY(${p.shift}vh)` }}
            >
              <div className={`den__frame den__frame--${p.shape}`}>
                <Image
                  className="den__img"
                  data-h-img=""
                  src={p.src}
                  alt={p.alt}
                  width={p.shape === "wide" ? 1600 : 1200}
                  height={p.shape === "wide" ? 1200 : 1600}
                  sizes={p.shape === "wide" ? "(max-width: 760px) 90vw, 48vw" : "(max-width: 760px) 70vw, 34vw"}
                  loading="eager"
                />
              </div>
              <figcaption className="den__caption label label--muted">
                <span>{pad2(i + 1)}</span>
                <span>{p.caption}</span>
              </figcaption>
            </figure>
          ))}
          <a href="#join" className="den__cta" data-magnetic="">
            <span className="den__cta-text">
              Get in
              <br />
              the photo
            </span>
            <span className="label label--muted">Join us â†’</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function Sessions() {
  return (
    <section id="sessions" className="section">
      <div className="split-row sessions__head">
        <div className="split-row__label label label--muted" data-fade="">
          (04) Sessions
        </div>
        <div className="split-row__body">
          <Countdown />
        </div>
      </div>
      <div className="cards">
        {SESSIONS.map((s) => (
          <div key={s.short} className={`card${s.inverted ? " card--inverted" : ""}`} data-card="">
            <div className="card__top label">
              <span>Weekly</span>
              <span>RHUL Gym</span>
            </div>
            <div className="card__day">{s.short}</div>
            <div className="card__foot">
              <span className="card__time">{s.range}</span>
              <span className="card__blurb">{s.blurb}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Committee() {
  return (
    <section id="committee" className="committee">
      <div className="section-head">
        <div className="label label--muted" data-fade="">
          (05) Committee
        </div>
        <h2 className="headline" data-split="">
          {split(
            <>
              The people <em>holding the bar.</em>
            </>,
            "words",
            true,
          )}
        </h2>
      </div>
      <div>
        {COMMITTEE.map((m, i) => (
          <div key={m.role} className="member">
            <span className="member__line" data-line="" />
            {i === COMMITTEE.length - 1 && (
              <span className="member__line member__line--bottom" data-line="" />
            )}
            <span className="label label--muted">{m.role}</span>
            <span className="member__name" data-split="">
              {split(m.name, "words", true)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function TaglineMarquee() {
  return <Marquee items={TAGLINES} variant="light" />;
}

export function Join() {
  return (
    <section id="join" className="join">
      <Logo
        className="join__logo"
        data-join-logo=""
        useProps={{ fill: "url(#ls-silver)", stroke: "#f2f1ee", strokeWidth: 0.7, "data-draw": "" }}
      />
      <h2 className="join__title" data-split="">
        {split(
          <>
            Join
            <br />
            the den
          </>,
          "words",
          true,
        )}
      </h2>
      <p className="lede" data-fade="">
        Membership runs through the Students&apos; Union. One click, and you have a crew for the
        rest of uni.
      </p>
      <div className="join__ctas label" data-fade="">
        <a
          href={LINKS.membership}
          target="_blank"
          rel="noopener noreferrer"
          className="pill pill--lg pill--solid"
          data-magnetic=""
        >
          Become a member â†—
        </a>
        <a
          href={LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="pill pill--lg pill--ghost"
          data-magnetic=""
        >
          Instagram â†—
        </a>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer" data-footer="">
      <div className="footer__cols label">
        <div className="footer__col">
          <span>Find us</span>
          <span>RHUL Gym, Egham</span>
          <span>Surrey TW20 0EX</span>
        </div>
        <div className="footer__col">
          <span>Say hi</span>
          <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a>
          <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer">
            {LINKS.instagramHandle}
          </a>
        </div>
        <div className="footer__col">
          <span>Train</span>
          {SESSIONS.map((s) => (
            <span key={s.short}>
              {s.short.charAt(0) + s.short.slice(1).toLowerCase()} {s.range}
            </span>
          ))}
        </div>
        <a href="#top" className="footer__top pill" data-magnetic="">
          Back to top â†‘
        </a>
      </div>
      <div className="footer__word" data-chars="" aria-label="LIFT SOC" role="img">
        {split("LIFT SOC", "chars")}
      </div>
      <div className="footer__legal label label--muted">
        <span>Â© 2026 RHUL Lifting Society</span>
        <span>A Royal Holloway Students&apos; Union society</span>
      </div>
    </footer>
  );
}
