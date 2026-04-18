const { removeBackground } = require('@imgly/background-removal-node');
const fs = require('fs');
const path = require('path');

async function test() {
    try {
        console.log('Testing with a real image...');
        // I need an image to test. I'll check if there's any.
        // For now, let's just create a dummy buffer but that will definitely fail "Unsupported format".
    } catch (e) {
        console.error(e);
    }
}
test();
