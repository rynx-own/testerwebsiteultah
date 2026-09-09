// DATA LAGU (Ganti link di bawah dengan link lagu kamu)
const songs = [
    { title: "Shape Of My Heart", artist: "Backstreet Boys", src: "musik/lagu1.mp3" },
    { title: "Angel Baby", artist: "Troye Sivan", src: "musik/lagu2.mp3" },
    { title: "My Love", artist: "Westlife", src: "musik/lagu3.mp3" }
];

let currentSongIndex = 0;
let pinCode = "";
let isPlaying = false;
const targetPin = "110911";

// Emoji Bunga (Otomatis jadi Emoji iPhone di perangkat Apple)
const flowerEmojis = ['🌼', '🌸', '🌷', '🌹', '🌻', '💐'];

// 1. PIN LOGIC
function inputPin(num) {
    if (pinCode.length < 6) {
        pinCode += num;
        updatePinDisplay();
        if (pinCode.length === 6) {
            setTimeout(() => {
                if (pinCode === targetPin) goToScreen('screen-gift');
                else { alert("Kode salah! Coba lagi."); resetPin(); }
            }, 200);
        }
    }
}
function removePin() { pinCode = pinCode.slice(0, -1); updatePinDisplay(); }
function resetPin() { pinCode = ""; updatePinDisplay(); }
function updatePinDisplay() {
    const dots = document.querySelectorAll('.pin-dot');
    dots.forEach((dot, i) => i < pinCode.length ? dot.classList.add('filled') : dot.classList.remove('filled'));
}

// 2. NAVIGASI & GIFT
function goToScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    
    if (id === 'screen-gift') {
        setTimeout(() => {
            goToScreen('screen-main');
            startMusicPlayer();
            triggerModal();
            spawnBackgroundFlowers();
            initScrollAnimation();
        }, 2500);
    }
}

function openGift() {
    goToScreen('screen-gift'); // Konsep awal: klik kado langsung pindah
}

// 3. BUNGA DIGITAL
function spawnFlowers() {
    const bouquetArea = document.getElementById('bouquet-area');
    bouquetArea.innerHTML = '';
    
    for (let i = 0; i < 8; i++) {
        const btn = document.createElement('div');
        btn.className = 'digital-flower';
        btn.textContent = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];
        btn.style.left = Math.random() * 80 + '%';
        btn.style.top = Math.random() * 80 + '%';
        btn.style.bottom = 'auto';
        
        btn.onclick = function(e) {
            e.stopPropagation();
            btn.style.left = (20 + Math.random() * 60) + '%';
            btn.style.top = 'auto';
            btn.style.bottom = '10px';
            btn.classList.add('placed');
        };
        
        bouquetArea.appendChild(btn);
    }
}
spawnFlowers();

// 4. MUSIK (Tombol Play, Next, Prev)
function startMusicPlayer() {
    const trackList = document.getElementById('track-list');
    trackList.innerHTML = '';
    
    songs.forEach((song, index) => {
        const item = document.createElement('div');
        item.className = 'track-item' + (index === 0 ? ' active' : '');
        item.innerHTML = `<strong>${index + 1}. ${song.title}</strong><br><small>${song.artist}</small>`;
        item.onclick = () => playSong(index);
        trackList.appendChild(item);
    });
}

function playSong(index) {
    currentSongIndex = index;
    document.querySelectorAll('.track-item').forEach((i, idx) => idx === index ? i.classList.add('active') : i.classList.remove('active'));
    
    const audio = document.getElementById('audio-player');
    audio.src = songs[index].src;
    audio.play();
    isPlaying = true;
    updatePlayButton();
}

function togglePlay() {
    const audio = document.getElementById('audio-player');
    if (audio.paused) {
        if (!audio.src) playSong(currentSongIndex);
        else audio.play();
        isPlaying = true;
    } else {
        audio.pause();
        isPlaying = false;
    }
    updatePlayButton();
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong(currentSongIndex);
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(currentSongIndex);
}

function updatePlayButton() {
    const btn = document.getElementById('play-btn');
    btn.textContent = isPlaying ? '⏸' : '▶';
}

// 5. MODAL
function triggerModal() {
    setTimeout(() => document.getElementById('modal-overlay').classList.add('active'), 1000);
}
function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

// 6. BUNGA BACKGROUND MELAYANG
function spawnBackgroundFlowers() {
    const container = document.getElementById('bg-flowers');
    container.innerHTML = '';
    
    for (let i = 0; i < 20; i++) {
        const flower = document.createElement('div');
        flower.className = 'floating-flower';
        flower.textContent = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];
        flower.style.left = Math.random() * 100 + 'vw';
        flower.style.animationDuration = (Math.random() * 10 + 5) + 's';
        flower.style.animationDelay = (Math.random() * 5) + 's';
        flower.style.fontSize = (Math.random() * 20 + 15) + 'px';
        container.appendChild(flower);
    }
}

// 7. ANIMASI SCROLL
function initScrollAnimation() {
    const sections = document.querySelectorAll('.section-glass');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => observer.observe(section));
}

// 8. LOADING
window.onload = function() {
    setTimeout(() => goToScreen('screen-pin'), 3000);
};
