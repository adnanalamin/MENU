(function (O) {
  'use strict';
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const navEl = () => $('#nav');

  const nav = {
    active: null,
    init() {
      this.buttons = $$('[data-menu]');
      this.ind = $('.nav__ind');
      navEl().addEventListener('click', (e) => {
        const b = e.target.closest('[data-menu]');
        if (b) { this.toggle(b.dataset.menu); return; }
        if (e.target.closest('.panel a')) this.close();
      });
      navEl().addEventListener('keydown', (e) => {
        const b = e.target.closest('[data-menu]');
        if (!b) return;
        const list = $$('.nav__link', $('.nav__list'));
        const i = list.indexOf(b);
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const nx = list[(i + (e.key === 'ArrowRight' ? 1 : -1) + list.length) % list.length];
          nx.focus();
          if (this.active && nx.dataset.menu) this.open(nx.dataset.menu);
        } else if (e.key === 'ArrowDown' && b.dataset.menu) {
          e.preventDefault();
          this.open(b.dataset.menu);
          const f = $('#panel-' + b.dataset.menu + ' a, #panel-' + b.dataset.menu + ' button');
          if (f) f.focus();
        }
      });
      document.addEventListener('click', (e) => {
        if (this.active && !e.target.closest('#nav')) this.close();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (this.active) {
          const b = $('[data-menu="' + this.active + '"]');
          this.close();
          b.focus();
        }
        this.mobile.close();
      });
      window.addEventListener('resize', () => {
        if (this.active) { this.close(); }
        if (window.innerWidth > 900) this.mobile.close();
      });
      this.mobile.init();
    },
    toggle(name) { this.active === name ? this.close() : this.open(name); },
    open(name) {
      if (this.active === name) return;
      this.close(true);
      const btn = $('[data-menu="' + name + '"]');
      const p = $('#panel-' + name);
      btn.setAttribute('aria-expanded', 'true');
      this.place(p, btn);
      p.classList.add('is-open');
      this.indicate(btn);
      this.active = name;
      if (name === 'services') O.orbit.start();
    },
    close(keep) {
      if (!this.active) return;
      const btn = $('[data-menu="' + this.active + '"]');
      const p = $('#panel-' + this.active);
      btn.setAttribute('aria-expanded', 'false');
      p.classList.remove('is-open');
      p.querySelector('.panel__body').style.removeProperty('--tx');
      p.querySelector('.panel__body').style.removeProperty('--ty');
      O.orbit.stop();
      this.active = null;
      if (!keep) this.ind.classList.remove('on');
    },
    place(p, btn) {
      const nr = navEl().getBoundingClientRect();
      const br = btn.getBoundingClientRect();
      const w = p.offsetWidth;
      const cx = br.left + br.width / 2;
      const abs = Math.max(12, Math.min(cx - w / 2, window.innerWidth - 12 - w));
      p.style.left = (abs - nr.left) + 'px';
      p.style.transformOrigin = (cx - abs) + 'px 0';
    },
    indicate(btn) {
      const lr = btn.closest('.nav__list').getBoundingClientRect();
      const br = btn.getBoundingClientRect();
      this.ind.style.setProperty('--x', (br.left - lr.left + 12) + 'px');
      this.ind.style.setProperty('--w', (br.width - 24) + 'px');
      this.ind.classList.add('on');
    },
    mobile: {
      isOpen: false,
      init() {
        this.el = $('#mobile'); this.burger = $('#burger');
        this.burger.addEventListener('click', () => this.open());
        $('#mclose').addEventListener('click', () => { this.close(); this.burger.focus(); });
        this.el.addEventListener('click', (e) => {
          const acc = e.target.closest('.acc > button');
          if (acc) {
            const li = acc.parentElement;
            const open = !li.classList.contains('open');
            $$('.acc.open', this.el).forEach((x) => { x.classList.remove('open'); $('button', x).setAttribute('aria-expanded', 'false'); });
            li.classList.toggle('open', open);
            acc.setAttribute('aria-expanded', String(open));
            return;
          }
          if (e.target.closest('[data-close]')) this.close();
        });
        this.el.addEventListener('keydown', (e) => {
          if (e.key !== 'Tab') return;
          const f = $$('a[href],button', this.el).filter((x) => x.offsetParent !== null && x.getClientRects().length);
          if (!f.length) return;
          const first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        });
      },
      open() {
        nav.close();
        this.isOpen = true;
        this.el.classList.add('open');
        this.el.setAttribute('aria-hidden', 'false');
        this.burger.setAttribute('aria-expanded', 'true');
        this.burger.setAttribute('aria-label', 'Close menu');
        document.body.classList.add('lock');
        setTimeout(() => $('#mclose').focus(), 60);
      },
      close() {
        if (!this.isOpen) return;
        this.isOpen = false;
        this.el.classList.remove('open');
        this.el.setAttribute('aria-hidden', 'true');
        this.burger.setAttribute('aria-expanded', 'false');
        this.burger.setAttribute('aria-label', 'Open menu');
        document.body.classList.remove('lock');
      }
    }
  };
  O.nav = nav;
})(window.ORBIT = window.ORBIT || {});
