import React from 'react';
import type { NextApiRequest, NextApiResponse } from 'next'
import { ImageResponse } from 'next/server';
import styled from 'styled-components';
import {
    fetchChannelConfig, fetchChannelLayout, fetchUser, fetchSitemap,
    fetchAllSitemaps, fetchChannelLayoutKey, fetchTopic, FetchTopicKey, processLoginCode, initLoginSession, getUserSession
} from '../../../lib/lake-api';
import { ReadStream } from 'fs';
const BackgroundImage = styled.div`
    width:100%;
    height:100%;
    position:absolute;
    z-index:0;
    opacity:0.1;
    

`;
const Item = styled.div`
    position:absolute;
    width:100%;
    height:100%;
    display:flex; 
    flex-direction:column;
    align-items:center;
    z-index:100;
    color:"red";
`;
export const config = {
    runtime: "edge",
}
/**
 * Note: the incoming session object could be only partial, will be merged over existing session
 * 
 * @param req 
 * 
 * @param res 
 * @returns 
 */
async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    //  console.log("req:",{method:req.method,url:req.url,query:req.query,body:req.body,headers:req.headers});

    //const threadid=req.nextUrl.searchParams.get(['threadid']);
    const url = req.url || "";
    const parts = url.split('?');
    const params = parts[1].split('&');
    const threadid = params[0].split('=')[1];
    const tag = params[1].split('=')[1];
    //console.log("threadid:",threadid);
    //console.log("tag:",tag);
    //let { threadid = '',tag=''} = req.query;
    //const key: FetchTopicKey = { threadid:threadid as string, withBody: 1, userslug: "og", sessionid: "", tag: tag as string, ackOverride: false};
    const lakeApiUrl = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/topic/fetch?slug=${encodeURIComponent(threadid)}&withBody=${1}&userslug=${"og"}&sessionid=${"og"}&tag=${tag}`;

    const rsp: any = await fetch(lakeApiUrl).then((res) => res.json());;
    let {
        catName = "", catIcon = "", description = "", title = "", site_name = "", author = "", image = ""
    } = rsp.item;
    const descriptionSplit = description.split("{ai:summary}");
    if (descriptionSplit.length > 1) {
        description = descriptionSplit[1].replace('<p>', '').replace('</p>', '');
    }

    //console.log("image:", rsp, { image, catIcon, catName });
    const response = new ImageResponse(
    <div style={{position:"relative",display:"flex",flexDirection:"column",alignItems:"center"}}>
        
        <div style={{opacity:"0.9",display:"flex",width:"100%",height:"100%"} }><img src={image}/></div>
        
        <div style={{color:'#fff',position:"absolute",width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",padding:"20px",fontSize:"28px"}}>
        
            <div style={{display:'flex'}}><img  width={40} height={40} style={{margin:40,borderRadius:40}} src={catIcon}/>
            <div style={{fontSize:'44px'}}>{title}</div> </div>
            <div>{description}</div>
        
        
        </div >
    </div >    
    )
    ;
    return response;

}
export default handler;   