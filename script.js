function generateMasonry() {
    const columns = document.getElementById('columns').value;
    const items = document.getElementById('items').value;
    if (columns < 1 || columns > 6) {
        alert('Кількість колонок має бути від 1 до 6.');
        return;
    }

    if (items < 1) {
        alert('Кількість блоків не може бути менше 1.');
        return;
    }

    const container = document.getElementById('masonryContainer');
    container.innerHTML = ''; 

    container.style.display = 'grid';
    container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    container.style.gap = '2px';
    container.style.rowGap = '2px';
    
    const sizes = []; 

    for (let i = 0; i < items; i++) {
        const item = document.createElement('div');
        item.style.background = '#ff69b4';
        item.style.height = '100px'; 
        item.style.width = '100px';
        container.appendChild(item);

        sizes.push({ width: 100, height: 100 });
    }

    saveToServer({ columns, items, sizes });
}


function editBlocks() {
    const editor = document.getElementById('editorContainer');
    editor.style.display = 'block'; 
}

function applyChanges() {
    const sizesInput = document.getElementById('blockSizes').value.split('\n');
    const container = document.getElementById('masonryContainer');
    const items = container.children;

    const updatedSizes = [];
    const columns = document.getElementById('columns').value;

    if (columns < 1 || columns > 6) {
        alert('Кількість колонок має бути від 1 до 6.');
        return;
    }

    if (items.length < 1) {
        alert('Кількість блоків не може бути менше 1.');
        return;
    }

    for (let i = 0; i < items.length; i++) {
        const dimensions = sizesInput[i] ? sizesInput[i].split(',').map(Number) : null;
        if (dimensions && dimensions.length === 2) {
            items[i].style.width = `${dimensions[0]}px`;
            items[i].style.height = `${dimensions[1]}px`;
            updatedSizes.push({ width: dimensions[0], height: dimensions[1] });
        } else {
            const computedStyle = window.getComputedStyle(items[i]);
            updatedSizes.push({
                width: parseInt(computedStyle.width),
                height: parseInt(computedStyle.height),
            });
        }
    }

    saveToServer({ columns, items: items.length, sizes: updatedSizes });
}

function saveToServer(data) {
    fetch('save.php', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => console.log('Збереження успішне:', result))
    .catch(error => console.error('Error saving data:', error));
}

function loadFromServer() {
    fetch('data.json?' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            const { columns, items, sizes} = data;

            if (!sizes || !Array.isArray(sizes)) {
                console.error('Sizes are not available or invalid.');
                return;
            }

            const container = document.getElementById('masonryContainer');
            container.innerHTML = '';

            container.style.display = 'grid';
            container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
            container.style.gap = '2px';
            container.style.rowGap = '2px';

            sizes.forEach(size => {
                const item = document.createElement('div');
                item.style.width = `${size.width}px`;
                item.style.height = `${size.height}px`;
                item.style.background = '#FF69B4';
                container.appendChild(item);
            });
        })
        .catch(error => console.error('Error loading data:', error));
}

if (document.title === 'Page 2 - Display Masonry') {
    loadFromServer();
}

