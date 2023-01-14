import React, { useState, useEffect, useCallback } from "react";
import styled from 'styled-components';
import { Qparams } from '../../lib/qparams'
import NextImage from 'next/image';
import TimeDifference from '../../lib/timeDifference'
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { useAppContext } from "../../lib/context";
import Link from 'next/link'

interface IsTopic{
    isTopic:boolean
}
const VerticalWrap = styled.div<IsTopic>`
    border-color: grey;
    border-style: solid;
    border-width:${({isTopic})=>isTopic?0:1}px;
    cursor:pointer;
    padding-left:${({isTopic})=>isTopic?16:6}px;
    padding-right:${({isTopic})=>isTopic?16:6}px;
    padding-bottom:6px;
    width:100%;
margin-bottom:6px;
`
const Row = styled.div`
    display:flex;
    padding-left:6px;
    padding-right:16px;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    padding: 0px;
    position:relative;
`
const SiteName = styled.div`
font-size: 12px;   
`

const Author = styled.div`
font-size: 12px;   
`
const AuthorPoster = styled.div`
font-size: 14px;   
`
const TimeSince = styled.div`
font-size:10px;
    
`
const Title = styled.div`
    
    //font-weight:500;
    line-height: 1.2;
    font-size: 1.2rem; 
   
    text-align: left; 
    margin-top:10px;
    margin-bottom:10px;
   
`
const Description = styled.div`
    
    //font-weight:500;
   
    margin-bottom:16px;
   
`
const Image = styled.img`
   
    object-fit: cover;
    padding-top: 20px;
    padding-bottom:12px;
    position: relative;
    max-width: 100% !important;
    margin-left: auto;
    margin-right: auto;               
`
interface ImageBoxProps {
   extraWide:boolean,
   loud:number,
   isTopic:boolean
  }
const ImageBox = styled.div<ImageBoxProps>`
   
    object-fit: cover;
    padding-top: 20px;
    padding-bottom:12px;
    position: relative;
    max-width: 100% !important;
    max-height: 100% !important;
    margin-left: auto;
    margin-right: auto;
    height:${({extraWide,loud,isTopic}) => isTopic?'440':extraWide ? loud?'264':'200' : loud?'164':'120'}px;
    width:100%;  
    background:#000;
    opacity:${({loud})=>(loud==1)?1.0:0.8};
`
const PubImage = styled.img`
    position: relative;
    max-height: 28px;
    margin-top: 10px;
    padding-top: 0px;
    margin-right: 16px;
   
    margin-bottom: 10px;
`
const PubImageBox = styled.div`
    position: relative;
    object-fit: cover;
    margin-top: 10px;
    padding-top: 0px;
    margin-right: 16px;
   
    margin-bottom: 10px;
    height:28px;
    width:28px;  
`
const Avatar = styled.img`
    position: relative;
    max-width: 38px;
    max-height: 38px;
    margin-top: 10px;
    padding-top: 0px;
    margin-right: 16px;
   
    margin-bottom: 10px;
`
const AvatarBox = styled.div`
    position: relative;
    max-width: 38px;
    max-height: 38px;
    margin-top: 10px;
    padding-top: 0px;
    margin-right: 16px;
   
    margin-bottom: 10px;
    width:48px;
    height:48px;
`
const Body=styled.div`
    width:100%;
   
    
`
const Qwiket = ({ extraWide, item, isTopic }: { extraWide: boolean,  item: any, isTopic: boolean }) => {
   
    const {session, qparams}=useAppContext();
    const isReact = item&&typeof item.qpostid !== 'undefined'&&item.qpostid;
    let { description, title } = item?item:{description:'',title:''};
 //   console.log("Qwiket", {loud:session.loud,extraWide})
    if(isTopic){
        let { catIcon, catName, tag, image, site_name, published_time, author,body } = item?item:{catIcon:'',catName:'',tag:'',image:'',site_name:'',published_time:'',author:'',body:''};
        if(!image)
        image='https://qwiket.com/static/css/afnLogo.png';
        if(!catIcon)
        catIcon='https://qwiket.com/static/css/afnLogo.png';
        if(!title)
        title='Loading...';
        const diff = TimeDifference(published_time, qparams.timestamp)
        let bodyHtml;
        if(body){
            const blocks=body.blocks;
            bodyHtml=blocks.reduce((accum:string,b:any)=>{
                console.log("reduce:", b,accum)
                if(b.blockType=='html'){
                    return accum+=b.html;
                }
            },'')
        }
       
       // console.log("BODY:",bodyHtml)
       // console.log("checking for code tag",bodyHtml?.indexOf('<code>'));
        return <VerticalWrap isTopic={isTopic}>
            <Row><PubImageBox><NextImage placeholder={"blur"} blurDataURL={'https://qwiket.com/static/css/afnLogo.png'} src={catIcon} alt={catName} fill={true} /></PubImageBox><SiteName>©{site_name}</SiteName><TimeSince>{diff}</TimeSince></Row>
            {author ? <Row>{author}</Row> : null}
            <Row><Title>{title}</Title></Row>
            <Row><ImageBox isTopic={isTopic} loud={session.loud} extraWide={extraWide}><NextImage placeholder={"blur"} blurDataURL={'https://qwiket.com/static/css/afnLogo.png'} style={{ objectFit: "cover" }} data-id={"NexuImg"} src={image} alt={"NextImg:" + title} fill={true} /></ImageBox></Row>

            <Row><Body><ReactMarkdown rehypePlugins={[rehypeRaw]} >{bodyHtml?bodyHtml:description}</ReactMarkdown></Body></Row>
           
        </VerticalWrap>
        return <div/>

    }
    else if (isReact) {
        let { author_avatar, tag, catName, catIcon, author_name,  postBody,subscr_status,createdat, thread_author, thread_title, thread_description, thread_url, slug } = item;
       // console.log("React ",item)
   
        const diff = TimeDifference(createdat, qparams.timestamp)
        return <Link href={`/${qparams.forum}/topic/${tag}/${slug}/${qparams.layoutNumber}/na`}><VerticalWrap isTopic={isTopic}>
            <Row><PubImageBox><NextImage placeholder={"blur"} blurDataURL={'https://qwiket.com/static/css/afnLogo.png'} src={catIcon} alt={catName} fill={true} /></PubImageBox><Author>{thread_author ? thread_author + ", " + catName : catName}</Author></Row>
            <Row><Title>{thread_title}</Title></Row>
            <Row><Description><ReactMarkdown rehypePlugins={[rehypeRaw]} >{description}</ReactMarkdown></Description></Row>
            <Row><AvatarBox><NextImage placeholder={"blur"} blurDataURL={'https://qwiket.com/static/css/afnLogo.png'} src={author_avatar.indexOf('http') < 0 ? `https:${author_avatar}` : author_avatar} alt={author_name} fill={true} /></AvatarBox><AuthorPoster>{author_name}</AuthorPoster><TimeSince>{diff}</TimeSince></Row>
            <Row><ReactMarkdown rehypePlugins={[rehypeRaw]} >{postBody}</ReactMarkdown></Row>

        </VerticalWrap></Link>
    }
    else {
        let { catIcon, catName, tag, image, site_name, published_time, author,slug } = item;
        const diff = TimeDifference(published_time, qparams.timestamp);
      //  console.log("Render Qwuket", item.catIcon,item.image,item.title)
        if(!item.catIcon){
            console.log("********************************************************************************************************")
        }
        return <Link href={`/${qparams.forum}/topic/${tag}/${slug}/${qparams.layoutNumber}/na`}><VerticalWrap isTopic={isTopic}>
            <Row><PubImageBox><NextImage placeholder={"blur"} blurDataURL={'https://qwiket.com/static/css/afnLogo.png'} src={catIcon} alt={catName} fill={true} /></PubImageBox><SiteName>©{site_name}</SiteName><TimeSince>{diff}</TimeSince></Row>
            {author ? <Row>{author}</Row> : null}
            <Row><Title>{title}</Title></Row>
            <Row><ReactMarkdown rehypePlugins={[rehypeRaw]} >{description}</ReactMarkdown></Row>
            <Row><ImageBox  isTopic={isTopic} loud={session.loud} extraWide={extraWide}><NextImage placeholder={"blur"} blurDataURL={'https://qwiket.com/static/css/afnLogo.png'} style={{ objectFit: "cover" }} data-id={"NexuImg"} src={image} alt={"NextImg:" + title} fill={true} /></ImageBox></Row>

        </VerticalWrap></Link>
    }


}
export default Qwiket;