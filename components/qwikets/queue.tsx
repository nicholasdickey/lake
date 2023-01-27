import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Qparams } from '../../lib/qparams'
import { Options } from '../../lib/withSession';
import useSWR from 'swr';
import styled from 'styled-components';
import { fetchQueue } from '../../lib/lakeApi';
import Qwiket from './qwiket'
import useIntersectionObserver from '../../lib/useIntersectionObserver'
import { useAppContext } from "../../lib/context";
import { json } from "stream/consumers";

const ColumnHeader = styled.div`
    position:absolute;
    display:flex;
    justify-content: space-between;
    //height:28px;
    width:100%;
    z-index:48;
   
`
const InnerHeader = styled.div`
    display:flex;
    position:relative;
    height:10px;
   // width: 100%;
    margin-top:-7px;
    color:var(--highlight);
    font-weight:700;
    font-size:12px;
    margin-right:6px;
    z-index:49;
    padding-left:6px;
    padding-right:6px;
    background:var(--background);
    user-select: none;
`
const SelectButton = styled.div`
    width: auto;
    height: auto;
    overflow: hidden;
    min-height: 1.1875em;
    white-space: nowrap;
    text-overflow: ellipsis;
    fill: currentColor;
    width: 1em;
    height: 1em;
    display: inline-block;
    font-size: 24px;
    transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    user-select: none;
    flex-shrink: 0;
    margin-top:-5px;
    &:hover {
       // background:var(--lowlight);
        color:var(--button); 
  }
`
const LeftHeader = styled.div`
    margin-top:-7px;
    color:#eee;//var(--highlight);
    font-weight:700;
    font-size:12px;
    @media (max-width:1200px){
        font-weight:400;
        font-size:10px; 
    }
    margin-right:6px;
    z-index:51;
    padding-left:6px;
    padding-right:6px;
    background:var(--notificationButton);
    border:1px solid;
    margin-left:6px;
    //height:10px;
    width:auto;
    cursor:pointer;
    &:hover {
        background:var(--background);  
  }
    
`
interface Opened {
    opened: boolean;
}
const OpenedMenu = styled.div<Opened>`
    position:absolute;
    display:block;
    margin-top:16px;
    margin-left:-16px;
    width:150%;
    right:0px;
    z-index:102;
   // padding-left:6px;
    border:1px solid;
    background:var(--background);// ${({ opened }) => opened ? 'var(--highlight)' : 'var(--lowlight)'};

`
interface Selected {
    selected: boolean;
}
const SelectItem = styled.div<Selected>`
    z-index:102;
    padding:10px;
    margin:2px;
    border:1px solid var(--grey);
    background:var(--lowlight);
    cursor:pointer;
    &:hover {
        background:var(--background);  
  
    }
    
`
const QueueWrap = styled.div`
    user-select: none;
`

const Arrow = () => <svg className="jss37 jss168" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation"><path d="M7 10l5 5 5-5z"></path></svg>
const LeftSelector = ({ qType, sessionid, updateSession,reset }: { qType: string, sessionid: string, updateSession: any,reset:any }) => {
    const [opened, setOpened] = useState(false);
    const choices = [
        {
            qType: 'mix',
            tag: 'news&views',
            selected: qType == 'mix'
        },
        {
            qType: 'newsline',
            tag: 'newsline',
            selected: qType == 'newsline'
        },
        {
            qType: 'reacts',
            tag: 'comments',
            selected: qType == 'reacts'
        }
    ]
    console.log("remder LeftSelector", qType)
    const onClick = (type: string) => {
        updateSession({ leftColumnOverride: type });
        setOpened(false);
        reset();
    }
    return <>
        <SelectButton onClick={() => setOpened(!opened)}><Arrow /></SelectButton>
        {opened ? <OpenedMenu opened={opened}>{choices.map(c => <SelectItem onClick={() => { onClick(c.qType) }} key={`selected-${qType}`} selected={c.selected} >{c.tag}</SelectItem>)

        }</OpenedMenu> : null}</>

}
const Notifications = ({ isLeft, qType, newsline, forum, lastid, tail, sessionid, userslug, reset, tag, updateSession,fullPage,channelDetails }:
    { isLeft: boolean, qType: string, newsline: string, forum: string, lastid: string, tail: number, sessionid: string, userslug: string, reset: any, 
        tag: string, updateSession: any,fullPage?:boolean,channelDetails?:any }) => {
    const key = ['notif', qType, newsline, forum, tag ? tag : '', 0, lastid, sessionid, userslug, tail];
    const { data, error } = useSWR(key, fetchQueue, {
        refreshInterval: qType == 'topics' ? 24 * 3600 * 1000 : 5000
    });
    const notifications = data?.newItems;
    // console.log("REMDER QUEUE notif:", qType, key, data);
    const name = qType == 'mix' ? 'news&views' : qType == 'tag' ? 'publication feed' : qType == 'topics' ? 'active topics' : qType == 'reacts' ? 'comments' : qType;

    const itemName = notifications == 1 ? 'Item' : 'Items';
    const onClick = () => {
        console.log("remder click");
        if (reset)
            setTimeout(() => { reset() }, 1);
    }
    // console.log("Notifications Remder",qType,name,isLeft,data)
    return <ColumnHeader>{qType != 'topics' && +notifications > 0 ? <LeftHeader onClick={onClick}>Show {notifications} New {itemName}</LeftHeader> : <div />}
        <InnerHeader>{name}{isLeft ? <LeftSelector qType={qType} sessionid={sessionid} updateSession={updateSession} reset={reset} /> : ''}</InnerHeader></ColumnHeader>
}
const PlainHeader = ({ qType,fullPage,channelDetails }: { qType: string,fullPage?:boolean,channelDetails?:boolean }) => {

    const name = qType == 'mix' ? 'news&views' : qType == 'tag' ? 'publication feed' : qType == 'topics' ? 'active topics' : qType == 'reacts' ? 'comments' : qType;

    return <ColumnHeader> <div /><InnerHeader><div>{name} </div></InnerHeader></ColumnHeader>
}
/**
 * A workaround the problems with swrInfinite
 * @param param0 
 * @returns 
 */
const Segment = ({ isLeft, extraWide, qType, lastid, tail, pageIndex, hasData, setData }: {
    isLeft: boolean,
    extraWide: boolean, qType: string, lastid: string, tail: number, pageIndex: number, hasData: boolean, setData: any
}) => {
    const { session, qparams } = useAppContext();
    const [returnedLastid, setReturnedLastid] = useState(lastid);
    const [returnedTail, setReturnedTail] = useState(tail);
    const [hd, setHd] = useState(hasData)
    //if(isLeft)
    // console.log("Segment remder", qType,isLeft)
    const onData = useCallback((data: any, key: string, config: any) => {
        //console.log("onData fetchQueue remder", data.lastid, lastid, returnedLastid, data.tail, key, config)
        if (data && (data.lastid != lastid)) {
            setReturnedLastid(data.lastid);
            if (data.tail)
                setReturnedTail(+data.tail);
            // console.log("remder segment. got new lastid", qType, data.lastid, lastid)
        }
    }, []);
    const key = ['queue', qType, qparams.newsline, qparams.forum, qType == 'tag' ? qparams.tag : '', pageIndex, lastid, session.sessionid, session.userslug, returnedTail, ''];
    // console.log("Segment before fetchQueue", { qType, pageIndex, returnedLastid, returnedTail })
    const { data, error: queueError, mutate } = useSWR(key, fetchQueue, {
        dedupingInterval: 200,
        onSuccess: onData
    });

    const ref = useRef<HTMLDivElement | null>(null)
    const entry = useIntersectionObserver(ref, {})
    const isVisible = !!entry?.isIntersecting
    //console.log("remder page:", qType, pageIndex, "isVisible:", isVisible)


    useEffect(() => {
        /**
         * Once roll into view, and has data - call setData to possibly append a new sibming segment
         */
        if (!hd && data && isVisible) {
            setData(data, pageIndex, true, data.tail ? data.tail : '');
            setHd(true)
        }
    }, [isVisible, hd, data, qType, pageIndex, setData]);

    return (<div className="other-segments" ref={ref}>{data?.items?.map((item: any) => <Qwiket key={`queue-qwiket-${qType}-${item.slug}-${item.qpostid}`} extraWide={extraWide} item={item} isTopic={false} qType={qType}></Qwiket>)}</div>)
}
/**
 * A workaround the problems with swrInfinite
 * @param param0 
 * @returns 
 */
const FirstSegment = ({ isLeft, extraWide, qType, lastid, tail, pageIndex, hasData, setData, updateSession,fullPage,channelDetails }: {
    isLeft: boolean, extraWide: boolean, qType: string, lastid: string, tail: number, pageIndex: number, hasData: boolean, setData: any, updateSession: any,fullPage?:boolean,channelDetails?:any
}) => {
    const { session, qparams } = useAppContext();
    const [returnedLastid, setReturnedLastid] = useState(lastid);
    const [returnedTail, setReturnedTail] = useState(tail);
    const [hd, setHd] = useState(hasData)

    const onData = useCallback((data: any, key: string, config: any) => {
        console.log("dbg onData FirstSegment segments onData fetchQueue remder", { isLeft,qType, newLastid: data.lastid, lastid, returnedLastid, newTail: data.tail, key, items: data?.items })
        if (data && (data.lastid != lastid)) {
            setReturnedLastid(data.lastid);
            if (data.tail)
                setReturnedTail(+data.tail);
            //  console.log("remder first segment. got new lastid", qType, data.lastid, lastid)
        }
    }, []);
    const key = ['queue', qType, qparams.newsline, qparams.forum, qType == 'tag' ? qparams.tag : '', pageIndex, 0, session.sessionid, session.userslug, 0, ''];


    //console.log("remder FirstSegment:", { key, qType, pageIndex, returnedLastid, returnedTail, isLeft })

    const { data, error: queueError, mutate } = useSWR(key, fetchQueue, {
        onSuccess: onData,
        revalidateIfStale:false


    });
    const items = data?.items;
    const ref = useRef<HTMLDivElement | null>(null)
    const entry = useIntersectionObserver(ref, {})
    const isVisible = !!entry?.isIntersecting;


    const onScroll = useCallback(() => {
        const { scrollY } = window;
        if (scrollY == 0 && !lastid) {
            mutate();
        }
    }, [lastid, mutate]);

    const reset = useCallback(() => {
        setReturnedTail(0);
        setReturnedTail(0)
        setTimeout(()=>mutate(),1);
    }, [mutate]);

    useEffect(() => {
        window.addEventListener("scroll", onScroll, { passive: true });
        // remove event on unmount to prevent a memory leak with the cleanup
        return () => {
            window.removeEventListener("scroll", onScroll);
        }
    }, []);

    useEffect(() => {
        console.log("remder to test a call setData", { hd, isVisible, qType, pageIndex, data })
        if (!hd && data && isVisible) {
            console.log("&&&&&&&&&&&&&&&&&&&&&&&& remder to a call setData", { isVisible, qType, pageIndex, data })
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
        return <div ref={ref}><Qwiket key={`fallback-qwiket-${qType}-${item.slug}`} extraWide={extraWide} item={item} isTopic={false} qType={qType}></Qwiket></div>
    }
    console.log(`dbg: FirstSegment`,{lastid:returnedLastid,tail:returnedTail})
    return (<div ref={ref}>{qType != 'topics' ? <Notifications isLeft={isLeft} qType={qType} newsline={qparams.newsline} forum={qparams.forum} lastid={returnedLastid} tail={returnedTail} sessionid={session.sessionid} userslug={session.userslug} reset={reset} tag={qType == 'tag' ? qparams.tag : ''} updateSession={updateSession} fullPage={fullPage} channelDetails={channelDetails}/> : <PlainHeader qType={qType} fullPage={fullPage}  channelDetails={channelDetails}/>}
        {items.map((item: any) => <Qwiket key={`queue-qwiket-${qType}-${item.slug}-${item.qpostid}`} extraWide={extraWide} item={item} isTopic={false} qType={qType}></Qwiket>)}</div>)
}

const Segments = ({ qType, isLeft, extraWide, updateSession,...props}: { qType: string, isLeft: boolean, extraWide: boolean, updateSession: any,fullPage?:boolean,channelDetails?:any }) => {
    let generateFirstSegment;
    /**
     * setData called by the segment when receiving data, so that for the last segment a new segment can be appended to the segments array
     * 
     * @param data 
     * @param pageIndex 
     * @param hasData 
     * @param tail 
     * @returns 
     */
    const setData = useCallback((data: any, pageIndex: number, hasData: boolean, tail: number) => {
       
        if (!segments || !segments.length) {
            console.log("remder no segments in setData")
            return;
        }
        if (pageIndex == segments.length - 1) {

            console.log("remder ---> adding segments for fetchData pageIndex:", pageIndex, qType, 'segments:', segments)
            segments.push(
                <Segment isLeft={isLeft} key={`segment-${qType}-${pageIndex + 1}`} extraWide={extraWide} qType={qType} lastid={data.lastid} tail={tail} pageIndex={pageIndex + 1} hasData={false} setData={setData} />,

            )
        }

        setSegments([...segments]) //immutable state
    }, [extraWide, isLeft, qType]);

    generateFirstSegment = (comment: any) => {
        console.log("dbg g: segments >>>>>>>>>>>   remder generateFirstSegment", qType, comment)
        return [
            <FirstSegment isLeft={isLeft} key={`first-segment-${qType}`} extraWide={extraWide} qType={qType} lastid={''} tail={0} pageIndex={0} hasData={false} setData={setData} updateSession={updateSession} {...props}/>,
        ]
    }
    const [segments, setSegments] = useState(generateFirstSegment('Segments:useState'));
    console.log('REMDER Segments:', JSON.stringify({ qType, isLeft }))
    return <QueueWrap>{segments}</QueueWrap>

}
const Queue = ({ qType, isLeft, session, ...props }: { qType: string, isLeft: boolean, session: Options, extraWide: boolean, updateSession: any,qparams:Qparams,fullPage?:boolean ,channelDetails?:any}) => {
    var randomstring = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const [guid,setGuid]=useState(randomstring())
    console.log("dbg q: queue render",guid,qType)
    qType = isLeft ? session.leftColumnOverride || qType : qType;
    let queue;
    switch (qType) {
        case 'newsline':
            queue = <NewslineQueue isLeft={isLeft} session={session} {...props} />;
            break;
        case 'mix':
            queue = <MixQueue isLeft={isLeft} session={session} {...props} />;
            break;
        case 'topics':
            queue = <TopicsQueue isLeft={isLeft} session={session} {...props} />;
            break;
        case 'tag':
            queue = <TagQueue isLeft={isLeft} session={session} {...props} />;
            break;
        default:
            queue = <ReactsQueue isLeft={isLeft} session={session} {...props} />;

    }
    return <QueueWrap>{queue}</QueueWrap>
}
const ReactsQueue = (props: any) => <Segments qType='reacts' {...props} />
const NewslineQueue = (props: any) => <Segments qType='newsline' {...props} />
const TagQueue = (props: any) => <Segments qType='tag' {...props} />
const TopicsQueue = (props: any) => <Segments qType='topics' {...props} />
const MixQueue = (props: any) => <Segments qType='mix' {...props} />
export default Queue;