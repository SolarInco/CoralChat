import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

const msgInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const messagesContainer = document.getElementById('messages-container');
const onlineCountText = document.getElementById('online-count');

let currentUid = null;
let onlineUsersCount = 1;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUid = user.uid;
  } else {
    signInAnonymously(auth).catch((error) => console.error(error));
  }
});

const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));

onSnapshot(q, (snapshot) => {
  messagesContainer.innerHTML = '';
  snapshot.forEach((doc) => {
    const data = doc.data();
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    
    if (data.uid === currentUid) {
      msgDiv.classList.add('sent');
    } else {
      msgDiv.classList.add('received');
    }
    
    msgDiv.textContent = data.text;
    messagesContainer.appendChild(msgDiv);
  });
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

async function sendMessage() {
  const text = msgInput.value.trim();
  if (text !== '' && currentUid) {
    msgInput.value = '';
    await addDoc(collection(db, "messages"), {
      text: text,
      uid: currentUid,
      createdAt: serverTimestamp()
    });
  }
}

sendBtn.addEventListener('click', sendMessage);

msgInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

function updateOnlineCount(count) {
  onlineCountText.textContent = `${count} revolters online`;
}

setInterval(() => {
  onlineUsersCount++;
  updateOnlineCount(onlineUsersCount);
}, 15000);
