
import React from "react"
import {
    GetServerSidePropsContext,
    GetServerSidePropsResult,

} from "next";


export default function Home({  }) {

    return <div/>;
}



export const getServerSideProps=async(context: GetServerSidePropsContext)=>{

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