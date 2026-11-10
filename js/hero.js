/* Chuzzy Logistics - hero slider + contact form (loads AFTER js/main.js) */
jQuery(document).ready(function ($) {
  "use strict";

  /* ---------- Hero slider ---------- */
  var heroSlider = function () {
    var $slider = $('.hero-slider');
    if (!$slider.length) return;

    var $slides = $slider.find('.hero-slide');
    var $dots = $slider.find('.hero-dots button');
    var $current = $slider.find('.hero-counter .current');
    var delay = 6500;
    var index = 0;
    var timer = null;

    $slider[0].style.setProperty('--hero-delay', delay + 'ms');

    function show(i) {
      index = (i + $slides.length) % $slides.length;
      $slides.removeClass('active').eq(index).addClass('active');
      // re-trigger the progress animation on the dot
      $dots.removeClass('active');
      void $dots[0].offsetWidth;
      $dots.eq(index).addClass('active');
      $current.text('0' + (index + 1));
    }

    function start() {
      stop();
      timer = setInterval(function () { show(index + 1); }, delay);
    }
    function stop() { if (timer) clearInterval(timer); }

    $slider.find('.hero-nav.next').on('click', function () { show(index + 1); start(); });
    $slider.find('.hero-nav.prev').on('click', function () { show(index - 1); start(); });
    $dots.on('click', function () { show($(this).index()); start(); });

    // swipe support
    var startX = 0;
    $slider.on('touchstart', function (e) { startX = e.originalEvent.touches[0].clientX; });
    $slider.on('touchend', function (e) {
      var diff = e.originalEvent.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 50) { show(diff < 0 ? index + 1 : index - 1); start(); }
    });

    // keyboard
    $(document).on('keydown', function (e) {
      if (e.key === 'ArrowRight') { show(index + 1); start(); }
      if (e.key === 'ArrowLeft') { show(index - 1); start(); }
    });

    show(0);
    start();
  };
  heroSlider();

  /* ---------- Contact form (front-end demo) ---------- */
  $('#contact-form').on('submit', function (e) {
    e.preventDefault();
    var $form = $(this);
    var $btn = $form.find('button[type="submit"]');
    $btn.prop('disabled', true).text('Sending...');
    // TODO: replace with a real endpoint (Formspree, PHP mailer, etc.)
    setTimeout(function () {
      $form[0].reset();
      $btn.prop('disabled', false).text('Send Message');
      $('#form-success').slideDown();
    }, 1000);
  });

  /* Preselect service from ?service=... on the contact page */
  var preselectService = function () {
    var $select = $('#service');
    if (!$select.length) return;
    var match = /[?&]service=([^&]+)/.exec(window.location.search);
    if (!match) return;
    var wanted = decodeURIComponent(match[1].replace(/\+/g, ' ')).toLowerCase();
    var found = false;
    $select.find('option').each(function () {
      if ($(this).text().toLowerCase() === wanted) {
        $select.val($(this).text());
        found = true;
      }
    });
    if (!found) { $select.append($('<option>').text(decodeURIComponent(match[1].replace(/\+/g, ' ')))); $select.val(decodeURIComponent(match[1].replace(/\+/g, ' '))); }
  };
  preselectService();

  /* Active nav highlight is set per page via the "active" class in HTML */
});