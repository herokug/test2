import uploadImage from './lib/uploadImage.js'
import ocrapi from 'ocr-space-api-wrapper'
import fs from 'fs';
import { readFile, writeFile } from 'fs/promises';
import pkg from '@whiskeysockets/baileys'

import {
    appendNumberToFirebase,
    checkIfNumberExistsInFirebase,
    totalNumbers
} from './firebase.js';

const { generateWAMessageFromContent, proto, prepareWAMessageMedia, generateMessageID } = pkg

const path = './numbers.json';

async function ocr(m) {
    let a = m
    let mime = (a.msg || a).mimetype || ''
    if (!mime) throw `reply picture with command .ocr`
    if (!/image\/(jpe?g|png)/.test(mime)) throw `_need image_`
    let img = await a.download()
    let url = await uploadImage(img)
    try {
        const apiKey = 'K85165439888957';
        let result = await ocrapi.ocrSpace(url, { apiKey })
        await console.log('api1')
        return result.ParsedResults[0].ParsedText
    } catch (error) {
        try {
            const apiKey = 'K87667095188957';
            let result = await ocrapi.ocrSpace(url, { apiKey })
            await console.log('api2')
            return result.ParsedResults[0].ParsedText
        } catch (error) {
            try {
                let result = await ocrapi.ocrSpace(url)
                await console.log('apifree')
                return result.ParsedResults[0].ParsedText
            } catch (error) {
                return error
            }
        }
    }
}

async function extractAndFormatSriLankanNumbers(input) {

    const regex = /(?:\+?94|0)?(7\d{8})/g;

    const stringWithoutSpaces = input.replace(/\s/g, "");

    const stringWithoutPlusSigns = stringWithoutSpaces.replace(/\+/g, "");

    const result = stringWithoutPlusSigns

    const matches = result.match(regex);

    if (matches) {
        // Format the matched phone numbers
        const formattedNumbers = matches.map(number => {
            // Remove leading zeros and country code if present
            const formattedNumber = number.replace(/^(\+?94|0)?(7\d{8})/, '$2');
            // Prepend with '+94'
            return '+94' + formattedNumber;
        });

        return formattedNumbers;
    } else {
        return ['nonumbers'];
    }
}

async function send1(conn, id) {

    const mediaf = {
        media: fs.readFileSync('./chem2_low.jpg'),
        file: true
    }

    const htitle = `*රැල්ලට නොගොස් ,*\n*Chemistry....*\n*ලේසිම , ආසම ..*\n*පහසුම විෂය කරගෙන ...*\n*A එකක් ගන්න එන්න.*`

    const m = 'wa.me/94714888281?text=නම:%0Aපාසල:%0Aලිපිනය:'

    await conn.sendMessage(id, { image: mediaf.media, caption: htitle + '\n\nලියාපදිංචි වීමට : ' + `${m}` });

}

async function send2(conn, m, id) {
    const mediaf = {
        media: fs.readFileSync('./chem2_low.jpg'),
        file: true
    }

    const htitle = `රැල්ලට නොගොස් ,\nChemistry....\nලේසිම , ආසම ..\nපහසුම විෂය කරගෙන ...\nA එකක් ගන්න එන්න.`

    if (mediaf) {
        var file = await conn.getFile(mediaf.media);
        if (/image/.test(file.mime)) {

            var aa = await prepareWAMessageMedia({ image: mediaf.media }, { upload: conn.waUploadToServer });
            const image = {
                imageMessage: aa.imageMessage
            };
            var _media = image;
        } else {
            if (/video/.test(file.mime)) {
                var aa = await prepareWAMessageMedia({ 'video': { url: file.file } }, { 'upload': conn.waUploadToServer });
                const video = {
                    videoMessage: aa.videoMessage
                };
                var _media = video
            } else {
                var _media = {};
            }
        }
    }

    let msg = await generateWAMessageFromContent(id, {
        ephemeralMessage: {
            message: {
                "messageContextInfo": {
                    "deviceListMetadata": {},
                    "deviceListMetadataVersion": 2
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: proto.Message.InteractiveMessage.Body.create({
                        //  text: "test"
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                        // text: "අරවින්ද වෙල්ලප්පුලි"
                    }),
                    header: proto.Message.InteractiveMessage.Header.create({
                        title: htitle,
                        subtitle: "test",
                        hasMediaAttachment: mediaf.file,
                        ..._media
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                        
                    }),
                    // contextInfo: { mentionedJid: users }
                })
            }
        }
    }, {})


    await conn.relayMessage(id, msg.message, { messageId: msg.key.id })



}

async function send3(conn, m, id) {

    const caption = `2027 A/L රසායන විද්‍යාව සඳහා ආරම්භ වන නව පන්තිය තුළින් ඔබට,

* ⭕ සෑම ඒකකයක් සඳහාම වැඩිම ගැටළු සංඛ්‍යාවක් සාකච්ඡා කිරීම තුළින් එම ඒකක අවසන් වූ විට, විභාග ප්‍රශ්නවලට තනිව පිළිතුරු ලිවීමේ හැකියාව දරුවන්ට ලැබීම.

* ⭕ වත්මන් උසස් පෙළ විෂය නිර්දේශයට අනුකූලව ඉගැන්වීම සහ විභාග රටාව පිළිබඳව සිසුන් දැනුවත් කිරීම.

* ⭕ සෑම පාසල් වාර විභාගයකටම පෙර අදාල සිද්ධාන්ත කොටස් අවසන් කිරීම.

* ⭕ පළාත් ප්‍රශ්න පත්‍ර, ජනප්‍රිය පාසල්වල ප්‍රශ්න පත්‍ර, පසුගිය විභාග ප්‍රශ්නපත්‍ර වලට දරුවන් ලවා පිළිතුරු සැපයීම තුළින් වාර විභාග වලට මෙන්ම අවසාන විභාගයට ද සුදානම් කිරීම.

* ⭕ සෑම දරුවෙකු කෙරෙහිම විශේෂ අවධානය යොමු කිරීම තුළින් විශිෂ්ඨ ප්‍රතිඵල ලබාගැනීම.

* ⭕ විනයවත්, හා ආරක්ෂාකාරී පරිසරයක් තුළ පන්තිය පැවැත්වීම

* ⭕ වසර 23 ක් පුරා රසායන විද්‍යාව විෂයට වැඩිම සමත් ප්‍රතිශතයක් ඇති පන්තිය වීම තුළින්, ඉංජිනේරු වෛද්‍ය විශ්ව විද්‍යාල ආචාර්ය ආදී ක්ෂේත්‍ර ගණනාවක ලංකාව තුළ මෙන්ම විදෙස් ගතවද රැකියා කරන දරුවන් බිහිකිරීමට හැකිවීම.

* ⭕ රසායන විද්‍යා සංකල්ප සහ සමීකරණ පහසුවෙන් මතක තබා ගැනීමට උපකාර වන ක්‍රම සහ කෙටි ක්‍රම ඉගැන්වීම.

* ⭕ සිසුන්ගේ අධ්‍යාපන කටයුතු වල ප්‍රගතිය පිළිබඳව මාපියන් සමඟ නිරන්තරව සන්නිවේදනය කිරීම.`

    await conn.sendMessage(
        id, 
        { 
            image: { url : 'https://qu.ax/FbDUn.jpeg'},
            thumbnail: { url: 'https://qu.ax/FbDUn.jpeg' },
            caption: caption,
            //gifPlayback: true
        }
    )
}
async function totalNumbers_() {
    const filePath = './numbers.json';

    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            try {
                const numbers = JSON.parse(data);
                const numberOfNumbers = numbers.length;
                resolve(numberOfNumbers);
            } catch (parseError) {
                reject(parseError);
            }
        });
    });
}

const appendNumberToJsonFile = async (newNumber) => {
    try {
        // Read the existing file content
        let fileContent;
        try {
            fileContent = await readFile(path, 'utf8');
        } catch (error) {
            // If the file does not exist, initialize with an empty array
            if (error.code === 'ENOENT') {
                fileContent = '[]';
            } else {
                throw error;
            }
        }

        // Parse the existing JSON data
        const numbers = JSON.parse(fileContent);

        // Add the new number to the array
        numbers.push(newNumber);

        // Stringify the updated data
        const updatedContent = JSON.stringify(numbers, null, 2);

        // Write the updated data back to the file
        await writeFile(path, updatedContent, 'utf8');

        console.log(`Number ${newNumber} added successfully.`);
    } catch (error) {
        console.error('Error appending number to JSON file:', error);
    }
};

const checkIfNumberExists = async (numberToCheck) => {
    try {
        // Read the existing file content
        let fileContent;
        try {
            fileContent = await readFile(path, 'utf8');
        } catch (error) {
            // If the file does not exist, initialize with an empty array
            if (error.code === 'ENOENT') {
                fileContent = '[]';
            } else {
                throw error;
            }
        }

        // Parse the existing JSON data
        const numbers = JSON.parse(fileContent);

        // Check if the number exists in the array
        const numberExists = numbers.includes(numberToCheck);

        if (numberExists) {
            console.log(`Number ${numberToCheck} exists in the file.`);
        } else {
            console.log(`Number ${numberToCheck} does not exist in the file.`);
        }

        return numberExists;
    } catch (error) {
        console.error('Error checking number in JSON file:', error);
    }
};

async function react(c, m, msg, text) {
    const reactionMessage = {
        react: {
            text: text, // use an empty string to remove the reaction
            key: msg.key
        }
    }

    await c.sendMessage(m.chat, reactionMessage)
}

function containsNumbers(arr) {
    return arr.some(item => item.includes('94'));
}

async function start(numbersArray, conn, m) {
    const hasNumbers = containsNumbers(numbersArray);
    if (!hasNumbers) {
        const a = () => ['🙂‍↔', '⚗️', '🙂‍↕', '👨‍🔬', '👩‍🔬', '🧪'][Math.floor(Math.random() * 6)];
        await react(conn, m, m, await a());
        return;
    }

    const more = String.fromCharCode(8206);
    const readmore = more.repeat(4001);
    const b1 = await conn.sendMessage(m.chat, { text: 'ආරම්භ කරමින්..\n\nයැවීමට ඇති මුළු අංක ගණන : ' + numbersArray.length + '\nදැනට යවා ඇති මුළු අංක ගණන : ' + await totalNumbers() + '\n\n' + 'ඔබ එවූ අංක :\n' + readmore + numbersArray.join(',\n') }, { quoted: m });
    await delay(500);

    await react(conn, m, b1, '📲');

    var filteredArray = [];

    var count = 0;

    if (numbersArray.length > 2) {
        const a1 = await conn.sendMessage(m.chat, { text: `⚠️ ඔබ එවූ අංක ගණන > 2 බැවින් නොදන්වාම දැනටමත් යැවූ අංක ඇත්නම් මඟ හරිනු ලැබේ සහ *අංකවලට යන විට දැනුම් දීම නොකරනු ලැබේ*.\n\nඔබ එවූ මුළු අංක ගණන : ${numbersArray.length}` }, { quoted: m });
        await react(conn, m, a1, '⭕');
    }

    for (let index = 0; index < numbersArray.length; index++) {

        count = count + 1




        if (count == 120 + 1) {
            const a1 = await conn.sendMessage(m.chat, { text: `⭕⭕ අංක ${count - 1} සීමාව කරා ළඟා විය., ක්රියාවලිය මිනිත්තු 10 ක් සඳහා නතර විය.` }, { quoted: m });
            await delay(500);
            await react(conn, m, a1, '⏰');
            await delay(1000 * 60 * 10);
            const a2 = await conn.sendMessage(m.chat, { text: `🔄 ක්රියාවලිය නැවත ආරම්භ කිරීම..` }, { quoted: m });
            await react(conn, m, a2, '✅');
            count = 0
            index = index - 1
            continue;
        }

        const number = numbersArray[index];
        let sendnum = number.replace(/[^0-9]/g, '') + '@s.whatsapp.net';

        const b = await checkIfNumberExistsInFirebase(`${sendnum.split('@')[0]}`);
        if (numbersArray.length <= 2) {
            if (b) {
                filteredArray.push(number);
                const a1 = await conn.sendMessage(m.chat, { text: '⚠️ _දැනටමත් යවා ඇත_  ' + `${index + 1}. ` + sendnum.split('@')[0] }, { quoted: m });
                await delay(500);
                await react(conn, m, a1, '❌');
                await delay(1000 * 2);
                continue;
            }
        } else {
            if (b) {
                filteredArray.push(number);
                continue;
            }
        }

        if (numbersArray.length <= 2) {
        await delay(1000);
        const a1 = await conn.sendMessage(m.chat, { text: '⬆️ _අංකයට යැවීම_  ' + `${index + 1}. ` + sendnum.split('@')[0] }, { quoted: m });
        await delay(500);
        await react(conn, m, a1, '🔄');
        await delay(1000 * 2);

        await send3(conn, m, sendnum);
        await delay(1000 * 2);
        await react(conn, m, a1, '✅');

        } else {
            await send3(conn, m, sendnum);
        }

        await appendNumberToFirebase(`${sendnum.split('@')[0]}`);

        await delay(10000);
    }

    const a2 = await conn.sendMessage(m.chat, { text: '*වාර්තාව*\n\nයවන ලද අංක ගණන : ' + `${(numbersArray.length - filteredArray.length) ? (numbersArray.length - filteredArray.length) : '0'}` + '\nනොයවන ලද අංක ගණන : ' + filteredArray.length + '\n\nදැනට යවා ඇති මුළු අංක ගණන : ' + await totalNumbers() + '\n\n' + readmore + 'යවන ලද අංක : \n' + numbersArray.filter(num => !filteredArray.includes(num)).join('\n') + '\nනොයවන ලද අංක : \n' + filteredArray.join('\n') }, { quoted: m });
    await delay(500);
    await react(conn, m, a2, '📄');
    await delay(500);
    const b2 = await conn.sendMessage(m.chat, { text: 'ක්රියාවලි අවසානය.' }, { quoted: m });
    await delay(500);
    await react(conn, m, b2, '✅');
    await delay(500);
    m.delete();
}


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export default {
    ocr,
    extractAndFormatSriLankanNumbers,
    start,
    react
}