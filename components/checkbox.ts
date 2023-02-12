import styled from 'styled-components';
interface StyledCheckboxParams{
  label:string
}
const StyledCheckbox = styled.div<StyledCheckboxParams>`
  display: inline-block;
  margin-bottom:4px;
  width:${({label})=>label?160:24}px;
  
  
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
      //background: lightblue;//#a8a8a8;
      background:var(--lowlight);
      border-radius: 3px; /* angles arrondis */
      box-shadow: inset 0 1px 3px rgba(0,0,0,.3); /* légère ombre interne */
     
    }
    
    &:after {
      
      content: '✔\fe0e';
      position: absolute;
      top: -3px; left: 4px;
      font-size: 16px;
     // color:red;
     //background:var(--lowlight);
      color: #09ad7e ;
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
        background:var(--background);
       // background-color: #ddd;
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
export default StyledCheckbox;