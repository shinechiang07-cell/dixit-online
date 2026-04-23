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

// ═══ 84 張圖畫牌（方案B：多層場景合成） ═══
const CARDS = [
  {id:0,  bg:'linear-gradient(180deg,#0a1628 0%,#0c3060 40%,#0d4a8a 100%)', scene:[
    {e:'🌙',x:75,y:12,s:1.4,o:0.7},{e:'⭐',x:20,y:8,s:0.8,o:0.5},{e:'⭐',x:55,y:5,s:0.6,o:0.4},
    {e:'🐋',x:50,y:50,s:3.0},{e:'🌊',x:20,y:80,s:1.8,o:0.8},{e:'🏝️',x:82,y:72,s:1.0}]},
  {id:1,  bg:'linear-gradient(180deg,#0a0820 0%,#1a1a4e 50%,#2d2060 100%)', scene:[
    {e:'🌙',x:70,y:10,s:2.0},{e:'⭐',x:15,y:8,s:0.9,o:0.7},{e:'⭐',x:40,y:15,s:0.6,o:0.5},{e:'⭐',x:85,y:25,s:0.7,o:0.6},
    {e:'🦉',x:50,y:58,s:2.5},{e:'🌲',x:20,y:80,s:1.8},{e:'🌲',x:80,y:85,s:1.5}]},
  {id:2,  bg:'linear-gradient(180deg,#fce7f3 0%,#fbcfe8 40%,#f9a8d4 100%)', scene:[
    {e:'🌸',x:20,y:15,s:1.8,o:0.9},{e:'🌸',x:75,y:10,s:1.4,o:0.7},{e:'🌸',x:50,y:5,s:1.0,o:0.6},
    {e:'🦋',x:50,y:48,s:2.8},{e:'🌿',x:15,y:75,s:1.6},{e:'🌿',x:82,y:80,s:1.4}]},
  {id:3,  bg:'linear-gradient(180deg,#1a0000 0%,#5c0000 40%,#991b1b 100%)', scene:[
    {e:'🌋',x:25,y:70,s:2.2},{e:'🔥',x:60,y:30,s:2.0,r:15},{e:'🔥',x:30,y:45,s:1.4,o:0.8,r:-10},
    {e:'🐉',x:65,y:55,s:2.5},{e:'💨',x:80,y:20,s:1.2,o:0.6}]},
  {id:4,  bg:'linear-gradient(180deg,#1d4ed8 0%,#3b82f6 40%,#93c5fd 100%)', scene:[
    {e:'🌈',x:50,y:30,s:3.0},{e:'☁️',x:20,y:20,s:2.0,o:0.9},{e:'☁️',x:75,y:15,s:1.6,o:0.7},
    {e:'🌦️',x:50,y:65,s:1.8},{e:'✨',x:30,y:50,s:0.9,o:0.6}]},
  {id:5,  bg:'linear-gradient(180deg,#1c0a00 0%,#5c2d0a 50%,#92400e 100%)', scene:[
    {e:'🏰',x:50,y:35,s:2.8},{e:'🗝️',x:50,y:72,s:2.2,r:45},{e:'🚪',x:22,y:60,s:1.6,o:0.7},
    {e:'⭐',x:75,y:10,s:1.0,o:0.6},{e:'🌙',x:20,y:12,s:1.2,o:0.8}]},
  {id:6,  bg:'linear-gradient(180deg,#1a0a2e 0%,#4c1d95 50%,#6d28d9 100%)', scene:[
    {e:'🎭',x:50,y:35,s:3.0},{e:'🎪',x:20,y:65,s:1.8,o:0.8},{e:'🎬',x:78,y:60,s:1.6,o:0.7},
    {e:'⭐',x:15,y:15,s:0.8,o:0.5},{e:'✨',x:80,y:20,s:1.0,o:0.6},{e:'🌙',x:50,y:10,s:1.2,o:0.7}]},
  {id:7,  bg:'linear-gradient(180deg,#0a1a2e 0%,#1e3a5f 40%,#1e5080 100%)', scene:[
    {e:'🦅',x:50,y:35,s:3.0},{e:'⛰️',x:25,y:70,s:2.4},{e:'⛰️',x:72,y:75,s:1.8,o:0.7},
    {e:'☁️',x:75,y:18,s:1.5,o:0.6},{e:'🌤️',x:20,y:12,s:1.2,o:0.7}]},
  {id:8,  bg:'linear-gradient(180deg,#3b0018 0%,#831843 50%,#be185d 100%)', scene:[
    {e:'🦜',x:50,y:35,s:2.8},{e:'🌺',x:20,y:65,s:2.0},{e:'🌺',x:78,y:55,s:1.5,o:0.8},
    {e:'🌿',x:15,y:80,s:1.8},{e:'🌿',x:82,y:82,s:1.4,o:0.7}]},
  {id:9,  bg:'linear-gradient(180deg,#451a03 0%,#92400e 40%,#b45309 100%)', scene:[
    {e:'🌅',x:50,y:25,s:2.5},{e:'⏳',x:50,y:65,s:2.2},{e:'🕰️',x:22,y:55,s:1.5,o:0.8},
    {e:'☁️',x:80,y:20,s:1.3,o:0.6},{e:'✨',x:15,y:30,s:0.8,o:0.5}]},
  {id:10, bg:'linear-gradient(180deg,#4a1200 0%,#7c2d12 40%,#9a3412 100%)', scene:[
    {e:'🦊',x:50,y:50,s:3.0},{e:'🍂',x:20,y:25,s:1.5,r:30,o:0.8},{e:'🍂',x:78,y:20,s:1.2,r:-20,o:0.7},
    {e:'🍁',x:40,y:80,s:1.4,r:15,o:0.9},{e:'🌲',x:18,y:70,s:1.8},{e:'🌲',x:80,y:75,s:1.5,o:0.8}]},
  {id:11, bg:'linear-gradient(180deg,#0c1a2e 0%,#0c4a6e 50%,#075985 100%)', scene:[
    {e:'❄️',x:20,y:15,s:1.5,o:0.8},{e:'❄️',x:75,y:10,s:1.2,o:0.6},{e:'❄️',x:50,y:8,s:1.0,o:0.5},
    {e:'🐧',x:50,y:55,s:2.8},{e:'🧊',x:22,y:75,s:1.8},{e:'🌨️',x:78,y:70,s:1.5,o:0.7}]},
  {id:12, bg:'linear-gradient(180deg,#0a2e0a 0%,#14532d 50%,#166534 100%)', scene:[
    {e:'🌳',x:25,y:40,s:2.4},{e:'🌳',x:75,y:45,s:2.0,o:0.8},{e:'🐛',x:50,y:60,s:2.2},
    {e:'🌱',x:50,y:82,s:1.5},{e:'🍃',x:20,y:20,s:1.3,r:30,o:0.7},{e:'🍃',x:80,y:18,s:1.0,r:-20,o:0.6}]},
  {id:13, bg:'linear-gradient(180deg,#1c0a00 0%,#451a03 50%,#6b1e04 100%)', scene:[
    {e:'🌙',x:70,y:12,s:2.0,o:0.9},{e:'🌟',x:20,y:10,s:1.4,o:0.7},{e:'⭐',x:50,y:8,s:0.9,o:0.6},
    {e:'🏺',x:50,y:55,s:2.8},{e:'✨',x:28,y:45,s:0.8,o:0.5},{e:'✨',x:78,y:40,s:0.7,o:0.4}]},
  {id:14, bg:'linear-gradient(180deg,#0a0820 0%,#1e1b4b 50%,#312e81 100%)', scene:[
    {e:'🐙',x:50,y:50,s:3.0},{e:'🌊',x:20,y:75,s:1.8,o:0.7},{e:'🌊',x:78,y:78,s:1.4,o:0.6},
    {e:'🦑',x:25,y:35,s:1.6,o:0.7},{e:'💫',x:75,y:20,s:1.0,o:0.6},{e:'🫧',x:60,y:18,s:0.9,o:0.5}]},
  {id:15, bg:'linear-gradient(180deg,#2d0040 0%,#4a044e 50%,#7e22ce 100%)', scene:[
    {e:'🎠',x:50,y:50,s:3.0},{e:'🎡',x:22,y:60,s:1.8,o:0.8},{e:'⭐',x:20,y:12,s:1.0,o:0.7},
    {e:'⭐',x:75,y:8,s:0.8,o:0.6},{e:'✨',x:50,y:15,s:1.2,o:0.8},{e:'💫',x:80,y:30,s:0.9,o:0.5}]},
  {id:16, bg:'linear-gradient(180deg,#3d1c00 0%,#713f12 50%,#92400e 100%)', scene:[
    {e:'🦁',x:50,y:45,s:3.0},{e:'🌾',x:20,y:75,s:2.0,o:0.8},{e:'🌾',x:75,y:78,s:1.6,o:0.7},
    {e:'🦒',x:80,y:40,s:1.8,o:0.8},{e:'☀️',x:25,y:12,s:1.5,o:0.8}]},
  {id:17, bg:'linear-gradient(180deg,#0a0818 0%,#0f0a1e 50%,#1a103c 100%)', scene:[
    {e:'🌌',x:50,y:30,s:2.8,o:0.9},{e:'🚀',x:35,y:55,s:2.0,r:-30},{e:'👽',x:70,y:65,s:1.8,o:0.8},
    {e:'⭐',x:15,y:12,s:0.8,o:0.6},{e:'⭐',x:82,y:15,s:0.7,o:0.5},{e:'🪐',x:75,y:25,s:1.5,o:0.7}]},
  {id:18, bg:'linear-gradient(180deg,#0a0e1a 0%,#1e293b 50%,#334155 100%)', scene:[
    {e:'🏔️',x:50,y:40,s:3.0},{e:'🌨️',x:20,y:15,s:1.5,o:0.7},{e:'🌨️',x:75,y:10,s:1.2,o:0.6},
    {e:'🐺',x:35,y:70,s:2.2},{e:'🌙',x:75,y:18,s:1.4,o:0.8}]},
  {id:19, bg:'linear-gradient(180deg,#000000 0%,#0f172a 50%,#1a1f35 100%)', scene:[
    {e:'🌃',x:50,y:30,s:2.5,o:0.8},{e:'🎸',x:50,y:62,s:2.5,r:15},{e:'🎵',x:25,y:25,s:1.2,o:0.7,r:-15},
    {e:'🎵',x:75,y:20,s:1.0,o:0.6,r:10},{e:'⭐',x:20,y:10,s:0.8,o:0.5},{e:'⭐',x:80,y:8,s:0.7,o:0.4}]},
  {id:20, bg:'linear-gradient(180deg,#0a1628 0%,#1e3a5f 40%,#7dd3fc 100%)', scene:[
    {e:'🦢',x:50,y:40,s:3.0},{e:'🌊',x:20,y:75,s:1.8,o:0.7},{e:'🌊',x:78,y:78,s:1.5,o:0.6},
    {e:'🌿',x:18,y:70,s:1.8},{e:'🌙',x:75,y:12,s:1.5,o:0.8},{e:'✨',x:30,y:18,s:0.8,o:0.5}]},
  {id:21, bg:'linear-gradient(180deg,#3d0000 0%,#7f1d1d 50%,#a16207 100%)', scene:[
    {e:'🍄',x:50,y:45,s:3.0},{e:'🐝',x:30,y:25,s:1.6,o:0.9},{e:'🐝',x:72,y:30,s:1.3,o:0.7},
    {e:'🌻',x:20,y:72,s:1.8},{e:'🌻',x:78,y:75,s:1.4,o:0.8},{e:'✨',x:50,y:20,s:1.0,o:0.6}]},
  {id:22, bg:'linear-gradient(180deg,#1a0a00 0%,#292524 50%,#44403c 100%)', scene:[
    {e:'🗺️',x:50,y:45,s:3.0},{e:'⚓',x:22,y:68,s:1.8,o:0.8},{e:'🏴‍☠️',x:78,y:62,s:1.6,o:0.9},
    {e:'💰',x:30,y:25,s:1.4,o:0.7},{e:'🔭',x:72,y:20,s:1.2,o:0.7}]},
  {id:23, bg:'linear-gradient(180deg,#0a0820 0%,#1e1b4b 50%,#4c1d95 100%)', scene:[
    {e:'🌙',x:70,y:12,s:2.0},{e:'⭐',x:18,y:10,s:1.0,o:0.7},{e:'⭐',x:50,y:6,s:0.8,o:0.6},
    {e:'🧙',x:50,y:55,s:2.8},{e:'✨',x:25,y:40,s:1.2,o:0.7},{e:'🔮',x:78,y:70,s:1.4,o:0.8}]},
  {id:24, bg:'linear-gradient(180deg,#0c4a6e 0%,#0ea5e9 50%,#fbbf24 100%)', scene:[
    {e:'🌅',x:50,y:20,s:2.5},{e:'🐬',x:35,y:55,s:2.5,r:-15},{e:'🐬',x:68,y:65,s:1.8,r:10,o:0.8},
    {e:'🌊',x:20,y:78,s:1.8,o:0.7},{e:'🌊',x:78,y:80,s:1.5,o:0.6}]},
  {id:25, bg:'linear-gradient(180deg,#1a0800 0%,#78350f 40%,#d97706 100%)', scene:[
    {e:'☀️',x:50,y:12,s:2.2,o:0.9},{e:'🌻',x:50,y:52,s:2.8},{e:'🌻',x:25,y:65,s:2.0,o:0.9},
    {e:'🌻',x:75,y:68,s:1.8,o:0.8},{e:'🐝',x:70,y:35,s:1.2,o:0.8}]},
  {id:26, bg:'linear-gradient(180deg,#2d0050 0%,#4c1d95 50%,#ec4899 100%)', scene:[
    {e:'🌈',x:50,y:25,s:2.8,o:0.9},{e:'🦋',x:50,y:58,s:2.8},{e:'🌸',x:22,y:72,s:1.6,o:0.8},
    {e:'🌸',x:78,y:68,s:1.3,o:0.7},{e:'✨',x:25,y:35,s:0.9,o:0.6},{e:'✨',x:75,y:42,s:0.8,o:0.5}]},
  {id:27, bg:'linear-gradient(180deg,#0a0800 0%,#1c1917 50%,#292524 100%)', scene:[
    {e:'🏰',x:50,y:40,s:3.0},{e:'🗡️',x:30,y:68,s:1.8,r:-20},{e:'🛡️',x:72,y:70,s:1.6},
    {e:'🌙',x:75,y:12,s:1.4,o:0.7},{e:'⭐',x:20,y:15,s:0.9,o:0.5}]},
  {id:28, bg:'linear-gradient(180deg,#1a0030 0%,#3b0764 50%,#6d28d9 100%)', scene:[
    {e:'🔮',x:50,y:50,s:3.2},{e:'✨',x:22,y:30,s:1.5,o:0.8},{e:'✨',x:78,y:25,s:1.2,o:0.7},
    {e:'🌙',x:20,y:15,s:1.3,o:0.8},{e:'⭐',x:78,y:12,s:1.0,o:0.6},{e:'💫',x:50,y:15,s:1.0,o:0.7}]},
  {id:29, bg:'linear-gradient(180deg,#3d0000 0%,#7f1d1d 50%,#dc2626 100%)', scene:[
    {e:'🎁',x:50,y:48,s:3.0},{e:'🎀',x:50,y:22,s:1.8},{e:'⭐',x:20,y:12,s:1.0,o:0.7},
    {e:'⭐',x:78,y:10,s:0.8,o:0.6},{e:'✨',x:25,y:70,s:1.2,o:0.6},{e:'✨',x:78,y:72,s:1.0,o:0.5}]},
  {id:30, bg:'linear-gradient(180deg,#1a2e00 0%,#365314 50%,#ca8a04 100%)', scene:[
    {e:'🌵',x:50,y:50,s:3.0},{e:'🦂',x:28,y:72,s:1.8,o:0.9},{e:'🌅',x:50,y:15,s:2.2,o:0.8},
    {e:'☀️',x:78,y:18,s:1.5,o:0.7},{e:'🪨',x:75,y:78,s:1.4,o:0.7}]},
  {id:31, bg:'linear-gradient(180deg,#0a1a0a 0%,#14532d 50%,#166534 100%)', scene:[
    {e:'🐉',x:50,y:40,s:3.2},{e:'🔥',x:28,y:68,s:2.0,o:0.9},{e:'🔥',x:72,y:70,s:1.6,o:0.8},
    {e:'🏔️',x:22,y:58,s:2.0,o:0.7},{e:'💨',x:75,y:20,s:1.2,o:0.6}]},
  {id:32, bg:'linear-gradient(180deg,#0a0800 0%,#292524 50%,#3d2200 100%)', scene:[
    {e:'📚',x:35,y:55,s:2.5},{e:'🕯️',x:68,y:48,s:2.2},{e:'🦉',x:22,y:30,s:1.8,o:0.8},
    {e:'🔍',x:75,y:72,s:1.4,o:0.7},{e:'✨',x:68,y:28,s:0.9,o:0.6}]},
  {id:33, bg:'linear-gradient(180deg,#3d0000 0%,#7c0000 40%,#ca8a04 100%)', scene:[
    {e:'🌺',x:50,y:40,s:3.0},{e:'🦜',x:25,y:35,s:2.0,o:0.9},{e:'🌺',x:78,y:60,s:1.8,o:0.8},
    {e:'🌈',x:50,y:12,s:2.0,o:0.7},{e:'🌿',x:18,y:75,s:1.8}]},
  {id:34, bg:'linear-gradient(180deg,#0a0818 0%,#1e1b4b 50%,#3730a3 100%)', scene:[
    {e:'⚡',x:50,y:35,s:3.0},{e:'🌩️',x:25,y:22,s:2.0,o:0.9},{e:'🌩️',x:75,y:18,s:1.6,o:0.8},
    {e:'🌊',x:35,y:78,s:1.8,o:0.7},{e:'🌊',x:72,y:80,s:1.5,o:0.6},{e:'💨',x:20,y:50,s:1.2,o:0.6}]},
  {id:35, bg:'linear-gradient(180deg,#0a1628 0%,#0c4a6e 40%,#166534 100%)', scene:[
    {e:'🦌',x:50,y:48,s:3.0},{e:'❄️',x:20,y:15,s:1.5,o:0.8},{e:'❄️',x:75,y:10,s:1.2,o:0.7},
    {e:'🌲',x:20,y:72,s:2.0},{e:'🌲',x:78,y:70,s:1.7,o:0.8},{e:'🌙',x:75,y:18,s:1.3,o:0.7}]},
  {id:36, bg:'linear-gradient(180deg,#0c4a6e 0%,#0ea5e9 50%,#0d9488 100%)', scene:[
    {e:'🏄',x:50,y:45,s:2.8},{e:'🌊',x:30,y:70,s:2.2,o:0.9},{e:'🌊',x:72,y:75,s:1.8,o:0.8},
    {e:'🐚',x:22,y:82,s:1.4,o:0.7},{e:'☀️',x:75,y:12,s:1.5,o:0.8}]},
  {id:37, bg:'linear-gradient(180deg,#0a1a0a 0%,#1c1917 50%,#2d4a1a 100%)', scene:[
    {e:'🐼',x:50,y:52,s:3.0},{e:'🎋',x:20,y:40,s:2.5},{e:'🎋',x:78,y:35,s:2.0,o:0.8},
    {e:'☁️',x:50,y:12,s:1.8,o:0.6},{e:'🌿',x:25,y:80,s:1.4,o:0.7}]},
  {id:38, bg:'linear-gradient(180deg,#0a0808 0%,#1e0a00 50%,#0f172a 100%)', scene:[
    {e:'🦊',x:50,y:52,s:3.0},{e:'🌙',x:72,y:12,s:2.0,o:0.9},{e:'⭐',x:18,y:10,s:1.0,o:0.7},
    {e:'⭐',x:50,y:6,s:0.8,o:0.5},{e:'🌲',x:18,y:75,s:2.0,o:0.8},{e:'🌲',x:80,y:78,s:1.6,o:0.7}]},
  {id:39, bg:'linear-gradient(180deg,#1a0a0a 0%,#7f1d1d 40%,#0c4a6e 100%)', scene:[
    {e:'⛩️',x:50,y:40,s:3.0},{e:'🌸',x:22,y:35,s:1.8,o:0.9},{e:'🌸',x:78,y:30,s:1.5,o:0.8},
    {e:'🌊',x:50,y:78,s:2.0,o:0.8},{e:'🐟',x:30,y:82,s:1.2,o:0.7}]},
  {id:40, bg:'linear-gradient(180deg,#000000 0%,#0f172a 50%,#1e0050 100%)', scene:[
    {e:'🎭',x:50,y:45,s:3.2},{e:'🌙',x:22,y:12,s:1.8,o:0.9},{e:'✨',x:75,y:15,s:1.2,o:0.7},
    {e:'✨',x:28,y:70,s:1.0,o:0.6},{e:'💫',x:78,y:68,s:1.0,o:0.5},{e:'⭐',x:50,y:8,s:0.8,o:0.5}]},
  {id:41, bg:'linear-gradient(180deg,#0c4a6e 0%,#0369a1 50%,#15803d 100%)', scene:[
    {e:'🐠',x:50,y:45,s:3.0},{e:'🌊',x:25,y:78,s:1.8,o:0.7},{e:'🌊',x:75,y:80,s:1.5,o:0.6},
    {e:'🌿',x:20,y:72,s:1.8},{e:'🐡',x:75,y:35,s:1.6,o:0.8},{e:'🫧',x:35,y:20,s:1.0,o:0.5}]},
  {id:42, bg:'linear-gradient(180deg,#000000 0%,#0f172a 50%,#1d2d50 100%)', scene:[
    {e:'🧪',x:40,y:50,s:2.5},{e:'💡',x:68,y:35,s:2.0,o:0.9},{e:'🔬',x:28,y:72,s:1.8,o:0.8},
    {e:'✨',x:70,y:70,s:1.2,o:0.7},{e:'⚗️',x:75,y:55,s:1.4,o:0.7},{e:'💫',x:22,y:25,s:1.0,o:0.6}]},
  {id:43, bg:'linear-gradient(180deg,#451a03 0%,#78350f 50%,#ca8a04 100%)', scene:[
    {e:'🌅',x:50,y:18,s:2.2},{e:'🌾',x:50,y:60,s:2.8},{e:'🌾',x:25,y:65,s:2.0,o:0.9},
    {e:'🌾',x:75,y:65,s:1.8,o:0.8},{e:'🏺',x:22,y:45,s:1.8,o:0.8}]},
  {id:44, bg:'linear-gradient(180deg,#000000 0%,#0f172a 50%,#14532d 100%)', scene:[
    {e:'🐺',x:50,y:50,s:3.0},{e:'🌙',x:72,y:10,s:2.0,o:0.9},{e:'⭐',x:22,y:8,s:0.9,o:0.6},
    {e:'🌲',x:20,y:72,s:2.0},{e:'🌲',x:80,y:75,s:1.7,o:0.8},{e:'🍃',x:50,y:78,s:1.2,o:0.6}]},
  {id:45, bg:'linear-gradient(180deg,#0a1628 0%,#1e293b 50%,#1e3a5f 100%)', scene:[
    {e:'🦅',x:50,y:38,s:3.0},{e:'🌊',x:30,y:75,s:2.0,o:0.8},{e:'🌊',x:72,y:78,s:1.6,o:0.7},
    {e:'🏔️',x:22,y:62,s:2.2,o:0.8},{e:'☁️',x:75,y:20,s:1.5,o:0.6}]},
  {id:46, bg:'linear-gradient(180deg,#3d0000 0%,#7f1d1d 40%,#4c1d95 100%)', scene:[
    {e:'🎠',x:50,y:48,s:3.0},{e:'🌈',x:50,y:12,s:2.5,o:0.8},{e:'💫',x:22,y:30,s:1.4,o:0.7},
    {e:'💫',x:78,y:28,s:1.2,o:0.6},{e:'⭐',x:20,y:65,s:1.0,o:0.5},{e:'⭐',x:78,y:68,s:0.9,o:0.4}]},
  {id:47, bg:'linear-gradient(180deg,#0a2e0a 0%,#14532d 50%,#0c4a6e 100%)', scene:[
    {e:'🐸',x:50,y:52,s:3.0},{e:'🌧️',x:25,y:20,s:1.8,o:0.7},{e:'🌧️',x:72,y:15,s:1.5,o:0.6},
    {e:'🌿',x:20,y:72,s:2.0},{e:'🌿',x:78,y:75,s:1.6,o:0.8},{e:'💧',x:50,y:30,s:1.0,o:0.6}]},
  {id:48, bg:'linear-gradient(180deg,#000000 0%,#0f0a1e 50%,#1a1050 100%)', scene:[
    {e:'🌌',x:50,y:40,s:3.2,o:0.9},{e:'🌙',x:25,y:15,s:1.8,o:0.9},{e:'💫',x:75,y:12,s:1.4,o:0.8},
    {e:'⭐',x:50,y:8,s:1.0,o:0.6},{e:'⭐',x:15,y:55,s:0.8,o:0.5},{e:'⭐',x:82,y:60,s:0.7,o:0.4}]},
  {id:49, bg:'linear-gradient(180deg,#0c4a6e 0%,#0369a1 50%,#4c1d95 100%)', scene:[
    {e:'🧜',x:50,y:45,s:3.0},{e:'🌊',x:25,y:75,s:2.0,o:0.8},{e:'🌊',x:72,y:78,s:1.6,o:0.7},
    {e:'🐚',x:20,y:80,s:1.4,o:0.8},{e:'✨',x:30,y:20,s:1.0,o:0.6},{e:'🐠',x:78,y:65,s:1.2,o:0.7}]},
  {id:50, bg:'linear-gradient(180deg,#0a2e0a 0%,#14532d 40%,#92400e 100%)', scene:[
    {e:'🏵️',x:50,y:45,s:3.0},{e:'🦋',x:30,y:30,s:1.8,o:0.9},{e:'🦋',x:72,y:35,s:1.5,o:0.8},
    {e:'🌿',x:22,y:72,s:1.8},{e:'🌿',x:78,y:75,s:1.5,o:0.8}]},
  {id:51, bg:'linear-gradient(180deg,#1a0800 0%,#78350f 50%,#d97706 100%)', scene:[
    {e:'🌅',x:50,y:15,s:2.5},{e:'🔑',x:50,y:55,s:2.8,r:45},{e:'🏰',x:25,y:65,s:1.8,o:0.8},
    {e:'✨',x:75,y:35,s:1.2,o:0.7},{e:'☀️',x:78,y:18,s:1.2,o:0.7}]},
  {id:52, bg:'linear-gradient(180deg,#000000 0%,#0f172a 50%,#1e3a5f 100%)', scene:[
    {e:'🐋',x:50,y:52,s:3.2},{e:'🌙',x:72,y:10,s:2.0,o:0.9},{e:'🌊',x:25,y:78,s:2.0,o:0.7},
    {e:'🌊',x:75,y:80,s:1.6,o:0.6},{e:'⭐',x:22,y:12,s:0.9,o:0.6},{e:'⭐',x:50,y:6,s:0.7,o:0.5}]},
  {id:53, bg:'linear-gradient(180deg,#1a0030 0%,#831843 50%,#1e293b 100%)', scene:[
    {e:'🌺',x:50,y:52,s:3.0},{e:'🌙',x:72,y:10,s:2.0,o:0.9},{e:'⭐',x:20,y:12,s:1.0,o:0.7},
    {e:'⭐',x:50,y:6,s:0.8,o:0.6},{e:'🌸',x:22,y:68,s:1.6,o:0.8},{e:'🌸',x:78,y:70,s:1.3,o:0.7}]},
  {id:54, bg:'linear-gradient(180deg,#0a0a00 0%,#1c1917 50%,#14532d 100%)', scene:[
    {e:'🐘',x:50,y:55,s:3.0},{e:'🌳',x:22,y:45,s:2.5},{e:'🌳',x:78,y:42,s:2.0,o:0.8},
    {e:'☁️',x:50,y:12,s:1.8,o:0.6},{e:'🌿',x:25,y:80,s:1.4,o:0.7}]},
  {id:55, bg:'linear-gradient(180deg,#1d4ed8 0%,#2563eb 50%,#92400e 100%)', scene:[
    {e:'🌈',x:50,y:25,s:2.8,o:0.9},{e:'🌧️',x:28,y:18,s:1.8,o:0.8},{e:'🌧️',x:72,y:15,s:1.5,o:0.7},
    {e:'⭐',x:20,y:50,s:1.0,o:0.6},{e:'⭐',x:80,y:55,s:0.9,o:0.5},{e:'💧',x:50,y:68,s:1.2,o:0.7}]},
  {id:56, bg:'linear-gradient(180deg,#1a0050 0%,#4c1d95 50%,#0f172a 100%)', scene:[
    {e:'🎶',x:50,y:45,s:3.0},{e:'🌙',x:72,y:12,s:1.8,o:0.9},{e:'💫',x:20,y:15,s:1.2,o:0.7},
    {e:'🎵',x:25,y:35,s:1.4,o:0.8,r:-15},{e:'🎵',x:75,y:30,s:1.2,o:0.7,r:10},{e:'⭐',x:50,y:8,s:0.8,o:0.5}]},
  {id:57, bg:'linear-gradient(180deg,#0a1628 0%,#1e3a5f 50%,#166534 100%)', scene:[
    {e:'🦚',x:50,y:45,s:3.0},{e:'🌿',x:22,y:72,s:2.0},{e:'🌿',x:78,y:75,s:1.6,o:0.8},
    {e:'🌸',x:25,y:30,s:1.5,o:0.8},{e:'🌸',x:75,y:28,s:1.2,o:0.7}]},
  {id:58, bg:'linear-gradient(180deg,#1a0000 0%,#7c0000 40%,#1e3a5f 100%)', scene:[
    {e:'🌋',x:50,y:45,s:3.0},{e:'🔥',x:30,y:28,s:2.0,o:0.9},{e:'🔥',x:70,y:25,s:1.6,o:0.8},
    {e:'🌊',x:25,y:78,s:2.0,o:0.8},{e:'🌊',x:75,y:80,s:1.6,o:0.7}]},
  {id:59, bg:'linear-gradient(180deg,#000000 0%,#0c4a6e 50%,#0f172a 100%)', scene:[
    {e:'🧊',x:50,y:52,s:3.0},{e:'🌙',x:72,y:10,s:2.0,o:0.9},{e:'⭐',x:22,y:12,s:1.0,o:0.7},
    {e:'⭐',x:50,y:6,s:0.8,o:0.6},{e:'❄️',x:25,y:35,s:1.4,o:0.8},{e:'❄️',x:78,y:38,s:1.2,o:0.7}]},
  {id:60, bg:'linear-gradient(180deg,#1a0800 0%,#78350f 40%,#0f172a 100%)', scene:[
    {e:'🦁',x:50,y:48,s:3.0},{e:'🌙',x:72,y:10,s:1.8,o:0.9},{e:'🔥',x:28,y:70,s:2.0,o:0.9},
    {e:'🔥',x:72,y:72,s:1.6,o:0.8},{e:'⭐',x:22,y:15,s:0.9,o:0.6}]},
  {id:61, bg:'linear-gradient(180deg,#0a2e0a 0%,#14532d 50%,#0c4a6e 100%)', scene:[
    {e:'🐢',x:50,y:52,s:3.0},{e:'🌿',x:22,y:70,s:2.0},{e:'🌿',x:78,y:73,s:1.6,o:0.8},
    {e:'🌊',x:35,y:80,s:1.8,o:0.7},{e:'☀️',x:72,y:12,s:1.4,o:0.7}]},
  {id:62, bg:'linear-gradient(180deg,#1a0000 0%,#7c0000 50%,#1e293b 100%)', scene:[
    {e:'🏮',x:50,y:45,s:3.0},{e:'🌙',x:72,y:12,s:1.8,o:0.9},{e:'🌸',x:22,y:68,s:1.8,o:0.9},
    {e:'🌸',x:78,y:70,s:1.4,o:0.8},{e:'✨',x:28,y:28,s:1.0,o:0.6},{e:'✨',x:75,y:30,s:0.9,o:0.5}]},
  {id:63, bg:'linear-gradient(180deg,#0a0820 0%,#1e1b4b 40%,#166534 100%)', scene:[
    {e:'🌙',x:72,y:12,s:2.2,o:0.9},{e:'🌸',x:30,y:35,s:2.0,o:0.9},{e:'🌸',x:70,y:40,s:1.6,o:0.8},
    {e:'🌿',x:22,y:72,s:2.0},{e:'🌿',x:78,y:75,s:1.6,o:0.8},{e:'⭐',x:22,y:18,s:0.8,o:0.5}]},
  {id:64, bg:'linear-gradient(180deg,#000000 0%,#0f172a 50%,#1e3a5f 100%)', scene:[
    {e:'⚓',x:50,y:52,s:3.0},{e:'🌊',x:25,y:75,s:2.0,o:0.8},{e:'🌊',x:75,y:78,s:1.6,o:0.7},
    {e:'🌩️',x:28,y:20,s:1.8,o:0.8},{e:'🌩️',x:72,y:15,s:1.4,o:0.7},{e:'💨',x:50,y:35,s:1.2,o:0.6}]},
  {id:65, bg:'linear-gradient(180deg,#000000 0%,#0f0a1e 50%,#2d1b6e 100%)', scene:[
    {e:'🔭',x:50,y:55,s:3.0,r:30},{e:'🌌',x:40,y:22,s:2.5,o:0.9},{e:'🌙',x:72,y:10,s:1.6,o:0.8},
    {e:'⭐',x:22,y:12,s:1.0,o:0.7},{e:'💫',x:80,y:25,s:1.0,o:0.6}]},
  {id:66, bg:'linear-gradient(180deg,#451a03 0%,#78350f 50%,#15803d 100%)', scene:[
    {e:'🌻',x:50,y:50,s:3.0},{e:'🦋',x:25,y:30,s:2.0,o:0.9},{e:'🦋',x:75,y:35,s:1.6,o:0.8},
    {e:'🌿',x:22,y:75,s:1.8},{e:'☀️',x:72,y:12,s:1.4,o:0.8}]},
  {id:67, bg:'linear-gradient(180deg,#1a0000 0%,#7f1d1d 40%,#1e293b 100%)', scene:[
    {e:'🎪',x:50,y:45,s:3.0},{e:'⭐',x:22,y:15,s:1.2,o:0.8},{e:'⭐',x:75,y:10,s:1.0,o:0.7},
    {e:'🌙',x:20,y:18,s:1.5,o:0.8},{e:'✨',x:78,y:25,s:1.0,o:0.6},{e:'🎠',x:78,y:68,s:1.4,o:0.7}]},
  {id:68, bg:'linear-gradient(180deg,#2d0050 0%,#4c1d95 50%,#e2e8f0 100%)', scene:[
    {e:'🦋',x:50,y:48,s:3.0},{e:'🌺',x:25,y:70,s:1.8,o:0.9},{e:'🌺',x:75,y:68,s:1.5,o:0.8},
    {e:'☁️',x:20,y:20,s:1.8,o:0.7},{e:'☁️',x:75,y:15,s:1.5,o:0.6},{e:'✨',x:50,y:22,s:0.9,o:0.6}]},
  {id:69, bg:'linear-gradient(180deg,#0a0800 0%,#1c1917 50%,#1e3a5f 100%)', scene:[
    {e:'🏰',x:50,y:38,s:3.0},{e:'🌊',x:30,y:75,s:2.0,o:0.8},{e:'🌊',x:72,y:78,s:1.6,o:0.7},
    {e:'⚓',x:22,y:68,s:1.8,o:0.8},{e:'🌙',x:72,y:12,s:1.4,o:0.7}]},
  {id:70, bg:'linear-gradient(180deg,#0a2e0a 0%,#14532d 50%,#9d174d 100%)', scene:[
    {e:'🐍',x:50,y:55,s:3.0},{e:'🌿',x:22,y:68,s:2.0},{e:'🌿',x:78,y:72,s:1.6,o:0.8},
    {e:'🌸',x:25,y:28,s:1.8,o:0.8},{e:'🌸',x:75,y:25,s:1.4,o:0.7}]},
  {id:71, bg:'linear-gradient(180deg,#1a0800 0%,#7f1d1d 50%,#78350f 100%)', scene:[
    {e:'🎨',x:50,y:48,s:3.0},{e:'🌈',x:50,y:12,s:2.5,o:0.8},{e:'✨',x:22,y:35,s:1.2,o:0.7},
    {e:'✨',x:78,y:30,s:1.0,o:0.6},{e:'💫',x:28,y:70,s:1.0,o:0.6},{e:'💫',x:75,y:72,s:0.9,o:0.5}]},
  {id:72, bg:'linear-gradient(180deg,#000000 0%,#0f172a 50%,#1e293b 100%)', scene:[
    {e:'🐺',x:50,y:48,s:3.0},{e:'🌙',x:72,y:10,s:2.0,o:0.9},{e:'❄️',x:22,y:20,s:1.5,o:0.8},
    {e:'❄️',x:78,y:15,s:1.2,o:0.7},{e:'🌨️',x:35,y:8,s:1.0,o:0.6},{e:'🌲',x:20,y:78,s:1.8,o:0.7}]},
  {id:73, bg:'linear-gradient(180deg,#3d0018 0%,#9d174d 50%,#166534 100%)', scene:[
    {e:'🌸',x:50,y:45,s:3.0},{e:'🐝',x:28,y:28,s:1.8,o:0.9},{e:'🐝',x:72,y:32,s:1.5,o:0.8},
    {e:'🌿',x:22,y:72,s:2.0},{e:'🌿',x:78,y:75,s:1.6,o:0.8},{e:'🍯',x:50,y:78,s:1.2,o:0.7}]},
  {id:74, bg:'linear-gradient(180deg,#451a03 0%,#78350f 40%,#1e3a5f 100%)', scene:[
    {e:'🌅',x:50,y:20,s:2.5},{e:'🦅',x:50,y:52,s:3.0},{e:'🌊',x:25,y:78,s:1.8,o:0.7},
    {e:'🌊',x:75,y:80,s:1.5,o:0.6},{e:'☁️',x:20,y:15,s:1.3,o:0.6}]},
  {id:75, bg:'linear-gradient(180deg,#0a1a0a 0%,#14532d 50%,#9d174d 100%)', scene:[
    {e:'🐉',x:50,y:45,s:3.0},{e:'🌸',x:22,y:35,s:1.8,o:0.9},{e:'🌸',x:78,y:30,s:1.5,o:0.8},
    {e:'✨',x:28,y:68,s:1.4,o:0.8},{e:'✨',x:75,y:70,s:1.2,o:0.7},{e:'💫',x:50,y:12,s:1.0,o:0.6}]},
  {id:76, bg:'linear-gradient(180deg,#1a0030 0%,#4c1d95 50%,#1e3a5f 100%)', scene:[
    {e:'🔮',x:50,y:48,s:3.2},{e:'🌊',x:25,y:75,s:2.0,o:0.8},{e:'🌊',x:75,y:78,s:1.6,o:0.7},
    {e:'🌙',x:72,y:10,s:1.8,o:0.9},{e:'✨',x:22,y:22,s:1.0,o:0.6},{e:'💫',x:78,y:25,s:0.9,o:0.5}]},
  {id:77, bg:'linear-gradient(180deg,#0a1a0a 0%,#14532d 50%,#1e293b 100%)', scene:[
    {e:'🌲',x:25,y:45,s:2.5},{e:'🌲',x:75,y:42,s:2.0,o:0.8},{e:'🦌',x:50,y:58,s:2.5},
    {e:'❄️',x:22,y:15,s:1.4,o:0.8},{e:'❄️',x:75,y:10,s:1.2,o:0.7},{e:'⭐',x:50,y:8,s:0.8,o:0.5}]},
  {id:78, bg:'linear-gradient(180deg,#1a0030 0%,#4c1d95 50%,#9d174d 100%)', scene:[
    {e:'🎭',x:50,y:45,s:3.0},{e:'🌸',x:22,y:68,s:1.8,o:0.9},{e:'🌸',x:78,y:70,s:1.4,o:0.8},
    {e:'✨',x:25,y:25,s:1.2,o:0.7},{e:'✨',x:78,y:22,s:1.0,o:0.6},{e:'🌙',x:50,y:10,s:1.0,o:0.6}]},
  {id:79, bg:'linear-gradient(180deg,#000000 0%,#0f172a 50%,#1e3a5f 100%)', scene:[
    {e:'🌙',x:50,y:20,s:2.5,o:0.9},{e:'🌊',x:30,y:68,s:2.0,o:0.8},{e:'🌊',x:72,y:72,s:1.6,o:0.7},
    {e:'🐚',x:50,y:60,s:2.2},{e:'⭐',x:22,y:12,s:0.9,o:0.6},{e:'⭐',x:78,y:10,s:0.8,o:0.5}]},
  {id:80, bg:'linear-gradient(180deg,#0a2e0a 0%,#14532d 50%,#7f1d1d 100%)', scene:[
    {e:'🦜',x:50,y:42,s:3.0},{e:'🌴',x:22,y:52,s:2.5},{e:'🌴',x:78,y:50,s:2.0,o:0.8},
    {e:'🌺',x:28,y:75,s:1.8,o:0.9},{e:'🌺',x:75,y:78,s:1.4,o:0.8}]},
  {id:81, bg:'linear-gradient(180deg,#2d1a00 0%,#92400e 50%,#0f172a 100%)', scene:[
    {e:'🕯️',x:50,y:45,s:3.0},{e:'📚',x:28,y:62,s:2.0,o:0.9},{e:'📚',x:72,y:65,s:1.6,o:0.8},
    {e:'🌙',x:72,y:12,s:1.6,o:0.8},{e:'✨',x:50,y:22,s:0.9,o:0.6}]},
  {id:82, bg:'linear-gradient(180deg,#0c4a6e 0%,#0369a1 50%,#78350f 100%)', scene:[
    {e:'🌈',x:50,y:15,s:2.2,o:0.8},{e:'🐬',x:40,y:45,s:2.8,r:-20},{e:'🐬',x:68,y:58,s:2.2,r:15,o:0.8},
    {e:'🌊',x:30,y:75,s:1.8,o:0.8},{e:'🌊',x:72,y:78,s:1.5,o:0.7}]},
  {id:83, bg:'linear-gradient(180deg,#3d0000 0%,#7f1d1d 50%,#14532d 100%)', scene:[
    {e:'🦚',x:50,y:45,s:3.0},{e:'🌺',x:22,y:65,s:1.8,o:0.9},{e:'🌺',x:78,y:68,s:1.5,o:0.8},
    {e:'🌿',x:20,y:78,s:1.8},{e:'🌿',x:80,y:80,s:1.5,o:0.8},{e:'✨',x:50,y:15,s:1.0,o:0.6}]},
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
  const scene = document.createElement('div');
  scene.className = 'card-scene';
  card.scene.forEach(item => {
    const span = document.createElement('span');
    span.className = 'card-elem';
    span.textContent = item.e;
    let css = `left:${item.x}%;top:${item.y}%;font-size:${item.s}rem;`;
    css += item.r ? `transform:translate(-50%,-50%) rotate(${item.r}deg);` : 'transform:translate(-50%,-50%);';
    if (item.o != null) css += `opacity:${item.o};`;
    span.style.cssText = css;
    scene.appendChild(span);
  });
  el.appendChild(scene);
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

  // 分數列（顯示完整名字）
  $('score-bar').innerHTML = players.map(p =>
    `<div class="score-item"><span>${pEmoji(p.name)}</span><span class="score-name">${p.name}</span><span class="score-val">${p.score}</span></div>`
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

  // 統計：每個牌主被哪些人投票
  const votesByOwner = {};
  players.forEach(p => {
    if (p.vote) {
      if (!votesByOwner[p.vote]) votesByOwner[p.vote] = [];
      votesByOwner[p.vote].push(p.name);
    }
  });

  // 桌面牌：顯示牌主 + 投票者名字
  const container = $('table-cards');
  container.className = 'scoring-cards-row';
  container.innerHTML = '';
  room.tableCards.forEach(tc => {
    const isS = tc.owner === storytellerName;
    const voterNames = votesByOwner[tc.owner] || [];

    const wrap = document.createElement('div');
    wrap.className = 'score-card-wrap';

    // 牌面（說書人牌有綠色光暈）
    wrap.appendChild(makeCard(tc.cardId, { isStoryteller: isS }));

    // 牌主名稱
    const ownerDiv = document.createElement('div');
    ownerDiv.className = `score-owner${isS ? ' is-storyteller' : ''}`;
    ownerDiv.textContent = `${pEmoji(tc.owner)} ${tc.owner}${isS ? ' 👑' : ''}`;
    wrap.appendChild(ownerDiv);

    // 投票者列表
    const votersDiv = document.createElement('div');
    votersDiv.className = 'score-voters';
    if (voterNames.length > 0) {
      voterNames.forEach(n => {
        const tag = document.createElement('span');
        tag.className = 'voter-tag';
        tag.textContent = `${pEmoji(n)} ${n}`;
        votersDiv.appendChild(tag);
      });
    } else {
      const empty = document.createElement('span');
      empty.className = 'no-vote';
      empty.textContent = '無人投票';
      votersDiv.appendChild(empty);
    }
    wrap.appendChild(votersDiv);

    container.appendChild(wrap);
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
  const c = $('table-cards');
  c.className = 'cards-row scrollable';
  c.innerHTML = '';
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
