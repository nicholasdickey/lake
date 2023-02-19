import React, { useState, useCallback } from 'react';

import styled from 'styled-components';
import Swipe from "react-easy-swipe";
import { Qparams } from '../../lib/qparams';
import { Options } from '../../lib/withSession'
import Queue from '../stream/queue';
import Navigator from '../navigation/navigator';
import Topic from '../item/topic';
import Twitter from '../widgets/twitter';
import { useAppContext } from "../../lib/context";

//const QwiketItem = () => <div>QwiketItem</div>
const Tag = () => <div>Tag</div>
//const Queue=()=><div>Queue</div>


interface Width {
    width: string
}
const StyledColumn = styled.div<Width>`
//position:relative;
background:var(--background);
text-overflow:ellipsis;
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
interface Opened {
    opened: boolean;
}
const OpenedMenu = styled.div<Opened>`
    position:absolute;
    display:block;
    margin-top:16px;
    margin-left:-16px;
    margin-right:20px;
    
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
const ColumnHeader = styled.div`
   //position:absolute;
    display:flex;
    right:0px;
    justify-content: flex-end;
    //height:28px;
    width:auto;
    z-index:190;
    background:var(--background);
`
const LeftColumnHeader = styled.div`
    position:absolute;
    display:flex;
    left:0px;
    justify-content: flex-start;
    //height:28px;
    width:auto;
    z-index:190;
    background:var(--background);
    
   
`
const InnerHeader = styled.div`
    position:absolute;  
    display:flex;
    margin-top:-7px;
    color:var(--qwiketBorderStale);
    font-weight:300;
    font-size:12px;
    margin-right:6px;
    z-index:190;
    padding-left:6px;
    padding-right:6px;
    background:var(--background);
    height:1.5em;

`

const InnerSwipe = styled.div`
    display:flex;
`
/*
const listRenderer = ({ qparams, rows, tag, ...rest }) => {
    return <InnerStyledColumn data-id="inner-styled-column" className="q-column">{rows}</InnerStyledColumn>
}
*/

const RotateRight = styled.div`
    transform:rotate(-90deg);
    margin-top:-2px;
`
const RotateLeft = styled.div`
    transform:rotate(90deg);
    margin-top:-2px;
`
interface FullPageParam {
    fullPage: boolean

}
const SelectButton = styled.div<FullPageParam>`
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
        color:${(fullPage) => fullPage ? null : 'var(--button)'}; 
  }
`
const Pushdown = styled.div`
    height:19px;
   
`
const Arrow = () => <svg className="jss37 jss168" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation"><path d="M7 10l5 5 5-5z"></path></svg>
interface SelectorChoice {
    qType: string,
    tag: string,
    selected?: boolean
}
const LeftSelector = ({ qType, updateSession, name, fullPage }: { qType: string, updateSession: any, name: string, fullPage?: boolean }) => {
    const [opened, setOpened] = useState(false);
    const { channelDetails, qparams, newslineSingleSelectors, topicSingleSelectors } = useAppContext();
    if (!fullPage)
        fullPage = false;
    // console.log("LeftSelector", fullPage)
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
    // console.log("remder LeftSelector", fullPage, qType, channelDetails)
    const onClick = (type: string) => {
        console.log("onClick", type)
        updateSession({ leftColumnOverride: type });
        setOpened(false);
    }


    const rotate = (type: string, dir: number) => {
        if (type == 'newsline' || type == 'solo') {
            let index = newslineSingleSelectors.findIndex((s: SelectorChoice) => s.qType == qType);
            index += 1 * dir;
            if (index >= newslineSingleSelectors.length)
                index = 0;
            const node = newslineSingleSelectors[index];
            // console.log("rotate:", node, index, newslineSingleSelectors)
            updateSession({ leftColumnOverride: node.qType });

        }
        else {
            let index = topicSingleSelectors.findIndex((s: SelectorChoice) => s.qType == qType);
            index += 1 * dir;
            if (index >= topicSingleSelectors.length)
                index = 0;
            const node = topicSingleSelectors[index];
            updateSession({ leftColumnOverride: node.qType });
        }
    }

    const swipe = (position: any, event: any, type: string) => {
        console.log("swipe", position, event, type);
        if (position.x > 5 && position.y < 10 && position.y > -10) {
            console.log("RIGHT SWIPE")
            rotate(type, 1)
        }
        if (position.x < -5 && position.y < 10 && position.y > -10) {
            console.log("LEFT SWIPE")
            rotate(type, -1)
        }
    }
    let fullChoices = [];
    if (fullPage) {
        fullChoices = qparams.type == 'newsline' || qparams.type == 'solo' ? newslineSingleSelectors.map((p: SelectorChoice) => Object.assign(p, { selected: p.qType == qType })) : topicSingleSelectors.map((p: SelectorChoice) => Object.assign(p, { selected: p.qType == qType }))
    }

    return <>{fullPage ?
        <Swipe onSwipeMove={(position, event) => swipe(position, event, qparams.type)}><InnerSwipe><SelectButton fullPage={fullPage} onClick={() => rotate(qparams.type, -1)}><RotateLeft><Arrow /></RotateLeft></SelectButton>
            <div onClick={() => setOpened(!opened)}>{name}</div>
            <SelectButton fullPage={fullPage} onClick={() => rotate(qparams.type, 1)} >
                <RotateRight>
                    <Arrow />
                </RotateRight>
            </SelectButton></InnerSwipe>
            {opened ? <OpenedMenu opened={opened}>{fullChoices.map((c: any) => <SelectItem onClick={() => { onClick(c.qType) }} key={`selected-${qType}`} selected={c.selected} >{c.tag}</SelectItem>)
            }</OpenedMenu> : null}
        </Swipe>
        :
        <>
            <div onClick={() => setOpened(!opened)}>{name}</div>
            <SelectButton fullPage={fullPage} onClick={() => setOpened(!opened)}> <Arrow /></SelectButton>
            {opened ? <OpenedMenu opened={opened}>{choices.map(c => <SelectItem onClick={() => { onClick(c.qType) }} key={`selected-${qType}`} selected={c.selected} >{c.tag}</SelectItem>)
            }</OpenedMenu> : null}</>}
    </>
}

export const Column = ({pageType, visible,card,spaces, column, qparams, session, updateSession, isLeft, isRight,qCache, setQCache, ...props }: { pageType:string,visible:boolean,card:string, spaces: number, column: any, qparams: Qparams, session: Options, updateSession: any, isLeft: boolean, isRight:boolean, channelDetails: any, qCache: any, setQCache: any }) => {

    let width = column.percentWidth;
    let type = column.type;
    let selector = column.selector;
    let msc = column.msc;
    const [topicOverride, setTopicOverride] = useState({ leftColumnOverride: 'topic' });
   // const [inited,setInited]=
    const fullPage = spaces < 3;
    var randomstring = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const [guid, setGuid] = useState(randomstring())
   // console.log("d1b: COLUMN RENDER",guid,visible,card, selector,type)
    //  console.log("**** FirstColumn:", JSON.stringify({qparamsType:qparams.type,isLeft,spaces, selector, type, msc, session}))
    if (selector == 'newsviews')
        selector = 'mix';

    if (fullPage) {
        if (pageType=='newsline') {
            selector = session.leftColumnOverride || selector;
        }
        else {
            selector = topicOverride.leftColumnOverride || selector;
        }
    }
    else if (isLeft) {
        selector = session.leftColumnOverride || selector;
    }
    //console.log("d1b: COLUMN RENDER",{guid,visible,card, selector,type,pageType})
   
    const feedName = (qparams.tag == 'ld' ? 'basement' : qparams.tag == 'fq' ? 'americafirstnews' : qparams.tag) + ' feed';
    const name = selector == 'mix' ? 'news&views' : selector == 'tag' ? feedName : selector == 'topics' ? 'active topics' : selector == 'reacts' ? 'comments' : qparams.type == 'solo' ? `solo ${qparams.tag == 'ld' ? 'basement' : qparams.tag}` : selector;

    if (qparams.type == 'newsline' || qparams.type == 'solo') {
        if (selector == 'topic' || selector == 'feed')
            selector = 'mix';
      //???  setTimeout(() => setTopicOverride({ leftColumnOverride: 'topic' }), 1);
    }
    //console.log("**************************************Column:", spaces, selector, type, msc, session)
    if (type == 'stc') {
        switch (selector) {
            case 'twitter': //tbd
                return <StyledColumn width={width} data-id="styled-column" key={`${selector}-column`}>
                    <ColumnHeader> <InnerHeader>{isLeft ? <LeftSelector qType={selector} name={name} updateSession={updateSession} fullPage={fullPage} /> : name}</InnerHeader></ColumnHeader>
                    <Twitter />
                </StyledColumn>;
            case 'newsviews':
            case 'mix':
            case 'newsline':
            case 'reacts':
            case 'topics':

               // let q;// = qCache[selector];
               // if (!q) {
                    // console.log('dbg q fresh not from cache',selector)
                    const q = <Queue  visible={visible} card={card} isLeft={isLeft} isRight={isRight} extraWide={false} qType={selector}{...props} />
                    // qCache[selector] = q;
                    // setQCache(qCache)
                //}
               // else {
                    // console.log(`dbg: q from cache`,selector)
                //}
                // console.log('dbg column:', selector, name)
                return <StyledColumn width={width} data-id="styled-column" key={`${selector}-column`}>
                    <ColumnHeader> <InnerHeader>{isLeft ? <LeftSelector qType={selector} name={name} updateSession={updateSession} fullPage={fullPage} /> : name}</InnerHeader></ColumnHeader>
                    {q}
                </StyledColumn>;
            case 'tag':
                console.log("COLUMN TAG", selector)
                return <StyledColumn width={width} data-id="styled-column" key={`${selector}-column`}>
                    <ColumnHeader> <InnerHeader>{isLeft ? <LeftSelector qType={selector} name={name} updateSession={setTopicOverride} fullPage={fullPage} /> : name}</InnerHeader></ColumnHeader>
                    <Queue  visible={visible}  card={card}  isLeft={false} isRight={isRight}  extraWide={false} qType={selector} {...props} />
                </StyledColumn>
            case 'topic':
                return <StyledColumn width={'100%'} key="main-topic" ><ColumnHeader><div /></ColumnHeader>
                    <ColumnHeader> <InnerHeader>{isLeft ? <LeftSelector qType={selector} name={selector} updateSession={setTopicOverride} fullPage={fullPage} /> : selector}</InnerHeader></ColumnHeader>
                    <Topic singlePanel={spaces > 2} fullPage={true} />
                </StyledColumn>
            case 'navigator': // for now not caching
                return <StyledColumn width={'100%'} key="main-navigator">
                    <ColumnHeader> <InnerHeader>{isLeft ? <LeftSelector qType={selector} name={selector} updateSession={updateSession} fullPage={fullPage} /> : selector}</InnerHeader></ColumnHeader>
                    <Pushdown></Pushdown><Navigator session={session} qparams={qparams} updateSession={updateSession} />
                </StyledColumn>
        }
    }
    else {
        if (type == 'mp') {

            let leftWidth, rightWidth;

            // console.log("column MP", column.width, selector, msc)
            if (selector == 'topic') {
                // console.log("MP column Topic")
                leftWidth = `${((column.width - 1) / column.width) * 100}%`;
                rightWidth = `${(1 / column.width) * 100}%`;
                //  console.log("width left:", leftWidth, rightWidth)
                let q;// = qCache[`tag-mp`];
                if (!q) {
                    q = <Queue   visible={visible} card={card}  isLeft={false} isRight={isRight} extraWide={true} qType={'tag'} />
                    //qCache['tag-mp'] = q;
                    //setQCache(qCache)
                }

                return <MpColumn width={width} data-id="mp-column" key='topic-mp'>
                    <StyledColumn width={leftWidth}>
                        <ColumnHeader>
                            <InnerHeader>{isLeft ? <LeftSelector qType={selector} name={'topic'} updateSession={updateSession} /> : 'topic'}</InnerHeader>
                        </ColumnHeader>
                        
                        <Topic />
                    </StyledColumn>
                    <StyledColumn width={rightWidth} key="tag-mp">
                        <ColumnHeader>
                            <InnerHeader>{isLeft ? <LeftSelector qType={'tag'} name={'feed'} updateSession={updateSession} /> : feedName}</InnerHeader></ColumnHeader>
                        {q}
                    </StyledColumn>
                </MpColumn>
            }
            else {
                leftWidth = '61.8%';
                rightWidth = '38.2%';
                let q;// = qCache[`newsline-mp`];
                // const name = 'newsline'
                // console.log("dbg q:",q)
                if (!q) {
                    q = <Queue  visible={visible}  card={card} key={`newsline-mp`} isLeft={false} isRight={true}  extraWide={true} qType={selector} />
                    // qCache['newsline-mp'] = q;
                    // setQCache(qCache)
                }
                return <MpColumn width={width} data-id="mp-column">
                    <StyledColumn width={leftWidth} key='newsline-mp'>

                        <ColumnHeader> <InnerHeader>{isLeft ? <LeftSelector qType={selector} name={name} updateSession={updateSession} /> : name}</InnerHeader></ColumnHeader>

                        {q}</StyledColumn>
                    <StyledColumn width={rightWidth} key="navigator-mp">
                        <ColumnHeader> <InnerHeader>{isLeft ? <LeftSelector qType={selector} name={'navigator'} updateSession={updateSession} /> : ''}</InnerHeader></ColumnHeader>

                        <Navigator session={session} qparams={qparams} updateSession={updateSession} />
                    </StyledColumn>
                </MpColumn>
            }
        }
    }
    return <StyledColumn width='100%'>{JSON.stringify(column, null, 4)}</StyledColumn>
}