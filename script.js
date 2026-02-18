document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const batContainer = document.getElementById('bat-animation-container');
    const splashBatsContainer = document.getElementById('splash-bats-container');
    const createPostModal = document.getElementById('create-post-modal');

    // 1. Splash Screen Logic
    function runSplash() {
        // Create bats flying across splash screen
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const bat = document.createElement('div');
                bat.className = 'bat-particle animate-bat';
                bat.style.left = Math.random() * 100 + 'vw';
                bat.style.top = Math.random() * 100 + 'vh';
                bat.style.setProperty('--tx', (Math.random() - 0.5) * 1000 + 'px');
                bat.style.setProperty('--ty', (Math.random() - 0.5) * 1000 + 'px');
                bat.style.setProperty('--tr', Math.random() * 720 + 'deg');
                splashBatsContainer.appendChild(bat);
                setTimeout(() => bat.remove(), 1000);
            }, i * 50);
        }

        // Hide splash after 2.5 seconds
        setTimeout(() => {
            splashScreen.classList.add('fade-out');
        }, 2200);
    }
    runSplash();

    // 2. Core Bat Animation Function
    function triggerBatAnimation(x, y) {
        const batCount = 12;
        for (let i = 0; i < batCount; i++) {
            const bat = document.createElement('div');
            bat.classList.add('bat-particle');
            const tx = (Math.random() - 0.5) * 400;
            const ty = (Math.random() - 0.5) * 400 - 100;
            const tr = (Math.random() - 0.5) * 360;
            bat.style.setProperty('--tx', `${tx}px`);
            bat.style.setProperty('--ty', `${ty}px`);
            bat.style.setProperty('--tr', `${tr}deg`);
            bat.style.left = `${x}px`;
            bat.style.top = `${y}px`;
            batContainer.appendChild(bat);
            bat.classList.add('animate-bat');
            setTimeout(() => bat.remove(), 1000);
        }
    }

    // 3. Button & Click Handlers
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.nav-btn, .action-btn, .clickable, .bat-btn');
        if (!btn) return;

        // Trigger animation
        triggerBatAnimation(e.clientX, e.clientY);

        // Specific Button Logic
        if (btn.classList.contains('like-btn')) {
            toggleLike(btn);
        } else if (btn.id === 'create-post-btn' || btn.id === 'mobile-create-post') {
            createPostModal.classList.add('visible');
        } else if (btn.classList.contains('close-modal')) {
            btn.closest('.bat-modal').classList.remove('visible');
        } else if (btn.classList.contains('nav-btn')) {
            handleNavClick(btn);
        } else if (btn.classList.contains('comment-btn') || btn.classList.contains('share-btn')) {
            showSimpleAlert('SECURE CHANNEL', 'Encryption active. Data pending update.');
        }
    });

    function toggleLike(btn) {
        const heart = btn.querySelector('i');
        const countSpan = btn.closest('.post-card').querySelector('.likes-count');
        let count = parseInt(countSpan.innerText.replace(/,/g, ''));

        if (heart.classList.contains('far')) {
            heart.classList.replace('far', 'fas');
            heart.style.color = '#FFD700';
            countSpan.innerText = (count + 1).toLocaleString() + ' likes';
            btn.style.animation = 'heartBeat 0.3s ease-in-out';
        } else {
            heart.classList.replace('fas', 'far');
            heart.style.color = '';
            countSpan.innerText = (count - 1).toLocaleString() + ' likes';
            btn.style.animation = '';
        }
    }

    function handleNavClick(btn) {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (btn.classList.contains('fa-home') || btn.classList.contains('fa-home-alt')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // 4. Custom Alerts / Modals
    function showSimpleAlert(title, message) {
        const modal = document.createElement('div');
        modal.className = 'bat-modal visible';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <i class="fas fa-times close-modal"></i>
                </div>
                <div class="modal-body"><p>${message}</p></div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('.close-modal').onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    }

    // 5. Stories interaction
    const stories = document.querySelectorAll('.story-item');
    stories.forEach(story => {
        story.onclick = () => {
            const name = story.querySelector('span').innerText;
            showSimpleAlert('ENCRYPTED INTEL', `Viewing ${name}'s private data link...`);
            story.querySelector('.story-ring').classList.remove('active');
        };
    });

    console.log('BAT-CAVE Online. All systems green.');
});
