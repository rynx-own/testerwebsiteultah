// ==========================================
// 🎵 DAFTAR LAGU & ARTIS (SUDAH DIISI OLEH ASISTEN)
// ==========================================
const songs = [
    { 
        title: "Shape Of My Heart", 
        artist: "Backstreet Boys", 
        src: "https://videotourl.com/audio/1789000165093-d8347254-2ca2-4aab-9df6-4dbc83405ddc.mp3"
    },
    { 
        title: "Can't Help Fall In Love", 
        artist: "Elvis Presley", 
        src: "https://videotourl.com/audio/1789000314537-52d49c9d-3189-4d87-a217-941559c12ff9.mp3"
    },
    { 
        title: "Stand By Me", 
        artist: "Oasis", 
        src: "https://videotourl.com/audio/1789000415388-f01aa450-483a-476f-af6d-4d10d94b3277.mp3"
    }
];

// ==========================================
// JANGAN UBAH BAGIAN DI BAWAH INI!
// ==========================================
let currentSongIndex = 0;
let pinCode = "";
let isPlaying = false;
const targetPin = "110911";
const flowerEmojis = ['🌼', '🌸', '🌷', '🌹', '🌻', '💐'];

const flowerMessages = {
    '🌼': "“Like a daisy, may you always find a reason to bloom, even on ordinary days.”",
    '🌻': "“May you always turn toward the light, and may happiness always find its way to you.”",
    '🌹': "“A reminder that beautiful things take time to bloom, and you are one of them.”",
    '🌸': "“May every new chapter of your life be as beautiful, gentle, and unforgettable as spring.”",
    '🌷': "“A little bouquet for someone who deserves a world full of beautiful things.”",
    '💐': "“A little bouquet for someone who deserves a world full of beautiful things.”"
};

// 1. PIN LOGIC
function inputPin(num) {
    if (pinCode.length < 6) {
        pinCode += num;
        updatePinDisplay();
        if (pinCode.length === 6) {
            setTimeout(() => {
                if (pinCode === targetPin) goToScreen('screen-gift');
                else { alert("Kode salah!"); resetPin(); }
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
            startTypingEffect();
        }, 2000);
    }
}

function openGift() {
    const giftScreen = document.getElementById('screen-gift');
    giftScreen.classList.add('clicked');
    
    setTimeout(() => {
        goToScreen('screen-main');
        startMusicPlayer();
        triggerModal();
        spawnBackgroundFlowers();
        initScrollAnimation();
        startTypingEffect();
    }, 1200);
}

// 3. BUNGA MENEMPEL DI TANGKAI
function spawnFlowers() {
    const bouquetArea = document.getElementById('bouquet-area');
    bouquetArea.innerHTML = ''; 

    const stemPositions = [
        { left: 50, bottom: 55 },  // Tengah
        { left: 30, bottom: 40 },  // Kiri Bawah
        { left: 70, bottom: 40 },  // Kanan Bawah
        { left: 20, bottom: 20 },  // Kiri Atas
        { left: 80, bottom: 20 }   // Kanan Atas
    ];

    for (let i = 0; i < 6; i++) {
        const btn = document.createElement('div');
        btn.className = 'digital-flower';
        const emoji = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];
        btn.textContent = emoji;
        btn.dataset.emoji = emoji;
        
        btn.style.left = Math.random() * 80 + '%';
        btn.style.top = Math.random() * 80 + '%';
        
        btn.onclick = function(e) {
            e.stopPropagation();
            const target = stemPositions[Math.floor(Math.random() * stemPositions.length)];
            
            btn.style.left = target.left + '%';
            btn.style.top = 'auto';
            btn.style.bottom = target.bottom + '%';
            btn.classList.add('placed');
            
            const msgBox = document.getElementById('flower-message-box');
            msgBox.innerHTML = `<span class="glow">✦</span> ${flowerMessages[emoji] || flowerMessages['🌷']} <span class="glow">✦</span>`;
            msgBox.classList.add('show');
            
            setTimeout(() => {
                msgBox.classList.remove('show');
            }, 5000);
        };
        
        bouquetArea.appendChild(btn);
    }
}
spawnFlowers();

// 4. MUSIK (Otomatis Sinkron Durasi & Menit Detik)
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
    
    // Otomatis atur durasi menit & detik setelah metadata lagu dimuat
    audio.onloadedmetadata = function() {
        document.getElementById('duration-time').textContent = formatTime(audio.duration);
        document.getElementById('current-time').textContent = formatTime(0);
    };

    audio.play();
    isPlaying = true;
    updatePlayButton();
    updateProgressBar();
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

function nextSong() { currentSongIndex = (currentSongIndex + 1) % songs.length; playSong(currentSongIndex); }
function prevSong() { currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length; playSong(currentSongIndex); }
function updatePlayButton() { document.getElementById('play-btn').textContent = isPlaying ? '⏸' : '▶'; }

// Progress Bar Sinkron Otomatis
function updateProgressBar() {
    const audio = document.getElementById('audio-player');
    const progressFill = document.getElementById('progress-fill');
    const currentTime = document.getElementById('current-time');
    
    audio.addEventListener('timeupdate', () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = percent + '%';
        currentTime.textContent = formatTime(audio.currentTime);
    });
}

// Fungsi format waktu (menit:detik)
function formatTime(secs) {
    if (isNaN(secs) || secs < 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// 5. MODAL
function triggerModal() { setTimeout(() => document.getElementById('modal-overlay').classList.add('active'), 1000); }
function closeModal() { document.getElementById('modal-overlay').classList.remove('active'); }

// 6. ZOOM FOTO
function openPhotoZoom(src, caption) {
    document.getElementById('zoom-photo-img').src = src;
    document.getElementById('zoom-photo-caption').textContent = caption;
    document.getElementById('photo-zoom-overlay').classList.add('active');
}
function closePhotoZoom() { document.getElementById('photo-zoom-overlay').classList.remove('active'); }

// 7. BUNGA BACKGROUND
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

// 8. SCROLL
function initScrollAnimation() {
    const sections = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    sections.forEach(section => observer.observe(section));
}

// 9. TYPING
function startTypingEffect() {
    const text = "SEPTEMBER 11 — THE MOST SPECIAL DAY";
    const element = document.getElementById('typing-date');
    let i = 0;
    element.textContent = '';
    
    const typeInterval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typeInterval);
            setTimeout(() => {
                element.style.borderRight = 'none';
            }, 500);
        }
    }, 80);
}

// 10. LOADING
window.onload = function() {
    setTimeout(() => goToScreen('screen-pin'), 3000);
};
