import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getDatabase, ref, onValue, set, onDisconnect } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

let currentUsername = "Revolter";

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "auth.html";
        return;
    }

    try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().username) {
            currentUsername = userDoc.data().username;
        }
    } catch (error) {
        console.error("Error loading user profile:", error);
    }

    // Set up presence in Realtime Database
    const userStatusRef = ref(rtdb, '/status/' + user.uid);
    set(userStatusRef, { state: 'online', username: currentUsername });
    onDisconnect(userStatusRef).remove();

    // Query messages in ascending order
    const messagesQuery = query(
        collection(db, "messages"), 
        orderBy("createdAt", "asc")
    );

    onSnapshot(messagesQuery, (snapshot) => {
        const container = document.getElementById("messages-container");
        if (!container) return;
        
        container.innerHTML = ""; 

        snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            
            let timeString = "Just now";
            if (data.createdAt) {
                const date = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
                timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }

            const sender = data.username ? data.username : "Revolter";
            const isMe = user.uid === data.uid;

            const msgDiv = document.createElement("div");
            msgDiv.className = `message ${isMe ? "sent" : "received"}`;
            
            msgDiv.innerHTML = `
                <div class="message-info">
                    <span class="sender-id">${sender}</span>
                    <span class="timestamp">${timeString}</span>
                </div>
                <div class="message-text">${escapeHtml(data.text || "")}</div>
            `;

            container.appendChild(msgDiv);
        });

        container.scrollTop = container.scrollHeight;
    });
});

// Presence listener for online user counter
const onlineCountRef = ref(rtdb, '/status');
onValue(onlineCountRef, (snapshot) => {
    const data = snapshot.val();
    const count = data ? Object.keys(data).length : 0;
    const countElement = document.getElementById("online-count");
    
    if (countElement) {
        countElement.innerText = count;
    }
});

function sendMessage() {
    const input = document.getElementById("message-input");
    const text = input.value.trim();
    
    if (text.length > 0 && auth.currentUser) {
        input.value = "";
        addDoc(collection(db, "messages"), {
            text: text,
            uid: auth.currentUser.uid,
            username: currentUsername,
            createdAt: serverTimestamp()
        }).catch((error) => {
            console.error("Error adding document: ", error);
        });
    }
}

function escapeHtml(unsafeText) {
    return unsafeText
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

document.getElementById("send-button").addEventListener("click", sendMessage);

document.getElementById("message-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});
