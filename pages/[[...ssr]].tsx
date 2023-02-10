import React from "react"
import Error from 'next/error'
import Common, { CommonProps } from "../components/common"
import Bowser from "bowser";
import { SWRConfig, unstable_serialize } from 'swr'
import axios from 'axios';
import {
    fetchChannelConfig, fetchChannelLayout, fetchUser, fetchMyNewsline, fetchPublications,
    fetchPublicationCategories, fetchPublicationsKey, fetchMyNewslineKey, Filters,
    fetchChannelLayoutKey, fetchTopic, processLoginCode, initLoginSession, getUserSession
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
        //console.log("HOST:", host)
        const { code, state }: { code: string, state: string } = context.query as any;
        // parse dynamic params:
        let ssr = context.params?.ssr as string[];
        if (!ssr)
            ssr = [`${process.env.DEFAULT_FORUM}`];
        let [forum] = ssr||[''];

        console.log("FORUM:", forum)
        if(forum.indexOf("sitemap")==0 && forum.indexOf(".txt")>=0){
           // console.log("params:",context.params)
            const filename=forum.split(".")[0];
            const parts=filename.split('_');
            console.log('parts:', JSON.stringify(parts))
            const host = context.req.headers.host || "";
            let [dummy,newsline,forumR,startDate] =parts;// context.params?.startDate as string[];
            const topics=await fetchSitemap(newsline,startDate);
            const sitemap=topics.map(t=>`https://${host}/${forumR}/topic/${t}`).join('\n')
            context.res.write(sitemap);//.split(',').map(t=>`${t}\n`));
            context.res.end();
            return {props:{}}
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
        const threadid = (type == 'topic' || type == 'home') ? ssr[3] : "";
        let layoutNumber = ((type == 'topic' || type == 'home') ? ssr[4] : type == 'solo' ? ssr[3] : ssr[2]) || "l1";
        let navTab = ((type == 'newsline') ? ssr[3] : type == "solo" ? ssr[4] : 0) || 1;
        let cc = (type == 'topic' || type == 'home') ? ssr[5] : '';
        if (!cc)
            cc = '';
        //  console.log("SSR args:", JSON.stringify({forum,type,threadid,tag,layoutNumber}))

        let ua = context.req.headers['user-agent'];
        const bowser = Bowser.getParser(ua ? ua : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36');

        const platformType = bowser.getPlatformType();
        // console.log('PLATFORM:', platformType);
        let defaultWidth = 600;
        if (platformType == 'tablet')
            defaultWidth = 900;
        else if (platformType == 'desktop')
            defaultWidth = 1200;


        // get encrypted session from the cookie or initialize the default   
        let startoptions = context.req.session?.options || null;
        // console.log("SSR. gpt session options", options)

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
        //const isFirstServerCall = context.req?.url?.indexOf('/_next/data/') === -1
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
        const layoutType = type == 'topic' ? 'context' : type == 'solo' ? 'newsline' : type;
        const key: fetchChannelLayoutKey = ['channelLayout', newsline, options.hasLayout, options.sessionid, options.userslug, layoutType, options.dense, options.thick, layoutNumber];
        //console.log("CALLING fetchChannelLayout:",key);
        const channelLayout = await fetchChannelLayout(key);
       // console.log("GOT CHANNEL LAYOUT", JSON.stringify(channelLayout))
        // console.log("=================")
        const staleLKey = ['channelLayout', newsline, options.hasLayout, options.sessionid, options.userslug, layoutType, 0, 1, layoutNumber];
        const staleLKey1 = ['channelLayout', newsline, options.hasLayout, options.sessionid, options.userslug, layoutType, 0, 0, layoutNumber];
        const staleLKey2 = ['channelLayout', newsline, options.hasLayout, options.sessionid, options.userslug, layoutType, 1, 0, layoutNumber];
        const staleLKey3 = ['channelLayout', newsline, options.hasLayout, options.sessionid, options.userslug, layoutType, 1, 1, layoutNumber];


        const user = await fetchUser(['user', options.userslug])

        let fallback = {
            [newsline]: channelConfig,
            [unstable_serialize(key)]: channelLayout,
            [unstable_serialize(staleLKey)]: channelLayout, // to provide SWR with stale date to avoid flashing loading screen
            [unstable_serialize(staleLKey1)]: channelLayout,
            [unstable_serialize(staleLKey2)]: channelLayout,
            [unstable_serialize(staleLKey3)]: channelLayout,
            [unstable_serialize(['user', options ? options.userslug : ''])]: user
        }

        let meta: {
            description?: string,
            title?: string,
            site_name?: string,
            image?: string,
            publishedTime?: number,
            url?: string;

        } = {};
        if (type == 'topic') {
            const key: [u: string, threadid: string, withBody: number, userslug: string] = ['topic', threadid, 1, options.userslug];
           try{
            const topic = await fetchTopic(key);
           // console.log("GOT TOPIC:", JSON.stringify(topic))

            fallback[unstable_serialize(key)] = topic;
            const { item } = topic;
            meta.description = item.description;
            meta.site_name = item.site_name;
            meta.title = `${item.catName}: ${item.title}`;
            meta.image = item.image;
            meta.publishedTime = item.shared_time;
            meta.url = item.shared_time;
           }
           catch(x){
            console.log("FETCH TOPIC ERROR",x);
            context.res.statusCode = 404;
            return { props: { error: 404 } }
           }
        }
        else {
            meta.description = channelConfig.channelDetails.description;
            meta.site_name = channelConfig.channelDetails.displayName;
            meta.title = channelConfig.channelDetails.displayName
            meta.image == channelConfig.channelDetails.logo;
            meta.publishedTime = Date.now() / 1000 | 0;
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

        // console.log("propsWrap",JSON.stringify({ propsWrap }))
        return propsWrap;
    })