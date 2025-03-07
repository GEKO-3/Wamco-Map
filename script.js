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
let panOccurred = false;

svgContainer.addEventListener('mousedown', (event) => {
    isPanning = true;
    panOccurred = false;
    startX = event.clientX - panX;
    startY = event.clientY - panY;
});

svgContainer.addEventListener('mousemove', (event) => {
    if (!isPanning) return;
    panOccurred = true;
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

let initialTouchDistance = 0;
let initialTouchScale = 1;
let initialTouchPanX = 0;
let initialTouchPanY = 0;

svgContainer.addEventListener('touchstart', (event) => {
    event.preventDefault(); // Disable default touch controls
    if (event.touches.length === 2) {
        initialTouchDistance = getDistance(event.touches[0], event.touches[1]);
        initialTouchScale = scale;
        initialTouchPanX = panX;
        initialTouchPanY = panY;
        const touchCenter = getTouchCenter(event.touches[0], event.touches[1]);
        startX = touchCenter.x - panX;
        startY = touchCenter.y - panY;
    } else if (event.touches.length === 1) {
        isPanning = true;
        panOccurred = false;
        startX = event.touches[0].clientX - panX;
        startY = event.touches[0].clientY - panY;
    }
});

svgContainer.addEventListener('touchmove', (event) => {
    event.preventDefault(); // Disable default touch controls
    if (event.touches.length === 2) {
        const currentDistance = getDistance(event.touches[0], event.touches[1]);
        const touchScale = currentDistance / initialTouchDistance;
        const newScale = Math.max(1, Math.min(initialTouchScale * touchScale, 150));
        const touchCenter = getTouchCenter(event.touches[0], event.touches[1]);
        const offsetX = (touchCenter.x - panX) * (newScale / scale - 1);
        const offsetY = (touchCenter.y - panY) * (newScale / scale - 1);

        panX -= offsetX;
        panY -= offsetY;

        scale = newScale;
        svgElement.style.transformOrigin = '0 0';
        svgElement.style.transform = `scale(${scale}) translate(${panX / scale}px, ${panY / scale}px)`;
    } else if (event.touches.length === 1 && isPanning) {
        panOccurred = true;
        panX = event.touches[0].clientX - startX;
        panY = event.touches[0].clientY - startY;
        svgElement.style.transform = `scale(${scale}) translate(${panX / scale}px, ${panY / scale}px)`;
    }
});

svgContainer.addEventListener('touchend', () => {
    isPanning = false;
});

function getDistance(touch1, touch2) {
    return Math.sqrt(Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2));
}

function getTouchCenter(touch1, touch2) {
    return {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2
    };
}

// Load and parse the CSV data
d3.csv('data.csv').then(data => {
    // Assuming the CSV has columns 'id' and 'color'
    data.forEach(row => {
        const shape = svgElement.querySelector(`#Houses [id="${row.id}"]`);
        if (shape) {
            shape.style.fill = row.color;
        }
    });
});

function highlightElement(houseId) {
    const shape = svgElement.querySelector(`#Houses [id="${houseId}"]`);
    if (shape) {
        shape.classList.add('highlight');
    }
}

function removeHighlight(houseId) {
    const shape = svgElement.querySelector(`#Houses [id="${houseId}"]`);
    if (shape) {
        shape.classList.remove('highlight');
    }
}

function openDialog(houseId) {
    if (panOccurred) return; // Prevent dialog from opening if a pan occurred
    // Close any existing dialog
    closeDialog();
    
    // Highlight the element
    highlightElement(houseId);

    const dialog = document.createElement('div');
    dialog.id = 'dialog-box';
    dialog.innerHTML = `
        <h2>House Information</h2>
        <p>House ID: ${houseId}</p>
        <button onclick="copyToClipboard('${houseId}')">Copy House ID</button>
        <button onclick="closeDialog()">Close</button>
    `;
    document.body.appendChild(dialog);

    // Add event listener to close dialog when clicking outside
    setTimeout(() => {
        document.addEventListener('click', closeDialogOnClickOutside);
    }, 0);
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

function closeDialog() {
    const dialog = document.getElementById('dialog-box');
    if (dialog) {
        const houseId = dialog.querySelector('p').textContent.split(': ')[1];
        removeHighlight(houseId);
        dialog.classList.add('closing');
        dialog.addEventListener('animationend', () => {
            if (dialog.parentElement) {
                dialog.parentElement.removeChild(dialog);
            }
            document.removeEventListener('click', closeDialogOnClickOutside);
        });
    }
}

function closeDialogOnClickOutside(event) {
    const dialog = document.getElementById('dialog-box');
    if (dialog && !dialog.contains(event.target)) {
        closeDialog();
    }
}

document.getElementById('search-bar').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const names = document.querySelectorAll('#Names text');
    const suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = '';
    let matches = [];

    names.forEach(name => {
        if (name.textContent.toLowerCase().includes(searchTerm)) {
            matches.push(name.textContent);
            name.classList.add('highlight-search');
        } else {
            name.classList.remove('highlight-search');
        }
    });

    if (matches.length > 0) {
        suggestions.style.display = 'block';
        matches.forEach(match => {
            const div = document.createElement('div');
            div.textContent = match;
            div.classList.add('suggestion-item');
            div.addEventListener('click', function() {
                document.getElementById('search-bar').value = match;
                suggestions.style.display = 'none';
                names.forEach(name => {
                    if (name.textContent === match) {
                        name.classList.add('highlight-search');
                    } else {
                        name.classList.remove('highlight-search');
                    }
                });
            });
            suggestions.appendChild(div);
        });
    } else {
        suggestions.style.display = 'none';
    }
});

document.addEventListener('click', function(event) {
    const suggestions = document.getElementById('suggestions');
    if (!suggestions.contains(event.target) && event.target.id !== 'search-bar') {
        suggestions.style.display = 'none';
    }
});