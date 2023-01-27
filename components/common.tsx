import Head from 'next/head'
import  { useRouter } from 'next/router'
import React, { useState, useEffect, useCallback } from "react";
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'
import styled from 'styled-components';
import { ThemeProvider, DefaultTheme } from 'styled-components'
import axios from 'axios';
import { fetchChannelConfig, fetchChannelLayout, fetchChannelLayoutKey } from '../lib/lakeApi';
import { Options } from '../lib/withSession';
import { Qparams } from '../lib/qparams';
import { Topline } from './topline';
import { Header } from './header';
import GlobalStyle from '../components/globalstyles'
import { palette } from '../lib/palette';
import { LayoutView } from './layout/layoutView';
import { Roboto } from '@next/font/google';
import { AppWrapper } from '../lib/context'


/**
  * SSR will set the width according to the type of device, ISR will set the maximum width (3500) from the responsive perspective
  * custom - is set to true for SSR, false for static (i.e. - no custom user properties)
  */
export interface CommonProps {
  session: Options,
  qparams: Qparams,
  fallback?: any
}
const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '700'], style: ['normal', 'italic'] })
const isBrowser = () => typeof window !== `undefined`
interface GridProps {
  hpads: any;
}

const Grid = styled.div<GridProps>`
      padding-left: ${({ hpads }) => hpads.w0};
      padding-right: ${({ hpads }) => hpads.w0};
      width: '100%';
      @media(min-width:750px){
          padding-left: ${({ hpads }) => hpads.w750};
          padding-right: ${({ hpads }) => hpads.w750};
      }
      @media(min-width:900px){
          padding-left: ${({ hpads }) => hpads.w900};
          padding-right: ${({ hpads }) => hpads.w900};
      }
      @media(min-width:1200px){
          padding-left: ${({ hpads }) => hpads.w1200};
          padding-right: ${({ hpads }) => hpads.w1200};
      }
      @media(min-width:1600px){
          padding-left: ${({ hpads }) => hpads.w1600};
          padding-right: ${({ hpads }) => hpads.w1600};
      }
      @media(min-width:1800px){
          padding-left: ${({ hpads }) => hpads.w1800};
          padding-right: ${({ hpads }) => hpads.w1800};
      }
      @media(min-width:1950px){
          padding-left: ${({ hpads }) => hpads.w1950};
          padding-right: ${({ hpads }) => hpads.w1950};
      }
      @media(min-width:2100px){
          padding-left: ${({ hpads }) => hpads.w2100};
          padding-right: ${({ hpads }) => hpads.w2100};
      }
      @media(min-width:2400px){
          padding-left: ${({ hpads }) => hpads.w2400};
          padding-right: ${({ hpads }) => hpads.w2400};
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

  console.log("HOME:", qparams, startSession);
  const isFallback = qparams && qparams.newsline != 'fallback' ? false : true;
  //if(isFallback)
  //return <div>Fallback</div>

  const [qCache,setQCache]=useState({})
  const { forum, custom, type, newsline, tag, threadid, layoutNumber } = qparams ? qparams : { forum: '', custom: false, type: 'unknown', newsline: 'qwiket', tag: '', threadid: '', layoutNumber: 'l1' };
  const { data: channelConfig, error: channelError } = useSWRImmutable(newsline, fetchChannelConfig)
  const [session, setSession] = useState(startSession);
  const [theme, setTheme] = useState(session.dark != -1 ? session.dark == 1 ? 'dark' : 'light' : "unknown")
 // console.log("remder common.tsz: session.leftColumnOverride:", session.leftColumnOverride)
  const router = useRouter()
  //const sessionid=session.hasLayout?session.sessionid:'';
  //console.log("pathname:",router.asPath);

  useEffect(() => {
    if (theme != 'unknown') {
      document.body.setAttribute("data-theme", theme);
    }
  }, [theme]);

  // const [ userConfig, userConfigError ] = useSWR(`/api/v1/user/config?custom=${custom?1:0}&channel=${channel}&forum=${forum}`, fetcher)
  const resize = useCallback((width: number) => {
    if (custom) {
      updateSession({ width })
    }
  },[custom])
  const updateSession = useCallback((updSession: object) => {
    if (router.asPath.indexOf('/news/') >= 0) {

      const newpath = router.asPath.replace('/news/', '/user/');
     // console.log("dbg remder >>>>>>>>>>>>>>>>>>>>>>>>>updateSession, replace path to",router.asPath,newpath)
      router.replace(newpath, undefined, { shallow: true });
    }
    //console.log("updateSession ", theme, updSession)
    const assigned = { ...Object.assign(session, updSession) }
   // console.log("dbg remder new session: ", assigned, "old session:", session)
    setSession(assigned);
    axios.post(`/api/session/save`, { session: updSession });
  }, [session, router]);

  const updateSessionStealth = useCallback((updSession: object) => {
    //console.log("updateSession dark", theme, updSession)
    const assigned = { ...Object.assign(session, updSession) }
    setSession(assigned);
 
    axios.post(`/api/session/save`, { session: updSession });
  }, [session]);
  const updateTheme = useCallback((theme: string) => {
    setTheme(theme);
    //  console.log("updateTheme dark:",theme)
    document.body.setAttribute("data-theme", theme);
    updateSession({ dark: theme == 'dark' ? 1 : 0 })
  }, [, updateSession]);

  useEffect(() => {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    if (theme == "unknown") {
      // console.log("THEME IS UNKNOWN **************=>")
      setTheme(darkModeQuery.matches ? 'dark' : 'light');
      document.body.setAttribute("data-theme", darkModeQuery.matches ? 'dark' : 'light');
    }
    if (session.dark == -1) {
      updateSessionStealth({ dark: darkModeQuery.matches ? 1 : 0 })
    }
  }, [theme, session.dark, updateSession, updateSessionStealth]);
  useEffect(() => {
    const handleResize = () => {
      if(window.innerWidth!=session.width)
        resize(window.innerWidth)
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  },[resize]);


  if (isBrowser()) {
    if (window.innerWidth != session.width) {
      setTimeout(() => resize(window.innerWidth), 1);
    }


  }
  const layoutType = type == 'topic' ? 'context' : type;
  const key: fetchChannelLayoutKey = ['channelLayout', qparams.newsline, session.hasLayout, session.sessionid, session.userslug, layoutType, session.dense, session.thick, layoutNumber || 'l1'];
 // console.log("RENDER LAYOUT, key=", key)
  
  let { data: layout, error: layoutError } = useSWR(key, fetchChannelLayout)

  //console.log("RENDER: width=", session.width)
 // console.log("LAYOUT:", layout,session)
  if(!layout)
  return <div>Loading...</div>
  //if(!layout)
  //layout=oldLayout;
  //console.log("QPARAMS",qparams);
  //console.log("CHANNEL_CONFIG:", channelConfig)
  const hpads = layout?.hpads;
  //console.log ("render dark:",session)

  //opacity:${user.get("mask") ? 0.5 : 1.0};


  if (isFallback)
    return <div>Fallback Loading...</div>

  return (
    <>
      <Head>
        <title>Lake</title>
      
        <meta name="description" content="Online community newspaper" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
       


      </Head>
      <main className={roboto.className}>
        <ThemeProvider theme={palette}>
          <GlobalStyle />
          <AppWrapper session={session} qparams={qparams} channelDetails={channelConfig.channelDetails}>
            <div>
              <Topline updateTheme={updateTheme} session={session} layout={layout} updateSession={updateSession} channelDetails={channelConfig.channelDetails} />
              <Grid hpads={hpads}>
                <PageWrap>
                  <Header session={session} channelSlug={channelConfig.channelSlug} channelDetails={channelConfig.channelDetails} newsline={channelConfig.newsline} layout={layout} qparams={qparams} updateSession={updateSession} />

                  <LayoutView session={session} pageType={type} layout={layout} qparams={qparams} updateSession={updateSession } channelDetails={channelConfig.channelDetails} qCache={qCache} setQCache={setQCache} />

                </PageWrap>
              </Grid>
            </div>
          </AppWrapper>
        </ThemeProvider>
      </main>
      <Head>
      <script
          dangerouslySetInnerHTML={{
            __html: `window.twttr = (function(d, s, id) {console.log("twttr running");var js, fjs = d.getElementsByTagName(s)[0],t = window.twttr || {};if (d.getElementById(id)) return t;js = d.createElement(s);js.id = id;js.src = "https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js, fjs);t._e = [];t.ready = function(f) {t._e.push(f);};return t;}(document, "script", "twitter-wjs"));`,
          }}></script>
      </Head>

    </>
  )
}

// <LayoutView pageType={type} layout={layout} qparams={qparams} />



