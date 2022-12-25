import Head from 'next/head'
import React, { useState, useEffect } from "react";
import useSWR from 'swr'
import styled from 'styled-components';

import axios from 'axios'
import { isGeneratorFunction } from 'util/types';

const fetcher = (url: string) => axios.get(url).then(res => res.data)
/**
  * SSR will set the width according to the type of device, ISR will set the maximum width (3500) from the responsive perspective
  * custom - is set to true for SSR, false for static (i.e. - no custom user properties)
  */
export interface CommonProps {
  session: {
    width: number
  },
  custom: boolean,
  channel: string,
  forum: string,
  type: string,
  newsline: string,
  tag: string,
  threadid: string,
  layoutNumber: number
}
const isBrowser = () => typeof window !== `undefined`
export default function Home({ channel, forum, custom, session, type, newsline, tag, threadid, layoutNumber }: CommonProps) {
 console.log("R!:",session)
  const [width, setWidth] = useState(session.width);
  // const [ userConfig, userConfigError ] = useSWR(`/api/v1/user/config?custom=${custom?1:0}&channel=${channel}&forum=${forum}`, fetcher)
  const resize=(width:number)=>{
    console.log("resize",width)
    setWidth(width);
    axios.get(`/api/setWidth?width=${width}`);
    
  }
  useEffect(() => {
    const handleResize = () => {
      resize(window.innerWidth)
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });
  if(isBrowser()){
    if(window.innerWidth!=width){
     setTimeout(()=>resize(window.innerWidth),1);
    }
  }
  console.log("RENDER:",width,session.width)
  return (
    <>
      <Head>
        <title>Lake</title>
        <meta name="description" content="Online community newspaper" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main >
        Common Page
        <p>{channel}</p>
        <p>{forum}</p>
        <p>{newsline}</p>
        <p>Width==: {width}</p>
        <p>SSR Session:{JSON.stringify(session)}</p>
      </main>

    </>
  )
}
