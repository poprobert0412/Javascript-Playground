// ============================================================================
// 🖥️ console-challenges.js — Detection Logic for Console Challenges
// ============================================================================
// Uses MutationObserver + polling to detect when users execute commands
// from the browser console to manipulate the page.

(function initConsoleChallenges() {
    // Track completion
    var completed = {};
    var totalTasks = 9;

    // --- Task detection functions ---
    var checks = {
        1: function () {
            var el = document.getElementById('task1-check');
            return el && el.checked === true;
        },
        2: function () {
            var el = document.getElementById('task2-text');
            return el && el.textContent !== 'Schimbă-mă din consolă!';
        },
        3: function () {
            var el = document.getElementById('task3-box');
            return el && el.classList.contains('active');
        },
        4: function () {
            var el = document.getElementById('task4-box');
            return el && el.style.background && el.style.background !== '';
        },
        5: function () {
            var el = document.getElementById('task5-btn');
            return el && el.textContent !== 'Apasă-mă (după ce adaugi listener)';
        },
        6: function () {
            var el = document.getElementById('task6-container');
            return el && el.children.length > 1;
        },
        7: function () {
            var el = document.getElementById('task7-input');
            return el && el.getAttribute('placeholder') !== 'Placeholder original...';
        },
        8: function () {
            var el = document.getElementById('task8-container');
            if (!el) return false;
            var span = el.querySelector('span');
            // Original has a span with "Conținut HTML..." — if innerHTML changed, it's different
            return el.innerHTML.indexOf('Conți') === -1 && el.innerHTML.trim() !== '';
        },
        9: function () {
            var el = document.getElementById('task9-target');
            return el === null; // Element was removed
        }
    };

    // --- Mark a task as completed ---
    function markCompleted(taskNum) {
        if (completed[taskNum]) return;
        completed[taskNum] = true;

        var taskCard = document.getElementById('task' + taskNum);
        var statusEl = document.getElementById('task' + taskNum + '-status');
        var playground = taskCard ? taskCard.querySelector('.cc-playground') : null;

        if (taskCard) taskCard.classList.add('completed');
        if (statusEl) {
            statusEl.className = 'cc-status done';
            statusEl.textContent = '✅ Completat!';
        }
        if (playground) playground.classList.add('active-state');

        // Sound effect
        if (window.SoundFX) window.SoundFX.play('correct');

        updateProgress();
    }

    // --- Update progress bar and check milestones ---
    function updateProgress() {
        var count = Object.keys(completed).length;
        var fill = document.getElementById('progressFill');
        var countEl = document.getElementById('completedCount');

        if (fill) fill.style.width = (count / totalTasks * 100) + '%';
        if (countEl) countEl.textContent = count;

        // Milestone 3
        if (count === 3) {
            showMilestone('milestone3');
            if (window.launchConfetti) window.launchConfetti();
        }
        // Milestone 6
        if (count === 6) {
            showMilestone('milestone6');
            if (window.SoundFX) window.SoundFX.play('correct');
            pulseBackground();
        }
        // Milestone 9 — ALL DONE!
        if (count === 9) {
            showMilestone('milestone9');
            if (window.launchConfetti) {
                window.launchConfetti();
                setTimeout(function () { window.launchConfetti(); }, 1000);
                setTimeout(function () { window.launchConfetti(); }, 2000);
            }
            // Track achievement
            if (typeof JSProgress !== 'undefined') {
                JSProgress.markDone('challenges', 'console-master');
            }
        }

        // Track individual challenges
        if (typeof JSProgress !== 'undefined') {
            Object.keys(completed).forEach(function (key) {
                JSProgress.markDone('challenges', 'console-task-' + key);
            });
        }
    }

    function showMilestone(id) {
        var el = document.getElementById(id);
        if (el) el.classList.add('show');
    }

    function pulseBackground() {
        document.body.style.transition = 'background 0.5s ease';
        document.body.style.background = 'rgba(0, 230, 118, 0.05)';
        setTimeout(function () {
            document.body.style.background = '';
        }, 1000);
    }

    // --- Polling: check all tasks every 500ms ---
    function pollTasks() {
        for (var i = 1; i <= totalTasks; i++) {
            if (!completed[i] && checks[i] && checks[i]()) {
                markCompleted(i);
            }
        }
    }

    // --- MutationObserver for instant detection ---
    function setupObservers() {
        var config = { childList: true, subtree: true, attributes: true, characterData: true };

        var observer = new MutationObserver(function () {
            pollTasks();
        });

        var main = document.querySelector('main');
        if (main) {
            observer.observe(main, config);
        }
    }

    // --- Init ---
    function init() {
        setupObservers();
        // Also poll as fallback (catches property changes MutationObserver misses)
        setInterval(pollTasks, 500);

        // Welcome message in console
        console.log('%c🖥️ Console Challenges — JS Playground', 'color: #00d2ff; font-size: 18px; font-weight: bold;');
        console.log('%c📋 9 task-uri de completat! Scrie comenzile de pe pagină aici.', 'color: #a0a0b0; font-size: 13px;');
        console.log('%cÎncepe cu: document.querySelector(\'#task1-check\').checked = true;', 'color: #98c379; font-size: 12px; font-family: monospace;');
        console.log('');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
