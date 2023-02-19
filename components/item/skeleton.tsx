import React, { useState, useEffect, useCallback } from "react";
import styled from 'styled-components';


interface WH {
  w: number;
  h: number;
}
interface W {
  w: number;
}
const WHSpan = styled.span<WH>`

  width:${({ w }) => w}px !important;
  height:${({ h }) => h}px !important;
`
const WSpan = styled.span<W>`
  width:${({ w }) => w}% !important;
`
const WpxSpan = styled.span<W>`
  width:${({ w }) => w}px !important;
`
const SkeletonWrap = styled.main`
width:100%;
.skeleton-box {
  display: inline-block;
  height: 1em;
  position: relative;
  overflow: hidden;
  background-color: #DDDBDD;

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(#fff, 0) 0,
      rgba(#fff, 0.2) 20%,
      rgba(#fff, 0.5) 60%,
      rgba(#fff, 0)
    );
    animation: shimmer 2s infinite;
    content: '';
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
}

.blog-post {
  &__headline {
    font-size: 1.25em;
    font-weight: bold;
  }

  &__meta {
    font-size: 0.85em;
    color: #6b6b6b;
  }
}

// OBJECTS

.o-media {
  display: flex;
  
  &__body {
    flex-grow: 1;
    margin-left: 1em;
  }
}

.o-vertical-spacing {
  > * + * {
    margin-top: 0.75em;
  }
  
  &--l {
    > * + * {
      margin-top: 2em;
    }
  }
}

// MISC

* {
  box-sizing: border-box;
}

body {
  max-width: 42em;
  margin: 0 auto;
  padding: 3em 1em;
  font-family: 'Karla', sans-serif;
  line-height: 1.4;
}

header {
  max-width: 42em;
  margin: 0 auto;
  text-align: center;
  font-size: 1.2em;
}

main {
  margin-top: 3em;
}

header {
  h1 {
    font-family: 'Rubik', sans-serif;
    font-weight: 500;
    line-height: 1.2;
    font-size: 2em;
  }

  p {
    &:not(:first-child) {
      margin-top: 1em;
    }
  }
}

`
const Qwiket = ({ extraWide, isTopic, count }: { extraWide: boolean, isTopic: boolean, count: number }) => {

  let rows:any[] = [];
  for (let i = 0; i < count; i++) {
    rows.push(<li className="blog-post o-media">
      <div className="o-media__figure">
        <WHSpan w={100} h={80} className="skeleton-box"></WHSpan>
      </div>
      <div className="o-media__body">
        <div className="o-vertical-spacing">
          <h3 className="blog-post__headline">
            <WSpan w={55} className="skeleton-box" ></WSpan>
          </h3>
          <p>
            <WSpan w={80} className="skeleton-box" ></WSpan>
            <WSpan w={90} className="skeleton-box" ></WSpan>
            <WSpan w={83} className="skeleton-box" ></WSpan>
            <WSpan w={80} className="skeleton-box" ></WSpan>

          </p>
          <div className="blog-post__meta">
            <WpxSpan w={70} className="skeleton-box" ></WpxSpan>
          </div>
        </div>
      </div>
    </li>)
  }
  return (<SkeletonWrap>
    <ul className="o-vertical-spacing o-vertical-spacing--l">
      {rows}
    </ul>
  </SkeletonWrap>);
}
export default Qwiket;