// ==========================================================================
// CORE UI: Loader & Mobile Menu
// ==========================================================================
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    loader.style.opacity = '0';
    setTimeout(() => {
        loader.style.display = 'none';
        startTyping(); // Start typing only after loader is gone
    }, 400);
});

function toggleMenu() {
    const nav = document.getElementById('mobileNav');
    const isHidden = nav.getAttribute('aria-hidden') === 'true';
    nav.setAttribute('aria-hidden', !isHidden);
}

// ==========================================================================
// THEME TOGGLE
// ==========================================================================
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    themeToggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
});

// ==========================================================================
// TYPING EFFECT (Optimized Layout-Safe Version)
// ==========================================================================
const typingSpan = document.getElementById("typing");
const words = ["Front-End Developer.", "Python Enthusiast.", "Chess Strategist."];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function startTyping() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        charIndex--;
    } else {
        charIndex++;
    }

    // Using \u00A0 (non-breaking space) keeps the container from collapsing to 0px height
    typingSpan.textContent = currentWord.substring(0, charIndex) || "\u00A0";

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; // Pause at end of word
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500; // Pause before next word
    }

    setTimeout(startTyping, typeSpeed);
}

// ==========================================================================
// FEATURE 1: Scroll Progress Bar
// ==========================================================================
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('scroll-progress').style.width = scrolled + "%";
});

// ==========================================================================
// FEATURE 2: Copy to Clipboard
// ==========================================================================
function copyEmail() {
    navigator.clipboard.writeText("salupghimire10@gmail.com");
    const detail = document.getElementById("email-detail");
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
        if (data.chess_rapid && data.chess_rapid.last) {
            document.getElementById('live-chess-rating').innerText = data.chess_rapid.last.rating;
        } else {
            document.getElementById('live-chess-rating').innerText = "Data Unavailable";
        }
    })
    .catch(error => {
        document.getElementById('live-chess-rating').innerText = "System Offline";
    });

// ==========================================================================
// FEATURE 4: Hidden Terminal Easter Egg
// ==========================================================================
let keyBuffer = '';
const terminalOverlay = document.getElementById('terminal-overlay');
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');

// Listen for "sudo" typed anywhere on the site
window.addEventListener('keydown', (e) => {
    // Ignore keystrokes if they are already inside the terminal or a contact form
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    keyBuffer += e.key.toLowerCase();
    if (keyBuffer.length > 10) keyBuffer = keyBuffer.slice(-10); // keep buffer short
    
    if (keyBuffer.includes('sudo')) {
        terminalOverlay.setAttribute('aria-hidden', 'false');
        terminalInput.focus();
        keyBuffer = ''; // reset buffer
        
        // Prevent scrolling on the main body while terminal is open
        document.body.style.overflow = 'hidden';
    }
});

function closeTerminal() {
    terminalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Handle Terminal Commands
terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = terminalInput.value.trim().toLowerCase();
        terminalInput.value = ''; // clear input
        
        // Echo the command
        terminalOutput.innerHTML += `<p><span class="prompt">$</span> ${command}</p>`;
        
        // Process command
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
            case '':
                break;
            default:
                terminalOutput.innerHTML += `<p>Command not found: ${command}. Type 'help' for available commands.</p>`;
        }
        
        // Auto-scroll to bottom
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
});
