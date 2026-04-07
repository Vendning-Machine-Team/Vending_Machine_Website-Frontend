import"./style-_gm7ZM6v.js";import{c as n}from"./util-uEc8sS6W.js";const o=document.getElementById("actions"),r=document.getElementById("homeButton");localStorage.getItem("adminUsername")||window.location.replace("./adminLogin.html");setInterval(n,120*1e3);n();r.addEventListener("click",()=>{window.location.replace("./adminDashboard.html")});async function s(){try{const t=await fetch("/api/get-actions");if(!t.ok)throw new Error("Network response was not ok");const a=await t.json(),c="Action Time | Username | Action Type",i=a.map(e=>`${e.action_time} | ${e.username} | ${e.type_name}`);o.value=c+`

`+i.join(`

`)}catch(t){console.error("Error fetching actions:",t),o.value="Failed to load actions."}}s();
