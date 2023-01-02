import Head from 'next/head'
import Router, { useRouter } from 'next/router'
import React, { useState, useEffect,useCallback } from "react";
import useSWR from 'swr'
import styled from 'styled-components';
import { ThemeProvider, DefaultTheme } from 'styled-components'
import axios from 'axios';
import { fetchChannelConfig, fetchChannelLayout } from '../lib/lakeApi';
import { Options } from '../lib/withSession';
import { Qparams } from '../lib/qparams';
import { Topline } from './topline';
import { Header } from './header';
import GlobalStyle from '../components/globalstyles'
import { palette } from '../lib/palette';
import {LayoutView} from './layout/layoutView';
import { Inter} from '@next/font/google'

/**
  * SSR will set the width according to the type of device, ISR will set the maximum width (3500) from the responsive perspective
  * custom - is set to true for SSR, false for static (i.e. - no custom user properties)
  */
export interface CommonProps {
  session: Options,
  qparams: Qparams,
  fallback?: any
}
const roboto = Inter({ subsets: ['latin'] })
const isBrowser = () => typeof window !== `undefined`
const Grid = styled.div`
      padding-left: ${props => props.hpads.w0};
      padding-right: ${props => props.hpads.w0};
      width: '100%';
      @media(min-width:750px){
          padding-left: ${props => props.hpads.w750};
          padding-right: ${props => props.hpads.w750};
      }
      @media(min-width:900px){
          padding-left: ${props => props.hpads.w900};
          padding-right: ${props => props.hpads.w900};
      }
      @media(min-width:1200px){
          padding-left: ${props => props.hpads.w1200};
          padding-right: ${props => props.hpads.w1200};
      }
      @media(min-width:1600px){
          padding-left: ${props => props.hpads.w1600};
          padding-right: ${props => props.hpads.w1600};
      }
      @media(min-width:1800px){
          padding-left: ${props => props.hpads.w1800};
          padding-right: ${props => props.hpads.w1800};
      }
      @media(min-width:1950px){
          padding-left: ${props => props.hpads.w1950};
          padding-right: ${props => props.hpads.w1950};
      }
      @media(min-width:2100px){
          padding-left: ${props => props.hpads.w2100};
          padding-right: ${props => props.hpads.w2100};
      }
      @media(min-width:2400px){
          padding-left: ${props => props.hpads.w2400};
          padding-right: ${props => props.hpads.w2400};
      }
  `;
const PageWrap = styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
  `;

  /*color:var(--text);
  background-color:var(--background);
 */
//color: ${props => props.theme.color};
  //background-color: ${props => props.theme.background};
// set up detection of system dark mode


export default function Home({ session: startSession, qparams }: CommonProps) {
  const { forum, custom, type, newsline, tag, threadid, layoutNumber } = qparams;
  const { data: channelConfig, error: channelError } = useSWR(qparams.newsline, fetchChannelConfig)
  const [session, setSession] = useState(startSession);
  const [theme,setTheme]=useState(session.dark!=-1?session.dark==1?'dark':'light':"unknown")
  console.log("R!:", session)
  const router = useRouter()
  console.log("pathname:",router.asPath);
  useEffect(() => {
    if(theme!='unknown'){
      document.body.setAttribute("data-theme", theme);
    }
  }, [theme]);
  
  // const [ userConfig, userConfigError ] = useSWR(`/api/v1/user/config?custom=${custom?1:0}&channel=${channel}&forum=${forum}`, fetcher)
  const resize = (width: number) => {
    if (custom) {
      updateSession({ width })
    }
  }
 const updateSession = useCallback((updSession: object) => {
  if(router.asPath.indexOf('/news/')>=0){
   
    const newpath=router.asPath.replace('/news/','/user/');
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>updateSession, replace path to",router.asPath,newpath)
    router.replace(newpath,undefined,{shallow:true});
  }
    console.log("updateSession dark", theme, updSession)
    const assigned={...Object.assign(session, updSession)}
    setSession(assigned);
    axios.post(`/api/session/save`, { session: updSession });
  },[session]);
  const updateSessionStealth = useCallback((updSession: object) => {
     //console.log("updateSession dark", theme, updSession)
      const assigned={...Object.assign(session, updSession)}
      setSession(assigned);
      axios.post(`/api/session/save`, { session: updSession });
    },[session]);
  const updateTheme=useCallback((theme:string)=>{
    setTheme(theme);
    console.log("updateTheme dark:",theme)
    document.body.setAttribute("data-theme", theme);
    updateSession({dark:theme=='dark'?1:0})
  },[theme]);
  useEffect(() => {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    if(theme=="unknown"){
      console.log("THEME IS UNKNOWN **************=>")
      setTheme( darkModeQuery.matches ?'dark':'light');
      document.body.setAttribute("data-theme", darkModeQuery.matches ?'dark':'light');
    } 
    if(session.dark==-1){
      updateSessionStealth({dark:darkModeQuery.matches ?1:0 })
    }
  }, [theme,session.dark,updateSession]);
  useEffect(() => {
    const handleResize = () => {
      resize(window.innerWidth)
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });
  
  if (isBrowser()) {
    if (window.innerWidth != session.width) {
      setTimeout(() => resize(window.innerWidth), 1);
    }
    

  }
  const { data: layout, error: layoutError } = useSWR(['channelLayout', qparams.newsline, session.hasLayout, session.sessionid, session.userslug, type, session.dense, session.thick, layoutNumber], fetchChannelLayout)


  console.log("RENDER: width=", session.width)
  console.log("LAYOUT:", layout)
  console.log("QPARAMS",qparams);
  console.log("CHANNEL_CONFIG:", channelConfig)
  const hpads = layout.hpads;
  console.log ("render dark:",session)

  //opacity:${user.get("mask") ? 0.5 : 1.0};
  return (
    <>
      <Head>
        <title>Lake</title>
        <meta name="description" content="Online community newspaper" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        
      </Head>
      <main  className={roboto.className}>
        <ThemeProvider theme={palette}>
        <GlobalStyle />
          <div>
            <Topline updateTheme={updateTheme} session={session} layout={layout} updateSession={updateSession} />
            <Grid hpads={hpads}>
              <PageWrap>
                <Header session={session} channelSlug={channelConfig.channelSlug} channelDetails={channelConfig.channelDetails} newsline={channelConfig.newsline} layout={layout} qparams={qparams} updateSession={updateSession} />
                <LayoutView  session={session}  pageType={type} layout={layout} qparams={qparams} />
              </PageWrap>
            </Grid>
          </div>
        </ThemeProvider>
      </main>

    </>
  )
}

// <LayoutView pageType={type} layout={layout} qparams={qparams} />



