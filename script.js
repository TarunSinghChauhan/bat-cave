document.addEventListener('DOMContentLoaded', () => {
    // 1. Elements
    const splash = document.getElementById('splash-screen');
    const swarmHost = document.getElementById('bat-swarm-host');
    const pages = document.querySelectorAll('.page');

    // Create Modal if missing in HTML (The Batman HTML has tactical-modal removed or changed to app-modal in some iterations, let's create a robust one)
    let modal = document.getElementById('app-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'app-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-glass">
                <div class="modal-header">
                    <h3 id="modal-title">SYSTEM ALERT</h3>
                    <div class="scan-line"></div>
                </div>
                <div class="modal-body">
                    <p id="modal-body">Encryption logic processing...</p>
                </div>
                <button class="modal-close-btn" onclick="closeModal()">ACKNOWLEDGE</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    // 2. Cinematic Splash Swarm
    function createSplashSwarm() {
        if (!splash) return;

        // Initial silence, then swarm
        setTimeout(() => {
            for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                    const x = Math.random() * window.innerWidth;
                    const y = Math.random() * window.innerHeight;
                    spawnBlackBats(x, y, 1);
                }, i * 30);
            }
        }, 500);

        setTimeout(() => {
            splash.classList.add('hidden');
            setTimeout(() => splash.remove(), 1000);
        }, 3200);
    }
    createSplashSwarm();

    // 3. Black Bat Spawn Engine (Aggressive 2022 Style)
    function spawnBlackBats(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            const bat = document.createElement('div');
            bat.className = 'bat-particle anim-bat';

            const tx = (Math.random() - 0.5) * 800; // Wider spread
            const ty = (Math.random() - 0.5) * 800 - 150;
            const tr = (Math.random() - 0.5) * 1440; // More rotation

            bat.style.setProperty('--tx', `${tx}px`);
            bat.style.setProperty('--ty', `${ty}px`);
            bat.style.setProperty('--tr', `${tr}deg`);

            bat.style.left = `${x}px`;
            bat.style.top = `${y}px`;

            swarmHost.appendChild(bat);
            setTimeout(() => bat.remove(), 800);
        }
    }

    // 4. Navigation Controller
    function navigate(pageId) {
        if (pageId === 'add') {
            showModal('SYSTEM ERROR', 'UNAUTHORIZED ACCESS. Vengeance protocol requires physical keycard to upload evidence.');
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

    // 5. Global Click Listener
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.nav-item, .nav-btn, .action-trigger, .story-circle, .red-btn');
        if (!trigger) return;

        // Visual Feedback
        spawnBlackBats(e.clientX, e.clientY, 8);

        // Routing
        if (trigger.dataset.page) {
            navigate(trigger.dataset.page);
        }

        // Specific Button Logic
        if (trigger.classList.contains('like-btn')) {
            const heart = trigger.querySelector('i');
            const metrics = trigger.closest('.intel-card').querySelector('.metrics');
            let count = parseInt(metrics.innerText.replace(/,/g, ''));

            if (heart.classList.contains('far')) {
                heart.className = 'fas fa-heart';
                heart.style.color = '#e61919';
                metrics.innerText = (count + 1).toLocaleString() + ' SCANNED';
                trigger.style.transform = 'scale(1.5)';
                setTimeout(() => trigger.style.transform = '', 150);
            } else {
                heart.className = 'far fa-heart';
                heart.style.color = '';
                metrics.innerText = (count - 1).toLocaleString() + ' SCANNED';
            }
        }

        if (trigger.classList.contains('save-btn')) {
            const icon = trigger.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
            if (icon.classList.contains('fas')) icon.style.color = '#e61919';
            else icon.style.color = '';
        }

        if (trigger.classList.contains('comment-btn')) {
            showModal('COMMS CHANNEL', 'Line secure. Oracle is monitoring the signal. Data transmission restricted.');
        }

        if (trigger.classList.contains('red-btn')) {
            showModal('IDENTITY SECURED', 'User data is locked behind Wayne Terminals. Access denied.');
        }
    });

    // 6. UI Utils
    window.showModal = (title, body) => {
        if (modalTitle) modalTitle.innerText = title;
        if (modalBody) modalBody.innerText = body;
        modal.classList.add('visible');
    };

    window.closeModal = () => {
        modal.classList.remove('visible');
    };

    window.viewStory = (user) => {
        showModal('LIVE FEED', `Establishing connection to Sector 4... Target: ${user}. Signal weak, monitoring...`);
    };

    // Close on background click
    modal.onclick = (e) => { if (e.target === modal) closeModal(); };

    console.log('--- VENGEANCE OS ONLINE ---');
});
