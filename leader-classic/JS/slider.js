const input = document.querySelector('.input');
const arcFill = document.getElementById('arcFill');
const arcGlow = document.getElementById('arcGlow');
const valueLabel = document.getElementById('valueLabel');
const riskLabel = document.getElementById('riskLabel');

const ARC_LENGTH = Math.PI * 317;
arcFill.style.strokeDasharray = ARC_LENGTH;
arcGlow.style.strokeDasharray = ARC_LENGTH;

function updateRisk(percent) {
    riskLabel.classList.remove('risk-low', 'risk-medium', 'risk-high');
    if (percent < 33) {
        riskLabel.textContent = 'Низкий риск';
        riskLabel.classList.add('risk-low');
    } else if (percent < 66) {
        riskLabel.textContent = 'Средний риск';
        riskLabel.classList.add('risk-medium');
    } else {
        riskLabel.textContent = 'Высокий риск';
        riskLabel.classList.add('risk-high');
    }
}

function update() {
    const percent = Number(input.value);

    document.documentElement.style.setProperty('--fill', percent + '%');

    const offset = ARC_LENGTH * (1 - percent / 100);
    arcFill.style.strokeDashoffset = offset;
    arcGlow.style.strokeDashoffset = offset;

    valueLabel.textContent = Math.round(percent / 5) + '%';

    updateRisk(percent);
}

input.addEventListener('input', update);
update();