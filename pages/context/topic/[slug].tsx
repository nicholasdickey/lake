
import React from "react"
import {
    GetServerSidePropsContext
} from "next";
import { fetchTopic, FetchTopicKey } from '../../../lib/lake-api';

//legacy disqus links redirect page
export default function Home({ }) {
    return <div />;
}
/**
 * 
 * URL Schema:
 * /[channel]/topic/[threadid]/cc/[cc]

 * 
 */
export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    let slug: string = context.params?.slug as string || '';
    const s = slug.split('#');
    let commentCC = '';
    let channel = process.env.DEFAULT_CHANNEL;

    if (s && s.length > 0) {
        commentCC = s[1];
        slug = s[0];
    }
    const threadid = slug;
    const cc = commentCC?.split('-')[1] || '';
    const key: FetchTopicKey = { threadid, withBody: 0, userslug: '', sessionid: '', tag: '' };
    const topic = await fetchTopic(key);
    //this should take care of removing dead pages from google index
    if (!topic.success) {
        context.res.statusCode = 404;
        return { props: { error: 404 } }
    }
    const { item } = topic;
    const { tag } = item;
    const url = `https://${process.env.CANONIC_DOMAIN}/${process.env.DEFAULT_FORUM}/topic/${tag}/${threadid}/l1${cc ? `/${cc}#${cc}` : ''}`;
    return {
        redirect: {
            permanent: true,
            destination: url,
        },
        props: {},
    };
}