
import React from "react"
import {
    GetServerSidePropsContext,
    GetServerSidePropsResult,

} from "next";
import {
    fetchChannelConfig, fetchChannelLayout, fetchUser, fetchMyNewsline, fetchPublications,
    fetchPublicationCategories, fetchPublicationsKey, fetchMyNewslineKey, Filters,
    fetchChannelLayoutKey, fetchTopic, processLoginCode, initLoginSession, getUserSession
} from '../../../lib/lakeApi';

export default function Home({  }) {

    return <div/>;
}

/**
 * 
 * URL Schema:
 * /[channel]/topic/[threadid]/cc/[cc]

 * 
 */

export const getServerSideProps=async(context: GetServerSidePropsContext)=>{
   // let params = context.params?.slug as string[];
    let slug:string= context.params?.slug as string||'';

    console.log("DISQUS MIGRATION1:",JSON.stringify({slug}));
    const s=slug.split('#');
    let commentCC='';
    let channel=process.env.DEFAULT_CHANNEL;
    
    if(s&&s.length>0){
        commentCC=s[1];
        slug=s[0];
    }
    const threadid=slug;
    console.log("DISQUS MIGRATION:",JSON.stringify({slug,commentCC}));
    let cc='';
    if(commentCC)
    cc=commentCC.split('-')[1];
    const key: [u: string, threadid: string, withBody: number,userslug:string] = ['topic', threadid, 0,''];
    const {item} = await fetchTopic(key);
    const {tag}=item;
    console.log("TOPIC:",JSON.stringify(item))
    console.log("CONTEXT MIGRATION:",JSON.stringify({channel,tag,threadid,cc}));
    
    const url=`https://${process.env.CANONIC_DOMAIN}/usconservative/topic/${tag}/${threadid}/l1${cc?`/${cc}#${cc}`:''}`;
    console.log("CONTEXT REDIRECT",url)
    return {
        redirect: {
          permanent: true,
          destination: url,
        },
        props:{},
      };
}