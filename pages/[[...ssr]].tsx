import Common,{CommonProps} from "../components/common"
import Bowser from "bowser";
import { withSessionSsr } from "../lib/withSession";
import {
    GetServerSidePropsContext,
    GetServerSidePropsResult,
    NextApiHandler,
  } from "next";

export default function Home({session,channel,forum,type,tag,newsline,threadid,layoutNumber}:CommonProps) {
    return <Common session={session} custom={true} channel={channel} forum={forum} newsline={newsline} type={type} tag={tag} threadid={threadid} layoutNumber={layoutNumber} />
}

/**
 * 
 * URL Schema:
 * /[channel]/[forum]/[type=topic|home]/[tag]/[silo]/[threadid]/[layout\
 * /[channel]/[forum]/[type=newsline|solo]/[newsline]/[layout]
 * 
 * 
 */
  
export const getServerSideProps = withSessionSsr(
 async function getServerSideProps( context: GetServerSidePropsContext) {
    
// parse dynamic params:
    let ssr=context.params?.ssr as string[];
    if(!ssr)
        ssr=["qwiket","usconservative","newsline","main"];
    const [channel,forum,type]=ssr;
    const tag=(type=='topic'||type=='home')?ssr[3]:"";
    const silo=(type=='topic'||type=='home')?ssr[4]:"";
    const threadid=(type=='topic'||type=='home')?ssr[5]:"";
    let layoutNumber=+((type=='topic'||type=='home')?ssr[6]:ssr[4]);
    const newsline=(type=='newsline'||type=='solo')?ssr[3]:"";


    let ua = context.req.headers['user-agent'];
    console.log({ ua })
    const bowser = Bowser.getParser(ua ? ua : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36');

    const platformType = bowser.getPlatformType();
    console.log('PLATFORM:', platformType);
    let defaultWidth = 600;
    if (platformType == 'tablet')
        defaultWidth = 900;
    else if (platformType == 'desktop')
        defaultWidth = 1200;


// get encrypted session from the cookie or initialize the default   
    let options=context.req.session?.options;
    console.log("SSR. gpt session options",options)
    if(!options)
    options={
        width:defaultWidth
    }
    if(options&&!options.width)
    options.width=defaultWidth;

    if(!layoutNumber)
        layoutNumber=1;

    // TBA pre-fetching data for SSR, for now all data fetched client-side    
    const propsWrap={
        props: {
            custom:true,
            channel,
            forum,
            session:options,
            type,
            tag,
            silo,
            newsline,
            threadid,
            layoutNumber

        }, // will be passed to the page component as props
    }
    console.log(JSON.stringify({propsWrap}))
    return propsWrap
})