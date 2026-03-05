(function initAuth() {

    let currentUser = null;

    async function checkAuthState() {
        try {
            const res = await fetch('/api/me');
            if (res.ok) {
                const data = await res.json();
                currentUser = data.user;
                updateNavbarAuth(currentUser);
                await loadServerProgress();
                hookProgressSync();
            } else {
                currentUser = null;
                updateNavbarAuth(null);
            }
        } catch (err) {
            currentUser = null;
            updateNavbarAuth(null);
        }
    }

    function updateNavbarAuth(user) {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        const rightControls = navbar.querySelector('div[style*="display:flex"]') ||
            navbar.querySelector('div[style*="display: flex"]');
        if (!rightControls) return;
        if (document.getElementById('authNavBtn')) return;

        const authBtn = document.createElement('a');
        authBtn.id = 'authNavBtn';
        authBtn.href = 'login.html';
        authBtn.style.cssText = 'display:flex;align-items:center;gap:6px;padding:6px 14px;border-radius:10px;font-size:0.85rem;font-weight:600;text-decoration:none;transition:all 0.3s ease;cursor:pointer;white-space:nowrap;';

        if (user) {
            const avatarHTML = user.avatar_url
                ? `<img src="${user.avatar_url}" style="width:26px;height:26px;border-radius:50%;object-fit:cover;">`
                : `<span style="width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#00d2ff,#533483);display:flex;align-items:center;justify-content:center;font-size:0.75rem;color:white;font-weight:700;">${user.username.charAt(0).toUpperCase()}</span>`;
            authBtn.innerHTML = `${avatarHTML} ${user.username}`;
            authBtn.style.color = 'var(--accent-4)';
            authBtn.style.border = '1px solid rgba(0, 210, 255, 0.3)';
            authBtn.style.background = 'rgba(0, 210, 255, 0.08)';
        } else {
            authBtn.innerHTML = '🔑 Login';
            authBtn.style.color = 'var(--text-secondary)';
            authBtn.style.border = '1px solid var(--border)';
            authBtn.style.background = 'rgba(255,255,255,0.04)';
        }

        authBtn.addEventListener('mouseenter', () => {
            authBtn.style.transform = 'translateY(-1px)';
            authBtn.style.background = user ? 'rgba(0, 210, 255, 0.15)' : 'rgba(255,255,255,0.08)';
        });
        authBtn.addEventListener('mouseleave', () => {
            authBtn.style.transform = 'translateY(0)';
            authBtn.style.background = user ? 'rgba(0, 210, 255, 0.08)' : 'rgba(255,255,255,0.04)';
        });

        rightControls.insertBefore(authBtn, rightControls.firstChild);
    }

    async function loadServerProgress() {
        if (!currentUser) return;
        try {
            const res = await fetch('/api/progress');
            if (!res.ok) return;
            const { progress } = await res.json();
            if (progress && typeof progress === 'object') {
                Object.keys(progress).forEach(key => {
                    const localVal = localStorage.getItem(key);
                    if (!localVal) {
                        localStorage.setItem(key, progress[key]);
                    } else {
                        try {
                            const serverData = JSON.parse(progress[key]);
                            const localData = JSON.parse(localVal);
                            if (typeof serverData === 'object' && typeof localData === 'object' &&
                                !Array.isArray(serverData) && !Array.isArray(localData)) {
                                const merged = { ...serverData };
                                Object.keys(localData).forEach(k => {
                                    if (Array.isArray(localData[k]) && Array.isArray(merged[k])) {
                                        merged[k] = [...new Set([...merged[k], ...localData[k]])];
                                    } else {
                                        merged[k] = localData[k];
                                    }
                                });
                                localStorage.setItem(key, JSON.stringify(merged));
                            }
                        } catch (e) { }
                    }
                });
            }
        } catch (err) { }
    }

    let syncTimeout = null;

    function syncProgressToServer() {
        if (!currentUser) return;
        clearTimeout(syncTimeout);
        syncTimeout = setTimeout(async () => {
            try {
                const progress = {};
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('js-playground-')) {
                        progress[key] = localStorage.getItem(key);
                    }
                }
                if (Object.keys(progress).length > 0) {
                    await fetch('/api/progress', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ progress })
                    });
                }
            } catch (err) { }
        }, 2000);
    }

    function hookProgressSync() {
        if (!currentUser) return;
        const origSetItem = localStorage.setItem.bind(localStorage);
        localStorage.setItem = function (key, value) {
            origSetItem(key, value);
            if (key && key.startsWith('js-playground-')) {
                syncProgressToServer();
            }
        };
    }

    window.JSAuth = {
        getUser: () => currentUser,
        isLoggedIn: () => !!currentUser,
        syncNow: syncProgressToServer,
    };

    setTimeout(checkAuthState, 300);
})();
