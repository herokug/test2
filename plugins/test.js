import fs from 'fs'
import m3u8ToMp4 from "m3u8-to-mp4"

const handler = async (m, { conn, text }) => {
    // Check if the message contains the M3U8 link
    if (!text) {
        conn.reply(m.chat, 'link?', m);
        return;
    }


    var converter = new m3u8ToMp4();

    await m.reply('```down```')

    const m3u8Link = text.trim();

    try {

        (async function () {
            await converter
                .setInputFile(m3u8Link)
                .setOutputFile("dummy.mp4")
                .start();

            await m.reply('```up```')

            await conn.sendMessage(
                m.chat,
                {
                    video: fs.readFileSync('dummy.mp4'),
                    caption: 'test',
                    gifPlayback: false
                }
            )

            await fs.unlink('dummy.mp4')

        })();

    } catch (error) {
        m.reply(`${error}`)
    }

}

handler.command = ['mp4', 'm3u8' ];
export default handler;
