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

        // Story Routing
        if (trigger.dataset.story) {
            viewStory(trigger.dataset.story);
            return;
        }

        // Routing Logic
        if (trigger.dataset.page) {
            const pageId = trigger.dataset.page;

            if (pageId === 'add') {
                document.getElementById('bat-upload-input').click();
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
        const storyImgWrap = document.getElementById('story-image-container');
        if (storyImgWrap) storyImgWrap.classList.add('hidden'); // Default hide

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

        let msg = `Establishing secure uplink to Sector 7... Scanning for ${name}. [STABLE]`;
        let imgUrl = '';

        if (name === 'BRUCE') {
            msg = "MISSION INTEL: Subject 'Bruce' is currently active in Sector 4. Vigilance required.";
            imgUrl = "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&q=80&w=1000";
        } else if (name === 'WAYNE') {
            msg = "INTEL RETRIEVED: Wayne Manor secure. Thermal scans indicate no intruders.";
            imgUrl = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1000";
        } else if (name === 'KYLE') {
            msg = "INTEL RETRIEVED: Tactical asset 'Batmobile' located in lower parking level.";
            imgUrl = "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1000";
        } else if (name === 'GORDON') {
            msg = "INTEL RETRIEVED: Commissioner Gordon at GCPD. Bat-signal status: STANDBY.";
            imgUrl = "https://images.unsplash.com/photo-1496715976403-7e3b942f122b?auto=format&fit=crop&q=80&w=1000";
        } else if (name === 'ALFRED') {
            msg = "INTEL RETRIEVED: Alfred in the Batcave. Medical supplies and tech updates ready.";
            imgUrl = "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=1000";
        }

        // Show modal first (which hides old image by default)
        showModal(name + ' INTEL', msg);

        // Show new image if it exists
        if (imgUrl && storyImg && storyImgWrap) {
            storyImg.src = imgUrl;
            storyImgWrap.classList.remove('hidden');
        }
    };

    // 6. Search & Upload Logic
    const searchInput = document.querySelector('.search-box input');
    const exploreGrid = document.querySelector('#page-explore .intel-grid');
    const uploadInput = document.getElementById('bat-upload-input');
    const filterChips = document.querySelectorAll('.filter-chip');
    const originalExplore = exploreGrid ? exploreGrid.innerHTML : '';

    const intelCollections = {
        all: originalExplore,
        cars: `
            <img src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=400">
            <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=400">
            <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400">
            <img src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=400">
            <img src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=400">
            <img src="https://images.unsplash.com/photo-1542362567-b052d022df42?auto=format&fit=crop&q=80&w=400">
        `,
        threats: `
            <img src="https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=400">
            <img src="https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&q=80&w=400">
            <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400">
            <img src="https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&q=80&w=400">
            <img src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=400">
            <img src="https://images.unsplash.com/photo-1533972751724-9b3b0fb1accb?auto=format&fit=crop&q=80&w=400">
        `,
        gotham: `
            <img src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=400">
            <img src="https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&q=80&w=400">
            <img src="https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&q=80&w=400">
            <img src="https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=400">
            <img src="https://images.unsplash.com/photo-1542125387-c71274d94f0a?auto=format&fit=crop&q=80&w=400">
            <img src="https://images.unsplash.com/photo-1533972751724-9b3b0fb1accb?auto=format&fit=crop&q=80&w=400">
        `
    };

    function updateIntelGrid(category) {
        if (!exploreGrid) return;
        exploreGrid.innerHTML = intelCollections[category] || intelCollections.all;

        filterChips.forEach(c => {
            if (c.dataset.filter === category) c.classList.add('active');
            else c.classList.remove('active');
        });
    }

    if (searchInput && exploreGrid) {
        searchInput.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase();
            if (val.includes('car')) updateIntelGrid('cars');
            else if (val.includes('joker') || val.includes('threat')) updateIntelGrid('threats');
            else if (val.includes('city') || val.includes('gotham')) updateIntelGrid('gotham');
            else if (val === '') updateIntelGrid('all');
        });
    }

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => updateIntelGrid(chip.dataset.filter));
    });

    if (uploadInput) {
        uploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const postContent = document.querySelector('.feed-content');
                    const newPost = document.createElement('div');
                    newPost.className = 'bat-card';
                    newPost.innerHTML = `
                        <div class="card-top">
                            <div class="card-user">
                                <img src="https://i.pravatar.cc/150?u=bruce">
                                <span>YOU (ENCRYPTED)</span>
                            </div>
                            <i class="fas fa-ellipsis-v"></i>
                        </div>
                        <div class="card-media">
                            <img src="${event.target.result}">
                            <div class="red-distort"></div>
                        </div>
                        <div class="card-actions">
                            <div class="left-btns">
                                <i class="far fa-heart action-btn like-btn"></i>
                                <i class="far fa-comment action-btn"></i>
                                <i class="far fa-paper-plane action-btn"></i>
                            </div>
                            <i class="far fa-bookmark action-btn save-btn"></i>
                        </div>
                        <div class="card-info">
                            <span class="like-metrics">0 SCANNED</span>
                            <p><strong>YOU:</strong> Uploading local intel to Bat-Computer. #Vengeance</p>
                            <span class="time-stamp">JUST NOW</span>
                        </div>
                    `;
                    postContent.prepend(newPost);
                    showModal('UPLINK SUCCESS', 'Local intel has been encrypted and integrated into the global feed. Identity masked.');
                    document.querySelector('.nav-item[data-page="feed"]').click();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                };
                reader.readAsDataURL(file);
            }
        });
    }

    console.log('--- BAT CAVE OS ONLINE ---');
});
