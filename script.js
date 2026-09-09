// DATA LAGU (Ganti link dengan link lagu kamu)
const songs = [
    { title: "Shape Of My Heart", artist: "Backstreet Boys", src: "musik/lagu1.mp3" },
    { title: "Angel Baby", artist: "Troye Sivan", src: "musik/lagu2.mp3" },
    { title: "My Love", artist: "Westlife", src: "musik/lagu3.mp3" }
];

let currentSongIndex = 0;
let pinCode = "";
let isPlaying = false;
const targetPin = "110911";
const flowerEmojis = ['🌼', '🌸', '🌷', '🌹', '🌻', '💐'];

// Pesan bunga sesuai request
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

// 2. NAVIGASI
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

// 3. GIFT ANIMATION
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
    }, 1200); // Setelah efek ledakan selesai
}

// 4. BUNGA DIGITAL
function spawnFlowers() {
    const bouquetArea = document.getElementById('bouquet-area');
    bouquetArea.innerHTML = '';
    const stemHtml = `
        <div class="stems">
            <svg viewBox="0 0 200 100" width="100%" height="100%" style="position:absolute; bottom:0;">
                <path d="M100,100 Q90,50 70,20" stroke="#4a8c5c" stroke-width="3" fill="none"/>
                <path d="M100,100 Q110,60 130,30" stroke="#4a8c5c" stroke-width="3" fill="none"/>
                <path d="M100,100 Q80,70 50,50" stroke="#4a8c5c" stroke-width="3" fill="none"/>
                <path d="M100,100 Q120,70 150,50" stroke="#4a8c5c" stroke-width="3" fill="none"/>
                <path d="M100,100 Q95,40 100,20" stroke="#4a8c5c" stroke-width="4" fill="none"/>
                <circle cx="100" cy="100" r="20" fill="#ff8ba7" opacity="0.8"/>
            </svg>
        </div>`;
    bouquetArea.innerHTML = stemHtml;
    
    for (let i = 0; i < 6; i++) {
        const btn = document.createElement('div');
        btn.className = 'digital-flower';
        const emoji = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];
        btn.textContent = emoji;
        btn.dataset.emoji = emoji;
        btn.style.left = Math.random() * 80 + '%';
        btn.style.top = Math.random() * 80 + '%';
        btn.style.bottom = 'auto';
        
        btn.onclick = function(e) {
            e.stopPropagation();
            // Animasi jatuh ke tangkai
            btn.style.left = (20 + Math.random() * 60) + '%';
            btn.style.top = 'auto';
            btn.style.bottom = '90px';
            btn.classList.add('placed');
            
            // Muncul pesan
            const msgBox = document.getElementById('flower-message-box');
            msgBox.innerHTML = `<span class="glow">✦</span> ${flowerMessages[emoji] || flowerMessages['🌷']} <span class="glow">✦</span>`;
            msgBox.classList.add('show');
            
            // Reset setelah beberapa detik
            setTimeout(() => {
                msgBox.classList.remove('show');
            }, 5000);
        };
        
        bouquetArea.appendChild(btn);
    }
}
spawnFlowers();

// 5. MUSIK
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

// Progress Bar
function updateProgressBar() {
    const audio = document.getElementById('audio-player');
    const progressFill = document.getElementById('progress-fill');
    const currentTime = document.getElementById('current-time');
    const durationTime = document.getElementById('duration-time');
    
    audio.addEventListener('timeupdate', () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = percent + '%';
        
        const formatTime = (secs) => {
            const m = Math.floor(secs / 60);
            const s = Math.floor(secs % 60);
            return `${m}:${s < 10 ? '0' : ''}${s}`;
        };
        
        currentTime.textContent = formatTime(audio.currentTime);
        durationTime.textContent = formatTime(audio.duration);
    });
}

// 6. MODAL
function triggerModal() { setTimeout(() => document.getElementById('modal-overlay').classList.add('active'), 1000); }
function closeModal() { document.getElementById('modal-overlay').classList.remove('active'); }

// 7. ZOOM FOTO
function openPhotoZoom(src, caption) {
    document.getElementById('zoom-photo-img').src = src;
    document.getElementById('zoom-photo-caption').textContent = caption;
    document.getElementById('photo-zoom-overlay').classList.add('active');
}
function closePhotoZoom() { document.getElementById('photo-zoom-overlay').classList.remove('active'); }

// 8. BACKGROUND BUNGA
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

// 9. SCROLL ANIMATION
function initScrollAnimation() {
    const sections = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    sections.forEach(section => observer.observe(section));
}

// 10. TYPING EFFECT
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
                // Hilangkan kursor
                element.style.borderRight = 'none';
            }, 500);
        }
    }, 80);
}

// 11. LOADING
window.onload = function() {
    setTimeout(() => goToScreen('screen-pin'), 3000);
};
