import"./style-D8odUd8i.js";const a=document.getElementById("actions"),s=document.getElementById("homeButton");localStorage.getItem("adminUsername")||window.location.replace("./adminLogin.html");function c(){localStorage.removeItem("adminUsername"),window.location.replace("./adminLogin.html")}async function i(){const e=localStorage.getItem("adminUsername"),t=await fetch(`/api/is-admin-active?username=${encodeURIComponent(e)}`);if(!t.ok){c();return}(await t.json()).active||c()}setInterval(i,120*1e3);i();s.addEventListener("click",()=>{window.location.replace("./adminDashboard.html")});async function m(){try{const e=await fetch("/api/get-actions");if(!e.ok)throw new Error("Network response was not ok");const t=await e.json(),o="Action Time | Username | Action Type",r=t.map(n=>`${n.action_time} | ${n.username} | ${n.type_name}`);a.value=o+`

`+r.join(`

`)}catch(e){console.error("Error fetching actions:",e),a.value="Failed to load actions."}}m();
