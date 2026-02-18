document.addEventListener('DOMContentLoaded', () => {
    // 1. Elements
    const splash = document.getElementById('splash-screen');
    const swarmHost = document.getElementById('bat-swarm-host');
    const pages = document.querySelectorAll('.page');
    const modal = document.getElementById('tactical-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    // 2. Cinematic Splash Swarm
    function createSplashSwarm() {
        if (!splash) return;

        for (let i = 0; i < 40; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                spawnBlackBats(x, y, 1);
            }, i * 40);
        }

        setTimeout(() => {
            splash.classList.add('hidden');
            setTimeout(() => splash.remove(), 1000);
        }, 2800);
    }
    createSplashSwarm();

    // 3. Black Bat Spawn Engine
    function spawnBlackBats(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            const bat = document.createElement('div');
            bat.className = 'bat-particle anim-bat';

            // Random direction and intensity (Black color inherited from SVG fill in CSS)
            const tx = (Math.random() - 0.5) * 600;
            const ty = (Math.random() - 0.5) * 600 - 100;
            const tr = (Math.random() - 0.5) * 1080;

            bat.style.setProperty('--tx', `${tx}px`);
            bat.style.setProperty('--ty', `${ty}px`);
            bat.style.setProperty('--tr', `${tr}deg`);

            bat.style.left = `${x}px`;
            bat.style.top = `${y}px`;

            swarmHost.appendChild(bat);
            setTimeout(() => bat.remove(), 800);
        }
    }

    // 4. Tactical Navigation Controller
    function navigate(pageId) {
        if (pageId === 'add') {
            showTacticalModal('INTEL UPLOAD', 'Unauthorized access to Sector 7. Evidence upload requires Wayne Enterprises decryption keys.');
            return;
        }

        pages.forEach(p => p.classList.remove('active'));
        const target = document.getElementById(`page-${pageId}`);
        if (target) {
            target.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'instant' });
        }

        // Sync Nav Icons
        document.querySelectorAll('.nav-item').forEach(item => {
            if (item.dataset.page === pageId) item.classList.add('active');
            else item.classList.remove('active');
        });
    }

    // 5. Global Tactical Click Handler
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.nav-item, .nav-btn, .action-trigger, .hex-border, .tactical-btn');
        if (!trigger) return;

        // Visual Swarm Feedback (BLACK BATS)
        spawnBlackBats(e.clientX, e.clientY, 6);

        // Routing
        if (trigger.dataset.page) {
            navigate(trigger.dataset.page);
        }

        // Logic for specific triggers
        if (trigger.classList.contains('like-btn')) {
            const icon = trigger.querySelector('i');
            const card = trigger.closest('.intel-card');
            const metrics = card.querySelector('.metrics');
            let val = parseFloat(metrics.innerText);

            if (icon.classList.contains('far')) {
                icon.className = 'fas fa-heart liked';
                metrics.innerText = (val + 0.1).toFixed(1) + 'K SCANNED';
                trigger.style.transform = 'scale(1.4)';
                setTimeout(() => trigger.style.transform = '', 150);
            } else {
                icon.className = 'far fa-heart';
                metrics.innerText = (val - 0.1).toFixed(1) + 'K SCANNED';
            }
        }

        if (trigger.classList.contains('save-btn')) {
            const icon = trigger.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
        }

        if (trigger.classList.contains('comment-btn')) {
            showTacticalModal('SECURE COMMS', 'Channel encrypted. Oracle is currently off-grid. Leave a message after the pulse.');
        }
    });

    // 6. UI Utils
    window.showTacticalModal = (title, body) => {
        modalTitle.innerText = title;
        modalBody.innerText = body;
        modal.classList.add('visible');
    };

    window.closeTacticalModal = () => {
        modal.classList.remove('visible');
    };

    window.viewStory = (user) => {
        showTacticalModal('INTEL UPDATE', `Accessing live thermal stream from ${user}'s current position... [ENCRYPTED]`);
    };

    // Outside click close
    modal.onclick = (e) => { if (e.target === modal) closeTacticalModal(); };

    console.log('--- BAT-CAVE OS v4.0 ONLINE ---');
});
