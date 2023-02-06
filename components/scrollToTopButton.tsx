import React,{useCallback,useState,useEffect} from 'react';
import styled from 'styled-components';


const ButtonContainer = styled.div`
    position:fixed;
    bottom:20px;
    right:30px;
 `
const Button = styled.button`

    cursor:pointer;
    width: 56px;
    height: 56px;
    border:none;
    box-shadow: 0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12);
    border-radius: 50%;
    color: #fff;
    background-color: #3f51b5;
    font-size: 1.375rem;;
    box-sizing: border-box;
    line-height: 1.75;
    &:hover{
       background-color: #2f41a5;  
    }
}
`

const Svg = styled.svg`
  
    margin-top:10px;
    fill: currentColor;
    width: 1.4em;
    height: 1.4em;
    display: inline-block;
    transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    user-select: none;
    flex-shrink: 0;

`
export default function ScrollToTopButton() {
    const [visible,setVisible]=useState(false)
    console.log("Render Button")
    const onScroll = useCallback(() => {
        const { scrollY } = window;
        console.log("onScroll",scrollY)
        if (scrollY >= 10) {
         
           setVisible(true);

        }
        else {
            setVisible(false)
        }
    }, []);
    useEffect(() => {
        window.addEventListener("scroll", onScroll, { passive: true });
        // remove event on unmount to prevent a memory leak with the cleanup
        return () => {
            window.removeEventListener("scroll", onScroll);
        }
    }, []); 
    return (
        <>{visible?<ButtonContainer><Button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Svg focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                <path d="M15,20H9V12H4.16L12,4.16L19.84,12H15V20Z"></path>
            </Svg>

        </Button></ButtonContainer>:null}</>
    );
}