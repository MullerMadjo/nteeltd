
    /* Utilities */
    const qs = s => document.querySelector(s);
    const qsa = s => Array.from(document.querySelectorAll(s));

    /* Theme (robust) */
    const root = document.documentElement;
    const THEME_KEY = 'ntee-theme';
    const themeToggle = qs('#themeToggle');
    const mobileTheme = qs('#mobileTheme');
    function setTheme(mode){
      root.setAttribute('data-theme', mode);
      try{ localStorage.setItem(THEME_KEY, mode); } catch(e){}
      const icon = mode === 'dark' ? 'fa-sun' : 'fa-moon';
      [themeToggle, mobileTheme].forEach(el => {
        if(!el) return;
        const i = el.querySelector('i');
        if(i) i.className = 'fa-solid ' + icon;
      });
    }
    const stored = (() => { try { return localStorage.getItem(THEME_KEY); } catch(e){ return null; } })();
    const preferred = stored || ((window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light');
    setTheme(preferred);

    themeToggle && themeToggle.addEventListener('click', ()=> setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
    mobileTheme && mobileTheme.addEventListener('click', e => { e.preventDefault(); setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); });

    /* Burger & mobile menu */
    const burger = qs('#burger');
    const mobileMenu = qs('#mobileMenu');
    burger && burger.addEventListener('click', ()=>{
      const open = burger.classList.toggle('active');
      mobileMenu.classList.toggle('open', open);
      mobileMenu.setAttribute('aria-hidden', !open);
      burger.setAttribute('aria-expanded', !!open);
    });
    qsa('#mobileMenu a').forEach(a => a.addEventListener('click', ()=>{
      burger.classList.remove('active');
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden','true');
      burger.setAttribute('aria-expanded','false');
    }));

    /* Reveal on scroll */
    const io = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    qsa('.reveal').forEach(el => io.observe(el));

    /* Jobs filtering */
    const cityFilter = qs('#cityFilter');
    const categoryFilter = qs('#categoryFilter');
    function applyFilters(){
      const city = cityFilter?.value || 'all';
      const cat = categoryFilter?.value || 'all';
      qsa('#jobsList .job').forEach(card=>{
        const matchCity = (city === 'all') || (card.dataset.city === city);
        const matchCat = (cat === 'all') || (card.dataset.category === cat);
        card.classList.toggle('hidden', !(matchCity && matchCat));
      });
    }
    cityFilter && cityFilter.addEventListener('change', applyFilters);
    categoryFilter && categoryFilter.addEventListener('change', applyFilters);

    /* Year */
    qs('#year') && (qs('#year').textContent = new Date().getFullYear());
  