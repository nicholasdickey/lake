// ./components/stream/queue.tsx
import React, { useState, useEffect, useRef, useCallback, useMemo, ReactComponentElement, ReactElement } from "react";
import useSWR from 'swr';
import styled from 'styled-components';
import { fetchQueue, FetchQueueKey } from '../../lib/lake-api';
import Qwiket from '../item/qwiket'
import useIntersectionObserver from '../../lib/use-intersection-observer'
import { useAppContext } from "../../lib/context";

//this is for ease of debugging, to provide guids to elements
var randomstring = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const ColumnHeader = styled.div`
    position:absolute;
    display:flex;
    justify-content: space-between;
    //height:28px;
    width:100%;
    z-index:151; 
`
const LeftHeader = styled.div`
    margin-top:-7px;
    color:#eee;//var(--highlight);
    font-weight:700;
    font-size:11px;
    @media (max-width:1200px){
        font-weight:400;
        font-size:12px; 
    }
    margin-right:6px;
    z-index:151;
    padding-left:4px;
    padding-right:4px;
    background:var(--notificationButton);
    border:1px solid;
    margin-left:6px;
    //height:10px;
    width:auto;
    cursor:pointer;
    &:hover {
        background:var(--lowlight);  
        color:var(--text);
  }  
`

const QueueWrap = styled.div`
    user-select: none;
    margin-left:0px;
    margin-right:0px;   
`
declare var window: Window;
declare var navigator: Navigator;

const Notifications = ({ isLeft, qType, newsline, forum, lastid, tail, sessionid, userslug, reset, tag, ...props }:
    {
        isLeft: boolean, qType: string, newsline: string, forum: string, lastid: string, tail: number, sessionid: string, userslug: string, reset: any,
        tag: string
    }) => {
    const { session, qparams } = useAppContext();
    const key = ['notif', qType, newsline, qparams.type == 'solo' ? 1 : 0, forum, (qType == 'tag' || qparams.type == 'solo') ? qparams.tag : '', 0, lastid, sessionid, userslug, tail];
    const { data, error } = useSWR(key, fetchQueue, {
        refreshInterval: qType == 'topics' ? 24 * 3600 * 1000 : 5000
    });
    const notifications = data?.newItems;
    //console.log("REMDER QUEUE notif:", qType, key, data);
    const nav:any=navigator;
    if(isLeft&&nav.setAppBadge){
         nav.setAppBadge(+notifications||0);
    }
    const itemName = notifications == 1 ? 'Item' : 'Items';
    const onClick = () => {
        if (reset)
            setTimeout(() => { if(isLeft&&nav.clearAppBadge){
                nav.clearAppBadge();
            }
            reset(); }, 1);
    }

    return <ColumnHeader>{qType != 'topics' && +notifications > 0 ? <LeftHeader onClick={onClick}>Show {notifications} New {itemName}</LeftHeader> : <div />}</ColumnHeader>
}

/**
 * A workaround the problems with swrInfinite
 * @param param0 
 * @returns 
 */
const Segment = ({ card,  extraWide, qType, lastid,isRight,  pageIndex}: {
    card: string, isLeft?: boolean,
    extraWide: boolean, qType: string, lastid: string, 
    isRight:boolean,tail?: number, pageIndex: number
}) => {
    const { session, qparams } = useAppContext();
    const key: FetchQueueKey["key"] = ['queue', qType, qparams.newsline, qType == 'newsline' && qparams.type == 'solo' ? 1 : 0, qparams.forum, (qType == 'tag' || qType == 'newsline' && qparams.type == 'solo') ? qparams.tag : '', pageIndex, lastid, session.sessionid, session.userslug, 0, '', '', 0, card];

    const { data, error: queueError, mutate } = useSWR(key, fetchQueue, {
        revalidateIfStale: false,
        revalidateOnFocus: false
    });
    const ref = useRef<HTMLDivElement | null>(null)
    const entry = useIntersectionObserver(ref, {})
    
    const isVisible = !!entry?.isIntersecting || entry && entry.boundingClientRect.top < 0
  
    let segment=null;
    if (data && isVisible&&data.success==true&&data.items.length>0) {
        segment=<Segment card={card} extraWide={extraWide} qType={qType} lastid={lastid} isRight={isRight} pageIndex={pageIndex+1}/>
    }
    else {
        //console.log("No data or not visible segment yet",{data,isVisible})
    }
    return <div className="other-segments" ref={ref}>
        {data?.items?.map((item: any) => <Qwiket key={`queue-qwiket-${qType}-${item.slug}-${item.qpostid}`} extraWide={extraWide} isRight={isRight} item={item} isTopic={false} qType={qType}></Qwiket>)}
        {segment}
        </div>
}

const Queue = ({ qType, isLeft, card,visible,isRight,extraWide }: { visible: boolean, card: string, qType: string, isLeft: boolean, isRight:boolean,extraWide: boolean }) => {
    const [guid, setGuid] = useState(randomstring())
    const { session,qparams } = useAppContext();
    const [lastid,setLastid]=useState('');
    const [tail,setTail]=useState(0)

    qType = isLeft ? session.leftColumnOverride || qType : qType;
    const pageIndex=0;
    const key: FetchQueueKey["key"] = ['queue', qType, qparams.newsline, qType == 'newsline' && qparams.type == 'solo' ? 1 : 0, qparams.forum, (qType == 'tag' || qType == 'newsline' && qparams.type == 'solo') ? qparams.tag : '', pageIndex, '0', session.sessionid, session.userslug, 0, '', '', 0, card];

    const onData = useCallback((data: any, key: string, config: any) => {
        if (data) {
            setLastid(data.lastid);
            setTail(+data.tail);
        }
    }, []);
    const { data, error: queueError, mutate } = useSWR(key, fetchQueue, {
        onSuccess: onData,
        revalidateIfStale: false,
        revalidateOnFocus: false
    });
    const items = data?.items;
    const ref = useRef<HTMLDivElement | null>(null)
    const entry = useIntersectionObserver(ref, {})
    const isVisible = !!entry?.isIntersecting || entry && entry.boundingClientRect.top < 0

    const onScroll = useCallback(() => {
        const { scrollY } = window;
        if (scrollY == 0) {
            if(qType=='newsline') 
            console.log("d1b: calling mutate")
            mutate();
        }
    }, [visible])

    const reset = useCallback(() => {
        setTimeout(() => {
            mutate()
        }, 1);
    }, [mutate]);

    useEffect(() => {
        if (visible) {
            window.addEventListener("scroll", onScroll, { passive: true });
        }
        else {
            window.removeEventListener("scroll", onScroll);
        }

        // remove event on unmount to prevent a memory leak with the cleanup
        return () => {
            window.removeEventListener("scroll", onScroll);
        }
    }, [visible]);

    let segment:ReactElement|null=null
    if ( data && isVisible && lastid) {
        segment=<Segment card={card} extraWide={extraWide} qType={qType} lastid={lastid} isRight={isRight} pageIndex={pageIndex+1}/>
  }
    if (!items) {
        const item = {
            image: 'https://media.istockphoto.com/id/1280015859/photo/blue-lake-with-treeline-in-autumn-color-on-a-sunny-afternoon-in-northern-minnesota.jpg?s=612x612&w=0&k=20&c=smtj8bw1BW3gUI9rrxRnAzQKGWmTyMQYcODgbuWNMbc=',
            title: 'Loading...',
            site_name: 'Minnesota Lake',
            description: "Loading...",
            slug: 'loading'
       }
        return <div ref={ref}><Qwiket key={`fallback-qwiket-${qType}-${item.slug}`} extraWide={extraWide} item={item} isTopic={false} isRight={isRight} qType={qType}></Qwiket></div>
    }
   return (<div ref={ref}>
        {qType != 'topics' ? <Notifications isLeft={isLeft} qType={qType} newsline={qparams.newsline} forum={qparams.forum} lastid={lastid} tail={tail} sessionid={session.sessionid} userslug={session.userslug} reset={reset} tag={qType == 'tag' ? qparams.tag : ''} /> : null}
        {items.map((item: any) => <Qwiket key={`queue-qwiket-${qType}-${item.slug}-${item.qpostid}`} isRight={isRight} extraWide={extraWide} item={item} isTopic={false} qType={qType}></Qwiket>)}
        {segment}
    </div>)
}

export default Queue;
