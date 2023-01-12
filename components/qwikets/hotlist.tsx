import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import styled from 'styled-components';
import useSWR from 'swr';
import { Qparams } from '../../lib/qparams'
import { Options } from '../../lib/withSession';
import { fetchQueue } from '../../lib/lakeApi';
import NextImage from 'next/image';


const HotlistBox=styled.div`
   display:flex; 
   width:100%;
   position:relative;;
   margin-bottom:24px;
   margin-top:0px;
   background:#000;
`
interface ImageBoxParams{
    spaces:number,
    loud:number
}
const ImageBox=styled.div<ImageBoxParams>`
    position: relative;
    object-fit: cover;
    //margin-top: 10px;
    //padding-top: 0px;
   
    //margin-right: 16px; 
    //margin-bottom: 10px;
    min-height:${({spaces,loud})=>(loud==1?640:420)/spaces}px;
    //min-width:${({spaces})=>1564/spaces}px;
    //height:${({spaces}) => 100/spaces}%;   
    //width:${({spaces}) => 100/spaces}%;   
   // height:100%;
    color:#fff;
    width:100%;
    overflow: hidden;
`
interface OpacityBoxParams{
    loud:number
}
const OpacityBox=styled.div<OpacityBoxParams>`
     opacity:${({loud})=>loud==1?0.8:.4};
`
const OverlayBox=styled.div<OpacityBoxParams>`
    position:absolute;
    height:${({loud})=>loud==1?84:78}px;
    right:0px;
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
    return <ImageBox spaces={spaces} loud={session.loud} >
        <OpacityBox loud={session.loud}><NextImage placeholder={"blur"} blurDataURL={'https://qwiket.com/static/css/afnLogo.png'} src={item.image} alt={item.title} fill={true} /></OpacityBox>
        <OverlayBox loud={session.loud}>
            <TitleBox>{item.title.slice(0,64)}</TitleBox>
            <Hr/>
            <SitenameBox>{item.site_name.slice(0,64)}</SitenameBox>
        </OverlayBox></ImageBox>
}
const Hotlist = ({ session, qparams,spaces }: { session: Options, qparams: Qparams,spaces:number }) => {

    //const [lastid, setLastid] = useState(0);

    const key = ['queue', 'hot', qparams.newsline, qparams.forum, qparams.tag, 0, 0, session.sessionid, session.userslug];
    const { data, error: queueError } = useSWR(key, fetchQueue);
    console.log("RENDER HOTLIST",session);
     /* if (data && (data.lastid != lastid)) {
        setTimeout(() => setLastid(data.lastid), 1);
    }*/
    
    return<HotlistBox>{data?data.items.slice(0,spaces).map((datum:any)=><HotlistItem key={`hotlistitem-${datum.item.threadid}`} session={session} qparams={qparams} item={datum.item} spaces={spaces}/>):[]}</HotlistBox>

   }

export default Hotlist;