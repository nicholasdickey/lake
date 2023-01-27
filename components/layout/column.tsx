import React, { useState } from 'react';
import styled from 'styled-components';
import { Qparams } from '../../lib/qparams';
import { Options } from '../../lib/withSession'
import Queue from '../qwikets/queue';
import Navigator from '../navigator';
import Topic from '../topic';


//const QwiketItem = () => <div>QwiketItem</div>
const Tag = () => <div>Tag</div>
//const Queue=()=><div>Queue</div>


interface Width {
    width: string
}
const StyledColumn = styled.div<Width>`
position:relative;
width:${({ width }) => width};
`
const InnerStyledColumn = styled.div`
width:100%;
`
const InnerTagWrap = styled.div`
width:100%;
display:flex;
`
const TopicWrap = styled.div`
width:66.667%;
`
const FeedWrap = styled.div`
width:33.333%;
`
const InnerFeedWrap = styled.div`
width:100% !important;
`
const MpColumn = styled.div<Width>`
width:${({ width }) => width};
display:flex;
`
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
    background:blue;//var(--lowlight);
    border:1px solid;
    margin-left:6px;
    width:auto;
    
`

/*
const listRenderer = ({ qparams, rows, tag, ...rest }) => {
    return <InnerStyledColumn data-id="inner-styled-column" className="q-column">{rows}</InnerStyledColumn>
}
*/
var randomstring = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
export const Column = ({ spaces, column, qparams, session, updateSession, isLeft, channelDetails, qCache, setQCache }: { spaces: number, column: any, qparams: Qparams, session: Options, updateSession: any, isLeft: boolean, channelDetails: any, qCache: any, setQCache: any }) => {


    let width = column.percentWidth;
    let type = column.type;
    let selector = column.selector;
    let msc = column.msc;
  
    console.log("**************************************Column:", spaces, selector, type, msc, session)
    if (type == 'stc') {
        switch (selector) {
            case 'twitter': //tbd
            case 'newsviews':
                selector = 'mix';
            case 'mix':
            case 'newsline':
            case 'reacts':
            case 'topics':
            case 'tag':
                selector = isLeft ? session.leftColumnOverride ||selector : selector;
                if(isLeft)
                console.log(`dbg Column>>>: ${selector}`, session.leftColumnOverride)
                  
                //use cache for columns
                let q;// = qCache[selector];
                if (!q) {
                    console.log('dbg q fresh not from cache',selector)
                    q = <Queue isLeft={isLeft} extraWide={false} qType={selector} qparams={qparams} session={session} updateSession={updateSession} />
                   // qCache[selector] = q;
                   // setQCache(qCache)
                }
                else {
                    console.log(`dbg: q from cache`,selector)
                }
                return <StyledColumn width={width} data-id="styled-column" key={`${selector}-column`}>{q}</StyledColumn>;
            /*  case 'tag':
                  return <StyledColumn width={'100%'}>
                      <Queue isLeft={false} extraWide={true} qType={'tag'} qparams={qparams} session={session} updateSession={updateSession} />
                  </StyledColumn>*/

            case 'topic':
                return <StyledColumn width={'100%'} key="main-topic" ><ColumnHeader><div /><InnerHeader>{'topic'}</InnerHeader></ColumnHeader>
                    <Topic singlePanel={spaces > 2} fullPage={true} />
                </StyledColumn>
            case 'navigator': // for now not caching
                return <StyledColumn width={'100%'} key="main-navigator">
                    <Navigator session={session} qparams={qparams} updateSession={updateSession} />
                </StyledColumn>


        }
    }
    else {
        if (type == 'mp') {

            let leftWidth, rightWidth;

            console.log("MP", column.width, selector, msc)
            if (selector == 'topic') {
                leftWidth = `${((column.width - 1) / column.width) * 100}%`;
                rightWidth = `${(1 / column.width) * 100}%`;
                console.log("width left:", leftWidth, rightWidth)
                let q;// = qCache[`tag-mp`];
                if (!q) {
                    q = <Queue isLeft={false} extraWide={true} qType={'tag'} qparams={qparams} session={session} updateSession={updateSession} />
                    //qCache['tag-mp'] = q;
                    //setQCache(qCache)
                }

                return <MpColumn width={width} data-id="mp-column" key='topic-mp'>
                    <StyledColumn width={leftWidth}><ColumnHeader><div /><InnerHeader>{'topic'}</InnerHeader></ColumnHeader>
                        <Topic />
                    </StyledColumn>
                    <StyledColumn width={rightWidth} key="tag-mp"> {q}</StyledColumn>
                </MpColumn>
            }
            else {
                leftWidth = '61.8%';
                rightWidth = '38.2%';
                let q;// = qCache[`newsline-mp`];
                console.log("dbg q:",q)
                if (!q) {
                    q = <Queue key={`newsline-mp-${randomstring()}`} isLeft={false} extraWide={true} qType={selector} qparams={qparams} session={session} updateSession={updateSession} />
                   // qCache['newsline-mp'] = q;
                   // setQCache(qCache)
                }
                return <MpColumn width={width} data-id="mp-column">
                    <StyledColumn width={leftWidth} key='newsline-mp'>{q}</StyledColumn>
                    <StyledColumn width={rightWidth} key="navigator-mp">
                        <Navigator session={session} qparams={qparams} updateSession={updateSession} />
                    </StyledColumn>
                </MpColumn>
            }
        }
    }
    return <StyledColumn width='100%'>{JSON.stringify(column, null, 4)}</StyledColumn>
}