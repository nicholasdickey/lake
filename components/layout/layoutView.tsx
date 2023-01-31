import React from 'react';
import styled from 'styled-components';
import { LayoutRes } from './layoutRes'
import getLayoutWidth from '../../lib/layoutWidth'
import { Options } from '../../lib/withSession';
import { Qparams } from '../../lib/qparams';

const OuterWrapper = styled.div`width:100%;`;
const W000 = styled.div`
      //  display:none;
        width:100%;
        @media only screen  and (min-width:1px) and (max-width:599px){
            display:flex;
        }
    `;
    const W600 = styled.div`
    //  display:none;
      width:100%;
      @media  only screen and (min-width:600px) and (max-width:899px){
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
export const LayoutView = ({ session, pageType, layout,  ...props }:{session:Options,pageType:string,layout:any,qparams:Qparams,updateSession:any,channelDetails:any,qCache:any,setQCache:any}) => {
   // console.log("LAYOUT_VIEW:", layout);
    let layoutView = layout.layoutView;
    let columns = layout.columns;
   // console.log("dbg: LayoutView",session.leftColumnOverride)
   // let defaultWidth = session.get("defaultWidth");
   // console.log("defaultWidth:", +defaultWidth, +session.get("width"))
   // console.log("layoutView:",layoutView)
    let width = getLayoutWidth(session.width);
   //  console.log("LAYOUTVIEW ", { width})
    return <OuterWrapper>
        {width == 600 ? <W000><LayoutRes layout={layoutView} res="w000"  session={session} {...props} /></W000> : null}
        {width == 750 ? <W600><LayoutRes layout={layoutView} res="w600"  session={session} {...props} /></W600> : null}
        {width == 900 ? <W900><LayoutRes layout={layoutView} res="w900"  session={session}  {...props} /></W900> : null}
        {width == 1200 ? <W1200><LayoutRes layout={layoutView} res="w1200" session={session}  {...props} /></W1200> : null}
        {width == 1800 ? <W1800><LayoutRes layout={layoutView} res="w1800" session={session}  {...props} /></W1800> : null}
        {width == 2100 ? <W2100><LayoutRes layout={layoutView} res="w2100"  session={session}  {...props} /></W2100> : null}
    </OuterWrapper>
    // return <div>{JSON.stringify(layout, null, 4)}</div>
}
