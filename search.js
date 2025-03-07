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
