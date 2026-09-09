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
  };

  let allQuestions = [...DEFAULT_QUESTIONS];
  let solvedSet = new Set();
  let starredSet = new Set();
  let notesMap = {};
  let activityMap = {};  // { "YYYY-MM-DD": count }

  let currentLevel = "all";
  let currentStatus = "all";
  let currentPlatform = "all";
  let currentFreq = "all";
  let searchQuery = "";

  // ─── Init ───
  function init() {
    loadState();
    renderDiffTabs();
    renderDiffProgress();
    renderDonut();
    renderLegend();
    renderCategoryBars();
    renderStats();
    renderHeatmap();
    renderQuestions();
    populateCategoryDatalist();
    bindEvents();
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
  }
  function saveState() {
    const customQ = allQuestions.filter(q => q.isCustom);
    localStorage.setItem(STORAGE_KEYS.custom, JSON.stringify(customQ));
    localStorage.setItem(STORAGE_KEYS.solved, JSON.stringify([...solvedSet]));
    localStorage.setItem(STORAGE_KEYS.starred, JSON.stringify([...starredSet]));
    localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notesMap));
    localStorage.setItem(STORAGE_KEYS.activity, JSON.stringify(activityMap));
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

  // ─── Category Bars ───
  function renderCategoryBars() {
    const cats = new Map();
    allQuestions.forEach(q => {
      if (!cats.has(q.category)) cats.set(q.category, { total: 0, solved: 0 });
      cats.get(q.category).total++;
      if (solvedSet.has(q.id)) cats.get(q.category).solved++;
    });
    const sorted = [...cats.entries()].sort((a, b) => b[1].total - a[1].total);
    const container = document.getElementById("categoryBars");
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

    const groups = groupByCategory(filtered);
    let html = "";
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
    if (checked) {
      solvedSet.add(id);
      // Track activity
      const today = todayStr();
      activityMap[today] = (activityMap[today] || 0) + 1;
    } else {
      solvedSet.delete(id);
    }
    saveState();
    refreshAll();

    // Check for milestones
    if (checked) checkMilestones();
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
  function checkMilestones() {
    const totalSolved = solvedSet.size;
    const milestones = [10, 25, 50, 75, 100, 150, 200];
    if (milestones.includes(totalSolved)) {
      showToast(`🎉 Milestone! ${totalSolved} problems solved!`, "success");
      fireConfetti();
    }
    // Check category completion
    const cats = new Map();
    allQuestions.forEach(q => {
      if (!cats.has(q.category)) cats.set(q.category, { total: 0, solved: 0 });
      cats.get(q.category).total++;
      if (solvedSet.has(q.id)) cats.get(q.category).solved++;
    });
    for (const [name, { total, solved }] of cats) {
      if (total > 0 && solved === total) {
        // Check if we just completed it (last question)
        showToast(`🏆 Category "${name}" complete!`, "success");
        fireConfetti();
        break;
      }
    }
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
          if (data.custom) {
            const customQ = data.custom.map(q => ({ ...q, isCustom: true }));
            allQuestions = [...DEFAULT_QUESTIONS, ...customQ];
          }
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
      solvedSet = new Set();
      starredSet = new Set();
      notesMap = {};
      activityMap = {};
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

    // Escape key
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        modalOverlay.classList.remove("open");
        document.getElementById("drawerOverlay").classList.remove("open");
        dataMenu.classList.remove("open");
      }
    });
  }

  // ─── Boot ───
  document.addEventListener("DOMContentLoaded", init);
})();
