const toggleFishes = document.getElementById('toggle-fishes');
const toggleParticles = document.getElementById('toggle-particles');
const fishContainer = document.getElementById('fish-container');
const particlesContainer = document.getElementById('particles-js');

toggleFishes.checked = localStorage.getItem('fishes') !== 'off';
toggleParticles.checked = localStorage.getItem('particles') !== 'off';

document.querySelectorAll('.theme-box').forEach(box => {
  box.addEventListener('click', (e) => {
    const theme = e.target.getAttribute('data-theme');
    document.body.className = theme === 'default' ? '' : `theme-${theme}`;
    localStorage.setItem('theme', theme);
  });
});

toggleFishes.addEventListener('change', (e) => {
  fishContainer.style.display = e.target.checked ? 'block' : 'none';
  localStorage.setItem('fishes', e.target.checked ? 'on' : 'off');
});

toggleParticles.addEventListener('change', (e) => {
  particlesContainer.style.display = e.target.checked ? 'block' : 'none';
  localStorage.setItem('particles', e.target.checked ? 'on' : 'off');
});
