
import React from 'react';
import styled from 'styled-components';
import {Column} from './column';
import Hotlist from '../qwikets/hotlist';
let VerticalWrap=styled.div`
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
export const LayoutRes = ({ layout, res, qparams,session,updateSession }) => {
    let layres = layout[res];
    console.log("LAYRES", layres);
    let columns = layres.columns;
    //console.log({ columns })
    let key=0;
    let cols = columns.map(c => {
        // console.log("column", res, c)
        return  <Column key={`sdfpihww${key++}`} column={c} qparams={qparams}  session={session} updateSession={updateSession} />
    })
  
    // <div>{JSON.stringify(layres, null, 4)}</div>
    return <VerticalWrap>
        {session.band?<HotlistWrap><Hotlist session={session} qparams={qparams} spaces={layres.spaces}/> </HotlistWrap>:null}
        <ColumnsView data-id="LayoutVIew">{cols}</ColumnsView></VerticalWrap>


}