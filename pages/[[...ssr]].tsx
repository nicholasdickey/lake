import React from "react"
import Error from 'next/error'
import Common from "../components/common"
import {GetServerSidePropsContext} from "next";
import { SWRConfig, unstable_serialize } from 'swr'
import Bowser from "bowser";
import {
    fetchChannelConfig, fetchChannelLayout, fetchUser,fetchSitemap,
    fetchAllSitemaps,fetchChannelLayoutKey, fetchTopic, FetchTopicKey, processLoginCode, initLoginSession, getUserSession
} from '../lib/lake-api';
import { withSessionSsr, Options } from '../lib/with-session';
import shallowEqual from '../lib/shallow-equal';
import { Qparams } from '../lib/qparams'
import {isbot} from '../lib/isbot'

interface HomeProps {
    session?: Options,
    qparams?: Qparams,
    fallback?: any,
    meta?: {
        description?: string,
        title?: string,
        site_name?: string,
        image?: string,
        publishedTime?: number;
        url?: string;
    },
    error?: number
}
//All root presentation logic for broasheet pages is handled in Common component:
export default function Home({ session, qparams, fallback, meta, error }: HomeProps) {
    if (error)
        return <Error statusCode={error}>Ooops, ${error}</Error>
    if (session && qparams && meta)
        return <SWRConfig value={{ fallback }}><Common session={session} qparams={qparams} meta={meta} /></SWRConfig>
    return undefined;
}

/**
 * 
 * URL Schema:
 * /[forum]/[type=topic|home]/[tag]/[threadid]/[layoutNumber]/[cc]
 * /[forum]/[type=newsline]/[layoutNumber]/[navTab]
 * /[forum]/[type=solo]/[tag]/[layoutNumber]/[navTab]
 * 
 * 
 */

export const getServerSideProps = withSessionSsr(
    async function getServerSideProps(context: GetServerSidePropsContext): Promise<any> {
        let host = context.req.headers.host || "";
        console.log("DEBIG 1");
        //TODO: add a header to the load balancer to pass the correct host
        if(host=='cloud.digitalocean.com')
            host='american-outdoorsman.news';
        
        //Disqus OAuth callback params:
        const { code, state,utm_medium }: { code: string, state: string,utm_medium:string } = context.query as any;
        
        let ssr = context.params?.ssr as string[];
        if (!ssr)
            ssr = [`${process.env.DEFAULT_FORUM}`];
        let [forum] = ssr;
        
        // Sitemap handling:
        const format='xml';
        if (forum.indexOf("sitemap") == 0 && (forum.indexOf(".xml") >= 0||forum.indexOf(".txt") >= 0)) {
            const format=forum.indexOf(".xml") >= 0?'xml':'txt';
            const filename = forum.split(".")[0];
            const parts = filename.split('_');
            const host = context.req.headers.host || "";
            let [dummy, newsline, forumR, startDate] = parts;// context.params?.startDate as string[];
            const topics = await fetchSitemap(newsline, startDate,format,host,forumR);
            console.log("topics,",topics)
            const sitemap =topics//.join('\r\n');// topics.map((t: any) => `${t}`).join('\r\n')
            context.res.write(sitemap);//.split(',').map(t=>`${t}\n`));
            context.res.end();
            return { props: {} }
        }
        console.log("DEBIG 2")
        //robots.txt handling:
        if (forum.indexOf("robots.txt") == 0) {
            const sitemaps = await fetchAllSitemaps(process.env.DEFAULT_NEWSLINE||'', process.env.DEFAULT_FORUM||'',host,format);
            const robots = sitemaps.map((t: any) => `Sitemap:  ${t}`).join('\n')
            context.res.write(robots);//.split(',').map(t=>`${t}\n`));
            context.res.end();
            return { props: {} }
        }

        // everything else needs to be given 404 to satisfy Google Search
        if (forum != process.env.DEFAULT_FORUM) {
            context.res.statusCode = 404;
            return { props: { error: 404 } }
        }
        
        let type = ssr[1]||'newsline';
        
        const tag = (type == 'topic' || type == 'home' || type == 'solo') ? ssr[2]||"" : "";
        
        const threadid = (type == 'topic' || type == 'home') ? ssr[3]||"" : ""||"";
       
        const layoutNumber = ((type == 'topic' || type == 'home') ? ssr[4] : type == 'solo' ? ssr[3]||"l1" : ssr[2]) || "l1";
       
        const navTab = ((type == 'newsline') ? ssr[3] : type == "solo" ? ssr[4]||0 : 0) || 1;
       
        const cc = (type == 'topic' || type == 'home') ? ssr[5]||'' :'';
        
        const ua = context.req.headers['user-agent'];
        
        const bowser = Bowser.getParser(ua ? ua : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36');

        const platformType = bowser.getPlatformType();
        
        const defaultWidth = platformType == 'tablet'?900:platformType == 'desktop'?1200:600;
       
        const botInfo=isbot({ua});
        console.log("DEBIG 3",host,process.env.CANONIC_DOMAIN)
        //redirect from legacy domains:
        if (host != process.env.CANONIC_DOMAIN&& host.indexOf('vercel.app')<0) {
            if (type == 'topic' || type == 'home') {
                return {
                    redirect: {
                        permanent: true,
                        destination: `https://${process.env.CANONIC_DOMAIN}/${forum}/home/${tag}/${threadid}`,
                    },
                    props: {},
                };
            }
            else {
                return {
                    redirect: {
                        permanent: true,
                        destination: `https://${process.env.CANONIC_DOMAIN}`,
                    },
                    props: {},
                };
            }
        }
        console.log("DEBIG 4")
        // get encrypted session from the cookie or initialize the default   
        let startoptions = context.req.session?.options || null;
      
        if (!startoptions) {
            var randomstring = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            startoptions = {
                width: defaultWidth,
                loud: 1,
                dense: 0,
                thick: 0,
                hasLayout: false,
                hasNewslines: false,
                sessionid: randomstring(),
                userslug: '',
                band: 1,
                dark: -1,
            }
            context.req.session.options = startoptions;
            await context.req.session.save();
        }
        let options: Options = startoptions;

        if (options && !options.width)
            options.width = defaultWidth;

        if (typeof options.userslug === 'undefined')
            options.userslug = '';

        const newsline = process.env.DEFAULT_NEWSLINE||'qwiket';
        console.log("DEBIG 5")
        const qparams = {
            custom: true,
            forum,
            type,
            tag,
            navTab: +navTab,
            newsline,
            threadid,
            layoutNumber,
            cc,
            timestamp: Date.now() / 1000 | 0,
            isbot:botInfo.bot,
            isfb:botInfo.fb||utm_medium?1:0
        }
        
        // useful for debugging:
        //const isFirstServerCall = context.req?.url?.indexOf('/_next/data/') === -1
        console.log("DEBIG 6")
        //Disqus OAuth callback:
        if (code) {
            console.log("ssr processLoginCode",code,state)
            const jsonState = JSON.parse(state);
            const { href } = jsonState;
          
            const user = await processLoginCode(code, host);
            if (user) {
                const { slug } = user;
                if (context.req.session.options) {
                    context.req.session.options.userslug = slug;
                    await context.req.session.save();
                    const userSession = await initLoginSession(slug, options)
                    if (userSession) {
                        options = userSession || options;
                        if (options)
                            context.req.session.options = options;
                        await context.req.session.save();
                    }
                }
                return {
                    redirect: {
                        permanent: true,
                        destination: href,
                    },
                    props: {},
                };
            }
        }
        else if (options.userslug) {
            const userSession = await getUserSession(options.userslug)
            if (userSession && !shallowEqual(options, userSession)) {
                options = userSession;
                if (options)
                    context.req.session.options = options;
                await context.req.session.save();
            }
        }
        console.log("DEBIG 7")
        // get channel meta data and layout:
        const channelConfig = await fetchChannelConfig(newsline);
        console.log("DEBIG 8",channelConfig)
        const newslineKey: fetchChannelLayoutKey = ['channelLayout', newsline, options.hasLayout, options.sessionid, options.userslug, 'newsline', options.dense, options.thick, layoutNumber];
        
        const contextKey: fetchChannelLayoutKey = ['channelLayout', newsline, options.hasLayout, options.sessionid, options.userslug, 'context', options.dense, options.thick, layoutNumber];
        
        const newslineLayout = await fetchChannelLayout(newslineKey);
       
        //pre-fill stale data for the client for all permutations:
        const newslineStaleLKey = ['channelLayout', newsline, options.hasLayout, options.sessionid, options.userslug,'newsline', 0, 1, layoutNumber];
        const newslineStaleLKey1 = ['channelLayout', newsline, options.hasLayout, options.sessionid, options.userslug, 'newsline', 0, 0, layoutNumber];
        const newslineStaleLKey2 = ['channelLayout', newsline, options.hasLayout, options.sessionid, options.userslug, 'newsline', 1, 0, layoutNumber];
        const newslineStaleLKey3 = ['channelLayout', newsline, options.hasLayout, options.sessionid, options.userslug, 'newsline', 1, 1, layoutNumber];

        const contextLayout = await fetchChannelLayout(contextKey);
        const contextStaleLKey = ['channelLayout', newsline, options.hasLayout, options.sessionid, options.userslug,'context', 0, 1, layoutNumber];
        const contextStaleLKey1 = ['channelLayout', newsline, options.hasLayout, options.sessionid, options.userslug, 'context', 0, 0, layoutNumber];
        const contextStaleLKey2 = ['channelLayout', newsline, options.hasLayout, options.sessionid, options.userslug, 'context', 1, 0, layoutNumber];
        const contextStaleLKey3 = ['channelLayout', newsline, options.hasLayout, options.sessionid, options.userslug, 'context', 1, 1, layoutNumber];

        const user = await fetchUser(['user', options.userslug])

        let fallback = {
            [newsline]: channelConfig,
            [unstable_serialize(newslineKey)]: newslineLayout,
            [unstable_serialize(newslineStaleLKey)]: newslineLayout, // to provide SWR with stale date to avoid flashing loading screen
            [unstable_serialize(newslineStaleLKey1)]: newslineLayout,
            [unstable_serialize(newslineStaleLKey2)]: newslineLayout,
            [unstable_serialize(newslineStaleLKey3)]: newslineLayout,
            [unstable_serialize(contextKey)]: contextLayout,
            [unstable_serialize(contextStaleLKey)]: contextLayout, // to provide SWR with stale date to avoid flashing loading screen
            [unstable_serialize(contextStaleLKey1)]: contextLayout,
            [unstable_serialize(contextStaleLKey2)]: contextLayout,
            [unstable_serialize(contextStaleLKey3)]: contextLayout,

            [unstable_serialize(['user', options ? options.userslug : ''])]: user
        }        
        //setup metadata for og: tags
        let meta: {
            description?: string,
            title?: string,
            site_name?: string,
            image?: string,
            publishedTime?: number,
            url?: string,
            canonic?: string
        } = {};
       
        if (type == 'topic' || type == 'home') {
             //handle invalid topic slugs with 404 - google search requirement
            const check=threadid?.split('-slug-')||[];
            if(type=='topic'&&check.length<2&&threadid!='nro-is-moving-to-facebook-comments'){
                context.res.statusCode = 404;
                return { props: { error: 404 } }
            }
            const key:FetchTopicKey= {threadid:qparams.threadid?qparams.threadid:'',withBody:1,userslug:options.userslug,sessionid:options.sessionid,tag:qparams.tag,ackOverride:qparams.isbot||qparams.isfb};
            try {
                const topic = await fetchTopic(key);
                //handle invalid slugs with 404:
                if(!topic.success){
                    context.res.statusCode = 404;
                    return { props: { error: 404 } }
                } 
                fallback[unstable_serialize(key)] = topic;
                const { item } = topic;
                meta.description = item.description;
                meta.site_name = item.site_name;
                meta.title = `${item.catName}: ${item.title}`;
                meta.image = item.image;
                meta.publishedTime = item.shared_time;
                meta.url = item.shared_time;
                meta.canonic = `https://${process.env.CANONIC_DOMAIN}/${forum}/topic/${tag}/${threadid}`
            }
            catch (x) {
                console.log("FETCH TOPIC ERROR", x);
                context.res.statusCode = 503;
                return { props: { error: 503 } }
            }
        }
        else {
            meta.description = channelConfig.channelDetails.description;
            meta.site_name = channelConfig.channelDetails.displayName;
            meta.title = channelConfig.channelDetails.displayName
            meta.image == channelConfig.channelDetails.logo;
            meta.publishedTime = Date.now() / 1000 | 0,
            meta.canonic = `https://${process.env.CANONIC_DOMAIN}`
        }       
        const propsWrap = {
            props: {
                session: options,
                qparams,
                fallback,
                meta
            }
        };
       return propsWrap;
    })