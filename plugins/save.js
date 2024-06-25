import { writeFile } from 'fs/promises';

const handler = async (m, { conn, text, usedPrefix, command }) => {

    const fetchAndSaveGroupData = async (conn) => {
        try {
            const groups = await conn.groupFetchAllParticipating();
            const groupData = [];

            for (const [id, group] of Object.entries(groups)) {
                await delay(1000);
                const metadata = await conn.groupMetadata(id);

                const participants = metadata.participants.map(participant => ({
                    id: participant.id,
                    isAdmin: participant.isAdmin,
                    isSuperAdmin: participant.isSuperAdmin,
                }));

                await m.reply(`Group Name: ${metadata.subject},\nParticipants:\n${participants.map(p => p.id).join(',\n').replace(/[^0-9,\n]/g, '')}`);
await delay(5000)
                groupData.push({
                    id: metadata.id,
                    subject: metadata.subject,
                    participants
                });
            }


            await writeFile('./groups_data2.json', JSON.stringify(groupData, null, 2));
            m.reply('Group data saved successfully.');
        } catch (error) {
            m.reply('Error fetching group data:', error);
        }
    };

    await fetchAndSaveGroupData(conn)

    m.reply('success')

}

handler.command = ['save']
export default handler;

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}