import Y2MateClient from 'y2mate-api/dist/index.mjs';
import { YouTube } from 'youtube-sr';
import yts from 'yt-search';
import ytdl from 'ytdl-core'

const client = new Y2MateClient();
const ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:shorts\/)?(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/;

const list = async (url) => {

    if (!ytIdRegex.test(url)) throw 'Invalid URL';
    if (!url) throw `Enter Url`

    try {

        const x = await client.getFromURL(url, 'vi');
        const linksVideo = x.linksVideo;
        const linkAudio = x.linksAudio;

        function compareByQuality(a, b) {
            const qualityA = parseInt(a.quality);
            const qualityB = parseInt(b.quality);
            return qualityA - qualityB;
        }

        const downloadLinksv = Array.from(linksVideo.values());
        const downloadLinksa = Array.from(linkAudio.values());

        downloadLinksv.sort(compareByQuality);
        downloadLinksa.sort(compareByQuality);

        const videoList = downloadLinksv.map((link, index) => {

            let size = link.size === 'MB' ? link.size.replace('MB', '') : link.size

            // return `1.${index + 1} ${link.quality} ${size ? `- ` + size : ''}`;

            return {
                index: `${index + 1}`,
                quality: link.quality,
                size: size ? size : 'null'
            }

        });

        const audioList = downloadLinksa.map((link, index) => {
            return {
                index: `${index + 1}`,
                quality: link.quality,
                size: link.size ? `${link.size}` : ''
            };
        });

        //  console.log(videoList)
        return {
            status: 1,
            video: videoList,
            audio: audioList,
        }

    } catch (error) {
        return `error getting list!`
    }

};

const getVideoID = (url) => {
    const match = url.match(/(?:shorts\/|watch\?v=)([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/watch?v=${match[1]}` : url;
}

const search = async (query, quallity = 'auto') => {

    var queryf = await getVideoID(query)

    try {

        let searchResults = await YouTube.search(queryf, { limit: 1, regionCode: 'LK' });

        if (searchResults[0]) {
            let vid = searchResults[0];

            return {
                status: 1,
                url: `https://www.youtube.com/watch?v=${vid.id}`,
                title: vid.title,
                duration: vid.durationFormatted,
                ago: vid.uploadedAt,
                views: formatNumber(vid.views),
                thumb: vid.thumbnail.url,
                channel: vid.channel.name,
            }

        } else {
            throw new Error('No results found')
        }
    } catch (error) {
        try {
            const search = await yts.search({ query: queryf, hl: 'en', gl: 'LK' });
            const searchResults = search.videos

            if (searchResults[0]) {
                const vid = searchResults[0];

                return {
                    status: 2 + ' _error_ : ' + error,
                    url: vid.url,
                    title: vid.title,
                    duration: vid.timestamp,
                    ago: vid.ago,
                    views: formatNumber(vid.views) ? formatNumber(vid.views) : 'null',
                    thumb: vid.thumbnail,
                    channel: vid.author.name,
                }

            } else {
                throw new Error('No results found')
            }
        } catch (error) {
            throw new Error(error)
        }
    }




    return
}

const desc = async (videoUrl) => {
    try {

        var videoUrlf = getVideoID(videoUrl)

        var yt = await ytdl.getInfo(videoUrlf);

        return {
            desc: yt.videoDetails.description ? yt.videoDetails.description : 'null',
            category: yt.videoDetails.category ? yt.videoDetails.category : 'null',
            keywords: yt.videoDetails.keywords ? yt.videoDetails.keywords : 'null',
            subs: yt.videoDetails.author.subscriber_count ? yt.videoDetails.author.subscriber_count : 'null',
            user_url: yt.videoDetails.author.user_url ? yt.videoDetails.author.user_url : 'null'
        }
    } catch (error) {
        console.error('Error fetching video details:', error);
    }
}

const download = async (url, quallity = 'auto') => {

    var videoUrlf = await getVideoID(url)

    const qualityMappings = {
        '144p': '17',
        '240p': '133',
        '360p': '18',
        '480p': '135',
        '720p': '22',
        '1080p': '137',
        '1440p': '400',
        '.m4a': '140',
        '128kbps': 'mp3128',
        'auto': 'auto'
    };

    var code;
    var res;

    if (qualityMappings.hasOwnProperty(quallity)) {
        code = qualityMappings[quallity];
    } else {
        code = 'auto'
    }

    try {

        if (!ytIdRegex.test(videoUrlf)) throw 'Invalid URL';

        if (!videoUrlf) return `Enter Url`

        try {
            const x = await client.getFromURL(videoUrlf, 'vi');

            var res;
            var type;

            if (code === '140' || code === 'mp3128') {
                res = await x.linksAudio.get(code).fetch()
                type = 'audio'
            } else {
                res = await x.linksVideo.get(code).fetch()
                type = 'video'
            }

            return {
                status: 1,
                title: res.title,
                url: res.downloadLink,
                type: type,
                quallity: res.fileQuality.replace('p', ''),
            }

        } catch (error) {
            throw new Error('error getting url')
        }

    } catch (error) {
        try {
            const info = await ytdl.getInfo(videoUrlf);

            if (info) {
                if (code === '140' || code === 'mp3128') {
                    res = info.formats.find(format => format.audioBitrate);
                } else {
                    res = info.formats.find(format => format.hasAudio && format.qualityLabel);
                }

                return {
                    status: 2,
                    title: 'nila.beta',
                    url: res.url,
                    quallity: res.qualityLabel,
                }
            } else {
                return new Error(`error getting url`)
            }

        } catch (error) {
            return `error fetching video`
        }
    }

}


const yt = {
    list,
    download,
    search,
    desc,
};

export default yt;

function formatNumber(num) {
    const suffixes = ['', 'k', 'M', 'B', 'T'];
    const numString = Math.abs(num).toString();
    const numDigits = numString.length;

    if (numDigits <= 3) {
        return numString;
    }

    const suffixIndex = Math.floor((numDigits - 1) / 3);
    let formattedNum = (num / Math.pow(1000, suffixIndex)).toFixed(1);

    if (formattedNum.endsWith('.0')) {
        formattedNum = formattedNum.slice(0, -2);
    }

    return formattedNum + suffixes[suffixIndex];
}
