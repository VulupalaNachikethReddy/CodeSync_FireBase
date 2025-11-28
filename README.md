📌 CodeSync — Live HTML/CSS/JS Preview

CodeSync is a simple web app that lets you:

📝 Write HTML, CSS, and JavaScript

🔄 See a live preview instantly

🌐 Share a room ID and collaborate in real time

💾 Save your code snippets using Firebase

🤖 (Optional) Chatbot interface included (not fully working)

This project uses Firebase Firestore for syncing code and storing saved snippets.

🚀 Features

Real-time code syncing

Live preview of HTML/CSS/JS

Join or create rooms

Save your code snippets

Clean and simple UI

Firebase-backed storage

🛠️ Setup
1. Clone the repository
git clone https://github.com/yourusername/codesync.git
cd codesync

2. Add your Firebase config

Open firebase.js and replace the config object with your Firebase project config:

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

3. Run the project

Just open index.html in any browser.

Or run:

npx live-server

📂 Folder Structure
/CodeSync
 ├── index.html
 ├── style.css
 ├── app.js
 ├── firebase.js
 └── assets/

🔐 Firebase Rules (Recommended)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Rooms for real-time syncing
    match /rooms/{roomId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // User-specific saved snippets
    match /users/{userId}/snippets/{snippetId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}

📄 License

This project is licensed under the MIT License.

⭐ Support

If you like this project, please give it a ⭐ on GitHub!
