(function () {
  var root = document.documentElement;

  // Header border on scroll
  var header = document.querySelector('.site-header');
  var onScroll = function () { header && header.classList.toggle('scrolled', window.scrollY > 8); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  if (toggle) {
    var setOpen = function (open) {
      root.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    };
    toggle.addEventListener('click', function () { setOpen(!root.classList.contains('menu-open')); });
    document.querySelectorAll('#menu a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  }

  // Branch region filter
  var filters = document.querySelectorAll('.filter');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var region = btn.dataset.region;
      filters.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      document.querySelectorAll('.branch[data-region]').forEach(function (card) {
        card.hidden = region !== 'all' && card.dataset.region !== region;
      });
    });
  });

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Guide table of contents highlight
  var tocLinks = document.querySelectorAll('.toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    tocLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          tocLinks.forEach(function (a) { a.classList.remove('active'); });
          var link = map[en.target.id];
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  }

  // Photo lightbox
  var photoLinks = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
  if (photoLinks.length && window.HTMLDialogElement) {
    var dlg = document.createElement('dialog');
    dlg.className = 'lightbox';
    dlg.setAttribute('aria-label', '사진 크게 보기');
    dlg.innerHTML = '<div class="lightbox-inner"><img alt=""><p class="lb-caption"></p>' +
      '<button class="lb-prev" type="button" aria-label="이전 사진">&#8249;</button>' +
      '<button class="lb-next" type="button" aria-label="다음 사진">&#8250;</button>' +
      '<button class="lb-close" type="button" aria-label="닫기">&times;</button></div>';
    document.body.appendChild(dlg);
    var img = dlg.querySelector('img'), cap = dlg.querySelector('.lb-caption'), idx = 0;
    var show = function (i) {
      idx = (i + photoLinks.length) % photoLinks.length;
      var a = photoLinks[idx], alt = a.querySelector('img').alt;
      img.src = a.href; img.alt = alt; cap.textContent = alt + ' (' + (idx + 1) + '/' + photoLinks.length + ')';
    };
    photoLinks.forEach(function (a, i) {
      a.addEventListener('click', function (e) { e.preventDefault(); show(i); dlg.showModal(); });
    });
    dlg.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
    dlg.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
    dlg.querySelector('.lb-close').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.classList.contains('lightbox-inner')) dlg.close(); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }
})();
