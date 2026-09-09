// DATA LAGU (Ganti Link di sini!)
const songs = [
    { title: "Shape Of My Heart", artist: "Backstreet Boys", src: "musik/lagu1.mp3" },
    { title: "Angel Baby", artist: "Troye Sivan", src: "musik/lagu2.mp3" },
    { title: "My Love", artist: "Westlife", src: "musik/lagu3.mp3" }
];

let currentSongIndex = 0;
let pinCode = "";
let isPlaying = false;
const targetPin = "110911";

// SVG BUNGA (Tanpa Emoji, tapi gambar vektor)
const flowerSVGs = [
    `<svg viewBox="0 0 100 100"><circle cx="50" cy="30" r="20" fill="#ff8ba7"/><circle cx="70" cy="50" r="20" fill="#ff8ba7"/><circle cx="30" cy="50" r="20" fill="#ff8ba7"/><circle cx="50" cy="70" r="20" fill="#ff8ba7"/><circle cx="50" cy="50" r="15" fill="#f9d56e"/></svg>`, // Bunga Pink
    `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="40" rx="20" ry="30" fill="#ff6b8a"/><ellipse cx="50" cy="40" rx="20" ry="30" fill="#ff6b8a" transform="rotate(90 50 50)"/><circle cx="50" cy="50" r="15" fill="#fff"/></svg>`, // Bunga Merah Muda
    `<svg viewBox="0 0 100 100"><path d="M20,50 Q50,10 80,50 Q50,90 20,50" fill="#f9d56e"/><circle cx="50" cy="50" r="15" fill="#b5651d"/></svg>`, // Bunga Tulip
];

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
            initScrollAnimation(); // Animasi Scroll
        }, 2000); // Dikasih waktu buat liat efek kado
    }
}

function openGift() {
    const giftScreen = document.getElementById('screen-gift');
    const giftBox = document.getElementById('gift-box');
    
    // Animasi Kado: Tutup terbang, muncul kejutan
    giftScreen.classList.add('clicked');
    
    setTimeout(() => {
        goToScreen('screen-main');
        startMusicPlayer();
        triggerModal();
        spawnBackgroundFlowers();
        initScrollAnimation();
    }, 1500); // Setelah animasi kado selesai
}

// 3. BUNGA DIGITAL (SVG)
function spawnFlowers() {
    const bouquetArea = document.getElementById('bouquet-area');
    bouquetArea.innerHTML = '';
    
    for (let i = 0; i < 8; i++) {
        const btn = document.createElement('div');
        btn.className = 'digital-flower';
        btn.innerHTML = flowerSVGs[i % flowerSVGs.length];
        btn.style.left = Math.random() * 80 + '%';
        btn.style.top = Math.random() * 80 + '%';
        btn.style.bottom = 'auto';
        
        btn.onclick = function(e) {
            e.stopPropagation();
            // Animasikan jatuh ke bawah (tangkai)
            btn.style.left = (20 + Math.random() * 60) + '%';
            btn.style.top = 'auto';
            btn.style.bottom = '10px';
            btn.classList.add('placed');
            
            // Bunga yang menempel jadi semakin cantik
            btn.style.transform = 'rotate(0deg) scale(1.2)';
        };
        
        bouquetArea.appendChild(btn);
    }
}
spawnFlowers();

// 4. MUSIK (Dengan tombol Play, Next, Prev)
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
    btn.textContent = isPlaying ? 'PAUSE' : 'PLAY';
}

// 5. MODAL
function triggerModal() {
    setTimeout(() => document.getElementById('modal-overlay').classList.add('active'), 1000);
}
function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

// 6. BUNGA BACKGROUND (SVG Kecil)
function spawnBackgroundFlowers() {
    const container = document.getElementById('bg-flowers');
    container.innerHTML = '';
    
    for (let i = 0; i < 20; i++) {
        const flower = document.createElement('div');
        flower.className = 'floating-flower';
        flower.innerHTML = flowerSVGs[Math.floor(Math.random() * flowerSVGs.length)];
        flower.style.left = Math.random() * 100 + 'vw';
        flower.style.animationDuration = (Math.random() * 10 + 5) + 's';
        flower.style.animationDelay = (Math.random() * 5) + 's';
        container.appendChild(flower);
    }
}

// 7. ANIMASI SCROLL (Reveal Element)
function initScrollAnimation() {
    const sections = document.querySelectorAll('.section-glass');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => observer.observe(section));
}

// 8. LOADING
window.onload = function() {
    setTimeout(() => goToScreen('screen-pin'), 3000);
};
