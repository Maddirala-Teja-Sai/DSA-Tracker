/* ═══════════════════════════════════════════════════════
   DSA Study Tracker — App Logic
   ═══════════════════════════════════════════════════════ */
(function () {
  "use strict";

  // ─── State ───
  const STORAGE_KEYS = {
    solved: "dsa_solved",
    starred: "dsa_starred",
    notes: "dsa_notes",
    custom: "dsa_custom",
    activity: "dsa_activity",
    solvedDates: "dsa_solved_dates",
  };

  let allQuestions = [...DEFAULT_QUESTIONS];
  let solvedSet = new Set();
  let starredSet = new Set();
  let notesMap = {};
  let activityMap = {};  // { "YYYY-MM-DD": count }
  let solvedDatesMap = {}; // { [questionId]: "YYYY-MM-DD" }
  let completedCategories = new Set();
  let completedPatterns = new Set();

  let currentLevel = "all";
  let currentStatus = "all";
  let currentPlatform = "all";
  let currentFreq = "all";
  let searchQuery = "";
  let currentView = localStorage.getItem("dsa_view_mode") || "category"; // "category" | "pattern"
  let currentBreakdown = "category"; // "category" | "pattern"

  let currentUser = null;
  let syncTimer = null;
  let googleClientId = "";
  let hasDbConnection = false;
  let authMode = "login"; // "login" | "signup"

  // ─── 9 Core Algorithm & Pattern Lists ───
  const ALGORITHM_PATTERNS = [
    {
      name: "Hashing",
      icon: "#️⃣",
      match: (q) => (q.category && q.category.toLowerCase().includes("hash")) ||
                    (q.topics || []).some(t => t.toLowerCase().includes("hash")),
    },
    {
      name: "Sliding Window",
      icon: "🪟",
      match: (q) => (q.category && q.category.toLowerCase().includes("sliding window")) ||
                    (q.topics || []).some(t => t.toLowerCase().includes("sliding window")),
    },
    {
      name: "Binary Search",
      icon: "🔍",
      match: (q) => (q.category && q.category.toLowerCase().includes("binary search")) ||
                    (q.topics || []).some(t => t.toLowerCase().includes("binary search")),
    },
    {
      name: "Two Pointers",
      icon: "👉👈",
      match: (q) => (q.category && q.category.toLowerCase().includes("two pointer")) ||
                    (q.topics || []).some(t => t.toLowerCase().includes("two pointer")),
    },
    {
      name: "Recursion",
      icon: "🔄",
      match: (q) => (q.category && q.category.toLowerCase().includes("recursion")) ||
                    (q.topics || []).some(t => t.toLowerCase().includes("recursion")),
    },
    {
      name: "Backtracking",
      icon: "🔙",
      match: (q) => (q.category && q.category.toLowerCase().includes("backtracking")) ||
                    (q.topics || []).some(t => t.toLowerCase().includes("backtracking")),
    },
    {
      name: "Greedy",
      icon: "💰",
      match: (q) => (q.category && q.category.toLowerCase().includes("greedy")) ||
                    (q.topics || []).some(t => t.toLowerCase().includes("greedy")),
    },
    {
      name: "Dynamic Programming",
      icon: "🧩",
      match: (q) => (q.category && (q.category.toLowerCase().includes("dynamic programming") || q.category.toLowerCase().includes("dp"))) ||
                    (q.topics || []).some(t => {
                      const lt = t.toLowerCase();
                      return lt.includes("dynamic programming") || lt.includes("memoization") || lt.includes("dp") || lt.includes("knapsack") || lt.includes("longest common subsequence") || lt.includes("longest increasing subsequence") || lt.includes("digit dp");
                    }),
    },
    {
      name: "Sorting Algorithms",
      icon: "📊",
      match: (q) => (q.category && q.category.toLowerCase().includes("sort")) ||
                    (q.topics || []).some(t => t.toLowerCase().includes("sort")),
    },
  ];

  // ─── Init ───
  async function init() {
    loadState();
    renderDiffTabs();
    renderDiffProgress();
    renderDonut();
    renderLegend();
    renderCategoryBars();
    renderStats();
    renderHeatmap();
    updateViewSwitcherUI();
    renderQuestions();
    populateCategoryDatalist();
    bindEvents();
    await initAuth();
  }

  // ─── Persistence ───
  function loadState() {
    try {
      const customQ = JSON.parse(localStorage.getItem(STORAGE_KEYS.custom) || "[]");
      allQuestions = [...DEFAULT_QUESTIONS, ...customQ];
    } catch { allQuestions = [...DEFAULT_QUESTIONS]; }
    try { solvedSet = new Set(JSON.parse(localStorage.getItem(STORAGE_KEYS.solved) || "[]")); } catch { solvedSet = new Set(); }
    try { starredSet = new Set(JSON.parse(localStorage.getItem(STORAGE_KEYS.starred) || "[]")); } catch { starredSet = new Set(); }
    try { notesMap = JSON.parse(localStorage.getItem(STORAGE_KEYS.notes) || "{}"); } catch { notesMap = {}; }
    try { activityMap = JSON.parse(localStorage.getItem(STORAGE_KEYS.activity) || "{}"); } catch { activityMap = {}; }
    try { solvedDatesMap = JSON.parse(localStorage.getItem(STORAGE_KEYS.solvedDates) || "{}"); } catch { solvedDatesMap = {}; }

    // Reconcile solvedSet and solvedDatesMap
    const today = todayStr();
    solvedSet.forEach(id => {
      if (!solvedDatesMap[id]) {
        solvedDatesMap[id] = today;
      }
    });
    Object.keys(solvedDatesMap).forEach(id => {
      if (!solvedSet.has(id)) {
        delete solvedDatesMap[id];
      }
    });

    rebuildActivityMap();
    syncCompletedSets();
  }

  function syncCompletedSets() {
    completedCategories.clear();
    const catCounts = new Map();
    allQuestions.forEach(q => {
      if (!catCounts.has(q.category)) catCounts.set(q.category, { total: 0, solved: 0 });
      catCounts.get(q.category).total++;
      if (solvedSet.has(q.id)) catCounts.get(q.category).solved++;
    });
    for (const [name, { total, solved }] of catCounts) {
      if (total > 0 && solved === total) {
        completedCategories.add(name);
      }
    }

    completedPatterns.clear();
    ALGORITHM_PATTERNS.forEach(pat => {
      const matched = allQuestions.filter(pat.match);
      if (matched.length > 0 && matched.every(q => solvedSet.has(q.id))) {
        completedPatterns.add(pat.name);
      }
    });
  }

  function rebuildActivityMap() {
    const counts = {};
    for (const [id, date] of Object.entries(solvedDatesMap)) {
      if (solvedSet.has(id) && date) {
        counts[date] = (counts[date] || 0) + 1;
      }
    }
    // Retain historical days from activityMap if before today
    for (const [date, count] of Object.entries(activityMap)) {
      if (date < todayStr() && !counts[date] && count > 0) {
        counts[date] = count;
      }
    }
    activityMap = counts;
  }

  function saveState() {
    const customQ = allQuestions.filter(q => q.isCustom);
    localStorage.setItem(STORAGE_KEYS.custom, JSON.stringify(customQ));
    localStorage.setItem(STORAGE_KEYS.solved, JSON.stringify([...solvedSet]));
    localStorage.setItem(STORAGE_KEYS.starred, JSON.stringify([...starredSet]));
    localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notesMap));
    localStorage.setItem(STORAGE_KEYS.activity, JSON.stringify(activityMap));
    localStorage.setItem(STORAGE_KEYS.solvedDates, JSON.stringify(solvedDatesMap));

    if (currentUser) {
      scheduleCloudSync();
    }
  }

  function scheduleCloudSync() {
    setSyncBadge("syncing");
    clearTimeout(syncTimer);
    syncTimer = setTimeout(syncToCloud, 800);
  }

  async function syncToCloud() {
    if (!currentUser) return;
    try {
      const payload = {
        solved: [...solvedSet],
        starred: [...starredSet],
        notes: notesMap,
        solvedDates: solvedDatesMap,
        activity: activityMap,
        customQuestions: allQuestions.filter(q => q.isCustom),
      };
      const res = await fetch("/api/user/data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSyncBadge("synced");
      } else {
        setSyncBadge("local");
      }
    } catch (err) {
      console.warn("Cloud sync error:", err);
      setSyncBadge("local");
    }
  }

  function setSyncBadge(status) {
    const badge = document.getElementById("syncBadge");
    const text = document.getElementById("syncText");
    if (!badge || !text) return;
    badge.className = "sync-badge";
    if (status === "synced") {
      badge.classList.add("sync-badge--synced");
      text.textContent = "Synced";
    } else if (status === "syncing") {
      badge.classList.add("sync-badge--syncing");
      text.textContent = "Syncing...";
    } else {
      text.textContent = currentUser ? "Cloud" : "Local";
    }
  }

  // ─── Authentication & Cloud Persistence ───
  async function initAuth() {
    try {
      const configRes = await fetch("/api/config/auth");
      if (configRes.ok) {
        const config = await configRes.json();
        googleClientId = config.googleClientId;
        hasDbConnection = config.hasDb;
      }
    } catch (err) {
      console.warn("Auth config fetch failed:", err);
    }

    // Check existing 30-day session
    try {
      const meRes = await fetch("/api/auth/me");
      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData.user) {
          currentUser = meData.user;
          updateUserUI();
          await loadCloudData();
        }
      }
    } catch (err) {
      console.warn("Session check failed:", err);
    }

    setupGoogleAuth();
  }

  function setupGoogleAuth() {
    const googleContainer = document.getElementById("googleBtnContainer");
    const fallbackContainer = document.getElementById("googleFallbackContainer");
    if (!googleContainer || !fallbackContainer) return;

    if (window.google && window.google.accounts && window.google.accounts.id && googleClientId) {
      try {
        google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredential,
          auto_select: false,
        });
        google.accounts.id.renderButton(googleContainer, {
          theme: "outline",
          size: "large",
          width: 340,
          text: "continue_with",
          shape: "pill",
        });
        googleContainer.style.display = "flex";
        fallbackContainer.style.display = "none";
        return;
      } catch (err) {
        console.warn("Google Identity initialization error:", err);
      }
    }

    // Fallback if client ID is not configured yet or script unavailable
    googleContainer.style.display = "none";
    fallbackContainer.style.display = "block";
  }

  async function handleGoogleCredential(response) {
    try {
      showAuthError("");
      setSyncBadge("syncing");
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Google sign-in failed");
      await handleAuthSuccess(data);
    } catch (err) {
      showAuthError(err.message);
      setSyncBadge("local");
    }
  }

  async function handleAuthSuccess(data) {
    currentUser = data.user;
    updateUserUI();
    document.getElementById("authModalOverlay").classList.remove("open");
    showToast(`Welcome back, ${currentUser.name}! (30-day session active)`, "success");

    const hasLocalProgress = solvedSet.size > 0;
    if (hasLocalProgress && !data.hasCloudData) {
      // Auto-migrate local data to new cloud account
      await migrateLocalToCloud();
    } else if (hasLocalProgress && data.hasCloudData) {
      // Prompt migration
      showMigrationAlert();
    } else {
      await loadCloudData();
    }
  }

  function updateUserUI() {
    const openAuthBtn = document.getElementById("openAuthBtn");
    const userProfile = document.getElementById("userProfile");
    const userName = document.getElementById("userName");
    const userDropdownName = document.getElementById("userDropdownName");
    const userEmail = document.getElementById("userEmail");
    const userAvatar = document.getElementById("userAvatar");

    if (currentUser) {
      if (openAuthBtn) openAuthBtn.style.display = "none";
      if (userProfile) userProfile.style.display = "block";
      if (userName) userName.textContent = currentUser.name;
      if (userDropdownName) userDropdownName.textContent = currentUser.name;
      if (userEmail) userEmail.textContent = currentUser.email;
      if (userAvatar) {
        userAvatar.src = currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=6366f1&color=fff`;
      }
      setSyncBadge("synced");
    } else {
      if (openAuthBtn) openAuthBtn.style.display = "flex";
      if (userProfile) userProfile.style.display = "none";
      setSyncBadge("local");
    }
  }

  async function loadCloudData() {
    try {
      setSyncBadge("syncing");
      const res = await fetch("/api/user/data");
      if (!res.ok) return;
      const { data } = await res.json();
      if (data) {
        if (data.solved) solvedSet = new Set(data.solved);
        if (data.starred) starredSet = new Set(data.starred);
        if (data.notes) notesMap = data.notes;
        if (data.solvedDates) solvedDatesMap = data.solvedDates;
        if (data.activity) activityMap = data.activity;
        if (data.customQuestions && data.customQuestions.length > 0) {
          const customQ = data.customQuestions.map(q => ({ ...q, isCustom: true }));
          allQuestions = [...DEFAULT_QUESTIONS, ...customQ];
        }
        rebuildActivityMap();
        syncCompletedSets();
        refreshAll();
        populateCategoryDatalist();
        setSyncBadge("synced");
      }
    } catch (err) {
      console.warn("Failed to load cloud data:", err);
      setSyncBadge("local");
    }
  }

  async function migrateLocalToCloud() {
    try {
      setSyncBadge("syncing");
      const payload = {
        solved: [...solvedSet],
        starred: [...starredSet],
        notes: notesMap,
        solvedDates: solvedDatesMap,
        activity: activityMap,
        custom: allQuestions.filter(q => q.isCustom),
      };
      const res = await fetch("/api/user/sync-local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const { data } = await res.json();
        if (data) {
          if (data.solved) solvedSet = new Set(data.solved);
          if (data.starred) starredSet = new Set(data.starred);
          if (data.notes) notesMap = data.notes;
          if (data.solvedDates) solvedDatesMap = data.solvedDates;
          if (data.activity) activityMap = data.activity;
          rebuildActivityMap();
          refreshAll();
        }
        showToast("Local progress saved to cloud!", "success");
        setSyncBadge("synced");
      }
    } catch (err) {
      console.warn("Migration failed:", err);
    }
  }

  function showMigrationAlert() {
    const alert = document.getElementById("migrationAlert");
    const count = solvedSet.size;
    const text = document.getElementById("migrationText");
    if (text) text.textContent = `You have ${count} solved question(s) in this browser. Merge them into your cloud account?`;
    if (alert) alert.style.display = "flex";
  }

  function showAuthError(msg) {
    const errBox = document.getElementById("authError");
    if (!errBox) return;
    if (msg) {
      errBox.textContent = msg;
      errBox.style.display = "block";
    } else {
      errBox.style.display = "none";
    }
  }

  // ─── Helpers ───
  function todayStr() { return new Date().toISOString().slice(0, 10); }
  function getFiltered() {
    let list = allQuestions;
    // Sort by frequency descending within each group
    list = [...list].sort((a, b) => (b.frequency || 0) - (a.frequency || 0));
    if (currentLevel !== "all") list = list.filter(q => q.level === currentLevel);
    if (currentStatus === "solved") list = list.filter(q => solvedSet.has(q.id));
    if (currentStatus === "unsolved") list = list.filter(q => !solvedSet.has(q.id));
    if (currentStatus === "starred") list = list.filter(q => starredSet.has(q.id));
    if (currentPlatform !== "all") list = list.filter(q => q.platform === currentPlatform);
    if (currentFreq !== "all") list = list.filter(q => String(q.frequency) === currentFreq);
    if (searchQuery) {
      const lq = searchQuery.toLowerCase();
      list = list.filter(q =>
        q.title.toLowerCase().includes(lq) ||
        q.category.toLowerCase().includes(lq) ||
        (q.topics || []).some(t => t.toLowerCase().includes(lq))
      );
    }
    return list;
  }
  function groupByCategory(list) {
    const map = new Map();
    list.forEach(q => {
      if (!map.has(q.category)) map.set(q.category, []);
      map.get(q.category).push(q);
    });
    return map;
  }
  function groupByPattern(list) {
    const map = new Map();
    const matchedIds = new Set();
    ALGORITHM_PATTERNS.forEach(pat => {
      const matchedQuestions = list.filter(pat.match);
      matchedQuestions.forEach(q => matchedIds.add(q.id));
      map.set(pat.name, {
        icon: pat.icon,
        questions: matchedQuestions,
      });
    });

    const otherQuestions = list.filter(q => !matchedIds.has(q.id));
    if (otherQuestions.length > 0 && searchQuery) {
      map.set("Other Problems", {
        icon: "📌",
        questions: otherQuestions,
      });
    }
    return map;
  }
  function countByLevel(level) { return allQuestions.filter(q => q.level === level).length; }
  function solvedByLevel(level) { return allQuestions.filter(q => q.level === level && solvedSet.has(q.id)).length; }

  // ─── Donut Chart ───
  function renderDonut() {
    const circ = 2 * Math.PI * 62; // ≈ 389.56
    const total = allQuestions.length;
    const se = solvedByLevel("Easy");
    const sm = solvedByLevel("Medium");
    const sh = solvedByLevel("Hard");
    const solved = se + sm + sh;

    const pE = total ? se / total : 0;
    const pM = total ? sm / total : 0;
    const pH = total ? sh / total : 0;

    // Each segment: dasharray = filled gap; dashoffset = rotation position
    // Draw order (bottom to top): Hard, Medium, Easy — so Easy is on top visually
    const hardEl = document.getElementById("donutHard");
    const medEl = document.getElementById("donutMedium");
    const easyEl = document.getElementById("donutEasy");

    // Hard starts at 0
    hardEl.style.strokeDasharray = `${pH * circ} ${circ}`;
    hardEl.style.strokeDashoffset = "0";

    // Medium starts after Hard
    medEl.style.strokeDasharray = `${pM * circ} ${circ}`;
    medEl.style.strokeDashoffset = `${-pH * circ}`;

    // Easy starts after Hard + Medium
    easyEl.style.strokeDasharray = `${pE * circ} ${circ}`;
    easyEl.style.strokeDashoffset = `${-(pH + pM) * circ}`;

    animateNumber("totalSolved", solved);
    document.getElementById("totalQuestions").textContent = total;
  }
  function renderLegend() {
    document.getElementById("legendEasy").textContent = `${solvedByLevel("Easy")}/${countByLevel("Easy")}`;
    document.getElementById("legendMedium").textContent = `${solvedByLevel("Medium")}/${countByLevel("Medium")}`;
    document.getElementById("legendHard").textContent = `${solvedByLevel("Hard")}/${countByLevel("Hard")}`;
  }

  // Animate number counter
  function animateNumber(elId, target) {
    const el = document.getElementById(elId);
    const current = parseInt(el.textContent) || 0;
    if (current === target) return;
    const diff = target - current;
    const steps = Math.min(Math.abs(diff), 30);
    const stepVal = diff / steps;
    let i = 0;
    function tick() {
      i++;
      el.textContent = Math.round(current + stepVal * i);
      if (i < steps) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  // ─── Difficulty Tabs ───
  function renderDiffTabs() {
    document.getElementById("badgeAll").textContent = allQuestions.length;
    document.getElementById("badgeEasy").textContent = countByLevel("Easy");
    document.getElementById("badgeMedium").textContent = countByLevel("Medium");
    document.getElementById("badgeHard").textContent = countByLevel("Hard");
  }
  function renderDiffProgress() {
    const row = document.getElementById("diffProgressRow");
    row.innerHTML = "";
    ["Easy", "Medium", "Hard"].forEach(level => {
      const total = countByLevel(level);
      const solved = solvedByLevel(level);
      const pct = total ? (solved / total * 100) : 0;
      row.innerHTML += `
        <div class="diff-progress">
          <div class="diff-progress__label">
            <span class="diff-progress__name" style="color:var(--${level.toLowerCase()})">${level}</span>
            <span class="diff-progress__count">${solved}/${total}</span>
          </div>
          <div class="diff-progress__track">
            <div class="diff-progress__fill diff-progress__fill--${level.toLowerCase()}" style="width:${pct}%"></div>
          </div>
        </div>`;
    });
  }

  // ─── Category & Pattern Breakdown Bars ───
  function renderCategoryBars() {
    const container = document.getElementById("categoryBars");
    if (currentBreakdown === "pattern") {
      const items = ALGORITHM_PATTERNS.map(pat => {
        const questions = allQuestions.filter(pat.match);
        const solved = questions.filter(q => solvedSet.has(q.id)).length;
        const total = questions.length;
        return { name: `${pat.icon} ${pat.name}`, total, solved };
      }).filter(item => item.total > 0).sort((a, b) => b.total - a.total);

      container.innerHTML = items.map(({ name, total, solved }) => {
        const pct = total ? (solved / total * 100) : 0;
        return `
          <div class="cat-bar">
            <div class="cat-bar__header">
              <span class="cat-bar__name">${name}</span>
              <span class="cat-bar__count">${solved}/${total}</span>
            </div>
            <div class="cat-bar__track"><div class="cat-bar__fill cat-bar__fill--pattern" style="width:${pct}%"></div></div>
          </div>`;
      }).join("");
    } else {
      const cats = new Map();
      allQuestions.forEach(q => {
        if (!cats.has(q.category)) cats.set(q.category, { total: 0, solved: 0 });
        cats.get(q.category).total++;
        if (solvedSet.has(q.id)) cats.get(q.category).solved++;
      });
      const sorted = [...cats.entries()].sort((a, b) => b[1].total - a[1].total);
      container.innerHTML = sorted.map(([name, { total, solved }]) => {
        const pct = total ? (solved / total * 100) : 0;
        return `
          <div class="cat-bar">
            <div class="cat-bar__header">
              <span class="cat-bar__name">${name}</span>
              <span class="cat-bar__count">${solved}/${total}</span>
            </div>
            <div class="cat-bar__track"><div class="cat-bar__fill" style="width:${pct}%"></div></div>
          </div>`;
      }).join("");
    }
  }

  // ─── Stats ───
  function renderStats() {
    const totalSolved = solvedSet.size;
    const total = allQuestions.length;
    const pct = total ? Math.round(totalSolved / total * 100) : 0;
    document.getElementById("statStarred").textContent = starredSet.size;
    document.getElementById("statPercent").textContent = pct + "%";

    // Today count
    const today = todayStr();
    document.getElementById("statToday").textContent = activityMap[today] || 0;

    // Streak
    let streak = 0;
    let d = new Date();
    while (true) {
      const ds = d.toISOString().slice(0, 10);
      if (activityMap[ds] && activityMap[ds] > 0) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else break;
    }
    document.getElementById("statStreak").textContent = streak;
  }

  // ─── Heatmap ───
  function renderHeatmap() {
    const container = document.getElementById("heatmap");
    container.innerHTML = "";
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      const count = activityMap[ds] || 0;
      const level = count === 0 ? "0" : count >= 5 ? "5+" : String(Math.min(count, 5));
      const cell = document.createElement("div");
      cell.className = "heatmap-cell";
      cell.dataset.count = level;
      cell.title = `${ds}: ${count} solved`;
      container.appendChild(cell);
    }
  }

  // ─── View Switcher UI ───
  function updateViewSwitcherUI() {
    const catBtn = document.getElementById("viewCategoryBtn");
    const patBtn = document.getElementById("viewPatternBtn");
    const desc = document.getElementById("viewSwitcherDesc");
    const catBadge = document.getElementById("viewCatCount");
    const uniqueCats = new Set(allQuestions.map(q => q.category)).size;
    if (catBadge) catBadge.textContent = `${uniqueCats} Categories`;

    if (currentView === "pattern") {
      catBtn.classList.remove("view-btn--active");
      patBtn.classList.add("view-btn--active");
      desc.innerHTML = `Showing <strong>9 Core Algorithm & Pattern Lists</strong> (Questions can belong to multiple lists)`;
    } else {
      patBtn.classList.remove("view-btn--active");
      catBtn.classList.add("view-btn--active");
      desc.innerHTML = `Showing questions grouped by <strong>Data Structure</strong> category`;
    }
  }

  // ─── Questions Rendering ───
  function renderQuestions() {
    const filtered = getFiltered();
    const container = document.getElementById("questionsContainer");
    const emptyState = document.getElementById("emptyState");

    // Preserve which accordions are currently open
    const openCategories = new Set();
    container.querySelectorAll(".category-accordion.open").forEach(el => {
      openCategories.add(el.dataset.cat);
    });

    if (filtered.length === 0) {
      container.innerHTML = "";
      emptyState.style.display = "flex";
      return;
    }
    emptyState.style.display = "none";

    let html = "";

    if (currentView === "pattern") {
      const groups = groupByPattern(filtered);
      for (const [patternName, { icon, questions }] of groups) {
        if (questions.length === 0 && searchQuery) continue;
        const solvedCount = questions.filter(q => solvedSet.has(q.id)).length;
        const totalCount = questions.length;
        const pct = totalCount ? (solvedCount / totalCount * 100) : 0;
        const isOpen = openCategories.has(patternName);
        html += `
          <div class="category-accordion${isOpen ? ' open' : ''}" data-cat="${patternName}">
            <div class="category-accordion__header" onclick="window.__toggleAccordion(this)">
              <svg class="category-accordion__chevron" viewBox="0 0 20 20" fill="none"><path d="M7 4l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span class="category-accordion__name">
                <span>${icon} ${patternName}</span>
                <span class="category-accordion__badge">Pattern</span>
              </span>
              <div class="category-accordion__progress">
                <span class="category-accordion__count">${solvedCount}/${totalCount}</span>
                <div class="category-accordion__bar"><div class="category-accordion__bar-fill cat-bar__fill--pattern" style="width:${pct}%"></div></div>
              </div>
            </div>
            <div class="category-accordion__body">
              <div class="q-list">
                ${questions.length > 0 ? questions.map(q => renderQuestionRow(q)).join("") : '<div style="padding:16px;text-align:center;color:var(--text-muted);font-size:.82rem">No questions match current filters.</div>'}
              </div>
            </div>
          </div>`;
      }
    } else {
      const groups = groupByCategory(filtered);
      for (const [category, questions] of groups) {
        const solvedCount = questions.filter(q => solvedSet.has(q.id)).length;
        const totalCount = questions.length;
        const pct = totalCount ? (solvedCount / totalCount * 100) : 0;
        const isOpen = openCategories.has(category);
        html += `
          <div class="category-accordion${isOpen ? ' open' : ''}" data-cat="${category}">
            <div class="category-accordion__header" onclick="window.__toggleAccordion(this)">
              <svg class="category-accordion__chevron" viewBox="0 0 20 20" fill="none"><path d="M7 4l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span class="category-accordion__name">${category}</span>
              <div class="category-accordion__progress">
                <span class="category-accordion__count">${solvedCount}/${totalCount}</span>
                <div class="category-accordion__bar"><div class="category-accordion__bar-fill" style="width:${pct}%"></div></div>
              </div>
            </div>
            <div class="category-accordion__body">
              <div class="q-list">
                ${questions.map(q => renderQuestionRow(q)).join("")}
              </div>
            </div>
          </div>`;
      }
    }

    if (!html) {
      container.innerHTML = "";
      emptyState.style.display = "flex";
      return;
    }

    container.innerHTML = html;
  }
  function renderQuestionRow(q) {
    const isSolved = solvedSet.has(q.id);
    const isStarred = starredSet.has(q.id);
    const platformClass = q.platform === "LeetCode" ? "leetcode" : "gfg";
    const levelClass = q.level.toLowerCase();
    const freq = q.frequency || 3;
    return `
      <div class="q-row ${isSolved ? 'solved' : ''}" data-id="${q.id}">
        <label class="q-check">
          <input type="checkbox" ${isSolved ? 'checked' : ''} onchange="window.__toggleSolved('${q.id}', this.checked)" />
          <div class="q-check__box">
            <svg viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
        </label>
        <div class="q-freq q-freq--${freq}" title="Frequency: ${freq}/5"></div>
        <div class="q-row__info">
          <div class="q-row__title-row">
            <span class="q-row__title">${q.title}</span>
            <a class="q-row__link q-row__link--${platformClass}" href="${q.link}" target="_blank" rel="noopener" title="Open on ${q.platform}">
              <svg viewBox="0 0 16 16" fill="none"><path d="M6 3H3v10h10v-3M9 3h4v4M7 9l6-6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
          </div>
          ${q.topics && q.topics.length ? `<div class="q-row__topics">${q.topics.map(t => `<span class="q-topic">${t}</span>`).join("")}</div>` : ""}
        </div>
        <span class="q-level q-level--${levelClass}">${q.level}</span>
        <div class="q-actions">
          <button class="q-action ${isStarred ? 'starred' : ''}" onclick="window.__toggleStar('${q.id}')" title="Star">
            <svg viewBox="0 0 16 16" fill="${isStarred ? 'currentColor' : 'none'}"><path d="M8 1l2.1 4.3 4.7.7-3.4 3.3.8 4.7L8 11.8 3.8 14l.8-4.7L1.2 6l4.7-.7L8 1z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>
          </button>
          <button class="q-action" onclick="window.__openNotes('${q.id}')" title="Notes">
            <svg viewBox="0 0 16 16" fill="none"><path d="M2 3h12v10H2zM5 6h6M5 9h4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          ${q.isCustom ? `<button class="q-action" onclick="window.__editQuestion('${q.id}')" title="Edit"><svg viewBox="0 0 16 16" fill="none"><path d="M11 2l3 3-8 8H3v-3l8-8z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          <button class="q-action" onclick="window.__deleteQuestion('${q.id}')" title="Delete"><svg viewBox="0 0 16 16" fill="none"><path d="M3 5h10M6 5V3h4v2M5 5v8h6V5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>` : ""}
        </div>
      </div>`;
  }

  // ─── Interactions ───
  window.__toggleAccordion = function (header) {
    header.closest(".category-accordion").classList.toggle("open");
  };

  window.__toggleSolved = function (id, checked) {
    const q = allQuestions.find(x => x.id === id);
    if (checked) {
      solvedSet.add(id);
      solvedDatesMap[id] = todayStr();
    } else {
      solvedSet.delete(id);
      delete solvedDatesMap[id];
      if (q) {
        if (q.category) completedCategories.delete(q.category);
        ALGORITHM_PATTERNS.forEach(pat => {
          if (pat.match(q)) completedPatterns.delete(pat.name);
        });
      }
    }
    rebuildActivityMap();
    saveState();
    refreshAll();

    // Check for milestones
    if (checked) checkMilestones(id);
  };

  window.__toggleStar = function (id) {
    if (starredSet.has(id)) starredSet.delete(id);
    else starredSet.add(id);
    saveState();
    renderQuestions();
    renderStats();
  };

  window.__openNotes = function (id) {
    const q = allQuestions.find(q => q.id === id);
    if (!q) return;
    document.getElementById("drawerTitle").textContent = `Notes — ${q.title}`;
    document.getElementById("drawerNotes").value = notesMap[id] || "";
    document.getElementById("drawerOverlay").classList.add("open");
    document.getElementById("drawerNotes").dataset.qid = id;
  };

  window.__editQuestion = function (id) {
    const q = allQuestions.find(q => q.id === id);
    if (!q) return;
    document.getElementById("editId").value = id;
    document.getElementById("formLevel").value = q.level;
    document.getElementById("formCategory").value = q.category;
    document.getElementById("formTitle").value = q.title;
    document.getElementById("formLink").value = q.link;
    document.getElementById("formPlatform").value = q.platform;
    document.getElementById("formFrequency").value = q.frequency;
    document.getElementById("formTopics").value = (q.topics || []).join(", ");
    document.getElementById("modalTitle").textContent = "Edit Question";
    document.getElementById("modalSubmit").textContent = "Save Changes";
    document.getElementById("modalOverlay").classList.add("open");
  };

  window.__deleteQuestion = function (id) {
    if (!confirm("Delete this question?")) return;
    allQuestions = allQuestions.filter(q => q.id !== id);
    solvedSet.delete(id);
    starredSet.delete(id);
    delete notesMap[id];
    delete solvedDatesMap[id];
    rebuildActivityMap();
    syncCompletedSets();
    saveState();
    refreshAll();
    showToast("Question deleted", "success");
  };

  // ─── Refresh Everything ───
  function refreshAll() {
    renderDiffTabs();
    renderDiffProgress();
    renderDonut();
    renderLegend();
    renderCategoryBars();
    renderStats();
    renderHeatmap();
    renderQuestions();
  }

  // ─── Milestones ───
  function checkMilestones(justSolvedId) {
    const totalSolved = solvedSet.size;
    const milestones = [10, 25, 50, 75, 100, 150, 200];
    if (milestones.includes(totalSolved)) {
      showToast(`🎉 Milestone! ${totalSolved} problems solved!`, "success");
      fireConfetti();
    }

    if (!justSolvedId) return;
    const justSolvedQ = allQuestions.find(q => q.id === justSolvedId);
    if (!justSolvedQ) return;

    // Check category completion ONLY for the category of the question just solved
    if (justSolvedQ.category && !completedCategories.has(justSolvedQ.category)) {
      const catQuestions = allQuestions.filter(q => q.category === justSolvedQ.category);
      if (catQuestions.length > 0 && catQuestions.every(q => solvedSet.has(q.id))) {
        completedCategories.add(justSolvedQ.category);
        showToast(`🏆 Category "${justSolvedQ.category}" complete!`, "success");
        fireConfetti();
      }
    }

    // Check pattern completion ONLY for patterns matching the question just solved
    ALGORITHM_PATTERNS.forEach(pat => {
      if (pat.match(justSolvedQ) && !completedPatterns.has(pat.name)) {
        const patQuestions = allQuestions.filter(pat.match);
        if (patQuestions.length > 0 && patQuestions.every(q => solvedSet.has(q.id))) {
          completedPatterns.add(pat.name);
          showToast(`⚡ Algorithm Pattern "${pat.name}" complete!`, "success");
          fireConfetti();
        }
      }
    });
  }

  // ─── Confetti ───
  function fireConfetti() {
    const canvas = document.getElementById("confettiCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = [];
    const colors = ["#6366f1", "#a855f7", "#ec4899", "#fbbf24", "#00b8a3", "#ef476f"];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 8 + 4,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 4 + 2,
        rot: Math.random() * 360,
        rotV: (Math.random() - 0.5) * 10,
        life: 1,
      });
    }
    let frame = 0;
    function animate() {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        if (p.life <= 0) return;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.rot += p.rotV;
        p.life -= 0.008;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (alive && frame < 200) requestAnimationFrame(animate);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    animate();
  }

  // ─── Toast ───
  function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("toast--out");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ─── Category Datalist ───
  function populateCategoryDatalist() {
    const dl = document.getElementById("categoryList");
    const cats = [...new Set(allQuestions.map(q => q.category))].sort();
    dl.innerHTML = cats.map(c => `<option value="${c}">`).join("");
  }

  // ─── Bind Events ───
  function bindEvents() {
    // View Mode Switcher
    const viewSwitcher = document.getElementById("viewSwitcher");
    if (viewSwitcher) {
      viewSwitcher.addEventListener("click", e => {
        const btn = e.target.closest(".view-btn");
        if (!btn) return;
        const view = btn.dataset.view;
        if (view === currentView) return;
        currentView = view;
        try { localStorage.setItem("dsa_view_mode", currentView); } catch {}
        updateViewSwitcherUI();
        renderQuestions();
      });
    }

    // Breakdown Toggle
    const breakdownGroup = document.getElementById("breakdownToggleGroup");
    if (breakdownGroup) {
      breakdownGroup.addEventListener("click", e => {
        const btn = e.target.closest(".card__toggle-btn");
        if (!btn) return;
        const bd = btn.dataset.breakdown;
        if (bd === currentBreakdown) return;
        currentBreakdown = bd;
        document.querySelectorAll("#breakdownToggleGroup .card__toggle-btn").forEach(b => b.classList.remove("card__toggle-btn--active"));
        btn.classList.add("card__toggle-btn--active");
        document.getElementById("breakdownTitle").textContent = bd === "pattern" ? "Pattern Breakdown" : "Category Breakdown";
        renderCategoryBars();
      });
    }

    // Difficulty tabs
    document.getElementById("diffTabs").addEventListener("click", e => {
      const tab = e.target.closest(".diff-tab");
      if (!tab) return;
      document.querySelectorAll(".diff-tab").forEach(t => t.classList.remove("diff-tab--active"));
      tab.classList.add("diff-tab--active");
      currentLevel = tab.dataset.level;
      renderQuestions();
    });

    // Search
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", () => {
      searchQuery = searchInput.value.trim();
      renderQuestions();
    });
    document.addEventListener("keydown", e => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInput.focus();
      }
    });

    // Filter toggle
    document.getElementById("filterBtn").addEventListener("click", () => {
      document.getElementById("filterPanel").classList.toggle("open");
    });

    // Status filters
    document.getElementById("statusFilters").addEventListener("click", e => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      document.querySelectorAll("#statusFilters .chip").forEach(c => c.classList.remove("chip--active"));
      chip.classList.add("chip--active");
      currentStatus = chip.dataset.status;
      renderQuestions();
    });

    // Platform filters
    document.getElementById("platformFilters").addEventListener("click", e => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      document.querySelectorAll("#platformFilters .chip").forEach(c => c.classList.remove("chip--active"));
      chip.classList.add("chip--active");
      currentPlatform = chip.dataset.platform;
      renderQuestions();
    });

    // Frequency filters
    document.getElementById("frequencyFilters").addEventListener("click", e => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      document.querySelectorAll("#frequencyFilters .chip").forEach(c => c.classList.remove("chip--active"));
      chip.classList.add("chip--active");
      currentFreq = chip.dataset.freq;
      renderQuestions();
    });

    // Data menu
    const dataMenuBtn = document.getElementById("dataMenuBtn");
    const dataMenu = document.getElementById("dataMenu");
    dataMenuBtn.addEventListener("click", e => {
      e.stopPropagation();
      const rect = dataMenuBtn.getBoundingClientRect();
      dataMenu.style.top = rect.bottom + 8 + "px";
      dataMenu.style.right = (window.innerWidth - rect.right) + "px";
      dataMenu.classList.toggle("open");
    });
    document.addEventListener("click", () => dataMenu.classList.remove("open"));

    // Export
    document.getElementById("exportBtn").addEventListener("click", () => {
      const data = {
        solved: [...solvedSet],
        starred: [...starredSet],
        notes: notesMap,
        custom: allQuestions.filter(q => q.isCustom),
        activity: activityMap,
        solvedDates: solvedDatesMap,
        exportedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `dsa-tracker-backup-${todayStr()}.json`;
      a.click(); URL.revokeObjectURL(url);
      showToast("Progress exported!", "success");
    });

    // Import
    document.getElementById("importBtn").addEventListener("click", () => {
      document.getElementById("importFileInput").click();
    });
    document.getElementById("importFileInput").addEventListener("change", e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          if (data.solved) solvedSet = new Set(data.solved);
          if (data.starred) starredSet = new Set(data.starred);
          if (data.notes) notesMap = data.notes;
          if (data.activity) activityMap = data.activity;
          if (data.solvedDates) solvedDatesMap = data.solvedDates;
          if (data.custom) {
            const customQ = data.custom.map(q => ({ ...q, isCustom: true }));
            allQuestions = [...DEFAULT_QUESTIONS, ...customQ];
          }
          rebuildActivityMap();
          syncCompletedSets();
          saveState();
          refreshAll();
          populateCategoryDatalist();
          showToast("Progress imported!", "success");
        } catch (err) {
          showToast("Invalid file format", "error");
        }
      };
      reader.readAsText(file);
      e.target.value = "";
    });

    // Reset
    document.getElementById("resetBtn").addEventListener("click", () => {
      if (!confirm("Are you sure? This will reset ALL your progress, starred items, notes, and custom questions.")) return;
      localStorage.removeItem(STORAGE_KEYS.solved);
      localStorage.removeItem(STORAGE_KEYS.starred);
      localStorage.removeItem(STORAGE_KEYS.notes);
      localStorage.removeItem(STORAGE_KEYS.custom);
      localStorage.removeItem(STORAGE_KEYS.activity);
      localStorage.removeItem(STORAGE_KEYS.solvedDates);
      solvedSet = new Set();
      starredSet = new Set();
      notesMap = {};
      activityMap = {};
      solvedDatesMap = {};
      completedCategories.clear();
      completedPatterns.clear();
      allQuestions = [...DEFAULT_QUESTIONS];
      saveState();
      refreshAll();
      showToast("All data reset", "info");
    });

    // Add Question Modal
    const modalOverlay = document.getElementById("modalOverlay");
    document.getElementById("addQuestionBtn").addEventListener("click", () => {
      document.getElementById("editId").value = "";
      document.getElementById("questionForm").reset();
      document.getElementById("modalTitle").textContent = "Add New Question";
      document.getElementById("modalSubmit").textContent = "Add Question";
      modalOverlay.classList.add("open");
    });
    document.getElementById("modalClose").addEventListener("click", () => modalOverlay.classList.remove("open"));
    document.getElementById("modalCancel").addEventListener("click", () => modalOverlay.classList.remove("open"));
    modalOverlay.addEventListener("click", e => {
      if (e.target === modalOverlay) modalOverlay.classList.remove("open");
    });

    // Form submit
    document.getElementById("questionForm").addEventListener("submit", e => {
      e.preventDefault();
      const editId = document.getElementById("editId").value;
      const level = document.getElementById("formLevel").value;
      const category = document.getElementById("formCategory").value.trim();
      const title = document.getElementById("formTitle").value.trim();
      const link = document.getElementById("formLink").value.trim();
      const platform = document.getElementById("formPlatform").value;
      const frequency = parseInt(document.getElementById("formFrequency").value);
      const topicsStr = document.getElementById("formTopics").value.trim();
      const topics = topicsStr ? topicsStr.split(",").map(t => t.trim()).filter(Boolean) : [];

      if (!category || !title || !link) {
        showToast("Please fill all required fields", "error");
        return;
      }

      if (editId) {
        // Edit existing
        const idx = allQuestions.findIndex(q => q.id === editId);
        if (idx !== -1) {
          allQuestions[idx] = { ...allQuestions[idx], level, category, title, link, platform, frequency, topics };
        }
        showToast("Question updated!", "success");
      } else {
        // New question
        const id = "custom_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);
        allQuestions.push({ id, level, category, title, link, platform, frequency, topics, isCustom: true });
        showToast("Question added!", "success");
      }

      syncCompletedSets();
      saveState();
      refreshAll();
      populateCategoryDatalist();
      modalOverlay.classList.remove("open");
    });

    // Notes drawer
    document.getElementById("drawerClose").addEventListener("click", () => {
      document.getElementById("drawerOverlay").classList.remove("open");
    });
    document.getElementById("drawerOverlay").addEventListener("click", e => {
      if (e.target.id === "drawerOverlay") e.target.classList.remove("open");
    });
    document.getElementById("drawerSave").addEventListener("click", () => {
      const textarea = document.getElementById("drawerNotes");
      const qid = textarea.dataset.qid;
      if (qid) {
        const val = textarea.value.trim();
        if (val) notesMap[qid] = val;
        else delete notesMap[qid];
        saveState();
        showToast("Notes saved!", "success");
      }
      document.getElementById("drawerOverlay").classList.remove("open");
    });

    // Auth Modal open/close
    const authModalOverlay = document.getElementById("authModalOverlay");
    const openAuthBtn = document.getElementById("openAuthBtn");
    if (openAuthBtn) {
      openAuthBtn.addEventListener("click", () => {
        showAuthError("");
        setupGoogleAuth();
        authModalOverlay.classList.add("open");
      });
    }
    document.getElementById("authModalClose").addEventListener("click", () => authModalOverlay.classList.remove("open"));
    authModalOverlay.addEventListener("click", e => {
      if (e.target === authModalOverlay) authModalOverlay.classList.remove("open");
    });

    // Auth tabs (Login vs Signup)
    const tabLogin = document.getElementById("tabLogin");
    const tabSignup = document.getElementById("tabSignup");
    const nameGroup = document.getElementById("nameGroup");
    const authSubmitBtn = document.getElementById("authSubmitBtn");
    const authModalTitle = document.getElementById("authModalTitle");

    tabLogin.addEventListener("click", () => {
      authMode = "login";
      tabLogin.classList.add("auth-tab--active");
      tabSignup.classList.remove("auth-tab--active");
      nameGroup.style.display = "none";
      authSubmitBtn.textContent = "Sign In";
      authModalTitle.textContent = "Sign in to DSA Tracker";
      showAuthError("");
    });
    tabSignup.addEventListener("click", () => {
      authMode = "signup";
      tabSignup.classList.add("auth-tab--active");
      tabLogin.classList.remove("auth-tab--active");
      nameGroup.style.display = "block";
      authSubmitBtn.textContent = "Create Account";
      authModalTitle.textContent = "Create your DSA Account";
      showAuthError("");
    });

    // Email/Password Form Submit
    document.getElementById("authForm").addEventListener("submit", async e => {
      e.preventDefault();
      const email = document.getElementById("authEmail").value.trim();
      const password = document.getElementById("authPassword").value;
      const name = document.getElementById("authName").value.trim();

      try {
        authSubmitBtn.disabled = true;
        authSubmitBtn.textContent = "Processing...";
        showAuthError("");

        const endpoint = authMode === "signup" ? "/api/auth/signup" : "/api/auth/login";
        const body = authMode === "signup" ? { email, password, name } : { email, password };

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Authentication failed");

        await handleAuthSuccess(data);
      } catch (err) {
        showAuthError(err.message);
      } finally {
        authSubmitBtn.disabled = false;
        authSubmitBtn.textContent = authMode === "signup" ? "Create Account" : "Sign In";
      }
    });

    // Google custom button fallback
    const googleCustomBtn = document.getElementById("googleCustomBtn");
    if (googleCustomBtn) {
      googleCustomBtn.addEventListener("click", () => {
        if (!googleClientId) {
          showAuthError("Google Client ID is not configured yet in .env / Render environment variables. You can sign in using Email & Password below, or configure GOOGLE_CLIENT_ID.");
        } else {
          showAuthError("Loading Google Sign-In...");
          setupGoogleAuth();
        }
      });
    }

    // User Profile Dropdown
    const userMenuBtn = document.getElementById("userMenuBtn");
    const userDropdown = document.getElementById("userDropdown");
    if (userMenuBtn && userDropdown) {
      userMenuBtn.addEventListener("click", e => {
        e.stopPropagation();
        userDropdown.classList.toggle("open");
      });
      document.addEventListener("click", () => userDropdown.classList.remove("open"));
    }

    // Manual Sync Button
    const manualSyncBtn = document.getElementById("manualSyncBtn");
    if (manualSyncBtn) {
      manualSyncBtn.addEventListener("click", async () => {
        if (!currentUser) return;
        setSyncBadge("syncing");
        await syncToCloud();
        showToast("Cloud sync complete!", "success");
      });
    }

    // Logout
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        try {
          await fetch("/api/auth/logout", { method: "POST" });
        } catch {}
        currentUser = null;
        updateUserUI();
        showToast("Signed out. Using local browser storage.", "info");
      });
    }

    // Migration Alert buttons
    const mergeProgressBtn = document.getElementById("mergeProgressBtn");
    const skipMergeBtn = document.getElementById("skipMergeBtn");
    if (mergeProgressBtn) {
      mergeProgressBtn.addEventListener("click", async () => {
        await migrateLocalToCloud();
        document.getElementById("migrationAlert").style.display = "none";
      });
    }
    if (skipMergeBtn) {
      skipMergeBtn.addEventListener("click", async () => {
        document.getElementById("migrationAlert").style.display = "none";
        await loadCloudData();
      });
    }

    // Escape key
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        modalOverlay.classList.remove("open");
        document.getElementById("drawerOverlay").classList.remove("open");
        dataMenu.classList.remove("open");
        authModalOverlay.classList.remove("open");
        if (userDropdown) userDropdown.classList.remove("open");
      }
    });
  }

  // ─── Boot ───
  document.addEventListener("DOMContentLoaded", init);
})();
