import React, { useState, useEffect, useCallback, ReactFragment, ReactNode } from "react";
import styled from 'styled-components';
import StyledCheckbox from '../../widgets/checkbox';
import { accept } from '../../../lib/lakeApi'
import { useAppContext } from "../../../lib/context";
import NextImage from 'next/image';

const Disclaimer = styled.div`
    color:white;
    background:#4444ff;
    padding:20px;
`
const CheckboxContainer=styled.div`
margin:20px;
`
const ButtonContainer=styled.div`
position:relative;
display:flex;
justify-content:space-around;
padding:20px;
margin-top:40px;
`
const Button=styled.div`
width:160px;
height:40px;
line-height:40px;
color:#fff;
vertical-align: middle;
background:green;
cursor:pointer;
text-align: center;
`
const DisclaimerTitle=styled.div`
text-align:center;
`
const DisclaimerLogoContainer=styled.div`
position:absolute;
margin-top:-6px;
margin-left:60px;
`
export const BodySnatcher= ({mutate,setAckOverride,setOpenDialog,tag,slug}:{mutate:any,setAckOverride:any,setOpenDialog:any,tag:string,slug:string})=>{
    const [checkedAckTag,setCheckedAckTag]=useState(false);
    const [checkedAckAll,setCheckedAckAll]=useState(false);
    const { session, qparams,newsline,channelDetails } = useAppContext();
    const hasUser=session.userslug;
    const ackAndFetch=async()=>{
        if(checkedAckAll)
            await accept({sessionid:session.sessionid,userslug:session.userslug,tag:'all'});
        else if(checkedAckTag)
            await accept({sessionid:session.sessionid,userslug:session.userslug,tag});
        else
            setAckOverride(slug);
        setTimeout(()=>mutate(),300);        
    }
    const Check = ({ label, checked, onChange,disabled }: { label: string, checked: boolean, disabled?:boolean,onChange: any }) => {
        console.log("disabled:",disabled)
        return <StyledCheckbox
          onClick={() => onChange(disabled?false:!checked)}
          label={label}
        >
          <input
            type="checkbox"
            name={label}
            checked={checked}
            onChange={onChange}
            disabled={disabled?true:false}
          />
          <label htmlFor={label}>{label}</label>
        </StyledCheckbox>
      }
      const AckTag = () => {
        return <Check label='Use Body Snatcher (tm) for all articles in this feed' 
        checked={checkedAckTag} 
        onChange={(checked: boolean) => {
          setCheckedAckTag(checked);
        }} />
      }
      const AckAll = () => {
      
        return <Check  label={`Use Body Snatacher (tm) for all articles. ${session.userslug?'':'Log-in to use this feature'}`} 
          checked={checkedAckAll} 
          disabled={!hasUser}
          onChange={(checked: boolean) => {
          setCheckedAckAll(checked);
        }} />
      }
      return <div >
      <Disclaimer>
         <DisclaimerLogoContainer><NextImage src={channelDetails.logo} alt="logo" width={42} height={42}/> </DisclaimerLogoContainer>
         <DisclaimerTitle>{newsline.displayName}</DisclaimerTitle>
          <DisclaimerTitle>BODY SNATCHER</DisclaimerTitle>
          <p>Body Snatcher is an online tool designed to facilitate user's access to the content of the article for the purpose of commenting on it.</p>
      <p>To use the Body Snatcher tool to access the full body of the article, click the button below. The tool is provided solely for the convinience of our users while commenting on the article they've already accessed on the target website. </p>
      <p>By clicking this button, you certify that you have the legal right to view the content on the target website.
      </p>
      <p>
          It is your sole responsibility to respect the intellectual property of the owner of the content. 
      </p>
      <CheckboxContainer>
      <AckTag/>
      </CheckboxContainer>
      <CheckboxContainer>
      <AckAll/> 
      </CheckboxContainer>
     
      <ButtonContainer>
          <Button onClick={async ()=>{setOpenDialog(false);await ackAndFetch()}}>Snatch Article Body</Button>
      </ButtonContainer>
      </Disclaimer>
      </div>
  
}