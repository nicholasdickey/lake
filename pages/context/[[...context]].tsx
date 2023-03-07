
import React from "react"
import {
  GetServerSidePropsContext,
} from "next";
import {
  fetchTopic, FetchTopicKey
} from '../../lib/lake-api';

//this is legacy migration and redirect page
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
  let params = context.params?.context as string[];
  let [usconservative, channel, topicDummy, threadid, ccDummy, commentCC] = params;
  if (usconservative == process.env.DEFAULT_FORUM) {
    channel = process.env.DEFAULT_CHANNEL || "";
    threadid = topicDummy
  }
  const cc = commentCC?.split('-')[1] || '';
  const key: FetchTopicKey = { threadid, withBody: 0, userslug: '', sessionid: '', tag: '' };
  const { item } = await fetchTopic(key);
  if (!item) {
    return {
      redirect: {
        permanent: true,
        destination: '/',
      },
      props: {},
    };
  }
  const { tag } = item ? item : { tag: '' };
  const url = `https://${process.env.CANONIC_DOMAIN}/${process.env.DEFAULT_FORUM}/topic/${tag}/${threadid}/l1${cc ? `/${cc}#${cc}` : ''}`;
  return {
    redirect: {
      permanent: true,
      destination: url,
    },
    props: {},
  };
}