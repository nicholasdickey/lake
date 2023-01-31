
import styled from 'styled-components';
import { Options } from '../lib/withSession';

//import FormControlLabel from '@material-ui/core/FormControlLabel';
//import Tooltip from '@material-ui/core/Tooltip';
//import { updateSession } from '../qwiket-lib/actions/app'
//import AlertWidget from './widgets/alert'
import StyledCheckbox from './checkbox';
import getLayoutWidth from '../lib/layoutWidth'

/*const StyledCheckbox = styled(({ ...other }) => <div classes={{ checked: 'checked', disabled: 'disabled' }}{...other} />)`
  color: #eee !important;
  width:200px%;
  & .label {
    #color: ${props => props.color};
    color: #ddd;
    font-size: 14px; 
    font-family: Asap Condensed;
    font-weight:bold;
  }
   & .checked {
    color: #eee !important;
   
  }
  & .disabled {
    color:  #aff; !important;
  }
`; */
interface ToplineProps{
  back:boolean
}
const ToplineBand = styled.div<ToplineProps>`
        width:100%;
       margin-bottom:${({back})=>back?6:10}px;
        //height:20%;
        display:block;
        background-color:${({back})=>back?`#111`:'#111'};
       /* @media(max-width:749px){
            display:none;
        }*/
    `
interface Props {
  hpads: any;
}

const InnerBand = styled.div<Props>`
        padding-left: ${({ hpads }) => hpads.w0};
        padding-right:  ${({ hpads }) => hpads.w0};
        width: '100%';
        @media(min-width:50px){
            padding-left: ${({ hpads }) => hpads.w750};
            padding-right: ${({ hpads }) => hpads.w750};
        }
        @media(min-width:900px){
            padding-left: ${({ hpads }) => hpads.w900};
            padding-right: ${({ hpads }) => hpads.w900};
        }
        @media(min-width:1200px){
            padding-left: ${({ hpads }) => hpads.w1200};
            padding-right: ${({ hpads }) => hpads.w1200};
        }
        @media(min-width:1600px){
            padding-left: ${({ hpads }) => hpads.w1600};
            padding-right: ${({ hpads }) => hpads.w1600};
        }
        @media(min-width:1800px){
            padding-left:${({ hpads }) => hpads.w1800};
            padding-right: ${({ hpads }) => hpads.w1800};
        }
        @media(min-width:1950px){
            padding-left: ${({ hpads }) => hpads.w1950};
            padding-right:${({ hpads }) => hpads.w1950};
        }
        @media(min-width:2100px){
            padding-left: ${({ hpads }) => hpads.w2100};
            padding-right: ${({ hpads }) => hpads.w2100};
        }
        @media(min-width:2400px){
            padding-left: ${({ hpads }) => hpads.w2400};
            padding-right: ${({ hpads }) => hpads.w2400};
        }
        display:flex;
        justify-content:space-between;
        align-items:center;
        color:#eee;
        font-size:10px;
        font-weight:normal;
        height:30px;
        margin-bottom:0px;
    
    `
const StyledCheck = styled.div`
     display:flex;
      width:120px;
    
    /* @media(max-width:1200px){
         display:none;
     }*/
 `
const Check = ({ label, checked, onChange, disabled }: { label: string, checked: boolean, onChange: any, disabled: boolean }) => {
  return <StyledCheckbox
    onClick={() => onChange(!checked)}
  >
    <input
      type="checkbox"
      name={label}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
    <label htmlFor={label}>{label}</label>
  </StyledCheckbox>
}


const Loud = ({ session, upd }: { session: Options, upd: any }) => {
  return <Check label='Loud' checked={session.loud == 1 ? true : false} disabled={false} onChange={(checked: boolean) => {
    console.log("Changed Loud")
    upd({ loud: checked ? 1 : 0 });
  }} />
}
const Thick = ({ session, upd }: { session: Options, upd: any }) => {

  return <StyledCheck><Check disabled={false} label='Thick' checked={session.thick == 1 ? true : false} onChange={(checked: boolean) => {
    console.log("Changed And The Band")
    upd({ thick: checked ? 1 : 0 });
  }} /></StyledCheck>
}
const Dense = ({ session, upd }: { session: Options, upd: any }) => {

  return <StyledCheck><Check label='Dense' checked={session.dense == 1 ? true : false} disabled={!session.thick} onChange={(checked: boolean) => {
    console.log("Changed And The Band")
    upd({ dense: checked ? 1 : 0 });
  }} /></StyledCheck>
}
const StyledMobileCheck = styled.div`
display:flex;
/*@media(max-width:750px){
    display:none;
}*/
`
const Dark = ({ session, updateTheme }: { session: Options, updateTheme: any }) => {
  //console.log ("dark checkbox checked:", session.dark== 1)
  return <StyledMobileCheck><Check label='Dark' checked={session.dark == 1 ? true : false} disabled={false} onChange={(checked: boolean) => {
    console.log("Changed Dark", checked)
    updateTheme(checked ? 'dark' : 'light');
    //setTimeout(() => location.reload(true), 200)
  }} /></StyledMobileCheck>
}

const Band = ({ session, upd }: { session: Options, upd: any }) => {

  return <StyledMobileCheck><Check disabled={false} label='And The Band' checked={session.band == 1 ? true : false} onChange={(checked: boolean) => {
    console.log("Changed And The Band", checked)
    upd({ band: checked ? 1 : 0 });
  }} /></StyledMobileCheck>
}

export const Topline = ({ updateTheme, session, layout, updateSession, channelDetails }: { updateTheme: any, session: Options, layout: any, updateSession: any, channelDetails: any }) => {
  const upd = updateSession;
  //console.log("RENDER TOPLINE", layout);
  const hpads = layout.hpads;
  const topline = channelDetails.topline;

  // console.log("dark topline render",session)

  /*const alert = <div style={{ flexShrink: 4 }}> <Tooltip title="Alerts"><AlertWidget onClick={(v) => {
      console.log("alert click ", v);
     


  }} /></Tooltip></div>*/


  let width = getLayoutWidth(session.width);
  return <ToplineBand back={width>600} data-id="topline">
    {width == 600 ? <InnerBand hpads={hpads}><div/> <Loud upd={upd} session={session} />  <Dark updateTheme={updateTheme} session={session} /><div/></InnerBand> : null}
    {width == 750 ? <InnerBand hpads={hpads}> <div/><Loud upd={upd} session={session} />  <Dark updateTheme={updateTheme} session={session} /><div/> </InnerBand> : null}
    {width == 900 ? <InnerBand hpads={hpads}> <Loud upd={upd} session={session} />  <Dark updateTheme={updateTheme} session={session} /> <Band upd={upd} session={session} /></InnerBand> : null}
    {width == 1200 ? <InnerBand hpads={hpads}> <Loud upd={upd} session={session} />  <Thick upd={upd} session={session} /> <Dark updateTheme={updateTheme} session={session} /> <Band upd={upd} session={session} /></InnerBand> : null}
    {width == 1800 ? <InnerBand hpads={hpads}> <Loud upd={upd} session={session} />  <Thick upd={upd} session={session} />  <Dense upd={upd} session={session} /><Dark updateTheme={updateTheme} session={session} /> <Band upd={upd} session={session} /></InnerBand> : null}
    {width == 2100 ? <InnerBand hpads={hpads}> <Loud upd={upd} session={session} />   <Thick upd={upd} session={session} />
      <Dense upd={upd} session={session} /> <Dark updateTheme={updateTheme} session={session} /> <Band upd={upd} session={session} /></InnerBand> : null}

  </ToplineBand>
};
