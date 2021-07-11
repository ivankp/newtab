const _id = id => document.getElementById(id);
function make(p,...tags) {
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
      = navigator.userAgent.match(/(?<=^|\s)(Chrom\S+\/\S+)/)[1];
  }
});
