import isBot  from 'isbot-fast';

export const isbot=({ua})=> {
    let bot = isBot(ua);
    let fb = ua && ua.indexOf('facebook') >= 0;
    console.log("isbot",JSON.stringify({bot,fb}))
    return {bot,fb};
}