import React, { useState, useEffect, useCallback } from "react";
import { Qparams } from '../../lib/qparams'
import { Options } from '../../lib/withSession';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { fetchQueue } from '../../lib/lakeApi';
import Qwiket from './qwiket'
import { SemanticClassificationFormat } from "typescript";
import { setEnvironmentData } from "worker_threads";
export enum QueueType {
    'mix',
    'newsline',
    'reacts',
    'topics',
    'tag',
    'hot'
}
/**
 * A workaround the problems with swrInfinite
 * @param param0 
 * @returns 
 */
const Segment= ({ session, qparams, qType,lastid,tail,pageIndex,setLastid,hasData,setData }: { session: Options, qparams: Qparams, 
    qType: QueueType,lastid:number,tail:string,pageIndex:number,setLastid:any,hasData:boolean,setData:any }) => {
    const key=['queue', qType, qparams.newsline, qparams.forum, qparams.tag, pageIndex, lastid, session.sessionid, session.userslug, tail] ; 
    const { data, error: queueError } = useSWR(key, fetchQueue);
    if(data.lastid!=lastid){
        setTimeout(()=>setLastid(data.lastid),1);
        
        
    }
    if(data){
        if(!hasData)
           setTimeout(()=>setData(pageIndex,true,data.tail),1);
    }
    
    console.log("RENDER SEGMENT page=",pageIndex);
    const rows = [];
    if (data) {

        const datum = data;
        for (let j = 0; j < datum.items.length; j++) {
            const item = datum.items[j].item;
            // console.log("render Qwiket item:",item)
            rows.push(<Qwiket key={`sss[[sf[f]]]${j}`} session={session} qparams={qparams} item={item} isTopic={false}></Qwiket>)
        }
    }
    return <>{rows}</>
}
const Queue = ({ session, qparams, qType }: { session: Options, qparams: Qparams, qType: QueueType }) => {
    
    const [lastid,setLastid]=useState(0);
    
    const setData=(pageIndex:number,hasData:boolean,tail:string)=>{
        console.log("---> setData",pageIndex,hasData,tail)
        let segment=segments[pageIndex];
        segment.tail=tail;
        segment.hasData=hasData;
        segments[pageIndex]=segment;  //to be removed after conmfirmation that it works.
        if(pageIndex=segments.length-1)
        segments.push({
            segment:<Segment key={`wefho${pageIndex+1}`} session={session} qparams={qparams} qType={qType} lastid={lastid} tail={tail} pageIndex={pageIndex+1} setLastid={setLastid} hasData={false} setData={setData}/>,
            tail:'',
            hasData:false
        
        })
        setSegments(segments)
    }

    const [segments,setSegments]=useState([{
        segment:<Segment key={`wefho${0}`} session={session} qparams={qparams} qType={qType} lastid={0} tail={''} pageIndex={0} setLastid={setLastid} hasData={false} setData={setData}/>,
        tail:'',
        hasData:false
    
    }])
   
   /* const getKey = (pageIndex: number, previousPageData: any) => {
        if (previousPageData && !previousPageData.items.length) return null // reached the end
        // [u, qType, qparams, page, lastid, sessionid, userslug,tail,test]
        const tail = previousPageData ? previousPageData.tail : '';
        const lastid = previousPageData ? previousPageData.lastid : 0;
        console.log("getKey:", `['queue',qType:${qType},newsline:${qparams.newsline},forum:${qparams.forum},tag:${qparams.tag},pageIndex:${pageIndex},lastid:${lastid},sessionid:${session.sessionid},userslug:${session.userslug},tail:${tail}]`)
       console.log(['queue', qType, qparams.newsline, qparams.forum, qparams.tag, pageIndex, lastid, session.sessionid, session.userslug, tail]  )
        return ['queue', qType, qparams.newsline, qparams.forum, qparams.tag, pageIndex, lastid, session.sessionid, session.userslug, tail]                    // SWR key
    }*/
    //[u, qType, qparams, page, lastid, sessionid, userslug,test]: [u: string, qType: QueueType, qparams: Qparams, page: number, lastid: string, sessionid: string, userslug: string,test:string]
    //const [page,setPage]=useState(0);
    //const key=['queue', qType, qparams.newsline, qparams.forum, qparams.tag, 0, 0, session.sessionid, session.userslug, ''] ; 
    //const { data, error: queueError } = useSWR(key, fetchQueue);
    const { data: notif, error: notifError } = useSWR(['notif', qType, qparams.newsline, qparams.forum, qparams.tag, 0, 0, session.sessionid, session.userslug, ''], fetchQueue);
    console.log("RENDER QUEUE");
    // return <div>Items: <br/>{JSON.stringify(data)}</div>
    // return <div>Notifications: <br/>{JSON.stringify(notif)}</div>
    /*const rows = [];
    if (data) {

            const datum = data;
            for (let j = 0; j < datum.items.length; j++) {
                const item = datum.items[j].item;
               // console.log("render Qwiket item:",item)
                rows.push(<Qwiket session={session} qparams={qparams} item={item} isTopic={false}></Qwiket>)
            }
        

    }*/
    /*
     if (data) {
        for (let i = 0; i < data.length; i++) {
            const datum = data[i];
            for (let j = 0; j < datum.items.length; j++) {
                const item = datum.items[j].item;
                console.log("render Qwiket item:",item)
                rows.push(<Qwiket session={session} qparams={qparams} item={item} isTopic={false}></Qwiket>)
            }
        }

    }
    */
    return <div>{segments.map(s=>s.segment)}</div>
}
export default Queue;