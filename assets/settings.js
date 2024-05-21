import chalk from 'chalk'
import { fileURLToPath } from 'url'
import { watchFile, unwatchFile, readFileSync } from 'fs'

global.owner = 
 [
  ['94702978512', 's', true],
]
// Put your number here
// [number, he creator/owner?, he developer?]

global.mods = [] // Want some help?
global.prems = [] // Premium user has unlimited limit

// api key here okay
global.xyro = 'LyrK9JMI7N' // https://api.xyroinee.xyz free limit unlimited
global.apilol = 'GataDios' // https://api.lolhuman.xyz free limit unlimited by @BrunoSobrino

global.APIs = { // API Prefix
  // name: 'https://website'
  nrtm: 'https://nurutomo.herokuapp.com',
  xteam: 'https://api.xteam.xyz'
}
global.APIKeys = { // APIKey Here
  // 'https://website': 'apikey'
  'https://api.xteam.xyz': 'd90a9e986e18778b'
}

global.openai_key = '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';
/* Consigue tu ApiKey en este enlace: https://platform.openai.com/account/api-keys */

global.openai_org_id = 'org-9bXZDEJOVrBuEuL6b5qqOaW4';
/* Consigue tu ID de organizacion en este enlace: https://platform.openai.com/account/org-settings */

 global.thumbnailUrl = [
  'https://telegra.ph/file/81260a8b9e8cff26d2b48.jpg', 'https://telegra.ph/file/ac4928f0824a2a0492737.jpg',
  'https://telegra.ph/file/6359b013bc7e52c3b346f.jpg', 'https://telegra.ph/file/d43c89a5d2da72875ec05.jpg',
  'https://telegra.ph/file/7d6c0e35f9c8f52715541.jpg', 'https://telegra.ph/file/ef4b742d47e6a9115e2ff.jpg',
  'https://telegra.ph/file/55e5af5f33fbd57104187.jpg', 'https://telegra.ph/file/af236598456b95884bd15.jpg',
  'https://telegra.ph/file/de92ed4a729887ffc974c.jpg', 'https://telegra.ph/file/00ce42a193b1dbbf907d4.jpg'
]

global.mongodb_username = 'bravindudilshan'
global.mongodb_passward = '5Pfle3O71cK3pEDM'
global.mongodb_url = 'mongodb+srv://bravindudilshan:5Pfle3O71cK3pEDM@cluster0.qrphyqk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Sticker WM
global.packname = `c`
global.author = ''
// global.thumb = readFileSync('./me.png')
// global.thumb2 = readFileSync('./me2.jpeg')
global.multiplier = 69 // The higher, The harder levelup

//Text here
global.me = 'test'
global.bott = 'nila'
global.nomorown = '94702978512'
// owner put this creator.js
global.str = '-------------'
global.l = '「'
global.r = '」'
global.wait = 'loading'
global.eror = '```404 ᴇʀʀᴏʀ```'

const more = String.fromCharCode(8206)
global.readmore = more.repeat(4001)

global.rpg = {
  emoticon(string) {
    string = string.toLowerCase()
    let emot = {
      level: '🧬',
      limit: '🌌',
      health: '❤️',
      exp: '✉️',
      money: '💵',
      potion: '🥤',
      diamond: '💎',
      common: '📦',
      uncommon: '🎁',
      mythic: '🗳️',
      legendary: '🗃️',
      pet: '🎁',
      trash: '🗑',
      armor: '🥼',
      sword: '⚔️',
      wood: '🪵',
      rock: '🪨',
      string: '🕸️',
      horse: '🐎',
      cat: '🐈',
      dog: '🐕',
      fox: '🦊',
      petFood: '🍖',
      iron: '⛓️',
      gold: '👑',
      emerald: '💚'
    }
    let results = Object.keys(emot).map(v => [v, new RegExp(v, 'gi')]).filter(v => v[1].test(string))
    if (!results.length) return ''
    else return emot[results[0][0]]
  }
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.cyanBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
