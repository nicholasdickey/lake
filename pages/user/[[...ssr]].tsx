import React from "react"
import Common, { CommonProps } from "../../components/common"
import Bowser from "bowser";
import { SWRConfig, unstable_serialize } from 'swr'
import { fetchChannelConfig, fetchChannelLayout,fetchUser } from '../../lib/lakeApi';
import { withSessionSsr } from '../../lib/withSession';
import {fetchQueues} from '../../lib/ssrQueueFetches';

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
 * /[newsline]/[forum]/[type=topic|home]/[tag]/[silo]/[threadid]/[layout\
 * /[newsline]/[forum]/[type=newsline|solo]/[layout]
 * 
 * 
 */

export const getServerSideProps = withSessionSsr(
    async function getServerSideProps(context: GetServerSidePropsContext) {

        // parse dynamic params:
        let ssr = context.params?.ssr as string[];
        if (!ssr)
            ssr = ["qwiket", "usconservative", "newsline", "main"];
        let [newsline, forum] = ssr;
        let type=ssr[2];
        if(!type)
        type='newsline';
        const tag = (type == 'topic' || type == 'home') ? ssr[3] : "";
        const silo = (type == 'topic' || type == 'home') ? ssr[4] : "";
        const threadid = (type == 'topic' || type == 'home') ? ssr[5] : "";
        let layoutNumber = ((type == 'topic' || type == 'home') ? ssr[6] : ssr[3]);

        console.log("NEWSLINE:",newsline,forum)

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

        if (!options)
            options = {
                width: defaultWidth,
                loud: 1,
                dense: 0,
                thick: 0,
                hasLayout: false,
                hasNewslines: false,
                sessionid: '',
                userslug: '',
                band:1,
                dark:-1,

            }
        if (options && !options.width)
            options.width = defaultWidth;
        if(typeof options.userslug==='undefined')
            options.userslug='';
        if (!layoutNumber)
            layoutNumber = 'l1';
         console.log("Options:",options) 
        // TBA pre-fetching data for SSR, for now all data fetched client-side   

        const channelConfig = await fetchChannelConfig(newsline)
        //console.log("GOT channelConfig",channelConfig)
       // console.log("CALLING fetchChannelLayout:",[newsline, options.hasLayout, options.sessionid, options.userslug, type, options.dense, options.thick, layoutNumber])
        const channelLayout = await fetchChannelLayout(['channelLayout',newsline, options.hasLayout, options.sessionid, options.userslug, type, options.dense, options.thick, layoutNumber]);
        //console.log("GOT CHANNEL LAYOUT",JSON.stringify(channelLayout))
        const user = fetchUser(['user',options.userslug])
        const qparams= {
            custom: true,
            forum,
            type,
            tag,
            silo,
            newsline,
            threadid,
            layoutNumber,
            timestamp:Date.now()/1000|0
        }
        const queues=await fetchQueues({width:options.width,layout:channelLayout,qparams, session:options});
        let fallback={
            [newsline]: channelConfig,
            [unstable_serialize(['channelLayout',newsline, options.hasLayout, options.sessionid, options.userslug, type, options.dense, options.thick, layoutNumber])]: channelLayout,
            [unstable_serialize(['user',options.userslug])]:user
        }
        console.log("queues",queues)
        console.log("fallback",fallback)
        fallback=Object.assign(fallback,queues);
        console.log("fallback after assign", fallback)

        const propsWrap = {
            props: {
                session: options,
                qparams,
                fallback
            }

        };

        console.log("propsWrap",JSON.stringify({ propsWrap }))
        return propsWrap
    })