// ============================================================================
// 🔐 auth.js — Funcții de autentificare pentru client (toate paginile)
// ============================================================================
//
// Acest fișier gestionează:
//   - Verificarea stării de autentificare
//   - Sincronizarea automată a progresului cu serverul
//   - Afișarea butonului Login / Profil în navbar
//
// Se include pe TOATE paginile, similar cu script.js
//
// ============================================================================

(function initAuth() {

    // ============================================================================
    // VERIFICARE AUTENTIFICARE — adaugă buton Login/Profil în navbar
    // ============================================================================

    async function checkAuthState() {
        try {
            const res = await fetch('/api/me');
            if (res.ok) {
                const data = await res.json();
                updateNavbarAuth(data.user);
                // Auto-sync progress la fiecare încărcare de pagină
                autoSyncProgress();
            } else {
                updateNavbarAuth(null);
            }
        } catch (err) {
            // Server not running or CORS — silently ignore
            updateNavbarAuth(null);
        }
    }

    function updateNavbarAuth(user) {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        // Găsim wrapper-ul din dreapta (unde sunt theme toggle și hamburger)
        const rightControls = navbar.querySelector('div[style*="display:flex"]') ||
            navbar.querySelector('div[style*="display: flex"]');

        if (!rightControls) return;

        // Verificăm dacă butonul auth există deja
        if (document.getElementById('authNavBtn')) return;

        const authBtn = document.createElement('a');
        authBtn.id = 'authNavBtn';
        authBtn.href = 'login.html';
        authBtn.style.cssText = 'display:flex;align-items:center;gap:6px;padding:6px 14px;border-radius:10px;font-size:0.85rem;font-weight:600;text-decoration:none;transition:all 0.3s ease;cursor:pointer;white-space:nowrap;';

        if (user) {
            // User logat — afișăm avatar + username  
            authBtn.innerHTML = `<span style="width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#00d2ff,#533483);display:flex;align-items:center;justify-content:center;font-size:0.75rem;color:white;font-weight:700;">${user.username.charAt(0).toUpperCase()}</span> ${user.username}`;
            authBtn.style.color = 'var(--accent-4)';
            authBtn.style.border = '1px solid rgba(0, 210, 255, 0.3)';
            authBtn.style.background = 'rgba(0, 210, 255, 0.08)';
        } else {
            // Nu e logat — afișăm buton Login
            authBtn.innerHTML = '🔑 Login';
            authBtn.style.color = 'var(--text-secondary)';
            authBtn.style.border = '1px solid var(--border)';
            authBtn.style.background = 'rgba(255,255,255,0.04)';
        }

        authBtn.addEventListener('mouseenter', () => {
            authBtn.style.transform = 'translateY(-1px)';
            if (user) {
                authBtn.style.background = 'rgba(0, 210, 255, 0.15)';
            } else {
                authBtn.style.background = 'rgba(255,255,255,0.08)';
            }
        });

        authBtn.addEventListener('mouseleave', () => {
            authBtn.style.transform = 'translateY(0)';
            if (user) {
                authBtn.style.background = 'rgba(0, 210, 255, 0.08)';
            } else {
                authBtn.style.background = 'rgba(255,255,255,0.04)';
            }
        });

        // Inserăm ÎNAINTE de theme toggle (primul copil al rightControls)
        rightControls.insertBefore(authBtn, rightControls.firstChild);
    }

    // ============================================================================
    // AUTO-SYNC PROGRES — salvează automat progresul pe server
    // ============================================================================

    async function autoSyncProgress() {
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
        } catch (err) {
            // Silently fail — maybe server is not running
        }
    }

    // Rulăm verificarea
    // Mic delay pentru a lăsa navbar-ul să se inițializeze complet
    setTimeout(checkAuthState, 300);
})();
