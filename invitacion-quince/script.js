/**
 * INVITACIÓN DIGITAL — XV AÑOS DE NARDA AYALA
 */
const CONFIG = {
  nombre: 'Narda Ayala',
  eventDate: new Date(2027, 1, 6, 22, 0, 0),
  rsvpDeadline: '05 de enero de 2027',
  whatsappNumber: '5493794405570',
  whatsappMessage: '¡Hola! Quiero confirmar mi asistencia a los XV Años de Narda Ayala. 🎉',

  ceremonia: {
    hora: '21:00 Hrs.',
    lugar: 'Iglesia Nazareno de la Compañía de Jesús',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Iglesia+Nazareno+Compañía+de+Jesús+Corrientes',
  },
  fiesta: {
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Club+de+Regatas+Corrientes+Salón+Dorado',
  },
  regalo: {
    titular: 'Alfredo Sebastian Ayala',
    alias: 'mis.15.narda',
    cbu: '3840200500000017007632',
    banco: 'Ualá Bank S.A.U.',
  },
  calendar: {
    title: 'XV Años de Narda Ayala',
    location: 'Club de Regatas de Corrientes, Corrientes, Argentina',
    details: 'Fiesta de XV Años — Salón Dorado',
  },
};

function initCountdown() {
  const els = {
    days:    document.getElementById('days'),
    hours:   document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
  };
  if (!els.days) return;
  const pad = (n) => String(n).padStart(2, '0');
  function tick() {
    const diff = CONFIG.eventDate - Date.now();
    if (diff <= 0) { Object.values(els).forEach((el) => { if (el) el.textContent = '00'; }); return; }
    const s = Math.floor(diff / 1000);
    els.days.textContent    = pad(Math.floor(s / 86400));
    els.hours.textContent   = pad(Math.floor((s % 86400) / 3600));
    els.minutes.textContent = pad(Math.floor((s % 3600) / 60));
    els.seconds.textContent = pad(s % 60);
  }
  tick();
  setInterval(tick, 1000);
}

function setMusicUI(playing) {
  const btn = document.getElementById('music-toggle');
  if (!btn) return;
  btn.classList.toggle('is-playing', playing);
  btn.setAttribute('aria-pressed', String(playing));
  btn.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproducir música');
}

async function startMusic() {
  const audio = document.getElementById('bg-music');
  if (!audio || !audio.paused) return true;
  try {
    await audio.play();
    setMusicUI(true);
    return true;
  } catch {
    return false;
  }
}

function initMusicPlayer() {
  const btn = document.getElementById('music-toggle');
  const audio = document.getElementById('bg-music');
  if (!btn || !audio) return;

  startMusic();
  ['click', 'touchstart', 'scroll', 'keydown'].forEach((ev) => {
    document.addEventListener(ev, () => startMusic(), { once: true, passive: true });
  });

  btn.addEventListener('click', async () => {
    if (audio.paused) await startMusic();
    else { audio.pause(); setMusicUI(false); }
  });
}

function initMapsButtons() {
  [['btn-maps-ceremonia', CONFIG.ceremonia.mapsUrl], ['btn-maps-fiesta', CONFIG.fiesta.mapsUrl]].forEach(([id, url]) => {
    document.getElementById(id)?.addEventListener('click', () => window.open(url, '_blank', 'noopener,noreferrer'));
  });
}

function initWhatsAppRSVP() {
  const btn = document.getElementById('btn-rsvp');
  if (!btn) return;
  btn.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;
}

function initRegalo() {
  const toggle = document.getElementById('btn-regalo');
  const extra  = document.getElementById('regalo-extra');
  const fields = {
    'regalo-titular': CONFIG.regalo.titular,
    'regalo-banco':   CONFIG.regalo.banco,
    'regalo-alias':   CONFIG.regalo.alias,
    'regalo-cbu':     CONFIG.regalo.cbu,
  };
  Object.entries(fields).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  });

  toggle?.addEventListener('click', () => {
    const open = extra.hidden;
    extra.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Ocultar datos' : 'Ver datos';
  });

  document.getElementById('btn-copy-alias')?.addEventListener('click', async () => {
    const btn = document.getElementById('btn-copy-alias');
    try {
      await navigator.clipboard.writeText(CONFIG.regalo.alias);
      btn.textContent = '¡Copiado!';
      setTimeout(() => { btn.textContent = 'Copiar alias'; }, 2000);
    } catch {
      btn.textContent = CONFIG.regalo.alias;
    }
  });
}

function initSongForm() {
  document.getElementById('song-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('song-input');
    const song = input?.value.trim();
    if (!song) return;
    const msg = encodeURIComponent(`¡Hola! Sugiero esta canción para los XV de Narda Ayala: "${song}" 🎵`);
    window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${msg}`, '_blank', 'noopener,noreferrer');
    input.value = '';
  });
}

function initCalendarLink() {
  const btn = document.getElementById('btn-calendar');
  if (!btn) return;
  const start = CONFIG.eventDate;
  const end = new Date(start.getTime() + 5 * 60 * 60 * 1000);
  const fmt = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const params = new URLSearchParams({
    action: 'TEMPLATE', text: CONFIG.calendar.title,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: CONFIG.calendar.details, location: CONFIG.calendar.location,
  });
  btn.href = `https://calendar.google.com/calendar/render?${params}`;
}

function initEnvelopeCover() {
  const cover = document.getElementById('envelope-cover');
  if (!cover) return;
  const openCover = () => {
    cover.style.opacity = '0';
    document.body.classList.remove('cover-open');
    setTimeout(() => {
      cover.hidden = true;
      cover.style.display = 'none';
    }, 250);
  };

  cover.addEventListener('click', openCover);
  cover.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openCover();
    }
  });
}

function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-in');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  els.forEach((el) => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initMusicPlayer();
  initMapsButtons();
  initWhatsAppRSVP();
  initRegalo();
  initSongForm();
  initCalendarLink();
  initEnvelopeCover();
  initScrollAnimations();
});
