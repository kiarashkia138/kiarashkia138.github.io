const root = document.documentElement;
root.classList.add('js');

// Theme: saved choice, otherwise follow the system
const toggle = document.getElementById('theme-toggle');
const stored = (() => { try { return localStorage.getItem('theme'); } catch { return null; } })();
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
root.dataset.theme = stored || (prefersDark.matches ? 'dark' : 'light');

toggle.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch {}
});

// Mobile menu
const menuBtn = document.getElementById('menu-toggle');
const links = document.getElementById('nav-links');
const setMenu = open => {
    links.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
};
menuBtn.addEventListener('click', () => setMenu(!links.classList.contains('open')));
links.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });

// Nav border once scrolled
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Reveal sections on scroll
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });
    reveals.forEach(el => io.observe(el));
} else {
    reveals.forEach(el => el.classList.add('in'));
}

// Highlight the current section in the nav
const navAnchors = [...links.querySelectorAll('a')];
const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('main section[id], footer[id]').forEach(s => spy.observe(s));
