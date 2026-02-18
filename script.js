document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const particleContainer = document.getElementById('bat-particle-container');
    const modal = document.getElementById('app-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const pages = document.querySelectorAll('.page');
    const navItems = document.querySelectorAll('.nav-item, .nav-btn');

    // 1. Splash Screen & Initialization
    setTimeout(() => {
        splashScreen.classList.add('fade-out');
        setTimeout(() => splashScreen.remove(), 600);
    }, 2500);

    // 2. Navigation Control (Multi-page Logic)
    function switchPage(pageId) {
        if (!pageId || pageId === 'add') {
            if (pageId === 'add') showModal('SECURE UPLOAD', 'Accessing Bat-Computer... Encryption protocol required to upload evidence.');
            return;
        }

        pages.forEach(p => p.classList.remove('active'));
        const targetPage = document.getElementById(`page-${pageId}`);
        if (targetPage) {
            targetPage.classList.add('active');
            window.scrollTo(0, 0);
        }

        // Update active state in bottom nav
        document.querySelectorAll('.nav-item').forEach(item => {
            if (item.dataset.page === pageId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // 3. Bat Particle Animation
    function triggerBats(x, y) {
        const count = 8;
        for (let i = 0; i < count; i++) {
            const bat = document.createElement('div');
            bat.className = 'bat-particle animate-bat';

            // Random flight path
            const tx = (Math.random() - 0.5) * 400;
            const ty = (Math.random() - 0.5) * 400 - 50;
            const tr = (Math.random() - 0.5) * 720;

            bat.style.setProperty('--tx', `${tx}px`);
            bat.style.setProperty('--ty', `${ty}px`);
            bat.style.setProperty('--tr', `${tr}deg`);

            bat.style.left = `${x}px`;
            bat.style.top = `${y}px`;

            particleContainer.appendChild(bat);
            setTimeout(() => bat.remove(), 1000);
        }
    }

    // 4. Global Click Listener for Buttons
    document.addEventListener('click', (e) => {
        const target = e.target.closest('.nav-item, .nav-btn, .action-btn, .edit-btn, .story-item');
        if (!target) return;

        // Visual feedback
        triggerBats(e.clientX, e.clientY);

        // Handle navigation
        if (target.dataset.page) {
            switchPage(target.dataset.page);
        }

        // Handle Likes
        if (target.classList.contains('like-btn')) {
            const isLiked = target.classList.toggle('fas');
            target.classList.toggle('far');
            target.classList.toggle('liked');

            const card = target.closest('.post-card');
            const likesCount = card.querySelector('.likes-count');
            let count = parseInt(likesCount.innerText.replace(/,/g, ''));

            if (isLiked) {
                likesCount.innerText = (count + 1).toLocaleString() + ' likes';
                target.style.transform = 'scale(1.3)';
                setTimeout(() => target.style.transform = '', 200);
            } else {
                likesCount.innerText = (count - 1).toLocaleString() + ' likes';
            }
        }

        // Handle Save
        if (target.classList.contains('save-btn')) {
            target.classList.toggle('fas');
            target.classList.toggle('far');
        }

        // Generic interactions
        if (target.classList.contains('comment-btn')) {
            showModal('COMMS', 'Securing line... Sector 7 is quiet tonight.');
        }

        if (target.classList.contains('edit-btn')) {
            showModal('ENCRYPTION', 'Identity verification required. Access denied by Oracle.');
        }
    });

    // 5. Modal Logic
    window.showModal = (title, body) => {
        modalTitle.innerText = title;
        modalBody.innerText = body;
        modal.classList.add('active');
    };

    window.closeModal = () => {
        modal.classList.remove('active');
    };

    window.viewStory = (name) => {
        showModal('LIVE INTEL', `Establishing secure link to ${name}'s location...`);
    };

    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    console.log('BAT-CAVE OS v2.0 Initialized.');
});
