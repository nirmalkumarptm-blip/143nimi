/* ==========================================================================
   ACCEPT MY 143 — script.js

   ┌──────────────────────────────────────────────────────────────────────┐
   │  1. PERSONALIZE HERE  (this is the only part you need to edit)       │
   └──────────────────────────────────────────────────────────────────────┘
   - Any text field left empty ("") falls back to a tasteful built-in default.
   - Plain text only. Quotes inside text: use ’ or escape them as \"
   - In any text you can write {recipient} or {sender}; they are replaced
     with the names below (or with "You" / "Someone special" if empty).
   - Nothing you type here is sent anywhere. The site has no backend and
     stores nothing about the visitor.
   ========================================================================== */
const CONFIG = {
  // Who is this from, and who is it for? (e.g. "Alex" and "Sam")
  senderName: "",        // empty → "Someone special"
  recipientName: "",     // empty → "You"

  // Browser tab title and the big glowing title on the landing page
  siteTitle: "Accept My 143",

  // Landing page
  landingHeading: "Someone Has a Question for You…",
  landingSubtitle: "Three little numbers. One big feeling. A question from my heart.",

  // The letter. Leave a blank line between paragraphs.
  // The first paragraph is shown as the greeting.
  message: `Hey {recipient},

There’s something I’ve been wanting to tell you for a while.

Some people come into our lives and make ordinary moments feel extraordinary. Your smile, your presence, and the little things about you have a way of making my day better.

I don’t know what the future holds, but I know that what I feel is genuine.

So today, I want to ask you something from my heart…`,

  // The proposal. If recipientName is set, it is added to the question
  // automatically ("Will You Accept My Love, Sam?").
  proposalQuestion: "Will You Accept My Love?",
  proposalSubtitle: "No pressure, no expectations. Just a little piece of my heart, hoping to make you smile.",

  // After "Yes, I Accept Your Love"
  acceptTitle: "You Just Made My Heart Smile!",
  acceptMessage: "Thank you for giving this little love story a chance. Whatever comes next, this moment will always be special.",

  // After "Let Me Think"
  thinkMessage: "Take your time. Your feelings matter, and there’s no rush.",

  // Optional background music. Leave "" for no music (the music button is then hidden).
  // Example: "assets/music.mp3". Music only starts when the visitor taps the button.
  musicUrl: "",

  // Typewriter speed in milliseconds per character (lower = faster, 8–80)
  typewriterSpeed: 26
};

/* ==========================================================================
   2. EVERYTHING BELOW IS THE ENGINE — no need to edit
   ========================================================================== */
(() => {
  "use strict";

  /* ---------- Built-in fallbacks (used when a CONFIG field is empty) ---------- */
  const DEFAULTS = {
    siteTitle: "Accept My 143",
    landingHeading: "Someone Has a Question for You…",
    landingSubtitle: "Three little numbers. One big feeling. A question from my heart.",
    message: "Hey {recipient},\n\nThere’s something I’ve been wanting to tell you for a while.\n\nSome people come into our lives and make ordinary moments feel extraordinary. Your smile, your presence, and the little things about you have a way of making my day better.\n\nI don’t know what the future holds, but I know that what I feel is genuine.\n\nSo today, I want to ask you something from my heart…",
    proposalQuestion: "Will You Accept My Love?",
    proposalSubtitle: "No pressure, no expectations. Just a little piece of my heart, hoping to make you smile.",
    acceptTitle: "You Just Made My Heart Smile!",
    acceptMessage: "Thank you for giving this little love story a chance. Whatever comes next, this moment will always be special.",
    thinkMessage: "Take your time. Your feelings matter, and there’s no rush."
  };

  const HEART_PATH = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";
  const PALETTE = ["#ff3d9a", "#ff4d6d", "#ff7ab8", "#cdb8ff", "#fff1ea"];

  /* ---------- Small helpers ---------- */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const clean = (value, fallback) => (typeof value === "string" && value.trim() ? value.trim() : fallback);

  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reduced = () => reduceMotionQuery.matches;

  /* ---------- Settings (CONFIG + fallbacks) ---------- */
  const senderName = clean(CONFIG.senderName, "");
  const recipientName = clean(CONFIG.recipientName, "");
  const senderLabel = senderName || "Someone special";
  const recipientLabel = recipientName || "You";

  const fill = (text) => text.replace(/\{recipient\}/gi, recipientLabel).replace(/\{sender\}/gi, senderLabel);

  // Adds the recipient's name before the closing punctuation, e.g. "Will You Accept My Love?" → "Will You Accept My Love, Sam?"
  const withName = (text) => {
    if (/\{recipient\}/i.test(text)) return fill(text);
    if (!recipientName) return text;
    const match = text.match(/^(.*?)\s*([?!.…]+)\s*$/);
    return match ? `${match[1]}, ${recipientName}${match[2]}` : `${text}, ${recipientName}`;
  };

  const settings = {
    siteTitle: clean(CONFIG.siteTitle, DEFAULTS.siteTitle),
    landingHeading: withName(clean(CONFIG.landingHeading, DEFAULTS.landingHeading)),
    landingSubtitle: fill(clean(CONFIG.landingSubtitle, DEFAULTS.landingSubtitle)),
    letter: fill(clean(CONFIG.message, DEFAULTS.message))
      .split(/\n\s*\n/)
      .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
      .filter(Boolean),
    proposalQuestion: withName(clean(CONFIG.proposalQuestion, DEFAULTS.proposalQuestion)),
    proposalSubtitle: fill(clean(CONFIG.proposalSubtitle, DEFAULTS.proposalSubtitle)),
    acceptTitle: fill(clean(CONFIG.acceptTitle, DEFAULTS.acceptTitle)),
    acceptMessage: fill(clean(CONFIG.acceptMessage, DEFAULTS.acceptMessage)),
    thinkMessage: fill(clean(CONFIG.thinkMessage, DEFAULTS.thinkMessage)),
    musicUrl: clean(CONFIG.musicUrl, ""),
    typeSpeed: Math.min(80, Math.max(8, Number(CONFIG.typewriterSpeed) || 26))
  };

  /* ---------- Element references ---------- */
  const el = {
    app: $("#app"),
    bloom: $("#bloom"),
    hero: $("#hero"),
    heroContent: $("#heroContent"),
    heroLine: $("#heroLine"),
    siteTitle: $("#siteTitle"),
    heroSub: $("#heroSub"),
    openBtn: $("#openBtn"),
    scrollCue: $("#scrollCue"),
    letter: $("#letter"),
    letterText: $("#letterText"),
    letterFull: $("#letterFull"),
    letterSign: $("#letterSign"),
    skipBtn: $("#skipBtn"),
    letterNext: $("#letterNext"),
    decode: $("#decode"),
    decodeItems: $$(".decode-item"),
    decodeFinal: $("#decodeTitle"),
    decodeTag: $("#decodeTag"),
    decodeBurst: $("#decodeBurst"),
    decodeNext: $("#decodeNext"),
    proposal: $("#proposal"),
    proposalTitle: $("#proposalTitle"),
    proposalSub: $("#proposalSub"),
    yesBtn: $("#yesBtn"),
    thinkBtn: $("#thinkBtn"),
    thinkNote: $("#thinkNote"),
    footerReplay: $("#footerReplay"),
    celebration: $("#celebration"),
    celebCard: $("#celebCard"),
    celebTitle: $("#celebTitle"),
    celebMsg: $("#celebMsg"),
    replayBtn: $("#replayBtn"),
    closeCelebBtn: $("#closeCelebBtn"),
    confetti: $("#confetti"),
    musicBtn: $("#musicBtn"),
    toast: $("#toast"),
    heartsField: $("#heartsField"),
    stars: [$("#starsA"), $("#starsB"), $("#starsC")]
  };

  /* ---------- Timers (so Replay can cancel anything in flight) ---------- */
  const sequenceTimers = new Set();
  const later = (fn, ms) => {
    const id = setTimeout(() => { sequenceTimers.delete(id); fn(); }, ms);
    sequenceTimers.add(id);
    return id;
  };
  const clearSequence = () => { sequenceTimers.forEach(clearTimeout); sequenceTimers.clear(); };

  /* ---------- Misc UI helpers ---------- */
  let toastTimer = 0;
  function toast(message) {
    el.toast.textContent = message;
    el.toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove("is-on"), 3800);
  }

  function restartClass(node, className) {
    node.classList.remove(className);
    void node.offsetWidth; // force reflow so the animation restarts
    node.classList.add(className);
  }

  function showButton(btn) {
    btn.hidden = false;
    if (!reduced()) restartClass(btn, "appear");
  }

  function scrollToEl(node) {
    node.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
  }

  // Reveals a hidden scene with an entrance animation, moves focus to it, and scrolls it into view.
  function revealScene(node) {
    node.hidden = false;
    if (!reduced()) restartClass(node, "is-entering");
    try { node.focus({ preventScroll: true }); } catch (_) { /* older browsers */ }
    scrollToEl(node);
  }

  /* ---------- Personalize the page text ---------- */
  function personalize() {
    document.title = settings.siteTitle;
    el.heroLine.textContent = settings.landingHeading;
    el.siteTitle.textContent = settings.siteTitle;
    el.heroSub.textContent = settings.landingSubtitle;
    el.proposalTitle.textContent = settings.proposalQuestion;
    el.proposalSub.textContent = settings.proposalSubtitle;
    el.celebTitle.textContent = settings.acceptTitle;
    el.celebMsg.textContent = settings.acceptMessage;
  }

  /* ==========================================================================
     Background: stars, floating hearts, cursor glow
     ========================================================================== */
  function buildStars() {
    const small = window.innerWidth < 640;
    const counts = small ? [30, 22, 10] : [54, 40, 18];
    const colors = [
      ["rgba(255,241,234,0.9)", "rgba(205,184,255,0.85)"],
      ["rgba(255,241,234,0.7)", "rgba(255,122,184,0.8)"],
      ["rgba(255,255,255,0.95)", "rgba(255,122,184,0.9)", "rgba(205,184,255,0.9)"]
    ];
    el.stars.forEach((layer, i) => {
      const shadows = [];
      for (let n = 0; n < counts[i]; n++) {
        shadows.push(`${rand(0, 100).toFixed(1)}vw ${rand(0, 100).toFixed(1)}vh 0 0 ${pick(colors[i])}`);
      }
      layer.style.boxShadow = shadows.join(",");
    });
  }

  function buildFloatingHearts() {
    const count = window.innerWidth < 640 ? 9 : 16;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const heart = document.createElement("span");
      heart.className = "float-heart";
      const duration = rand(16, 30);
      heart.style.setProperty("--x", `${rand(2, 96).toFixed(1)}%`);
      heart.style.setProperty("--s", `${rand(10, 30).toFixed(0)}px`);
      heart.style.setProperty("--c", pick(["#ff3d9a", "#ff4d6d", "#cdb8ff", "#ff7ab8"]));
      heart.style.setProperty("--o", rand(0.12, 0.34).toFixed(2));
      heart.style.setProperty("--d", `${duration.toFixed(1)}s`);
      heart.style.setProperty("--delay", `${(-rand(0, duration)).toFixed(1)}s`);
      heart.style.setProperty("--sway", `${rand(-40, 40).toFixed(0)}px`);
      frag.appendChild(heart);
    }
    el.heartsField.appendChild(frag);
  }

  // Soft glow that follows the mouse (desktop with a real mouse only; skipped for reduced motion)
  function setupCursorGlow() {
    if (reduced() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);

    let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let x = tx, y = ty, raf = 0;

    const tick = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      glow.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0;
    };

    window.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX; ty = e.clientY;
      glow.style.opacity = "1";
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
    document.addEventListener("mouseleave", () => { glow.style.opacity = "0"; });
  }

  /* ==========================================================================
     Heart bursts (used when 143 — I LOVE YOU appears)
     ========================================================================== */
  function burstHearts(container, count) {
    if (reduced()) return;
    for (let i = 0; i < count; i++) {
      const heart = document.createElement("span");
      heart.className = "burst-heart";
      const angle = -Math.PI * rand(0.08, 0.92); // fans upward
      const distance = rand(90, 230);
      heart.style.setProperty("--dx", `${(Math.cos(angle) * distance * 1.1).toFixed(0)}px`);
      heart.style.setProperty("--dy", `${(Math.sin(angle) * distance).toFixed(0)}px`);
      heart.style.setProperty("--r", `${rand(-40, 40).toFixed(0)}deg`);
      heart.style.setProperty("--s", `${rand(10, 24).toFixed(0)}px`);
      heart.style.setProperty("--t", `${rand(1.5, 2.6).toFixed(2)}s`);
      heart.style.setProperty("--c", pick(PALETTE));
      heart.addEventListener("animationend", () => heart.remove());
      container.appendChild(heart);
    }
  }

  /* ==========================================================================
     Letter: typewriter with "show it all" option
     ========================================================================== */
  const typer = { paras: [], pi: 0, ci: 0, timer: 0, done: false, userScrolled: false };
  const caret = document.createElement("span");
  caret.className = "caret";

  function buildLetter() {
    el.letterText.textContent = "";
    el.letterFull.textContent = "";
    typer.paras = settings.letter.map((text, i) => {
      const p = document.createElement("p");
      if (i === 0 && /,$/.test(text)) p.className = "greeting";
      const typed = document.createElement("span");
      typed.className = "t";
      const rest = document.createElement("span");
      rest.className = "u"; // invisible text reserves the final layout so nothing jumps while typing
      rest.textContent = text;
      p.append(typed, rest);
      el.letterText.appendChild(p);

      const sr = document.createElement("p"); // full text for screen readers
      sr.textContent = text;
      el.letterFull.appendChild(sr);
      return { text, typed, rest, p };
    });
    typer.pi = 0;
    typer.ci = 0;
    typer.done = false;
    typer.userScrolled = false;
    el.letterSign.textContent = `With love, ${senderLabel}`;
    el.letterSign.classList.remove("is-on");
    el.letterNext.hidden = true;
    el.letterNext.classList.remove("appear");
    el.skipBtn.hidden = false;
  }

  function stopTyping() {
    clearTimeout(typer.timer);
    typer.timer = 0;
  }

  function placeCaret() {
    const para = typer.paras[typer.pi];
    if (para) para.p.insertBefore(caret, para.rest);
  }

  function followCaret() {
    if (typer.userScrolled || reduced()) return;
    const bottom = caret.getBoundingClientRect().bottom;
    const limit = window.innerHeight - 110;
    if (bottom > limit) window.scrollBy({ top: Math.min(bottom - limit + 40, 220), behavior: "smooth" });
  }

  function typeStep() {
    const para = typer.paras[typer.pi];
    if (!para) { finishLetter(false); return; }

    typer.ci += 1;
    para.typed.textContent = para.text.slice(0, typer.ci);
    para.rest.textContent = para.text.slice(typer.ci);

    let delay = settings.typeSpeed;
    const ch = para.text.charAt(typer.ci - 1);

    if (typer.ci >= para.text.length) {
      typer.pi += 1;
      typer.ci = 0;
      placeCaret();
      followCaret();
      delay = settings.typeSpeed * 18; // pause between paragraphs
    } else if (/[.!?…]/.test(ch)) {
      delay = settings.typeSpeed * 9;
    } else if (/[,;:—]/.test(ch)) {
      delay = settings.typeSpeed * 4;
    } else if (typer.ci % 28 === 0) {
      followCaret();
    }
    typer.timer = setTimeout(typeStep, delay);
  }

  function startLetter() {
    stopTyping();
    if (typer.done) return;
    if (reduced()) { finishLetter(false); return; }
    placeCaret();
    typer.timer = setTimeout(typeStep, 900);
  }

  function finishLetter(focusNext) {
    stopTyping();
    typer.paras.forEach((para) => {
      para.typed.textContent = para.text;
      para.rest.textContent = "";
    });
    caret.remove();
    typer.done = true;
    el.letterSign.classList.add("is-on");
    el.skipBtn.hidden = true;
    showButton(el.letterNext);
    if (focusNext) el.letterNext.focus({ preventScroll: true });
  }

  /* ==========================================================================
     143 reveal
     ========================================================================== */
  function resetDecode() {
    el.decodeItems.forEach((item) => item.classList.remove("is-on", "is-solved"));
    el.decodeFinal.classList.remove("is-on");
    el.decodeTag.classList.remove("is-on");
    el.decodeNext.hidden = true;
    el.decodeNext.classList.remove("appear");
    el.decodeBurst.textContent = "";
  }

  function playDecode() {
    resetDecode();
    if (reduced()) {
      el.decodeItems.forEach((item) => item.classList.add("is-on", "is-solved"));
      el.decodeFinal.classList.add("is-on");
      el.decodeTag.classList.add("is-on");
      el.decodeNext.hidden = false;
      return;
    }
    const gap = 1150;
    el.decodeItems.forEach((item, i) => {
      later(() => item.classList.add("is-on"), 300 + i * gap);
      later(() => item.classList.add("is-solved"), 300 + i * gap + 550);
    });
    later(() => {
      el.decodeFinal.classList.add("is-on");
      burstHearts(el.decodeBurst, window.innerWidth < 640 ? 14 : 22);
    }, 300 + el.decodeItems.length * gap + 300);
    later(() => el.decodeTag.classList.add("is-on"), 4900);
    later(() => showButton(el.decodeNext), 5700);
  }

  /* ==========================================================================
     Heart confetti (canvas)
     ========================================================================== */
  const confetti = (() => {
    const canvas = el.confetti;
    const ctx = canvas.getContext("2d");
    const heartShape = new Path2D(HEART_PATH);
    let parts = [], raf = 0, last = 0, rainUntil = 0, w = 0, h = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function make(x, y, angle, speed) {
      return {
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: rand(12, 26),
        wob: rand(0, 6.28),
        wobSpeed: rand(0.03, 0.09),
        color: pick(PALETTE),
        age: 0,
        ttl: rand(3200, 5200)
      };
    }

    function fan(x, y, count, center, spread, minSpeed, maxSpeed) {
      for (let i = 0; i < count; i++) {
        parts.push(make(x, y, center + rand(-spread / 2, spread / 2), rand(minSpeed, maxSpeed)));
      }
    }

    function frame(now) {
      const dt = Math.min(40, now - last) / 16.67;
      last = now;
      ctx.clearRect(0, 0, w, h);

      if (now < rainUntil && Math.random() < 0.55) {
        parts.push(make(rand(0, w), -24, Math.PI / 2 + rand(-0.4, 0.4), rand(1, 3)));
      }

      const drag = Math.pow(0.985, dt);
      parts = parts.filter((p) => p.age < p.ttl && p.y < h + 40);
      for (const p of parts) {
        p.vy += 0.16 * dt;
        p.vx *= drag;
        p.wob += p.wobSpeed * dt;
        p.x += p.vx * dt + Math.sin(p.wob) * 0.6;
        p.y += p.vy * dt;
        p.age += dt * 16.67;

        const fade = Math.min(1, (p.ttl - p.age) / 700);
        ctx.save();
        ctx.globalAlpha = Math.max(0, fade);
        ctx.translate(p.x, p.y);
        ctx.rotate(Math.sin(p.wob) * 0.5);
        ctx.scale(p.size / 24, p.size / 24);
        ctx.translate(-12, -12);
        ctx.fillStyle = p.color;
        ctx.fill(heartShape);
        ctx.restore();
      }

      if (parts.length === 0 && now >= rainUntil) {
        ctx.clearRect(0, 0, w, h);
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(frame);
    }

    return {
      launch() {
        if (reduced()) return; // celebration overlay still appears; just no motion
        resize();
        const small = w < 640;
        fan(w * 0.5, h * 0.55, small ? 44 : 78, -Math.PI / 2, Math.PI * 1.1, 6, 15);
        fan(0, h * 0.85, small ? 16 : 30, -Math.PI / 3, 0.7, 9, 17);
        fan(w, h * 0.85, small ? 16 : 30, (-2 * Math.PI) / 3, 0.7, 9, 17);
        rainUntil = performance.now() + 2600;
        if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
      },
      stop() {
        cancelAnimationFrame(raf);
        raf = 0;
        parts = [];
        ctx.clearRect(0, 0, w || canvas.width, h || canvas.height);
      },
      resize() { if (raf) resize(); }
    };
  })();

  /* ==========================================================================
     Music (optional; only starts after the visitor taps the button)
     ========================================================================== */
  function setupMusic() {
    if (!settings.musicUrl) { el.musicBtn.hidden = true; return; }
    el.musicBtn.hidden = false;

    let audio = null;
    let playing = false;

    const setState = (on) => {
      playing = on;
      el.musicBtn.setAttribute("aria-pressed", String(on));
      const label = on ? "Pause background music" : "Play background music";
      el.musicBtn.setAttribute("aria-label", label);
      el.musicBtn.title = label;
    };

    el.musicBtn.addEventListener("click", async () => {
      if (!audio) {
        audio = new Audio();
        audio.loop = true;
        audio.volume = 0.5;
        audio.preload = "none";
        audio.src = settings.musicUrl;
        audio.addEventListener("error", () => {
          setState(false);
          toast("The music file could not be loaded.");
        });
      }
      if (playing) { audio.pause(); setState(false); return; }
      try {
        await audio.play();
        setState(true);
      } catch (_) {
        setState(false);
        toast("The music could not be played.");
      }
    });
  }

  /* ==========================================================================
     Celebration overlay (accessible dialog)
     ========================================================================== */
  let lastFocus = null;

  function onDialogKey(e) {
    if (e.key === "Escape") { e.preventDefault(); closeCelebration(true); return; }
    if (e.key !== "Tab") return;
    const first = el.replayBtn;
    const last = el.closeCelebBtn;
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === el.celebCard)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
    else if (active !== first && active !== last) { e.preventDefault(); first.focus(); }
  }

  function openCelebration() {
    lastFocus = document.activeElement;
    el.celebration.hidden = false;
    el.app.inert = true;
    el.app.setAttribute("aria-hidden", "true");
    el.celebCard.focus({ preventScroll: true });
    document.addEventListener("keydown", onDialogKey);
  }

  function closeCelebration(restoreFocus) {
    if (el.celebration.hidden) return;
    el.celebration.hidden = true;
    el.app.inert = false;
    el.app.removeAttribute("aria-hidden");
    document.removeEventListener("keydown", onDialogKey);
    if (restoreFocus && lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }

  /* ==========================================================================
     Story flow
     ========================================================================== */
  const state = { step: 0, busy: false }; // 0 landing · 1 letter · 2 meaning · 3 proposal

  function openHeart() {
    if (state.step >= 1) { scrollToEl(el.letter); return; }
    if (state.busy) return;
    state.busy = true;

    const go = () => {
      state.step = 1;
      state.busy = false;
      revealScene(el.letter);
      startLetter();
      later(() => el.heroContent.classList.remove("is-leaving"), 1500);
    };

    if (reduced()) { go(); return; }
    el.heroContent.classList.add("is-leaving");
    restartClass(el.bloom, "is-active");
    later(go, 700);
  }

  function goToMeaning() {
    if (state.step >= 2) { scrollToEl(el.decode); return; }
    state.step = 2;
    revealScene(el.decode);
    later(playDecode, 900);
  }

  function goToProposal() {
    if (state.step >= 3) { scrollToEl(el.proposal); return; }
    state.step = 3;
    revealScene(el.proposal);
  }

  function accept() {
    openCelebration();
    confetti.launch();
  }

  function think() {
    el.thinkNote.classList.remove("is-on");
    el.thinkNote.textContent = "";
    later(() => {
      el.thinkNote.textContent = settings.thinkMessage;
      el.thinkNote.classList.add("is-on");
    }, 60);
  }

  function replay() {
    stopTyping();
    clearSequence();
    confetti.stop();
    closeCelebration(false);

    state.step = 0;
    state.busy = false;

    [el.letter, el.decode, el.proposal].forEach((scene) => {
      scene.hidden = true;
      scene.classList.remove("is-entering");
    });
    resetDecode();
    buildLetter();
    el.thinkNote.classList.remove("is-on");
    el.thinkNote.textContent = "";
    el.heroContent.classList.remove("is-leaving");
    if (!reduced()) restartClass(el.heroContent, "is-intro");

    const root = document.documentElement;
    root.style.scrollBehavior = "auto"; // jump to the top instantly, not with a long smooth scroll
    window.scrollTo(0, 0);
    root.style.scrollBehavior = "";
    el.openBtn.focus({ preventScroll: true });
  }

  /* ==========================================================================
     Wire everything up
     ========================================================================== */
  function init() {
    personalize();
    buildStars();
    buildFloatingHearts();
    buildLetter();
    setupCursorGlow();
    setupMusic();

    el.openBtn.addEventListener("click", openHeart);
    el.scrollCue.addEventListener("click", openHeart);
    el.skipBtn.addEventListener("click", () => finishLetter(true));
    el.letterNext.addEventListener("click", goToMeaning);
    el.decodeNext.addEventListener("click", goToProposal);
    el.yesBtn.addEventListener("click", accept);
    el.thinkBtn.addEventListener("click", think);
    el.replayBtn.addEventListener("click", replay);
    el.footerReplay.addEventListener("click", replay);
    el.closeCelebBtn.addEventListener("click", () => closeCelebration(true));
    el.celebration.addEventListener("click", (e) => { if (e.target === el.celebration) closeCelebration(true); });

    // If the visitor scrolls on their own while the letter types, stop auto-following the caret.
    const markScrolled = () => { typer.userScrolled = true; };
    window.addEventListener("wheel", markScrolled, { passive: true });
    window.addEventListener("touchmove", markScrolled, { passive: true });

    window.addEventListener("resize", () => confetti.resize());
  }

  init();
})();
