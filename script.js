const svgContainer = document.getElementById('svg-container');
const svgElement = svgContainer.querySelector('svg');
let scale = 1;
let panX = 0;
let panY = 0;
const baseSensitivity = 0.1;

function updateTransform() {
    const containerRect = svgContainer.getBoundingClientRect();
    const svgRect = svgElement.getBoundingClientRect();

    // Adjust the bounds for panning to allow viewing the entire map
    const minX = containerRect.width - svgRect.width * scale;
    const minY = containerRect.height - svgRect.height * scale;

    panX = Math.min(0, Math.max(minX, panX));
    panY = Math.min(0, Math.max(minY, panY));

    svgElement.style.transformOrigin = `0 0`; // Set zoom origin to top-left corner
    svgElement.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
}

svgContainer.addEventListener('wheel', (event) => {
    event.preventDefault();
    const delta = Math.sign(event.deltaY);
    const sensitivity = baseSensitivity * scale; // Increase sensitivity with scale
    scale -= delta * sensitivity;
    scale = Math.max(1, Math.min(scale, 150));
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
    scale += baseSensitivity * 50; // Increase zoom increment
    scale = Math.min(scale, 150);
    updateTransform();
});

document.getElementById('zoom-out').addEventListener('click', () => {
    scale -= baseSensitivity * 50; // Increase zoom increment
    scale = Math.max(1, scale);
    updateTransform();
});

let initialPinchDistance = null;
let lastTouchCenter = null;

function getDistance(touches) {
    const [touch1, touch2] = touches;
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

function getTouchCenter(touches) {
    const [touch1, touch2] = touches;
    return {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
    };
}

svgContainer.addEventListener('touchstart', (event) => {
    if (event.touches.length === 1) {
        isPanning = true;
        const touch = event.touches[0];
        startX = touch.clientX - panX;
        startY = touch.clientY - panY;
    } else if (event.touches.length === 2) {
        initialPinchDistance = getDistance(event.touches);
        lastTouchCenter = getTouchCenter(event.touches);
    }
});

svgContainer.addEventListener('touchmove', (event) => {
    event.preventDefault();
    if (event.touches.length === 1 && isPanning) {
        const touch = event.touches[0];
        panX = touch.clientX - startX;
        panY = touch.clientY - startY;
        updateTransform();
    } else if (event.touches.length === 2 && initialPinchDistance !== null) {
        const currentDistance = getDistance(event.touches);
        const touchCenter = getTouchCenter(event.touches);
        const scaleChange = currentDistance / initialPinchDistance;
        scale *= scaleChange;
        scale = Math.max(1, Math.min(scale, 150));

        // Adjust pan to keep the touch center in the same position
        panX -= (touchCenter.x - lastTouchCenter.x) * (scaleChange - 1);
        panY -= (touchCenter.y - lastTouchCenter.y) * (scaleChange - 1);

        initialPinchDistance = currentDistance;
        lastTouchCenter = touchCenter;
        updateTransform();
    }
});

svgContainer.addEventListener('touchend', (event) => {
    if (event.touches.length < 2) {
        initialPinchDistance = null;
        lastTouchCenter = null;
    }
    if (event.touches.length === 0) {
        isPanning = false;
    }
});
