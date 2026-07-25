lucide.createIcons();

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

const savedTheme = localStorage.getItem('theme') || 'default';
if (savedTheme !== 'default') {
  document.body.classList.add(`theme-${savedTheme}`);
}

const fishContainer = document.getElementById('fish-container');
const particlesContainer = document.getElementById('particles-js');

if (localStorage.getItem('fishes') === 'off') {
  fishContainer.style.display = 'none';
}
if (localStorage.getItem('particles') === 'off') {
  particlesContainer.style.display = 'none';
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetUrl = link.getAttribute('href');
    const loader = document.getElementById('loading-screen');
    loader.style.display = 'flex';
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 1200);
  });
});
