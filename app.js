let deferredPrompt=null;
const installBtn=document.getElementById("pwaInstall");
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;installBtn.hidden=false;});
installBtn?.addEventListener("click",async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;installBtn.hidden=true;});
window.addEventListener("appinstalled",()=>{if(installBtn)installBtn.hidden=true;});
if("serviceWorker" in navigator){
 navigator.serviceWorker.register("./service-worker.js").then(reg=>{
   reg.update();
   const show=()=>{const b=document.getElementById("updateBanner");if(b)b.hidden=false;};
   if(reg.waiting) show();
   reg.addEventListener("updatefound",()=>{const w=reg.installing;if(w)w.addEventListener("statechange",()=>{if(w.state==="installed"&&navigator.serviceWorker.controller)show();});});
   document.getElementById("updateNow")?.addEventListener("click",()=>{if(reg.waiting)reg.waiting.postMessage({type:"SKIP_WAITING"});else location.reload();});
 });
 let refreshing=false;
 navigator.serviceWorker.addEventListener("controllerchange",()=>{if(!refreshing){refreshing=true;location.reload();}});
}