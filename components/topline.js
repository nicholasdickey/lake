
import styled from 'styled-components';

//import FormControlLabel from '@material-ui/core/FormControlLabel';
//import Tooltip from '@material-ui/core/Tooltip';
//import { updateSession } from '../qwiket-lib/actions/app'
//import AlertWidget from './widgets/alert'
const StyledCheckbox = styled.div`
  display: inline-block;
  margin-bottom:4px;
  
  > input {
    opacity: 0;
  }
  > input + label {
    position: relative; /* permet de positionner les pseudo-éléments */
    padding-left: 25px; /* fait un peu d'espace pour notre case à venir */
    margin-top:3px;
    font-size:13px;
    
  
    cursor: pointer;    /* affiche un curseur adapté */
    &:before {
      content: '';
      position: absolute;
      left:0; top: 1px;
      width: 14px; height: 14px; /* dim. de la case */
      border: 1px solid #aaa;
      background: #f8f8f8;
      border-radius: 3px; /* angles arrondis */
      box-shadow: inset 0 1px 3px rgba(0,0,0,.3) /* légère ombre interne */
    }
    &:after {
      content: '✔';
      position: absolute;
      top: -1px; left: 2px;
      font-size: 16px;
      color: #09ad7e;
      transition: all .2s; /* on prévoit une animation */
    }
  }
  > input:not(:checked) + label {
      &:after {
        opacity: 0; /* coche invisible */
        transform: scale(0); /* mise à l'échelle à 0 */
      }
  }
  > input:disabled:not(:checked) + label {
      &:before {
        box-shadow: none;
        border-color: #bbb;
        background-color: #ddd;
      }
  }
  > input:checked + label {
    &:after {
      opacity: 1; /* coche opaque */
      transform: scale(1); /* mise à l'échelle 1:1 */
    }
  }
  > input:disabled:checked + label {
    &:after {
      color: #999;
    }
  }
  > input:disabled + label {
    color: #aaa;
  }
  > input:checked:focus + label, input:not(:checked):focus + label {
    &:before {
      border: 1px dotted blue;
    }
  }
`;
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

export const Topline = ({ updateTheme,session, layout, updateSession }) => {
    let upd = updateSession;
    //console.log("RENDER TOPLINE");
    let hpads = layout.hpads;

    console.log("dark topline render",session)

    /*const alert = <div style={{ flexShrink: 4 }}> <Tooltip title="Alerts"><AlertWidget onClick={(v) => {
        console.log("alert click ", v);
       


    }} /></Tooltip></div>*/
    const Check = ({ label, checked, onChange, disabled }) => {
        return <StyledCheckbox
        onClick={() => onChange(!checked)}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        <label>{label}</label>
      </StyledCheckbox>
    }


    const Loud = () => {
        return <Check label='Loud' checked={session.loud == 1 ? true : false} onChange={(checked) => {
            console.log("Changed Loud")
            upd({ loud: checked ? 1 : 0 });
        }} />
    }
    const Thick = () => {
        const StyledCheck = styled.div`
            display:flex;
            width:120px;
          
            @media(max-width:1200px){
                display:none;
            }
        `
        return <StyledCheck><Check label='Thick' checked={session.thick == 1 ? true : false} onChange={(checked) => {
            console.log("Changed And The Band")
            upd({ thick: cgecked ? 1 : 0 });
        }} /></StyledCheck>
    }
    const Dense = () => {
        const StyledCheck = styled.div`
            display:flex;
             width:120px;
            @media(max-width:1200px){
                display:none;
            }
        `
        return <StyledCheck><Check label='Dense' checked={session.dense == 1 ? true : false} onChange={(checked) => {
            console.log("Changed And The Band")
            upd({ dense: checked ? 1 : 0 });
        }} /></StyledCheck>
    }
    const Dark = () => {
        console.log ("dark checkbox checked:", session.dark== 1)
        return <Check label='Dark' checked={session.dark==1 ? true : false} onChange={(checked) => {
            console.log("Changed Dark",checked)
            updateTheme(checked ? 'dark' : 'light' );
            //setTimeout(() => location.reload(true), 200)
        }} />
    }
    const Band = () => {
        const StyledCheck = styled.div`
            display:flex;
            @media(max-width:750px){
                display:none;
            }
        `
        return <StyledCheck><Check label='And The Band' checked={session.band == 1 ? true : false} onChange={(checked) => {
            console.log("Changed And The Band",checked)
            upd({ band:checked ? 1 : 0 });
        }} /></StyledCheck>
    }


    const ToplineBand = styled.div`
        width:100%;
        height:30%;
        display:block;
        background-color:#000;
        @media(max-width:749px){
            display:none;
        }
    `
    const InnerBand = styled.div`
        padding-left: ${hpads.w0};
        padding-right: ${hpads.w0};
        width: '100%';
        @media(min-width:750px){
            padding-left: ${hpads.w750};
            padding-right: ${hpads.w750};
        }
        @media(min-width:900px){
            padding-left: ${hpads.w900};
            padding-right: ${hpads.w900};
        }
        @media(min-width:1200px){
            padding-left: ${hpads.w1200};
            padding-right: ${hpads.w1200};
        }
        @media(min-width:1600px){
            padding-left: ${hpads.w1600};
            padding-right: ${hpads.w1600};
        }
        @media(min-width:1800px){
            padding-left: ${hpads.w1800};
            padding-right: ${hpads.w1800};
        }
        @media(min-width:1950px){
            padding-left: ${hpads.w1950};
            padding-right: ${hpads.w1950};
        }
        @media(min-width:2100px){
            padding-left: ${hpads.w2100};
            padding-right: ${hpads.w2100};
        }
        @media(min-width:2400px){
            padding-left: ${hpads.w2400};
            padding-right: ${hpads.w2400};
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
    return <ToplineBand data-id="topline"><InnerBand><Loud /><Thick /><Dense /><Dark /><Band /></InnerBand></ToplineBand>
};
