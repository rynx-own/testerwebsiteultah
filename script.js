// --- DATA LAGU (Tinggal ganti link di src) ---
const songs = [
    { title: "Shape Of My Heart", artist: "Backstreet Boys", src: "musik/lagu1.mp3" },
    { title: "Angel Baby", artist: "Troye Sivan", src: "musik/lagu2.mp3" },
    { title: "My Love", artist: "Westlife", src: "musik/lagu3.mp3" }
];

let currentSongIndex = 0;
let pinCode = "";
const targetPin = "110911"; // Kode PIN Anda

// 1. LOGIKA PIN
function inputPin(num) {
    if (pinCode.length < 6) {
        pinCode += num;
        updatePinDisplay();
        if (pinCode.length === 6) {
            setTimeout(() => {
                if (pinCode === targetPin) {
                    goToScreen('screen-gift');
                } else {
                    alert("Kode salah! Coba lagi.");
                    resetPin();
                }
            }, 200);
        }
    }
}

function removePin() {
    pinCode = pinCode.slice(0, -1);
    updatePinDisplay();
}

function resetPin() {
    pinCode = "";
    updatePinDisplay();
}

function updatePinDisplay() {
    const dots = document.querySelectorAll('.pin-dot');
    dots.forEach((dot, i) => {
        if (i < pinCode.length) dot.classList.add('filled');
        else dot.classList.remove('filled');
    });
}

// 2. LOGIKA NAVIGASI
function goToScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    
    if (id === 'screen-gift') {
        setTimeout(() => {
            goToScreen('screen-main');
            startMusicPlayer();
            triggerModal();
            spawnBackgroundFlowers();
        }, 2500);
    }
}

// 3. LOGIKA GIFT
function openGift() {
    document.querySelector('.gift-box').style.transform = 'scale(0.9)';
    setTimeout(() => {
        document.querySelector('.gift-box').style.transform = 'scale(1)';
    }, 200);
}

// 4. LOGIKA BUNGA
const flowerEmojis = ['🌼', '🌸', '🌷', '🌹', '🌻', '💐'];
const bouquetArea = document.getElementById('bouquet-area');

function spawnFlowers() {
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

// 5. LOGIKA MUSIK
function startMusicPlayer() {
    const trackList = document.getElementById('track-list');
    trackList.innerHTML = '';
    
    songs.forEach((song, index) => {
        const item = document.createElement('div');
        item.className = 'track-item' + (index === 0 ? ' active' : '');
        item.innerHTML = `<strong>${index + 1}. ${song.title}</strong><br><small>${song.artist}</small>`;
        item.onclick = () => playSong(index, item);
        trackList.appendChild(item);
    });
}

function playSong(index, element) {
    currentSongIndex = index;
    document.querySelectorAll('.track-item').forEach(i => i.classList.remove('active'));
    element.classList.add('active');
    
    const audio = document.getElementById('audio-player');
    audio.src = songs[index].src;
    audio.play();
}

function toggleMusicPlay() {
    const audio = document.getElementById('audio-player');
    if (audio.paused) audio.play();
    else audio.pause();
}

// 6. MODAL
function triggerModal() {
    setTimeout(() => {
        document.getElementById('modal-overlay').classList.add('active');
    }, 1000);
}
function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

// 7. BUNGA BACKGROUND
function spawnBackgroundFlowers() {
    const container = document.getElementById('bg-flowers');
    container.innerHTML = '';
    const emojis = ['🌸', '🌺', '🌼', '💮', '🏵️', '🌷'];
    
    for (let i = 0; i < 20; i++) {
        const flower = document.createElement('div');
        flower.className = 'floating-flower';
        flower.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        flower.style.left = Math.random() * 100 + 'vw';
        flower.style.animationDuration = (Math.random() * 10 + 5) + 's';
        flower.style.animationDelay = (Math.random() * 5) + 's';
        flower.style.fontSize = (Math.random() * 20 + 15) + 'px';
        container.appendChild(flower);
    }
}

// 8. INITIAL LOADING
window.onload = function() {
    setTimeout(() => {
        goToScreen('screen-pin');
    }, 3000);
};
