/* NestEgg Landingpage · Interaction Layer */

(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const sections = [
    { id: "hero", label: "Hero", query: "Startseite" },
    { id: "problem", label: "Problem", query: "Warum junge Menschen sparen aufschieben" },
    { id: "solution", label: "Lösung", query: "Flow Ziel Ausgaben Sparimpuls" },
    { id: "product", label: "Produktdemo", query: "Chat Demo Sparcoach" },
    { id: "market", label: "Markt", query: "TAM SAM SOM Trends" },
    { id: "business", label: "Business Model", query: "Premium B2B Partner Revenue" },
    { id: "competition", label: "Wettbewerb", query: "Matrix Neobroker Banken Apps" },
    { id: "trust", label: "Compliance", query: "BaFin Datenschutz Open Banking" },
    { id: "financials", label: "Finanzen", query: "Kapitalbedarf Umsatz EBITDA" },
    { id: "roadmap", label: "Roadmap", query: "MVP Skalierung DACH White Label" },
    { id: "depth", label: "Tiefe", query: "Personas SWOT Risiko Heatmap" },
    { id: "final", label: "Abschluss", query: "Pitch Fazit CTA" },
  ];

  const models = {
    b2c: {
      title: "B2C Premium",
      text: "Freemium-Einstieg für Reichweite. Premium für erweiterte Insights, Zielplanung und Automatisierung zu 4,99 € pro Monat.",
      kpi: "4,99 €/Monat",
    },
    b2b: {
      title: "B2B2C-Lizenzen",
      text: "Hochschulen, Arbeitgeber und Finanzpartner können NestEgg als Financial-Wellbeing-Angebot für junge Zielgruppen einsetzen.",
      kpi: "1–3 €/aktiver Nutzer",
    },
    partner: {
      title: "Partner-Revenue",
      text: "Investment- und Produktpfade werden nicht selbst reguliert, sondern über regulierte Broker-, Bank- oder Robo-Advisor-Partner angebunden.",
      kpi: "Revenue Share",
    },
  };

  const personas = {
    lena: {
      name: "Lena, 22",
      role: "Studentin",
      pain: "Unregelmäßige Ausgaben und wenig Überblick.",
      goal: "Notgroschen aufbauen, ohne eine komplexe Finanz-App zu lernen.",
    },
    max: {
      name: "Max, 27",
      role: "Berufseinsteiger",
      pain: "Gehalt ist da, aber Sparroutinen fehlen.",
      goal: "Regelmäßig investieren, aber mit kleinen sicheren Schritten starten.",
    },
    sara: {
      name: "Sara, 31",
      role: "Junge Angestellte",
      pain: "Will mehr Struktur, aber keine klassische Beratung.",
      goal: "Sparziele, Budgets und später ETF-Pfad in einem ruhigen System.",
    },
  };

  function formatEuro(value) {
    return new Intl.NumberFormat("de-DE", {
      maximumFractionDigits: 0,
    }).format(value);
  }

  function scrollToId(id) {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    document.body.classList.remove("nav-open");
  }

  function setupIntro() {
    const intro = $("#intro");
    const enter = $("#enterExperience");

    if (!intro || !enter) return;

    enter.addEventListener("click", () => {
      intro.classList.add("is-hidden");
      document.body.classList.remove("intro-locked");
      window.setTimeout(() => scrollToId("hero"), 120);
      window.setTimeout(() => replayChat(), 600);
    });

    $$(".open-plan").forEach((btn) => {
      btn.addEventListener("click", () => openPlan());
    });
  }

  function setupNavigation() {
    const navLinks = $$("#sectionNav a");
    const progress = $("#scrollProgress");
    const topProgress = $("#topProgress");
    const miniMap = $("#miniMap");

    if (miniMap) {
      miniMap.innerHTML = sections.map(() => "<span><i></i></span>").join("");
    }

    navLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const id = link.getAttribute("href").replace("#", "");
        scrollToId(id);
      });
    });

    $$("[data-scroll]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.scroll?.replace("#", "");
        if (target) scrollToId(target);
      });
    });

    $("#mobileMenu")?.addEventListener("click", () => {
      document.body.classList.toggle("nav-open");
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((link) => link.classList.toggle("active", link.dataset.section === id));
      });
    }, { root: null, rootMargin: "-45% 0px -45% 0px", threshold: 0.01 });

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const pct = height > 0 ? Math.min(1, Math.max(0, scrollTop / height)) : 0;
      const width = `${pct * 100}%`;

      if (progress) progress.style.width = width;
      if (topProgress) topProgress.style.width = width;

      const miniBars = $$("#miniMap i");
      sections.forEach((section, index) => {
        const el = document.getElementById(section.id);
        const bar = miniBars[index];
        if (!el || !bar) return;

        const rect = el.getBoundingClientRect();
        const sectionProgress = 1 - Math.min(1, Math.max(0, rect.bottom / (rect.height + window.innerHeight)));
        bar.style.width = `${Math.max(0, Math.min(1, sectionProgress)) * 100}%`;
      });
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
  }

  function setupRevealAnimations() {
    const revealEls = $$(".reveal");

    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      revealEls.forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 86%",
          },
        });
      });

      gsap.utils.toArray(".flow-step").forEach((el, index) => {
        gsap.fromTo(el,
          { y: 40, scale: 0.96 },
          {
            y: 0,
            scale: 1,
            duration: 0.75,
            delay: index * 0.04,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 82%" },
          }
        );
      });

      gsap.to(".hero-glow", {
        yPercent: 20,
        xPercent: -8,
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".floating-widget", {
        y: -28,
        stagger: 0.08,
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      ScrollTrigger.refresh();
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      }, { threshold: 0.12 });

      revealEls.forEach((el) => io.observe(el));
    }
  }

  function replayChat() {
    const messages = $$("#chatBody .msg, .mini-chat .msg");
    messages.forEach((msg) => msg.classList.remove("is-visible"));
    messages.forEach((msg, index) => {
      window.setTimeout(() => msg.classList.add("is-visible"), 220 + index * 420);
    });
  }

  function setupChatDemo() {
    $("#replayDemo")?.addEventListener("click", () => {
      scrollToId("hero");
      window.setTimeout(replayChat, 380);
    });

    replayChat();
  }

  function setupTabs() {
    const detail = $("#modelDetail");

    function renderModel(key) {
      const item = models[key] || models.b2c;
      if (!detail) return;
      detail.innerHTML = `
        <strong>${item.title}</strong>
        <p>${item.text}</p>
        <b>${item.kpi}</b>
      `;
    }

    $$(".model-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        $$(".model-tab").forEach((button) => button.classList.remove("active"));
        tab.classList.add("active");
        renderModel(tab.dataset.model);
      });
    });

    renderModel("b2c");

    const personaDetail = $("#personaDetail");

    function renderPersona(key) {
      const item = personas[key] || personas.lena;
      if (!personaDetail) return;
      personaDetail.innerHTML = `
        <strong>${item.name}</strong>
        <p><b>${item.role}</b></p>
        <p><span>Pain:</span> ${item.pain}</p>
        <p><span>Ziel:</span> ${item.goal}</p>
      `;
    }

    $$(".persona-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        $$(".persona-tab").forEach((button) => button.classList.remove("active"));
        tab.classList.add("active");
        renderPersona(tab.dataset.persona);
      });
    });

    renderPersona("lena");
  }

  function setupCounters() {
    const counters = $$("[data-counter]");
    const seen = new WeakSet();

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || seen.has(entry.target)) return;
        seen.add(entry.target);

        const el = entry.target;
        const target = Number(el.dataset.counter || 0);
        const start = performance.now();
        const duration = 1300;

        function tick(now) {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = formatEuro(Math.round(target * eased));
          if (t < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });

    counters.forEach((el) => io.observe(el));
  }

  function chartDefaults() {
    if (!window.Chart) return;

    Chart.defaults.color = "#a8b3bd";
    Chart.defaults.borderColor = "rgba(255,255,255,.09)";
    Chart.defaults.font.family = 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  }

  function makeCharts() {
    if (!window.Chart) return;
    chartDefaults();

    const market = $("#marketChart");
    if (market) {
      new Chart(market, {
        type: "line",
        data: {
          labels: ["2024", "2025", "2026", "2027", "2028"],
          datasets: [
            { label: "Open Banking", data: [100, 124, 148, 176, 205], borderColor: "#8bd3ff", tension: .38, fill: false },
            { label: "ETF-Sparen", data: [100, 118, 145, 175, 212], borderColor: "#6ef3b5", tension: .38, fill: false },
            { label: "AI Finance Tools", data: [100, 135, 168, 212, 260], borderColor: "#f4c95d", tension: .38, fill: false },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { labels: { boxWidth: 10 } } },
          scales: { y: { beginAtZero: false } },
        },
      });
    }

    const finance = $("#financeChart");
    if (finance) {
      new Chart(finance, {
        type: "bar",
        data: {
          labels: ["Jahr 1", "Jahr 2", "Jahr 3", "Jahr 4", "Jahr 5"],
          datasets: [
            { label: "Umsatz Mio. €", data: [0.02, 0.271, 1.161, 3.12, 7.4], backgroundColor: "rgba(110, 243, 181, .72)", borderColor: "#6ef3b5", borderWidth: 1 },
            { label: "EBITDA Mio. €", data: [-0.46, -0.734, -0.629, -0.13, 1.49], backgroundColor: "rgba(244, 201, 93, .66)", borderColor: "#f4c95d", borderWidth: 1 },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { labels: { boxWidth: 10 } } },
          scales: {
            y: {
              ticks: {
                callback: (value) => `${value} Mio.`,
              },
            },
          },
        },
      });
    }

    const funding = $("#fundingChart");
    if (funding) {
      new Chart(funding, {
        type: "doughnut",
        data: {
          labels: ["Produktentwicklung", "Team", "Marketing/Vertrieb", "Compliance/Recht", "Open Banking", "Betrieb/Tools", "Reserve"],
          datasets: [{
            data: [260, 230, 140, 120, 110, 45, 45],
            backgroundColor: [
              "#6ef3b5",
              "#8bd3ff",
              "#f4c95d",
              "#ffb86b",
              "#9ce6ff",
              "#b4f8d2",
              "#d9e3ea",
            ],
            borderColor: "rgba(7,16,24,.9)",
            borderWidth: 3,
          }],
        },
        options: {
          responsive: true,
          cutout: "62%",
          plugins: {
            legend: {
              position: "right",
              labels: { boxWidth: 10 },
            },
          },
        },
      });
    }
  }

  function setupPlanDrawer() {
    const drawer = $("#planDrawer");
    const close = $("#closePlan");

    window.openPlan = () => openPlan();

    function safeShowModal(dialog) {
      if (!dialog) return;
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    }

    close?.addEventListener("click", () => drawer?.close?.());
    drawer?.addEventListener("click", (event) => {
      const rect = drawer.getBoundingClientRect();
      const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!isInside) drawer.close?.();
    });

    window.openPlan = () => safeShowModal(drawer);
  }

  function openPlan() {
    const drawer = $("#planDrawer");
    if (!drawer) return;
    if (typeof drawer.showModal === "function") drawer.showModal();
    else drawer.setAttribute("open", "");
  }

  function setupCommandPalette() {
    const palette = $("#commandPalette");
    const input = $("#commandInput");
    const results = $("#commandResults");
    const trigger = $("#commandTrigger");

    function renderResults(term = "") {
      if (!results) return;
      const query = term.trim().toLowerCase();
      const filtered = sections.filter((item) => {
        return !query || `${item.label} ${item.query}`.toLowerCase().includes(query);
      });

      results.innerHTML = filtered.map((item) => `
        <div class="command-result" data-target="${item.id}">
          <span>${item.label}</span>
          <small>${item.query}</small>
        </div>
      `).join("");

      $$(".command-result", results).forEach((row) => {
        row.addEventListener("click", () => {
          closePalette();
          scrollToId(row.dataset.target);
        });
      });
    }

    function openPalette() {
      if (!palette || !input) return;
      palette.classList.add("is-open");
      palette.setAttribute("aria-hidden", "false");
      renderResults("");
      window.setTimeout(() => input.focus(), 40);
    }

    function closePalette() {
      if (!palette) return;
      palette.classList.remove("is-open");
      palette.setAttribute("aria-hidden", "true");
    }

    trigger?.addEventListener("click", openPalette);
    input?.addEventListener("input", () => renderResults(input.value));

    document.addEventListener("keydown", (event) => {
      const isCommand = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (isCommand) {
        event.preventDefault();
        openPalette();
      }

      if (event.key === "Escape") closePalette();
    });

    palette?.addEventListener("click", (event) => {
      if (event.target === palette) closePalette();
    });
  }

  function init() {
    setupIntro();
    setupNavigation();
    setupRevealAnimations();
    setupChatDemo();
    setupTabs();
    setupCounters();
    setupPlanDrawer();
    setupCommandPalette();

    if (document.readyState === "complete") makeCharts();
    else window.addEventListener("load", makeCharts, { once: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
