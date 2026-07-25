import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where, setDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messageContainer = document.getElementById('message-container');
const roomElements = document.querySelectorAll('.room');
const onlineCount = document.getElementById('online-count');
const onlineUsersList = document.getElementById('online-users-list');

let currentRoom = "General";
let unsubscribeMsg = null;
let unsubscribePresence = null;
let currentUid = null;

roomElements.forEach(room => {
  room.addEventListener('click', (e) => {
    roomElements.forEach(r => r.classList.remove('active'));
    e.target.classList.add('active');
    currentRoom = e.target.getAttribute('data-room');
    loadMessages(currentRoom);
  });
});

signInAnonymously(auth).then((userCredential) => {
  currentUid = userCredential.user.uid;
  const presenceRef = doc(db, "presence", currentUid);
  
  setDoc(presenceRef, {
    uid: currentUid,
    username: `Fish_${currentUid.substring(0, 5)}`,
    lastSeen: serverTimestamp()
  });

  window.addEventListener("beforeunload", () => {
    deleteDoc(presenceRef);
  });

  listenToPresence();
  loadMessages(currentRoom);
}).catch((error) => console.error("Auth Error:", error));

function loadMessages(room) {
  if (unsubscribeMsg) unsubscribeMsg();
  messageContainer.innerHTML = '';
  
  const q = query(collection(db, "messages"), where("room", "==", room), orderBy("createdAt", "asc"));
  unsubscribeMsg = onSnapshot(q, (snapshot) => {
    messageContainer.innerHTML = '';
    snapshot.forEach((doc) => {
      const div = document.createElement('div');
      div.classList.add('message');
      div.textContent = doc.data().text;
      messageContainer.appendChild(div);
    });
    messageContainer.scrollTop = messageContainer.scrollHeight;
  });
}

function listenToPresence() {
  if (unsubscribePresence) unsubscribePresence();
  unsubscribePresence = onSnapshot(collection(db, "presence"), (snapshot) => {
    onlineUsersList.innerHTML = '';
    let count = 0;
    snapshot.forEach((doc) => {
      count++;
      const div = document.createElement('div');
      div.classList.add('online-user');
      div.textContent = doc.data().username;
      onlineUsersList.appendChild(div);
    });
    onlineCount.textContent = count;
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
      uid: currentUid
    });
  } catch (error) {
    console.error("Error sending message: ", error);
  }
});
