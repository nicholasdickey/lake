import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Qparams } from '../../lib/qparams'
import { Options } from '../../lib/withSession';
import useSWR from 'swr';
import styled from 'styled-components';
import { fetchQueue } from '../../lib/lakeApi';
import Qwiket from './qwiket'
import useIntersectionObserver from '../../lib/useIntersectionObserver'
import { useAppContext } from "../../lib/context";

const ColumnHeader = styled.div`
    position:absolute;
    display:flex;
    justify-content: space-between;
    //height:28px;
    width:100%;
    z-index:100;
`
const InnerHeader = styled.div`
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
const LeftHeader = styled.div`
    margin-top:-7px;
    color:#eee;//var(--highlight);
    font-weight:700;
    font-size:12px;
    margin-right:6px;
    z-index:101;
    padding-left:6px;
    padding-right:6px;
    background:var(--notificationButton);
    border:1px solid;
    margin-left:6px;
    width:auto;
    cursor:pointer;
    &:hover {
        background:var(--background);  
  }
    
`
const Notifications = ({ qType, newsline, forum, lastid, tail,sessionid, userslug, reset,tag }: { qType: string, newsline: string, forum: string, lastid: string, tail:number,sessionid: string, userslug: string, reset: any,tag:string }) => {
    const key = ['notif', qType, newsline, forum, tag?tag:'', 0, lastid,sessionid, userslug,tail];
    const { data, error } = useSWR(key, fetchQueue, {
        refreshInterval: qType == 'topics' ? 24 * 3600 * 1000 : 5000
    });
    const notifications = data?.newItems;
  console.log("REMDER QUEUE notif:", qType, key, data);
    const name = qType == 'mix' ? 'news&views' :qType=='tag'?'publication feed':qType=='topics'?'active topics': qType;
    const itemName = notifications == 1 ? 'Item' : 'Items';
    const onClick = () => {
        console.log("remder click");
        if (reset)
            setTimeout(() => { reset() }, 1);
    }
    return <ColumnHeader>{qType != 'topics' && +notifications > 0 ? <LeftHeader onClick={onClick}>Show {notifications} New {itemName}</LeftHeader> : <div />}<InnerHeader>{name}</InnerHeader></ColumnHeader>
}
const PlainHeader = ({ qType }: { qType: string }) => {
    const name = qType == 'mix' ? 'news&views' :qType=='tag'?'publication feed':qType=='topics'?'active topics': qType;
   
    return <ColumnHeader> <div /><InnerHeader>{name}</InnerHeader></ColumnHeader>
}
/**
 * A workaround the problems with swrInfinite
 * @param param0 
 * @returns 
 */
const Segment = ({ resetSegments, extraWide, qType, lastid, tail, pageIndex, hasData, setData }: {
    resetSegments?: any, extraWide: boolean, qType: string, lastid: string, tail: number, pageIndex: number, hasData: boolean, setData: any
}) => {
    const { session, qparams } = useAppContext();
    const [returnedLastid, setReturnedLastid] = useState(lastid);
    const [returnedTail, setReturnedTail] = useState(tail);
    const [hd, setHd] = useState(hasData)

    const onData = useCallback((data: any, key: string, config: any) => {
        console.log("onData fetchQueue remder", data.lastid, lastid, returnedLastid, data.tail, key, config)
        if (data && (data.lastid != lastid)) {
            setReturnedLastid(data.lastid);
            if (data.tail)
                setReturnedTail(+data.tail);
            console.log("remder segment. got new lastid", qType, data.lastid, lastid)
        }
    }, []);
    const key = ['queue', qType, qparams.newsline, qparams.forum, qType == 'tag' ? qparams.tag : '', pageIndex, lastid, session.sessionid, session.userslug, returnedTail, ''];
    console.log("Segment before fetchQueue", { qType, pageIndex, returnedLastid, returnedTail })
    const { data, error: queueError, mutate } = useSWR(key, fetchQueue, {
        dedupingInterval: 200,
        onSuccess: onData
    });

    const ref = useRef<HTMLDivElement | null>(null)
    const entry = useIntersectionObserver(ref, {})
    const isVisible = !!entry?.isIntersecting
    console.log("remder page:", qType, pageIndex, "isVisible:", isVisible)




    useEffect(() => {
        console.log("remder 222 to test a call setData", { isVisible, qType, pageIndex, data })
        if (!hd && data && isVisible) {
            console.log("remder 222 to a call setData", { isVisible, qType, pageIndex, data })
            setData(data, pageIndex, true, data.tail ? data.tail : '');
            setHd(true)
        }
    }, [isVisible, hd, data, qType, pageIndex, setData]);


    //if (!pageIndex)
    //    console.log("REMDER SEGMENT page=", pageIndex, "isVisible:", isVisible, 'returnedLastid:', returnedLastid, data?.items);
    //if (!data)
    //    return null;
   
    return (<div className="other-segments" ref={ref}>{data?.items?.map((item: any) => <Qwiket key={`sss[[sf[f]]]${item.slug}`} extraWide={extraWide} item={item} isTopic={false}></Qwiket>)}</div>)
}
/**
 * A workaround the problems with swrInfinite
 * @param param0 
 * @returns 
 */
const FirstSegment = ({ resetSegments, extraWide, qType, lastid, tail, pageIndex, hasData, setData }: {
    resetSegments?: any, extraWide: boolean, qType: string, lastid: string, tail: number, pageIndex: number, hasData: boolean, setData: any
}) => {
    const { session, qparams } = useAppContext();
    const [returnedLastid, setReturnedLastid] = useState(lastid);
    const [returnedTail, setReturnedTail] = useState(tail);
    const [hd, setHd] = useState(hasData)

    const onData = useCallback((data: any, key: string, config: any) => {
        console.log("onData FirstSegment segments onData fetchQueue remder", {qType,newLastid:data.lastid, lastid, returnedLastid, newTail:data.tail, key, items:data?.items})
        if (data && (data.lastid != lastid)) {
            setReturnedLastid(data.lastid);
            if (data.tail)
                setReturnedTail(+data.tail);
            console.log("remder first segment. got new lastid", qType, data.lastid, lastid)
        }
    }, []);
    const key = ['queue', qType, qparams.newsline, qparams.forum, qType == 'tag' ? qparams.tag : '', pageIndex, lastid, session.sessionid, session.userslug, tail, ''];
    console.log("remder FirstSegment before fetchQueue", { key, qType, pageIndex, returnedLastid, returnedTail})
    const { data, error: queueError, mutate } = useSWR(key, fetchQueue, {
        // dedupingInterval: 200,
        onSuccess: onData
    });
    const items=data?.items;
    const ref = useRef<HTMLDivElement | null>(null)
    const entry = useIntersectionObserver(ref, {})
    const isVisible = !!entry?.isIntersecting;
    console.log("remder FirstSegment first page:", {qType, pageIndex, isVisible,items:data?.items})

    const onScroll = useCallback(() => {
        const { scrollY } = window;
        if (scrollY == 0 && !lastid) {
            console.log("remder mutate", qType, pageIndex)
            mutate();
            if (resetSegments)
                resetSegments();
            console.log("remder scroll to top")
        }
    }, []);
    const reset = useCallback(() => {
        const { pageYOffset, scrollY } = window;
        console.log("remder RESET!!!, mutate")
        mutate();
        if (resetSegments)
            setTimeout(() => { resetSegments() }, 1);
        console.log("scroll to top")
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", onScroll, { passive: true });
        // remove event on unmount to prevent a memory leak with the cleanup
        return () => {
            window.removeEventListener("scroll", onScroll);
        }
    }, []);

    useEffect(() => {
        console.log("remder to test a call setData", { isVisible, qType, pageIndex, data })
        if (!hd && data && isVisible) {
            console.log("remder to a call setData", { isVisible, qType, pageIndex, data })
            setData(data, pageIndex, true, data.tail ? data.tail : '');
            setHd(true)
        }
    }, [isVisible, hd, data, qType, pageIndex, setData]);


    //if (!pageIndex)
    //    console.log("REMDER SEGMENT page=", pageIndex, "isVisible:", isVisible, 'returnedLastid:', returnedLastid, data?.items);
    if (!items) {
        const item = {
            image: 'https://media.istockphoto.com/id/1280015859/photo/blue-lake-with-treeline-in-autumn-color-on-a-sunny-afternoon-in-northern-minnesota.jpg?s=612x612&w=0&k=20&c=smtj8bw1BW3gUI9rrxRnAzQKGWmTyMQYcODgbuWNMbc=',
            title: 'Loading...',
            site_name: 'America First News',
            description: "Loading...",
            slug: 'loading'

        }
        return <div ref={ref}><Qwiket key={`sss[[f[f]]]${item.slug}`} extraWide={extraWide} item={item} isTopic={false}></Qwiket></div>
    }
   // return (<div ref={ref}>{data?.items?.map((item: any) => <Qwiket key={`sss[[sf[f]]]${item.slug}`} extraWide={extraWide} item={item} isTopic={false}></Qwiket>)}</div>)

    return (<div ref={ref}>{qType != 'topics' ? <Notifications qType={qType} newsline={qparams.newsline} forum={qparams.forum} lastid={returnedLastid} tail={returnedTail} sessionid={session.sessionid} userslug={session.userslug} reset={reset} tag={qType == 'tag' ? qparams.tag : ''}/> : <PlainHeader qType={qType} />}
    {items.map((item: any) => <Qwiket key={`items[[sf[f]]]${item.slug}`} extraWide={extraWide} item={item} isTopic={false}></Qwiket>)}</div>)
}
const Queue = ({ setNotifications, extraWide, session, qparams, qType }: { setNotifications: any, extraWide: boolean, session: Options, qparams: Qparams, qType: string }) => {

    const [lastid, setLastid] = useState(0);

    console.log("Remder queue", qType)
    const setData = (data: any, pageIndex: number, hasData: boolean, tail: number) => {
        let segment = segments[pageIndex] || {};
        //  let newSegments=[...segments];
        console.log("remder setData1, pageIndex:", pageIndex, segments)
        /* segment.tail = tail;
         segment.hasData = hasData;*/
        segments[pageIndex] = segment;  //to be removed after conmfirmation that it works.
        console.log("remder setData", pageIndex)
        if (pageIndex == segments.length - 1) {

            console.log("remder ---> adding segments for fetchData pageIndex:", pageIndex, qType, 'segments:', segments)
            segments.push({
                segment: <Segment key={`wefho${pageIndex + 1}`} extraWide={extraWide} qType={qType} lastid={data.lastid} tail={tail} pageIndex={pageIndex + 1} hasData={false} setData={setData} />,
                tail: '',
                hasData: false
            })
        }
        console.log("remder segments calling ss", ss)
        ss([...segments]) //immutable state
    }
    // if (qType == 'mix' || qType == 'newsline')
    //console.log("QueueRemder:", { qType, lastid });

    let resetSegments: any;
    const generateFirstSegment = (comment:any ) => {
        console.log("segments remder generateFirstSegment", qType,comment)
        return [{
            segment: <FirstSegment resetSegments={resetSegments} key={`wefho${0}`} extraWide={extraWide} qType={qType} lastid={''} tail={0} pageIndex={0} hasData={false} setData={setData} />,
            tail: '',
            hasData: false
        }]
    }
    const [segments, setSegments] = useState(generateFirstSegment('useState'))
    const ss = (newSegments: any) => {
        console.log("remder segments ss", qType, newSegments)
        setSegments(newSegments);
    }
    console.log("segments remder", segments.length)
    resetSegments = () => {
        console.log("segments resetSegments",qType)

         ss(generateFirstSegment('reset'))
    };
    return <>{segments.map(s => s.segment)}</>
}

export default Queue;