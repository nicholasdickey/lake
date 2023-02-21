import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import useSWR from 'swr';
import styled from 'styled-components';
import { fetchQueue, FetchQueueKey } from '../../lib/lakeApi';
import Qwiket from '../item/qwiket'
import useIntersectionObserver from '../../lib/useIntersectionObserver'
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
    padding-left:6px;
    padding-right:6px;
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
//const Arrow = () => <svg className="jss37 jss168" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation"><path d="M7 10l5 5 5-5z"></path></svg>

const Notifications = ({ isLeft, qType, newsline, forum, lastid, tail, sessionid, userslug, reset, tag, ...props }:
    {
        isLeft: boolean, qType: string, newsline: string, forum: string, lastid: string, tail: number, sessionid: string, userslug: string, reset: any,
        tag: string
    }) => {
    const { session, qparams } = useAppContext();
    const key = ['notif', qType, newsline, qparams.type == 'solo' ? 1 : 0, forum, (qType == 'tag' || qparams.type == 'solo') ? qparams.tag : '', 0, lastid, sessionid, userslug, tail];
    const { data, error } = useSWR(key, fetchQueue, {
        refreshInterval: qType == 'topics' ? 24 * 3600 * 1000 : 60000
    });
    const notifications = data?.newItems;
    // console.log("REMDER QUEUE notif:", qType, key, data);

    const itemName = notifications == 1 ? 'Item' : 'Items';
    const onClick = () => {
        if (reset)
            setTimeout(() => { reset() }, 1);
    }
    // console.log("Notifications Remder",qType,name,isLeft,data)
    return <ColumnHeader>{qType != 'topics' && +notifications > 0 ? <LeftHeader onClick={onClick}>Show {notifications} New {itemName}</LeftHeader> : <div />}</ColumnHeader>
}

/**
 * A workaround the problems with swrInfinite
 * @param param0 
 * @returns 
 */
const Segment = ({ card,  extraWide, qType, lastid,isRight,  pageIndex,  setData }: {
    card: string, isLeft?: boolean,
    extraWide: boolean, qType: string, lastid: string, isRight:boolean,tail?: number, pageIndex: number, setData: any
}) => {
    const { session, qparams } = useAppContext();

   

    //    const key = ['queue', qType, qparams.newsline, qparams.type=='solo'?1:0,qparams.forum, (qType == 'tag'||qparams.type=='solo') ? qparams.tag : '', pageIndex, lastid, session.sessionid, session.userslug, tail, ''];
    const key: FetchQueueKey["key"] = ['queue', qType, qparams.newsline, qType == 'newsline' && qparams.type == 'solo' ? 1 : 0, qparams.forum, (qType == 'tag' || qType == 'newsline' && qparams.type == 'solo') ? qparams.tag : '', pageIndex, lastid, session.sessionid, session.userslug, 0, '', '', 0, card];

    // console.log("Segment before fetchQueue", { qType, pageIndex})
    const { data, error: queueError, mutate } = useSWR(key, fetchQueue, {
        revalidateIfStale: false,
        revalidateOnFocus: false
        //revalidateOnMount:false
    });
    // if(qType=='reacts'&& !data)
    //     console.log(`SEGMENT ${pageIndex} nodata`)
    const ref = useRef<HTMLDivElement | null>(null)
    const entry = useIntersectionObserver(ref, {})
    if (entry && entry.boundingClientRect.top > 0) {
        //console.log("entry BELOW", qType) // do things if below
    } else {
        // console.log("dbgi: entry ABOVE", qType) // do things if above
    }
    const isVisible = !!entry?.isIntersecting || entry && entry.boundingClientRect.top < 0
    // console.log("d1b: remder segment:",isVisible, card, qType, pageIndex)

    //  useEffect(() => {
    /**
     * Once roll into view, and has data - call setData to possibly append a new sibming segment
     */
    // console.log(`dbgi: secondary segment, test for setData`,{qType,pageIndex,hd,data,isVisible})
    if (data && isVisible) {
        // if(qType=='reacts')
        // console.log("segment call setdata",pageIndex);
        setData(data, pageIndex, true, data.tail ? data.tail : '');
        // setTimeout(()=>setData(data, pageIndex, true, data.tail ? data.tail : ''),1);
        // setHd(true)
    }
    //  }, [isVisible, data, qType, pageIndex, setData]);

    return (<div className="other-segments" ref={ref}>{data?.items?.map((item: any) => <Qwiket key={`queue-qwiket-${qType}-${item.slug}-${item.qpostid}`} extraWide={extraWide} isRight={isRight} item={item} isTopic={false} qType={qType}></Qwiket>)}</div>)
}
/**
 * A workaround the problems with swrInfinite
 * @param param0 
 * @returns 
 */
const FirstSegment = ({ visible, guid, card, resetSegments, isLeft, isRight, extraWide, qType, lastid, tail, pageIndex, hasData, setData }: {
    visible: boolean, guid: string, card: string, resetSegments: any, isLeft: boolean, isRight:boolean ,extraWide: boolean, qType: string, lastid: string, tail: number, pageIndex: number, hasData: boolean, setData: any
}) => {
    // console.log("d1b FirstSegment BEGIN RENDER",{visible})
    const { session, qparams } = useAppContext();
    const [returnedLastid, setReturnedLastid] = useState(lastid);
    const [returnedTail, setReturnedTail] = useState(tail);
    const [processed, setProcessed] = useState(false);
    const [fsGuid, setFSGuid] = useState(randomstring());

    // const {visible}=useContext(segmentsContext);
    /* const [isv,setIsv]=useState(visible)
     useEffect(()=>{
         console.log(`d1b: FirstSegment useEffect`,visible,isv)
         //if(visible!=isv)
         setIsv(visible)
     },[visible,isv])
     const getVisible=useCallback((r:string)=>{
         console.log("d1b: getVisible",{r,visible,isv,guid,fsGuid});
         return visible;
     },[isv,visible]);*/
    const onData = useCallback((data: any, key: string, config: any) => {
        // console.log("dbg onData FirstSegment segments onData fetchQueue remder", { isLeft, qType, newLastid: data.lastid, lastid, returnedLastid, newTail: data.tail, key, items: data?.items })
        if (data) {
            // console.log(`d1b: OnData FirstSegment`, data);
            setReturnedLastid(data.lastid);
            setReturnedTail(+data.tail);
            //  console.log("remder first segment. got new lastid", qType, data.lastid, lastid)
        }
    }, []);
    // const visible = isRistVisible(randomstring());
    const key: FetchQueueKey["key"] = ['queue', qType, qparams.newsline, qType == 'newsline' && qparams.type == 'solo' ? 1 : 0, qparams.forum, (qType == 'tag' || qType == 'newsline' && qparams.type == 'solo') ? qparams.tag : '', pageIndex, '0', session.sessionid, session.userslug, 0, '', '', 0, card];


    // console.log("d1b remder FirstSegment:", { fsGuid,guid,visible, card, type: qparams.type, key, qType, pageIndex, returnedLastid, returnedTail, isLeft })

    const { data, error: queueError, mutate } = useSWR(key, fetchQueue, {
        onSuccess: onData,
        revalidateIfStale: false,
        revalidateOnFocus: false
    });

    const items = data?.items;
    const ref = useRef<HTMLDivElement | null>(null)
    const entry = useIntersectionObserver(ref, {})
    if (entry && entry.boundingClientRect.top > 0) {
        // console.log("entry BELOW",qType) // do things if below
    } else {
        //console.log("dbgi: entry ABOVE",qType) // do things if above
    }
    const isVisible = !!entry?.isIntersecting || entry && entry.boundingClientRect.top < 0


    const onScroll = useCallback(() => {

        const { scrollY } = window;
        if (scrollY == 0) {
           // if (!visible)
          //      return;

            // console.log("d1b: calling mutate",visible)
            mutate();
            // console.log(`d1b: FirstSegment calling resetSegments`, { guid, visible, card, qType })
            resetSegments();
            setProcessed(false);

        }
    }, [visible])

    const reset = useCallback(() => {
        if (!visible)
            return;
        // setReturnedTail(0);
        // setReturnedTail(0)
        //   console.log("d1b FirstSegment reset", { guid, visible })
        setTimeout(() => {
            mutate()
            resetSegments();
        }, 1);
    }, [mutate,visible]);

    useEffect(() => {
        if (visible) {
            // console.log("d1b: Add onScroll listener",visible)
            window.addEventListener("scroll", onScroll, { passive: true });
        }
        else {
            //console.log("d1b: Remove onScroll listener",visible)
            window.removeEventListener("scroll", onScroll);
        }

        // remove event on unmount to prevent a memory leak with the cleanup
        return () => {
            window.removeEventListener("scroll", onScroll);
        }
    }, [visible]);

    //useEffect(() => {
    //console.log("dbgi: remder to test a call setData", { hd, isVisible, qType, pageIndex, data })
    if (visible && data && isVisible && !processed) {
        setTimeout(() => setProcessed(true), 1)
        // console.log(" d1b: &&&&&&&&&&&&&&&&&&&&&&&& remder to a call setData", { isVisible, qType, pageIndex, data })
        // if(qType=='reacts')
        // console.log("first segment call setdata",pageIndex,data.lastid);
        setData(data, pageIndex, true, data.tail ? data.tail : '')
        // setHd(true)
    }
    //}, [isVisible, data, qType, pageIndex, setData]);


    //if (!pageIndex)
    //    console.log("REMDER SEGMENT page=", pageIndex, "isVisible:", isVisible, 'returnedLastid:', returnedLastid, data?.items);
    if (!items) {
        // console.log("d1b NO ITEMS", { guid, card, qType })
        const item = {
            image: 'https://media.istockphoto.com/id/1280015859/photo/blue-lake-with-treeline-in-autumn-color-on-a-sunny-afternoon-in-northern-minnesota.jpg?s=612x612&w=0&k=20&c=smtj8bw1BW3gUI9rrxRnAzQKGWmTyMQYcODgbuWNMbc=',
            title: 'Loading...',
            site_name: 'America First News',
            description: "Loading...",
            slug: 'loading'

        }
        return <div ref={ref}><Qwiket key={`fallback-qwiket-${qType}-${item.slug}`} extraWide={extraWide} item={item} isTopic={false} isRight={isRight} qType={qType}></Qwiket></div>
    }
    // console.log(`d1b: FFFirstSegment`, { fsGuid,lastid: returnedLastid, tail: returnedTail, card, qType, visible, guid, isVisible, blah: 'blah' })
    return (<div ref={ref}>{qType != 'topics' ? <Notifications isLeft={isLeft} qType={qType} newsline={qparams.newsline} forum={qparams.forum} lastid={returnedLastid} tail={returnedTail} sessionid={session.sessionid} userslug={session.userslug} reset={reset} tag={qType == 'tag' ? qparams.tag : ''} /> : null}
        {items.map((item: any) => <Qwiket key={`queue-qwiket-${qType}-${item.slug}-${item.qpostid}`} isRight={isRight} extraWide={extraWide} item={item} isTopic={false} qType={qType}></Qwiket>)}</div>)
}

const Segments = ({ guid, visible, card, qType, isLeft,isRight,extraWide, ...props }: { guid: string, visible: boolean, card: string, qType: string, isLeft: boolean, isRight:boolean,extraWide: boolean }) => {
    //  const SegmentsContext = createContext({visible});
    // const [isv,setIsv]=useState(visible)
    const [segments, setSegments] = useState<any[]>([]);

   /* const [isv, setIsv] = useState(visible)
    useEffect(() => {
        //console.log(`d1b: SEGMENTS useEffect`,visible,isv)
        if (visible != isv)
            setIsv(visible)
    }, [visible])
    // console.log("d1b Sewgmanets:",{visible,isv})
    const getVisible = () => isv;*/
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
        if (!visible)
            return;
        // console.log('dbgi: Segments, testing segments',{qType,pageIndex,segments})
        /* if (!segments || !segments.length) {
             // console.log("remder no segments in setData")
             
         }*/
        // console.log('d1b: Segments, testing length', {isv, visible,guid, card, pageIndex, length: segments.length })
        if (pageIndex >= segments.length - 1) {
            // if(qType=='reacts')
            //  console.log(`dbgi: Segments adding a segment`,{qType,pageIndex,lastid:data.lastid,tail:data.tail});

            //  console.log("d1b: remder ---> adding segments for fetchData pageIndex:",isv, guid, card, visible, pageIndex, qType, 'segments:', segments)
           
            segments.push(
                <Segment card={card}  key={`segment-${qType}-${segments.length}`} extraWide={extraWide} isRight={isRight} qType={qType} lastid={data.lastid} pageIndex={pageIndex + 1}  setData={setData} /> 
            )

        }
        setTimeout(() => setSegments([...segments]), 1); //immutable state

    }, [extraWide, isLeft, qType, visible]);

    const resetSegments = useCallback(() => {
        if (!visible)
            return;
        const oldSegments = [...segments];
        segments.splice(1); // I need instant response

        //  console.log(`d1b: resetSegments ${qType}`, {isv:getVisible(), guid, visible, segments, oldSegments })
        setSegments(segments)
    }, [visible]);


    // console.log('d1b ========>REMDER Segments:', visible, card, JSON.stringify({ card, qType, isLeft, numSegments: segments.length }))
    return <QueueWrap>
        <FirstSegment visible={visible} guid={guid} card={card} resetSegments={resetSegments} isLeft={isLeft} isRight={isRight} key={`first-segment-${qType}`} extraWide={extraWide} qType={qType} lastid={''} tail={0} pageIndex={0} hasData={false} setData={setData}  {...props} />
        {segments}
    </QueueWrap>

}
const Queue = ({ qType, isLeft, ...props }: { visible: boolean, card: string, qType: string, isLeft: boolean, isRight:boolean,extraWide: boolean }) => {
    const [guid, setGuid] = useState(randomstring())
    const { session } = useAppContext();
    // console.log("d1b: **********************************  dbg q: queue remder", guid, props.card, qType, 'visible:', props.visible)
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
    return <Segments isLeft={isLeft} guid={guid} qType={qType} {...props} />//<QueueWrap>{queue}</QueueWrap>
}
const ReactsQueue = (props: any) => <Segments qType='reacts' {...props} />
const NewslineQueue = (props: any) => <Segments qType='newsline' {...props} />
const TagQueue = (props: any) => <Segments qType='tag' {...props} />
const TopicsQueue = (props: any) => <Segments qType='topics' {...props} />
const MixQueue = (props: any) => <Segments qType='mix' {...props} />
export default Queue;
//<Segments isLeft={isLeft}  guid={guid} qType={qType} {...props} />/