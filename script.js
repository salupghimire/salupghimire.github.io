'use strict';

// ==========================================================================
// UTILITIES
// ==========================================================================
const EMAIL = 'salupghimire10@gmail.com';
const CHESS_USER = 'salup_ghimire';
const GITHUB_USER = 'salupghimire';

let chessRating = '...';

function $(id) {
  return document.getElementById(id);
}

function showToast(message) {
  const toast = $('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  toast.setAttribute('aria-hidden', 'false');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.classList.remove('show');
    toast.setAttribute('aria-hidden', 'true');
  }, 2500);
}

function setBodyScrollLocked(locked) {
  document.body.style.overflow = locked ? 'hidden' : '';
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ==========================================================================
// LOADER (runs first — won't get stuck)
// ==========================================================================
// ==========================================================================
// ROBUST LOADER (Won't get stuck)
// ==========================================================================
(function initLoader() {
    function hideLoader() {
        const loader = $('loader');
        if (!loader) return;
        
        // Add a safety timeout: force hide after 3 seconds even if something breaks
        setTimeout(() => {
            if (loader.style.display !== 'none') {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    loader.style.pointerEvents = 'none';
                    startTyping(); // Ensure typing starts
                }, 400);
            }
        }, 3000); 

        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            loader.style.pointerEvents = 'none';
            loader.setAttribute('aria-hidden', 'true');
            startTyping();
        }, 400);
    }

    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
    }
})();

// ==========================================================================
// TYPING EFFECT
// ==========================================================================
const typingSpan = $('typing');
const words = ['Front-End Developer.', 'Python Enthusiast.', 'Chess Strategist.'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function startTyping() {
  if (!typingSpan || prefersReducedMotion()) {
    if (typingSpan) typingSpan.textContent = words[0];
    return;
  }

  const currentWord = words[wordIndex];
  charIndex += isDeleting ? -1 : 1;
  typingSpan.textContent = currentWord.substring(0, charIndex) || '\u00A0';

  let typeSpeed = isDeleting ? 50 : 100;

  if (!isDeleting && charIndex === currentWord.length) {
    typeSpeed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    typeSpeed = 500;
  }

  setTimeout(startTyping, typeSpeed);
}

// ==========================================================================
// MOBILE MENU
// ==========================================================================
function closeMobileNav() {
  const nav = $('mobileNav');
  const backdrop = $('mobileBackdrop');
  const toggle = document.querySelector('.nav-toggle');
  if (nav) nav.setAttribute('aria-hidden', 'true');
  if (backdrop) backdrop.setAttribute('aria-hidden', 'true');
  if (toggle) toggle.setAttribute('aria-expanded', 'false');
  setBodyScrollLocked(false);
}

function toggleMenu() {
  const nav = $('mobileNav');
  const backdrop = $('mobileBackdrop');
  const toggle = document.querySelector('.nav-toggle');
  if (!nav) return;

  const isHidden = nav.getAttribute('aria-hidden') !== 'false';
  const willOpen = isHidden;

  nav.setAttribute('aria-hidden', willOpen ? 'false' : 'true');
  if (backdrop) backdrop.setAttribute('aria-hidden', willOpen ? 'false' : 'true');
  if (toggle) toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  setBodyScrollLocked(willOpen);
}

document.querySelectorAll('.mobile-nav a').forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

// ==========================================================================
// THEME
// ==========================================================================
const themeToggle = $('themeToggle');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (themeToggle) {
    themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
    themeToggle.setAttribute(
      'aria-label',
      `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`
    );
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(current === 'light' ? 'dark' : 'light');
}

if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}

applyTheme(document.documentElement.getAttribute('data-theme') || 'dark');

// ==========================================================================
// SCROLL PROGRESS
// ==========================================================================
window.addEventListener('scroll', () => {
  const scrollBar = $('scroll-progress');
  if (!scrollBar) return;

  const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
  scrollBar.style.width = scrolled + '%';
  scrollBar.setAttribute('aria-valuenow', String(Math.round(scrolled)));
});

// ==========================================================================
// COPY EMAIL & REPO URLS
// ==========================================================================
function copyEmail() {
  if (!navigator.clipboard) {
    showToast('Clipboard not supported in this browser');
    return;
  }

  navigator.clipboard.writeText(EMAIL).then(() => {
    showToast('Email copied to clipboard ✓');
    const detail = $('email-detail');
    if (detail) {
      const original = EMAIL;
      detail.textContent = 'Copied to clipboard! ✓';
      detail.style.color = 'var(--accent)';
      setTimeout(() => {
        detail.textContent = original;
        detail.style.color = '';
      }, 2500);
    }
  }).catch(() => {
    showToast('Copy failed — select manually');
  });
}

function initCopyButtons() {
  document.querySelectorAll('.repo-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-copy');
      if (!url || !navigator.clipboard) return;
      navigator.clipboard.writeText(url).then(() => {
        showToast('Clone URL copied ✓');
      });
    });
  });
}

// ==========================================================================
// LIVE APIS
// ==========================================================================
function updateChessRatingUI(rating) {
  chessRating = rating;
  ['live-chess-rating', 'live-chess-rating-2'].forEach(id => {
    const el = $(id);
    if (el) el.textContent = rating;
  });
}

function fetchChessRating() {
  fetch(`https://api.chess.com/pub/player/${CHESS_USER}/stats`)
    .then(res => res.json())
    .then(data => {
      if (data.chess_rapid?.last?.rating) {
        updateChessRatingUI(String(data.chess_rapid.last.rating));
      } else {
        updateChessRatingUI('N/A');
      }
    })
    .catch(() => updateChessRatingUI('Offline'));
}

function fetchGitHubStats() {
  const el = $('live-github-repos');
  if (!el) return;

  fetch(`https://api.github.com/users/${GITHUB_USER}`)
    .then(res => res.json())
    .then(data => {
      el.textContent = data.public_repos ?? '—';
    })
    .catch(() => {
      el.textContent = '—';
    });
}

// ==========================================================================
// SCROLL REVEAL
// ==========================================================================
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  if (prefersReducedMotion()) {
    revealEls.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach(el => observer.observe(el));
}

// ==========================================================================
// CURSOR GLOW
// ==========================================================================
function initCursorGlow() {
  const glow = $('cursor-glow');
  if (!glow || prefersReducedMotion()) return;

  window.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

// ==========================================================================
// COMMAND PALETTE
// ==========================================================================
const palette = $('command-palette');
const paletteInput = $('palette-input');
const paletteList = $('palette-list');

const commands = [
  { label: 'Go to About', action: () => scrollToSection('#about'), keys: 'about' },
  { label: 'Go to Skills', action: () => scrollToSection('#skills'), keys: 'skills stack' },
  { label: 'Go to Projects', action: () => scrollToSection('#projects'), keys: 'projects' },
  { label: 'Go to Contact', action: () => scrollToSection('#contact'), keys: 'contact' },
  { label: 'Toggle Theme', action: toggleTheme, keys: 'theme dark light' },
  { label: 'Copy Email', action: copyEmail, keys: 'email copy' },
  {
    label: 'Open GitHub',
    action: () => window.open(`https://github.com/${GITHUB_USER}`, '_blank'),
    keys: 'github'
  },
  { label: 'Open Terminal', action: openTerminal, keys: 'terminal sudo' }
];

function scrollToSection(selector) {
  closeCommandPalette();
  document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
}

function renderPaletteItems(filter = '') {
  if (!paletteList) return;
  const q = filter.trim().toLowerCase();
  const filtered = commands.filter(
    cmd => cmd.label.toLowerCase().includes(q) || cmd.keys.includes(q)
  );

  paletteList.innerHTML = filtered
    .map(
      (cmd, i) =>
        `<li role="option" data-index="${i}" class="${i === 0 ? 'active' : ''}">${escapeHtml(cmd.label)}<span>↵</span></li>`
    )
    .join('');

  paletteList._filtered = filtered;
}

function openCommandPalette() {
  if (!palette || !paletteInput) return;
  palette.setAttribute('aria-hidden', 'false');
  paletteInput.value = '';
  renderPaletteItems();
  paletteInput.focus();
  setBodyScrollLocked(true);
}

function closeCommandPalette() {
  if (!palette) return;
  palette.setAttribute('aria-hidden', 'true');
  setBodyScrollLocked(false);
}

const cmdHint = $('cmdHint');
if (cmdHint) {
  cmdHint.addEventListener('click', openCommandPalette);
}

if (paletteInput) {
  paletteInput.addEventListener('input', () => renderPaletteItems(paletteInput.value));

  paletteInput.addEventListener('keydown', e => {
    const items = paletteList ? paletteList.querySelectorAll('li') : [];
    const active = paletteList ? paletteList.querySelector('li.active') : null;
    let index = active ? [...items].indexOf(active) : 0;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      index = Math.min(index + 1, items.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      index = Math.max(index - 1, 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = paletteList?._filtered?.[index];
      if (cmd) {
        cmd.action();
        closeCommandPalette();
      }
      return;
    } else if (e.key === 'Escape') {
      closeCommandPalette();
      return;
    } else {
      return;
    }

    items.forEach((li, i) => li.classList.toggle('active', i === index));
  });
}

if (paletteList) {
  paletteList.addEventListener('click', e => {
    const li = e.target.closest('li');
    if (!li) return;
    const index = Number(li.dataset.index);
    const cmd = paletteList._filtered?.[index];
    if (cmd) {
      cmd.action();
      closeCommandPalette();
    }
  });
}

// ==========================================================================
// TERMINAL EASTER EGG
// ==========================================================================
let keyBuffer = '';
const terminalOverlay = $('terminal-overlay');
const terminalInput = $('terminal-input');
const terminalOutput = $('terminal-output');

function getNeofetchAscii() {
  return `
  ███████╗ █████╗ ██╗     ██╗   ██╗██████╗
  ██╔════╝██╔══██╗██║     ██║   ██║██╔══██╗
  ███████╗███████║██║     ██║   ██║██████╔╝
  ╚════██║██╔══██║██║     ██║   ██║██╔═══╝
  ███████║██║  ██║███████╗╚██████╔╝██║
  ╚══════╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝
  OS: salupOS 2.0 · Shell: portfolio-sh
  Theme: ${document.documentElement.getAttribute('data-theme') || 'dark'}
  Chess Rapid: ${chessRating}
  Email: ${EMAIL}
`.trim();
}

function openTerminal() {
  if (!terminalOverlay || !terminalInput) return;
  terminalOverlay.setAttribute('aria-hidden', 'false');
  terminalInput.focus();
  setBodyScrollLocked(true);
}

function closeTerminal() {
  if (!terminalOverlay) return;
  terminalOverlay.setAttribute('aria-hidden', 'true');
  setBodyScrollLocked(false);
}

function appendTerminal(html) {
  if (!terminalOutput) return;
  terminalOutput.insertAdjacentHTML('beforeend', html);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeMobileNav();
    closeTerminal();
    closeCommandPalette();
    return;
  }

  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    const isOpen = palette?.getAttribute('aria-hidden') === 'false';
    if (isOpen) closeCommandPalette();
    else openCommandPalette();
    return;
  }

  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  keyBuffer += e.key.toLowerCase();
  if (keyBuffer.length > 10) keyBuffer = keyBuffer.slice(-10);

  if (keyBuffer.includes('sudo')) {
    openTerminal();
    keyBuffer = '';
  }
});

if (terminalInput) {
  terminalInput.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;

    const command = terminalInput.value.trim().toLowerCase();
    terminalInput.value = '';
    appendTerminal(`<p><span class="prompt">$</span> ${escapeHtml(command)}</p>`);

    switch (command) {
      case 'help':
        appendTerminal(
          `<p>Commands: <span class="term-highlight">about</span>, <span class="term-highlight">projects</span>, <span class="term-highlight">theme</span>, <span class="term-highlight">email</span>, <span class="term-highlight">chess</span>, <span class="term-highlight">neofetch</span>, <span class="term-highlight">clear</span>, <span class="term-highlight">exit</span></p>`
        );
        break;
      case 'about':
        appendTerminal('<p>Salup Ghimire — Developer, Student, Chess Player.</p>');
        break;
      case 'projects':
        appendTerminal('<p>2 active modules: portfolio-v2, chess-tools</p>');
        break;
      case 'theme':
        toggleTheme();
        appendTerminal(
          `<p>Theme switched to ${document.documentElement.getAttribute('data-theme')}.</p>`
        );
        break;
      case 'email':
        copyEmail();
        appendTerminal('<p>Email copied to clipboard.</p>');
        break;
      case 'chess':
        appendTerminal(`<p>Rapid rating: ${escapeHtml(chessRating)}</p>`);
        break;
      case 'neofetch':
        appendTerminal(`<pre class="terminal-ascii">${escapeHtml(getNeofetchAscii())}</pre>`);
        break;
      case 'clear':
        terminalOutput.innerHTML = '';
        break;
      case 'exit':
        closeTerminal();
        break;
      default:
        appendTerminal(
          `<p>Command not found: ${escapeHtml(command)}. Type 'help'.</p>`
        );
    }
  });
}

// ==========================================================================
// PAGE INIT (safe — every line checks elements first)
// ==========================================================================
function initPage() {
  const yearEl = $('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  initScrollReveal();
  initCursorGlow();
  initCopyButtons();
  fetchChessRating();
  fetchGitHubStats();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPage);
} else {
  initPage();
}

// Expose for inline onclick handlers in HTML
window.toggleMenu = toggleMenu;
window.closeMobileNav = closeMobileNav;
window.copyEmail = copyEmail;
window.closeTerminal = closeTerminal;
window.openCommandPalette = openCommandPalette;
window.closeCommandPalette = closeCommandPalette;
