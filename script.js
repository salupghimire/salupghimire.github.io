// ====== SYSTEM LOADER BLOCK ======
window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.getElementById("loader");
    loader.style.opacity = "0";
    loader.style.visibility = "hidden";
  }, 1000); // Optimized visual response timeout
});

// ====== THEME STORAGE CONTROLLER MATRIX ======
const themeToggle = document.getElementById("themeToggle");
const systemCacheTheme = localStorage.getItem("portfolio-theme");

if (systemCacheTheme === "light") {
  document.body.classList.add("light-theme");
  themeToggle.textContent = "🌙";
} else {
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  const isLightActive = document.body.classList.contains("light-theme");
  localStorage.setItem("portfolio-theme", isLightActive ? "light" : "dark");
  themeToggle.textContent = isLightActive ? "🌙" : "☀️";
});

// ====== PERFORMANCE CURSOR CONTROL PIPELINES ======
const cursor = document.querySelector(".cursor");
const follower = document.querySelector(".cursor-follower");

if (window.matchMedia("(pointer: fine)").matches) {
  document.addEventListener("mousemove", (e) => {
    requestAnimationFrame(() => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      
      follower.style.left = `${e.clientX}px`;
      follower.style.top = `${e.clientY}px`;
    });
  });
}

// ====== OVERLAY MOBILE MENU MECHANICS ======
function toggleMenu() {
  const mobileNav = document.getElementById("mobileNav");
  mobileNav.classList.toggle("active");
  
  const isExpanded = mobileNav.classList.contains("active");
  mobileNav.setAttribute("aria-hidden", !isExpanded ? "true" : "false");
}

document.addEventListener("click", (e) => {
  const mobileNav = document.getElementById("mobileNav");
  const toggleBtn = document.querySelector(".nav-toggle");
  
  if (mobileNav.classList.contains("active") && !mobileNav.contains(e.target) && !toggleBtn.contains(e.target)) {
    toggleMenu();
  }
});

// ====== RECONFIGURED TYPING CYCLE SYSTEM ======
const typingMatrix = ["Student", "Python Explorer", "Front-End Developer", "Chess Player"];
let matrixIdx = 0;
let charIdx = 0;
let processDeletion = false;

function engineeringTypingCycle() {
  const targetElement = document.getElementById("typing");
  if (!targetElement) return;

  const coreString = typingMatrix[matrixIdx];

  if (processDeletion) {
    charIdx--;
  } else {
    charIdx++;
  }

  targetElement.textContent = coreString.substring(0, charIdx);
  let computationalSpeed = processDeletion ? 40 : 80;

  if (!processDeletion && charIdx === coreString.length) {
    computationalSpeed = 1800; // Hold full sentence exposure text frame
    processDeletion = true;
  } else if (processDeletion && charIdx === 0) {
    processDeletion = false;
    matrixIdx = (matrixIdx + 1) % typingMatrix.length;
    computationalSpeed = 300; 
  }

  setTimeout(engineeringTypingCycle, computationalSpeed);
}
engineeringTypingCycle();

// ====== VIEWPORT ANIMATION ENGINE INTERSECTION OBSERVER ======
const intersectionConfiguration = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1
};

const sectionObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      observer.unobserve(entry.target);
    }
  });
}, intersectionConfiguration);

document.querySelectorAll(".section").forEach(sectionBlock => {
  sectionObserver.observe(sectionBlock);
});