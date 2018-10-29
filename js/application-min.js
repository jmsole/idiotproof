var font=null;window.fontSize=16,window.lineHeight=1.3,window.letterSpacing=0;var fontFormats={truetype:"ttf",opentype:"otf"},json="js/proof.json",utc=(new Date).toJSON().slice(0,10).replace(/-/g,"/"),utcNoSlash=(new Date).toJSON().slice(0,10).replace(/-/g,"");function setStage(c){var d=document.getElementById("section__article-app"),m=document.getElementById("section__header-stage-buttons"),g="",u="",v="";$.getJSON(json,function(e){for(stage in e){if(stage===c)if("FEAT"===stage){if(font.tables.gsub){gsubFeatures=font.tables.gsub.features;var t=[];for(var n in gsubFeatures){var a=gsubFeatures[n].tag;t.push(a)}for(var i in t=preserveUnique(t)){var s=(f="section__proofing"+(a=t[i]))+"-slider",o="item--"+a;testAreaStyle.getPropertyValue("font-size");if(v+="."+f+' { font-feature-settings: "'+a+'" 1;}','<div class="item__sliders"><div class="item__sliders-wrapper">',"aalt"!==a&&"ccmp"!==a){if(g='<div id="'+o+'" class="item u__flex">','<div class="item__proof">',e[stage][a]){var l=whichFontSize(e[stage][a].sample);return'<h3 class="h3">'+a+' <span class="tooltip tooltip__features">'+e[stage][a].definition+"</span></h3>",'<div id="'+f+'" contenteditable="true" class="t__importedfontfamily '+l+" testarea "+f+'">',e[stage][a].sample,l}if(a.includes("ss")){l=whichFontSize(e[stage].liga.sample);return'<h3 class="h3">'+a+' <span class="tooltip tooltip__features">Stylistic Set</span></h3>','<div id="'+f+'" contenteditable="true" class="t__importedfontfamily '+l+" testarea "+f+'">',e[stage].liga.sample,l}l=whichFontSize(e[stage].liga.sample);return'<h3 class="h3">'+a+"</h3>",'<div id="'+f+'" contenteditable="true" class="t__importedfontfamily '+l+" testarea "+f+'">',e[stage].liga.sample,l}}}}else for(var r in g="",e[stage]){var f;l=whichFontSize(e[stage][r]);g+='<div id="'+(o="item--"+r)+'" class="item u__flex">',g+='<div class="item__sliders"><div class="item__sliders-wrapper">',g+='<label for="'+(s=(f="section__proofing"+r)+"-slider")+'-fontSize">Font Size </label><span id="'+s+'-fontSize-val">'+whichFontSize(l)+'</span><input id="'+s+'-fontSize" type="range" class="slider" min="4" max="160" step="2" value="'+whichFontSize(l)+'" oninput="passStyleValue(\''+f+"', 'fontSize', this.value)\">",g+='<label for="'+s+'-lineHeight">Line Height </label><span id="'+s+'-lineHeight-val">'+lineHeight+'</span><input id="'+s+'-lineHeight" type="range" class="slider" min="0.6" max="5.0" step="0.05" value="'+lineHeight+'" oninput="passStyleValue(\''+f+"', 'lineHeight', this.value)\">",g+='<label for="'+s+'-letterSpacing">Letter Spacing </label><span id="'+s+'-letterSpacing-val">'+letterSpacing+'</span><input id="'+s+'-letterSpacing" type="range" class="slider" min="-0.4" max="0.4" step="0.01" value="'+letterSpacing+'" oninput="passStyleValue(\''+f+"', 'letterSpacing', this.value)\">",g+="</div>",g+="</div>",g+='<div class="item__proof">',g+='<h3 class="h3">'+r+"</h3>",g+='<div id="'+f+'" class="t__importedfontfamily '+l+' testarea" contentEditable="true">',g+=e[stage][r],g+="</div>",g+="</div>",g+="</div>"}u+='<button class="btn active btn__setstage" onclick="setStage(\''+stage+"')\">"+stage+"</button>"}m.innerHTML=u,d.innerHTML=g,$("#style__opentype-features").html(v)});var e=document.getElementById("btn__edit-content");e.innerHTML="Save",e.classList.remove("editing"),e.classList.remove("saved"),e.classList.add("need-save")}function restoreStage(){for(var e=document.getElementsByClassName("testarea"),t=0;t<e.length;t++)null!==localStorage.getItem(e[t].getAttribute("id"))?e[t].innerHTML=localStorage.getItem(e[t].getAttribute("id")):setStage(window.proofingPhase);var n=document.getElementsByClassName("slider-item");for(t=0;t<n.length;t++)if("undefined"!=typeof Storage){var a=n[t].getAttribute("id"),i=a.split("-slider-")[0],s=a.split("-slider-")[1],o=localStorage.getItem(a+"-val");if(null!==o)document.getElementById(a+"-val").innerHTML=o,passStyleValue(i,s,document.getElementById(a).value=o)}}function localStorageSave(e,t){for(var n=document.getElementsByClassName(e),a=0;a<n.length;a++)localStorage.setItem(n[a].getAttribute("id"),n[a][t])}function localStorageClear(){localStorage.clear(),location.reload()}function setStageSave(){for(var t=document.getElementById("btn__edit-content"),n=document.getElementsByClassName("testarea"),e=0;e<n.length;e++)$(n[e]).on("click",function(){this.contentEditable=!0,this.focus(),t.innerHTML="Editing...",t.classList.remove("saved"),t.classList.add("editing")}),$(n[e]).focusout(function(){this.contentEditable=!1;for(var e=0;e<n.length;e++)localStorage.setItem(n[e].getAttribute("id"),n[e].innerHTML);t.innerHTML="Saved",t.classList.remove("editing"),t.classList.add("saved")});var a=document.getElementsByClassName("slider");for(e=0;e<a.length;e++)$(a[e]).on("focus",function(){t.innerHTML="Editing...",t.classList.remove("saved"),t.classList.add("editing")}),$(a[e]).mouseup(function(){t.innerHTML="Saved",t.classList.remove("editing"),t.classList.add("saved")})}function whichFontSize(e){if("t__size-xxl"===e)return"10em";if("t__size-xl"===e)return"8em";if("t__size-l"===e)return"6em";if("t__size-m"===e)return"4em";if("t__size-s"===e)return"2em";if("t__size-xs"===e)return"1em";var t=e.length;return t<25?"t__size-xxl":t<50?"t__size-xl":t<95?"t__size-l":t<200?"t__size-m":t<1e3?"t__size-s":"t__size-xs"}function isVariableFont(){return!!font.tables.fvar}function removeElementsByClass(e){for(var t=document.getElementsByClassName(e);0<t.length;)t[0].parentNode.removeChild(t[0])}function removeElementsByID(e){document.getElementById(e).outerHTML=""}var fieldcount=0;function insertField(e){fieldcount+=1,document.getElementById(e).insertAdjacentHTML("beforebegin",'<div id="item--'+fieldcount+'" class="item"><div id="section__proofing-'+fieldcount+'" class="page-break-before t__importedfontfamily testarea" contenteditable="true">'+textPangram[fieldcount]+"</div></div>")}function saveData(e,t){"undefined"!=typeof Storage&&localStorage.setItem(e,t)}function passStyleValue(e,t,n){if("item__proof"===e){e=document.getElementsByClassName(e);saveData("item__proof-slider-"+t+"-val",document.getElementById("item__proof-slider-"+t+"-val").innerHTML=n),"fontSize"===t?n+="px":"letterSpacing"===t&&(n+="em"),$(e).css(t,n)}else saveData(e+"-slider-"+t+"-val",document.getElementById(e+"-slider-"+t+"-val").innerHTML=n),"fontSize"===t?n+="px":"letterSpacing"===t&&(n+="em"),document.getElementById(e).style[t]=n}function passfvarValue(e,t,n,a){saveData(e+"-slider-"+t+"-val",document.getElementById(e+"-slider-"+t+"-val").value=n),Array.isArray(a)||(a=a.split(","));var i="";if(1==a.length)i+="'"+t+"' "+n+" ";else for(f=0;f<a.length;f++){if(t==a[f])i+="'"+t+"' "+n;else{var s=document.getElementById(e+"-slider-"+a[f]).value;i+="'"+String(a[f])+"' "+s}f!=a.length-1&&(i+=", ")}$("#"+e).css("font-variation-settings",i)}var isAnimating=null;function animatefvarValue(e,t,n,a,i,s){document.getElementById(e+"-slider-"+t+"-val").value=n;var o="",l=null;if(null!==isAnimating)$("#style__fvar-animation").html(""),isAnimating=null;else{l=function(e,t){CSSRule.WEBKIT_KEYFRAMES_RULE?o+="@-webkit-keyframes "+e+" {"+t+"}":CSSRule.MOZ_KEYFRAMES_RULE?o+="@-moz-keyframes "+e+" {"+t+"}":CSSRule.KEYFRAMES_RULE&&(o+="@keyframes "+e+" {"+t+"}")},Array.isArray(s)||(s=s.split(","));var r="";if(1==s.length)l(t+"infinite",'0%, 100% {font-variation-settings:"'+t+'" '+n+';}25% {font-variation-settings:"'+t+'" '+a+';}50% {font-variation-settings:"'+t+'" '+i+";}");else{for(f=0;f<s.length;f++){if(t!==s[f]){var c=document.getElementById(e+"-slider-"+s[f]).value;r+="'"+String(s[f])+"' "+c}f!=s.length-1&&(r+=", ")}l(t+"infinite",'0%, 100% {font-variation-settings:"'+t+'" '+n+" "+r+';}25% {font-variation-settings:"'+t+'" '+a+" "+r+';}50% {font-variation-settings:"'+t+'" '+i+" "+r+";}")}$("#style__fvar-animation").html(o),$("#"+e).css("font-variation-settings","unset").css("animation",t+"infinite 4s ease-in-out infinite"),isAnimating=!0}}function displayFontData(e){var t,n="";for(t in font.tables){if(font.tables[t],"cmap"===t){var a=font.tables.cmap.glyphIndexMap,i=Object.keys(a).length;window.proofingPhase=i<=100?"HAMB":400<=i?"DIAC":"OHNO"}var s=font.outlinesFormat;if(s=fontFormats[s],"name"!==t);else{if(nameHtml="",font.names.designer)var o=font.names.designer.en;else o="Designer Name";if(font.names.postScriptName)var l=font.names.postScriptName.en;else l="Font Name";nameHtml+='<h6 class="h6 section__header-name u__flex-grow-1 t__left" contenteditable="true">'+o+"</h6>",nameHtml+='<h6 class="h6 section__header-name u__flex-grow-1 t__center" contenteditable="true">'+l+"</h6>",n+='.t__importedfontfamily { font-family: "'+e+'" }',nameHtml+='<h6 class="h6 section__header-name  u__flex-grow-1 t__right">'+utc+"</h6>",document.getElementById("section__header-names").innerHTML=nameHtml}}$("#style__fontfamily").html(n),setStage(window.proofingPhase),restoreStage(),setStageSave()}function preserveUnique(e){for(var t={},n=[],a=e.length,i=0,s=0;s<a;s++){var o=e[s];1!==t[o]&&(t[o]=1,n[i++]=o)}return n}function onFontLoaded(e,t,n){window.font=e;var a=[];a.push(e),window.URL.createObjectURL(new Blob(a,{type:"application/zip"})),displayFontData(window.fontFamily=n),"localhost"!==location.hostname&&"127.0.0.1"!==location.hostname&&""!==location.hostname||(localStorage.setItem("fontFamily",n),localStorage.setItem("fontFamilySource",t))}function showErrorMessage(e){var t=document.getElementById("message");e&&0!==e.trim().length?t.style.display="block":t.style.display="none",t.innerHTML=e}function uint8ToBase64(e){for(var t="",n=e.byteLength,a=0;a<n;a++)t+=String.fromCharCode(e[a]);return window.btoa(t)}function onReadFile(e){var t=e.target.files[0],n=new FileReader;n.onload=function(e){try{var t=opentype.parse(e.target.result),n=t.names.postScriptName.en;onFontLoaded(t,"fonts/"+t.names.postScriptName.en,n),t.file={name:e.name,lastModified:e.lastModified,size:e.size,type:e.type},t.type="user:local";var a=new Uint8Array(e.target.result);$("#style__fontface").html("@font-face {font-family:'"+window.fontFamily+"'; src: url('data:;base64,"+uint8ToBase64(a)+"') format('truetype');} "),showErrorMessage("")}catch(e){throw showErrorMessage(e.toString()),e.stack&&console.log(e.stack),e}},n.onerror=function(e){showErrorMessage(e.toString())},n.readAsArrayBuffer(t)}function isFontVariable(e){return!!e.axes}function setFont(n,a){opentype.load(n,function(e,t){onFontLoaded(t,n,a)})}window.onload=function(){var l=document.getElementById("section__header-file-buttons");if("localhost"===location.hostname||"127.0.0.1"===location.hostname||""===location.hostname){document.getElementById("section__header-file-buttons").innerHTML="Place fonts you want to proof into <code>/fonts</code> to begin";var r="",f="",c="";$.get("../txt/fonts.txt",{},function(e){c=e.split("fonts/");for(var t=[],n=0;n<c.length;n++)""!=c[n]&&(thisFont=c[n].trim(),t.push(thisFont));preserveUnique(t);for(n=0;n<t.length;n++){var a=t[n],i=a.replace(".","-");r+='<button class="btn btn__setfont" id="btn__setfont-'+i+'" onclick="setFont(\'fonts/'+a+"', '"+i+"')\">"+a+"</button>",f+='@font-face { font-family: "'+i+'"; src: url("fonts/'+a+'");}'}if(l.innerHTML=r,localStorage.getItem("fontFamilySource"))var s=localStorage.getItem("fontFamilySource"),o=localStorage.getItem("fontFamily");else s="fonts/"+t[t.length-1],o=i;setFont(s,o),document.getElementById("btn__setfont-"+o).classList.add("active"),$("#style__fontface").append(f)},"text")}else{setFont("fonts/gooper-VF.ttf","gooper-VF-ttf"),$("#style__fontface").html('@font-face { font-family: "gooper-VF-ttf"; src: url("fonts/gooper-VF.ttf");}'),l.innerHTML='<input id="fontInput" type="file"><div id="message"></div>',document.getElementById("fontInput").addEventListener("change",onReadFile,!1)}$("#section__header-file-buttons").on("click",".btn__setfont",function(){$(this).addClass("active").siblings().removeClass("active")}),$("#section__header-stage-buttons").on("click",".btn__setstage",function(){$(this).addClass("active").siblings().removeClass("active")}),$("#btn__view-tools-toggle").on("click",function(e){$(".body__idiotproofed").toggleClass("tools-visible")}),document.body.className+=" loaded"};