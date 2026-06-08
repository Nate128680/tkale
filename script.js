const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

const stars = [];
const elements = [];

const phrases = [
    "Te Amo Gordita 🥹",
    "Eres Prechiocha 🥰",
    "Mi niña bella hermocha 🤗",
    "Te quiero Fea 😍",
    "Mi niñaa Prechiocha ✨"
];

const images = [
    'https://png.pngtree.com/png-vector/20220619/ourmid/pngtree-sparkling-star-vector-icon-glitter-star-shape-png-image_5228522.png'
];

const hearts = ['1.png', '2.png', '3.png', '4.png'];

let cameraX = 0;
let cameraY = 0;
let zoom = 1;
const focalLength = 300;

let isDragging = false;
let lastX = 0;
let lastY = 0;

const MAX = 18; // 🔥 CLAVE: estabilidad

function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    stars.length = 0;
    for (let i = 0; i < 150; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.2,
            a: Math.random(),
            d: 0.005 + Math.random() * 0.01
        });
    }
}

function drawBackground() {
    const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
    g.addColorStop(0, "#0a0a23");
    g.addColorStop(1, "#0c0004");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawStars() {
    for (let s of stars) {
        s.a += s.d;
        if (s.a < 0 || s.a > 1) s.d *= -1;

        ctx.globalAlpha = s.a;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function spawn() {
    if (elements.length >= MAX) return;

    const typeRand = Math.random();

    let type =
        typeRand < 0.55 ? 'phrase' :
        typeRand < 0.80 ? 'image' : 'heart';

    const z = focalLength * (1.2 + Math.random() * 1.5); // 🔥 más lejos = más lento visual

    const x = (Math.random() - 0.5) * canvas.width * 1.2;
    const y = (Math.random() - 0.5) * canvas.height * 1.2;

    let content;
    let size;

    if (type === 'phrase') {
        content = phrases[Math.floor(Math.random() * phrases.length)];
        size = 28;
    }

    if (type === 'heart') {
        content = new Image();
        content.src = hearts[Math.floor(Math.random() * hearts.length)];
        size = 60;
    }

    if (type === 'image') {
        content = new Image();
        content.src = images[0];
        size = 220;
    }

    elements.push({
        type,
        content,
        x,
        y,
        z,
        size,
        speed: 0.6 + Math.random() * 0.8 // 🔥 MUY LENTO
    });
}

function draw() {
    for (let i = elements.length - 1; i >= 0; i--) {
        const e = elements[i];

        e.z -= e.speed * zoom;

        if (e.z <= 0) {
            elements.splice(i, 1);
            continue;
        }

        const scale = focalLength / e.z;

        const x = (e.x - cameraX) * scale + canvas.width / 2;
        const y = (e.y - cameraY) * scale + canvas.height / 2;

        const s = e.size * scale * zoom;

        ctx.globalAlpha = Math.min(1, scale);

        if (e.type === 'phrase') {
            ctx.fillStyle = "#00e5ff";
            ctx.font = `${s}px Arial`;
            ctx.textAlign = "center";
            ctx.fillText(e.content, x, y);
        }

        else if (e.content && e.content.complete) {
            const ratio = e.content.naturalWidth / e.content.naturalHeight;

            const w = s * 1.6;
            const h = w / ratio;

            ctx.drawImage(e.content, x - w / 2, y - h / 2, w, h);
        }

        ctx.globalAlpha = 1;
    }
}

function loop() {
    requestAnimationFrame(loop);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawStars();
    draw();
}

canvas.addEventListener('wheel', e => {
    zoom += e.deltaY < 0 ? 0.1 : -0.1;
    zoom = Math.max(0.5, Math.min(zoom, 2.5));
});

canvas.addEventListener('mousedown', e => {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
});

canvas.addEventListener('mousemove', e => {
    if (!isDragging) return;

    cameraX -= (e.clientX - lastX) / zoom;
    cameraY -= (e.clientY - lastY) / zoom;

    lastX = e.clientX;
    lastY = e.clientY;
});

canvas.addEventListener('mouseup', () => isDragging = false);
canvas.addEventListener('mouseleave', () => isDragging = false);

window.addEventListener('resize', resize);

resize();

loop();

// 🔥 SPAWN LENTO Y CONTROLADO
setInterval(spawn, 900);

for (let i = 0; i < 10; i++) spawn();


function checkPassword() {
    const input = document.getElementById("passwordInput").value;

    if (input === "13") {
        document.getElementById("lockScreen").style.display = "none";
    } else {
        document.getElementById("errorText").innerText = "Contraseña incorrecta";
    }
}

// opcional: enter para entrar
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkPassword();
});