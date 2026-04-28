const state = { h: [-1, -1], m: [-1, -1], s: [-1, -1] };

function pad(n) {
  return String(n).padStart(2, '0');
}

function buildUnit(el) {
  el.innerHTML = '';

  return [0, 1].map(() => {
    const c = document.createElement('div');
    c.className = 'card';

    c.innerHTML = `
      <div class="card-top"><span>0</span></div>
      <div class="card-bot"><span>0</span></div>
      <div class="flip-top"><span>0</span></div>
      <div class="flip-bot"><span>0</span></div>
    `;

    el.appendChild(c);
    return c;
  });
}

const units = {
  h: buildUnit(document.getElementById('h')),
  m: buildUnit(document.getElementById('m')),
  s: buildUnit(document.getElementById('s'))
};

function flipDigit(card, from, to) {
  const top = card.querySelector('.card-top span');
  const bot = card.querySelector('.card-bot span');
  const ft = card.querySelector('.flip-top');
  const fb = card.querySelector('.flip-bot');

  const ftSpan = ft.querySelector('span');
  const fbSpan = fb.querySelector('span');

  // estado final fixo
  top.textContent = to;
  bot.textContent = to;

  // estado animado
  ftSpan.textContent = from;
  fbSpan.textContent = to;

  // reset seguro (funciona melhor em Safari)
  ft.style.transition = 'none';
  fb.style.transition = 'none';

  ft.style.transform = 'rotateX(0deg)';
  fb.style.transform = 'rotateX(90deg)';

  ft.offsetHeight; // força reflow

  ft.style.transition = 'transform 0.25s ease-in';
  fb.style.transition = 'transform 0.25s ease-out 0.12s';

  ft.style.transform = 'rotateX(-90deg)';
  fb.style.transform = 'rotateX(0deg)';
}

function tick() {
  const now = new Date();

  const vals = {
    h: pad(now.getHours()).split(''),
    m: pad(now.getMinutes()).split(''),
    s: pad(now.getSeconds()).split('')
  };

  for (let k in vals) {
    vals[k].forEach((digit, i) => {
      if (digit !== state[k][i]) {
        flipDigit(
          units[k][i],
          state[k][i] === -1 ? digit : state[k][i],
          digit
        );
        state[k][i] = digit;
      }
    });
  }
}

tick();
setInterval(tick, 1000);
