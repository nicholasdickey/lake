if(!self.define){let e,a={};const c=(c,i)=>(c=new URL(c+".js",i).href,a[c]||new Promise((a=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=a,document.head.appendChild(e)}else e=c,importScripts(c),a()})).then((()=>{let e=a[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(i,f)=>{const s=e||("document"in self?document.currentScript.src:"")||location.href;if(a[s])return;let t={};const d=e=>c(e,s),n={module:{uri:s},exports:t,require:d};a[s]=Promise.all(i.map((e=>n[e]||d(e)))).then((e=>(f(...e),t)))}}define(["./workbox-588899ac"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/agKxnBL4CTi9uR-oh0gG7/_buildManifest.js",revision:"a5c66e1c7142fa3e35ba511f44ff840f"},{url:"/_next/static/agKxnBL4CTi9uR-oh0gG7/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/328-cc339d5cf051d983.js",revision:"cc339d5cf051d983"},{url:"/_next/static/chunks/330-3a21f8e988d63b37.js",revision:"3a21f8e988d63b37"},{url:"/_next/static/chunks/framework-114634acb84f8baa.js",revision:"114634acb84f8baa"},{url:"/_next/static/chunks/main-b81d013c5352f2b4.js",revision:"b81d013c5352f2b4"},{url:"/_next/static/chunks/pages/%5B%5B...ssr%5D%5D-1722205f542ca92c.js",revision:"1722205f542ca92c"},{url:"/_next/static/chunks/pages/_app-82a46ed243c88a36.js",revision:"82a46ed243c88a36"},{url:"/_next/static/chunks/pages/_error-8353112a01355ec2.js",revision:"8353112a01355ec2"},{url:"/_next/static/chunks/pages/news/%5B%5B...static%5D%5D-faa0306cd7baaa42.js",revision:"faa0306cd7baaa42"},{url:"/_next/static/chunks/pages/user/%5B%5B...ssr%5D%5D-a6d2c54dac535c99.js",revision:"a6d2c54dac535c99"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-f164db4954bac6ec.js",revision:"f164db4954bac6ec"},{url:"/_next/static/css/ea2e80ed4b51f0c4.css",revision:"ea2e80ed4b51f0c4"},{url:"/_next/static/media/03b685511c0eaac3.woff2",revision:"46fec8ec22bfe84a9182cfecb0fe3fb6"},{url:"/_next/static/media/04fe87c30c4f76ea.woff2",revision:"472e8a7f3368235d9d26d7d10f094ff2"},{url:"/_next/static/media/0e4fe491bf84089c.p.woff2",revision:"5e22a46c04d947a36ea0cad07afcc9e1"},{url:"/_next/static/media/101c7b68f2d8b610.woff2",revision:"b5808b612c74810455a8c3b0575bf540"},{url:"/_next/static/media/119a69c4f231f60f.woff2",revision:"89b3fa63f395adbba5c66cb0f7e648af"},{url:"/_next/static/media/1c57ca6f5208a29b.woff2",revision:"491a7a9678c3cfd4f86c092c68480f23"},{url:"/_next/static/media/1e8103c5d17beb1d.woff2",revision:"6e5e6b35f2164d0e19ba31634d926ae5"},{url:"/_next/static/media/2aaf0723e720e8b9.p.woff2",revision:"e1b9f0ecaaebb12c93064cd3c406f82b"},{url:"/_next/static/media/3a04115668d8070d.p.woff2",revision:"d83f1599340e8afa7a36461059a80b81"},{url:"/_next/static/media/3dbd163d3bb09d47.woff2",revision:"93dcb0c222437699e9dd591d8b5a6b85"},{url:"/_next/static/media/44c3f6d12248be7f.woff2",revision:"705e5297b1a92dac3b13b2705b7156a7"},{url:"/_next/static/media/4a8324e71b197806.woff2",revision:"5fba57b10417c946c556545c9f348bbd"},{url:"/_next/static/media/4e4687409e533403.woff2",revision:"abe484542dba51a64b06c1cdd375bce3"},{url:"/_next/static/media/5647e4c23315a2d2.woff2",revision:"e64969a373d0acf2586d1fd4224abb90"},{url:"/_next/static/media/699512af39861afa.p.woff2",revision:"d998caa1048cad4c89e26a9d3fcab2ee"},{url:"/_next/static/media/71ba03c5176fbd9c.woff2",revision:"2effa1fe2d0dff3e7b8c35ee120e0d05"},{url:"/_next/static/media/7add1b04a8dbb074.woff2",revision:"df7736c7a2ac71c200c1a3cda683e4df"},{url:"/_next/static/media/7be645d133f3ee22.woff2",revision:"3ba6fb27a0ea92c2f1513add6dbddf37"},{url:"/_next/static/media/7c53f7419436e04b.woff2",revision:"fd4ff709e3581e3f62e40e90260a1ad7"},{url:"/_next/static/media/7d8c9b0ca4a64a5a.p.woff2",revision:"0772a436bbaaaf4381e9d87bab168217"},{url:"/_next/static/media/7e624512c3433db5.woff2",revision:"8a48965cead2d8be7f1d9f3a7b25a799"},{url:"/_next/static/media/83e4d81063b4b659.woff2",revision:"bd30db6b297b76f3a3a76f8d8ec5aac9"},{url:"/_next/static/media/8fb72f69fba4e3d2.woff2",revision:"7a2e2eae214e49b4333030f789100720"},{url:"/_next/static/media/912a9cfe43c928d9.woff2",revision:"376ffe2ca0b038d08d5e582ec13a310f"},{url:"/_next/static/media/91a88e0c5dd21dfa.woff2",revision:"9663a3dcc4d93b27554c25c2c537a6f0"},{url:"/_next/static/media/934c4b7cb736f2a3.p.woff2",revision:"1f6d3cf6d38f25d83d95f5a800b8cac3"},{url:"/_next/static/media/96827bb3668ab7bf.woff2",revision:"9ec13a3824c59f854db9168aebae0ac0"},{url:"/_next/static/media/9714907d9a8e12c0.woff2",revision:"88275a7d603aecfc05a798dda62ca58c"},{url:"/_next/static/media/988507a0588e08c2.woff2",revision:"466bde9c4517556d472ba8574c0d5d26"},{url:"/_next/static/media/9b67ab375515cd6f.woff2",revision:"0ded8b4ff2f6a2b1f0a8420b92a6b969"},{url:"/_next/static/media/9c4f34569c9b36ca.woff2",revision:"2c1fc211bf5cca7ae7e7396dc9e4c824"},{url:"/_next/static/media/9cf7d128be063d32.woff2",revision:"bcc892f3fa0e651a3a2795103f72d85b"},{url:"/_next/static/media/a3c201c07e8eb753.woff2",revision:"fb08c969e6d9dd50cfd2645eb60ac166"},{url:"/_next/static/media/ae9ae6716d4f8bf8.woff2",revision:"b0c49a041e15bdbca22833f1ed5cfb19"},{url:"/_next/static/media/b1db3e28af9ef94a.woff2",revision:"70afeea69c7f52ffccde29e1ea470838"},{url:"/_next/static/media/b6db722c6886c2cd.woff2",revision:"1019108d9fe09d5ae4b3affb185f8656"},{url:"/_next/static/media/b967158bc7d7a9fb.woff2",revision:"08ccb2a3cfc83cf18d4a3ec64dd7c11b"},{url:"/_next/static/media/baf12dd90520ae41.woff2",revision:"8096f9b1a15c26638179b6c9499ff260"},{url:"/_next/static/media/bbdb6f0234009aba.woff2",revision:"5756151c819325914806c6be65088b13"},{url:"/_next/static/media/bd976642b4f7fd99.woff2",revision:"cc0ffafe16e997fe75c32c5c6837e781"},{url:"/_next/static/media/c0f5ec5bbf5913b7.woff2",revision:"8ca5bc1cd1579933b73e51ec9354eec9"},{url:"/_next/static/media/cff529cd86cc0276.woff2",revision:"c2b2c28b98016afb2cb7e029c23f1f9f"},{url:"/_next/static/media/d1d9458b69004127.woff2",revision:"9885d5da3e4dfffab0b4b1f4a259ca27"},{url:"/_next/static/media/d3993855bd828edf.woff2",revision:"27335205f75b5244aa4f5dfea7b44634"},{url:"/_next/static/media/d8fdc95d5a4284b0.woff2",revision:"004ef2f1025475b1723e39d7a0529d7a"},{url:"/_next/static/media/de9eb3a9f0fa9e10.woff2",revision:"7155c037c22abdc74e4e6be351c0593c"},{url:"/_next/static/media/e195dd2ded485df3.woff2",revision:"920bd6d4ea896998f763e38d705bedb7"},{url:"/_next/static/media/e25729ca87cc7df9.woff2",revision:"9a74bbc5f0d651f8f5b6df4fb3c5c755"},{url:"/_next/static/media/e35c7314ac518ddc.woff2",revision:"ea21fa4f9e2ee9025409672d7750c45b"},{url:"/_next/static/media/ee65d20c5e82dfb1.p.woff2",revision:"87c4581addbd8808a3ada2357d63bf70"},{url:"/_next/static/media/ee7e17a7bdd8636b.woff2",revision:"47403e44df9ec7ef982ce9249b195f64"},{url:"/_next/static/media/f06116e890b3dadb.woff2",revision:"2855f7c90916c37fe4e6bd36205a26a8"},{url:"/_next/static/media/f8b4884fe242ed41.p.woff2",revision:"f6cac6a46dff4f08aed592e00f20cf8e"},{url:"/favicon.ico",revision:"c30c7d42707a47a3f4591831641e50dc"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/thirteen.svg",revision:"53f96b8290673ef9d2895908e69b2f92"},{url:"/vercel.svg",revision:"61c6b19abff40ea7acd577be818f3976"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:a,event:c,state:i})=>a&&"opaqueredirect"===a.type?new Response(a.body,{status:200,statusText:"OK",headers:a.headers}):a}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const a=e.pathname;return!a.startsWith("/api/auth/")&&!!a.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
