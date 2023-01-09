import React from 'react';
import styled from 'styled-components';
import { Qparams } from '../../lib/qparams';
import { Options } from '../../lib/withSession'
import Queue from '../qwikets/queue';
import Navigator from '../navigator';

const QwiketItem = () => <div>QwiketItem</div>
const Tag = () => <div>Tag</div>
//const Queue=()=><div>Queue</div>
const Topic = () => <div>Topic</div>

const StyledColumn = styled.div`
width:${props => props.width};
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
const MpColumn = styled.div`
width:${props => props.width};
display:flex;
`
/*
const listRenderer = ({ qparams, rows, tag, ...rest }) => {
    return <InnerStyledColumn data-id="inner-styled-column" className="q-column">{rows}</InnerStyledColumn>
}
*/
export const Column = ({ column, qparams, session }: { column: any, qparams: Qparams, session: Options }) => {
    let width = column.percentWidth;

    let type = column.type;
    let selector = column.selector;
    let msc = column.msc;
   // console.log("**************************************Column:", selector, type, msc)
    if (type == 'stc') {
        switch (selector) {

            case 'newsviews':
                selector = 'mix';
            case 'newsline':
            case 'reacts':
            case 'topics': {
                console.log(`Column>>>: ${selector}`)
                /*  const renderer = ({ item, index, x, y, tag, qparams, channel }) => {
                      //const [ref, setRef] = useState(false);
                      //  console.log("RENDERER:", item)
      
      
                      return <QwiketItem columnType={tag} topic={item} channel={channel} qparams={qparams} forceShow={false} approver={false} test={false} />
                  }*/
                return <StyledColumn width={width} data-id="styled-column"><Queue  extraWide={false} qType={selector} qparams={qparams} session={session} /></StyledColumn>
            }
            case 'feed': {
                console.log("Column:feed")
                /* const renderer = ({ item, index, x, y, tag, qparams, channel }) => {
                     //const [ref, setRef] = useState(false);
                     //  console.log("RENDERER:", item)
     
     
                     return <QwiketItem columnType={tag} topic={item} channel={channel} qparams={qparams} forceShow={false} approver={false} test={false} />
                 }*/
                return <Queue  extraWide={false} qType={selector} qparams={qparams} session={session} />
            }
            case "topic": {
               // console.log("Column:topic")

                //console.log("Column:feed")
                const renderer = ({ item, index, x, y, tag, qparams, channel }) => {
                    //const [ref, setRef] = useState(false);
                    //  console.log("RENDERER:", item)


                    return <QwiketItem data-id="qwiket-item" columnType={tag} topic={item} channel={channel} qparams={qparams} forceShow={false} approver={false} test={false} />
                }
                return <StyledColumn data-id="styled-column">
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
            }
        }
    }
    else {
        if (type == 'mp') {
          
            let leftWidth, rightWidth;
            leftWidth = '61.8%';
            rightWidth = '38.2%';
            return <MpColumn width={width} data-id="mp-column">
                <StyledColumn width={leftWidth}>
                    <Queue extraWide={true} qType={selector} qparams={qparams} session={session} />
                </StyledColumn>
                <StyledColumn width={rightWidth}>
                    <Navigator session={session} qparams={qparams} />
                </StyledColumn>
            </MpColumn>
        }
    }
    return <StyledColumn>{JSON.stringify(column, null, 4)}</StyledColumn>
}