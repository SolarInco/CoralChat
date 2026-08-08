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
        if (userDoc.exists()) {
            currentUsername = userDoc.data().username;
        }
    } catch (e) {
        console.error(e);
    }

    const userStatusRef = ref(rtdb, '/status/' + user.uid);
    set(userStatusRef, { state: 'online', username: currentUsername });
    onDisconnect(userStatusRef).remove();

    const q = query(
        collection(db, "messages"), 
        orderBy("createdAt", "asc")
    );

    onSnapshot(q, (snapshot) => {
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
                <div class="message-text">${data.text || ""}</div>
            `;

            container.appendChild(msgDiv);
        });

        container.scrollTop = container.scrollHeight;
    });
});

const onlineCountRef = ref(rtdb, '/status');
onValue(onlineCountRef, (snapshot) => {
    const data = snapshot.val();
    const count = data ? Object.keys(data).length : 0;
    const sidePanelHeader = document.querySelector("#side-panel h2");
    
    if (sidePanelHeader) {
        const label = count === 1 ? "Revolter" : "Revolters";
        sidePanelHeader.innerHTML = `Online: <span id="online-count">${count}</span> ${label}`;
    }
});

document.getElementById("send-button").addEventListener("click", async () => {
    const input = document.getElementById("message-input");
    const text = input.value.trim();
    
    if (text.length > 0 && auth.currentUser) {
        input.value = "";
        await addDoc(collection(db, "messages"), {
            text: text,
            uid: auth.currentUser.uid,
            username: currentUsername,
            createdAt: serverTimestamp()
        });
    }
});

document.getElementById("message-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        document.getElementById("send-button").click();
    }
});
