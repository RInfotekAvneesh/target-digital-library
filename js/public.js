// Public website behaviour
(function () {
    'use strict';
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

    // Navbar turns solid after scrolling; back-to-top button appears
    const nav = document.getElementById('siteNav');
    const topBtn = document.querySelector('.fab-top');
    const onScroll = () => {
        const y = window.scrollY;
        nav?.classList.toggle('scrolled', y > 40);
        topBtn?.classList.toggle('show', y > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Close the mobile menu after choosing a link
    const menu = document.getElementById('siteMenu');
    $$('#siteMenu a[href^="#"]').forEach(a => a.addEventListener('click', () => {
        if (menu?.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }));

    // Reveal-on-scroll animations
    const items = $$('.reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(entries => entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        items.forEach(el => io.observe(el));
    } else {
        items.forEach(el => el.classList.add('in'));
    }

    // Lightbox for gallery & flyer
    const lbEl = document.getElementById('lightbox');
    if (lbEl) {
        const lb = bootstrap.Modal.getOrCreateInstance(lbEl);
        const img = document.getElementById('lightboxImg');
        $$('[data-lightbox]').forEach(btn => btn.addEventListener('click', () => {
            img.src = btn.dataset.lightbox;
            img.alt = btn.querySelector('img')?.alt || '';
            lb.show();
        }));
    }

    // Character counter for the review text
    $$('textarea[data-counter]').forEach(t => {
        const out = document.querySelector(t.dataset.counter);
        const upd = () => { if (out) out.textContent = t.value.length; };
        t.addEventListener('input', upd); upd();
    });

    // Prevent double submit of the review form
    $$('form:not(#waReviewForm)').forEach(f => f.addEventListener('submit', () => {
        const b = f.querySelector('button:not([type=button])');
        if (b) { setTimeout(() => { b.disabled = true; b.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending…'; }, 0); }
    }));
    window.addEventListener('pageshow', e => { if (e.persisted) location.reload(); });
})();

// Static site (GitHub Pages): review form sends the review via WhatsApp
(function () {
    const form = document.getElementById('waReviewForm');
    if (!form) return;
    const err = form.querySelector('[data-wa-error]');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const rating = form.querySelector('input[name=rating]:checked')?.value;
        const name = form.elements.namedItem('name').value.trim();
        const comment = form.elements.namedItem('comment').value.trim();
        const problems = [];
        if (!rating) problems.push('Please choose a star rating.');
        if (!name) problems.push('Please enter your name.');
        if (comment.length < 5) problems.push('Please write a few words.');
        if (problems.length) { err.innerHTML = problems.join('<br>'); err.classList.remove('d-none'); return; }
        err.classList.add('d-none');
        const msg = `Review for ${form.dataset.library}\n${'⭐'.repeat(+rating)} (${rating}/5)\n\n${comment}\n\n– ${name}`;
        window.open(`https://wa.me/${form.dataset.wa}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    });
})();
