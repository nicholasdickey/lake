import Head from 'next/head'
import { useRouter } from 'next/router'
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
import { AppWrapper } from '../lib/context';
import ScrollToTopButton from './scrollToTopButton';


export interface CommonProps {
  session: Options,
  qparams: Qparams,
  fallback?: any,
  meta?: {
    description?: string,
    title?: string,
    site_name?: string,
    image?: string,
    publishedTime?: number;
    url?: string;
    canonic?: string;

  }
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
const Loading = styled.div`

  position: fixed;
  z-index: 9999;
  top: 50%;
  left: 50%;
  background-color:var(--background);
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  opacity:0.8;
  font-weight:700;

`
const CardsContainer = styled.div`
 //position:relative;
 width:100%;
 height:100%;
`
interface CardParams {
  visible: boolean
}
const Card = styled.div<CardParams>`
 position:absolute;
 width:100%;
 height:100%;
 left:0;
 visibility:${({ visible }) => visible ? 'visible' : 'hidden'};
`
export default function Home({ session: startSession, qparams, meta }: CommonProps) {

  const isFallback = qparams && qparams.newsline != 'fallback' ? false : true;
  const [qCache, setQCache] = useState({})
  const { forum, custom, type, newsline, tag, threadid, layoutNumber } = qparams ? qparams : { forum: '', custom: false, type: 'unknown', newsline: 'qwiket', tag: '', threadid: '', layoutNumber: 'l1' };
  const { data: channelConfig, error: channelError } = useSWRImmutable(newsline, fetchChannelConfig)
  const [session, setSession] = useState(startSession);
  const [theme, setTheme] = useState(session.dark != -1 ? session.dark == 1 ? 'dark' : 'light' : "unknown")
  const [loading, setLoading] = useState("");
  const router = useRouter()
 // console.log("d1b HOME", type);
  useEffect(() => {
    if (theme != 'unknown') {
      document.body.setAttribute("data-theme", theme);
    }
  }, [theme]);

  const resize = useCallback((width: number) => {
    if (custom) {
      updateSession({ width })
    }
  }, [custom])
  const updateSession = useCallback((updSession: object) => {
    if (router.asPath.indexOf('/news/') >= 0) {

      const newpath = router.asPath.replace('/news/', '/user/');
      router.replace(newpath, undefined, { shallow: true });
    }
    const assigned = { ...Object.assign(session, updSession) }
    setSession(assigned);
    axios.post(`/api/session/save`, { session: updSession });
  }, [session, router]);

  const updateSessionStealth = useCallback((updSession: object) => {
    const assigned = { ...Object.assign(session, updSession) }
    setSession(assigned);

    axios.post(`/api/session/save`, { session: updSession });
  }, [session]);
  const updateTheme = useCallback((theme: string) => {
    setTheme(theme);
    document.body.setAttribute("data-theme", theme);
    updateSession({ dark: theme == 'dark' ? 1 : 0 })
  }, [, updateSession]);

  useEffect(() => {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    if (theme == "unknown") {
      setTheme(darkModeQuery.matches ? 'dark' : 'light');
      document.body.setAttribute("data-theme", darkModeQuery.matches ? 'dark' : 'light');
    }
    if (session.dark == -1) {
      updateSessionStealth({ dark: darkModeQuery.matches ? 1 : 0 })
    }
  }, [theme, session.dark, updateSession, updateSessionStealth]);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth != session.width)
        resize(window.innerWidth)
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [resize]);


  if (isBrowser()) {
    if (window.innerWidth != session.width) {
      setTimeout(() => resize(window.innerWidth), 1);
    }
  }

  const layoutType = type == 'topic' || type == 'home' ? 'context' : type == 'solo' ? 'newsline' : 'newsline';
  const newslinekey: fetchChannelLayoutKey = ['channelLayout', qparams.newsline, session.hasLayout, session.sessionid, session.userslug, 'newsline', session.dense, session.thick, layoutNumber || 'l1'];
  const contextkey: fetchChannelLayoutKey = ['channelLayout', qparams.newsline, session.hasLayout, session.sessionid, session.userslug, 'context', session.dense, session.thick, layoutNumber || 'l1'];
  
  //console.log("RENDER LAYOUT, key=", key)

  let { data: newslineLayout, error: newslineLayoutError } = useSWR(newslinekey, fetchChannelLayout)
  
  let { data: contextLayout, error: layoutError } = useSWR(contextkey, fetchChannelLayout)
  const mainLayout=layoutType=='newsline'?newslineLayout:contextLayout;
  if (!mainLayout)
    return <Loading className={roboto.className}>Loading...</Loading>
  
  if (layoutType == 'context') {

  }

  const hpads = mainLayout?.hpads;

  if (isFallback)
    return <Loading className={roboto.className}>Fallback Loading...</Loading>





 // console.log(" d1b render common", type)
  return (
    <>
      <Head>
        <title>{meta?.title}</title>

        <link rel="canonical" href={meta?.canonic} />


        <meta name="trademark" content='THE INTERNET OF US' />
        <meta name="description" content={meta?.description} />
        <meta property="og:description" content={meta?.description} />
        <meta name="title" content={meta?.title} />
        <meta property="og:title" content={meta?.title} />
        <meta name="description" content={meta?.description} />
        <meta property="og:type" content="website" />
        <meta property="fb:appid" content="358234474670240" />
        <meta property="og:site_name" content={meta?.site_name} />
        {meta?.url ? <meta property="og:url" content={meta?.url} /> : null}
        <meta property="og:image" content={meta?.image} />

        <link
          rel="shortcut icon"
          type="image/png"
          href={"/blue-bell.png"}
        />



        <meta name="viewport" content="width=device-width, initial-scale=1" />


      </Head>
      <main className={roboto.className} >
        <ThemeProvider theme={palette}>
          <GlobalStyle />
          <AppWrapper session={session} qparams={qparams} channelDetails={channelConfig.channelDetails} newsline={channelConfig.newsline} setLoading={setLoading}>
            {loading ? <Loading className={roboto.className}>{loading}</Loading> : null}<div>
              <Topline updateTheme={updateTheme} session={session} layout={mainLayout} updateSession={updateSession} channelDetails={channelConfig.channelDetails} />
              <Grid hpads={hpads}>
                <PageWrap>
                  <Header session={session} channelSlug={channelConfig.channelSlug} channelDetails={channelConfig.channelDetails} newsline={channelConfig.newsline} layout={mainLayout} qparams={qparams} updateSession={updateSession} />
                  <CardsContainer>
                  {layoutType == 'context'&&contextLayout ? <Card visible={true}>
                      <LayoutView  visible={true} card={"drilldown"} session={session} pageType={'context'} layout={contextLayout} qparams={qparams} updateSession={updateSession} channelDetails={channelConfig.channelDetails} qCache={qCache} setQCache={setQCache} />
                    </Card> : null}
                    {newslineLayout?<Card visible={layoutType == 'newsline'}>
                      <LayoutView  visible={layoutType=='newsline'? true : false} card={"top"} session={session} pageType={'newsline'} layout={newslineLayout} qparams={qparams} updateSession={updateSession} channelDetails={channelConfig.channelDetails} qCache={qCache} setQCache={setQCache} />
                    </Card>:null}
                   
                  </CardsContainer>
                </PageWrap>
              </Grid>
              <ScrollToTopButton />
            </div>
          </AppWrapper>
        </ThemeProvider>
      </main>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.twttr = (function(d, s, id) {var js, fjs = d.getElementsByTagName(s)[0],t = window.twttr || {};if (d.getElementById(id)) return t;js = d.createElement(s);js.id = id;js.src = "https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js, fjs);t._e = [];t.ready = function(f) {t._e.push(f);};return t;}(document, "script", "twitter-wjs"));`,
          }}></script>
      </Head>

    </>
  )
}

// <LayoutView pageType={type} layout={layout} qparams={qparams} />



