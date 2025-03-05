const svgContainer = document.getElementById('svg-container');
const svgElement = svgContainer.querySelector('svg');
let scale = 1;
let panX = 0;
let panY = 0;
const baseSensitivity = 0.1;

function updateTransform() {
    const containerRect = svgContainer.getBoundingClientRect();
    const svgRect = svgElement.getBoundingClientRect();

    // Ensure the SVG stays within the container bounds
    const minX = containerRect.width - svgRect.width;
    const minY = containerRect.height - svgRect.height;

    panX = Math.min(0, Math.max(minX, panX));
    panY = Math.min(0, Math.max(minY, panY));

    svgElement.style.transform = `scale(${scale}) translate(${panX}px, ${panY}px)`;
}

svgContainer.addEventListener('wheel', (event) => {
    event.preventDefault();
    const delta = Math.sign(event.deltaY);
    const sensitivity = baseSensitivity * scale; // Increase sensitivity with scale
    scale -= delta * sensitivity;
    scale = Math.max(1, Math.min(scale,150));
    updateTransform();
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
    updateTransform();
});

svgContainer.addEventListener('mouseup', () => {
    isPanning = false;
});

svgContainer.addEventListener('mouseleave', () => {
    isPanning = false;
});

document.getElementById('zoom-in').addEventListener('click', () => {
    scale += baseSensitivity * 50// Increase zoom increment
    scale = Math.min(scale, 150);
    updateTransform();
});

document.getElementById('zoom-out').addEventListener('click', () => {
    scale -= baseSensitivity * 50// Increase zoom increment
    scale = Math.max(1, scale);
    updateTransform();
});
