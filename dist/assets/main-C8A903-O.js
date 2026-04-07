import"./style-_gm7ZM6v.js";const i=document.getElementById("payButton"),m=document.getElementById("reportButton"),u=document.getElementById("total"),c=document.getElementById("productContainer");let r=[],s={},a=0;async function l(){r=await(await fetch("/api/products")).json(),c.innerHTML="",r.forEach(t=>{s[t.id]=0;const o=t.image_url;console.log(o);const n=document.createElement("div");n.className="bg-white rounded-2xl shadow p-4 flex flex-col items-center text-center",n.innerHTML=`
            <img src="${o}" alt="${t.name}" class="w-28 h-28 object-cover rounded-lg mb-3">

            <p class="font-medium text-lg">${t.name}</p>
            <p class="text-sm text-gray-500">$${t.price}</p>
            <p class="text-xs text-gray-400 mb-3">${t.inventory} available</p>

            <input
                type="number"
                min="0"
                max="${t.inventory}"
                value="0"
                data-id="${t.id}"
                class="w-20 text-center border rounded-lg"
            >
        `,c.appendChild(n)}),p(),d()}function p(){document.querySelectorAll("input[data-id]").forEach(t=>{t.addEventListener("input",()=>{const o=t.dataset.id,n=parseInt(t.value)||0;s[o]=n,d()})})}function d(){a=0,r.forEach(e=>{const t=s[e.id]||0;a+=t*e.price}),u.innerText=`$${a}`,i.disabled=a===0}m.addEventListener("click",()=>{window.location.replace("./pages/reportIssue.html")});i.addEventListener("click",async()=>{try{const e=await fetch("/api/create-checkout-session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:s})}),t=await e.json();if(!e.ok){alert(t.error||"Inventory issue. Try again."),l();return}window.location.href=t.url}catch(e){console.error(e),alert("Something went wrong starting checkout.")}});l();
