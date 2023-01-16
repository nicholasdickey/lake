import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Qparams } from '../../lib/qparams'
import { Options } from '../../lib/withSession';
import useSWR from 'swr';

import { fetchQueue } from '../../lib/lakeApi';
import Qwiket from './qwiket'
import useIntersectionObserver  from '../../lib/useIntersectionObserver'
import { useAppContext } from "../../lib/context";

/*export enum QueueType {
    'mix',
    'newsline',
    'reacts',
    'topics',
    'tag',
    'hot'
}*/
/**
 * A workaround the problems with swrInfinite
 * @param param0 
 * @returns 
 */
const Segment = ({ extraWide,  qType, lastid, tail, pageIndex, setLastid, hasData, setData }: {
    extraWide:boolean, qType: string, lastid: number, tail: string, pageIndex: number, setLastid: any, hasData: boolean, setData: any
}) => {
    const {session,qparams} =useAppContext();
  //  console.log("RENDER context session",session)
    const sessionid=session.hasLayout?session.sessionid:'';
    const key = ['queue', qType, qparams.newsline, qparams.forum, qType=='tag'?qparams.tag:'', pageIndex, pageIndex?lastid:0, session.sessionid, session.userslug, tail];
    console.log("Segment=>fetchQueue",qType,key)
    const { data, error: queueError } = useSWR(key, fetchQueue);
    const ref = useRef<HTMLDivElement | null>(null)
    const entry = useIntersectionObserver(ref, {})
    const isVisible = !!entry?.isIntersecting
    //console.log("SEGMENT key:",key,data)
    if (data && (data.lastid != lastid)) {
        setTimeout(() => setLastid(data.lastid), 1);
    }
    if (isVisible && data) {
       
        if (!hasData)
            setTimeout(() => setData(data, pageIndex, true, data.tail ? data.tail : ''), 1);
    }
    //console.log("RENDER SEGMENT page=", pageIndex,"isVisible:",isVisible,data?.items);
    if(!data){
        const item={
            image:'https://media.istockphoto.com/id/1280015859/photo/blue-lake-with-treeline-in-autumn-color-on-a-sunny-afternoon-in-northern-minnesota.jpg?s=612x612&w=0&k=20&c=smtj8bw1BW3gUI9rrxRnAzQKGWmTyMQYcODgbuWNMbc=',
            title:'Loading...',
            site_name:'America First News',
            description:"Loading...",
            slug:'loading'

        }
      // return <Skeleton count={5} />
        return <div ref={ref}><Qwiket key={`sss[[sf[f]]]${item.slug}`} extraWide={extraWide} item={item} isTopic={false}></Qwiket></div>
    }

    return (<div ref={ref}>{data?.items?.map((item:any)=><Qwiket key={`sss[[sf[f]]]${item.slug}`} extraWide={extraWide} item={item} isTopic={false}></Qwiket>)}</div>)
}
const Queue = ({ extraWide,session, qparams, qType }: { extraWide:boolean,session: Options, qparams: Qparams, qType: string }) => {

    const [lastid, setLastid] = useState(0);
    const sessionid=session.hasNewslines?session.sessionid:'';
    const setData = (data: any, pageIndex: number, hasData: boolean, tail: string) => {
       // console.log("---> setData", data, pageIndex, hasData, tail)
        let segment = segments[pageIndex];
        segment.tail = tail;
        segment.hasData = hasData;
        segments[pageIndex] = segment;  //to be removed after conmfirmation that it works.
      //  console.log("--->segments.length:", segments.length, "pageIndex:", pageIndex)
        if (pageIndex == segments.length - 1) {
            console.log("---> adding segment")
            segments.push({
                segment: <Segment key={`wefho${pageIndex + 1}`}extraWide={extraWide}qType={qType} lastid={lastid} tail={tail} pageIndex={pageIndex + 1} setLastid={setLastid} hasData={false} setData={setData} />,
                tail: '',
                hasData: false
            })
        }
        setSegments([...segments]) //immutable state
    }
    console.log("Queue:",qType,session)
    const [segments, setSegments] = useState([{
        segment: <Segment key={`wefho${0}`} extraWide={extraWide}  qType={qType} lastid={0} tail={''} pageIndex={0} setLastid={setLastid} hasData={false} setData={setData} />,
        tail: '',
        hasData: false

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
    const { data: notif, error: notifError } = useSWR(['notif', qType, qparams.newsline, qparams.forum, qparams.tag, 0, 0, sessionid, session.userslug, ''], fetchQueue);
  //  console.log("RENDER QUEUE",segments.length);
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
    return <div>{segments.map(s => s.segment)}</div>
}

export default Queue;