'use strict';

(function ($) {

    $(".loader").fadeOut();
    $("#preloder").delay(200).fadeOut("slow");

    $('.set-bg').each(function () {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });

    $(".mobile-menu").slicknav({
        prependTo: '#mobile-menu-wrap',
        allowParentLinks: true
    });

    $(".testimonial-slider").owlCarousel({
        items: 2,
        dots: true,
        loop: true,
        smartSpeed: 1200,
        margin: 0,
        responsive: {
            320: {
                items: 1,
            },
            480: {
                items: 1,
            },
            992: {
                items: 2,
            }
        }
    });

    $('.image-popup').magnificPopup({
        type: 'image'
    });

    $('.count').each(function () {
        $(this).prop('Counter', 0).animate({
            Counter: $(this).text()
        }, {
            duration: 4000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });

    $('.ab-count').each(function () {
        $(this).prop('Counter', 0).animate({
            Counter: $(this).text()
        }, {
            duration: 4000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });

})(jQuery);

(function () {
    var FORM_EMAIL = 'hello.colorlib@gmail.com';
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function showMessage(form, text, isError) {
        var box = form.querySelector('.form-message');
        box.textContent = text;
        box.classList.toggle('is-error', isError);
        box.classList.toggle('is-success', !isError);
    }

    function validate(form) {
        var fields = form.querySelectorAll('[required]');
        var firstInvalid = null;

        fields.forEach(function (field) {
            var value = field.value.trim();
            var valid = value !== '' && (field.type !== 'email' || EMAIL_RE.test(value));
            field.classList.toggle('is-invalid', !valid);
            field.setAttribute('aria-invalid', String(!valid));
            if (!valid && !firstInvalid) firstInvalid = field;
        });

        if (firstInvalid) firstInvalid.focus();
        return !firstInvalid;
    }

    function buildMail(form) {
        if (form.dataset.form === 'newsletter') {
            return {
                subject: 'Newsletter subscription',
                body: 'Please subscribe this address: ' + form.elements.email.value.trim()
            };
        }
        return {
            subject: 'Message from ' + form.elements.name.value.trim(),
            body: form.elements.message.value.trim() + '\n\nFrom: ' + form.elements.email.value.trim()
        };
    }

    document.querySelectorAll('form[data-form]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            if (!validate(form)) {
                showMessage(form, 'Please fill in the fields correctly.', true);
                return;
            }

            var mail = buildMail(form);
            window.location.href = 'mailto:' + FORM_EMAIL +
                '?subject=' + encodeURIComponent(mail.subject) +
                '&body=' + encodeURIComponent(mail.body);
            showMessage(form, 'Your mail app should open with the message ready to send.', false);
        });
    });
})();
