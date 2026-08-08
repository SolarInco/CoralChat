import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { getDatabase, ref, onValue, set, onDisconnect } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDWnr-9qpfzW_y-LMuTorItQTUHJVvhLDk",
  authDomain: "revolt-chat-4fada.firebaseapp.com",
  databaseURL: "https://revolt-chat-4fada-default-rtdb.firebaseio.com/",
  projectId: "revolt-chat-4fada",
  storageBucket: "revolt-chat-4fada.firebasestorage.app",
  messagingSenderId: "488624788181",
  appId: "1:488624788181:web:1571ba31aafb8c1441c85c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

const msgInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const messagesContainer = document.getElementById('messages-container');
const onlineCountText = document.getElementById('online-count');
const onlineUsersList = document.getElementById('online-users-list');

let currentUid = null;
let tempUsername = "Revolter_" + Math.floor(Math.random() * 10000);

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUid = user.uid;
    
    const userStatusDatabaseRef = ref(rtdb, '/status/' + currentUid);
    const connectedRef = ref(rtdb, '.info/connected');
    
    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        onDisconnect(userStatusDatabaseRef).remove().then(() => {
          set(userStatusDatabaseRef, {
            online: true,
            username: tempUsername
          });
        });
      }
    });
  } else {
    signInAnonymously(auth).catch((error) => {});
  }
});

const statusRef = ref(rtdb, '/status');
onValue(statusRef, (snapshot) => {
  onlineUsersList.innerHTML = '';
  let count = 0;
  
  snapshot.forEach((childSnapshot) => {
    count++;
    const data = childSnapshot.val();
    const userDiv = document.createElement('div');
    userDiv.classList.add('online-user-item');
    userDiv.textContent = data.username || "Anonymous";
    onlineUsersList.appendChild(userDiv);
  });
  
  onlineCountText.textContent = `${count} revolters online`;
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
