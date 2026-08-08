import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

lucide.createIcons();

const homepage = document.getElementById('homepage');
const chatpage = document.getElementById('chatpage');
const btnChat = document.getElementById('btn-chat');
const btnHome = document.getElementById('btn-home');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messageContainer = document.getElementById('message-container');
const roomElements = document.querySelectorAll('.room');

let currentRoom = "General";
let unsubscribe = null;

btnChat.addEventListener('click', () => {
  homepage.style.display = 'none';
  chatpage.style.display = 'flex';
  loadMessages(currentRoom);
});

btnHome.addEventListener('click', () => {
  chatpage.style.display = 'none';
  homepage.style.display = 'flex';
});

roomElements.forEach(room => {
  room.addEventListener('click', (e) => {
    roomElements.forEach(r => r.classList.remove('active'));
    e.target.classList.add('active');
    currentRoom = e.target.getAttribute('data-room');
    loadMessages(currentRoom);
  });
});

signInAnonymously(auth).catch((error) => {
  console.error("Auth Error:", error);
});

function loadMessages(room) {
  if (unsubscribe) unsubscribe();
  messageContainer.innerHTML = '';
  
  const q = query(
    collection(db, "messages"), 
    where("room", "==", room),
    orderBy("createdAt", "asc")
  );

  unsubscribe = onSnapshot(q, (snapshot) => {
    messageContainer.innerHTML = '';
    snapshot.forEach((doc) => {
      const data = doc.data();
      const div = document.createElement('div');
      div.classList.add('message');
      div.textContent = data.text;
      messageContainer.appendChild(div);
    });
    messageContainer.scrollTop = messageContainer.scrollHeight;
  });
}

messageForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;
  
  messageInput.value = '';
  
  try {
    await addDoc(collection(db, "messages"), {
      text: text,
      room: currentRoom,
      createdAt: serverTimestamp(),
      uid: auth.currentUser ? auth.currentUser.uid : 'anonymous'
    });
  } catch (error) {
    console.error("Error sending message: ", error);
  }
});
