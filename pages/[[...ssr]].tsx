import React from "react"
import Common, { CommonProps } from "../components/common"
import Bowser from "bowser";
import { SWRConfig, unstable_serialize } from 'swr'
import { fetchChannelConfig, fetchChannelLayout, fetchUser, fetchMyNewsline, fetchPublications, 
    fetchPublicationCategories, fetchPublicationsKey, fetchMyNewslineKey, Filters,fetchChannelLayoutKey,fetchTopic } from '../lib/lakeApi';
import { withSessionSsr } from '../lib/withSession';
import { fetchQueues } from '../lib/ssrQueueFetches';

import {
    GetServerSidePropsContext,
    GetServerSidePropsResult,
    NextApiHandler,
} from "next";


export default function Home({ session, qparams, fallback }: CommonProps) {

    return <SWRConfig value={{ fallback }}><Common session={session} qparams={qparams} /></SWRConfig>
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
    async function getServerSideProps(context: GetServerSidePropsContext) {

        // parse dynamic params:
        let ssr = context.params?.ssr as string[];
        if (!ssr)
            ssr = ["usconservative"];
        let [forum] = ssr;
        console.log("FORUM:",forum)
        let type = ssr[1];
        if (!type)
            type = 'newsline';

        const tag = (type == 'topic' || type == 'home' || type == 'solo') ? ssr[2] : "";
        const threadid = (type == 'topic' || type == 'home') ? ssr[3] : "";
        let layoutNumber = ((type == 'topic' || type == 'home') ? ssr[4] : type == 'solo' ? ssr[3] : ssr[2]) || "l1";
        let navTab = ((type == 'newsline') ? ssr[3] : type == "solo" ? ssr[4] : 0) || 1;
        let cc=(type=='topic'||type=='home')?ssr[5]:'';
        if(!cc)
            cc='';
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


        // get encrypted session from the cookie or initialize the default   
        let options = context.req.session?.options;
        console.log("SSR. gpt session options", options)

        if (!options) {
            var randomstring = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            options = {
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
            context.req.session.options = options;

            await context.req.session.save();
        }
        if (options && !options.width)
            options.width = defaultWidth;
        if (typeof options.userslug === 'undefined')
            options.userslug = '';

        console.log("Options:", options)
        
        // TBA pre-fetching data for SSR, for now all data fetched client-side   
        const newsline = 'qwiket';


        console.log("SSR SESSION",options)
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
       


        const channelConfig = await fetchChannelConfig(newsline);
        //const sessionid=options.hasNewslines?options.sessionid:'';
        //console.log("GOT channelConfig",channelConfig)
        const layoutType=type=='topic'?'context':type;
        const key:fetchChannelLayoutKey=['channelLayout', newsline, options.hasLayout, options.sessionid, options.userslug, layoutType, options.dense, options.thick, layoutNumber];
        console.log("CALLING fetchChannelLayout:",key);
        const channelLayout = await fetchChannelLayout(key);
        console.log("GOT CHANNEL LAYOUT",JSON.stringify(channelLayout))
        console.log("=================")
        const user = await fetchUser(['user', options.userslug])
      
        let fallback = {
            [newsline]: channelConfig,
            [unstable_serialize(key)]: channelLayout,
            [unstable_serialize(['user', options.userslug])]: user
        }
        
      /*
        const queues = await fetchQueues({ width: options.width, layout: channelLayout, qparams, session: options});
        //console.log("retirned fetchQueues",JSON.stringify(queues,null,4))
        
       
        if (type == 'newsline') {
            if (navTab == 1) {
                const key: fetchMyNewslineKey = ['navigator', newsline, options.sessionid, options.userslug, options.hasNewslines];
              //  const myNewsline = await fetchMyNewsline(key);
               // console.log("myNewsline:", myNewsline)
                fallback[unstable_serialize(key)] =[]// myNewsline;
            }
            else {
              //  const publicationCategories = await fetchPublicationCategories(['publicationCategories', newsline])

                fallback[unstable_serialize(['publicationCategories', newsline])] = []//publicationCategories;

                const filters: Filters = {};
               // publicationCategories.forEach((f: { tag: string }) => filters[f.tag] = true);
                //console.log("filter:",filters);
                const key: fetchPublicationsKey = ['publications', newsline, options.sessionid, options.userslug, filters, '', options.hasNewslines];
              //  const publications = await fetchPublications(key);
               // console.log("Publications key=:", key, publications);
                fallback[unstable_serialize(key)] =[]// publications;
            }
        }
        else if (type=='topic'){
            const key:[u:string,threadid:string,withBody:number]=['topic',threadid, 1];
           // const topic=await fetchTopic(key);
           // console.log("GOT TOPIC:",JSON.stringify(topic))
           const topic={
            fallback:true
           }
            fallback[unstable_serialize(key)] = topic;
        }
        //  console.log("queues",queues)
        //  console.log("fallback",fallback)
     
        fallback = Object.assign(fallback, queues);
        //  console.log("fallback after assign", fallback)
        */
        if (type=='topic'){
            const key:[u:string,threadid:string,withBody:number]=['topic',threadid, 1];
            const topic=await fetchTopic(key);
            console.log("GOT TOPIC:",JSON.stringify(topic))
           
            fallback[unstable_serialize(key)] = topic;
        }
        const propsWrap = {
            props: {
                session: options,
                qparams,
                fallback
            }
        };

        console.log("propsWrap",JSON.stringify({ propsWrap }))
        return propsWrap;
    })