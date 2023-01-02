import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../../styles/Home.module.css'
import { useRouter } from 'next/router'
import Common, { CommonProps } from "../../components/common"
import { fetchChannelConfig, fetchChannelLayout, fetchUser } from '../../lib/lakeApi';
import { SWRConfig, unstable_serialize } from 'swr'
import { fetchQueues } from '../../lib/ssrQueueFetches';
const inter = Inter({ subsets: ['latin'] })
export default function Home({ session, qparams, fallback }: CommonProps) {

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
        ssr = ["qwiket", "usconservative", "newsline"];
    let [newsline, forum, type] = ssr;
    if (!type)
        type = "newsline";
    const tag = (type == 'topic' || type == 'home') ? ssr[3] : "";
    const silo = (type == 'topic' || type == 'home') ? ssr[4] : "";
    const threadid = (type == 'topic' || type == 'home') ? ssr[5] : "";
    let layoutNumber = ((type == 'topic' || type == 'home') ? ssr[6] : ssr[3]);
    if (!layoutNumber)
        layoutNumber = 'l1';
    const options = {
        width: 3500,
        loud: 1,
        dense: 0,
        thick: 0,
        band: 1,
        hasLayout: false,
        hasNewslines: false,
        sessionid: '',
        userslug: '',
        dark: -1

    }
    const channelConfig = await fetchChannelConfig(newsline)
    console.log("GOT channelConfig", channelConfig)
    console.log("CALLING fetchChannelLayout:", [newsline, options.hasLayout, options.sessionid, options.userslug, type, options.dense, options.thick, layoutNumber])
    const channelLayout = await fetchChannelLayout(['channelLayout', newsline, options.hasLayout, options.sessionid, options.userslug, type, options.dense, options.thick, layoutNumber]);
    console.log("GOT CHANNEL LAYOUT", JSON.stringify(channelLayout))
    const user = await fetchUser(['user', options.userslug])
    const qparams = {
        custom: false,
        forum,
        type,
        tag,
        silo,
        newsline,
        threadid,
        layoutNumber,
        timestamp: Date.now() / 1000 | 0
    }
    const queues = await fetchQueues({ width: options.width, layout: channelLayout, qparams, session: options });
    let fallback = {
        [newsline]: channelConfig,
        [unstable_serialize(['channelLayout', newsline, options.hasLayout, options.sessionid, options.userslug, type, options.dense, options.thick, layoutNumber])]: channelLayout,
        [unstable_serialize(['user', options.userslug])]: user
    }
    console.log("queues", queues)
    console.log("fallback", fallback)
    fallback = Object.assign(fallback, queues);
    console.log("fallback after assign", fallback)

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
        paths: [{ params: { static: ["qwiket", "usconservative"] } }],
        fallback: "blocking", // can also be true or 'blocking'
    }
}

