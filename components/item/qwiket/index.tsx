import React, { useState, useEffect, useCallback, ReactFragment, ReactNode } from "react";
import { useRouter } from 'next/router'
import styled from 'styled-components';
import { Qparams } from '../../../lib/qparams'
import NextImage from 'next/image';
import TimeDifference from '../../../lib/timeDifference'
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { useAppContext } from "../../../lib/context";
import Link from 'next/link'
import { TwitterTweetEmbed } from 'react-twitter-embed';
import Markdown from 'markdown-to-jsx'
import Swipe from "react-easy-swipe"
import YouTube from 'react-youtube'
import StyledCheckbox from '../../widgets/checkbox';
import { accept } from '../../../lib/lakeApi'
import {Star} from '../../widgets/star'
const StarContainer=styled.div`
    margin-top:-4px;
`
interface IsTopic {
    isTopic: boolean,
    isTag?: boolean,
    diff?: number,
    singlePanel?: boolean,
    isRight?:boolean
}
const VerticalWrap = styled.div<IsTopic>`
    background:var(--background);
    border-color:${({ isTag, diff }) => (isTag && diff && (diff < 3600)) ? 'var(--qwiket-border-new) var(--qwiket-border-stale) var(--qwiket-border-new) var(--qwiket-border-new)' : isTag && diff && diff < 4 * 3600 ? 'var(--qwiket-border-recent) var(--qwiket-border-stale) var(--qwiket-border-recent) var(--qwiket-border-recent)' : 'var(--qwiket-border-stale)'};
    border-style: solid ${({ isTopic, singlePanel }) => isTopic ? singlePanel ? 'solid' : 'none' : 'solid'}  ${({ isTopic }) => isTopic ? 'none' : 'solid'}   ${({ isTopic }) => isTopic ? 'none' : 'solid'}  ;
    border-width:${({ isTopic }) => isTopic ? 1 : 1}px;
    cursor:pointer;
    padding-left:${({ isTopic }) => isTopic ? 8 : 8}px;
    padding-right:${({ isTopic }) => isTopic ? 8 : 6}px;
    padding-bottom:6px;
    width:100%;
    margin-bottom:6px;
   
    h1 {
        font-size:18px;
        font-weight:400;
    }
    blockquote {
        border-left:4px solid grey;
        padding-left:16px;
        margin-left:6px;
    }
    border-right:${({isRight})=>isRight?'solid 1px':'none'};
   
`
const Row = styled.div`
    display:flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom:4px;
    font-size:1.0rem;
    line-height:1.3;
    width:100%;
    text-overflow:ellipsis;
    overflow:hidden;
    p{
       text-overflow:ellipsis;
       overflow:hidden;
    }
    a{
        text-overflow:ellipsis;
        overflow:hidden;
     }    
`

const SiteName = styled.div<IsTopic>`
font-size:${({ isTopic }) => isTopic ? 22 : 12}px;   
margin-right:20px;
`

const Author = styled.div`
margin-top:8px;
font-size: 12px;   
margin-right:4px;
`
const AuthorPoster = styled.div`
font-size: 14px;   
`
const TimeSince = styled.div<IsTopic>`
font-size:${({ isTopic }) => isTopic ? 14 : 10}px;
margin-right:${({ isTopic }) => isTopic ? 0 : 4}px;
    
`
const Title = styled.div<IsTopic>`

    line-height: 1.2;
    font-size: ${({ isTopic }) => isTopic ? 1.6 : 1.1}rem; 
   
    text-align: left; 
    margin-top:4px;
    margin-bottom:4px; 
    width:100%;
    overflow-wrap:break-word;
`

const Description = styled.div`
    margin-bottom:2px;
`

interface ImageBoxProps {
    extraWide: boolean,
    loud: number,
    isTopic: boolean
}
const ImageBox = styled.div<ImageBoxProps>` 
    object-fit: cover;
    padding-top: 20px;
    padding-bottom:12px;
    position: relative;
    max-width: 100% !important;
    max-height: 100% !important;
    margin: 4px auto 4px auto;
    height:${({ extraWide, loud, isTopic }) => isTopic ? '440' : extraWide ? loud ? '264' : '200' : loud ? '164' : '120'}px;
    width:100%;  
    background:#000;
    opacity:${({ loud }) => (loud == 1) ? 1.0 : 0.8};
`
interface PubImageProps {
    loud: number,
    isTopic: boolean
}
const PubImage = styled.img<PubImageProps>`
    position: relative;
    margin-top: ${({ isTopic }) => isTopic ? 16 : 16}px;
    padding-top: 0px;
    margin-right: 2px;
    height:${({ isTopic }) => isTopic ? 64 : 28}px;
    width:auto;
    opacity:${({ loud, isTopic }) => (loud || isTopic) ? 1.0 : .8};
    margin-bottom: 4px;
`
const PubImageBox = styled.div`
    padding-top: 0px;
    margin-right: 16px;
    margin-bottom: 0px;
`

const Avatar = styled.img`
    //position: relative;
    max-width: 38px;
    max-height: 38px;
    //margin-top: 10px;
    padding-top: 0px;
    margin-right: 16px;  
    //margin-bottom: 10px;
`
const AvatarBox = styled.div`
    position: relative;
    max-width: 38px;
    max-height: 38px;
    margin-top: 16px;
    padding-top: 0px;
    margin-right: 16px;
    margin-bottom: 10px;
    width:48px;
    height:48px;
`
const Body = styled.div`
    width:100%; 
   
`
const Right = styled.div`
    padding-top:4px;
    height:auot;
    display:flex;
    justify-content:space-between;
`

const Comment = styled.div`
    font-size:10px;
    font-weight: 700;
    border:solid grey 1px;
    padding:1px 3px 1px 3px;
    margin:1px 16px 1px 3px;
   
`
const TweetEmbedContainer = styled.div`
    width:100%;
    position:relative;
    margin-top:20px;
    margin-bottom:20px;
    `
const TweetEmbed = styled.div`
    margin-left:auto;
    margin-right:auto;
    max-width:540px;
`
const Disclaimer = styled.div`
    color:white;
    background:#4444ff;
    padding:20px;
`
const CheckboxContainer=styled.div`
margin:20px;
`
const ButtonContainer=styled.div`
position:relative;
display:flex;
justify-content:space-around;
padding:20px;
margin-top:40px;
`
const Button=styled.div`
width:160px;
height:40px;
line-height:40px;
color:#fff;
vertical-align: middle;
background:green;
cursor:pointer;
text-align: center;
`
const DisclaimerTitle=styled.div`
text-align:center;
`
const DisclaimerLogoContainer=styled.div`
position:absolute;
margin-top:-6px;
margin-left:60px;
`
const Qwiket = ({ extraWide, isRight,item, isTopic, qType, singlePanel, fullPage,mutate,setAckOverride }: { extraWide: boolean, isRight:boolean,item: any, isTopic: boolean, qType?: string, singlePanel?: boolean, fullPage?: boolean,mutate?:any,setAckOverride?:any }) => {


    const [openDialog,setOpenDialog]=useState(false);
    const [checkedAckTag,setCheckedAckTag]=useState(false);
    const [checkedAckAll,setCheckedAckAll]=useState(false);
    const isTag = qType == 'tag';
    //console.log("Qwiket render ", singlePanel, isTopic, qType, isTag)
    const router = useRouter();
    const { session, qparams,newsline,channelDetails } = useAppContext();
    const isReact = item && typeof item.qpostid !== 'undefined' && item.qpostid;
    let { description, title } = item ? item : { description: '', title: '' };
    //  console.log("Qwiket", {loud:session.loud,extraWide})
    const homeLink = `/${qparams.forum}/home/${qparams.tag}`;
    const itemUrl = item.url ? item.url : '';
    const hasUser=session.userslug;
    // console.log("homeLink",homeLink,item.url,item)
    const blur = 'https://ucarecdn.com/d26e44d9-5ca8-4823-9450-47a60e3287c6/al90.png';
    if (isTopic) {
        let { catIcon, catName, tag, image, site_name, published_time, author, body,hasBody,slug }:
            { catIcon: string, catName: string, tag: string, image: string, site_name: string, published_time: number, author: string, slug: string, body: any, hasBody?: boolean, ack?: boolean } =
            item ? item : { catIcon: '', catName: '', tag: '', image: '', site_name: '', published_time: '', author: '', body: '' };

        // console.log("QWIKET:", { catIcon, catName, tag, image, site_name, published_time, author, body })
        if (!image)
            image = blur;
        if (!catIcon)
            catIcon = blur;
        if (catName?.indexOf('Liberty Daily') >= 0) {
            catIcon = blur;
        }

        if (!title)
            title = 'Loading...';
        const { diff, timeString } = TimeDifference(published_time, qparams.timestamp)
        let bodyHtml: string = '';
        interface BodyBlock {
            type: string;
            content: string;
            id?: string;
        }
        let bodyBlocks: Array<ReactNode> | null = null;
        let AckBlock:ReactNode=null;
        if (body) {
            /* const blocks = body.blocks;
             bodyHtml = blocks.reduce((accum: string, b: any) => {
                 console.log("reduce:", b, accum)
                 if (b.blockType == 'html') {
                     return accum += b.html;
                 }
             }, '')
             */
            bodyBlocks = body.map((b: BodyBlock) => {

                return (b.type == "twitter" && b.id) ? <TweetEmbedContainer><TweetEmbed><TwitterTweetEmbed tweetId={b.id} placeholder="Loading a Tweet..." /*options={{theme:session.dark?'dark':'light'}}*/ /></TweetEmbed></TweetEmbedContainer> : <ReactMarkdown rehypePlugins={[rehypeRaw]} >{b.content}</ReactMarkdown>
            })

        }
        if(!body&&hasBody){
            const ackAndFetch=async()=>{
                if(checkedAckAll)
                    await accept({sessionid:session.sessionid,userslug:session.userslug,tag:'all'});
                else if(checkedAckTag)
                    await accept({sessionid:session.sessionid,userslug:session.userslug,tag});
                else
                    setAckOverride(slug);
                setTimeout(()=>mutate(),300);        
            }
            const Check = ({ label, checked, onChange,disabled }: { label: string, checked: boolean, disabled?:boolean,onChange: any }) => {
                console.log("disabled:",disabled)
                return <StyledCheckbox
                  onClick={() => onChange(disabled?false:!checked)}
                  label={label}
                >
                  <input
                    type="checkbox"
                    name={label}
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled?true:false}
                  />
                  <label htmlFor={label}>{label}</label>
                </StyledCheckbox>
              }
              const AckTag = () => {
                return <Check label='Use Body Snatcher (tm) for all articles in this feed' 
                checked={checkedAckTag} 
                onChange={(checked: boolean) => {
                  setCheckedAckTag(checked);
                }} />
              }
              const AckAll = () => {
              
                return <Check  label={`Use Body Snatacher (tm) for all articles. ${session.userslug?'':'Log-in to use this feature'}`} 
                  checked={checkedAckAll} 
                  disabled={!hasUser}
                  onChange={(checked: boolean) => {
                  setCheckedAckAll(checked);
                }} />
              }
            AckBlock=<div>
             {openDialog?<div >
                <Disclaimer>
                   <DisclaimerLogoContainer><NextImage src={channelDetails.logo} alt="logo" width={42} height={42}/> </DisclaimerLogoContainer>
                   <DisclaimerTitle>{newsline.displayName}</DisclaimerTitle>
                    <DisclaimerTitle>BODY SNATCHER</DisclaimerTitle>
                    <p>Body Snatcher is an online tool designed to facilitate user's access to the content of the article for the purpose of commenting on it.</p>
                <p>To use the Body Snatcher tool to access the full body of the article, click the button below. The tool is provided solely for the convinience of our users while commenting on the article they've already accessed on the target website. </p>
                <p>By clicking this button, you certify that you have the legal right to view the content on the target website.
                </p>
                <p>
                    It is your sole responsibility to respect the intellectual property of the owner of the content. 
                </p>
                <CheckboxContainer>
                <AckTag/>
                </CheckboxContainer>
                <CheckboxContainer>
                <AckAll/> 
                </CheckboxContainer>
               
                <ButtonContainer>
                    <Button onClick={async ()=>{setOpenDialog(false);await ackAndFetch()}}>Snatch Article Body</Button>
                </ButtonContainer>
                </Disclaimer>
                </div>:<a onClick={()=>setOpenDialog(true)}>See more....</a>}
            </div>
        }
        //bodyHtml=bodyHtml?.replaceAll('twittertweetembed','TwitterTweetEmbed');
        // bodyHtml=bodyHtml?.replaceAll('youtubeembed','YoutubeEmbed');
        //if(bodyHtml)
        //bodyHtml=`<div>${bodyHtml}</div>`
        //  bodyHtml=bodyHtml?.replaceAll('iframe','Iframe');

        // console.log("checking for code tag",bodyHtml?.indexOf('<code>'));

        //console.log("BODY:", body)
        //console.log(JSON.stringify({ isTopic, singlePanel }))

        const swipe = (position: any, event: any, type: string) => {
            console.log("swipe", position, event, type);
            if (position.x > 15 && position.y < 5 && position.y > -5) {
                console.log("RIGHT SWIPE")
                router.push(item.url);
                //rotate(type, 1)
            }
            if (position.x < -15 && position.y < 5 && position.y > -5) {
                console.log("LEFT SWIPE")
                router.back();
            }
        }
        /* return <Swipe onSwipeMove={(position, event) => swipe(position, event, qparams.type)}><VerticalWrap isTopic={isTopic} singlePanel={singlePanel} >
             <Row key="r1"><Link href={homeLink} legacyBehavior><a rel="nofollow"><PubImageBox><PubImage loud={session.loud} isTopic={isTopic} placeholder={"blur"} sizes="(max-width: 768px) 100vw,
               (max-width: 2200px) 50vw, 33vw"      src={catIcon} alt={catName} /></PubImageBox></a></Link>
                 <Right><Link href={homeLink} legacyBehavior><a rel="nofollow"><SiteName isTopic={isTopic}>{site_name}</SiteName></a></Link><TimeSince isTopic={isTopic}>{timeString}</TimeSince></Right></Row>
             {author ? <Row>{author}</Row> : null}
             <Row key="r2"><Link href={item.url} legacyBehavior><a rel="nofollow"><Title isTopic={isTopic}>{title}</Title></a></Link></Row>
             <Row key="3.1"><Link href={item.url} legacyBehavior><a rel="nofollow">{item.url}</a></Link></Row>
             <Row key="r3"><ImageBox isTopic={isTopic} loud={session.loud} extraWide={extraWide}><NextImage sizes="(max-width: 768px) 100vw,
               (max-width: 2200px) 50vw, 33vw"  placeholder={"blur"} blurDataURL={blur} style={{ objectFit: "cover" }} data-id={"NexuImg"} src={image} alt={"NextImg:" + title} fill={true} /></ImageBox></Row>
           
             <Row key="r4"><Body>{bodyBlocks ? bodyBlocks : <ReactMarkdown rehypePlugins={[rehypeRaw]} >{bodyHtml ? bodyHtml : description}</ReactMarkdown>}</Body></Row>
 
         </VerticalWrap></Swipe>*/
        return <VerticalWrap isTopic={isTopic} singlePanel={singlePanel} >
            <Row key="r1"><Link href={homeLink} legacyBehavior><a rel="nofollow"><PubImageBox><PubImage loud={session.loud} isTopic={isTopic} placeholder={"blur"} sizes="(max-width: 768px) 100vw,
           (max-width: 2200px) 50vw, 33vw"      src={catIcon} alt={catName} /></PubImageBox></a></Link>
                <Right><Link href={homeLink} legacyBehavior><a rel="nofollow"><SiteName isTopic={isTopic}>{site_name}</SiteName></a></Link><TimeSince isTopic={isTopic}>{timeString}</TimeSince></Right></Row>
            {author ? <Row>{author}</Row> : null}
            <Row key="r2"><Link href={itemUrl} legacyBehavior><a rel="nofollow"><Title isTopic={isTopic}>{title}</Title></a></Link></Row>
            <Row key="3.1"><Link href={itemUrl} legacyBehavior><a rel="nofollow">{item.url}</a></Link></Row>
            <Row key="r3"><ImageBox isTopic={isTopic} loud={session.loud} extraWide={extraWide}><NextImage sizes="(max-width: 768px) 100vw,
           (max-width: 2200px) 50vw, 33vw"  placeholder={"blur"} blurDataURL={blur} style={{ objectFit: "cover" }} data-id={"NexuImg"} src={image} alt={"NextImg:" + title} fill={true} /></ImageBox></Row>

            <Row key="r4"><Body>{bodyBlocks ? bodyBlocks : <ReactMarkdown rehypePlugins={[rehypeRaw]} >{bodyHtml ? bodyHtml : description}</ReactMarkdown>}</Body></Row>
            {AckBlock}
           
        </VerticalWrap>


    }
    else if (isReact) {
        let { id, author_avatar, tag, catName, catIcon, author_name, postBody, subscr_status, createdat, thread_author, thread_title, thread_description, thread_url, slug } = item;
        //console.log("React: subscr_status",subscr_status)
        // if (id)
        //     console.log("disqus id:", id)
        const { diff, timeString } = TimeDifference(createdat, qparams.timestamp)
        /*  return <Link href={`/${qparams.forum}/topic/${tag}/${slug}/${qparams.layoutNumber}/${id}/#comment-${id}`} legacyBehavior><a rel="nofollow"><VerticalWrap isTopic={isTopic}>
              <Row key="r1"><PubImageBox><PubImage isTopic={isTopic} loud={session.loud} sizes="(max-width: 768px) 100vw,
                (max-width: 2200px) 50vw, 33vw"      placeholder={"blur"} src={catIcon} alt={catName} width={28} height={28} /></PubImageBox>
                  {qType == 'mix' ? <Comment>comment</Comment> : null}<Author>{thread_author ? thread_author : catName}</Author></Row>
              <Row key="r2"><Title isTopic={isTopic}>{thread_title}</Title></Row>
              <Row key="r3"><Description><Markdown>{description}</Markdown></Description></Row>
              <Row key="r4"><AvatarBox><NextImage placeholder={"blur"} blurDataURL={blur} src={author_avatar.indexOf('http') < 0 ? `https:${author_avatar}` : author_avatar} alt={author_name} fill={true} /></AvatarBox><AuthorPoster>{author_name}</AuthorPoster>
                  <TimeSince isTopic={isTopic}>{timeString}</TimeSince></Row>
              <Row key="r5"><Markdown>{`<div style="width:100%;">${postBody}</div>`}</Markdown></Row>
  
          </VerticalWrap></a></Link>*/
        return <Link href={`/${qparams.forum}/topic/${tag}/${slug}/${qparams.layoutNumber}/${id}/#comment-${id}`} legacyBehavior><a rel="nofollow">
            <VerticalWrap isTopic={isTopic} isRight={isRight}>
            <Row key="r1"><PubImageBox><PubImage isTopic={isTopic} loud={session.loud} sizes="(max-width: 768px) 100vw,
          (max-width: 2200px) 50vw, 33vw"      placeholder={"blur"} src={catIcon} alt={catName} width={28} height={28} /></PubImageBox>
                {qType == 'mix' ? <Comment>comment</Comment> : null}<Author>{thread_author ? thread_author : catName}</Author></Row>
            <Row key="r2"><Title isTopic={isTopic}>{thread_title}</Title></Row>
            <Row key="r3"><Description><Markdown>{description}</Markdown></Description></Row>
            <Row key="r4"><AvatarBox><Avatar placeholder={"blur"} src={author_avatar.indexOf('http') < 0 ? `https:${author_avatar}` : author_avatar} alt={author_name} /></AvatarBox>
            <AuthorPoster>{author_name}</AuthorPoster>
            <StarContainer><Star level={subscr_status} size={16}/></StarContainer> 
            <TimeSince isTopic={isTopic}>{timeString}</TimeSince></Row>
            <Row key="r5"><Markdown>{`<div style="width:100%;">${postBody}</div>`}</Markdown></Row>

        </VerticalWrap></a></Link>
    }
    else {
        let { catIcon, catName, tag, image, site_name, published_time, author, slug }: { catIcon: string, catName: string, tag: string, image: string, site_name: string, published_time: number, author: string, slug: string } = item;
        if (catName?.indexOf('Liberty Daily') >= 0) {
            catIcon = blur;
        }
        const { diff, timeString } = TimeDifference(published_time, qparams.timestamp);
        //  console.log("Render Qwuket", item.catIcon,item.image,item.title)
        /* if (!item.catIcon) {
             console.log("********************************************************************************************************")
         }*/
        // console.log("qwiket render 2 istag", isTag, 'diff:', diff)
        if (slug == 'loading') {
            return <Link href={`/${qparams.forum}/topic/${tag}/${slug}${qparams.layoutNumber != 'l1' ? '/' + qparams.layoutNumber : ''}`} legacyBehavior><a rel="nofollow"><VerticalWrap isTopic={isTopic}>
                <Row key="r1"><PubImageBox><PubImage isTopic={isTopic} loud={session.loud} sizes="(max-width: 768px) 100vw,
              (max-width: 2200px) 50vw, 33vw"     placeholder={"blur"} src={blur} alt={'America First News'} /></PubImageBox>
                    <Right><SiteName isTopic={isTopic}>©{'am1.news'}</SiteName><TimeSince isTopic={isTopic}>{0}</TimeSince></Right></Row>
                {author ? <Row>{author}</Row> : null}
                <Row key="r2"><Title isTopic={isTopic}>{title}</Title></Row>
                <Row key="r3"><Markdown  >{'The Internet of Us'}</Markdown></Row>
                <Row key="r4" ><ImageBox isTopic={isTopic} loud={session.loud} extraWide={extraWide}><NextImage placeholder={"blur"} blurDataURL={blur} style={{ objectFit: "cover" }} data-id={"NexuImg"} src={image} alt={"NextImg:" + title} fill={true} /></ImageBox></Row>

            </VerticalWrap></a></Link>
        }
        // console.log ("qwiketLink",`/${qparams.forum}/topic/${tag}/${slug}${qparams.layoutNumber!='l1'?'/'+qparams.layoutNumber:''}`);
        return <Link href={`/${qparams.forum}/topic/${tag}/${slug}${qparams.layoutNumber != 'l1' ? '/' + qparams.layoutNumber : ''}`} legacyBehavior><a rel="nofollow">
            <VerticalWrap isTopic={isTopic} isTag={isTag} diff={diff} isRight={isRight}>
            <Row key="r1"><PubImageBox><PubImage isTopic={isTopic} loud={session.loud} style={{ height: '38', width: 'auto' }} sizes="(max-width: 768px) 100vw,
              (max-width: 2200px) 50vw, 33vw"       placeholder={"blur"} src={catIcon} alt={catName} /></PubImageBox>
                <Right><SiteName isTopic={isTopic}>©{site_name}</SiteName><TimeSince isTopic={isTopic}>{timeString}</TimeSince></Right> </Row>
            {author ? <Row>{author}</Row> : null}
            <Row key="r2"><Title isTopic={isTopic}>{title}</Title></Row>
            <Row key="r3"><Markdown  >{description}</Markdown></Row>
            <Row key="r4"><ImageBox isTopic={isTopic} loud={session.loud} extraWide={extraWide}><NextImage placeholder={"blur"} blurDataURL={blur} style={{ maxWidth: "100%", height: "100%", objectFit: "cover" }} data-id={"NexuImg"} src={image} alt={"NextImg:" + title} fill={true} /></ImageBox></Row>

        </VerticalWrap></a></Link>
    }


}
export default Qwiket;