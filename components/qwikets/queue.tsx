import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Qparams } from '../../lib/qparams'
import { Options } from '../../lib/withSession';
import useSWR from 'swr';
import styled from 'styled-components';
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

const ColumnHeader=styled.div`
    position:absolute;
    display:flex;
    justify-content: space-between;
    //height:28px;
    width:100%;
    z-index:100;
`
const InnerHeader=styled.div`
    margin-top:-7px;
    color:var(--highlight);
    font-weight:700;
    font-size:12px;
    margin-right:6px;
    z-index:100;
    padding-left:6px;
    padding-right:6px;
    background:var(--background);
`
const LeftHeader=styled.div`
    margin-top:-7px;
    color:#eee;//var(--highlight);
    font-weight:700;
    font-size:12px;
    margin-right:6px;
    z-index:101;
    padding-left:6px;
    padding-right:6px;
    background:var(--notificationButton);//var(--lowlight);
    border:1px solid;
    margin-left:6px;
    width:auto;
    
`


/**
 * A workaround the problems with swrInfinite
 * @param param0 
 * @returns 
 */
const Segment = ({ resetSegments, extraWide,  qType, lastid, tail, pageIndex, setLastid,hasData, setData }: {
    resetSegments?:any, extraWide:boolean, qType: string, lastid: number, tail: string, pageIndex: number, setLastid: any, hasData: boolean, setData: any
}) => {
    const {session,qparams} =useAppContext();
    const [firstLastId]=useState(lastid)
  //  console.log("RENDER context session",session)
    const sessionid=session.hasLayout?session.sessionid:'';
    const key = ['queue', qType, qparams.newsline, qparams.forum, qType=='tag'?qparams.tag:'', pageIndex, pageIndex?lastid:0, session.sessionid, session.userslug, tail];
    console.log("Segment=>fetchQueue",qType,key)
    const { data, error: queueError,mutate } = useSWR(key, fetchQueue);
    const callMutate=()=>mutate;
    const ref = useRef<HTMLDivElement | null>(null)
    const entry = useIntersectionObserver(ref, {})
    const isVisible = !!entry?.isIntersecting
    //console.log("SEGMENT key:",key,data)
    const onScroll = useCallback(() => {
        const { pageYOffset, scrollY } = window;
       // console.log("yOffset", pageYOffset, "scrollY", scrollY);
        if(scrollY==0&&firstLastId==0){
            
            setLastid(0);
            if(resetSegments)
            resetSegments();
            //mutate();
            console.log("scroll to top")
        }
        //setScrollY(window.pageYOffset);
    }, []);
  
    useEffect(() => {
        if(qType=='tag'||qType=='topics')
        return;
      //add eventlistener to window
      window.addEventListener("scroll", onScroll, { passive: true });
      // remove event on unmount to prevent a memory leak with the cleanup
      return () => {
         window.removeEventListener("scroll", onScroll);
      }
    }, []);
  
    if (data && (data.lastid != lastid)) {
        console.log("remder segment. got new lastid",qType,data.lastid,lastid)
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
const Queue = ({ setNotifications, extraWide,session, qparams, qType }: { setNotifications:any,extraWide:boolean,session: Options, qparams: Qparams, qType: string }) => {

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
    if(qType=='mix'||qType=='newsline')
    console.log("QueueRemder:",{qType,lastid});
    let resetSegments:any;
    const generateFirstSegment=()=>{
        console.log("remder generateFirstSegment",qType)
        return {
        segment: <Segment resetSegments={resetSegments} key={`wefho${0}`} extraWide={extraWide}  qType={qType} lastid={lastid} tail={''} pageIndex={0} setLastid={setLastid} hasData={false} setData={setData} />,
        tail: '',
        hasData: false
    }}
    const [segments, setSegments] = useState([generateFirstSegment()])
    resetSegments=()=>setSegments([generateFirstSegment()]);
   
    const notifCallback=(data:any)=>{
        if(data?.success){
            setNotifications(data.newItems)
        }
        return 20000;
    }
    const { data: notif, error: notifError } = useSWR(['notif', qType, qparams.newsline, qparams.forum, qparams.tag, 0,lastid, sessionid, session.userslug, ''], fetchQueue,{
        refreshInterval:qType=='tag'||qType=='topics'?24*3600*1000:5000
    });
    const notifications=notif?.newItems;
    if(qType=='mix'||qType=='newsline')
    console.log("REMDER QUEUE notif:",notifications);
    const name=qType=='tag'?`${qparams.tag} feed`:qType=='mix'?'news&views':qType;
    const itemName=notifications==1?'Item':'Items';
    return <div><ColumnHeader>{qType!='topics'&&qType!='tag'&&+notifications>0?<LeftHeader>Show {notifications} New {itemName}</LeftHeader>:<div/>}<InnerHeader>{name}</InnerHeader></ColumnHeader>{segments.map(s => s.segment)}</div>
}

export default Queue;