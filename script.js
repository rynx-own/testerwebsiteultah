(function() {
    'use strict';

    // ===== CONFIG =====
    const PIN_CODE = '110911';
    const SONGS = [{
        name: 'Shape Of My Heart',
        artist: 'Backstreet Boys',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    }, {
        name: 'Angel Baby',
        artist: 'Troye Sivan',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    }, {
        name: 'My Love',
        artist: 'Westlife',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    }];

    const FLOWERS = [
        { emoji: '🌷', msg: 'You are so loved.' },
        { emoji: '🌹', msg: 'You make the world brighter.' },
        { emoji: '🌸', msg: 'Your kindness touches hearts.' },
        { emoji: '🌼', msg: 'You bring joy everywhere.' },
        { emoji: '🌺', msg: 'Stay beautiful inside out.' },
        { emoji: '💐', msg: 'A bouquet of happiness for you.' },
    ];

    // ===== DOM REFS =====
    const loadingScreen = document.getElementById('loading-screen');
    const pinScreen = document.getElementById('pin-screen');
    const giftScreen = document.getElementById('gift-screen');
    const mainContent = document.getElementById('main-content');

    const pinDisplay = document.getElementById('pinDisplay');
    const pinGrid = document.getElementById('pinGrid');
    const pinError = document.getElementById('pinError');

    const giftBox = document.getElementById('giftBox');
    const giftPrompt = document.getElementById('giftPrompt');

    const stemArea = document.getElementById('stemArea');
    const flowerChoices = document.getElementById('flowerChoices');

    const photoFrame = document.getElementById('photoFrame');
    
    const audio = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('progressContainer');
    const currentTrackName = document.getElementById('currentTrackName');
    const currentTrackArtist = document.getElementById('currentTrackArtist');
    const playlistEl = document.getElementById('playlist');
    const backBtn = document.getElementById('backBtn');
    const letterBody = document.getElementById('letterBody');
    let pinEntry = '';
    let isGiftOpened = false;
    let currentSongIndex = 0;
    let isPlaying = false;
    let usedFlowers = 0;
    const MAX_STEMS = 6;
    let flowerData = [];

    function initScrollAnimation() {
        const elements = document.querySelectorAll('.scroll-animate');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add delay based on index
                    const delay = (index % 5) * 0.1;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay * 1000);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(el => observer.observe(el));
    }

    // ===== LETTER ANIMATION =====
    function initLetterAnimation() {
        if (!letterBody) return;
        const text = letterBody.textContent;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        
        letterBody.innerHTML = '';
        lines.forEach((line, index) => {
            const p = document.createElement('p');
            p.className = 'letter-line';
            p.textContent = line;
            p.style.animationDelay = `${index * 0.08}s`;
            letterBody.appendChild(p);
        });
    }

    // ===== LOADING =====
    setTimeout(() => {
        loadingScreen.classList.add('hide');
        pinScreen.classList.remove('hide');
    }, 3200);

    // ===== PIN =====
    function updatePinDisplay() {
        const dots = pinDisplay.querySelectorAll('.pin-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('filled', i < pinEntry.length);
        });
    }

    function handlePinInput(value) {
        if (pinEntry.length >= 6) return;
        pinEntry += value;
        updatePinDisplay();
        pinError.classList.remove('show');

        if (pinEntry.length === 6) {
            if (pinEntry === PIN_CODE) {
                setTimeout(() => {
                    pinScreen.classList.add('hide');
                    giftScreen.classList.remove('hide');
                }, 400);
            } else {
                pinError.classList.add('show');
                setTimeout(() => {
                    pinEntry = '';
                    updatePinDisplay();
                    pinError.classList.remove('show');
                }, 1200);
            }
        }
    }

    pinGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.pin-btn');
        if (!btn) return;
        const val = btn.dataset.value;
        if (val === 'clear') {
            pinEntry = pinEntry.slice(0, -1);
            updatePinDisplay();
            pinError.classList.remove('show');
            return;
        }
        if (val === 'gift') return;
        handlePinInput(val);
    });

    // ===== GIFT =====
    function spawnSparkles() {
        const emojis = ['✨', '🌟', '💫', '⭐', '🎉', '💖'];
        for (let i = 0; i < 15; i++) {
            const span = document.createElement('span');
            span.className = 'gift-sparkle';
            span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            const angle = Math.random() * 2 * Math.PI;
            const dist = 40 + Math.random() * 120;
            const tx = Math.cos(angle) * dist;
            const ty = Math.sin(angle) * dist - 40;
            span.style.setProperty('--tx', tx + 'px');
            span.style.setProperty('--ty', ty + 'px');
            span.style.left = '50%';
            span.style.top = '50%';
            span.style.fontSize = (1.2 + Math.random() * 1.5) + 'rem';
            span.style.animationDuration = (0.6 + Math.random() * 0.5) + 's';
            giftBox.appendChild(span);
            setTimeout(() => span.remove(), 1200);
        }
    }

    giftBox.addEventListener('click', () => {
        if (isGiftOpened) return;
        isGiftOpened = true;
        giftBox.classList.add('opened');
        giftPrompt.textContent = '✨ Your gift is ready! ✨';
        spawnSparkles();

        setTimeout(() => {
            giftScreen.classList.add('hide');
            mainContent.classList.add('show');
            initBouquet();
            initMusic();
            initPhoto();
            initLetterAnimation();
            initScrollAnimation();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1000);
    });

    // ===== BOUQUET =====
    function initBouquet() {
        stemArea.innerHTML = '';
        for (let i = 0; i < MAX_STEMS; i++) {
            const stem = document.createElement('div');
            stem.className = 'stem';
            stem.dataset.index = i;
            stem.dataset.filled = 'false';
            stemArea.appendChild(stem);
        }

        flowerChoices.innerHTML = '';
        flowerData = FLOWERS.map((f, idx) => ({
            ...f,
            used: false,
            index: idx
        }));

        flowerData.forEach((f) => {
            const el = document.createElement('div');
            el.className = 'flower-choice';
            el.dataset.index = f.index;
            el.innerHTML = `
                ${f.emoji}
                <span class="flower-msg">${f.msg}</span>
            `;
            el.addEventListener('click', () => placeFlower(f.index, el));
            flowerChoices.appendChild(el);
        });
    }

    function placeFlower(idx, el) {
        if (flowerData[idx].used) return;
        const stems = stemArea.querySelectorAll('.stem');
        let targetStem = null;
        for (const stem of stems) {
            if (stem.dataset.filled === 'false') {
                targetStem = stem;
                break;
            }
        }
        if (!targetStem) return;

        flowerData[idx].used = true;
        el.classList.add('used');
        usedFlowers++;

        const flowerEmoji = flowerData[idx].emoji;
        const flowerSpan = document.createElement('span');
        flowerSpan.className = 'flower-on-stem';
        flowerSpan.textContent = flowerEmoji;
        flowerSpan.style.fontSize = '2.4rem';
        targetStem.appendChild(flowerSpan);
        targetStem.dataset.filled = 'true';

        flowerSpan.style.transform = 'translateX(-50%) scale(0)';
        requestAnimationFrame(() => {
            flowerSpan.style.transform = 'translateX(-50%) scale(1)';
        });

        if (usedFlowers >= Math.min(flowerData.length, MAX_STEMS)) {
            setTimeout(() => {
                const msg = document.createElement('div');
                msg.style.cssText = `
                    width:100%;
                    text-align:center;
                    margin-top:0.6rem;
                    font-size:0.9rem;
                    color:var(--rose);
                    font-weight:600;
                    animation:fadeInUp 0.6s ease;
                `;
                msg.textContent = '💐 Your bouquet is complete! 💐';
                const container = document.querySelector('.bouquet-container');
                const existing = container.querySelector('.complete-msg');
                if (existing) existing.remove();
                msg.className = 'complete-msg';
                container.appendChild(msg);
            }, 400);
        }
    }

    // ===== PHOTO =====
    function initPhoto() {
        let zoomed = false;
        photoFrame.addEventListener('click', () => {
            zoomed = !zoomed;
            photoFrame.classList.toggle('zoomed', zoomed);
        });
    }

    // ===== MUSIC =====
    function initMusic() {
        renderPlaylist();
        loadSong(currentSongIndex);

        playBtn.addEventListener('click', togglePlay);
        prevBtn.addEventListener('click', prevSong);
        nextBtn.addEventListener('click', nextSong);

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', nextSong);

        progressContainer.addEventListener('click', (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            if (audio.duration) {
                audio.currentTime = pct * audio.duration;
            }
        });
    }

    function loadSong(index) {
        const song = SONGS[index];
        if (!song) return;
        currentSongIndex = index;
        currentTrackName.textContent = song.name;
        currentTrackArtist.textContent = song.artist;
        audio.src = song.url;
        audio.load();
        updatePlaylistUI();
        if (isPlaying) {
            audio.play().catch(() => {});
        }
        progressBar.style.width = '0%';
    }

    function togglePlay() {
        if (audio.paused) {
            audio.play().catch(() => {});
            isPlaying = true;
            playBtn.textContent = '⏸';
        } else {
            audio.pause();
            isPlaying = false;
            playBtn.textContent = '▶';
        }
    }

    function prevSong() {
        const idx = (currentSongIndex - 1 + SONGS.length) % SONGS.length;
        loadSong(idx);
        if (!isPlaying) {
            isPlaying = true;
            playBtn.textContent = '⏸';
            audio.play().catch(() => {});
        }
    }

    function nextSong() {
        const idx = (currentSongIndex + 1) % SONGS.length;
        loadSong(idx);
        if (!isPlaying) {
            isPlaying = true;
            playBtn.textContent = '⏸';
            audio.play().catch(() => {});
        }
    }

    function updateProgress() {
        if (audio.duration) {
            const pct = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = pct + '%';
        }
    }

    function renderPlaylist() {
        playlistEl.innerHTML = '';
        SONGS.forEach((song, idx) => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            item.dataset.index = idx;
            item.innerHTML = `
                <div>
                    <div class="pl-name">${song.name}</div>
                    <div class="pl-artist">${song.artist}</div>
                </div>
                <span class="pl-active">♫</span>
            `;
            item.addEventListener('click', () => {
                if (currentSongIndex !== idx) {
                    loadSong(idx);
                    if (!isPlaying) {
                        isPlaying = true;
                        playBtn.textContent = '⏸';
                        audio.play().catch(() => {});
                    }
                } else {
                    togglePlay();
                }
            });
            playlistEl.appendChild(item);
        });
        updatePlaylistUI();
    }

    function updatePlaylistUI() {
        const items = playlistEl.querySelectorAll('.playlist-item');
        items.forEach((item, idx) => {
            const active = item.querySelector('.pl-active');
            if (idx === currentSongIndex) {
                active.style.opacity = '1';
                item.style.background = 'rgba(255,255,255,0.35)';
            } else {
                active.style.opacity = '0.2';
                item.style.background = 'rgba(255,255,255,0.2)';
            }
        });
    }

    // ===== BACK BUTTON =====
    backBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            playBtn.textContent = '▶';
        }
        mainContent.classList.remove('show');
        giftScreen.classList.remove('hide');
        giftScreen.style.opacity = '1';
        giftScreen.style.visibility = 'visible';
        isGiftOpened = false;
        giftBox.classList.remove('opened');
        giftPrompt.textContent = 'Tap to open your gift ✨';
        
        usedFlowers = 0;
        flowerData.forEach(f => f.used = false);
        const stems = stemArea.querySelectorAll('.stem');
        stems.forEach(s => {
            s.dataset.filled = 'false';
            const child = s.querySelector('.flower-on-stem');
            if (child) child.remove();
        });
        const choices = flowerChoices.querySelectorAll('.flower-choice');
        choices.forEach(el => el.classList.remove('used'));
        const msg = document.querySelector('.complete-msg');
        if (msg) msg.remove();
        
        photoFrame.classList.remove('zoomed');
        
        loadSong(0);
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            playBtn.textContent = '▶';
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== KEYBOARD SUPPORT =====
    document.addEventListener('keydown', (e) => {
        if (!pinScreen.classList.contains('hide')) {
            if (e.key >= '0' && e.key <= '9') {
                handlePinInput(e.key);
            } else if (e.key === 'Backspace' || e.key === 'Delete') {
                pinEntry = pinEntry.slice(0, -1);
                updatePinDisplay();
                pinError.classList.remove('show');
            } else if (e.key === 'Enter') {
                if (pinEntry.length === 6) {
                    if (pinEntry === PIN_CODE) {
                        pinScreen.classList.add('hide');
                        giftScreen.classList.remove('hide');
                    } else {
                        pinError.classList.add('show');
                        setTimeout(() => {
                            pinEntry = '';
                            updatePinDisplay();
                            pinError.classList.remove('show');
                        }, 1200);
                    }
                }
            }
        }
        if (e.key === ' ' || e.key === 'Space') {
            if (!mainContent.classList.contains('show')) return;
            e.preventDefault();
            togglePlay();
        }
    });

    // ===== PREVENT ZOOM ON DOUBLE TAP =====
    let lastTouch = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouch < 300) e.preventDefault();
        lastTouch = now;
    }, { passive: false });

    console.log('🌸 Happy Birthday Evelyn! 🌸');
})();
