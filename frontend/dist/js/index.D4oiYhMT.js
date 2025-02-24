const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./User.Brq8Z24W.js","./vendor.b7dnWdBk.js","../css/vendor-24VY5_9h.css","../css/User-BWpwdVYU.css","./Home.BRwYRb6L.js","./TopBar.B5C0Mg6G.js","../css/TopBar-CcwwVloT.css","./SideContent.boZNwz8F.js","../css/SideContent-CBwTTw_9.css","../css/Home-V7xS8EPE.css","./ArticleContent.BPnY_8Ko.js","../css/ArticleContent-C4FF8O_j.css","./Articles.DkfsDONl.js","../css/Articles-Cz8Sfdyt.css","./NbaData.DHzk7kVU.js","../css/NbaData-BixpjMkY.css","./About.C1Zl-9zb.js","../css/About-D7kEkr6p.css"])))=>i.map(i=>d[i]);
import{d as v,c as E,a as R,r as C,K as S,o as T,b as w,u as L,e as b,f as I,g as O,h as D,i as B,j as $}from"./vendor.b7dnWdBk.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function o(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=o(r);fetch(r.href,n)}})();const K=v({name:"App",setup(){}}),V=(e,t)=>{const o=e.__vccOpts||e;for(const[s,r]of t)o[s]=r;return o};function q(e,t,o,s,r,n){const a=C("router-view");return T(),E(S,null,[R(a)],1024)}const N=V(K,[["render",q]]),ue=e=>{try{localStorage.setItem("rsaPublicKey",e)}catch(t){console.error("Error storing RSA key in localStorage:",t)}},fe=()=>{try{return localStorage.getItem("rsaPublicKey")}catch(e){return console.error("Error retrieving RSA key from localStorage:",e),null}},j=e=>{try{localStorage.setItem("token",e)}catch(t){console.error("Error storing refresh token in localStorage:",t)}},x=()=>{try{return localStorage.getItem("token")}catch(e){return console.error("Error retrieving token from localStorage:",e),null}},U=e=>{try{localStorage.setItem("refreshToken",e)}catch(t){console.error("Error storing refresh token in localStorage:",t)}},H=()=>{try{return localStorage.getItem("refreshToken")}catch(e){return console.error("Error retrieving refresh token from localStorage:",e),null}};function W(e){e.response?console.error("HTTP Error:",e.response.status,e.response.statusText):console.error("Network Error:",e)}function z(e,t){return e.headers={...e.headers,"Content-Type":"application/json",...t},e}function G(e,t){const o=x(),s=H();return o&&!t?e.headers.Authorization=`Bearer ${o}`:t&&(e.headers.Authorization=`Bearer ${s}`),e}const F={baseURL:"http://localhost:3000/",timeout:5e3,withCredentials:!0},he=()=>u.get("/user/pubkey"),pe=e=>u.post("/user/login",e),Q=()=>u.get("/user/refreshToken"),J=L();let g=!1;const _=[],{baseURL:X,timeout:Y,withCredentials:Z}=F,u=w.create({baseURL:X,timeout:Y,withCredentials:Z});u.interceptors.request.use(e=>(e=z(e,{}),e=G(e,g),e));u.interceptors.response.use(e=>e.status===200||e.status===201?Promise.resolve(e.data):Promise.reject(e),async e=>(console.log(e),e.response.status===401&&e.config.url!=="/user/refreshToken"?await M(e):(W(e),Promise.reject(e))));async function M(e){const{config:t}=e;return g?te(t):await ee(t)}async function ee(e){return await re(),oe(),u(e)}function te(e){return new Promise(t=>{_.push({config:e,resolve:t})})}async function re(){g=!0;try{const e=await Q();if(console.log("Refresh token response:",e),e.status===200){const{token:t,refreshToken:o}=e.data;console.log("Refresh token successful:",t,o),j(t),U(o)}else e.status===401?(localStorage.removeItem("token"),localStorage.removeItem("refreshToken"),J.push("/user")):console.error("Refresh token failed with status:",e.status)}catch(e){console.error("Error refreshing token:",e)}finally{g=!1}}function oe(){for(;_.length>0;){const{config:e,resolve:t}=_.shift();t(u(e))}}const ne=b({state:{currentPage:1,currentPage1:1,articleCount:0,authorCount:0,genreCount:0,articleData:[],recentArticles:[],scrollPosition:0},getters:{getCurrentPage:e=>e.currentPage,getCurrentPage1:e=>e.currentPage1,getArticleCount:e=>e.articleCount,getArticleData:e=>e.articleData,getRecentArticles:e=>e.recentArticles,getScrollPosition:e=>e.scrollPosition},mutations:{setCurrentPage(e,t){e.currentPage=t},setCurrentPage1(e,t){e.currentPage1=t},setArticleCount(e,t){e.articleCount=t},setAuthorCount(e,t){e.authorCount=t},setGenreCount(e,t){e.genreCount=t},setArticleData(e,t){e.articleData=t},setRecentArticles(e,t){e.recentArticles=t},changeRecentArticles(e,t){const{index:o,article:s}=t;e.recentArticles[o]=s},setScrollPosition(e,t){e.scrollPosition=t}},actions:{async fetchData({commit:e}){try{const t=await u.get("/catalog/data");e("setArticleCount",t.article_count),e("setAuthorCount",t.author_count),e("setGenreCount",t.genre_count)}catch(t){console.error("Error fetching data:",t)}}},modules:{},plugins:[I({storage:window.localStorage})]}),se="modulepreload",ae=function(e,t){return new URL(e,t).href},k={},f=function(t,o,s){let r=Promise.resolve();if(o&&o.length>0){const a=document.getElementsByTagName("link"),c=document.querySelector("meta[property=csp-nonce]"),y=(c==null?void 0:c.nonce)||(c==null?void 0:c.getAttribute("nonce"));r=Promise.allSettled(o.map(i=>{if(i=ae(i,s),i in k)return;k[i]=!0;const h=i.endsWith(".css"),P=h?'[rel="stylesheet"]':"";if(!!s)for(let p=a.length-1;p>=0;p--){const m=a[p];if(m.href===i&&(!h||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${i}"]${P}`))return;const l=document.createElement("link");if(l.rel=h?"stylesheet":se,h||(l.as="script"),l.crossOrigin="",l.href=i,y&&l.setAttribute("nonce",y),document.head.appendChild(l),h)return new Promise((p,m)=>{l.addEventListener("load",p),l.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${i}`)))})}))}function n(a){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=a,window.dispatchEvent(c),!c.defaultPrevented)throw a}return r.then(a=>{for(const c of a||[])c.status==="rejected"&&n(c.reason);return t().catch(n)})},ce=[{path:"/",redirect:"/user"},{path:"/user",name:"User",component:()=>f(()=>import("./User.Brq8Z24W.js"),__vite__mapDeps([0,1,2,3]),import.meta.url)},{path:"/home",name:"Home",component:()=>f(()=>import("./Home.BRwYRb6L.js"),__vite__mapDeps([4,1,2,5,6,7,8,9]),import.meta.url),meta:{keepAlive:!1}},{path:"/articles/:id",name:"ArticleContent",component:()=>f(()=>import("./ArticleContent.BPnY_8Ko.js"),__vite__mapDeps([10,1,2,7,8,5,6,11]),import.meta.url),props:!0,meta:{keepAlive:!0}},{path:"/articleList/:id",name:"Articles",component:()=>f(()=>import("./Articles.DkfsDONl.js"),__vite__mapDeps([12,1,2,5,6,13]),import.meta.url),meta:{keepAlive:!0}},{path:"/nbadata/:id*",name:"NbaData",component:()=>f(()=>import("./NbaData.DHzk7kVU.js"),__vite__mapDeps([14,1,2,5,6,15]),import.meta.url)},{path:"/about/:id*",name:"About",component:()=>f(()=>import("./About.C1Zl-9zb.js"),__vite__mapDeps([16,7,1,2,8,5,6,17]),import.meta.url)}],A=O({history:D(),routes:ce});A.beforeEach((e,t,o)=>{const s=!!localStorage.getItem("user");e.path!=="/user"&&!s?o("/user"):o()});const d=B(N);d.use($);d.use(ne);d.use(A);d.mount("#app");export{f as _,V as a,he as b,j as c,U as d,fe as g,u as h,pe as l,ue as s};
