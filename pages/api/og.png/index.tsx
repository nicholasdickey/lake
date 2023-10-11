import React from 'react';
import type { NextApiRequest, NextApiResponse } from 'next'
import { ImageResponse } from 'next/server';

export const size = { width: 1200, height: 600 };
export const alt = 'OpenGraph Image';
export const contentType = 'image/png';
export const runtime = 'edge';

export const config = {
    runtime: "edge",
    size : { width: 1200, height: 600 }
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
        description = descriptionSplit[1].replaceAll('<p>', '').replaceAll('</p>', '');
    }

    //console.log("image:", rsp, { image, catIcon, catName });
    const response = new ImageResponse(
   ( <div style={{width:1200,height:1600,background:"#000",position:"relative",display:"flex",flexDirection:"column",alignItems:"center"}}>
        
        <div style={{opacity:"0.4",display:"flex",width:"100%",height:"100%"} }><img width={1200} src={image}/></div>
        
        <div style={{width:1200,height:1600, overflow: "hidden",textOverflow:"ellipses", padding:20,color:'#fff',position:"absolute",display:"flex",flexDirection:"column",alignItems:"center",fontSize:"28px"}}>
        
            <div style={{display:'flex',justifyContent:'space-between'}}>
                <img  width={80} height={80} style={{marginTop:10,marginLeft:0,borderRadius:0}} src={catIcon}/>
                <div style={{width:'90%',fontSize:'44px',padding:40}}>{title}</div> 
            </div>
            <div style={{display:'flex',margin:20}}>{description}</div>
            <div style={{ width:'100%',textAlign:"right", marginTop:20, marginLeft:40,fontSize:18,color:'#f44', overflow: "hidden",textOverflow:"ellipses", padding:0,display:"flex"}}>
                <b><em>Summary Copyright &copy; {`${(process.env.NEXT_PUBLIC_LAKEAPI||"").indexOf("american")>=0?'American Outdoorsman':'America One News'}`}</em></b>
            </div>
        </div >

        
    </div >    
    ),
    {
      width: 1200,
      height: 600,
    }
    )
    ;
    return response;

}
export default handler;   