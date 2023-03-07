
import React from "react"
import {
    GetServerSidePropsContext,
} from "next";

export default function Home({  }) {
    return <div/>;
}

/**
 * This is legacy root redirect page
 * 
 * @param context 
 * @returns 
 */

export const getServerSideProps=async(context: GetServerSidePropsContext)=>{

    const url=`/`;
    return {
        redirect: {
          permanent: true,
          destination: url,
        },
        props:{},
      };
}