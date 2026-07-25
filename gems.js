document.addEventListener('DOMContentLoaded', () => {
  const rewards = [200, 300, 450, 675, 1013, 1519, 2278];
  const daysContainer = document.getElementById('days-container');
  const collectBtn = document.getElementById('collect-btn');
  
  let streak = parseInt(localStorage.getItem('gemStreak')) || 1;
  let lastClaim = parseInt(localStorage.getItem('lastGemClaim')) || 0;
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  let canClaim = true;

  if (lastClaim > 0) {
    if (now - lastClaim < oneDay) {
      canClaim = false;
    } else if (now - lastClaim >= oneDay * 2) {
      streak = 1;
    } else {
      streak++;
      if (streak > 7) streak = 7;
    }
  }

  rewards.forEach((amt, index) => {
    const dayNum = index + 1;
    const box = document.createElement('div');
    box.className = 'day-box';
    
    if (dayNum === streak) {
      box.classList.add('active');
    }
    
    const label = document.createElement('span');
    label.className = 'day-label';
    label.textContent = `Day ${dayNum}`;
    
    const gemText = document.createElement('span');
    gemText.className = 'gem-amount';
    gemText.textContent = amt;
    
    box.appendChild(label);
    box.appendChild(gemText);
    daysContainer.appendChild(box);
  });

  if (!canClaim) {
    collectBtn.style.opacity = '0.5';
    collectBtn.style.cursor = 'not-allowed';
    collectBtn.textContent = 'Collected Today';
  }

  collectBtn.addEventListener('click', () => {
    if (!canClaim) return;
    
    localStorage.setItem('gemStreak', streak);
    localStorage.setItem('lastGemClaim', Date.now());
    
    let currentWallet = parseInt(localStorage.getItem('walletGems')) || 0;
    currentWallet += rewards[streak - 1];
    localStorage.setItem('walletGems', currentWallet);
    
    canClaim = false;
    collectBtn.style.opacity = '0.5';
    collectBtn.style.cursor = 'not-allowed';
    collectBtn.textContent = 'Collected Today';
    
    if (window.showNotification) {
      window.showNotification("Daily reward collected check wallet");
    }
  });
});
