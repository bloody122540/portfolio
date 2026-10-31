const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const header = document.querySelector('.header');

if (header) {
    const onScroll = () => header.classList.toggle('header--scrolled', window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

const revealGroups = [
    ['.hero__info > *', '', 0.12],
    ['.hero__img', 'reveal--zoom', 0.15],
    ['.title-large', '', 0],
    ['.news__article', '', 0.1],
    ['.faq__container > img', 'reveal--left', 0],
    ['.faq__container details', 'reveal--right', 0.08],
    ['.article__section-text, .article__section-item', '', 0.05],
    ['.article__section-wrap-1 .article-img, .article__section-wrap-2', 'reveal--zoom', 0],
    ['.footer__logo, .footer__list li', '', 0.06],
];

if (!reduceMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-anim');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            el.classList.add('is-visible');
            observer.unobserve(el);
            el.addEventListener('transitionend', function cleanup(event) {
                if (event.target !== el) return;
                el.removeEventListener('transitionend', cleanup);
                el.classList.remove('reveal', 'reveal--left', 'reveal--right', 'reveal--zoom', 'is-visible');
                el.style.removeProperty('--delay');
            });
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealGroups.forEach(([selector, modifier, step]) => {
        document.querySelectorAll(selector).forEach((el, index) => {
            if (el.classList.contains('reveal')) return;
            el.classList.add('reveal');
            if (modifier) el.classList.add(modifier);
            el.style.setProperty('--delay', `${Math.min(index * step, 0.6)}s`);
            observer.observe(el);
        });
    });
}

const DURATION = reduceMotion ? 0 : 350;

function animateDetails(details, open) {
    details.dataset.state = open ? 'open' : 'closed';
    const summary = details.querySelector('summary');
    const startHeight = details.offsetHeight;

    details.getAnimations().forEach((animation) => animation.cancel());
    details.open = true;

    const endHeight = open ? details.scrollHeight : summary.offsetHeight + 2;
    const animation = details.animate(
        { height: [`${startHeight}px`, `${endHeight}px`] },
        { duration: DURATION, easing: 'ease' }
    );

    animation.onfinish = () => {
        details.open = open;
    };
}

const faqItems = document.querySelectorAll('details[name="faq"]');

faqItems.forEach((details) => {
    details.removeAttribute('name');
    details.dataset.state = details.open ? 'open' : 'closed';
    details.querySelector('summary').addEventListener('click', (event) => {
        event.preventDefault();
        const willOpen = details.dataset.state !== 'open';

        if (willOpen) {
            faqItems.forEach((other) => {
                if (other !== details && other.dataset.state === 'open') animateDetails(other, false);
            });
        }

        animateDetails(details, willOpen);
    });
});

document.querySelectorAll('.article__play-button[data-video]').forEach((button) => {
    button.addEventListener('click', () => {
        const wrap = button.parentElement;
        const poster = wrap.querySelector('.article-img');
        const video = document.createElement('video');

        video.className = 'article-video';
        video.src = button.dataset.video;
        video.controls = true;
        video.playsInline = true;
        if (poster) video.poster = poster.currentSrc || poster.src;

        button.remove();
        if (poster) poster.replaceWith(video);
        else wrap.append(video);

        video.play().catch(() => {});
    });
});
