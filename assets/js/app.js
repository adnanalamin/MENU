const categories = [
 {n:"Basic Navigation",d:"Clean, practical navigation bars for everyday websites.",i:"⌘",t:["HTML & CSS","JavaScript"],k:"Basic",c:"35+ planned",s:["navbar","sticky","fixed"]},
 {n:"Dropdown Menus",d:"Simple, nested and multi-level dropdown navigation patterns.",i:"▾",t:["HTML & CSS","JavaScript"],k:"Dropdown",c:"35+ planned",s:["dropdown","nested","hover"]},
 {n:"Mega Menus",d:"Wide, multi-column navigation for content-rich websites.",i:"▦",t:["HTML & CSS","JavaScript","Bootstrap"],k:"Mega",c:"35+ planned",s:["mega menu","ecommerce","columns"]},
 {n:"Animated Menus",d:"Expressive transitions, hover effects and motion-led navigation.",i:"✳",t:["CSS","JavaScript"],k:"Animated",c:"45+ planned",s:["animation","motion","hover"]},
 {n:"Mobile Navigation",d:"Touch-friendly menus built for smaller screens.",i:"▯",t:["HTML & CSS","JavaScript","React"],k:"Mobile",c:"40+ planned",s:["hamburger","drawer","bottom nav"]},
 {n:"Sidebar & Dashboard",d:"Navigation systems for dashboards, apps and admin panels.",i:"▤",t:["React","Tailwind CSS","Bootstrap"],k:"Sidebar",c:"40+ planned",s:["sidebar","dashboard","admin"]},
 {n:"E-commerce Navigation",d:"Storefront categories, product discovery and shopping flows.",i:"◇",t:["HTML & CSS","Bootstrap","React"],k:"Mega",c:"30+ planned",s:["shop","category","product"]},
 {n:"Creative & Experimental",d:"Unusual radial, circular, 3D and visual navigation concepts.",i:"✧",t:["CSS","JavaScript"],k:"Creative",c:"35+ planned",s:["3d","radial","circular"]},
 {n:"Fullscreen & Overlay",d:"Immersive full-screen navigation and overlay experiences.",i:"▣",t:["HTML & CSS","JavaScript"],k:"Mobile",c:"25+ planned",s:["fullscreen","overlay","modal"]},
 {n:"CSS-only Menus",d:"Interactive patterns built with CSS and minimal or no scripting.",i:"{ }",t:["HTML & CSS"],k:"Basic",c:"30+ planned",s:["pure css","no js","details"]},
 {n:"JavaScript Menus",d:"Interactive menus with state, keyboard and touch behavior.",i:"JS",t:["JavaScript"],k:"Dropdown",c:"30+ planned",s:["vanilla js","interactive","state"]},
 {n:"Bootstrap Menus",d:"Reusable navigation patterns using Bootstrap 5 utilities.",i:"B",t:["Bootstrap"],k:"Basic",c:"30+ planned",s:["bootstrap 5","components"]},
 {n:"Tailwind CSS Menus",d:"Utility-first navigation components with flexible styling.",i:"≈",t:["Tailwind CSS"],k:"Animated",c:"30+ planned",s:["tailwind","utility first"]},
 {n:"React Navigation",d:"Composable navigation components for React applications.",i:"⚛",t:["React","Tailwind CSS"],k:"Sidebar",c:"40+ planned",s:["react","components","router"]},
 {n:"Accessibility Patterns",d:"Keyboard-friendly, semantic and inclusive navigation examples.",i:"◎",t:["HTML & CSS","JavaScript","React"],k:"Basic",c:"20+ planned",s:["a11y","keyboard","focus"]}
];
const grid=document.getElementById("categoryGrid"), search=document.getElementById("searchInput"), tech=document.getElementById("techFilter"), type=document.getElementById("typeFilter"), count=document.getElementById("resultCount"), empty=document.getElementById("emptyState");
function render(){
 const q=search.value.trim().toLowerCase(), tf=tech.value, kf=type.value;
 const filtered=categories.filter(x=>(!q||[x.n,x.d,x.k,...x.t,...x.s].join(" ").toLowerCase().includes(q))&&(tf==="all"||x.t.includes(tf)|| (tf==="HTML & CSS"&&x.t.includes("CSS")))&&(kf==="all"||x.k===kf));
 grid.innerHTML=filtered.map((x)=>`<article class="category-card"><div class="card-top"><div class="card-icon" aria-hidden="true">${x.i}</div><span class="card-number">MENU / ${String(categories.indexOf(x)+1).padStart(2,"0")}</span></div><h3>${x.n}</h3><p>${x.d}</p><div class="card-bottom"><div class="tags">${x.t.slice(0,2).map(t=>`<span class="tag">${t}</span>`).join("")}</div><span class="planned">${x.c}</span></div></article>`).join("");
 count.textContent=`${filtered.length} of ${categories.length} categories`; empty.hidden=filtered.length!==0;
}
[search,tech,type].forEach(el=>el.addEventListener(el===search?"input":"change",render));
document.getElementById("year").textContent=new Date().getFullYear();
const toggle=document.getElementById("mobileToggle"), nav=document.querySelector(".top-links");
toggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));toggle.setAttribute("aria-label",open?"Close navigation":"Open navigation");});
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");toggle.setAttribute("aria-expanded","false")}));
render();
