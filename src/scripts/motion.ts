import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// The `js` class is only set when the visitor has not asked for reduced motion.
// Without it, everything is rendered in its final state and we do nothing.
if (document.documentElement.classList.contains('js')) {
  gsap.registerPlugin(ScrollTrigger);
  init();
}

function init() {
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
  const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
    Array.from(root.querySelectorAll<T>(sel));

  // ----- Smooth scroll -----
  const lenis = new Lenis({ lerp: 0.1, anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // ----- Nav hides on the way down, returns on the way up -----
  const nav = $('.nav');
  lenis.on('scroll', ({ scroll, direction }: { scroll: number; direction: number }) => {
    nav?.classList.toggle('is-hidden', direction === 1 && scroll > 200);
  });

  // ----- Page intro: headline slides up, supporting details fade in -----
  const intro = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.15 });
  const introLines = $$('[data-intro] .line-inner');
  const introFades = $$('[data-hero-fade]');
  if (introLines.length) intro.to(introLines, { y: 0, duration: 1.5, stagger: 0.14 });
  if (introFades.length) intro.to(introFades, { opacity: 1, y: 0, duration: 1, stagger: 0.08 }, introLines.length ? '-=0.9' : 0);

  // ----- Home hero: the two name lines drift at different speeds -----
  if ($('.hero')) {
    const heroScroll = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('.hero-title .line:nth-child(1)', { yPercent: 45, ease: 'none', scrollTrigger: heroScroll });
    gsap.to('.hero-title .line:nth-child(2)', { yPercent: 20, ease: 'none', scrollTrigger: heroScroll });
    gsap.to('.hero-portrait', { yPercent: 14, ease: 'none', scrollTrigger: heroScroll });
    gsap.to('.hero-meta', { autoAlpha: 0, ease: 'none', scrollTrigger: { ...heroScroll, end: '40% top' } });

    const glow = $('.hero-glow');
    if (glow && finePointer) {
      gsap.set(glow, { x: innerWidth * 0.7, y: innerHeight * 0.3 });
      const gx = gsap.quickTo(glow, 'x', { duration: 1.2, ease: 'power3.out' });
      const gy = gsap.quickTo(glow, 'y', { duration: 1.2, ease: 'power3.out' });
      $('.hero')!.addEventListener('pointermove', (e) => {
        gx(e.clientX);
        gy(e.clientY + scrollY);
      });
    }
  }

  // ----- About: words light up as you read -----
  if ($('.statement')) {
    gsap.to('.statement .w', {
      opacity: 1,
      ease: 'none',
      stagger: 0.1,
      scrollTrigger: { trigger: '.statement', start: 'top 80%', end: 'bottom 50%', scrub: true },
    });
  }

  // ----- Generic fade-up reveals -----
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.08 }),
  });

  // ----- Line reveals further down the page -----
  $$('[data-lines]:not([data-intro])').forEach((el) => {
    gsap.to(el.querySelectorAll('.line-inner'), {
      y: 0,
      duration: 1.4,
      ease: 'power4.out',
      stagger: 0.12,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  // ----- Work heading drifts sideways -----
  if ($('.work-heading')) {
    gsap.fromTo(
      '.work-heading',
      { xPercent: 4 },
      {
        xPercent: -10,
        ease: 'none',
        scrollTrigger: { trigger: '.work-heading', start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  }

  // ----- Covers: wipe in, then move in layers as the page scrolls -----
  $$('.cover').forEach((cover) => {
    if (cover.closest('.showcase')) return; // the carousel animates its own covers
    gsap.to(cover, {
      clipPath: 'inset(0% 0 0 0)',
      duration: 1.5,
      ease: 'power4.out',
      scrollTrigger: { trigger: cover, start: 'top 85%', once: true },
    });

    const through = { trigger: cover, start: 'top bottom', end: 'bottom top', scrub: true };

    // Illustrations settle from a slight zoom to their full frame.
    const img = $('.cover-img', cover);
    if (img) {
      gsap.fromTo(
        img,
        { scale: 1.14 },
        { scale: 1, ease: 'none', scrollTrigger: { ...through, end: 'center center' } },
      );
    }

    // Posters: the mark and its backdrop travel in opposite directions.
    const art = $('.poster-art', cover);
    if (art) gsap.fromTo(art, { yPercent: 12 }, { yPercent: -12, ease: 'none', scrollTrigger: through });
    const glow = $('.poster-glow', cover);
    if (glow) gsap.fromTo(glow, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: through });
    const rings = $('.poster-rings', cover);
    if (rings) gsap.fromTo(rings, { scale: 0.92 }, { scale: 1.12, ease: 'none', scrollTrigger: through });

    // Dotesy: letters rise one by one, then keep a slow wave going.
    const letters = $$<SVGPathElement>('.dotesy-letter', cover);
    if (letters.length) {
      gsap
        .timeline({ scrollTrigger: { trigger: cover, start: 'top 80%', once: true } })
        .from(letters, { y: 70, opacity: 0, duration: 1.1, ease: 'power4.out', stagger: 0.08 }, 0.35)
        .add(() => {
          const wave = gsap.to(letters, {
            y: -9,
            duration: 1.5,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            stagger: { each: 0.16 },
          });
          ScrollTrigger.create({ trigger: cover, onToggle: (self) => (self.isActive ? wave.resume() : wave.pause()) });
        });
    }
  });

  // ----- Su Bu watches the pointer -----
  const pots = $$<SVGSVGElement>('.subu');
  if (pots.length && finePointer) {
    const trackers = pots.map((pot) => {
      const pupils = $<SVGGElement>('.subu-pupils', pot)!;
      return {
        pot,
        x: gsap.quickTo(pupils, 'x', { duration: 0.4, ease: 'power3.out' }),
        y: gsap.quickTo(pupils, 'y', { duration: 0.4, ease: 'power3.out' }),
      };
    });
    addEventListener('pointermove', (e) => {
      trackers.forEach(({ pot, x, y }) => {
        const r = pot.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height * 0.55);
        const dist = Math.hypot(dx, dy) || 1;
        const reach = Math.min(1, dist / 260) * 3;
        x((dx / dist) * reach);
        y((dy / dist) * reach);
      });
    });
  }

  // ----- Project decks: cards arrive tilted, straighten as they land, and
  // sink back slightly once the next card covers them -----
  const decks = $$('.deck').map((deck) => ({
    deck,
    cards: $$('.card', deck).map((card) => ({ card, inner: $('.card-inner', card)!, stick: 0, p: 0 })),
  }));
  const measureDecks = () => {
    decks.forEach(({ cards }) => cards.forEach((c) => (c.stick = parseFloat(getComputedStyle(c.card).top) || 0)));
  };
  const updateDecks = () => {
    const vh = innerHeight;
    decks.forEach(({ deck, cards }) => {
      const box = deck.getBoundingClientRect();
      if (box.bottom < -vh || box.top > vh * 2) return;
      cards.forEach((c) => {
        const top = c.card.getBoundingClientRect().top;
        c.p = gsap.utils.clamp(0, 1, (top - c.stick) / (vh - c.stick));
      });
      cards.forEach((c, i) => {
        const next = cards[i + 1];
        c.inner.style.setProperty('--p', c.p.toFixed(4));
        c.inner.style.setProperty('--c', next ? (1 - next.p).toFixed(4) : '0');
      });
    });
  };
  if (decks.length) {
    measureDecks();
    updateDecks();
    lenis.on('scroll', updateDecks);
    addEventListener('resize', () => {
      measureDecks();
      updateDecks();
    });
  }

  // ----- Cards play their drawings once they are properly on screen -----
  const seen = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        seen.unobserve(entry.target);
      });
    },
    { threshold: 0.45 },
  );
  $$('.card').forEach((card) => seen.observe(card));

  // ----- Reading progress along the top edge -----
  const progress = $('.progress');
  if (progress) {
    const setProgress = gsap.quickSetter(progress, 'scaleX');
    lenis.on('scroll', ({ progress: p }: { progress: number }) => setProgress(p));
  }

  // ----- Showcase carousel: auto-plays, pauses on hover, and can be driven
  // by the tabs, the arrows, the arrow keys or a swipe -----
  const showcase = $('.showcase');
  if (showcase) {
    const slides = $$('.slide', showcase);
    const tabs = $$('.showcase-tab', showcase);
    const fills = $$('.tab-fill', showcase);
    const SECONDS = 6;
    let current = -1;
    let timer: gsap.core.Tween | null = null;
    let hovering = false;
    let inView = false;

    const syncTimer = () => (hovering || !inView ? timer?.pause() : timer?.resume());

    const show = (target: number, dir = 1) => {
      const i = (target + slides.length) % slides.length;
      if (i === current) return;
      const prev = slides[current];
      const next = slides[i];
      current = i;

      tabs.forEach((tab, n) => {
        tab.classList.toggle('is-active', n === i);
        tab.setAttribute('aria-pressed', String(n === i));
      });

      if (prev) {
        gsap.killTweensOf(prev);
        gsap.to(prev, { autoAlpha: 0, duration: 0.35, ease: 'power2.out' });
      }

      // The cover wipes in from the side you are travelling towards.
      const from = dir > 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)';
      const cover = $('.cover', next);
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.set(next, { autoAlpha: 1, zIndex: 1 });
      if (prev) tl.set(prev, { zIndex: 0 }, 0);
      if (cover) tl.fromTo(cover, { clipPath: from }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1 }, 0);
      const img = $('.cover-img', next);
      if (img) tl.fromTo(img, { scale: 1.18 }, { scale: 1, duration: 1.6 }, 0);
      const art = $('.poster-art', next);
      if (art) tl.fromTo(art, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, 0.2);
      const letters = $$('.dotesy-letter', next);
      if (letters.length) tl.fromTo(letters, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.07 }, 0.25);
      tl.fromTo(
        $$('.slide-text > *', next),
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.07 },
        0.15,
      );

      timer?.kill();
      gsap.set(fills, { scaleX: 0 });
      timer = gsap.to(fills[i], { scaleX: 1, duration: SECONDS, ease: 'none', onComplete: () => show(current + 1) });
      syncTimer();
    };

    gsap.set(slides, { autoAlpha: 0 });
    ScrollTrigger.create({
      trigger: showcase,
      start: 'top 75%',
      end: 'bottom 20%',
      onToggle: (self) => {
        inView = self.isActive;
        if (current === -1 && inView) show(0);
        else syncTimer();
      },
    });

    tabs.forEach((tab, n) => tab.addEventListener('click', () => show(n, n > current ? 1 : -1)));
    $('[data-prev]', showcase)?.addEventListener('click', () => show(current - 1, -1));
    $('[data-next]', showcase)?.addEventListener('click', () => show(current + 1, 1));

    const stage = $('.showcase-stage', showcase)!;
    showcase.addEventListener('pointerenter', () => ((hovering = true), syncTimer()));
    showcase.addEventListener('pointerleave', () => ((hovering = false), syncTimer()));
    showcase.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') show(current + 1, 1);
      if (e.key === 'ArrowLeft') show(current - 1, -1);
    });

    let downX: number | null = null;
    stage.addEventListener('pointerdown', (e) => (downX = e.clientX));
    stage.addEventListener('pointerup', (e) => {
      if (downX === null) return;
      const dx = e.clientX - downX;
      downX = null;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    });
  }

  // Layout shifts once the web fonts arrive, so re-measure.
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}
