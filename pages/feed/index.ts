
import React from "react"
import {
    GetServerSidePropsContext,
    GetServerSidePropsResult,

} from "next";
import {
    fetchChannelConfig, fetchChannelLayout, fetchUser, fetchMyNewsline, fetchPublications,
    fetchPublicationCategories, fetchPublicationsKey, fetchMyNewslineKey, Filters,
    fetchChannelLayoutKey, fetchTopic, processLoginCode, initLoginSession, getUserSession
} from '../../lib/lakeApi';

export default function Home({  }) {

    return undefined;
}



export const getServerSideProps=async(context: GetServerSidePropsContext)=>{

    const newsline=process.env.DEFAULT_NEWSLINE;
    
    const url=`/`;
    console.log("CONTEXT REDIRECT",url)
    return {
        redirect: {
          permanent: true,
          destination: url,
        },
        props:{},
      };
}