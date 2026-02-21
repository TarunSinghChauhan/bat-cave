document.addEventListener('DOMContentLoaded', () => {
    // 1. Elements
    const splash = document.getElementById('splash-screen');
    const swarmHost = document.getElementById('bat-swarm-host');
    const pages = document.querySelectorAll('.page');
    const modal = document.getElementById('app-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    // 2. Cinematic Splash Logic
    setTimeout(() => {
        splash.classList.add('hidden');
        setTimeout(() => splash.remove(), 1000);
    }, 2800);

    // 3. Black Bat Spawn Engine (THE BATMAN 2022 STYLE)
    function spawnBlackBats(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            const bat = document.createElement('div');
            bat.className = 'bat-particle anim-bat';

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

    // 4. Global Click Listener for App Persistence
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.nav-item, .nav-btn, .action-btn, .action-cave-btn, .story-hex');
        if (!trigger) return;

        // Visual Feedback
        spawnBlackBats(e.clientX, e.clientY, 8);

        // Routing Logic
        if (trigger.dataset.page) {
            const pageId = trigger.dataset.page;

            if (pageId === 'add') {
                showModal('SECURE TRANSMISSION', 'Initializing link to Sector 4. Evidence upload requires Wayne Enterprises authorization.');
                return;
            }

            if (pageId === 'messages') {
                showModal('ENCRYPTED COMMS', 'Opening encrypted frequency... No new messages from Justice League.');
                return;
            }

            // Normal Navigation
            pages.forEach(p => p.classList.remove('active'));
            const target = document.getElementById(`page-${pageId}`);
            if (target) {
                target.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'instant' });
            }

            // Sync Header Navigation
            document.querySelectorAll('.nav-item').forEach(item => {
                if (item.dataset.page === pageId) item.classList.add('active');
                else item.classList.remove('active');
            });
        }

        // Action Logic (Likes, etc.)
        if (trigger.classList.contains('like-btn')) {
            const icon = trigger;
            const card = trigger.closest('.bat-card');
            const metrics = card.querySelector('.like-metrics');
            let count = parseInt(metrics.innerText.replace(/,/g, ''));

            if (icon.classList.contains('far')) {
                icon.className = 'fas fa-heart action-btn';
                icon.style.color = '#cc0000';
                metrics.innerText = (count + 1).toLocaleString() + ' SCANNED';
                trigger.style.transform = 'scale(1.4)';
                setTimeout(() => trigger.style.transform = '', 150);
            } else {
                icon.className = 'far fa-heart action-btn';
                icon.style.color = '';
                metrics.innerText = (count - 1).toLocaleString() + ' SCANNED';
            }
        }

        if (trigger.classList.contains('save-btn')) {
            trigger.classList.toggle('far');
            trigger.classList.toggle('fas');
            if (trigger.classList.contains('fas')) trigger.style.color = '#cc0000';
            else trigger.style.color = '';
        }

        if (trigger.classList.contains('action-cave-btn')) {
            showModal('SECURITY PROTOCOL', 'User profile locked by Oracle. Identity modification currently suspended.');
        }
    });

    // 5. UI Utilities
    window.showModal = (title, body) => {
        modalTitle.innerText = title;
        modalBody.innerText = body;
        modal.classList.add('active');
    };

    window.closeModal = () => {
        modal.classList.remove('active');
    };

    window.viewStory = (name) => {
        const storyImgWrap = document.getElementById('story-image-container');
        const storyImg = document.getElementById('story-img');

        // Reset
        storyImgWrap.classList.add('hidden');
        storyImg.src = '';

        let msg = `Establishing secure uplink to Sector 7... Scanning for ${name}. [STABLE]`;
        let imgUrl = '';

        if (name === 'WAYNE') {
            msg = "INTEL RETRIEVED: Wayne Manor secure. Thermal scans indicate no intruders.";
            imgUrl = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1000";
        } else if (name === 'KYLE') {
            msg = "INTEL RETRIEVED: Tactical asset 'Batmobile' located in lower parking level.";
            imgUrl = "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1000";
        }

        if (imgUrl) {
            storyImg.src = imgUrl;
            storyImgWrap.classList.remove('hidden');
        }

        showModal(name + ' INTEL', msg);
    };

    // Outside click
    modal.onclick = (e) => { if (e.target === modal) closeModal(); };

    console.log('--- BAT CAVE OS ONLINE ---');
});
