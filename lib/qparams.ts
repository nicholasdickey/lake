//./lib/qparams.ts
export interface Qparams {
    custom: boolean,
    channel?: string,
    forum: string,
    type: string,
    newsline: string,
    tag?: string,
    navTab?:number,
    threadid?: string,
    layoutNumber?: string,
    timestamp:number,
    cc:string,
    isbot?:boolean,
    isfb?:boolean   
}