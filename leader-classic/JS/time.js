let targetDate = Date.now()
    + (27 * 24 * 60 * 60 * 1000)
    + (7 * 60 * 60 * 1000)
    + (40 * 60 * 1000)
    + (49 * 1000);

const units = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
};

function setValue(el, value) {
    if (!el || el.textContent === value) return;
    el.textContent = value;
    el.classList.remove('is-tick');
    void el.offsetWidth;
    el.classList.add('is-tick');
}

function render() {
    const distance = targetDate - Date.now();

    if (distance < 0) {
        clearInterval(timer);
        Object.values(units).forEach((el) => setValue(el, '00'));
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    setValue(units.days, String(days).padStart(2, '0'));
    setValue(units.hours, String(hours).padStart(2, '0'));
    setValue(units.minutes, String(minutes).padStart(2, '0'));
    setValue(units.seconds, String(seconds).padStart(2, '0'));
}

const timer = setInterval(render, 1000);
render();
