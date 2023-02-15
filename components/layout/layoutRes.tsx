
import React from 'react';
import styled from 'styled-components';
import {Column} from './column';
import Hotlist from '../qwikets/hotlist';
import { Qparams } from '../../lib/qparams';
import { Options } from '../../lib/withSession';
let VerticalWrap=styled.div`
width:100%;
`
let HotlistWrap=styled.div`
width:100%;
display:flex;
justify-content:space-between;   
`


let ColumnsView = styled.div`
width:100%;
display:flex;
justify-content:space-between;
`
export const LayoutRes = ({ layout, res, qparams,session,...props }:{pageType:string,visible:boolean,card:string,layout:any,res:any,qparams:Qparams,session:Options,updateSession:any,channelDetails:any,qCache:any,setQCache:any}) => {
    let layres = layout[res];
   //console.log("layoutview LAYRES",res, layres,session);
    let columns = layres.columns;
  //  console.log('layoutview:',{ columns })
    let key=0;
 
    return <VerticalWrap>
        {session.band&&res!="w000"?<HotlistWrap><Hotlist session={session} qparams={qparams} spaces={layres.spaces}/> </HotlistWrap>:null}
        <ColumnsView data-id="LayoutVIew">{columns.map((c:any,index:number) =><Column key={`column-${index}`} isLeft={index==0} spaces={layres.spaces} column={c} qparams={qparams}  session={session} {...props} />)}</ColumnsView></VerticalWrap>
}