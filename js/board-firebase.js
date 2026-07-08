import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';
import {
  getFirestore, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

var firebaseConfig = {
  apiKey: 'AIzaSyCOo16yxWVY7GVq6EY3DIXG8iDQftg8pw8',
  authDomain: 'designplus-dc59f.firebaseapp.com',
  projectId: 'designplus-dc59f',
  storageBucket: 'designplus-dc59f.firebasestorage.app',
  messagingSenderId: '4945130330',
  appId: '1:4945130330:web:99515d69d6106783cdf963'
};

var app = initializeApp(firebaseConfig);
var db = getFirestore(app);
var boardMetaCol = collection(db, 'board_meta');

function maskName(name) {
  var trimmed = (name || '').trim();
  if (trimmed.length <= 1) return trimmed;
  if (trimmed.length === 2) return trimmed[0] + '*';
  return trimmed[0] + '*'.repeat(trimmed.length - 2) + trimmed[trimmed.length - 1];
}

function formatDate(ts) {
  var d = ts && ts.toDate ? ts.toDate() : new Date();
  var mm = String(d.getMonth() + 1).padStart(2, '0');
  var dd = String(d.getDate()).padStart(2, '0');
  return d.getFullYear() + '.' + mm + '.' + dd;
}

async function loadBoardList() {
  var listBody = document.getElementById('boardListBody');
  var empty = document.getElementById('boardEmpty');
  if (!listBody) return;

  try {
    var q = query(boardMetaCol, orderBy('createdAt', 'desc'), limit(50));
    var snap = await getDocs(q);
    listBody.innerHTML = '';

    if (snap.empty) {
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    var total = snap.size;
    var i = 0;
    snap.forEach(function (doc) {
      var data = doc.data();
      var num = total - i;
      i++;

      var row = document.createElement('div');
      row.className = 'board-row';
      row.innerHTML =
        '<span>' + num + '</span>' +
        '<span class="board-row-title">' + escapeHtml(data.title || '') + '</span>' +
        '<span>' + escapeHtml(data.name || '') + '</span>' +
        '<span>' + formatDate(data.createdAt) + '</span>';

      var note = document.createElement('div');
      note.className = 'board-row-note';
      note.hidden = true;
      note.textContent = '내용은 관리자만 확인할 수 있습니다.';

      row.addEventListener('click', function () {
        note.hidden = !note.hidden;
      });

      listBody.appendChild(row);
      listBody.appendChild(note);
    });
  } catch (err) {
    // Firestore not configured yet or unreachable — leave the empty state showing.
    console.warn('Board list unavailable:', err);
  }
}

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

window.SignCraftBoard = {
  addEntry: function (title, name) {
    return addDoc(boardMetaCol, {
      title: title,
      name: maskName(name),
      createdAt: serverTimestamp()
    }).then(function () {
      loadBoardList();
    }).catch(function (err) {
      console.warn('Could not record board entry:', err);
    });
  }
};

loadBoardList();
