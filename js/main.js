const canvas = document.getElementById('particles');

if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, pts = [];

  function reset() {
    W = canvas.width = innerWidth;
    H = canvas.height = innerHeight;

    const n = Math.min(86, Math.floor(W * H / 22000));

    pts = Array.from({ length: n }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.34,
      vy: (Math.random() - 0.5) * 0.34
    }));
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);

    for (const p of pts) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;


      ctx.fillStyle = 'rgba(0,255,255,1)';
      ctx.shadowColor = 'rgba(0,220,255,0.6)';
      ctx.shadowBlur = 9;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i],
              b = pts[j],
              d = Math.hypot(a.x - b.x, a.y - b.y);

        if (d < 120) {
          ctx.strokeStyle = `rgba(0,229,255,${(1-d/150)*1.1})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(loop);
  }

  reset();
  loop();

  addEventListener('resize', reset);
}
window.addEventListener('scroll', () => {
  document.querySelector('.header')
    .classList.toggle('scrolled', window.scrollY > 50);
});

const revealObserver = new IntersectionObserver(
  es =>
    es.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    }),
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach(el =>
  revealObserver.observe(el)
);

(function () {
  const counters = document.querySelectorAll('[data-counter]');

  const animateCounter = el => {
    const target = Number(el.getAttribute('data-counter') || 0);
    const duration = 1600;
    const start = performance.now();

    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);

      el.textContent = Math.round(target * eased).toLocaleString();

      if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !e.target.dataset.done) {
          e.target.dataset.done = '1';
          animateCounter(e.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  counters.forEach(c => io.observe(c));
})();
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();

        card.style.setProperty(
            '--x',
            `${e.clientX - rect.left}px`
        );

        card.style.setProperty(
            '--y',
            `${e.clientY - rect.top}px`
        );
    });
});
