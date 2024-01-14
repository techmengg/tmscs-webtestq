// Create a separate cursor canvas
const cursorCanvas = document.createElement("canvas");
document.body.appendChild(cursorCanvas);
const cursorCtx = cursorCanvas.getContext("2d");

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// Set initial position of cursor canvas
let cursorX = 0.5 * window.innerWidth;
let cursorY = 0.5 * window.innerHeight;

// for intro motion
let mouseMoved = false;

const pointer = {
  x: 0.5 * window.innerWidth,
  y: 0.5 * window.innerHeight,
};
const params = {
  pointsNumber: 40,
  widthFactor: 0.3,
  mouseThreshold: 0.6,
  spring: 0.4,
  friction: 0.5,
};

const trail = new Array(params.pointsNumber);
for (let i = 0; i < params.pointsNumber; i++) {
  trail[i] = {
    x: pointer.x,
    y: pointer.y,
    dx: 0,
    dy: 0,
  };
}

window.addEventListener("click", (e) => {
  updateMousePosition(e.clientX, e.clientY);
});
window.addEventListener("mousemove", (e) => {
  mouseMoved = true;
  updateMousePosition(e.clientX, e.clientY);
});
window.addEventListener("touchmove", (e) => {
  mouseMoved = true;
  updateMousePosition(e.touches[0].clientX, e.touches[0].clientY);
});

function updateMousePosition(clientX, clientY) {
  // Adjust for scroll position
  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;

  pointer.x = clientX + scrollX;
  pointer.y = clientY + scrollY;

  // Update cursor position
  cursorX = pointer.x;
  cursorY = pointer.y;

  // Draw cursor on cursor canvas
  cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
  cursorCtx.fillStyle = "#ffffff";
  cursorCtx.beginPath();
  cursorCtx.arc(cursorX, cursorY, 5, 0, 2 * Math.PI);
  cursorCtx.fill();
}

setupCanvas();
update(0);
window.addEventListener("resize", setupCanvas);

function update(t) {
  // for intro motion
  if (!mouseMoved) {
    pointer.x =
      (0.5 + 0.3 * Math.cos(0.002 * t) * Math.sin(0.005 * t)) *
      window.innerWidth;
    pointer.y =
      (0.5 +
        0.2 * Math.cos(0.005 * t) +
        0.1 * Math.cos(0.01 * t)) *
      window.innerHeight;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  trail.forEach((p, pIdx) => {
    const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
    const spring = pIdx === 0 ? 0.4 * params.spring : params.spring;
    p.dx += (prev.x - p.x) * spring;
    p.dy += (prev.y - p.y) * spring;
    p.dx *= params.friction;
    p.dy *= params.friction;
    p.x += p.dx;
    p.y += p.dy;
  });

  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.strokeStyle = "#ffffff"; // Set the trail color to white
  ctx.moveTo(trail[0].x, trail[0].y);

  for (let i = 1; i < trail.length - 1; i++) {
    const xc = 0.5 * (trail[i].x + trail[i + 1].x);
    const yc = 0.5 * (trail[i].y + trail[i + 1].y);
    ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
    ctx.lineWidth = params.widthFactor * (params.pointsNumber - i);
    ctx.stroke();
  }
  ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
  ctx.stroke();

  window.requestAnimationFrame(update);
}

function setupCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Also update the cursor canvas size
  setupCursorCanvas();
}

function setupCursorCanvas() {
  cursorCanvas.width = window.innerWidth;
  cursorCanvas.height = window.innerHeight;
  cursorCanvas.style.position = "fixed";
  cursorCanvas.style.top = "0";
  cursorCanvas.style.left = "0";
  cursorCanvas.style.pointerEvents = "none";
  cursorCanvas.style.zIndex = "9999";
}

// Call the setup function for the cursor canvas
setupCursorCanvas();
window.addEventListener("resize", setupCursorCanvas);

// Update the canvas size when the window is resized
function updateCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Also update the cursor canvas size
  setupCursorCanvas();
}

// Add an event listener for window resize to update both canvases
window.addEventListener("resize", updateCanvasSize);
