import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: "REPLACE_WITH_YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "REPLACE_WITH_YOUR_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const rewards = [200, 300, 450, 675, 1013, 1519, 2278];
const daysContainer = document.getElementById('days-container');
const collectBtn = document.getElementById('collect-btn');

let currentUid = null;
let userData = null;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUid = user.uid;
    await loadUserData();
  } else {
    signInAnonymously(auth).catch((error) => console.error(error));
  }
});

async function loadUserData() {
  const userRef = doc(db, "users", currentUid);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    userData = docSnap.data();
  } else {
    userData = {
      gemStreak: 1,
      lastGemClaim: 0,
      walletGems: 0
    };
    await setDoc(userRef, userData);
  }
  
  evaluateStreak();
}

function evaluateStreak() {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  let { gemStreak, lastGemClaim } = userData;
  let canClaim = true;

  if (lastGemClaim > 0) {
    if (now - lastGemClaim < oneDay) {
      canClaim = false;
    } else if (now - lastGemClaim >= oneDay * 2) {
      gemStreak = 1;
    } else {
      gemStreak++;
      if (gemStreak > 7) {
        gemStreak = 1;
      }
    }
  }

  userData.gemStreak = gemStreak;
  renderBoard(canClaim);
}

function renderBoard(canClaim) {
  daysContainer.innerHTML = '';
  
  rewards.forEach((amt, index) => {
    const dayNum = index + 1;
    const box = document.createElement('div');
    box.className = 'day-box';
    
    if (dayNum === userData.gemStreak) {
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
    collectBtn.textContent = 'Come Back in
