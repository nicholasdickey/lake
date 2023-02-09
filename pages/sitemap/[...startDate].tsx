
import React from "react"
import {
    GetServerSidePropsContext,
    GetServerSidePropsResult,

} from "next";
const fs = require('fs')
import {
    fetchSitemap
} from '../../lib/lakeApi';

export default function Home() {
    return undefined;
}

/**
 * 
 * URL Schema:
 * /sitemap/[newsline]/[forum]/[startDate]

 * 
 */

export const getServerSideProps=async(context: GetServerSidePropsContext)=>{
    console.log("params:",context.params)
    const host = context.req.headers.host || "";
    let [newsline,forum,startDate] = context.params?.startDate as string[];
    const topics=await fetchSitemap(newsline,startDate);
    //console.log("SITEMAP:",newsline,startDate,topics);
    const sitemap=topics.map(t=>`https://${host}/${forum}/topic/${t}`).join('\n')
    fs.writeFileSync(`public/sitemap-${newsline}-${startDate}.txt`, sitemap)
    context.res.write(sitemap);//.split(',').map(t=>`${t}\n`));
    context.res.end();
    return {props:{}}
}