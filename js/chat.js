import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDWnr-9qpfzW_y-LMuTorItQTUHJVvhLDk",
  authDomain: "revolt-chat-4fada.firebaseapp.com",
  projectId: "revolt-chat-4fada",
  storageBucket: "revolt-chat-4fada.firebasestorage.app",
  messagingSenderId: "488624788181",
  appId: "1:488624788181:web:1571ba31aafb8c1441c85c"
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
    signInAnonymously(auth).catch((error) => {});
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
