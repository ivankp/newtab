const _id = id => document.getElementById(id);
function $(p,...tags) {
  for (const t of tags)
    p = p.appendChild(document.createElement(t))
  return p;
}
function clear(x) {
  for (let c; c = x.firstChild; ) x.removeChild(c);
  return x;
}

const weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const months = [
  'Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];

function time(clock,date) {
  const t = new Date();
  const ms = t.getMilliseconds();
  const s  = t.getSeconds();
  const m  = t.getMinutes();
  let   h  = t.getHours();
  const p  = h>12 ? (h-=12, 'pm') : 'am';
  clock.textContent = `${h}:${m<10?'0':''}${m}${p}`;
  date .textContent =
    `${weekdays[t.getDay()]}, ${months[t.getMonth()]} ${t.getDate()}, ${t.getFullYear()}`;
  return 60000 - (ms + s*1000);
}

const shortcuts = {
  'g': ['https://mail.google.com/mail/u/0/#inbox', 'gmail'],
  'c': ['https://calendar.google.com/calendar/u/0/r/week', 'calendar'],
  'd': ['https://docs.google.com/document/u/0/', 'documents'],
  'l': ['https://www.linkedin.com/', 'linkedin'],
  'f': ['https://www.facebook.com/', 'facebook'],
  'm': ['https://www.facebook.com/messages/', 'messages'],
  'h': ['https://github.com/ivankp?tab=repositories', 'github'],
  's': ['https://stackoverflow.com/users/2640636', 'stackoverflow'],
  'w': ['https://www.wolframalpha.com/', 'wolframalpha'],
  'u': ['https://www.youtube.com/', 'youtube'],
  'i': ['https://images.google.com/', 'google images'],
  'z': ['https://zooescape.com/backgammon.pl?v=200&ng=1', 'zooescape'],
};
let u = '0';
function make_shortcuts() {
  const div = clear(_id('shortcuts'));
  const t = $(div,'table');
  const tr = $(t,'tr');
  $(tr,'td').textContent = `[${u}]`;
  $(tr,'td').textContent = 'user';
  for (const [k,v] of Object.entries(shortcuts)) {
    const tr = $(t,'tr');
    $(tr,'td').textContent = `[${k}]`;
    const a = $(tr,'td','a');
    a.textContent = v[1];
    a.href = v[0].replace(/\/u\/\d\//,`/u/${u}/`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  { // time and date
    const clock = _id('clock');
    const date  = _id('date');
    function refresh_time_1() { return time(clock,date); }
    (function refresh_time() {
      setTimeout(refresh_time,refresh_time_1());
    })();
  }
  // { // motd
  //   fetch('http://otterness-pi.cs.unc.edu:12345/random')
  //   .then(r => r.text())
  //   .then(data => { _id('motd').textContent = data; });
  // }
  { _id('browser').textContent
      = navigator.userAgent;
      // = navigator.userAgent.match(/(?<=^|\s)(Chrom\S+\/\S+)/)[1];
  }
  make_shortcuts();
});

document.addEventListener("keypress", e => {
  if (e.key==='j') {
    for (const x of [
      'https://mail.google.com/mail/u/0/#inbox',
      'https://mail.google.com/mail/u/1/#inbox',
      'https://calendar.google.com/calendar/u/1/r/week'
    ]) window.open(x,'_blank');
    window.close();
  } else if (e.key==='?') {
    navigator.clipboard.readText().then( x => {
      window.location.href =
        'https://www.google.com/search?q='+encodeURIComponent(x);
    });
  } else {
    const x = shortcuts[e.key];
    if (x) window.location.href = x[0].replace(/\/u\/\d\//,`/u/${u}/`);
    else if (['0','1'].includes(e.key)) {
      if (e.key!==u) {
        u = e.key;
        make_shortcuts();
      }
    }
  }
});
