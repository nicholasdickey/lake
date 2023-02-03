import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../../styles/Home.module.css'
import { useRouter } from 'next/router'
import Common, { CommonProps } from "../../components/common"
import {
    fetchChannelConfig, fetchChannelLayout, fetchUser, fetchMyNewsline, fetchPublications,
    fetchPublicationCategories, fetchMyNewslineKey, fetchPublicationsKey, fetchChannelLayoutKey, Filters, fetchTopic
} from '../../lib/lakeApi';

import { SWRConfig, unstable_serialize } from 'swr'
import { fetchQueues } from '../../lib/ssrQueueFetches';
const inter = Inter({ subsets: ['latin'] })
export default function Home({ session, qparams, fallback }: CommonProps) {
    if (!fallback)
        fallback = {}   // this is fallback page
    if (!session)
        session = { width: 3000, dark: 1, dense: 0, thick: 0, band: 0, loud: 0, sessionid: '', userslug: '', hasLayout: false, hasNewslines: false };
    if (!qparams)
        qparams = { cc: '', forum: '', custom: false, type: 'unknown', newsline: 'fallback', tag: '', threadid: '', layoutNumber: 'l1', timestamp: 0 };
    return <SWRConfig value={{ fallback }}><Common session={session} qparams={qparams} /></SWRConfig>
}
interface StaticParams {
    params: { static: string[] }
}
export async function getStaticProps(props: StaticParams) {
    const { params } = props;
    console.log("getStaticProps", params)
    let ssr = props.params?.static as string[];
    if (!ssr)
        ssr = ["usconservative"];
    let [forum] = ssr;
    console.log("FORUM:", forum)
    let type = ssr[1];
    if (!type)
        type = 'newsline';

    const tag = (type == 'topic' || type == 'home' || type == 'solo') ? ssr[2] : "";
    const threadid = (type == 'topic' || type == 'home') ? ssr[3] : "";
    let layoutNumber = ((type == 'topic' || type == 'home') ? ssr[4] : type == 'solo' ? ssr[3] : ssr[2]) || "l1";
    let navTab = ((type == 'newsline') ? ssr[3] : type == "solo" ? ssr[4] : 0) || 1;
    let commentid = (type == 'topic' || type == 'home') ? ssr[5] : '';

    console.log("STATIC args:", JSON.stringify({ forum, type, threadid, tag, layoutNumber }))
    const options = {
        width: 920,
        loud: 0,
        dense: 0,
        thick: 0,
        band: 0,
        hasLayout: false,
        hasNewslines: false,
        sessionid: '',
        userslug: '',
        dark: -1

    }
    const newsline = 'qwiket';

    const qparams = {
        custom: false,
        forum,
        type,
        tag,
        navTab: +navTab,
        newsline,
        threadid,
        layoutNumber,
        cc: '',
        timestamp: Date.now() / 1000 | 0
    }
    console.log('QPARAMS:', qparams)
    const channelConfig = await fetchChannelConfig(newsline)
    console.log("GOT channelConfig", channelConfig)


    console.log("CALLING fetchChannelLayout:", [newsline, options.hasLayout, options.sessionid, options.userslug, type, options.dense, options.thick, layoutNumber])

    console.log("********")



    const layoutType = type == 'topic' ? 'context' : type;

    const key: fetchChannelLayoutKey = ['channelLayout', newsline, options.hasLayout, options.sessionid, options.userslug, layoutType, options.dense, options.thick, layoutNumber];
    console.log("CALLING fetchChannelLayout:", key);
    const channelLayout = await fetchChannelLayout(key);
    console.log("GOT CHANNEL LAYOUT", JSON.stringify(channelLayout))
    const user = await fetchUser(['user', options.userslug])

    const queues = await fetchQueues({ width: options.width, layout: channelLayout, qparams, session: options });
    let fallback = {
        [newsline]: channelConfig,
        [unstable_serialize(key)]: channelLayout,
        [unstable_serialize(['user', options.userslug])]: user
    }
    if (type == 'newsline') {
        if (navTab == 1) {
            const key: fetchMyNewslineKey = ['navigator', newsline, options.sessionid, options.userslug, options.hasNewslines];

            const myNewsline = await fetchMyNewsline(key);
            console.log("myNewsline:", myNewsline)
            fallback[unstable_serialize(key)] = myNewsline;
        }
        else {
            const publicationCategories = await fetchPublicationCategories(['publicationCategories', newsline])

            fallback[unstable_serialize(['publicationCategories', newsline])] = publicationCategories;
            interface FiltersArray {
                [key: string]: boolean;
            }
            const filters: Filters = {};
            publicationCategories.forEach((f: { tag: string }) => filters[f.tag] = true)
            console.log("filter:", filters)
            const key: fetchPublicationsKey = ['publications', newsline, options.sessionid, options.userslug, filters, '', options.hasNewslines];

            const publications = await fetchPublications(key);
            console.log("Publications key=:", key, publications)
            fallback[unstable_serialize(key)] = publications;
        }
    }
    else if (type == 'topic') {
        const key: [u: string, threadid: string, withBody: number] = ['topic', threadid, 1];
        const topic = await fetchTopic(key);
        console.log("GOT TOPIC:", JSON.stringify(topic))
        fallback[unstable_serialize(key)] = topic;
    }
    //  co
    // console.log("queues", queues)
    //  console.log("fallback", fallback)
    fallback = Object.assign(fallback, queues);
    //  console.log("fallback after assign", fallback)

    const propsWrap = {
        props: {
            session: options,
            qparams,
            fallback
        },
        revalidate: 3600
    };
    return propsWrap;
}
export async function getStaticPaths() {
    return {
        paths: [{ params: { static: ["usconservative"] } }],
        fallback: true, // can also be true or 'blocking'
    }
}

