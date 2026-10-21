(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var STEPS = [
    { t: 'Visitors', s: 'Customers arrive', p: "Customers open Ravi's shopping website on their phones and laptops.", k: 'Clients sending HTTP/HTTPS requests over the internet.', w: 'Envelopes travel from the visitors into the internet.' },
    { t: 'DNS', s: 'Finding the address', p: 'Typing ravi-shop.com is like looking up a name in a phone book. The phone book says: call the receptionist.', k: 'Amazon Route 53 resolves the domain (alias record) to the load balancer DNS name.', w: 'A question goes up to Route 53 and the answer comes back toward the load balancer.' },
    { t: 'Application Load Balancer', s: 'The receptionist', p: 'The receptionist greets every visitor and decides which server should help them, so no single server gets swamped.', k: 'Application Load Balancer (ALB): a layer 7 balancer for HTTP/HTTPS, spread over two Availability Zones.', w: 'Envelopes now reach the teal receptionist box.' },
    { t: 'Listener', s: 'Doors and rules', p: 'The receptionist has two doors: 80 for plain web and 443 for secure web. Rules on the wall say where each visitor goes.', k: 'Listener: checks for connections on a port and protocol, then applies rules (forward, redirect, fixed response).', w: 'Envelopes pass the gold listener. Port 80 redirects to 443.' },
    { t: 'Target Group', s: 'The team of servers', p: 'The servers who do the work are kept in one team list, placed in two different buildings for safety.', k: 'Target group: registered EC2 instances in two Availability Zones, with a health check setting.', w: 'The purple group appears with EC2 web-1 and web-2, one per zone.' },
    { t: 'Traffic Distribution', s: 'Sharing the load', p: 'Each new customer is sent to a server that is ready. Work is shared fairly, and each server sends back an answer.', k: 'Round robin routing across healthy targets in multiple AZs. Responses return through the ALB.', w: 'Carts go to both servers. Packages come back.' },
    { t: 'Health Checks', s: 'Spotting a sick server', p: 'The receptionist keeps asking each server, "Are you OK?" A server that stops answering is skipped until it recovers.', k: 'Health checks (path, interval, thresholds) mark targets healthy or unhealthy; only healthy ones get requests.', w: 'Web-2 turns red. New carts all go to web-1.' },
    { t: 'Scaling', s: 'Hiring more help', p: 'On a busy day, a new server is started automatically. It only joins the team after it proves it is healthy.', k: 'Auto Scaling Group launches an EC2 instance and registers it in the target group once health checks pass.', w: 'Web-3 appears, passes its check, and starts receiving carts.' },
    { t: 'Complete Architecture', s: 'The full picture', p: 'Visitor, phone book, receptionist, doors, team list, healthy servers. Security guards and a watchful monitor surround it.', k: 'Route 53 → ALB (TLS termination, security group) → listener → target group → healthy EC2 (security group) + CloudWatch metrics.', w: 'The shield shows HTTPS, dashed orange lines are security groups, and the chart goes to CloudWatch.' }
  ];
  // emoji, path id, firstStep, lastStep, duration s, begin s, tag, reverse
  var PK = [
    ['✉️', 'pEnv1', 1, 2, 2.5, 0], ['✉️', 'pEnv1', 1, 2, 2.5, 1.25],
    ['❓', 'pDq', 2, 2, 2.5, 0], ['📍', 'pDa', 2, 2, 2.5, 1.2],
    ['✉️', 'pEnv', 3, 3, 2.5, 0], ['✉️', 'pEnv', 3, 3, 2.5, 1.25],
    ['✉️', 'pEnv2', 4, 9, 3, 0], ['✉️', 'pEnv2', 4, 9, 3, 1.5],
    ['🛒', 'pT1', 6, 9, 2.4, 0, 'A'], ['📦', 'pT1', 6, 9, 2.4, 1.2, 'A', 1],
    ['🛒', 'pT1', 6, 9, 2.4, 2.4, 'A2'], ['📦', 'pT1', 6, 9, 2.4, 3.6, 'A2', 1],
    ['🛒', 'pT2', 6, 9, 2.4, 1.2, 'B'], ['📦', 'pT2', 6, 9, 2.4, 2.4, 'B', 1],
    ['🛒', 'pT3', 8, 9, 3.4, 0.6, 'C'], ['📦', 'pT3', 8, 9, 3.4, 2.4, 'C', 1],
    ['🛡️', 'pEnv2', 9, 9, 3, 0.75],
    ['📊', 'pCW', 9, 9, 2, 0]
  ];
  var $ = function (id) { return document.getElementById(id); };
  var svg = $('svg'), pkG = $('packets');
  var step = 1, timer = null, failed = false, checking = false, c3ok = false, c3timer = null, ckTimer = null;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revs = [].slice.call(svg.querySelectorAll('.rev'));

  var stars = $('stars');
  for (var i = 0; i < 70; i++) {
    var c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', (i * 137.5) % 1100); c.setAttribute('cy', (i * 71.3 + 13) % 620);
    c.setAttribute('r', (i % 3) * 0.6 + 0.6); c.setAttribute('opacity', 0.25 + (i % 4) * 0.12);
    stars.appendChild(c);
  }
  var pkEls = PK.map(function (d) {
    var g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'pk');
    var t = document.createElementNS(NS, 'text');
    t.setAttribute('font-size', 22); t.setAttribute('text-anchor', 'middle'); t.setAttribute('dy', 8); t.textContent = d[0];
    var m = document.createElementNS(NS, 'animateMotion');
    m.setAttribute('dur', d[4] + 's'); m.setAttribute('begin', d[5] + 's'); m.setAttribute('repeatCount', 'indefinite');
    if (d[7]) { m.setAttribute('keyPoints', '1;0'); m.setAttribute('keyTimes', '0;1'); m.setAttribute('calcMode', 'linear'); }
    var mp = document.createElementNS(NS, 'mpath'); mp.setAttribute('href', '#' + d[1]); m.appendChild(mp);
    g.appendChild(t); g.appendChild(m); pkG.appendChild(g);
    return g;
  });

  var ol = $('steps');
  STEPS.forEach(function (s, i) {
    var li = document.createElement('li'), b = document.createElement('button');
    b.type = 'button'; b.className = 'step';
    b.innerHTML = '<span class="n">' + (i + 1) + '</span><span><b>' + s.t + '</b><small>' + s.s + '</small></span>';
    b.addEventListener('click', function () { pause(); go(i + 1); });
    li.appendChild(b); ol.appendChild(li);
  });
  var btns = [].slice.call(ol.querySelectorAll('.step'));

  function setFailUI() {
    $('ec2bRect').setAttribute('class', 'ec2 ' + (failed ? 'bad' : 'ok'));
    $('ec2bTxt').textContent = checking ? 'checking…' : (failed ? 'unhealthy' : 'healthy');
    $('chk2').setAttribute('display', failed ? 'none' : 'inline');
    $('x2').setAttribute('display', failed ? 'inline' : 'none');
    var fb = $('failBtn');
    fb.disabled = step < 6 || checking;
    fb.textContent = checking ? 'Health check running…' : (failed ? 'Restore server (run health check)' : 'Fail a server');
    fb.className = 'btn ' + (failed ? '' : 'danger');
  }
  function c3UI() {
    $('ec2cRect').setAttribute('class', 'ec2 ' + (c3ok ? 'ok' : 'launch'));
    $('ec2cTxt').textContent = c3ok ? 'healthy' : 'starting…';
    $('chk3').setAttribute('display', c3ok ? 'inline' : 'none');
  }
  function packets() {
    PK.forEach(function (d, i) {
      var on = step >= d[2] && step <= d[3], tag = d[6];
      if (tag === 'B' && failed) on = false;
      if (tag === 'A2' && !failed) on = false;
      if (tag === 'C' && !c3ok) on = false;
      pkEls[i].setAttribute('class', 'pk' + (on ? '' : ' hide'));
    });
  }
  function render(prev) {
    revs.forEach(function (el) {
      var n = +el.getAttribute('data-step'), show = step >= n;
      el.classList.toggle('show', show);
      el.classList.remove('glow');
      if (show && n === step && prev !== step) { void el.getBoundingClientRect(); el.classList.add('glow'); }
    });
    var on9 = step >= 9 ? 1 : 0;
    $('sgAlb').setAttribute('opacity', on9); $('ec2sg').setAttribute('opacity', on9);
    btns.forEach(function (b, i) {
      if (i + 1 === step) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      b.classList.toggle('done', i + 1 < step);
    });
    var s = STEPS[step - 1];
    $('capTitle').textContent = step + '. ' + s.t;
    $('capPlain').textContent = s.p; $('capTech').textContent = s.k;
    $('capWatch').textContent = s.w + (step >= 6 && failed ? ' Web-2 is unhealthy, so its customers go to web-1.' : '');
    setFailUI(); c3UI(); packets();
  }
  function go(n) {
    var prev = step; step = Math.max(1, Math.min(9, n));
    clearTimeout(c3timer); clearTimeout(ckTimer);
    failed = step === 7; checking = false; c3ok = step > 8;
    if (step === 8) c3timer = setTimeout(function () { c3ok = true; render(step); }, 2500);
    render(prev);
  }
  function play() {
    if (timer) return;
    if (step >= 9) go(1);
    timer = setInterval(function () { if (step >= 9) pause(); else go(step + 1); }, 5000);
  }
  function pause() { clearInterval(timer); timer = null; }
  $('playBtn').addEventListener('click', play);
  $('pauseBtn').addEventListener('click', pause);
  $('resetBtn').addEventListener('click', function () { pause(); go(1); });
  $('failBtn').addEventListener('click', function () {
    if (checking) return;
    if (!failed) { failed = true; render(step); return; }
    checking = true; render(step);
    ckTimer = setTimeout(function () { failed = false; checking = false; render(step); }, 2000);
  });
  $('themeBtn').addEventListener('click', function () {
    var d = document.documentElement, light = d.getAttribute('data-theme') !== 'light';
    d.setAttribute('data-theme', light ? 'light' : 'dark');
    this.textContent = light ? 'Dark page' : 'Light page';
  });
  if (reduce && svg.pauseAnimations) svg.pauseAnimations();
  go(1);
  if (!reduce) play();
})();
