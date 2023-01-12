import React, { useState, useEffect, useCallback } from "react";
import styled from 'styled-components';
import { Qparams } from '../../lib/qparams'
import NextImage from 'next/image';
import TimeDifference from '../../lib/timeDifference'
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import {Options} from '../../lib/withSession';
const VerticalWrap = styled.div`
    border-color: grey;
    border-style: solid;
    border-width:1px;
    cursor:pointer;
    padding-left:6px;
    padding-right:6px;
    padding-bottom:6px;
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
   extraWide:boolean
  }
const ImageBox = styled.div<ImageBoxProps>`
   
    object-fit: cover;
    padding-top: 20px;
    padding-bottom:12px;
    position: relative;
    max-width: 100% !important;
    margin-left: auto;
    margin-right: auto;
    height:${({extraWide}) => extraWide ? '264' : '164'}px;
    width:100%;  
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
const Qwiket = ({ extraWide, session, qparams, item, isTopic }: { extraWide: boolean, session: Options, qparams: Qparams, item: any, isTopic: boolean }) => {
    const isReact = typeof item.qpostid !== 'undefined';
    let { description, title } = item;
   // console.log("Qwiket", {extraWide})

    if (isReact) {
        let { author_avatar, category, cat_name, cat_icon, author_name, id, body, published_time, subscr_status, status, createdat, thread_author, thread_title, thread_description, thread_url, threadid } = item;

        const diff = TimeDifference(createdat, qparams.timestamp)
        return <VerticalWrap>
            <Row><PubImageBox><NextImage placeholder={"blur"} blurDataURL={'https://qwiket.com/static/css/afnLogo.png'} src={cat_icon} alt={cat_name} fill={true} /></PubImageBox><Author>{thread_author ? thread_author + ", " + cat_name : cat_name}</Author></Row>
            <Row><Title>{thread_title}</Title></Row>
            <Row><Description><ReactMarkdown rehypePlugins={[rehypeRaw]} >{description}</ReactMarkdown></Description></Row>
            <Row><AvatarBox><NextImage placeholder={"blur"} blurDataURL={'https://qwiket.com/static/css/afnLogo.png'} src={author_avatar.indexOf('http') < 0 ? `https:${author_avatar}` : author_avatar} alt={author_name} fill={true} /></AvatarBox><AuthorPoster>{author_name}</AuthorPoster><TimeSince>{diff}</TimeSince></Row>
            <Row><ReactMarkdown rehypePlugins={[rehypeRaw]} >{body}</ReactMarkdown></Row>

        </VerticalWrap>
    }
    else {
        let { catIcon, catName, cat, image, site_name, published_time, author } = item;
        const diff = TimeDifference(published_time, qparams.timestamp)
        return <VerticalWrap>
            <Row><PubImageBox><NextImage placeholder={"blur"} blurDataURL={'https://qwiket.com/static/css/afnLogo.png'} src={catIcon} alt={catName} fill={true} /></PubImageBox><SiteName>©{site_name}</SiteName><TimeSince>{diff}</TimeSince></Row>
            {author ? <Row>{author}</Row> : null}
            <Row><Title>{title}</Title></Row>
            <Row><ReactMarkdown rehypePlugins={[rehypeRaw]} >{description}</ReactMarkdown></Row>
            <Row><ImageBox extraWide={extraWide}><NextImage placeholder={"blur"} blurDataURL={'https://qwiket.com/static/css/afnLogo.png'} style={{ objectFit: "cover" }} data-id={"NexuImg"} src={image} alt={"NextImg:" + title} fill={true} /></ImageBox></Row>

        </VerticalWrap>
    }


}
export default Qwiket;