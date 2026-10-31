const phoneInput = document.getElementById('phone');

phoneInput.addEventListener('input', (e) => {
    let digits = e.target.value.replace(/\D/g, '');

    if (digits.startsWith('7') || digits.startsWith('8')) {
        digits = digits.slice(1);
    }

    digits = digits.slice(0, 10);

    let result = '+7';
    if (digits.length > 0) result += ` (${digits.slice(0, 3)}`;
    if (digits.length >= 3) result += ')';
    if (digits.length > 3) result += ` ${digits.slice(3, 6)}`;
    if (digits.length > 6) result += `-${digits.slice(6, 8)}`;
    if (digits.length > 8) result += `-${digits.slice(8, 10)}`;

    e.target.value = result;
});

phoneInput.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && /\D$/.test(phoneInput.value)) {
        e.preventDefault();
        let digits = phoneInput.value.replace(/\D/g, '').slice(0, -1);
        if (digits.startsWith('7') || digits.startsWith('8')) digits = digits.slice(1);

        let result = '+7';
        if (digits.length > 0) result += ` (${digits.slice(0, 3)}`;
        if (digits.length >= 3) result += ')';
        if (digits.length > 3) result += ` ${digits.slice(3, 6)}`;
        if (digits.length > 6) result += `-${digits.slice(6, 8)}`;
        if (digits.length > 8) result += `-${digits.slice(8, 10)}`;

        phoneInput.value = result;
    }
});