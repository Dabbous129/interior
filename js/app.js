
// Studio Nova v4 - Premium interactions
document.addEventListener('DOMContentLoaded', function () {
  var body = document.body;

  // Progress bar
  var progress = document.getElementById('progress');
  function updateProgress(){
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var pct = (window.scrollY / h) * 100;
    if (isNaN(pct)) pct = 0;
    progress.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress);
  updateProgress();

  // Dark mode toggle with little rotation animation
  var modeBtn = document.getElementById('modeToggle');
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) body.classList.add('dark');
  if (modeBtn) {
    modeBtn.addEventListener('click', function () {
      body.classList.toggle('dark');
      modeBtn.animate([{transform:'rotate(0deg)'},{transform:'rotate(360deg)'}],{duration:600});
      modeBtn.setAttribute('aria-pressed', String(body.classList.contains('dark')));
    });
  }

  // mobile nav
  function initNav(toggleId) {
    var btn = document.getElementById(toggleId);
    if (!btn) return;
    btn.addEventListener('click', function () {
      var nav = document.querySelector('.nav');
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if (nav) nav.style.display = expanded ? '' : 'flex';
    });
  }
  ['navToggle','navToggleAbout','navTogglePort','navToggleServ','navToggleContact'].forEach(initNav);

  // ripple effect for buttons
  document.querySelectorAll('.btn').forEach(function(b){
    b.addEventListener('click', function(e){
      var rect = b.getBoundingClientRect();
      var ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top = (e.clientY - rect.top) + 'px';
      ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
      b.appendChild(ripple);
      setTimeout(function(){ ripple.remove(); }, 700);
    });
  });

  // Parallax - small translation on scroll for hero image
  var heroImg = document.querySelector('.hero-visual img');
  function parallax() {
    if (!heroImg) return;
    var scrolled = window.scrollY;
    heroImg.style.transform = 'translateY(' + (scrolled * -0.06) + 'px) scale(1.02)';
  }
  window.addEventListener('scroll', parallax);
  parallax();

  // reveal on scroll with stagger
  var reveals = Array.from(document.querySelectorAll('.reveal'));
  function checkReveal(){
    var h = window.innerHeight;
    reveals.forEach(function(el, i){
      var r = el.getBoundingClientRect();
      if (r.top < h - 80 && !el.classList.contains('show')) {
        setTimeout(function(){ el.classList.add('show'); }, i * 90);
      }
    });
  }
  checkReveal();
  window.addEventListener('scroll', checkReveal);

  // Animated filter transitions: fade out then hide, fade in show
  var filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
  var items = Array.from(document.querySelectorAll('.item'));
  filterBtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      var cat = btn.dataset.cat;
      filterBtns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      // animate items
      items.forEach(function(it){
        it.classList.add('hidden');
      });
      setTimeout(function(){
        items.forEach(function(it){
          if (cat === 'all' || it.dataset.cat === cat) it.classList.remove('hidden');
          else it.classList.add('hidden');
        });
      }, 180); // small delay to allow fade
    });
  });

  // Lightbox: click to open, click outside or ESC to close, fade and scale
  var lb = document.querySelector('.lightbox');
  var lbImg = document.querySelector('.lightbox img');
  var lbClose = document.querySelector('.lb-close');
  function openLightbox(src){
    if (!lb) return;
    lbImg.src = src;
    lb.classList.add('show');
    lb.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    setTimeout(function(){ lb.querySelector('.content').focus?.(); }, 200);
  }
  function closeLightbox(){
    if (!lb) return;
    lb.classList.remove('show');
    lb.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    lbImg.src = '';
  }
  document.querySelectorAll('.item, .media-card').forEach(function(el){
    el.addEventListener('click', function(e){
      var img = el.querySelector('img');
      if (img) openLightbox(img.src);
    });
  });
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lb) lb.addEventListener('click', function(e){ if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeLightbox(); });

  // contact form prototype validation + nicer alert
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      var name = contactForm.querySelector('#name').value.trim();
      var email = contactForm.querySelector('#email').value.trim();
      var message = contactForm.querySelector('#message').value.trim();
      if (!name || !email || !message) {
        // nicer inline message
        var err = document.getElementById('formError');
        if (!err) {
          err = document.createElement('div'); err.id='formError';
          err.style.color = '#b00020'; err.style.marginTop='10px'; err.textContent='Please complete name, email, and message.';
          contactForm.appendChild(err);
        }
        return;
      }
      // success toast (simple)
      var toast = document.createElement('div');
      toast.textContent = 'Thanks, ' + name + '! Your message is sent (prototype).';
      toast.style.position='fixed'; toast.style.right='18px'; toast.style.bottom='18px';
      toast.style.background='linear-gradient(90deg,var(--teal),var(--coral))'; toast.style.color='white'; toast.style.padding='12px 16px'; toast.style.borderRadius='10px'; toast.style.boxShadow='0 12px 30px rgba(12,24,24,0.12)';
      document.body.appendChild(toast);
      setTimeout(function(){ toast.remove(); }, 2400);
      contactForm.reset();
      var err = document.getElementById('formError'); if (err) err.remove();
    });
  }

  // animate house stroke on load
  var house = document.getElementById('house');
  if (house) {
    var len = house.getTotalLength();
    house.style.strokeDasharray = len;
    house.style.strokeDashoffset = len;
    setTimeout(function(){ house.style.transition='stroke-dashoffset 1.2s ease-out'; house.style.strokeDashoffset = '0'; }, 450);
  }
});
