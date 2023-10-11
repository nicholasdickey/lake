// ./components/item/topic/index.tsx
import React, { useState } from "react";
import useSWR from 'swr';
import Qwiket from '../qwiket';
import { useAppContext } from '../../../lib/context';
import { fetchTopic, FetchTopicKey } from '../../../lib/lake-api'
import Disqus from './disqus'

const Topic = ({ singlePanel, fullPage }: { singlePanel?: boolean, fullPage?: boolean }) => {
  const { session, qparams,channelDetails } = useAppContext();
  const [ackOverride, setAckOverride] = useState('');
  const key: FetchTopicKey = { threadid: qparams.threadid, withBody: 1, userslug: session.userslug, sessionid: session.sessionid, tag: qparams.tag, ackOverride: qparams.isbot || qparams.isfb || ackOverride == qparams.threadid };
  const { data, error, mutate } = useSWR(key, fetchTopic);

  if (!data) {
    const item = {
      image: 'https://media.istockphoto.com/id/1280015859/photo/blue-lake-with-treeline-in-autumn-color-on-a-sunny-afternoon-in-northern-minnesota.jpg?s=612x612&w=0&k=20&c=smtj8bw1BW3gUI9rrxRnAzQKGWmTyMQYcODgbuWNMbc=',
      title: 'Loading...',
      site_name: 'America One News',
      description: "Loading...",
      slug: 'loading'
    }
    return <Qwiket extraWide={false} item={item} isTopic={true} singlePanel={singlePanel} isRight={true}></Qwiket>
  }
  
  const { title, slug } = data.item;
  return <><Qwiket extraWide={false} item={data?.item} isTopic={true} singlePanel={singlePanel} mutate={mutate} setAckOverride={setAckOverride} isRight={true} fullPage={fullPage} channelName={channelDetails.displayName}></Qwiket>
    <Disqus forum={qparams.forum} title={title} cc={qparams.cc} slug={slug} fullPage={fullPage} /></>
}
export default Topic;