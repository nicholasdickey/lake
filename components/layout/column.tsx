import React from 'react';
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
/*
const listRenderer = ({ qparams, rows, tag, ...rest }) => {
    return <InnerStyledColumn data-id="inner-styled-column" className="q-column">{rows}</InnerStyledColumn>
}
*/
export const Column = ({ spaces,column, qparams, session, updateSession }: { spaces:number,column: any, qparams: Qparams, session: Options, updateSession: any }) => {
    let width = column.percentWidth;

    let type = column.type;
    let selector = column.selector;
    let msc = column.msc;
    console.log("**************************************Column:", selector, type, msc, session)
    if (type == 'stc') {
        switch (selector) {
            case 'twitter':
            case 'newsviews':
                selector = 'mix';
            case 'newsline':
            case 'reacts':
        
            case 'topics': {
                console.log(`Column>>>: ${selector}`, session)
                /*  const renderer = ({ item, index, x, y, tag, qparams, channel }) => {
                      //const [ref, setRef] = useState(false);
                      //  console.log("RENDERER:", item)
      
      
                      return <QwiketItem columnType={tag} topic={item} channel={channel} qparams={qparams} forceShow={false} approver={false} test={false} />
                  }*/
                return <StyledColumn width={width} data-id="styled-column"><Queue extraWide={false} qType={selector} qparams={qparams} session={session} /></StyledColumn>
            }
            case 'feed': {
                console.log("Column:feed")
                /* const renderer = ({ item, index, x, y, tag, qparams, channel }) => {
                     //const [ref, setRef] = useState(false);
                     //  console.log("RENDERER:", item)
     
     
                     return <QwiketItem columnType={tag} topic={item} channel={channel} qparams={qparams} forceShow={false} approver={false} test={false} />
                 }*/
                return <Queue extraWide={false} qType={selector} qparams={qparams} session={session} />
            }
           /* case "topic": {
                // console.log("Column:topic")

                //console.log("Column:feed")
                const renderer = ({ item, index, x, y, tag, qparams, channel }) => {
                    //const [ref, setRef] = useState(false);
                    //  console.log("RENDERER:", item)


                    return <QwiketItem data-id="qwiket-item" columnType={tag} topic={item} channel={channel} qparams={qparams} forceShow={false} approver={false} test={false} />
                }
                return <StyledColumn width={"100%"} data-id="styled-column">
                    <Tag qparams={qparams} />
                    <InnerTagWrap data-id="inner-tag-wrap">
                        <TopicWrap>
                            <Topic qparams={qparams} />
                        </TopicWrap>

                        <FeedWrap data-id="feed-wrap" >
                            <InnerFeedWrap data-id="inner-feed-wrap">
                                <Queue extraWide={false} qType={msc} qparams={qparams} session={session} />
                            </InnerFeedWrap>
                        </FeedWrap>
                    </InnerTagWrap>
                </StyledColumn>
            }*/
        }
    }
    else {
        if (type == 'mp') {

            let leftWidth, rightWidth;
           
            console.log("MP", column.width,selector, msc)
            if (selector == 'topic') {
                leftWidth =`${((column.width-1)/column.width)*100}%`;
                rightWidth =`${(1/column.width)*100}%`;
                console.log("width left:",leftWidth,rightWidth)
                return <MpColumn width={width} data-id="mp-column">
                    <StyledColumn width={leftWidth}>
                        <Topic />
                    </StyledColumn>
                    <StyledColumn width={rightWidth}>
                        <Queue extraWide={true} qType={'tag'} qparams={qparams} session={session} />
                    </StyledColumn>
                </MpColumn>
            }
            else {
                leftWidth = '61.8%';
                rightWidth = '38.2%';
                return <MpColumn width={width} data-id="mp-column">
                    <StyledColumn width={leftWidth}>
                        <Queue extraWide={true} qType={selector} qparams={qparams} session={session} />
                    </StyledColumn>
                    <StyledColumn width={rightWidth}>
                        <Navigator session={session} qparams={qparams} updateSession={updateSession} />
                    </StyledColumn>
                </MpColumn>
            }
        }
    }
    return <StyledColumn width='100%'>{JSON.stringify(column, null, 4)}</StyledColumn>
}