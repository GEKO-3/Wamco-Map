const svgContainer = document.getElementById('svg-container');
const svgElement = svgContainer.querySelector('svg');
let scale = 1;
let panX = 0;
let panY = 0;

svgContainer.addEventListener('wheel', (event) => {
    event.preventDefault();
    const scaleAmount = 0.1;
    if (event.deltaY < 0) {
        scale += scaleAmount;
    } else {
        scale -= scaleAmount;
    }
    scale = Math.min(Math.max(.125, scale), 20); // Increased max zoom level to 20
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
