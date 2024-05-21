// READ by locale[stores.user.lang] or local['en-US']
const locale = { 
    'en-US': '?locale=en-US',
    'zh-Hant': '?locale=zh-Hant'
}

/**
 * Demostration:
 * API_TARGET.PROFILE('Nyuightq'); // return URL String
 * 
 * @param { String } lang - userStore().lang
 * @param { String } username - ordinary parameter
 * @param { String } projectCode - ordinary parameter
 * @param { String } key - [cp_third] leaderboard's code
 * @param { String } durationMode - [History/Weekly/Daily] filter for score board
 * @return { String } - normal call return an 'url'
 */
const API_TARGET = {

    PROFILE: (lang, username) => `https://gamelet.online/user_api/get/user/${username}${locale[lang]}`,
    PROJECT: (lang) => `https://gamelet.online/client_api/list/clients/codes${locale[lang]}`,
    USER_TEAMSHIP: (lang, username) => `https://gamelet.online/team_api/get/user_teamship/${username}${locale[lang]}`,
    USER_BADGES: (lang, projectCode, username = null) => {
        return username !== null
        ? `https://gamelet.online/cglt/list/game_badges/${projectCode}/user/${username}${locale[lang]}`
        : `https://gamelet.online/cglt/list/game_badges/${projectCode}/guest${locale[lang]}`
    },
    SCORE_MODES: (lang, projectCode) => `https://gamelet.online/cglt/list/score_modes/${projectCode}${locale[lang]}`,
    USER_SCORES_BOARD: (lang, projectCode, key, durationMode, username) => {
        return username !== null
        ? `https://gamelet.online/cglt/list/user_scores/${projectCode}/${key}/${durationMode}/user/${username}${locale[lang]}`
        : `https://gamelet.online/cglt/list/user_scores/${projectCode}/${key}/${durationMode}/guest${locale[lang]}`;
    },
    BADGE_DETAIL: (lang, projectCode, badge) => `https://gamelet.online/client_api/get/game_badge/${projectCode}/${badge}${locale[lang]}`
};

/**
 * Demostration:
 * const payload = { codes: [ 'TwilightWars' ] };
 * const projectResult = await fetchApi(API_TARGET.PROJECT, payload)
 * 
 * @param { String } url - ordinary parameter
 * @param { Object } payload - { codes: [myProjectCode] } // { start:0, length:30 }
 * @param { String } method - fetch method - 'GET' or 'POST', default is'POST'
 * @return { Object } - API json response
 */
async function fetchApi(url, payload = {}, method = 'POST') {

    const options = {
        method: method,
        headers: { 
            'Content-Type': 'application/json',
        }
    }
    if(method=='POST') options.body = JSON.stringify( payload );

    try {

        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;

    } catch (error) {

        console.error('Fetch error:', error);
        throw error;

    }

}

export { API_TARGET, fetchApi };