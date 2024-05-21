import fs from 'fs';

const handler = async (m, { conn, text, usedPrefix, command }) => {

conn.groupUpdateSubject(m.chat, text);

}

handler.command = ['subject']
handler.admin = true;
export default handler;