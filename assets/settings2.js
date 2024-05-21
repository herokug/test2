import fs from 'fs';
import dotenv from 'dotenv';

if (fs.existsSync('config.env')) {
  dotenv.config({ path: './config.env' });
}

function convertToBool(text, fault = 'true') {
  return text === fault ? true : false;
}

const config = {
    VERSION: 'v.0.0.2',
    DEVELOPER: 'JAyarathne_technical',
    OWNER: {
        CREATOR: '94702978512 , 94702712132 , 94772601056 , 94777611095 , 94778115292 , 94711130309 , 94773131122',
        R_OWNER: '94702978512 , 94772601056 , 94777611095 , 94778115292 , 94724507665,94783946369 , 94773131122 , 94702712132 , 94767540362',
        CO: '94772601056',
        JF_TEAM: '94702978512 , 94772601056',
        URT: '94724507665',

    },

    N_SPAM: '94702978512 , 94772601056 , 94777611095 , 94778115292 , 94773131122',

    OPTIONS: {
        AUTO_READ: process.env.AUTO_READ === undefined ? false : convertToBool(process.env.AUTO_READ),
        ANTI_BOT: process.env.ANTI_BOT === undefined ? true : convertToBool(process.env.ANTI_BOT),
        ANTI_BOT_ACTION: process.env.ANTI_BOT_ACTION === undefined ? 'DEMOTE' : process.env.ANTI_BOT_ACTION.toUpperCase(),
        AUTO_BIO: process.env.AUTO_BIO === undefined ? true : convertToBool(process.env.AUTO_BIO),
    },
    NO_LOG: process.env.NO_LOG === undefined ? false : convertToBool(process.env.NO_LOG),
    NILA_SESSION: process.env.NILA_SESSION === undefined ? 'Nila_QR@;UnVZdGpqdGI=' : process.env.NILA_SESSION,
    LANG: process.env.LANG === undefined ? 'EN' : process.env.LANG,
    YOUR_BOTS: process.env.YOUR_BOTS === undefined ? '' : process.env.YOUR_BOTS,
    PASSWORD: process.env.PASSWORD === undefined ? 'pakaya@123' : process.env.PASSWORD,
    SUDO: global.openai_key === undefined ? '94702978512' : global.openai_key,
    PREMIUM: process.env.PREMIUM === undefined ? '94702978512' : process.env.PREMIUM,
    BLOCK_CHAT: process.env.BLOCK_CHAT === undefined ? '947121341122@s.whatsapp.net' : process.env.BLOCK_CHAT,
    // SESSION: 'JAYARATHNE_BOT:;:' + process.env.SESSION === undefined ? '' : process.env.SESSION ,
    // some envs

    reply: {
        owner: `Only Owner can use this command`,
        owner: `Only Jayarathne can use this command`,
        group: `This command is only for groups`,
        need_text: `Please enter your text`,
        active: `Your Spam Plugins not activated , send .active to Request activation from owner`,
    },

    REACT: {
        ERROR: ['❌'],
        INFO: ["🕐", "🕑", "🕒", "🕚", "🕙", "🕘", "🕗", "🕖", "🕕", "🕔", "🕓", "🕛", "🕜", "🕝", "🕞", "🕟", "🕠", "🕡", "🕢", "🕧", "🕦", "🕤", "🕥", "🕣"],
        SUCCESS: ["🦜"],
    }
}

export default config;