const savedTheme = localStorage.getItem('revolt_theme') || 'default';
if (savedTheme !== 'default') {
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
  popup.classList.add('show');
  
  setTimeout(() => {
    popup.classList.remove('show');
  }, 3000);
};
