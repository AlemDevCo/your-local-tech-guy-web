(function () {
  const host = document.getElementById('bg');
  if (!host) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
  host.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let W = 0, H = 0;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ── Code tokens from top 5 languages ──────────────────────────────────────
  const CODE = [
    // Python
    'def','import','class','self','None','True','return','lambda','yield','print(',
    // JavaScript
    'const','let','async','await','()=>','null','this','Promise','typeof','fetch(',
    // Java
    'public','static','void','class','new','throws','extends','@Override','super(',
    // C / C++
    '#include','int','struct','printf(','nullptr','cout<<','vector<>','malloc(',
    // HTML / CSS
    '<div>','<svg>','display:','flex','@media','::before','var(--','border:',
  ];

  // ── Shape generators (points normalised ≈ –1 to 1) ────────────────────────
  function makeSphere(n) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / n);
      const th  = Math.PI * (1 + Math.sqrt(5)) * i;
      pts.push([Math.sin(phi)*Math.cos(th), Math.cos(phi), Math.sin(phi)*Math.sin(th)]);
    }
    return pts;
  }

  function makeHuman(n) {
    const pts = [];
    // Head
    const hn = Math.floor(n * 0.17);
    for (let i = 0; i < hn; i++) {
      const phi = Math.acos(1 - 2*(i+.5)/hn), th = Math.PI*(1+Math.sqrt(5))*i;
      pts.push([Math.sin(phi)*Math.cos(th)*0.17, 0.84+Math.cos(phi)*0.17, Math.sin(phi)*Math.sin(th)*0.13]);
    }
    // Neck
    for (let i = 0; i < Math.floor(n*0.03); i++) {
      const a = Math.random()*Math.PI*2;
      pts.push([Math.cos(a)*0.07, 0.58+(i/(n*0.03))*0.12, Math.sin(a)*0.05]);
    }
    // Torso
    for (let i = 0; i < Math.floor(n*0.22); i++) {
      const t = i/(n*0.22), a = Math.random()*Math.PI*2, r = 0.23-t*0.06;
      pts.push([Math.cos(a)*r, 0.56-t*0.56, Math.sin(a)*r*0.55+(Math.random()-.5)*.03]);
    }
    // Arms
    const arm = Math.floor(n*0.20);
    for (let i = 0; i < arm; i++) {
      const t = (i%(arm/2))/(arm/2), side = i<arm/2 ? -1:1;
      pts.push([side*(0.29+t*0.36), 0.49-t*0.66, (Math.random()-.5)*.08]);
    }
    // Legs
    while (pts.length < n) {
      const rem = n - pts.length, t = (pts.length%Math.ceil(rem/2))/Math.ceil(rem/2);
      const side = pts.length < n - Math.ceil(rem/2) ? -0.14:0.14;
      pts.push([side, -0.06-t*0.92, (Math.random()-.5)*.09]);
    }
    return pts;
  }

  function makeTree(n) {
    const pts = [];
    // Trunk
    for (let i = 0; i < Math.floor(n*0.12); i++) {
      const t = i/(n*0.12), a = Math.random()*Math.PI*2;
      pts.push([Math.cos(a)*0.07*(1-t*.3), -1+t*0.9, Math.sin(a)*0.07*(1-t*.3)]);
    }
    // Foliage layers
    const layers = [
      {cy:0.05, rx:0.68, ry:0.4}, {cy:0.42, rx:0.52, ry:0.36},
      {cy:0.74, rx:0.36, ry:0.30}, {cy:0.98, rx:0.20, ry:0.22},
    ];
    while (pts.length < n) {
      const l = layers[Math.floor(Math.random()*layers.length)];
      const phi = Math.random()*Math.PI, th = Math.random()*Math.PI*2;
      pts.push([Math.sin(phi)*Math.cos(th)*l.rx, l.cy+Math.cos(phi)*l.ry, Math.sin(phi)*Math.sin(th)*l.rx*.7]);
    }
    return pts;
  }

  function makeCat(n) {
    const pts = [];
    // Body
    const bn = Math.floor(n*0.37);
    for (let i = 0; i < bn; i++) {
      const phi = Math.acos(1-2*(i+.5)/bn), th = Math.PI*(1+Math.sqrt(5))*i;
      pts.push([Math.sin(phi)*Math.cos(th)*0.50, Math.cos(phi)*0.28, Math.sin(phi)*Math.sin(th)*0.22]);
    }
    // Head
    const hcn = Math.floor(n*0.18);
    for (let i = 0; i < hcn; i++) {
      const phi = Math.acos(1-2*(i+.5)/hcn), th = Math.PI*(1+Math.sqrt(5))*i;
      pts.push([0.55+Math.sin(phi)*Math.cos(th)*0.20, 0.12+Math.cos(phi)*0.20, Math.sin(phi)*Math.sin(th)*0.16]);
    }
    // Ears
    for (let i = 0; i < 32; i++) {
      const t = (i%16)/16, side = i<16?-0.10:0.10;
      pts.push([0.56-t*.05, 0.30+t*0.19, side+(Math.random()-.5)*.03]);
    }
    // Tail
    for (let i = 0; i < Math.floor(n*0.14); i++) {
      const t = i/(n*.14);
      pts.push([-0.52-t*0.36, -0.14+Math.sin(t*Math.PI*1.2)*0.46, (Math.random()-.5)*.06]);
    }
    // Legs
    const legOff = [[0.26,-0.13],[0.26,0.13],[-0.22,-0.13],[-0.22,0.13]];
    while (pts.length < n) {
      const li = Math.floor((n-pts.length-1)/(Math.ceil((n-pts.length)/4))) % 4;
      const t  = Math.random();
      pts.push([legOff[li][0]+(Math.random()-.5)*.05, -0.28-t*0.44, legOff[li][1]+(Math.random()-.5)*.04]);
    }
    return pts;
  }

  // ── Particle system ────────────────────────────────────────────────────────
  const N      = window.innerWidth < 768 ? 280 : 480;
  const SHAPES = [makeSphere(N), makeHuman(N), makeTree(N), makeCat(N)];

  const HUE = ['green','teal','blue'];
  const particles = Array.from({length: N}, (_, i) => {
    const s = SHAPES[0][i];
    return {
      x: s[0], y: s[1], z: s[2],
      tx: s[0], ty: s[1], tz: s[2],
      token: CODE[Math.floor(Math.random()*CODE.length)],
      hue:   HUE[Math.floor(Math.random()*HUE.length)],
      spd:   0.022 + Math.random()*0.032,
    };
  });

  // ── Rotation + morph state ─────────────────────────────────────────────────
  let rotY = 0, rotX = 0.18, shapeIdx = 0, elapsed = 0, prevTs = 0;
  const HOLD_MS = 5800;

  function setTargets(idx) {
    const shape = SHAPES[idx];
    particles.forEach((p, i) => {
      const s = shape[i % shape.length];
      p.tx = s[0]; p.ty = s[1]; p.tz = s[2];
    });
  }

  function rotYX(x, y, z, ry, rx) {
    const x1 =  x*Math.cos(ry) + z*Math.sin(ry);
    const z1 = -x*Math.sin(ry) + z*Math.cos(ry);
    const y2 =  y*Math.cos(rx) - z1*Math.sin(rx);
    const z2 =  y*Math.sin(rx) + z1*Math.cos(rx);
    return [x1, y2, z2];
  }

  // ── Render loop ────────────────────────────────────────────────────────────
  function frame(ts) {
    const dt = Math.min(ts - prevTs, 60);
    prevTs = ts;
    elapsed += dt;

    rotY += 0.0016;
    rotX  = 0.18 + Math.sin(ts * 0.00014) * 0.08;

    if (elapsed > HOLD_MS) {
      elapsed  = 0;
      shapeIdx = (shapeIdx + 1) % SHAPES.length;
      setTargets(shapeIdx);
    }

    // Lerp toward targets
    particles.forEach(p => {
      p.x += (p.tx - p.x) * p.spd;
      p.y += (p.ty - p.y) * p.spd;
      p.z += (p.tz - p.z) * p.spd;
    });

    // Trail clear (lower alpha = longer trail)
    ctx.fillStyle = 'rgba(2,9,16,0.22)';
    ctx.fillRect(0, 0, W, H);

    const fov   = Math.min(W, H) * 0.75;
    const camZ  = 3.2;

    // Project + depth-sort
    const sorted = particles.map(p => {
      const [rx, ry, rz] = rotYX(p.x, p.y, p.z, rotY, rotX);
      const invZ = 1 / (rz + camZ);
      return {
        px:    rx * fov * invZ + W * 0.5,
        py:   -ry * fov * invZ + H * 0.5,
        depth: (rz + 2) / 4,
        token: p.token,
        hue:   p.hue,
      };
    }).sort((a, b) => a.depth - b.depth);

    // Draw
    sorted.forEach(({px, py, depth, token, hue}) => {
      const op   = 0.22 + depth * 0.78;
      const size = Math.round(5 + depth * 8);
      ctx.font = size + "px 'JetBrains Mono','Courier New',monospace";
      if      (hue === 'green') ctx.fillStyle = `rgba(126,212,68,${op})`;
      else if (hue === 'teal')  ctx.fillStyle = `rgba(68,180,212,${op})`;
      else                      ctx.fillStyle = `rgba(110,170,255,${op})`;
      ctx.fillText(token, px, py);
    });

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
