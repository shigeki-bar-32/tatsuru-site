    //ドロワーボタン
  (() => {
    const btn = document.querySelector('#js-drawer-button');
    const drawer = document.querySelector('#js-drawer-content');
    if (!btn || !drawer) return;
  
    // overlay がなければ作る
    let overlay = document.querySelector('.drawer-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'drawer-overlay';
      overlay.hidden = true;
      document.body.appendChild(overlay);
    }
   
     //ハンバーガーボタン
    const open = () => {
      btn.classList.add('is-checked');
      drawer.classList.add('is-checked');
      overlay.hidden = false;
      // small delay so CSS transition can start
      setTimeout(() => overlay.classList.add('is-visible'), 10);
      document.addEventListener('keydown', onKey);
    };
    const close = () => {
      btn.classList.remove('is-checked');
      drawer.classList.remove('is-checked');
      overlay.classList.remove('is-visible');
      document.removeEventListener('keydown', onKey);
      // match your CSS transition duration (ms)
      setTimeout(() => overlay.hidden = true, 400);
    };
    const onKey = e => { if (e.key === 'Escape') close(); };
  
    // toggle button
    btn.addEventListener('click', e => {
      e.preventDefault();
      drawer.classList.contains('is-checked') ? close() : open();
    });
  
    // overlay をクリックすれば閉じる
    overlay.addEventListener('click', close);
  
    // メニュー外クリック（画面のどこを押しても閉じる）
    document.addEventListener('click', (e) => {
      if (!drawer.classList.contains('is-checked')) return;
      if (drawer.contains(e.target) || btn.contains(e.target)) return;
      close();
    }, true); // capture: true で早めに検出
  
    // メニュー内リンクで閉じる
    drawer.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', close));
  })();
  
  //Lifestyle Swiper 初期化
  const sc = document.querySelector('.gallery-swiper');
  sc?.addEventListener('ready', () => {
    const sw = sc.swiper;
    const pauseAll = () => sc.querySelectorAll('video').forEach(v => { try { v.pause(); } catch {} });
    sw.on('init', pauseAll);
    sw.on('slideChangeTransitionStart', pauseAll);
  });

//星と流れ星
document.addEventListener('DOMContentLoaded', () => {

  let layer = document.querySelector('.stars');
  if (!layer) {
    layer = document.createElement('div');
    layer.className = 'stars';
    layer.setAttribute('aria-hidden','true');
    document.body.insertAdjacentElement('afterbegin', layer);
  }

  function fillStars(){

    [...layer.querySelectorAll('.star')].forEach(n => n.remove());

    const area = innerWidth * innerHeight;
    const DPR  = Math.min(devicePixelRatio || 1, 2);
    const BASE = Math.round(area / 9000);
    const COUNT = Math.min(380, Math.max(160, Math.round(BASE * (DPR > 1 ? 1.15 : 1))));
    for (let i = 0; i < COUNT; i++){
      const el = document.createElement('span');
      el.className = 'star';
      const size = 1 + Math.random() * 1.8; // 1〜2.8px
      el.style.width  = `${size}px`;
      el.style.height = `${size}px`;
      el.style.left   = `${Math.random()*100}%`;
      el.style.top    = `${Math.random()*100}%`;
      el.style.animationDelay    = `${(Math.random()*8).toFixed(2)}s`;
      el.style.animationDuration = `${(3.5 + Math.random()*4).toFixed(2)}s`;
      layer.appendChild(el);
    }
  }
  fillStars();
  let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(fillStars, 200); }, {passive:true});


  const mediaReduce = matchMedia('(prefers-reduced-motion: reduce)');
  let activeShoot = 0, activeComet = 0;
  const MAX_SHOOT = innerWidth < 768 ? 2 : 3; // 同時本数（流れ星）
  const MAX_COMET = 1;                         // 同時本数（彗星）

  function spawnShooting(){
    if (mediaReduce.matches || !document.body.contains(layer)) return;
    if (activeShoot < MAX_SHOOT){
      const el = document.createElement('span');
      el.className = 'shooting-star';

      const dir = Math.random() < 0.5 ? 1 : -1;
      const baseRot = dir === 1 ? (-35 + Math.random()*18) : (215 + Math.random()*18); // 右下 or 左下
      const y  = 10 + Math.random()*60;
      const x  = dir === 1 ? (-15 + Math.random()*10) : (105 - Math.random()*10);
      const dur = (0.9 + Math.random()*1.4).toFixed(2) + 's';

      el.style.setProperty('--y', y + '%');
      el.style.setProperty('--x', x + '%');
      el.style.setProperty('--rot', baseRot + 'deg');
      el.style.setProperty('--dur', dur);

      layer.appendChild(el);
      activeShoot++;
      el.addEventListener('animationend', () => { el.remove(); activeShoot--; });
    }
    setTimeout(spawnShooting, 2000 + Math.random()*3500); // 2.0〜5.5秒
  }

  function spawnComet(){
    if (mediaReduce.matches || !document.body.contains(layer)) return;
    if (activeComet < MAX_COMET){
      const el = document.createElement('span');
      el.className = 'comet';

      const dir = Math.random() < 0.5 ? 1 : -1;
      const baseRot = dir === 1 ? (-25 + Math.random()*12) : (205 + Math.random()*12);
      const y  = 18 + Math.random()*56;
      const x  = dir === 1 ? (-20 + Math.random()*6) : (112 - Math.random()*6);
      const dur = (1.6 + Math.random()*1.8).toFixed(2) + 's';

      el.style.setProperty('--y', y + '%');
      el.style.setProperty('--x', x + '%');
      el.style.setProperty('--rot', baseRot + 'deg');
      el.style.setProperty('--dur', dur);

      layer.appendChild(el);
      activeComet++;
      el.addEventListener('animationend', () => { el.remove(); activeComet--; });
    }
    setTimeout(spawnComet, 5000 + Math.random()*9000); // 5〜14秒に1本
  }

  spawnShooting();
  spawnComet();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden){ spawnShooting(); spawnComet(); }
  });
});
  // 年号
  document.getElementById('year').textContent = new Date().getFullYear();

  // スムーススクロール（#top を body の先頭に付けておくと確実）
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const id = a.getAttribute('href');
      const el = document.querySelector(id);
      if(el){
        e.preventDefault();
        el.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });
 
  //footer
  function scrollToTop(duration = 500) {
    const startY = window.scrollY || document.documentElement.scrollTop;
    const startTime = performance.now();
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

    function frame(now) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(t);
      const y = startY * (1 - eased);
      window.scrollTo(0, y);
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // footerボタンに紐付け（あなたのセレクタに合わせて）
  const toTop = document.querySelector('.to-top');
  if (toTop) {
    toTop.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToTop(600); // ★ ここで速度変更（例: 600ms）
    });
  }













