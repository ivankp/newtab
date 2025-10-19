const $ = (p, ...args) => {
  if (p.constructor === String) {
    p = document.getElementById(p);
  }
  for (let x of args) {
    if (x.constructor === String) {
      p = p.appendChild( (p instanceof SVGElement || x==='svg')
        ? document.createElementNS('http://www.w3.org/2000/svg', x)
        : document.createElement(x)
      );
    // } else if (x.nodeType === Node.ELEMENT_NODE) {
    //   p.appendChild(x);
    } else if (x.constructor === Array) {
      p.classList.add(...x);
    } else if (x.constructor === Function) {
      x(p);
    } else if (x.constructor === Object) {
      for (const [key,val] of Object.entries(x)) {
        if (key==='style') {
          for (const [k,v] of Object.entries(val)) {
            if (v!==null) p.style[k] = v;
            else p.style.removeProperty(k);
          }
        } else if (key==='events') {
          for (const [k,v] of Object.entries(val)) {
            if (v!==null) p.addEventListener(k,v);
            else p.removeEventListener(k);
          }
        } else if (key==='text') {
          p.textContent = val;
        } else {
          if (val!==null) {
            if (p instanceof SVGElement)
              p.setAttributeNS(null,key,val);
            else
              p.setAttribute(key,val);
          } else {
            if (p instanceof SVGElement)
              p.removeAttributeNS(null,key);
            else
              p.removeAttribute(key);
          }
        }
      }
    }
  }
  return p;
};
const $$ = (...args) => p => $(p, ...args);

const weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const months = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sep','Oct','Nov','Dec'];

var clock, date;
const time = () => {
  const t = new Date();
  const ms = t.getMilliseconds();
  const s  = t.getSeconds();
  const m  = t.getMinutes();
  let   h  = t.getHours();
  const p  = h >= 12 ? (h -= 12, 'PM') : 'AM';
  if (h === 0) h = 12;
  clock.textContent = `${h}:${m<10?'0':''}${m} ${p}`;
  date .textContent =
    `${weekdays[t.getDay()]}, ${months[t.getMonth()]} ${t.getDate()}, ${t.getFullYear()}`;
  return 60000 - (ms + s*1000);
}

const make_shortcuts = () => {
  const table = $('shortcuts','table');
  for (const [k,v] of Object.entries(shortcuts)) {
    $(table,'tr',
      $$('td',{ text: `[${k}]` }),
      $$('td','a',{ href: v[0], text: v[1] })
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  clock = $('clock');
  date  = $('date');
  (function refresh_time() { setTimeout(refresh_time, time()); })();
  $('browser').textContent = navigator.userAgent;
  make_shortcuts();
  make_work();
});

document.addEventListener("keypress", e => {
  if (e.key==='?') {
    navigator.clipboard.readText().then( x => {
      window.location.href = 'https://www.google.com/search?q=' + encodeURIComponent(x);
    });
  } else {
    const x = shortcuts[e.key];
    if (x) window.location.href = x[0];
  }
});
