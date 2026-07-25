document.addEventListener('DOMContentLoaded', () => {
  const toggleParticles = document.getElementById('toggle-particles');
  const saveBtn = document.getElementById('save-btn');
  const themeBoxes = document.querySelectorAll('.theme-box');
  const popup = document.getElementById('settings-popup');

  let activeTheme = localStorage.getItem('theme') || 'default';
  let previewTheme = activeTheme;
  let activeParticles = localStorage.getItem('particles') !== 'off';

  toggleParticles.checked = activeParticles;

  themeBoxes.forEach(box => {
    if (box.getAttribute('data-theme') === activeTheme) {
      box.classList.add('selected');
    }
  });

  themeBoxes.forEach(box => {
    box.addEventListener('click', (e) => {
      themeBoxes.forEach(b => b.classList.remove('selected'));
      e.target.classList.add('selected');

      previewTheme = e.target.getAttribute('data-theme');
      document.body.className = previewTheme === 'default' ? '' : `theme-${previewTheme}`;
    });
  });

  saveBtn.addEventListener('click', () => {
    localStorage.setItem('theme', previewTheme);
    localStorage.setItem('particles', toggleParticles.checked ? 'on' : 'off');
    
    activeTheme = previewTheme;
    
    popup.classList.add('show');

    setTimeout(() => {
      popup.classList.remove('show');
    }, 2500);
  });
});
