
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
export const LayoutRes = ({ layout, res, qparams,session,updateSession }:{layout:any,res:any,qparams:Qparams,session:Options,updateSession:any}) => {
    let layres = layout[res];
    console.log("LAYRES", layres,session);
    let columns = layres.columns;
    //console.log({ columns })
    let key=0;
 
    return <VerticalWrap>
        {session.band?<HotlistWrap><Hotlist session={session} qparams={qparams} spaces={layres.spaces}/> </HotlistWrap>:null}
        <ColumnsView data-id="LayoutVIew">{columns.map((c:any) =><Column spaces={layres.spaces} key={`sdfpihww${key++}`} column={c} qparams={qparams}  session={session} updateSession={updateSession} />)}</ColumnsView></VerticalWrap>


}