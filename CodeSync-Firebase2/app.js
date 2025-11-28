// app.js
import { db, doc, getDoc, setDoc, updateDoc, onSnapshot, serverTimestamp } from "./firebase.js";

const nameInput = document.getElementById("nameInput");
const createBtn = document.getElementById("createBtn");
const joinBtn = document.getElementById("joinBtn");
const roomInput = document.getElementById("roomInput");

const entry = document.getElementById("entry");
const workspace = document.getElementById("workspace");
const roomLabel = document.getElementById("roomLabel");

const htmlEditor = document.getElementById("htmlEditor");
const cssEditor = document.getElementById("cssEditor");
const jsEditor = document.getElementById("jsEditor");
const preview = document.getElementById("preview");

let currentRoom = null;

// 🕓 Debounce helper (prevents too many Firestore writes)
function debounce(fn, delay = 400) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// 🧩 Update Firestore when user edits code
const updateRemote = debounce(async () => {
  if (!currentRoom) return;
  const ref = doc(db, "rooms", currentRoom);
  await updateDoc(ref, {
    html: htmlEditor.value,
    css: cssEditor.value,
    js: jsEditor.value,
    updatedAt: serverTimestamp()
  });
}, 300);

// 💻 Update preview iframe live
function updatePreview() {
  const html = htmlEditor.value;
  const css = `<style>${cssEditor.value}</style>`;
  const js = `<script>${jsEditor.value}<\/script>`;
  preview.srcdoc = html + css + js;
}

// 🏗 Create a new room
createBtn.addEventListener("click", async () => {
  const code = Math.random().toString(36).substring(2, 8);
  const ref = doc(db, "rooms", code);
  await setDoc(ref, {
    html: "",
    css: "",
    js: "",
    createdAt: serverTimestamp()
  });
  joinRoom(code);
});

// 🚪 Join an existing room
joinBtn.addEventListener("click", async () => {
  const code = roomInput.value.trim();
  if (!code) return alert("Enter a valid room code!");
  joinRoom(code);
});

// 🔗 Join or create room logic
async function joinRoom(code) {
  const ref = doc(db, "rooms", code);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    alert("Room not found! Create a new one instead.");
    return;
  }

  entry.style.display = "none";
  workspace.style.display = "block";
  roomLabel.textContent = `Room Code: ${code}`;
  currentRoom = code;

  // Real-time sync listener
  onSnapshot(ref, (snap) => {
    const data = snap.data();
    if (data) {
      if (data.html !== htmlEditor.value) htmlEditor.value = data.html;
      if (data.css !== cssEditor.value) cssEditor.value = data.css;
      if (data.js !== jsEditor.value) jsEditor.value = data.js;
      updatePreview();
    }
  });

  // Local editor changes
  [htmlEditor, cssEditor, jsEditor].forEach(el => {
    el.addEventListener("input", () => {
      updatePreview();
      updateRemote();
    });
  });
}

// 🤖 CodeSync AI Chatbot Integration
const chatInput = document.getElementById("chatInput");
const sendChat = document.getElementById("sendChat");
const chatOutput = document.getElementById("chatOutput");

sendChat.addEventListener("click", async () => {
  const message = chatInput.value.trim();
  if (!message) return;

  // Show user message
  chatOutput.innerHTML += `<p><b>You:</b> ${message}</p>`;
  chatInput.value = "";

  // Send user's code + question to the AI server
  const code = {
    html: htmlEditor.value,
    css: cssEditor.value,
    js: jsEditor.value
  };

  try {
    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: message, code })
    });

    const data = await res.json();

    // Show AI reply
    chatOutput.innerHTML += `<p><b>AI:</b> ${data.reply}</p>`;
  } catch (err) {
    chatOutput.innerHTML += `<p style="color:red;"><b>Error:</b> Could not reach AI server.</p>`;
  }
});

// 🧠 Toggle Chat Visibility (Hide / Show)
const hideChatBtn = document.getElementById("hideChat");
const chatBox = document.getElementById("chatbox");

let chatVisible = true;

hideChatBtn.addEventListener("click", () => {
  chatVisible = !chatVisible;
  chatBox.style.display = chatVisible ? "flex" : "none";
  hideChatBtn.textContent = chatVisible ? "Hide Chat" : "Show Chat";
});

// ✨ --- SNIPPET FEATURE --- ✨
import { collection, addDoc, getDocs } 
  from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Buttons and UI elements
const saveSnippetBtn = document.getElementById("saveSnippetBtn");
const viewSnippetsBtn = document.getElementById("viewSnippetsBtn");
const snippetList = document.getElementById("snippetList");

// 💾 Save Snippet
saveSnippetBtn.addEventListener("click", async () => {
  const name = prompt("Enter a name for your snippet:");
  if (!name) return;

  try {
    await addDoc(collection(db, "snippets"), {
      name,
      html: htmlEditor.value,
      css: cssEditor.value,
      js: jsEditor.value,
      createdAt: serverTimestamp(),
    });
    alert("Snippet saved successfully!");
  } catch (err) {
    console.error("Error saving snippet:", err);
    alert("Failed to save snippet.");
  }
});

// 📁 View Saved Snippets
viewSnippetsBtn.addEventListener("click", async () => {
  snippetList.innerHTML = "<h3>Saved Snippets</h3>";
  snippetList.style.display = "block";

  const querySnapshot = await getDocs(collection(db, "snippets"));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const snippetDiv = document.createElement("div");
    snippetDiv.style.marginBottom = "10px";
    snippetDiv.style.padding = "8px";
    snippetDiv.style.background = "#222";
    snippetDiv.style.borderRadius = "6px";

    snippetDiv.innerHTML = `
      <b>${data.name}</b>
      <button style="margin-left:10px;" onclick="loadSnippet('${docSnap.id}')">Load</button>
    `;
    snippetList.appendChild(snippetDiv);
  });
});

// 🔁 Load snippet into editors
window.loadSnippet = async function (id) {
  const ref = doc(db, "snippets", id);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const data = snap.data();
    htmlEditor.value = data.html || "";
    cssEditor.value = data.css || "";
    jsEditor.value = data.js || "";
    updatePreview();
    alert(`Loaded snippet: ${data.name}`);
  }
};
