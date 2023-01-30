import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import styled from 'styled-components';
import useSWR from 'swr';
import { Qparams } from '../../lib/qparams'
import { Options } from '../../lib/withSession';
import { fetchQueue } from '../../lib/lakeApi';
import NextImage from 'next/image';
import Link from 'next/link';


const HotlistBox=styled.div<Loud>`
   display:flex; 
   width:100%;
   position:relative;;
   margin-bottom:16px;
   margin-top:0px;
   background:${({loud})=>loud?'#000':'#222'};
`
interface ImageBoxParams{
    spaces:number,
    loud:number
}
const ImageBox=styled.div<ImageBoxParams>`
    position: relative;
   
    //margin-top: 10px;
    //padding-top: 0px;
   
    //margin-right: 16px; 
    //margin-bottom: 10px;
    min-height:${({spaces,loud})=>(loud==1?640:420)/spaces}px;  
    //min-width:${({spaces})=>164/spaces}px;
    //height:${({spaces}) => 100/spaces}%;   
    //width:${({spaces}) => 100/spaces}%;   
   // height:100%;
    color:#fff;
    width:100%;
    overflow: hidden;
`
interface Loud{
    loud:number
}
const OpacityBox=styled.div<Loud>`
     opacity:${({loud})=>loud?0.8:.4};
   
`
const OverlayBox=styled.div<Loud>`
    position:absolute;
    height:${({loud})=>loud?84:78}px;
    left:0px;
    bottom:0px;
    font-size:14px;
    font-weight:${({loud})=>loud?400:400};
    margin:16px 0px 4px 0px;
   
   
    //font-family:roboto;
    
`
const Hr=styled.hr`
    margin-left:16px;
    margin-right:16px;
`
const TitleBox=styled.div`
    height:48px;
    line-height:24px;
    font-size:14px;
    text-overflow:ellipsis;
    margin-left:16px;
    margin-right:16px;
    overflow: hidden;   
`
const SitenameBox=styled.div`
    height:20px;
    line-height:13px;
    font-size:12px;
    padding-bottom:2px;
    text-overflow:ellipsis;
    margin-left:16px;
    margin-right:16px;
    overflow: hidden;   
`

const HotlistItem=({ session, qparams,item,spaces }: { session: Options, qparams: Qparams,item:any,spaces:number}) => {
    console.log("Hotlist item",item)
    return <ImageBox spaces={spaces} loud={session.loud} >
        <OpacityBox loud={session.loud}>
            <NextImage style={{objectFit:'cover'}} placeholder={"blur"} blurDataURL={'https://qwiket.com/static/css/afnLogo.png'} src={item.image} alt={item.title} fill={true} /></OpacityBox>
            <Link href={`/${qparams.forum}/topic/${item.tag}/${item.slug}${qparams.layoutNumber!='l1'?'/'+qparams.layoutNumber:''}`}><OverlayBox loud={session.loud}>
            <TitleBox>{item.title.slice(0,64)}</TitleBox>
            <Hr/>
            <SitenameBox>{item.site_name.slice(0,64)}</SitenameBox>
        </OverlayBox></Link></ImageBox>
}
const Hotlist = ({ session, qparams,spaces }: { session: Options, qparams: Qparams,spaces:number }) => {

    //const [lastid, setLastid] = useState(0);

    const key = ['queue', 'hot', qparams.newsline,/* qparams.forum, qparams.tag, 0, 0, session.sessionid, session.userslug,''*/];
    console.log('useSwr HOTLIST',key)
    const { data, error: queueError } = useSWR(key, fetchQueue,{
        refreshInterval:10000
    });
    console.log("RENDER HOTLIST",spaces,session,key,data);
    if(!data||data.fallback){
        console.log("NO DATA or fallback")
        let fallbackData=[];
        for(let i=0;i<spaces;i++){
            fallbackData.push(<HotlistItem key={`hotlistitem-${i}`} session={session} qparams={qparams} item={{
                image:'https://media.istockphoto.com/id/1280015859/photo/blue-lake-with-treeline-in-autumn-color-on-a-sunny-afternoon-in-northern-minnesota.jpg?s=612x612&w=0&k=20&c=smtj8bw1BW3gUI9rrxRnAzQKGWmTyMQYcODgbuWNMbc=',
                title:'Loading...',
                site_name:'America First News'

            }} spaces={spaces}></HotlistItem> )
        }
        return <HotlistBox loud={session.loud}>{fallbackData}</HotlistBox>
    }
     /* if (data && (data.lastid != lastid)) {
        setTimeout(() => setLastid(data.lastid), 1);
    }*/
    
    return<HotlistBox loud={session.loud}>{data?data.items.slice(0,spaces).map((item:any)=><HotlistItem key={`hotlistitem-${item.slug}`} session={session} qparams={qparams} item={item} spaces={spaces}/>):[]}</HotlistBox>

   }

export default Hotlist;