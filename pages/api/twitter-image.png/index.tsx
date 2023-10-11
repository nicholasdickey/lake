import React from 'react';
import type { NextApiRequest, NextApiResponse } from 'next'
import { ImageResponse } from 'next/server';

export const size = { width: 1200, height: 600 };
export const alt = 'OpenGraph Image';
export const contentType = 'image/png';
export const runtime = 'edge';

export const config = {
    runtime: "edge",
    size : { width: 1200, height: 1600 }
}
function removeHashtags(inputString: string): string {
    // Use a regular expression to match hashtags
    const regex = /#\w+/g;
    
    // Replace all matched hashtags with an empty string
    const resultString = inputString.replace(regex, '');
  
    return resultString;
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
    const tag = params[1]?.split('=')[1]||"";

// Define an array of diverse darker background colors
const diverseDarkerBackgroundColors: string[] = [
    "#1B1464", // Dark Blue
    "#4C1130", // Dark Wine
    "#0F4D92", // Dark Cyan
    "#2C3E50", // Midnight Blue
    "#541E24", // Dark Red
    "#222", // Dark Grey
  ];
  
  // Function to pick a random diverse darker background color
  function getRandomDiverseDarkerBackgroundColor(): string {
    const randomIndex = Math.floor(Math.random() * diverseDarkerBackgroundColors.length);
    return diverseDarkerBackgroundColors[randomIndex];
  }
  
  // Example usage
  const randomColor = getRandomDiverseDarkerBackgroundColor();
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
        description = removeHashtags(descriptionSplit[1].replaceAll('<p>', '').replaceAll('</p>', ''));
    }

    ///console.log("image:", rsp, { image, catIcon, catName });
    const descriptionLength=description.length;
    console.log("descrtiption length:",description.length  );
    const fontSize=descriptionLength>600?'42px':descriptionLength>500?'44px':descriptionLength>400?'48px':descriptionLength>300?'56px':'64px';
   
    const titleLength=title.length;
    console.log("title length:",title.length  );
    const titleFontSize=titleLength>50?'62px':titleLength>40?'70px':titleLength>30?'82px':'84px';
    const response = new ImageResponse(
   ( <div style={{width:1200,height:1600,background:randomColor,position:"relative",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",background:"#000"}}>
        <div style={{opacity:"0.4",display:"flex",background:"#000",width:"100%",height:"100%"} }><img width={1200} src={image}/></div>
        </div>
        <div style={{paddingTop:40,zIndex:"100",color:"fff",position:'absolute',display:'flex',justifyContent:'space-between',alignItems:"flex-start",flexWrap:"wrap"}}>
                <img height={120} style={{marginTop:15,marginLeft:40,borderRadius:0}} src={catIcon}/>
                <div style={{marginLeft:54,color:"#fff",width:'78%',fontSize:'58px',fontWeight:700}}>{title}</div> 
            </div>
        <div style={{width:1200, marginTop:680,background:randomColor,overflow: "hidden",textOverflow:"ellipses", padding:20,color:'#fff',position:"absolute",display:"flex",flexDirection:"column",alignItems:"center",fontSize:fontSize,justifyContent:"flex-end"}}>
        
           
            <div style={{display:'flex',padding:20, background:randomColor}}>{description}</div>
            <div style={{ display:'flex',fontSize:'28px',fontStyle:'italic',color:'#aaa', background:randomColor ,overflow: "hidden",textOverflow:"ellipses", padding:0,marginTop:20}}>
               Digest Copyright &copy; 2023,  {"--"} <i>{`${(process.env.NEXT_PUBLIC_LAKEAPI||"").indexOf("american")>=0?'American Outdoorsman: www.american-outdoorsman.news':'America One News: www.am1.news'}`}</i>{"--"}
            </div>
        </div >

        
    </div >    
    ),
    {
      width: 1200,
      height: 1600,
    }
    )
    ;
    return response;

}
export default handler;   