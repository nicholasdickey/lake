import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Qparams } from '../../lib/qparams'
import { Options } from '../../lib/withSession';
import useSWR from 'swr';

import { fetchQueue } from '../../lib/lakeApi';
import Qwiket from './qwiket'
import  useIntersectionObserver  from '../../lib/useIntersectionObserver'
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
const Segment = ({ extraWide, session, qparams, qType, lastid, tail, pageIndex, setLastid, hasData, setData }: {
    extraWide:boolean,session: Options, qparams: Qparams,
    qType: QueueType, lastid: number, tail: string, pageIndex: number, setLastid: any, hasData: boolean, setData: any
}) => {
    const sessionid=session.hasLayout?session.sessionid:'';
    const key = ['queue', qType, qparams.newsline, qparams.forum, qparams.tag, pageIndex, lastid, sessionid, session.userslug, tail];
    const { data, error: queueError } = useSWR(key, fetchQueue);
    const ref = useRef<HTMLDivElement | null>(null)
    const entry = useIntersectionObserver(ref, {})
    const isVisible = !!entry?.isIntersecting
    
    if (data && (data.lastid != lastid)) {
        setTimeout(() => setLastid(data.lastid), 1);
    }
    if (isVisible && data) {
       
        if (!hasData)
            setTimeout(() => setData(data, pageIndex, true, data.tail ? data.tail : ''), 1);
    }
   // console.log("RENDER SEGMENT page=", pageIndex,"isVisible:",isVisible);
    const rows = [];
    if (data) {

        const datum = data;
        for (let j = 0; j < datum.items.length; j++) {
            const item = datum.items[j].item;
            // console.log("render Qwiket item:",item)
            rows.push(<Qwiket key={`sss[[sf[f]]]${j}`} extraWide={extraWide} session={session} qparams={qparams} item={item} isTopic={false}></Qwiket>)
        }
    }
    return (<div ref={ref}>{rows}</div>)
}
const Queue = ({ extraWide,session, qparams, qType }: { extraWide:boolean,session: Options, qparams: Qparams, qType: QueueType }) => {

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
                segment: <Segment key={`wefho${pageIndex + 1}`} extraWide={extraWide} session={session} qparams={qparams} qType={qType} lastid={lastid} tail={tail} pageIndex={pageIndex + 1} setLastid={setLastid} hasData={false} setData={setData} />,
                tail: '',
                hasData: false
            })
        }
        setSegments([...segments]) //immutable state
    }

    const [segments, setSegments] = useState([{
        segment: <Segment key={`wefho${0}`} extraWide={extraWide}  session={session} qparams={qparams} qType={qType} lastid={0} tail={''} pageIndex={0} setLastid={setLastid} hasData={false} setData={setData} />,
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