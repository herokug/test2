
import pkg from '../assets/chem.js'

import PQueue from 'p-queue';

const queue = new PQueue({ concurrency: 1 });

const {
    ocr,
    start,
    react,
    extractAndFormatSriLankanNumbers
} = pkg

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw 'text!'
    if (m.message && m.message.imageMessage) {
        await queue.add(async () => {
            try {
                const t = await ocr(m)
                const t2 = await extractAndFormatSriLankanNumbers(t)
                await start(t2, conn, m)
            } catch (error) {
                console.log(error)
            }
        });

    } else {
        await queue.add(async () => {
            try {
                const t = await extractAndFormatSriLankanNumbers(m.text)
                await start(t, conn, m)
            } catch (error) {
                console.log(error)
            }
        });

    }

}

handler.all = async function (m, { conn, text }) {
    /* if (m.message.stickerMessage && m.message.stickerMessage.url == 'https://mmg.whatsapp.net/v/t62.15575-24/32415501_1170014397360393_577051055909404077_n.enc?ccb=11-4&oh=01_Q5AaIChYMK2kPhoMADMZaj_KxsqdeEJ1CALdEhHH2lX4Kuva&oe=666FD9FE&_nc_sid=5e03e0&mms3=true') {
        try {
            m.delete()
        } catch(e){}
    } */
    if (m.chat != '120363374919237195@g.us') return
    if (m.message && m.message.imageMessage) {
        await queue.add(async () => {
            try {
                const t = await ocr(m)
                const t2 = await extractAndFormatSriLankanNumbers(t)
                await start(t2, conn, m)
            } catch (error) {
                console.log(error)
            }
        });

    } else {
        await queue.add(async () => {
            try {
                const t = await extractAndFormatSriLankanNumbers(m.text)
                await start(t, conn, m)
            } catch (error) {
                console.log(error)
            }
        });

    }

    return !0;

}

handler.command = ['send']
export default handler;