import React, { useState,useEffect,useRef } from 'react'
import styled from 'styled-components';
import { DiscussionEmbed } from 'disqus-react';
import {TwitterTimelineEmbed} from "react-twitter-embed";
import { useAppContext } from '../lib/context'

interface DisqusParams{
  fullPage:boolean
}
const Disqus = styled.div<DisqusParams>`
    color:var(--text);
    background-color: var(--background);
    margin:${({fullPage})=>fullPage?4:16}px;
    #disqus_thread a{
          color:var(--text);        
				
    }
    #disqus_thread div{
        font-family:roboto;
    }   
`
const CommentsButton=styled.div`
  width:auto;
  padding:4px;
  border:solid grey 1px;
  background-color: var(--notificationButton);
  color:#eee;

`
const CommentsButtonWrap=styled.div`
  width:100%;
  display:flex;
  justify-content: space-around;

`
const Twitter = () => {
    const { session, qparams,newsline } = useAppContext();
    const ref=useRef(null);
   /*useEffect(() => {
        window.twttr.widgets.load(ref.current);
      }, []);*/

    const url:string=newsline.twitter;
    const theme=session.dark;
    console.log("render Twitter embed",url)
    
 
    return <div  ref={ref}><TwitterTimelineEmbed   
        sourceType="url"
        url={url}
        //noHeader
        theme={theme==1?"dark":"light"} /></div>
}
export default Twitter;
