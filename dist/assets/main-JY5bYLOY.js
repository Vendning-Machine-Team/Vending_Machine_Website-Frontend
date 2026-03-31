import"./style-D8odUd8i.js";const i=document.getElementById("payButton"),p=document.getElementById("reportButton"),u=document.getElementById("total"),s=document.getElementById("productContainer");let r=[],a={},o=0;async function c(){r=await(await fetch("/api/products")).json(),s.innerHTML="",r.forEach(t=>{a[t.id]=0;const n=document.createElement("div");n.className="flex justify-between items-center py-3 border-b",n.innerHTML=`
            <div>
            <p class="font-medium">${t.name}</p>
            <p class="text-sm text-gray-500">$${t.price}</p>
            <p class="text-xs text-gray-400">${t.inventory} available</p>
            </div>

            <input
            type="number"
            min="0"
            max="${t.inventory}"
            value="0"
            data-id="${t.id}"
            class="w-20 text-center border rounded-lg"
            >
        `,s.appendChild(n)}),m(),d()}function m(){document.querySelectorAll("input[data-id]").forEach(t=>{t.addEventListener("input",()=>{const n=t.dataset.id,l=parseInt(t.value)||0;a[n]=l,d()})})}function d(){o=0,r.forEach(e=>{const t=a[e.id]||0;o+=t*e.price}),u.innerText=`$${o}`,i.disabled=o===0}p.addEventListener("click",()=>{window.location.replace("./pages/reportIssue.html")});i.addEventListener("click",async()=>{try{const e=await fetch("/api/create-checkout-session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:a})}),t=await e.json();if(!e.ok){alert(t.error||"Inventory issue. Try again."),c();return}window.location.href=t.url}catch(e){console.error(e),alert("Something went wrong starting checkout.")}});c();
