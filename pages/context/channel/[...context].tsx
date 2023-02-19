
import React from "react"
import {
    GetServerSidePropsContext,
    GetServerSidePropsResult,

} from "next";
import {
    fetchChannelConfig, fetchChannelLayout, fetchUser, fetchMyNewsline, fetchPublications,
    fetchPublicationCategories, fetchPublicationsKey, fetchMyNewslineKey, Filters,
    fetchChannelLayoutKey, fetchTopic,FetchTopicKey, processLoginCode, initLoginSession, getUserSession
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
    let params = context.params?.context as string[];
    const [channel,topicDummy,threadid,ccDummy,commentCC]=params;
    console.log("CONTEXT MIGRATION:",JSON.stringify({channel,topicDummy,threadid,ccDummy,commentCC}));
    let cc='';
    if(commentCC)
    cc=commentCC.split('-')[1];

    const key:FetchTopicKey= {threadid,withBody:0,userslug:'',sessionid:'',tag:''};
    const {item} = await fetchTopic(key);
    if(!item){
        return {
            redirect: {
              permanent: true,
              destination: '/',
            },
            props:{},
          };
    }
    const {tag}=item?item:{tag:''};
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