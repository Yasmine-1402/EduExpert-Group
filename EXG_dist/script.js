/* ─── EXG Premium Script ─── */

const chapters = Array.from(document.querySelectorAll(".chapter"));
const navItems = Array.from(document.querySelectorAll(".chapter-nav__item"));
const body = document.body;

const chapterThemeMap = new Map(
  chapters.map((chapter) => [chapter.id, chapter.dataset.theme])
);

/* ─── Nav Highlight ─── */
const setCurrentNav = (targetId) => {
  navItems.forEach((item) => {
    const isCurrent = item.getAttribute("href") === `#${targetId}`;
    item.classList.toggle("is-current", isCurrent);
  });
};

/* ─── Theme Switching ─── */
const setTheme = (theme) => {
  const isLightTheme =
    theme === "dawn" ||
    theme === "sand" ||
    theme === "fog";

  body.classList.toggle("is-dawn", isLightTheme);
};

/* ─── Active Chapter Observer ─── */
const observer = new IntersectionObserver(
  (entries) => {
    const activeEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!activeEntry) return;

    const { id } = activeEntry.target;
    setCurrentNav(id);
    setTheme(chapterThemeMap.get(id));
  },
  {
    threshold: [0.35, 0.5, 0.65, 0.8],
    rootMargin: "-10% 0px -20% 0px",
  }
);

chapters.forEach((chapter) => observer.observe(chapter));

/* ─── Growth Rail Progress ─── */
const updateGrowthRail = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  const vineHeight = Math.min(100, Math.max(0, progress * 100));
  const treeScale = 0.6 + progress * 0.55;

  document.documentElement.style.setProperty("--vine-height", `${vineHeight}%`);
  document.documentElement.style.setProperty("--tree-scale", `${treeScale}`);
};

window.addEventListener("scroll", updateGrowthRail, { passive: true });
window.addEventListener("resize", updateGrowthRail);
updateGrowthRail();



/* ─── Door Card Jump ─── */
document.querySelectorAll("[data-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.jump);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

/* ─── Scroll Reveal Animation ─── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -60px 0px",
  }
);

document.querySelectorAll(".reveal").forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index * 0.05, 0.3)}s`;
  revealObserver.observe(el);
});

/* ─── Impact Counter Animation ─── */
const animateCounter = (el) => {
  const target = parseInt(el.dataset.count, 10);
  if (isNaN(target)) return;

  const duration = 2200;
  const startTime = performance.now();

  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  const tick = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuart(progress);
    const current = Math.round(easedProgress * target);

    el.textContent = current.toLocaleString() + "+";

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll("[data-count]").forEach((el) => {
  counterObserver.observe(el);
});

/* ─── Floating Quotes ─── */
const quotes = [
  "Growth is a story people can feel.",
  "Every workshop leaves a branch behind.",
  "Impact should look like memory.",
  "Legacy is what keeps growing when we leave the room.",
];

const quoteBubble = document.createElement("div");
quoteBubble.className = "floating-quote";
document.body.appendChild(quoteBubble);

let quoteIndex = 0;
const cycleQuotes = () => {
  quoteBubble.textContent = `"${quotes[quoteIndex % quotes.length]}"`;
  quoteBubble.style.opacity = "1";
  quoteBubble.style.transform = "translateY(0)";
  setTimeout(() => {
    quoteBubble.style.opacity = "0";
    quoteBubble.style.transform = "translateY(0.8rem)";
  }, 3500);
  quoteIndex += 1;
};

cycleQuotes();
setInterval(cycleQuotes, 9000);

/* ─── Hero Parallax ─── */
const drifts = document.querySelectorAll(".hero__drift");
window.addEventListener(
  "scroll",
  () => {
    const scrollY = window.scrollY;
    if (scrollY > window.innerHeight) return;

    drifts.forEach((drift, i) => {
      const speed = 0.15 + i * 0.08;
      drift.style.transform = `translate3d(0, ${scrollY * speed}px, 0) scale(${
        1 + scrollY * 0.0002
      })`;
    });
  },
  { passive: true }
);