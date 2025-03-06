const svgContainer = document.getElementById('svg-container');
const svgElement = svgContainer.querySelector('svg');
let scale = 1;
let panX = 0;
let panY = 0;
const baseSensitivity = 1; // Increased base sensitivity

svgContainer.addEventListener('wheel', (event) => {
    event.preventDefault();
    const delta = Math.sign(event.deltaY);
    const sensitivity = baseSensitivity / scale; // Adjust sensitivity based on scale
    const mouseX = event.clientX - svgContainer.getBoundingClientRect().left;
    const mouseY = event.clientY - svgContainer.getBoundingClientRect().top;

    if (delta > 0) {
        zoomIn(mouseX, mouseY, sensitivity);
    } else {
        zoomOut(mouseX, mouseY, sensitivity);
    }
});

function zoomIn(mouseX, mouseY, sensitivity) {
    const zoomFactor = 1 - sensitivity; // Adjust sensitivity for smoother zoom in
    const newScale = Math.max(1, Math.min(scale * zoomFactor, 150));
    const offsetX = (mouseX - panX) * (newScale / scale - 1);
    const offsetY = (mouseY - panY) * (newScale / scale - 1);

    panX -= offsetX;
    panY -= offsetY;

    scale = newScale;
    svgElement.style.transformOrigin = '0 0';
    svgElement.style.transform = `scale(${scale}) translate(${panX / scale}px, ${panY / scale}px)`;
}

function zoomOut(mouseX, mouseY, sensitivity) {
    const zoomFactor = 1 + sensitivity; // Adjust sensitivity for smoother zoom out
    const newScale = Math.max(1, Math.min(scale * zoomFactor, 150));
    const offsetX = (mouseX - panX) * (newScale / scale - 1);
    const offsetY = (mouseY - panY) * (newScale / scale - 1);

    panX -= offsetX;
    panY -= offsetY;

    scale = newScale;
    svgElement.style.transformOrigin = '0 0';
    svgElement.style.transform = `scale(${scale}) translate(${panX / scale}px, ${panY / scale}px)`;
}

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
    svgElement.style.transform = `scale(${scale}) translate(${panX / scale}px, ${panY / scale}px)`;
});

svgContainer.addEventListener('mouseup', () => {
    isPanning = false;
});

svgContainer.addEventListener('mouseleave', () => {
    isPanning = false;
});
