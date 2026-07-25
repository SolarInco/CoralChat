document.addEventListener('DOMContentLoaded', () => {
  const toggleParticles = document.getElementById('toggle-particles');
  const saveBtn = document.getElementById('save-btn');
  const themeBoxes = document.querySelectorAll('.theme-box');
  const popup = document.getElementById('settings-popup');

  let currentTheme = localStorage.getItem('theme') || 'default';
  let currentParticles = localStorage.getItem('particles') !== 'off';

  toggleParticles.checked = currentParticles;

  themeBoxes.forEach(box => {
    if (box.getAttribute('data-theme') === currentTheme) {
      box.classList.add('selected');
    }
  });

  themeBoxes.forEach(box => {
    box.addEventListener('click', (e) => {
      themeBoxes.forEach(b => b.classList.remove('selected'));
      e.target.classList.add('selected');

      currentTheme = e.target.getAttribute('data-theme');
      document.body.className = currentTheme === 'default' ? '' : `theme-${currentTheme}`;
    });
  });

  saveBtn.addEventListener('click', () => {
    localStorage.setItem('theme', currentTheme);
    localStorage.setItem('particles', toggleParticles.checked ? 'on' : 'off');

    popup.classList.add('show');

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  });
});
