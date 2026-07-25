const savedTheme = localStorage.getItem('theme') || 'default';
if (savedTheme !== 'default') {
  document.documentElement.className = `theme-${savedTheme}`;
  document.body.className = `theme-${savedTheme}`;
}

window.showNotification = function(message) {
  let popup = document.getElementById('global-popup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'global-popup';
    document.body.appendChild(popup);
  }
  popup.textContent = message;
  
  setTimeout(() => {
    popup.classList.add('show');
  }, 10);

  setTimeout(() => {
    popup.classList.remove('show');
  }, 2500);
};

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  const particlesContainer = document.getElementById('particles-js');
  const showParticles = localStorage.getItem('particles') !== 'off';

  if (showParticles && particlesContainer) {
    particlesContainer.style.display = 'block';
    particlesJS("particles-js", {
      particles: {
        number: { value: 20 },
        color: { value: "#000000" },
        shape: { type: "circle" },
        opacity: { value: 0.8, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
        size: { value: 7, random: true },
        line_linked: { enable: false },
        move: { enable: true, speed: 1.5, direction: "bottom", random: true, straight: false, out_mode: "out" }
      },
      interactivity: { events: { onhover: { enable: false }, onclick: { enable: false } } },
      retina_detect: true
    });
  } else if (particlesContainer) {
    particlesContainer.style.display = 'none';
  }

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetUrl = link.closest('a').getAttribute('href');
      const loader = document.getElementById('loading-screen');
      if (loader) {
        loader.style.display = 'flex';
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 800); 
      } else {
        window.location.href = targetUrl;
      }
    });
  });
});
