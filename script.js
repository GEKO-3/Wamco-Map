const svgContainer = document.getElementById('svg-container');
const svgElement = svgContainer.querySelector('svg');
let scale = 1;
let panX = 0;
let panY = 0;
const baseSensitivity = 0.1;

svgContainer.addEventListener('wheel', (event) => {
    event.preventDefault();
    const delta = Math.sign(event.deltaY);
    const sensitivity = baseSensitivity * scale; // Increase sensitivity with scale
    scale -= delta * sensitivity;
    scale = Math.max(1, Math.min(scale,150));
    svgElement.style.transform = `scale(${scale}) translate(${panX}px, ${panY}px)`;
});

let isPanning = false;
let startX, startY;

svgContainer.addEventListener('mousedown', (event) => {
    isPanning = true;
    startX = event.clientX - panX;
    startY = event.clientY - panY;
});

svgContainer.addEventListener('mousemove', (event) => {
    if (!isPanning) return;
    panX = event.clientX - startX;
    panY = event.clientY - startY;
    svgElement.style.transform = `scale(${scale}) translate(${panX}px, ${panY}px)`;
});

svgContainer.addEventListener('mouseup', () => {
    isPanning = false;
});

svgContainer.addEventListener('mouseleave', () => {
    isPanning = false;
});
