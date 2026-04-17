const { bratGen } = require("brat-canvas");
const { bratVid } = require("brat-canvas/video");
const ffmpegPath = require("ffmpeg-static");
process.env.PATH = `${require("path").dirname(ffmpegPath)}${require("path").delimiter}${process.env.PATH}`;

/**
 * Core function to generate Brat sticker (image or video)
 * @param {string} text - The input text
 * @param {string} command - The command type ('brat' or 'bratvid')
 * @returns {Promise<Buffer>}
 */
async function generateBrat(text, command = "brat") {
    try {
        if (command === "bratvid") {
            return await bratVid(text, {
                frameDuration: 0.7,
                lastFrameDuration: 1.5,
                outputFormat: "mp4",
                theme: "white",
                ffmpegPath: require('ffmpeg-static')
            });
        }
        return await bratGen(text);
    } catch (e) {
        throw new Error(e.message || e);
    }
}

/**
 * Bot Plugin Handler
 */
const handler = async (m, sock, { text, prefix, command }) => {
    if (!text) return m.reply(`- Ex: *${prefix + command}*`);

    await m.reply("Sedang memproses...");

    try {
        const buffer = await generateBrat(text, command);

        await sock.sendStimg(
            m.chat,
            buffer,
            m,
            { packname: "ApiRizz", author: "apirizz.my.id" }
        );

    } catch (e) {
        console.error(e);
        let msg = "❌ Gagal membuat sticker Brat.";
        if (e.message && e.message.includes("ffmpeg")) {
            msg += "\n\n*Error:* FFmpeg tidak ditemukan. Pastikan sistem sudah terinstall ffmpeg.";
        } else {
            msg += `\n\n*Error:* ${e.message || e}`;
        }
        m.reply(msg);
    }
}

handler.command = ["brat", "bratvid"]

module.exports = handler