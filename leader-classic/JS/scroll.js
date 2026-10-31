document.addEventListener('DOMContentLoaded', () => {
    const carts = document.querySelector('.catalog__carts');
    if (!carts) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const marquee = document.createElement('div');
    marquee.className = 'catalog__marquee';

    const track = document.createElement('div');
    track.className = 'catalog__track';

    carts.parentNode.insertBefore(marquee, carts);
    marquee.appendChild(track);
    track.appendChild(carts);

    const originalWidth = carts.scrollWidth;
    const screenWidth = window.innerWidth;
    const copies = Math.ceil((screenWidth * 2) / originalWidth) + 1;

    for (let i = 1; i < copies; i++) {
        const clone = carts.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
    }

    let offset = 0;          
    let speed = 0.5;        
    let paused = false;     
    let dragging = false;   
    let startX = 0;        
    let startOffset = 0;   

    function animate() {
        if (!paused && !dragging && !reduceMotion) {
            offset -= speed;
        }

        if (offset <= -originalWidth) offset += originalWidth;
        if (offset > 0) offset -= originalWidth;

        track.style.transform = `translateX(${Math.round(offset)}px)`;
        requestAnimationFrame(animate);
    }

    animate();

    marquee.addEventListener('mouseenter', () => paused = true);
    marquee.addEventListener('mouseleave', () => paused = false);

    marquee.addEventListener('mousedown', (e) => {
        dragging = true;
        startX = e.clientX;
        startOffset = offset;
        marquee.classList.add('is-dragging');
        e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        offset = startOffset + dx;

        if (offset <= -originalWidth) offset += originalWidth;
        if (offset > 0) offset -= originalWidth;
    });

    window.addEventListener('mouseup', () => {
        dragging = false;
        marquee.classList.remove('is-dragging');
    });

    marquee.addEventListener('touchstart', (e) => {
        dragging = true;
        startX = e.touches[0].clientX;
        startOffset = offset;
    }, { passive: true });

    marquee.addEventListener('touchmove', (e) => {
        if (!dragging) return;
        const dx = e.touches[0].clientX - startX;
        offset = startOffset + dx;

        if (offset <= -originalWidth) offset += originalWidth;
        if (offset > 0) offset -= originalWidth;
    }, { passive: true });

    marquee.addEventListener('touchend', () => {
        dragging = false;
    });
});