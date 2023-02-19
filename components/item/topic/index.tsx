import React, { useState, useEffect, useCallback, ReactFragment, ReactNode } from "react";
import styled from 'styled-components';
import useSWR from 'swr';
import { Options } from '../../../lib/withSession';
import Qwiket from '../qwiket';
import { useAppContext } from '../../../lib/context';
import { fetchTopic,FetchTopicKey } from '../../../lib/lakeApi'
import Disqus from './disqus'
const Topic = ({singlePanel,fullPage}:{singlePanel?:boolean,fullPage?:boolean}) => {
  const { session, qparams } = useAppContext();
  const [ackOverride,setAckOverride]=useState('');
  const key:FetchTopicKey= {threadid:qparams.threadid,withBody:1,userslug:session.userslug,sessionid:session.sessionid,tag:qparams.tag,ackOverride:qparams.isbot||qparams.isfb||ackOverride==qparams.threadid};
  const { data, error ,mutate} = useSWR(key, fetchTopic);
  if (!data) {
    const item = {
      image: 'https://media.istockphoto.com/id/1280015859/photo/blue-lake-with-treeline-in-autumn-color-on-a-sunny-afternoon-in-northern-minnesota.jpg?s=612x612&w=0&k=20&c=smtj8bw1BW3gUI9rrxRnAzQKGWmTyMQYcODgbuWNMbc=',
      title: 'Loading...',
      site_name: 'America First News',
      description: "Loading...",
      slug: 'loading'

    }
    return <Qwiket extraWide={false} item={item} isTopic={true} singlePanel={singlePanel} isRight={true}></Qwiket>
  }
 // console.log("passing to Disqus:",data)
return <><Qwiket extraWide={false} item={data?.item} isTopic={true} singlePanel={singlePanel} mutate={mutate} setAckOverride={setAckOverride} isRight={true}></Qwiket>
  <Disqus contextUrl={'/context/channel/qwiket'} forum={qparams.forum} title={data?.title} realDisqThreadid={qparams.threadid} cc={qparams.cc} slug={qparams.threadid} fullPage={fullPage}/></>
}
export default Topic;