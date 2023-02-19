import React from 'react'
import styled from 'styled-components';
import { UilStar } from '@iconscout/react-unicons'
interface Level{
    level:number
}
const StyledStar=styled.div<Level>`
    color:var(--star${({level})=>level});
   
`

    

export const Star=({level,size}:{level:number,size:number})=>{
    if(!level||level==0)
        return null;
    return <StyledStar  level={level}>
   <UilStar size={size}/>
    </StyledStar>

}