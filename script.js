{
  /*
    Figma-friendly interactions only:
    - hover states (CSS)            → Figma "While hovering"
    - click to swap a state         → Figma "On click → Change to variant"
    - simple 2-state loops (CSS)    → Figma "After delay → Smart animate"
    Nothing here follows the mouse or depends on scroll position.
  */
  /* ---------- DATA ---------- */
  const episodes = [
    {
      title: "The Great Cheese Mission", icon: "i-cheese", bg: "#FBE2BC", label: "Story 1",
      text: "Jerry spots his favourite cheese sitting right in front of him. There's just one problem – Tom is watching! Can Jerry get his cheesy treasure without waking up the sleeping troublemaker?",
      tom: "Tom wakes up just in time… and steps straight onto a rake. Jerry strolls home with the cheese.",
      jerry: "Jerry tiptoes across Tom's own tail and leaves a tiny thank-you note behind."
    },
    {
      title: "Tom's Perfect Plan", icon: "i-trap", bg: "#DCE3EE", label: "Story 2",
      text: "This time, Tom has created what he believes is his most brilliant trap ever. Everything is perfectly planned. Everything is under control. Well... until Jerry shows up!",
      tom: "The trap snaps perfectly – right on Tom's own paw. So close!",
      jerry: "Jerry rewires the trap in ten seconds. Tom's brilliant plan now launches Tom."
    },
    {
      title: "Kitchen Catastrophe", icon: "i-pan", bg: "#F5D7A8", label: "Story 3",
      text: "A quiet kitchen, a hungry cat and a mouse with an appetite. What could possibly go wrong? Absolutely everything!",
      tom: "Tom swings the frying pan… Jerry ducks. Guess whose face meets the pan?",
      jerry: "A flour cloud, twelve broken plates, and Jerry escapes riding a rolling pin."
    },
    {
      title: "The Tables Have Turned", icon: "i-trophy", bg: "#E4E9D8", label: "Story 4",
      text: "For once, Tom thinks he's finally won. But Jerry has one last surprise waiting. Will this be Tom's victory or another hilarious failure?",
      tom: "Tom finally wins! …for exactly four seconds. Then the big dog next door wakes up.",
      jerry: "Jerry's last surprise: a firecracker hidden inside Tom's victory cake."
    }
  ];

  const facts = [
    { t: "Original Names", d: "Tom was originally introduced as Jasper in their debut cartoon." },
    { t: "Oscar Champions", d: "The classic Tom and Jerry theatrical shorts won seven Academy Awards." },
    { t: "Almost No Dialogue", d: "Their hilarious expressions and physical comedy made them popular worldwide." },
    { t: "Created in 1940", d: "Their first appearance was in the short film Puss Gets the Boot." },
    { t: "A Timeless Duo", d: "Their adventures continue entertaining new generations even today." }
  ];

  const quiz = [
    { q: "What does Jerry love the most?", o: ["Pizza", "Cheese", "Chocolate", "Ice Cream"], a: 1,
      why: "Cheese! It's his biggest weakness and his biggest dream." },
    { q: "Who usually plans the traps?", o: ["Jerry", "Tom", "Both", "Neither"], a: 1,
      why: "Tom, the cat with a plan. (The plans rarely work.)" },
    { q: "In which year did Tom and Jerry first appear?", o: ["1935", "1940", "1950", "1960"], a: 1,
      why: "1940, in the short Puss Gets the Boot." },
    { q: "Who created Tom and Jerry?", o: ["Walt Disney", "William Hanna and Joseph Barbera", "Warner Bros.", "Pixar"], a: 1,
      why: "William Hanna and Joseph Barbera created the duo." }
  ];

  /* ---------- HELPERS ---------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const toastEl = $("#toast");
  let toastTimer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
  };

  /* ---------- MARQUEE WORDS ---------- */
  const words = ["The chase", "Cheese", "Chaos", "Traps", "Teamwork", "Laughter", "Since 1940"];
  const row = words.map((w) => `<span>${w}<svg><use href="#i-paw"/></svg></span>`).join("");
  $("#mqTrack").innerHTML = row + row;

  /* ---------- ADVENTURES: click a bet → card shows its result ---------- */
  const epsEl = $("#eps");
  epsEl.innerHTML = episodes.map((e, i) => `
    <article class="ep reveal" data-i="${i}">
      <div class="ep-art" style="background:${e.bg}">
        <em>${e.label}</em>
        <svg><use href="#${e.icon}"/></svg>
        <img class="slot-img" src="images/ep${i + 1}.jpg" alt="" onerror="this.remove()">
      </div>
      <div class="ep-body">
        <h3>${e.title}</h3>
        <p>${e.text}</p>
        <div class="bet">
          <p class="bet-q">Who wins this round?</p>
          <div class="bet-btns">
            <button data-bet="tom">Bet on Tom</button>
            <button data-bet="jerry">Bet on Jerry</button>
          </div>
          <div class="result"></div>
        </div>
      </div>
    </article>`).join("");

  epsEl.addEventListener("click", (ev) => {
    const card = ev.target.closest(".ep");
    if (!card) return;
    const e = episodes[card.dataset.i];
    const bet = ev.target.dataset.bet;
    if (bet) {
      const sfx = ["ZOOM!", "SNAP!", "BONK!", "KABOOM!"][card.dataset.i];
      const head = bet === "jerry" ? "You called it!" : "Brave choice… but";
      $(".result", card).innerHTML = `<span class="burst">${sfx}</span><b>${head}</b>${e[bet]}<br><button data-reset>Watch it again</button>`;
      card.classList.add("done");
    } else if (ev.target.hasAttribute("data-reset")) {
      card.classList.remove("done");
    }
  });

  // all cards start the same height; only the clicked one grows
  const epCards = $$(".ep");
  const equalize = () => {
    const closed = epCards.filter((c) => !c.classList.contains("done"));
    epCards.forEach((c) => (c.style.minHeight = ""));
    if (innerWidth <= 600) return;
    const h = Math.max(...closed.map((c) => c.offsetHeight), 0);
    epCards.forEach((c) => (c.style.minHeight = h + "px"));
  };
  addEventListener("resize", equalize);
  addEventListener("load", equalize);
  if (document.fonts) document.fonts.ready.then(equalize);

  /* ---------- DID YOU KNOW: click to reveal ---------- */
  $("#factGrid").innerHTML = facts.map((f) => `
    <button class="fact">
      <svg><use href="#i-bulb"/></svg>
      <h3>${f.t}</h3>
      <p>${f.d}</p>
      <small>Tap to reveal</small>
    </button>`).join("");
  $("#factGrid").addEventListener("click", (ev) => {
    const f = ev.target.closest(".fact");
    if (f) f.classList.toggle("open");
  });

  /* ---------- CHARACTER CARDS: click to show stats ---------- */
  $$(".flip").forEach((c) => c.addEventListener("click", () => c.classList.toggle("flipped")));

  /* ---------- FRIENDSHIP SWITCH: Enemies / Teammates ---------- */
  const sw = $("#relSwitch"), slogan = $("#relSlogan");
  const slogans = {
    enemies: "Cat vs. mouse, trap vs. trick… the whole house is a battlefield!",
    team: "But when real trouble knocks, they fight side by side!"
  };
  const setRel = (mode) => {
    $$("button", sw).forEach((b) => {
      const on = b.dataset.rel === mode;
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", on);
    });
    sw.classList.toggle("is-team", mode === "team");
    slogan.textContent = slogans[mode];
    slogan.classList.remove("swap"); void slogan.offsetWidth; slogan.classList.add("swap");
  };
  sw.addEventListener("click", (ev) => {
    const b = ev.target.closest("button");
    if (b) setRel(b.dataset.rel);
  });

  /* ---------- QUIZ ---------- */
  const box = $("#quizBox");
  let qi = 0, score = 0;
  const drawQ = () => {
    if (qi >= quiz.length) {
      const msg = score === 4 ? "Certified Tom & Jerry superfan!"
        : score >= 2 ? "Not bad! Jerry would give you a small slice of cheese."
        : "Tom-level luck… time to rewatch some classics!";
      box.innerHTML = `<div class="q-done">
        <p class="eyebrow">Your score</p>
        <p class="score">${score}/${quiz.length}</p>
        <p class="lead">${msg}</p>
        <button class="btn btn-yellow q-next" id="qAgain">Try again</button></div>`;
      $("#qAgain").onclick = () => { qi = 0; score = 0; drawQ(); };
      return;
    }
    const q = quiz[qi];
    box.innerHTML = `
      <div class="q-top"><span>Question ${qi + 1} of ${quiz.length}</span><span>Score: ${score}</span></div>
      <div class="q-bar"><i style="width:${(qi / quiz.length) * 100}%"></i></div>
      <h3>${q.q}</h3>
      <div class="opts">${q.o.map((o, i) => `<button data-o="${i}">${o}</button>`).join("")}</div>
      <p class="q-feed" aria-live="polite"></p>`;
    $(".opts", box).addEventListener("click", (ev) => {
      const b = ev.target.closest("button");
      if (!b) return;
      const btns = $$(".opts button", box);
      btns.forEach((x) => (x.disabled = true));
      btns[q.a].classList.add("right");
      if (+b.dataset.o === q.a) { score++; $(".q-feed", box).textContent = "Correct! " + q.why; }
      else { b.classList.add("wrong"); $(".q-feed", box).textContent = "Oops! " + q.why; }
      const next = document.createElement("button");
      next.className = "btn btn-yellow q-next";
      next.textContent = qi === quiz.length - 1 ? "See my score" : "Next question →";
      next.onclick = () => { qi++; drawQ(); };
      box.appendChild(next);
    });
  };
  drawQ();

  /* ---------- TEAM PICK ---------- */
  const teamMsg = $("#teamMsg");
  const pickTeam = (t) => {
    $$(".team").forEach((b) => b.classList.toggle("picked", b.dataset.team === t));
    teamMsg.textContent = t === "tom"
      ? "Team Tom! You believe in never giving up. One day the plan WILL work."
      : "Team Jerry! Small, smart and always three steps ahead. Cheese for everyone!";
  };
  $$(".team").forEach((b) => b.addEventListener("click", () => pickTeam(b.dataset.team)));

  /* ---------- HIDDEN CHEESE HUNT ---------- */
  let found = 0;
  const countEl = $("#cheeseCount");
  $$(".hidden-cheese").forEach((c) => c.addEventListener("click", () => {
    c.classList.add("got");
    found++;
    countEl.textContent = found;
    toast(found === 5 ? "All 5 found! Jerry declares you an honorary mouse." : `Cheese found! ${5 - found} more hiding…`);
  }));

  /* ---------- FADE-UP ON ENTER + ACTIVE NAV LINK ---------- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); revealObs.unobserve(en.target); } });
  }, { threshold: 0.15 });
  $$(".reveal").forEach((el) => revealObs.observe(el));

  const navLinks = $$("#navLinks a");
  const sections = navLinks.map((a) => $(a.getAttribute("href")));
  const markNav = () => {
    let current = -1;
    sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * 0.4) current = i; });
    navLinks.forEach((a, i) => a.classList.toggle("active", i === current));
  };
  addEventListener("scroll", markNav, { passive: true });
  markNav();
  equalize();
}
