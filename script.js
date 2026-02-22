document.addEventListener('DOMContentLoaded', () => {
    // 1. Elements
    const splash = document.getElementById('splash-screen');
    const swarmHost = document.getElementById('bat-swarm-host');
    const pages = document.querySelectorAll('.page');
    const modal = document.getElementById('app-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const commentActionContainer = document.getElementById('comment-action-container');

    // 2. Data
    const intelDatabase = [
        { url: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=400", tags: ['joker', 'threat', 'villain', 'clown'] },
        { url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=400", tags: ['gotham', 'city', 'night', 'skyline'] },
        { url: "https://images.unsplash.com/photo-1533972751724-9b3b0fb1accb?auto=format&fit=crop&q=80&w=400", tags: ['batman', 'bruce', 'vigilante'] },
        { url: "https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&q=80&w=400", tags: ['gotham', 'castle', 'building', 'manor'] },
        { url: "https://images.unsplash.com/photo-1542125387-c71274d94f0a?auto=format&fit=crop&q=80&w=400", tags: ['wayne', 'manor', 'house'] },
        { url: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&q=80&w=400", tags: ['city', 'dark', 'gotham'] },
        { url: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=400", tags: ['car', 'batmobile', 'vehicle', 'mobile'] },
        { url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=400", tags: ['car', 'black', 'sport'] },
        { url: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&q=80&w=400", tags: ['batman', 'armor', 'tactical'] }
    ];

    // Assign dynamic IDs to cards for comment tracking
    document.querySelectorAll('.bat-card').forEach((card, idx) => {
        card.setAttribute('data-id', 'post-' + idx);
    });

    // 2. Cinematic Splash Logic
    setTimeout(() => {
        if (splash) {
            splash.classList.add('hidden');
            setTimeout(() => splash.remove(), 1000);
        }
    }, 2800);

    // 3. Black Bat Spawn Engine
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
        const trigger = e.target.closest('.nav-item, .nav-btn, .action-btn, .action-cave-btn, .story-hex, .comment-submit');
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
            pages.forEach(p => p.classList.remove('active'));
            const target = document.getElementById(`page-${pageId}`);
            if (target) {
                target.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'instant' });
            }
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
            if (icon.classList.contains('far')) {
                icon.className = 'fas fa-heart action-btn heart-active';
                metrics.classList.add('revealed');
            } else {
                icon.className = 'far fa-heart action-btn';
                metrics.classList.remove('revealed');
            }
        }

        if (trigger.classList.contains('fa-comment')) {
            const card = trigger.closest('.bat-card');
            const postId = card.getAttribute('data-id');
            const username = card.querySelector('.card-user span').innerText;

            showModal('POST UPLINK: ' + username, 'Type your secure transmission below:');

            commentActionContainer.innerHTML = `
                <div class="comment-area">
                    <input type="text" class="comment-input" placeholder="Enter intel..." id="modal-comment-input">
                    <button class="comment-submit" data-post-id="${postId}">TRANSMIT</button>
                </div>
            `;
            commentActionContainer.classList.remove('hidden');
        }

        if (trigger.classList.contains('comment-submit')) {
            const postId = trigger.getAttribute('data-post-id');
            const input = document.getElementById('modal-comment-input');
            const val = input.value.trim();

            if (val) {
                const targetCard = document.querySelector(`.bat-card[data-id="${postId}"]`);
                const infoArea = targetCard.querySelector('.card-info');
                const commentEl = document.createElement('span');
                commentEl.className = 'comment-line';
                commentEl.innerHTML = `<strong>YOU:</strong> ${val}`;
                infoArea.appendChild(commentEl);

                showModal('TRANSMISSION SUCCESS', 'Intel appended to post directory.');
                commentActionContainer.classList.add('hidden');
            }
        }

        if (trigger.classList.contains('fa-paper-plane')) {
            const username = trigger.closest('.bat-card').querySelector('.card-user span').innerText;
            showModal('TRANSMITTING INTEL', `Initializing encrypted downlink... Intel from ${username} has been shared. [STABLE]`);
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
        if (storyImgWrap) storyImgWrap.classList.add('hidden');
        commentActionContainer.classList.add('hidden');

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
        let msg = `Scanning for ${name}...`;
        let imgUrl = "";

        if (name === 'BRUCE') {
            msg = "MISSION INTEL: Subject is active in Sector 4.";
            imgUrl = "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&q=80&w=1000";
        } else if (name === 'WAYNE') {
            msg = "INTEL: Wayne Manor thermal scan clear.";
            imgUrl = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1000";
        } else if (name === 'KYLE') {
            msg = "INTEL: Batmobile located.";
            imgUrl = "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1000";
        } else if (name === 'GORDON') {
            msg = "INTEL: Commissioner Gordon at GCPD.";
            imgUrl = "https://images.unsplash.com/photo-1496715976403-7e3b942f122b?auto=format&fit=crop&q=80&w=1000";
        } else if (name === 'ALFRED') {
            msg = "INTEL: Alfred in Batcave.";
            imgUrl = "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=1000";
        }

        showModal(name + ' INTEL', msg);
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

    function updateIntelGrid(query) {
        if (!exploreGrid) return;

        const filtered = query === 'all' || query === ''
            ? intelDatabase
            : intelDatabase.filter(item => item.tags.some(tag => tag.includes(query.toLowerCase())));

        if (filtered.length > 0) {
            exploreGrid.innerHTML = filtered.map(item => `<img src="${item.url}" alt="Intel">`).join('');
        } else {
            exploreGrid.innerHTML = `<div style="grid-column: 1/4; padding: 40px; text-align: center; color: var(--bat-red);">[SCAN ERROR]: NO MATCHING SIGNATURES FOUND</div>`;
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => updateIntelGrid(e.target.value));
    }

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            updateIntelGrid(chip.dataset.filter === 'all' ? '' : chip.dataset.filter);
        });
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
                    newPost.setAttribute('data-id', 'post-custom-' + Date.now());
                    newPost.innerHTML = `
                        <div class="card-top"><div class="card-user"><img src="https://i.pravatar.cc/150?u=bruce"><span>YOU</span></div></div>
                        <div class="card-media"><img src="${event.target.result}"><div class="red-distort"></div></div>
                        <div class="card-actions">
                            <div class="left-btns"><i class="far fa-heart action-btn like-btn"></i><i class="far fa-comment action-btn"></i></div>
                        </div>
                        <div class="card-info"><span class="like-metrics">0 SCANNED</span><p><strong>YOU:</strong> Manual Uplink. #Vengeance</p></div>
                    `;
                    postContent.prepend(newPost);
                    showModal('UPLINK SUCCESS', 'Intel integrated into feed.');
                    document.querySelector('.nav-item[data-page="feed"]').click();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    console.log('--- BAT CAVE OS ONLINE ---');
});
