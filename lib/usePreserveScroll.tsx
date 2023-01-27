
import { useRouter } from "next/router"
import { useEffect, useRef } from "react"

export const usePreserveScroll = () => {
  const router = useRouter()

  const scrollPositions = useRef<{ [url: string]: number }>({})
  const isBack = useRef(false)

  useEffect(() => {
    router.beforePopState(() => {
     
      isBack.current = true
     // console.log("pres: beforePopState",isBack)
      return true
    })

    const onRouteChangeStart = () => {
      const url =router.asPath;// router.pathname
      scrollPositions.current[url] = window.scrollY
     // console.log("pres: onRouteChangeStart",url,window.scrollY)
    }

    const onRouteChangeComplete = (url: any) => {
     // console.log("pres: onRouteChangeComplete",isBack);
      if (isBack.current && scrollPositions.current[url]) {
       // console.log("pres: onRouteChangeComplete  ISBACK!!! ",url, scrollPositions.current[url])
        window.scroll({
          top: scrollPositions.current[url],
          behavior: "auto",
        })
      }

      isBack.current = false
    }

    router.events.on("routeChangeStart", onRouteChangeStart)
    router.events.on("routeChangeComplete", onRouteChangeComplete)

    return () => {
      router.events.off("routeChangeStart", onRouteChangeStart)
      router.events.off("routeChangeComplete", onRouteChangeComplete)
    }
  }, [router])
}