import React from "react"
import Error from 'next/error'
import Common, { CommonProps } from "../components/common"
import Bowser from "bowser";
import { SWRConfig, unstable_serialize } from 'swr'
import axios from 'axios';
import {
    fetchChannelConfig, fetchChannelLayout, fetchUser, fetchMyNewsline, fetchPublications,
    fetchPublicationCategories, fetchPublicationsKey, fetchMyNewslineKey, Filters,
    fetchAllSitemaps,fetchChannelLayoutKey, fetchTopic, FetchTopicKey, processLoginCode, initLoginSession, getUserSession
} from '../lib/lakeApi';
import { withSessionSsr } from '../lib/withSession';
import { fetchQueues } from '../lib/ssrQueueFetches';
import { Options } from '../lib/withSession';
import Config from '../lib/config';
import shallowEqual from '../lib/shallowEqual';
import { Qparams } from '../lib/qparams'
import {
    GetServerSidePropsContext,
    GetServerSidePropsResult,
    NextApiHandler,
    GetServerSideProps
} from "next";
import { stringify } from "querystring";
import { networkInterfaces } from "os";
import {
    fetchSitemap
} from '../lib/lakeApi';

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

        const host = context.req.headers.host || "";

        console.log("HOST==>:", host)
        const { code, state }: { code: string, state: string } = context.query as any;
        // parse dynamic params:
        let ssr = context.params?.ssr as string[];
        if (!ssr)
            ssr = [`${process.env.DEFAULT_FORUM}`];
        let [forum] = ssr || [''];

        console.log("FORUM:", forum)
        /* if (forum == 'context') {
             if (ssr[1] == 'channel') {
                 const threadid = ssr[3];
                 const commentCC = ssr[5];
                 console.log("CONTEXT MIGRATION:", JSON.stringify({ channel, topicDummy, threadid, ccDummy, commentCC }));
                 let cc = '';
                 if (commentCC)
                     cc = commentCC.split('-')[1];
                 const key: [u: string, threadid: string, withBody: number, userslug: string] = ['topic', threadid, 0, ''];
                 const { item } = await fetchTopic(key);
                 const { tag } = item;
                 console.log("TOPIC:", JSON.stringify(item))
                 console.log("CONTEXT MIGRATION:", JSON.stringify({ channel, tag, threadid, cc }));
 
                 const url = `https://${process.env.CANONIC_DOMAIN}/usconservative/topic/${tag}/${threadid}/l1${cc ? `/${cc}#${cc}` : ''}`;
                 console.log("CONTEXT REDIRECT", url)
 
             }
             else {
                 const threadid = ssr[2];
                 const key: [u: string, threadid: string, withBody: number, userslug: string] = ['topic', threadid, 0, ''];
                 const { item } = await fetchTopic(key);
                 const { tag } = item;
                 console.log("TOPIC:", JSON.stringify(item))
                 console.log("CONTEXT MIGRATION:", JSON.stringify({ tag, threadid }));
                 const url = `https://${process.env.CANONIC_DOMAIN}/${process.env.DEFAULT_FORUM}/topic/${tag}/${threadid}`;
                 console.log("CONTEXT REDIRECT", url)
                 return {
                     redirect: {
                         permanent: true,
                         destination: url,
                     },
                     props: {},
                 };
             }
         }*/
        if (forum.indexOf("sitemap") == 0 && forum.indexOf(".txt") >= 0) {
            // console.log("params:",context.params)
            const filename = forum.split(".")[0];
            const parts = filename.split('_');
            console.log('parts:', JSON.stringify(parts))
            const host = context.req.headers.host || "";
            let [dummy, newsline, forumR, startDate] = parts;// context.params?.startDate as string[];
            const topics = await fetchSitemap(newsline, startDate);
            const sitemap = topics.map((t: any) => `https://${host}/${forumR}/topic/${t}`).join('\n')
            context.res.write(sitemap);//.split(',').map(t=>`${t}\n`));
            context.res.end();
            return { props: {} }
        }
        if (forum.indexOf("robots.txt") == 0) {
            // console.log("params:",context.params)
            const sitemaps = await fetchAllSitemaps(process.env.DEFAULT_NEWSLINE||'', process.env.DEFAULT_FORUM||'');
            const robots = sitemaps.map((t: any) => `Sitemap:  ${t}`).join('\n')
            context.res.write(robots);//.split(',').map(t=>`${t}\n`));
            context.res.end();
            return { props: {} }
        }


        if (forum != process.env.DEFAULT_FORUM) {
            context.res.statusCode = 404;
            return { props: { error: 404 } }
        }
        let type = ssr[1];
        if (!type)
            type = 'newsline';
        //  console.log("TYPE:", type)
        const tag = (type == 'topic' || type == 'home' || type == 'solo') ? ssr[2] : "";
        let threadid = (type == 'topic' || type == 'home') ? ssr[3] : "";
        if (!threadid)
            threadid = '';
        let layoutNumber = ((type == 'topic' || type == 'home') ? ssr[4] : type == 'solo' ? ssr[3] : ssr[2]) || "l1";
        let navTab = ((type == 'newsline') ? ssr[3] : type == "solo" ? ssr[4] : 0) || 1;
        let cc = (type == 'topic' || type == 'home') ? ssr[5] : '';
        if (!cc)
            cc = '';
          console.log("SSR args:", JSON.stringify({forum,type,threadid,tag,layoutNumber}))

        let ua = context.req.headers['user-agent'];
        const bowser = Bowser.getParser(ua ? ua : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36');

        const platformType = bowser.getPlatformType();
        // console.log('PLATFORM:', platformType);
        let defaultWidth = 600;
        if (platformType == 'tablet')
            defaultWidth = 900;
        else if (platformType == 'desktop')
            defaultWidth = 1200;

        const sourceDomainsString = process.env.SOURCE_DOMAINS || '';
        const sourceDomains = sourceDomainsString.split(',');

        if (host != process.env.CANONIC_DOMAIN) {
            console.log('host not eual canonic_domain')
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
        /*   sourceDomains.forEach((sd: string) => {
               console.log("SOURCE DOMAINS: ", sd, host)
               if (host.indexOf(sd) >= 0) {
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
   
           }); */

        // get encrypted session from the cookie or initialize the default   
        let startoptions = context.req.session?.options || null;
       // console.log("SSR. gpt session options", startoptions)

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

        // console.log("Options:", options)

        // TBA pre-fetching data for SSR, for now all data fetched client-side   
        const newsline = 'qwiket';

        // console.log("SSR SESSION",options)
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
            timestamp: Date.now() / 1000 | 0
        }
        const isFirstServerCall = context.req?.url?.indexOf('/_next/data/') === -1
        console.log("IS FIRST SERVER CALL=",isFirstServerCall)
        if (code) {
            console.log("CODE: ", code, state);
            const jsonState = JSON.parse(state);
            const { href } = jsonState;
            console.log("CODE: ", code, state, href);
            const user = await processLoginCode(code, host);
            if (user) {
                const { slug } = user;
                console.log("ffff1")
                //  axios.post(`/api/session/save`, { session: { userslug: slug } });
                if (context.req.session.options) {
                    console.log("context.req.session.option")
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
                console.log("redirecting after code", href)
                return {
                    redirect: {
                        permanent: true,
                        destination: href,
                    },
                    props: {},
                };
            }

            //context.res.writeHeader(301,{Location:href} );
        }
        else if (options.userslug) {
            const userSession = await getUserSession(options.userslug)
            if (userSession && !shallowEqual(options, userSession)) {
                options = userSession;
                console.log("USER SESSION IS DIFFERENT FROM LOCAL")
                if (options)
                    context.req.session.options = options;
                await context.req.session.save();
            }
        }

        const channelConfig = await fetchChannelConfig(newsline);

        // console.log("GOT channelConfig", channelConfig)
        const layoutType = type == 'topic' || type == 'home' ? 'context' : type == 'solo' ? 'newsline' : type;
        const newslineKey: fetchChannelLayoutKey = ['channelLayout', newsline, options.hasLayout, options.sessionid, options.userslug, 'newsline', options.dense, options.thick, layoutNumber];
        const contextKey: fetchChannelLayoutKey = ['channelLayout', newsline, options.hasLayout, options.sessionid, options.userslug, 'context', options.dense, options.thick, layoutNumber];
        
        //console.log("CALLING fetchChannelLayout:",key);
        const newslineLayout = await fetchChannelLayout(newslineKey);
        // console.log("GOT CHANNEL LAYOUT", JSON.stringify(channelLayout))
        // console.log("=================")
        const newslineStaleLKey = ['channelLayout', newsline, options.hasLayout, options.sessionid, options.userslug,'newsline', 0, 1, layoutNumber];
        const newslineStaleLKey1 = ['channelLayout', newsline, options.hasLayout, options.sessionid, options.userslug, 'newsline', 0, 0, layoutNumber];
        const newslineStaleLKey2 = ['channelLayout', newsline, options.hasLayout, options.sessionid, options.userslug, 'newsline', 1, 0, layoutNumber];
        const newslineStaleLKey3 = ['channelLayout', newsline, options.hasLayout, options.sessionid, options.userslug, 'newsline', 1, 1, layoutNumber];

        const contextLayout = await fetchChannelLayout(contextKey);
        // console.log("GOT CHANNEL LAYOUT", JSON.stringify(channelLayout))
        // console.log("=================")
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
            const check=threadid.split('-slug-');
            if(type=='topic'&&check.length<2&&threadid!='nro-is-moving-to-facebook-comments'){
                context.res.statusCode = 404;
                return { props: { error: 404 } }

            }
            const key: FetchTopicKey = ['topic', threadid, 1, options.userslug, tag];
            try {
                const topic = await fetchTopic(key);
               // console.log("GOT TOPIC:", JSON.stringify(topic))
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
        // console.log("META", type, JSON.stringify(meta))
        const propsWrap = {
            props: {
                session: options,
                qparams,
                fallback,
                meta
            }
        };

        //  console.log("propsWrap",JSON.stringify({ propsWrap }))
        return propsWrap;
    })