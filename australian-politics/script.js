const video = document.getElementById('trackerVideo');
let duration = 0;
let target = 0.5;
let current = 0.5;
let seeking = false;

function setDuration() {
  if (Number.isFinite(video.duration) && video.duration > 0) {
    duration = video.duration;
    video.currentTime = duration * 0.5;
  }
}
video.addEventListener('loadedmetadata', setDuration);
video.pause();
setDuration();

document.addEventListener('mousemove', (event) => {
  target = Math.max(0, Math.min(1, event.clientX / window.innerWidth));
});

document.addEventListener('touchmove', (event) => {
  const touch = event.touches[0];
  if (touch) target = Math.max(0, Math.min(1, touch.clientX / window.innerWidth));
}, { passive: true });

video.addEventListener('timeupdate', () => {
  if (!seeking) video.pause();
});
video.addEventListener('seeked', () => { seeking = false; });

function seek() {
  if (!duration || seeking) return;
  const desired = Math.max(0, Math.min(duration - 0.06, current * duration));
  if (Math.abs(video.currentTime - desired) > 0.018) {
    seeking = true;
    video.currentTime = desired;
  }
}

function animateTracker() {
  current += (target - current) * 0.12;
  seek();
  requestAnimationFrame(animateTracker);
}
animateTracker();

// Mobile navigation
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('nav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

// Simple neutral topic explainer
const topicDetail = document.getElementById('topicDetail');
const topicDescriptions = {
  'Cost of living': 'Federal policy can affect household finances through taxes, transfers, prices, wages policy and competition settings.',
  'Housing': 'Federal policy can influence housing through taxation, funding agreements, migration settings, social housing programs and financial regulation.',
  'Health': 'Federal responsibilities include Medicare, medicines, parts of aged care and funding arrangements with states and territories.',
  'Education': 'The Commonwealth has major roles in university funding, student support and national agreements, while states and territories run government schools.',
  'Climate and energy': 'Federal decisions can shape emissions policy, energy markets, infrastructure, resources and environmental programs.',
  'Defence and foreign affairs': 'The Commonwealth manages defence, international relations, trade policy and many national security responsibilities.'
};
document.querySelectorAll('.topic').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.topic').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    const name = button.dataset.topic;
    topicDetail.textContent = topicDescriptions[name] || '';
  });
});
