const express = require('express');
const multer = require('multer');
const path = require('path');
const RemoveBgAPI = require('../images/removebg.js');

const app = express();
const port = 3000;

// Setup multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static('public'));

app.post('/remove-bg', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image uploaded' });
        }

        console.log('Processing image...');
        const resultBuffer = await RemoveBgAPI.remove(req.file.buffer);

        res.set('Content-Type', 'image/png');
        res.send(resultBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Test server running at http://localhost:${port}`);
});
