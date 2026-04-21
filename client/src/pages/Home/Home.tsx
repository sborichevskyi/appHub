import { useEffect, useRef, useState } from "react";
import "./Home.scss";

const slides = [
  {
    label: "Manual",
    title: "You stay in control",
    text: "Nothing is saved without your action.",
  },
  {
    label: "Capture",
    title: "Save jobs instantly",
    text: "No copy-paste. Just one click.",
  },
  {
    label: "Automation",
    title: "Everything organized",
    text: "Track your progress effortlessly.",
  },
];

export const Home: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0); // section 1
  const [scrollIndex, setScrollIndex] = useState(0); // slider

  const isAutoScrolling = useRef(false);

  // =========================
  // SECTION 1 (vertical)
  // =========================
  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const items = container.querySelectorAll<HTMLElement>(
      ".home__section_1--item",
    );

    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const progress = Math.min(
        Math.max((windowHeight - rect.top) / (windowHeight + rect.height), 0),
        1,
      );

      container.style.setProperty("--progress", `${progress * 100}%`);

      const lineOffset = 23;
      const maxHeight = rect.height * 0.7;
      const arrowY = lineOffset + Math.min(progress * rect.height, maxHeight);

      let active = 0;

      items.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();

        const itemCenter = itemRect.top - rect.top + itemRect.height / 2;

        if (arrowY >= itemCenter - 80 && arrowY <= itemCenter + 80) {
          active = index;
        }
      });

      setActiveIndex(active);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // =========================
  // SLIDER CORE LOGIC
  // =========================

  const getCardWidth = () => {
    const el = scrollRef.current;
    if (!el) return 0;
    const card = el.children[0] as HTMLElement;
    return card.offsetWidth;
  };

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;

    isAutoScrolling.current = true;

    const width = getCardWidth();

    el.scrollTo({
      left: index * width,
      behavior: "smooth",
    });

    setScrollIndex(index);

    // fallback unlock (smooth scroll safety)
    window.setTimeout(() => {
      isAutoScrolling.current = false;
    }, 3000);
  };

  // =========================
  // HANDLE SCROLL (user swipe)
  // =========================
  const handleScroll = () => {
    if (isAutoScrolling.current) return;

    const el = scrollRef.current;
    if (!el) return;

    const children = Array.from(el.children) as HTMLElement[];

    let closest = 0;
    let min = Infinity;

    const center = el.getBoundingClientRect().left + el.clientWidth / 2;

    children.forEach((child, i) => {
      const rect = child.getBoundingClientRect();
      const c = rect.left + rect.width / 2;

      const dist = Math.abs(center - c);

      if (dist < min) {
        min = dist;
        closest = i;
      }
    });

    setScrollIndex(closest);
  };

  // =========================
  // AUTOPLAY (safe)
  // =========================
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const total = slides.length;

    const interval = setInterval(() => {
      if (isAutoScrolling.current) return;

      const current = scrollIndex;
      const next = (current + 1) % total;

      isAutoScrolling.current = true;

      const card = el.children[0] as HTMLElement;
      const width = card.offsetWidth;

      el.scrollTo({
        left: next * width,
        behavior: "smooth",
      });

      setScrollIndex(next);
    }, 3000);

    return () => clearInterval(interval);
  }, [scrollIndex]);

  const unlock = () => {
    isAutoScrolling.current = false;
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let timeout: number | undefined;

    const onScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(unlock, 120);
    };

    el.addEventListener("scroll", onScroll);

    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="home">
      {/* ===================== SECTION 1 ===================== */}
      <section className="home__section_1">
        <h2>How it works</h2>

        <div ref={ref} className="home__section_1--progress">
          {["Add a job", "Track your progress", "Get hired!"].map(
            (title, idx) => (
              <div
                key={idx}
                className={`home__section_1--item ${
                  activeIndex === idx ? "is-active" : ""
                }`}
              >
                <h2>{title}</h2>
                <p>
                  {title === "Add a job" &&
                    "Sign up, fill in your profile, and we’ll do the rest."}
                  {title === "Track your progress" &&
                    "Keep all your applications in one place."}
                  {title === "Get hired!" &&
                    "Stay focused and move faster toward your next job."}
                </p>
              </div>
            ),
          )}
        </div>
      </section>

      {/* ===================== SECTION 2 ===================== */}
      <section className="home__section_2"></section>

      {/* ===================== SLIDER ===================== */}
      <section className="home__section_3">
        <h2>Where does your data come from?</h2>

        <div
          className="home__section_3__scroller"
          ref={scrollRef}
          onScroll={handleScroll}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`home__section_3__scroller--card ${
                scrollIndex === i ? "is-active" : ""
              }`}
            >
              <span className="card__label">{slide.label}</span>
              <h3 className="card__title">{slide.title}</h3>
              <p className="card__text">{slide.text}</p>
            </div>
          ))}
        </div>

        {/* DOTS */}
        <div className="home__section_3__dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`dot ${scrollIndex === i ? "is-active" : ""}`}
              onClick={() => scrollToIndex(i)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
