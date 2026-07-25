lucide.createIcons();

const particlesContainer = document.getElementById('particles-js');


if (localStorage.getItem('particles') !== 'off' && particlesContainer) {
  particlesJS("particles-js", {
    particles: {
      number: { value: 15 },
      color: { value: "#ffffff" },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
      size: { value: 3, random: true },
      line_linked: { enable: false },
      move: { enable: true, speed: 1, direction: "bottom", random: true, straight: false, out_mode: "out" }
    },
    interactivity: { events: { onhover: { enable: false }, onclick: { enable: false } } },
    retina_detect: true
  });
} else if (particlesContainer) {
  particlesContainer.style.display = 'none';
}

// Apply Saved Theme globally
const savedTheme = localStorage.getItem('theme') || 'default';
if (savedTheme !== 'default') {
  document.body.classList.add(`theme-${savedTheme}`);
}

// Handle smooth navigation between pages
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetUrl = link.getAttribute('href');
    const loader = document.getElementById('loading-screen');
    if (loader) {
      loader.style.display = 'flex';
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 1000); // 1 second loading screen
    } else {
      window.location.href = targetUrl;
    }
  });
});
