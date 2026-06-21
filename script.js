// ==========================================================================
// CORE UI: Loader & Mobile Menu
// ==========================================================================
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            startTyping(); 
        }, 400);
    }
});

function toggleMenu() {
    const nav = document.getElementById('mobileNav');
    const isHidden = nav.getAttribute('aria-hidden') === 'true';
    
    // Toggle state
    nav.setAttribute('aria-hidden', !isHidden);
    
    // Prevent scrolling behind the drawer when it's open
    document.body.style.overflow = !isHidden ? 'hidden' : 'auto';
}

// Close menu when a link is clicked
document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('mobileNav').setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto'; 
    });
});

// ==========================================================================
// THEME TOGGLE
// ==========================================================================
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        themeToggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
    });
}

// ==========================================================================
// TYPING EFFECT
// ==========================================================================
const typingSpan = document.getElementById("typing");
const words = ["Front-End Developer.", "Python Enthusiast.", "Chess Strategist."];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function startTyping() {
    if (!typingSpan) return;
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        charIndex--;
    } else {
        charIndex++;
    }

    typingSpan.textContent = currentWord.substring(0, charIndex) || "\u00A0";

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
// FEATURE 1: Scroll Progress Bar
// ==========================================================================
window.addEventListener('scroll', () => {
    const scrollBar = document.getElementById('scroll-progress');
    if (scrollBar) {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollBar.style.width = scrolled + "%";
    }
});

// ==========================================================================
// FEATURE 2: Copy to Clipboard
// ==========================================================================
function copyEmail() {
    navigator.clipboard.writeText("salupghimire10@gmail.com");
    const detail = document.getElementById("email-detail");
    if (!detail) return;
    
    const originalText = "salupghimire10@gmail.com";
    detail.innerText = "Copied to clipboard! ✓";
    detail.style.color = "var(--accent)";
    
    setTimeout(() => {
        detail.innerText = originalText;
        detail.style.color = "var(--text-main)";
    }, 2500);
}

// ==========================================================================
// FEATURE 3: Live API Fetch (Chess.com)
// ==========================================================================
fetch('https://api.chess.com/pub/player/salup_ghimire/stats')
    .then(response => response.json())
    .then(data => {
        const ratingEl = document.getElementById('live-chess-rating');
        if (ratingEl && data.chess_rapid && data.chess_rapid.last) {
            ratingEl.innerText = data.chess_rapid.last.rating;
        } else if (ratingEl) {
            ratingEl.innerText = "Data Unavailable";
        }
    })
    .catch(() => {
        const ratingEl = document.getElementById('live-chess-rating');
        if (ratingEl) ratingEl.innerText = "System Offline";
    });

// ==========================================================================
// FEATURE 4: Hidden Terminal Easter Egg
// ==========================================================================
let keyBuffer = '';
const terminalOverlay = document.getElementById('terminal-overlay');
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');

window.addEventListener('keydown', (e) => {
    // Global Escape Key to close menus/overlays
    if (e.key === 'Escape') {
        const nav = document.getElementById('mobileNav');
        nav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
        closeTerminal();
    }

    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    keyBuffer += e.key.toLowerCase();
    if (keyBuffer.length > 10) keyBuffer = keyBuffer.slice(-10);
    
    if (keyBuffer.includes('sudo')) {
        terminalOverlay.setAttribute('aria-hidden', 'false');
        terminalInput.focus();
        keyBuffer = '';
        document.body.style.overflow = 'hidden';
    }
});

function closeTerminal() {
    if (terminalOverlay) {
        terminalOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    }
}

// Handle Terminal Commands
if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim().toLowerCase();
            terminalInput.value = '';
            
            terminalOutput.innerHTML += `<p><span class="prompt">$</span> ${command}</p>`;
            
            switch(command) {
                case 'help':
                    terminalOutput.innerHTML += `<p>Available commands: <span class="term-highlight">about</span>, <span class="term-highlight">projects</span>, <span class="term-highlight">clear</span>, <span class="term-highlight">exit</span></p>`;
                    break;
                case 'about':
                    terminalOutput.innerHTML += `<p>Salup Ghimire. Developer, Student, Chess Player. Initializing global takeover...</p>`;
                    break;
                case 'projects':
                    terminalOutput.innerHTML += `<p>Accessing GitHub repository logs... 2 active modules found.</p>`;
                    break;
                case 'clear':
                    terminalOutput.innerHTML = '';
                    break;
                case 'exit':
                    closeTerminal();
                    break;
                default:
                    terminalOutput.innerHTML += `<p>Command not found: ${command}. Type 'help' for available commands.</p>`;
            }
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    });
}
