const { removeBackground } = require('@imgly/background-removal-node');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const RemoveBgAPI = {
    /**
     * Menghapus background dari gambar
     * @param {Buffer|string} imageInput - Bisa berupa Buffer gambar, Path file lokal, atau URL gambar
     * @returns {Promise<Buffer>} - Mengembalikan Buffer gambar hasil tanpa background (PNG)
     */
    async remove(imageInput) {
        let tempFile = null;
        try {
            let input = imageInput;
            
            // Jika input adalah Buffer, simpan sementara ke file agar library lebih mudah mengenali formatnya
            if (Buffer.isBuffer(imageInput)) {
                tempFile = path.join(__dirname, `temp_${Date.now()}.png`);
                fs.writeFileSync(tempFile, imageInput);
                input = pathToFileURL(tempFile).href;
            }

            // Memproses input gambar menggunakan model AI offline
            const noBgBlob = await removeBackground(input);
            
            // Konversi Blob kembali ke ArrayBuffer lalu ke Buffer NodeJS
            const arrayBuffer = await noBgBlob.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            
            return buffer;
        } catch (error) {
            this._handleError('remove', error);
        } finally {
            // Hapus file temporary jika ada
            if (tempFile && fs.existsSync(tempFile)) {
                try { fs.unlinkSync(tempFile); } catch (e) {}
            }
        }
    },

    _handleError(method, error) {
        console.error(`Error in RemoveBgAPI.${method}:`, error.message);
        throw {
            success: false,
            method: method,
            message: error.message
        };
    }
};

module.exports = RemoveBgAPI;
