const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const previewContainer = document.getElementById('preview-container');
const uploadArea = document.getElementById('drop-zone');
const originalPreview = document.getElementById('original-preview');
const resultPreview = document.getElementById('result-preview');
const loader = document.getElementById('loading');
const downloadBtn = document.getElementById('download-btn');
const resetBtn = document.getElementById('reset-btn');

// Drag and drop handlers
dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#6366f1';
    dropZone.style.background = 'rgba(99, 102, 241, 0.1)';
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = '#475569';
    dropZone.style.background = 'transparent';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        processFile(file);
    }
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
});

async function processFile(file) {
    // Show original preview
    const reader = new FileReader();
    reader.onload = (e) => {
        originalPreview.src = e.target.result;
    };
    reader.readAsDataURL(file);

    // Toggle UI
    uploadArea.style.display = 'none';
    previewContainer.style.display = 'block';
    loader.style.display = 'flex';
    resultPreview.style.display = 'none';
    downloadBtn.style.display = 'none';

    // Prepare data
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch('/remove-bg', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Failed to process image');

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        // Update UI with result
        resultPreview.src = url;
        resultPreview.style.display = 'block';
        loader.style.display = 'none';
        
        downloadBtn.href = url;
        downloadBtn.download = 'no-background.png';
        downloadBtn.style.display = 'inline-block';

    } catch (error) {
        alert('Error: ' + error.message);
        reset();
    }
}

function reset() {
    uploadArea.style.display = 'block';
    previewContainer.style.display = 'none';
    fileInput.value = '';
    resultPreview.src = '';
    originalPreview.src = '';
}

resetBtn.addEventListener('click', reset);
