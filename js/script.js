/* ─── UTILS ─── */
function pad(n) { return String(n).padStart(2, '0'); }

function buildUnit(el) {
  el.innerHTML = '';
  return [0, 1].map(() => {
    const c = document.createElement('div');
    c.className = 'card';
    c.innerHTML = `
      <div class="card-top"><span>0</span></div>
      <div class="card-bot"><span>0</span></div>
      <div class="flip-top"><span>0</span></div>
      <div class="flip-bot"><span>0</span></div>`;
    el.appendChild(c);
    return c;
  });
}

function flipDigit(card, from, to) {
  const top   = card.querySelector('.card-top span');
  const bot   = card.querySelector('.card-bot span');
  const ft    = card.querySelector('.flip-top');
  const fb    = card.querySelector('.flip-bot');

  top.textContent = to;
  bot.textContent = to;
  ft.querySelector('span').textContent = from;
  fb.querySelector('span').textContent = to;

  ft.style.transition = 'none';
  fb.style.transition = 'none';
  ft.style.transform  = 'rotateX(0deg)';
  fb.style.transform  = 'rotateX(90deg)';

  ft.offsetHeight; // reflow

  ft.style.transition = 'transform 0.25s ease-in';
  fb.style.transition = 'transform 0.25s ease-out 0.12s';
  ft.style.transform  = 'rotateX(-90deg)';
  fb.style.transform  = 'rotateX(0deg)';
}

function updateDigits(unitMap, stateMap, vals) {
  for (const k in vals) {
    vals[k].forEach((digit, i) => {
      if (digit !== stateMap[k][i]) {
        flipDigit(unitMap[k][i], stateMap[k][i] === -1 ? digit : stateMap[k][i], digit);
        stateMap[k][i] = digit;
      }
    });
  }
}

/* ─── RELÓGIO ─── */
const clockState = { h: [-1,-1], m: [-1,-1], s: [-1,-1] };
const clockUnits = {
  h:  buildUnit(document.getElementById('h')),
  m:  buildUnit(document.getElementById('m')),
  s:  buildUnit(document.getElementById('s'))
};

const dateEl = document.getElementById('date-display');
const DAYS   = ['domingo','segunda','terça','quarta','quinta','sexta','sábado'];
const MONTHS = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];

let lastDate = -1;

function tickClock() {
  const now = new Date();

  updateDigits(clockUnits, clockState, {
    h: pad(now.getHours()).split(''),
    m: pad(now.getMinutes()).split(''),
    s: pad(now.getSeconds()).split('')
  });

  const day = now.getDate();
  if (day !== lastDate) {
    lastDate = day;
    const dow = DAYS[now.getDay()];
    const mon = MONTHS[now.getMonth()];
    dateEl.textContent = `${dow}, ${day} de ${mon} de ${now.getFullYear()}`;
  }
}

tickClock();
setInterval(tickClock, 1000);

/* ─── CRONÔMETRO ─── */
const swState = { m: [-1,-1], s: [-1,-1], cs: [-1,-1] };
const swUnits = {
  m:  buildUnit(document.getElementById('sw-m')),
  s:  buildUnit(document.getElementById('sw-s')),
  cs: buildUnit(document.getElementById('sw-cs'))
};

let swRunning   = false;
let swStartTime = 0;
let swElapsed   = 0;
let swRaf       = null;

const btnStartStop = document.getElementById('sw-startstop');
const btnReset     = document.getElementById('sw-reset');

function tickStopwatch() {
  const total = swElapsed + (performance.now() - swStartTime);
  const cs    = Math.floor(total / 10) % 100;
  const s     = Math.floor(total / 1000) % 60;
  const m     = Math.floor(total / 60000) % 100;

  updateDigits(swUnits, swState, {
    m:  pad(m).split(''),
    s:  pad(s).split(''),
    cs: pad(cs).split('')
  });

  swRaf = requestAnimationFrame(tickStopwatch);
}

btnStartStop.addEventListener('click', () => {
  if (!swRunning) {
    swStartTime = performance.now();
    swRaf = requestAnimationFrame(tickStopwatch);
    btnStartStop.textContent = 'pausar';
    btnStartStop.classList.add('running');
  } else {
    cancelAnimationFrame(swRaf);
    swElapsed += performance.now() - swStartTime;
    btnStartStop.textContent = 'continuar';
    btnStartStop.classList.remove('running');
  }
  swRunning = !swRunning;
});

btnReset.addEventListener('click', () => {
  cancelAnimationFrame(swRaf);
  swRunning = false;
  swElapsed = 0;
  btnStartStop.textContent = 'iniciar';
  btnStartStop.classList.remove('running');

  // reset visual
  for (const k in swState) swState[k] = [-1,-1];
  updateDigits(swUnits, swState, { m: ['0','0'], s: ['0','0'], cs: ['0','0'] });
  for (const k in swState) swState[k] = ['0','0'];
});

/* ─── NAVEGAÇÃO ─── */
const pageClock     = document.getElementById('page-clock');
const pageStopwatch = document.getElementById('page-stopwatch');
const fab           = document.getElementById('fab');
let onClock = true;

fab.addEventListener('click', () => {
  onClock = !onClock;
  pageClock.classList.toggle('hidden', !onClock);
  pageStopwatch.classList.toggle('hidden', onClock);
  fab.classList.toggle('active', !onClock);
});
