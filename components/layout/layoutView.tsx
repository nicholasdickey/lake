import React from 'react';
import styled from 'styled-components';
import { LayoutRes } from './layoutRes'
import getLayoutWidth from '../../lib/layoutWidth'

const OuterWrapper = styled.div`width:100%;`;
const W000 = styled.div`
      //  display:none;
        width:100%;
        @media only screen  and (min-width:1px) and (max-width:899px){
            display:flex;
        }
    `;
const W900 = styled.div`
      //  display:none;
        width:100%;
        @media  only screen and (min-width:900px) and (max-width:1199px){
            display:flex;
        }
    `;
const W1200 = styled.div`
       // display:none;
        width:100%;
        @media  only screen and (min-width:1200px) and (max-width:1799px){
            display:flex;
        }
    `;
const W1800 = styled.div`
        width:100%;
     //  display:none;
        @media  only screen and (min-width:1800px) and (max-width:2099px){
            display:flex;
        }
    `
const W2100 = styled.div`
        width:100%;
       // display:none;
        @media  only screen and  (min-width:2100px) {
            display:flex;
        }
    `
export const LayoutView = ({ session, pageType, layout,  qparams }) => {
   // console.log("LAYOUT_VIEW:", layout);
    let layoutView = layout.layoutView;
    let columns = layout.columns;
   // let defaultWidth = session.get("defaultWidth");
   // console.log("defaultWidth:", +defaultWidth, +session.get("width"))
   //console.log("layoutView:",layoutView)
    let width = getLayoutWidth(session.width);
    //console.log("LAYOUTVIEW ", { width})
    return <OuterWrapper>
        {width == 750 ? <W000><LayoutRes layout={layoutView} res="w900" qparams={qparams} session={session} /></W000> : null}
        {width == 900 ? <W900><LayoutRes layout={layoutView} res="w900" qparams={qparams} session={session} /></W900> : null}
        {width == 1200 ? <W1200><LayoutRes layout={layoutView} res="w1200" qparams={qparams} session={session} /></W1200> : null}
        {width == 1800 ? <W1800><LayoutRes layout={layoutView} res="w1800" qparams={qparams} session={session} /></W1800> : null}
        {width == 2100 ? <W2100><LayoutRes layout={layoutView} res="w2100" qparams={qparams} session={session} /></W2100> : null}

    </OuterWrapper>
    // return <div>{JSON.stringify(layout, null, 4)}</div>
}
