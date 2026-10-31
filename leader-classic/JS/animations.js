const html = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(any-hover: hover)').matches;
const { gsap, ScrollTrigger, SplitText, Lenis } = window;

const showPage = () => html.classList.remove('is-loading');

setTimeout(showPage, 2500);

const waitFonts = () => Promise.race([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise((resolve) => setTimeout(resolve, 1200)),
]);

function initSpotlight() {
    if (!canHover) return;

    document.querySelectorAll('.customers__carts-style').forEach((card) => {
        card.addEventListener('pointermove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
            card.style.setProperty('--my', `${e.clientY - rect.top}px`);
        });
    });
}

function initLenis() {
    if (!Lenis || reduceMotion) return null;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
    window.lenis = lenis;

    if (gsap && ScrollTrigger) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    } else {
        const raf = (time) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
    }

    const body = document.body;
    new MutationObserver(() => {
        if (body.classList.contains('page__body--no-scroll')) lenis.stop();
        else lenis.start();
    }).observe(body, { attributes: true, attributeFilter: ['class'] });

    return lenis;
}

function initAnchors(lenis) {
    const header = document.querySelector('.header');

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        const hash = link.getAttribute('href');

        if (hash === '#') {
            e.preventDefault();
            if (link.classList.contains('logo')) {
                lenis ? lenis.scrollTo('top', { force: true }) : window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            return;
        }

        const target = document.querySelector(hash);
        if (!target) return;

        e.preventDefault();
        const offset = -(header ? header.offsetHeight : 0) - 10;

        if (lenis) {
            if (!document.body.classList.contains('page__body--no-scroll')) lenis.start();
            lenis.scrollTo(target, { offset, force: true, duration: 1.4 });
        } else {
            const top = target.getBoundingClientRect().top + window.scrollY + offset;
            window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
        }
        history.replaceState(null, '', hash);
    });
}

function initHeaderAutoHide() {
    const header = document.querySelector('.header');
    const body = document.body;
    if (!header) return;

    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
        const y = window.scrollY;
        const menuOpen = body.classList.contains('page__body--no-scroll');
        const goingDown = y > lastY + 4;
        const goingUp = y < lastY - 4;

        if (menuOpen || y < 300) header.classList.remove('header--hidden');
        else if (goingDown) header.classList.add('header--hidden');
        else if (goingUp) header.classList.remove('header--hidden');

        if (goingDown || goingUp) lastY = y;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });

    if (canHover) {
        document.addEventListener('pointermove', (e) => {
            if (e.clientY < 80) header.classList.remove('header--hidden');
        }, { passive: true });
    }
}

function heroIntro() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    const title = document.querySelector('.hero__title');

    if (title && SplitText) {
        const split = SplitText.create(title, { type: 'lines', mask: 'lines', linesClass: 'line' });
        tl.from(split.lines, { yPercent: 110, duration: 1.1, stagger: 0.12, ease: 'power4.out' }, 0.15);
    } else if (title) {
        tl.from(title, { y: 40, autoAlpha: 0, duration: 1 }, 0.15);
    }

    tl.from('.section__container', { y: -24, autoAlpha: 0, duration: 0.9 }, 0)
        .from('.hero__list', { x: -24, autoAlpha: 0, duration: 0.7, stagger: 0.08 }, 0.55)
        .from('.hero__button > *', { y: 24, autoAlpha: 0, duration: 0.7, stagger: 0.1 }, 0.75)
        .from('.hero__investors > *', { scale: 0.6, autoAlpha: 0, duration: 0.6, stagger: 0.07, ease: 'back.out(2)' }, 0.95)
        .from('.hero__img-wrapper', { x: 80, rotation: 6, autoAlpha: 0, duration: 1.5, ease: 'expo.out' }, 0.2)
        .from('.header__logo-wrapper, .header__select-wrapper, .menu__item, .header__button', {
            y: -16, autoAlpha: 0, duration: 0.7, stagger: 0.06, clearProps: 'all',
        }, 0);

    showPage();

    gsap.to('.hero__img', { y: -14, duration: 3.2, ease: 'sine.inOut', repeat: -1, yoyo: true });

    gsap.to('.hero__img-wrapper', {
        y: () => (window.innerWidth <= 768 ? 40 : 120),
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
    });
}

function revealOnScroll() {
    const splitHeadings = [
        '.catalog__title', '.instruments__title', '.investment__title', '.briefcase__title',
        '.referral__title', '.referral__program-title', '.questions__title', '.contacts__title',
    ];

    splitHeadings.forEach((selector) => {
        const el = document.querySelector(selector);
        if (!el) return;

        if (SplitText) {
            const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'line' });
            gsap.from(split.lines, {
                yPercent: 110,
                duration: 1,
                stagger: 0.1,
                ease: 'power4.out',
                scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            });
        } else {
            gsap.from(el, { y: 40, autoAlpha: 0, duration: 1, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
        }
    });

    const fadeUp = [
        '.bonus__title > span:not(.bonus__text-background)', '.customers__title > span',
        '.catalog__text', '.catalog__button', '.investment__text', '.bonus__text', '.bonus__button',
        '.briefcase__text', '.briefcase__button', '.referral__text', '.referral__program-text', '.referral__link',
        '.faq__questions .questions__text', '.questions__button', '.briefcase__slider',
    ];

    gsap.utils.toArray(fadeUp.join(',')).forEach((el) => {
        gsap.from(el, {
            y: 40,
            autoAlpha: 0,
            duration: 0.9,
            ease: 'power3.out',
            clearProps: 'transform',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
    });

    const batches = [
        { selector: '.instrument__carts article', vars: { y: 60, scale: 0.94 } },
        { selector: '.investment__carts article', vars: { y: 70 } },
        { selector: '.customers__carts-style', vars: { y: 60, scale: 0.96 } },
        { selector: '.briefcase__carts', vars: { y: 40 } },
        { selector: '.contacts__cards', vars: { y: 60 } },
        { selector: '.contacts__form > *', vars: { y: 30 } },
        { selector: '.faq__menu', vars: { x: 40 } },
        { selector: '.footer__social > *, .footer__contacts > *', vars: { y: 30 } },
    ];

    batches.forEach(({ selector, vars }) => {
        const items = gsap.utils.toArray(selector);
        if (!items.length) return;

        gsap.set(items, { autoAlpha: 0, ...vars });
        ScrollTrigger.batch(items, {
            start: 'top 92%',
            once: true,
            onEnter: (els) => gsap.to(els, {
                autoAlpha: 1,
                x: 0,
                y: 0,
                scale: 1,
                duration: 0.9,
                ease: 'power3.out',
                stagger: 0.09,
                overwrite: true,
                clearProps: 'transform',
            }),
        });
    });

    gsap.utils.toArray('.referral__picture').forEach((el) => {
        gsap.from(el, {
            clipPath: 'inset(0 0 100% 0 round 32px)',
            duration: 1.4,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
    });

    gsap.from('.referral__program-images img', {
        scale: 0.85,
        autoAlpha: 0,
        y: 60,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.referral__program', start: 'top 80%', once: true },
    });
}

function parallax() {
    const scrub = (trigger, start = 'top bottom', end = 'bottom top') => ({ trigger, start, end, scrub: true });

    gsap.utils.toArray('.investment__carts-number').forEach((num) => {
        gsap.fromTo(num, { yPercent: 75 }, { yPercent: 25, ease: 'none', scrollTrigger: scrub(num) });
    });

    gsap.fromTo('.bonus__text-background', { xPercent: 18 }, { xPercent: -2, ease: 'none', scrollTrigger: scrub('.bonus') });
    gsap.fromTo('.bonus__img-left img', { y: 80 }, { y: -80, ease: 'none', scrollTrigger: scrub('.bonus') });
    gsap.fromTo('.bonus__img-right img', { y: -40 }, { y: 60, ease: 'none', scrollTrigger: scrub('.bonus') });
    gsap.fromTo('.bonus__img-gift img', { y: 140, rotation: -10 }, { y: -120, rotation: 12, ease: 'none', scrollTrigger: scrub('.bonus') });

    gsap.fromTo('.referral__program-images', { y: 40 }, { y: -40, ease: 'none', scrollTrigger: scrub('.referral__program') });
}

function counters() {
    document.querySelectorAll('.briefcase__carts-title').forEach((el) => {
        const raw = el.textContent.trim();
        const match = raw.match(/^(\d[\d\s]*\d|\d)(.*)$/);
        if (!match) return;

        const target = Number(match[1].replace(/\s/g, ''));
        const suffix = match[2];
        const format = (n) => Math.round(n).toLocaleString('ru-RU') + suffix;
        const state = { value: 0 };

        el.setAttribute('aria-label', raw);
        el.textContent = format(0);

        gsap.to(state, {
            value: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => { el.textContent = format(state.value); },
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
    });
}

function gaugeIntro() {
    const input = document.querySelector('.briefcase .input');
    if (!input) return;

    const finalValue = Number(input.value);
    const state = { value: 0 };
    const apply = () => {
        input.value = Math.round(state.value);
        input.dispatchEvent(new Event('input'));
    };

    apply();
    gsap.to(state, {
        value: finalValue,
        duration: 1.8,
        ease: 'power3.out',
        onUpdate: apply,
        scrollTrigger: { trigger: '.briefcase__slider', start: 'top 80%', once: true },
    });
}

function activeMenu() {
    const links = document.querySelectorAll('.menu__link[href^="#"]');

    links.forEach((link) => {
        const section = document.querySelector(link.getAttribute('href'));
        if (!section) return;

        ScrollTrigger.create({
            trigger: section,
            start: 'top 45%',
            end: 'bottom 45%',
            onToggle: ({ isActive }) => link.classList.toggle('is-active', isActive),
        });
    });
}

function refreshOnResize() {
    let timer;
    new ResizeObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(() => ScrollTrigger.refresh(), 200);
    }).observe(document.body);
}

async function init() {
    initSpotlight();
    initHeaderAutoHide();

    if (!gsap || !ScrollTrigger || reduceMotion) {
        initAnchors(null);
        showPage();
        return;
    }

    gsap.registerPlugin(ScrollTrigger);
    if (SplitText) gsap.registerPlugin(SplitText);

    const lenis = initLenis();
    initAnchors(lenis);

    await waitFonts();

    heroIntro();
    revealOnScroll();
    parallax();
    counters();
    gaugeIntro();
    activeMenu();
    refreshOnResize();
}

init();
