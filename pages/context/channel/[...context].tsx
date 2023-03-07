
import React from "react"
import {
    GetServerSidePropsContext,
    GetServerSidePropsResult,

} from "next";
import {fetchTopic,FetchTopicKey} from '../../../lib/lake-api';

//migrate and redirect legacy topic pages
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
    const cc=commentCC?.split('-')[1]||'';

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
    const url=`https://${process.env.CANONIC_DOMAIN}/${process.env.DEFAULT_FORUM}/topic/${tag}/${threadid}/l1${cc?`/${cc}#${cc}`:''}`;
    return {
        redirect: {
          permanent: true,
          destination: url,
        },
        props:{},
      };
}