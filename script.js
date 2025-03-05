const svgContainer = document.getElementById('svg-container');
const svgElement = svgContainer.querySelector('svg');
let viewBox = svgElement.viewBox.baseVal;

// Initialize the viewBox to start zoomed in
viewBox.width = 1440; // 10% of the original width
viewBox.height = 1188.3; // 10% of the original height
viewBox.x = 6480; // Centered horizontally
viewBox.y = 5941.5; // Centered vertically

let isPanning = false;
let startX, startY, panX = 0, panY = 0;

svgContainer.addEventListener('wheel', (event) => {
    event.preventDefault();
    const zoomFactor = 1.1; // Adjust zoom factor for finer control
    const mouseX = event.clientX - svgContainer.getBoundingClientRect().left;
    const mouseY = event.clientY - svgContainer.getBoundingClientRect().top;
    const zoomDirection = event.deltaY < 0 ? 1 / zoomFactor : zoomFactor;

    viewBox.width *= zoomDirection;
    viewBox.height *= zoomDirection;
    viewBox.x -= (mouseX - svgContainer.clientWidth / 2) * (zoomDirection - 1);
    viewBox.y -= (mouseY - svgContainer.clientHeight / 2) * (zoomDirection - 1);
});

svgContainer.addEventListener('mousedown', (event) => {
    isPanning = true;
    startX = event.clientX;
    startY = event.clientY;
});

svgContainer.addEventListener('mousemove', (event) => {
    if (!isPanning) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    viewBox.x -= dx;
    viewBox.y -= dy;
    startX = event.clientX;
    startY = event.clientY;
});

svgContainer.addEventListener('mouseup', () => {
    isPanning = false;
});

svgContainer.addEventListener('mouseleave', () => {
    isPanning = false;
});
