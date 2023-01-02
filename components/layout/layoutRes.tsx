
import React from 'react';
import styled from 'styled-components';
import {Column} from './column'
let View = styled.div`
width:100%;
display:flex;

`
export const LayoutRes = ({ layout, res, qparams,session }) => {
    let layres = layout[res];
    //console.log("LAYRES", layres);
    let columns = layres.columns;
    //console.log({ columns })
    let key=0;
    let cols = columns.map(c => {
        // console.log("column", res, c)
        return  <Column key={`sdfpihww${key++}`} column={c} qparams={qparams}  session={session}/>
    })
  
    // <div>{JSON.stringify(layres, null, 4)}</div>
    return <View>{cols}</View>


}