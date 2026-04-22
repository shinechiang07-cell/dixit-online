import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import {
  getFirestore, doc, setDoc, updateDoc, getDoc, onSnapshot,
  collection, getDocs, writeBatch, serverTimestamp, arrayUnion, deleteDoc
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

// ═══ Firebase 設定 ═══
const firebaseConfig = {
  apiKey: "AIzaSyDv4OffduiLcJigGvVaV2ANV5NZowDSV_M",
  authDomain: "teacherstudy-46c01.firebaseapp.com",
  projectId: "teacherstudy-46c01",
  storageBucket: "teacherstudy-46c01.firebasestorage.app",
  messagingSenderId: "965666590410",
  appId: "1:965666590410:web:da4d226c845ccc20e8ee33"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ═══ 84 張圖畫牌 ═══
const CARDS = [
  {id:0,  main:'🌊', s:['🐋','🏝️'], bg:'linear-gradient(135deg,#0d4a8a,#1a6fb7)'},
  {id:1,  main:'🌙', s:['⭐','🦉'],  bg:'linear-gradient(135deg,#1a1a3e,#4a3a8a)'},
  {id:2,  main:'🌸', s:['🦋','🌿'], bg:'linear-gradient(135deg,#9d174d,#f472b6)'},
  {id:3,  main:'🔥', s:['🌋','🐉'], bg:'linear-gradient(135deg,#7c0000,#dc2626)'},
  {id:4,  main:'🌈', s:['☁️','🌦️'], bg:'linear-gradient(135deg,#1d4ed8,#60a5fa)'},
  {id:5,  main:'🗝️', s:['🚪','🏰'], bg:'linear-gradient(135deg,#78350f,#d97706)'},
  {id:6,  main:'🎭', s:['🎪','🎬'], bg:'linear-gradient(135deg,#4c1d95,#8b5cf6)'},
  {id:7,  main:'🦅', s:['⛰️','🌤️'], bg:'linear-gradient(135deg,#1e3a5f,#3b82f6)'},
  {id:8,  main:'🌺', s:['🦜','🌿'], bg:'linear-gradient(135deg,#831843,#f43f5e)'},
  {id:9,  main:'⏳', s:['🌅','🕰️'], bg:'linear-gradient(135deg,#92400e,#f59e0b)'},
  {id:10, main:'🦊', s:['🍂','🌲'], bg:'linear-gradient(135deg,#7c2d12,#ea580c)'},
  {id:11, main:'🧊', s:['❄️','🐧'], bg:'linear-gradient(135deg,#0c4a6e,#38bdf8)'},
  {id:12, main:'🌿', s:['🐛','🌱'], bg:'linear-gradient(135deg,#14532d,#22c55e)'},
  {id:13, main:'🏺', s:['🌙','🌟'], bg:'linear-gradient(135deg,#451a03,#b45309)'},
  {id:14, main:'🐙', s:['🌊','🦑'], bg:'linear-gradient(135deg,#1e1b4b,#4338ca)'},
  {id:15, main:'🎠', s:['🎡','⭐'], bg:'linear-gradient(135deg,#4a044e,#a21caf)'},
  {id:16, main:'🦁', s:['🌾','🦒'], bg:'linear-gradient(135deg,#713f12,#ca8a04)'},
  {id:17, main:'🌌', s:['🚀','👽'], bg:'linear-gradient(135deg,#0f0a1e,#3730a3)'},
  {id:18, main:'🏔️', s:['🌨️','🐺'], bg:'linear-gradient(135deg,#1e293b,#475569)'},
  {id:19, main:'🎸', s:['🎵','🌃'], bg:'linear-gradient(135deg,#0f172a,#334155)'},
  {id:20, main:'🦢', s:['🌊','🌿'], bg:'linear-gradient(135deg,#1e3a5f,#bae6fd)'},
  {id:21, main:'🍄', s:['🐝','🌻'], bg:'linear-gradient(135deg,#7f1d1d,#f59e0b)'},
  {id:22, main:'🗺️', s:['⚓','🏴‍☠️'], bg:'linear-gradient(135deg,#292524,#78716c)'},
  {id:23, main:'🧙', s:['🌙','⭐'], bg:'linear-gradient(135deg,#1e1b4b,#7c3aed)'},
  {id:24, main:'🐬', s:['🌊','🌅'], bg:'linear-gradient(135deg,#0c4a6e,#0ea5e9)'},
  {id:25, main:'🌻', s:['☀️','🐝'], bg:'linear-gradient(135deg,#78350f,#eab308)'},
  {id:26, main:'🦋', s:['🌸','🌈'], bg:'linear-gradient(135deg,#4c1d95,#f472b6)'},
  {id:27, main:'🏰', s:['🗡️','🛡️'], bg:'linear-gradient(135deg,#1c1917,#57534e)'},
  {id:28, main:'🔮', s:['✨','🌙'], bg:'linear-gradient(135deg,#3b0764,#9333ea)'},
  {id:29, main:'🎁', s:['🎀','⭐'], bg:'linear-gradient(135deg,#7f1d1d,#ef4444)'},
  {id:30, main:'🌵', s:['🦂','🌅'], bg:'linear-gradient(135deg,#365314,#84cc16)'},
  {id:31, main:'🐉', s:['🔥','🏔️'], bg:'linear-gradient(135deg,#14532d,#16a34a)'},
  {id:32, main:'📚', s:['🕯️','🦉'], bg:'linear-gradient(135deg,#292524,#a16207)'},
  {id:33, main:'🌺', s:['🦜','🌈'], bg:'linear-gradient(135deg,#7c0000,#f59e0b)'},
  {id:34, main:'⚡', s:['🌩️','🌊'], bg:'linear-gradient(135deg,#1e1b4b,#ca8a04)'},
  {id:35, main:'🦌', s:['❄️','🌲'], bg:'linear-gradient(135deg,#0c4a6e,#166534)'},
  {id:36, main:'🏄', s:['🌊','🐚'], bg:'linear-gradient(135deg,#0c4a6e,#0d9488)'},
  {id:37, main:'🐼', s:['🎋','☁️'], bg:'linear-gradient(135deg,#1c1917,#4ade80)'},
  {id:38, main:'🦊', s:['🌙','⭐'], bg:'linear-gradient(135deg,#7c2d12,#1e293b)'},
  {id:39, main:'⛩️', s:['🌸','🌊'], bg:'linear-gradient(135deg,#7f1d1d,#0c4a6e)'},
  {id:40, main:'🎭', s:['🌙','✨'], bg:'linear-gradient(135deg,#0f172a,#6d28d9)'},
  {id:41, main:'🐠', s:['🌊','🌿'], bg:'linear-gradient(135deg,#0c4a6e,#15803d)'},
  {id:42, main:'🧪', s:['💡','🔬'], bg:'linear-gradient(135deg,#0f172a,#1d4ed8)'},
  {id:43, main:'🌾', s:['🏺','🌅'], bg:'linear-gradient(135deg,#78350f,#ca8a04)'},
  {id:44, main:'🐺', s:['🌙','🌲'], bg:'linear-gradient(135deg,#0f172a,#15803d)'},
  {id:45, main:'🦅', s:['🌊','🏔️'], bg:'linear-gradient(135deg,#1e293b,#1e3a5f)'},
  {id:46, main:'🎠', s:['🌈','💫'], bg:'linear-gradient(135deg,#7f1d1d,#4c1d95)'},
  {id:47, main:'🐸', s:['🌧️','🌿'], bg:'linear-gradient(135deg,#14532d,#0c4a6e)'},
  {id:48, main:'🌌', s:['🌙','💫'], bg:'linear-gradient(135deg,#0f0a1e,#312e81)'},
  {id:49, main:'🧜', s:['🌊','🐚'], bg:'linear-gradient(135deg,#0c4a6e,#7c3aed)'},
  {id:50, main:'🏵️', s:['🌿','🦋'], bg:'linear-gradient(135deg,#14532d,#b45309)'},
  {id:51, main:'🔑', s:['🌅','🏰'], bg:'linear-gradient(135deg,#78350f,#b45309)'},
  {id:52, main:'🐋', s:['🌊','🌙'], bg:'linear-gradient(135deg,#0f172a,#1e3a5f)'},
  {id:53, main:'🌺', s:['🌙','⭐'], bg:'linear-gradient(135deg,#831843,#1e293b)'},
  {id:54, main:'🐘', s:['🌳','☁️'], bg:'linear-gradient(135deg,#1c1917,#15803d)'},
  {id:55, main:'🌈', s:['🌧️','⭐'], bg:'linear-gradient(135deg,#1d4ed8,#ca8a04)'},
  {id:56, main:'🎶', s:['🌙','💫'], bg:'linear-gradient(135deg,#4c1d95,#0f172a)'},
  {id:57, main:'🦚', s:['🌿','🌸'], bg:'linear-gradient(135deg,#1e3a5f,#166534)'},
  {id:58, main:'🌋', s:['🔥','🌊'], bg:'linear-gradient(135deg,#7c0000,#1e3a5f)'},
  {id:59, main:'🧊', s:['🌙','⭐'], bg:'linear-gradient(135deg,#0c4a6e,#0f172a)'},
  {id:60, main:'🦁', s:['🌙','🔥'], bg:'linear-gradient(135deg,#78350f,#0f172a)'},
  {id:61, main:'🐢', s:['🌿','🌊'], bg:'linear-gradient(135deg,#14532d,#0c4a6e)'},
  {id:62, main:'🏮', s:['🌙','🌸'], bg:'linear-gradient(135deg,#7c0000,#1e293b)'},
  {id:63, main:'🌙', s:['🌸','🌿'], bg:'linear-gradient(135deg,#1e1b4b,#166534)'},
  {id:64, main:'⚓', s:['🌊','🌩️'], bg:'linear-gradient(135deg,#0f172a,#1e3a5f)'},
  {id:65, main:'🔭', s:['🌌','🌙'], bg:'linear-gradient(135deg,#0f0a1e,#6d28d9)'},
  {id:66, main:'🌻', s:['🦋','🌿'], bg:'linear-gradient(135deg,#78350f,#15803d)'},
  {id:67, main:'🎪', s:['⭐','🌙'], bg:'linear-gradient(135deg,#7f1d1d,#1e293b)'},
  {id:68, main:'🦋', s:['🌺','☁️'], bg:'linear-gradient(135deg,#4c1d95,#e2e8f0)'},
  {id:69, main:'🏰', s:['🌊','⚓'], bg:'linear-gradient(135deg,#1c1917,#1e3a5f)'},
  {id:70, main:'🐍', s:['🌿','🌸'], bg:'linear-gradient(135deg,#14532d,#9d174d)'},
  {id:71, main:'🎨', s:['🌈','✨'], bg:'linear-gradient(135deg,#7f1d1d,#b45309)'},
  {id:72, main:'🐺', s:['🌙','❄️'], bg:'linear-gradient(135deg,#0f172a,#334155)'},
  {id:73, main:'🌸', s:['🐝','🌿'], bg:'linear-gradient(135deg,#9d174d,#15803d)'},
  {id:74, main:'🌅', s:['🌊','🦅'], bg:'linear-gradient(135deg,#78350f,#1e3a5f)'},
  {id:75, main:'🐉', s:['🌸','✨'], bg:'linear-gradient(135deg,#14532d,#9d174d)'},
  {id:76, main:'🔮', s:['🌊','🌙'], bg:'linear-gradient(135deg,#4c1d95,#1e3a5f)'},
  {id:77, main:'🌲', s:['🦌','❄️'], bg:'linear-gradient(135deg,#14532d,#334155)'},
  {id:78, main:'🎭', s:['🌸','✨'], bg:'linear-gradient(135deg,#4c1d95,#9d174d)'},
  {id:79, main:'🌙', s:['🌊','🐚'], bg:'linear-gradient(135deg,#0f172a,#1e3a5f)'},
  {id:80, main:'🦜', s:['🌴','🌺'], bg:'linear-gradient(135deg,#14532d,#7f1d1d)'},
  {id:81, main:'🕯️', s:['📚','🌙'], bg:'linear-gradient(135deg,#b45309,#0f172a)'},
  {id:82, main:'🐬', s:['🌊','🌈'], bg:'linear-gradient(135deg,#0c4a6e,#78350f)'},
  {id:83, main:'🦚', s:['🌺','🌿'], bg:'linear-gradient(135deg,#7f1d1d,#14532d)'},
];

// ═══ 遊戲狀態 ═══
let G = {
  roomCode: null, playerName: null, isHost: false,
  room: null, players: [],
  unsubRoom: null, unsubPlayers: null,
  selectedCard: null
};

// ═══ 工具函式 ═══
const $ = id => document.getElementById(id);
const PLAYER_EMOJIS = ['🐰','🦊','🐼','🐬','🦅','🌸','🐯','🦋'];
function pEmoji(name) {
  let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return PLAYER_EMOJIS[Math.abs(h) % PLAYER_EMOJIS.length];
}
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function genCode() { return Math.random().toString(36).substring(2, 8).toUpperCase(); }
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(`screen-${name}`).classList.add('active');
}
function showToast(msg, type = 'info') {
  const t = $('toast'); t.textContent = msg; t.className = `toast ${type}`;
  t.classList.remove('hidden'); setTimeout(() => t.classList.add('hidden'), 3000);
}
function setLoading(on) { $('loading').classList.toggle('hidden', !on); }

// ═══ 牌面渲染 ═══
function makeCard(cardId, opts = {}) {
  const card = CARDS[cardId];
  const el = document.createElement('div');
  el.className = 'game-card'; el.dataset.cardId = cardId;
  el.style.background = card.bg;
  const inner = document.createElement('div');
  inner.className = 'card-inner';
  inner.innerHTML = `<div class="card-sides">${card.s[0]}</div><div class="card-main">${card.main}</div><div class="card-sides">${card.s[1]||''}</div>`;
  el.appendChild(inner);
  if (opts.label) { const lb = document.createElement('div'); lb.className = 'card-label'; lb.textContent = opts.label; el.appendChild(lb); }
  if (opts.votes != null) { const v = document.createElement('div'); v.className = 'card-votes'; v.textContent = `+${opts.votes}`; el.appendChild(v); }
  if (opts.voterEmojis) { const ve = document.createElement('div'); ve.className = 'voted-by'; ve.textContent = opts.voterEmojis; el.appendChild(ve); }
  if (opts.isStoryteller) el.classList.add('storyteller-reveal');
  if (opts.clickable) { el.classList.add('clickable'); el.addEventListener('click', () => opts.onClick(cardId)); }
  return el;
}

// ═══ 建立房間 ═══
async function createRoom() {
  const name = $('player-name').value.trim();
  if (!name) { showToast('請輸入名字', 'error'); return; }
  setLoading(true);
  const code = genCode();
  const deck = shuffle(CARDS.map(c => c.id));
  try {
    await setDoc(doc(db, 'rooms', code), {
      host: name, phase: 'lobby', storytellerIndex: 0,
      clue: '', storytellerCard: -1, deck, tableCards: [],
      round: 1, winScore: 30, orderedPlayers: [name], createdAt: serverTimestamp()
    });
    await setDoc(doc(db, 'rooms', code, 'players', name), {
      name, score: 0, hand: [], submittedCard: -1, vote: '', joinedAt: serverTimestamp()
    });
    G.roomCode = code; G.playerName = name; G.isHost = true;
    $('display-room-code').textContent = code;
    subscribe(code); showScreen('lobby');
  } catch(e) { showToast('建立失敗：' + e.message, 'error'); }
  setLoading(false);
}

// ═══ 加入房間 ═══
async function joinRoom() {
  const name = $('player-name').value.trim();
  const code = $('room-code-input').value.trim().toUpperCase();
  if (!name) { showToast('請輸入名字', 'error'); return; }
  if (code.length !== 6) { showToast('請輸入6位房間碼', 'error'); return; }
  setLoading(true);
  try {
    const snap = await getDoc(doc(db, 'rooms', code));
    if (!snap.exists()) { showToast('找不到此房間', 'error'); setLoading(false); return; }
    const data = snap.data();
    if (data.phase !== 'lobby') { showToast('遊戲已開始', 'error'); setLoading(false); return; }
    if (data.orderedPlayers.length >= 6) { showToast('房間已滿', 'error'); setLoading(false); return; }
    if (data.orderedPlayers.includes(name)) { showToast('名字已被使用', 'error'); setLoading(false); return; }
    await updateDoc(doc(db, 'rooms', code), { orderedPlayers: arrayUnion(name) });
    await setDoc(doc(db, 'rooms', code, 'players', name), {
      name, score: 0, hand: [], submittedCard: -1, vote: '', joinedAt: serverTimestamp()
    });
    G.roomCode = code; G.playerName = name; G.isHost = false;
    $('display-room-code').textContent = code;
    subscribe(code); showScreen('lobby');
  } catch(e) { showToast('加入失敗：' + e.message, 'error'); }
  setLoading(false);
}

// ═══ 即時訂閱 ═══
function subscribe(code) {
  if (G.unsubRoom) G.unsubRoom();
  if (G.unsubPlayers) G.unsubPlayers();
  let latestRoom = null, latestPlayers = [];
  G.unsubRoom = onSnapshot(doc(db, 'rooms', code), snap => {
    if (!snap.exists()) return;
    latestRoom = snap.data(); onUpdate(latestRoom, latestPlayers);
  });
  G.unsubPlayers = onSnapshot(collection(db, 'rooms', code, 'players'), snap => {
    latestPlayers = snap.docs.map(d => d.data())
      .sort((a, b) => (a.joinedAt?.toMillis?.() || 0) - (b.joinedAt?.toMillis?.() || 0));
    G.players = latestPlayers;
    if (latestRoom) onUpdate(latestRoom, latestPlayers);
  });
}

// ═══ 狀態更新總入口 ═══
function onUpdate(room, players) {
  G.room = room; G.players = players;
  const { phase } = room;
  const me = players.find(p => p.name === G.playerName);
  const storytellerName = room.orderedPlayers[room.storytellerIndex % room.orderedPlayers.length];
  const iAmStoryteller = storytellerName === G.playerName;

  if (phase === 'lobby') { renderLobby(room, players); return; }
  if (!document.getElementById('screen-game').classList.contains('active')) showScreen('game');
  if (phase === 'ended') { renderEnd(players); return; }
  renderGame(room, players, me, storytellerName, iAmStoryteller);

  // 房主負責推進階段
  if (G.isHost) {
    if (phase === 'submitting') checkAllSubmitted(room, players, storytellerName);
    if (phase === 'voting') checkAllVoted(room, players, storytellerName);
  }
}

// ═══ Lobby UI ═══
function renderLobby(room, players) {
  if (!document.getElementById('screen-lobby').classList.contains('active')) showScreen('lobby');
  const grid = $('lobby-players'); grid.innerHTML = '';
  players.forEach(p => {
    const row = document.createElement('div'); row.className = 'player-row';
    row.innerHTML = `<span class="player-emoji">${pEmoji(p.name)}</span><span class="player-name">${p.name}</span>${p.name === room.host ? '<span class="host-badge">房主</span>' : ''}`;
    grid.appendChild(row);
  });
  const need = Math.max(0, 3 - players.length);
  $('lobby-status').textContent = need > 0 ? `還需要 ${need} 位玩家` : `${players.length} 位玩家已就緒，可以開始！`;
  const startBtn = $('btn-start');
  if (G.isHost && players.length >= 3) startBtn.style.display = 'block';
  else startBtn.style.display = 'none';
}

// ═══ Game UI ═══
function renderGame(room, players, me, storytellerName, iAmStoryteller) {
  $('round-label').textContent = `第 ${room.round} 回合`;
  const labels = { storytelling:'說書人出牌', submitting:'玩家選牌', voting:'投票中', scoring:'計分結果' };
  $('phase-badge').textContent = labels[room.phase] || '';

  // 分數列
  $('score-bar').innerHTML = players.map(p =>
    `<div class="score-item"><span>${pEmoji(p.name)}</span><span class="score-name">${p.name.slice(0,4)}</span><span class="score-val">${p.score}</span></div>`
  ).join('');

  // 說書人 chip
  $('storyteller-chip').classList.remove('hidden');
  $('storyteller-name').textContent = storytellerName;

  // 線索 chip
  if (room.clue && room.phase !== 'storytelling') {
    $('clue-chip').classList.remove('hidden');
    $('clue-text').textContent = room.clue;
  } else { $('clue-chip').classList.add('hidden'); }

  // 隱藏所有區域
  ['table-section','scoring-section','hand-section','clue-input-section'].forEach(id => $(id).classList.add('hidden'));
  $('btn-next-round').style.display = 'none';

  if (room.phase === 'storytelling') renderStorytelling(room, me, iAmStoryteller, storytellerName);
  else if (room.phase === 'submitting') renderSubmitting(room, me, iAmStoryteller, players, storytellerName);
  else if (room.phase === 'voting') renderVoting(room, me, iAmStoryteller);
  else if (room.phase === 'scoring') renderScoring(room, players, me, storytellerName);
}

function renderStorytelling(room, me, iAmStoryteller, storytellerName) {
  if (iAmStoryteller) {
    $('hand-section').classList.remove('hidden');
    $('hand-title').textContent = '選一張牌作為你的線索牌';
    $('clue-input-section').classList.remove('hidden');
    $('status-msg').textContent = '輪到你！選一張牌，輸入線索，再送出。';
    renderHand(me?.hand || [], cardId => {
      G.selectedCard = cardId;
      $('btn-submit-clue').disabled = false;
      document.querySelectorAll('#hand-cards .game-card').forEach(c =>
        c.classList.toggle('selected', +c.dataset.cardId === cardId));
    });
  } else {
    $('status-msg').textContent = `等待 ${storytellerName} 說出線索…`;
  }
}

function renderSubmitting(room, me, iAmStoryteller, players, storytellerName) {
  if (iAmStoryteller) {
    const done = players.filter(p => p.name !== storytellerName && p.submittedCard !== -1).length;
    $('status-msg').textContent = `等待其他玩家選牌… (${done}/${players.length - 1})`;
  } else if (me?.submittedCard !== -1) {
    $('status-msg').textContent = '已出牌！等待其他玩家…';
  } else {
    $('hand-section').classList.remove('hidden');
    $('hand-title').textContent = '選一張最符合線索的牌';
    $('status-msg').textContent = '選一張最能代表線索的牌！';
    renderHand(me?.hand || [], cardId => doSubmitCard(cardId));
  }
}

function renderVoting(room, me, iAmStoryteller) {
  $('table-section').classList.remove('hidden');
  $('table-hint').textContent = '';
  if (iAmStoryteller) {
    $('status-msg').textContent = '等待玩家投票…';
    renderTable(room.tableCards, false, null);
  } else if (me?.vote) {
    $('status-msg').textContent = '已投票！等待其他玩家…';
    renderTable(room.tableCards, false, null);
  } else {
    $('status-msg').textContent = '點選你認為是說書人的牌！（不能投自己的牌）';
    $('table-hint').textContent = '↓ 點選投票';
    renderTable(room.tableCards, true, ownerName => {
      if (ownerName === G.playerName) { showToast('不能投票給自己的牌！', 'error'); return; }
      doSubmitVote(ownerName);
    });
  }
}

function renderScoring(room, players, me, storytellerName) {
  $('table-section').classList.remove('hidden');
  $('scoring-section').classList.remove('hidden');

  // 統計票數
  const votesByOwner = {};
  players.forEach(p => { if (p.vote) votesByOwner[p.vote] = (votesByOwner[p.vote] || []).concat(pEmoji(p.name)); });

  // 桌面牌（顯示 owner）
  const container = $('table-cards'); container.innerHTML = '';
  room.tableCards.forEach(tc => {
    const isS = tc.owner === storytellerName;
    const votes = votesByOwner[tc.owner] || [];
    const el = makeCard(tc.cardId, {
      label: tc.owner,
      votes: votes.length,
      voterEmojis: votes.join(' '),
      isStoryteller: isS
    });
    container.appendChild(el);
  });

  // 計分摘要
  const correctVoters = players.filter(p => p.vote === storytellerName && p.name !== storytellerName);
  const n = players.length - 1;
  const allRight = correctVoters.length === n, noneRight = correctVoters.length === 0;
  let note = '';
  if (allRight) note = '全部猜中！說書人 0 分，其他人各 +2';
  else if (noneRight) note = '全部猜錯！說書人 0 分，其他人各 +2';
  else note = '說書人 +3，猜中的玩家 +3，其他牌每票 +1';

  const sorted = [...players].sort((a, b) => b.score - a.score);
  $('scoring-results').innerHTML = `
    <div class="scoring-summary"><p>${note}</p></div>
    <div class="player-scores">${sorted.map(p => `
      <div class="score-row ${p.name === storytellerName ? 'storyteller' : ''}">
        <span>${pEmoji(p.name)} ${p.name}</span>
        ${p.name === storytellerName ? '<span class="badge">說書人</span>' : ''}
        <span class="score-total">${p.score} 分</span>
      </div>`).join('')}
    </div>`;

  if (G.isHost) $('btn-next-round').style.display = 'block';
}

function renderHand(hand, onSelect) {
  const c = $('hand-cards'); c.innerHTML = '';
  hand.forEach(cardId => c.appendChild(makeCard(cardId, { clickable: true, onClick: onSelect })));
}

function renderTable(tableCards, clickable, onClick) {
  const c = $('table-cards'); c.innerHTML = '';
  tableCards.forEach(tc => c.appendChild(makeCard(tc.cardId, {
    clickable, onClick: clickable ? () => onClick(tc.owner) : null
  })));
}

// ═══ 開始遊戲 ═══
async function startGame() {
  if (!G.isHost || G.players.length < 3) return;
  setLoading(true);
  try {
    const room = G.room; let deck = [...room.deck];
    const batch = writeBatch(db);
    room.orderedPlayers.forEach(pName => {
      const hand = deck.splice(0, 6);
      batch.update(doc(db, 'rooms', G.roomCode, 'players', pName), { hand });
    });
    batch.update(doc(db, 'rooms', G.roomCode), { phase: 'storytelling', deck, storytellerIndex: 0 });
    await batch.commit();
  } catch(e) { showToast('開始失敗：' + e.message, 'error'); }
  setLoading(false);
}

// ═══ 說書人出牌 ═══
async function doSubmitClue() {
  const clue = $('clue-input').value.trim();
  const cardId = G.selectedCard;
  if (!clue) { showToast('請輸入線索', 'error'); return; }
  if (cardId === null) { showToast('請先選一張牌', 'error'); return; }
  setLoading(true);
  try {
    const me = G.players.find(p => p.name === G.playerName);
    const newHand = me.hand.filter(c => c !== cardId);
    const batch = writeBatch(db);
    batch.update(doc(db, 'rooms', G.roomCode, 'players', G.playerName), { hand: newHand, submittedCard: cardId });
    batch.update(doc(db, 'rooms', G.roomCode), { phase: 'submitting', clue, storytellerCard: cardId });
    await batch.commit();
    $('clue-input').value = ''; G.selectedCard = null;
  } catch(e) { showToast('送出失敗', 'error'); }
  setLoading(false);
}

// ═══ 一般玩家出牌 ═══
async function doSubmitCard(cardId) {
  setLoading(true);
  try {
    const me = G.players.find(p => p.name === G.playerName);
    const newHand = me.hand.filter(c => c !== cardId);
    await updateDoc(doc(db, 'rooms', G.roomCode, 'players', G.playerName), { hand: newHand, submittedCard: cardId });
  } catch(e) { showToast('出牌失敗', 'error'); }
  setLoading(false);
}

// ═══ 投票 ═══
async function doSubmitVote(ownerName) {
  setLoading(true);
  try {
    await updateDoc(doc(db, 'rooms', G.roomCode, 'players', G.playerName), { vote: ownerName });
  } catch(e) { showToast('投票失敗', 'error'); }
  setLoading(false);
}

// ═══ 房主：推進至投票 ═══
async function checkAllSubmitted(room, players, storytellerName) {
  const nonS = players.filter(p => p.name !== storytellerName);
  if (nonS.length === 0 || nonS.some(p => p.submittedCard === -1)) return;
  if (room.phase !== 'submitting') return;

  const tableCards = shuffle([
    { owner: storytellerName, cardId: room.storytellerCard },
    ...nonS.map(p => ({ owner: p.name, cardId: p.submittedCard }))
  ]);
  try {
    await updateDoc(doc(db, 'rooms', G.roomCode), { phase: 'voting', tableCards });
  } catch(e) { /* ignore race */ }
}

// ═══ 房主：推進至計分 ═══
async function checkAllVoted(room, players, storytellerName) {
  const nonS = players.filter(p => p.name !== storytellerName);
  if (nonS.length === 0 || nonS.some(p => !p.vote)) return;
  if (room.phase !== 'voting') return;
  try {
    await advanceToScoring(room, players, storytellerName);
  } catch(e) { /* ignore race */ }
}

// ═══ 計算並更新分數 ═══
async function advanceToScoring(room, players, storytellerName) {
  const correctVoters = players.filter(p => p.vote === storytellerName && p.name !== storytellerName);
  const nonS = players.filter(p => p.name !== storytellerName);
  const allRight = correctVoters.length === nonS.length;
  const noneRight = correctVoters.length === 0;

  const batch = writeBatch(db);
  players.forEach(p => {
    let add = 0;
    if (p.name === storytellerName) {
      add = (allRight || noneRight) ? 0 : 3;
    } else {
      add = (allRight || noneRight) ? 2 : (p.vote === storytellerName ? 3 : 0);
      // 每一票給你的牌 +1
      add += players.filter(v => v.vote === p.name && v.name !== storytellerName).length;
    }
    batch.update(doc(db, 'rooms', G.roomCode, 'players', p.name), { score: p.score + add });
  });
  batch.update(doc(db, 'rooms', G.roomCode), { phase: 'scoring' });
  await batch.commit();
}

// ═══ 下一回合 ═══
async function nextRound() {
  if (!G.isHost) return;
  setLoading(true);
  try {
    const room = G.room; const players = G.players;
    let deck = [...room.deck];
    const hasWinner = players.some(p => p.score >= room.winScore);
    const newSI = (room.storytellerIndex + 1) % room.orderedPlayers.length;
    const newPhase = (hasWinner || deck.length < players.length) ? 'ended' : 'storytelling';

    const batch = writeBatch(db);
    players.forEach(p => {
      const newCard = deck.length > 0 ? deck.splice(0, 1) : [];
      batch.update(doc(db, 'rooms', G.roomCode, 'players', p.name), {
        hand: [...p.hand, ...newCard], submittedCard: -1, vote: ''
      });
    });
    batch.update(doc(db, 'rooms', G.roomCode), {
      phase: newPhase, storytellerIndex: newSI,
      clue: '', storytellerCard: -1, tableCards: [], deck, round: room.round + 1
    });
    await batch.commit();
  } catch(e) { showToast('下一回合失敗', 'error'); }
  setLoading(false);
}

// ═══ 結局 ═══
function renderEnd(players) {
  showScreen('end');
  const sorted = [...players].sort((a, b) => b.score - a.score);
  $('final-scores').innerHTML = sorted.map((p, i) =>
    `<div class="final-score-row ${i === 0 ? 'winner' : ''}">
      <span class="rank">${['🥇','🥈','🥉'][i] || (i+1+'.')}</span>
      <span>${pEmoji(p.name)} ${p.name}</span>
      <span class="final-score-val">${p.score} 分</span>
    </div>`).join('');
}

function leaveRoom() {
  if (G.unsubRoom) G.unsubRoom();
  if (G.unsubPlayers) G.unsubPlayers();
  G = { roomCode:null, playerName:null, isHost:false, room:null, players:[], unsubRoom:null, unsubPlayers:null, selectedCard:null };
  showScreen('home');
}

// ═══ 事件綁定 ═══
$('btn-create').addEventListener('click', createRoom);
$('btn-join').addEventListener('click', joinRoom);
$('btn-start').addEventListener('click', startGame);
$('btn-submit-clue').addEventListener('click', doSubmitClue);
$('btn-next-round').addEventListener('click', nextRound);
$('btn-leave').addEventListener('click', leaveRoom);
$('btn-play-again').addEventListener('click', leaveRoom);
$('btn-home').addEventListener('click', leaveRoom);
$('btn-copy-code').addEventListener('click', () => {
  navigator.clipboard.writeText($('display-room-code').textContent);
  showToast('已複製房間碼！', 'success');
});
$('player-name').addEventListener('keypress', e => { if (e.key === 'Enter') createRoom(); });
$('room-code-input').addEventListener('keypress', e => { if (e.key === 'Enter') joinRoom(); });
$('clue-input').addEventListener('keypress', e => { if (e.key === 'Enter') doSubmitClue(); });
$('clue-input').addEventListener('input', () => {
  $('btn-submit-clue').disabled = !($('clue-input').value.trim() && G.selectedCard !== null);
});
