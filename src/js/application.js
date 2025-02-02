
var font = null;
window.proofingPhase = "Hamburgers";

var fontFormats = {
    truetype: 'ttf',
    opentype: 'otf',
}

var json = "src/js/proof.json";

var utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
var utcNoSlash = new Date().toJSON().slice(0,10).replace(/-/g,'');

var otDefaults = ["kern", "ccmp", "calt", "rlig", "rvrn", "mark", "mmkmk", "init", "medi", "fina"];

// Utility functions
//------------------------
function toggleClass(thisID, thisClass) {
      $("#"+thisID+' .testarea').toggleClass(thisClass);
}
function preserveUnique(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = a[i];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}
function showErrorMessage(message) {
    var el = document.getElementById('message');
    if (!message || message.trim().length === 0) {
        el.style.display = 'none';
    } else {
        el.style.display = 'block';
    }
    el.innerHTML = message;
}

function uint8ToBase64(buffer) {
     var binary = '';
     var len = buffer.byteLength;
     for (var i = 0; i < len; i++) {
         binary += String.fromCharCode(buffer[i]);
     }
     return window.btoa( binary );
}
// Was useful when I had a save button
// function localStorageSave(thisClass,valueWanted) {
//     //Attached to actual button
//     var classes = document.getElementsByClassName(thisClass);
//     for(var i = 0; i < classes.length; i++) {
//             localStorage.setItem(classes[i].getAttribute('id'), classes[i][valueWanted]);
//     }
// }
function localStorageClear() {
    localStorage.clear();
    localStorage.setItem('proofingPhase', 'Hamburgers');
    location.reload();
}
function whichFontSize(thisString) {
    if (thisString === "t__size-xxl") {
        return "140";
    } else if (thisString === "t__size-xl") {
        return "100";
    } else if (thisString === "t__size-l") {
        return "84";
    } else if (thisString === "t__size-m") {
        return "56";
    } else if (thisString === "t__size-s") {
        return "28";
    } else if (thisString === "t__size-xs") {
        return "14";
    } else {
          var charCount = thisString.length;
          if (charCount < 25 ) {
                return "t__size-xxl";
          } else if (charCount < 50 ) {
                return "t__size-xl";
          } else if (charCount < 95) {
                return "t__size-l";
          } else if (charCount < 200 ){
                return "t__size-m";
          } else if (charCount < 1000 ){
                return "t__size-s";
          } else {
                return "t__size-xs";
          }
    }
}
// Probably useful one day
// function isVariableFont() {
//     if (font.tables["fvar"]) {
//         return true;
//     } else {
//         return false;
//     }
// }
function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}
function removeElementsByID(IDName){
      var removeThis = $("#"+IDName);
      removeThis.slideUp('slow', function(){ removeThis.remove(); });
}
function saveData(id, value) {
    if (typeof(Storage) !== "undefined") {
          if (value !== "thisContent") {
                localStorage.setItem(id, value);
          } else {
                var thisContent = $('#'+id).text();
                localStorage.setItem(id, thisContent);
          }
    }
}
//Meat and potatoes
//------------------------

function setStage(thisStage) {
    //insert stage buttons
    var articleID = 'section__article-app',
        article = document.getElementById(articleID),
        stageButtonsID = 'section__header-stage-buttons',
        stageButtons = document.getElementById(stageButtonsID),
        html = '',
        sliderhtml = '',
        proofhtml = '',
        buttonhtml = '',
        styles = '',
        fvarStyle = '';

    $.getJSON(json, function(proof) {
        for(stage in proof) {
            if (stage === thisStage) {
                  var addVariableSliders = function() {
                        if (font.tables.fvar) {
                           var fvarSupport = [];
                           for (var a in font.tables.fvar.axes) {
                                  var tag = font.tables.fvar.axes[a].tag;
                                  fvarSupport.push(tag);
                           }
                           fvarStyle += 'font-variation-settings:';
                           for (var b in font.tables.fvar.axes) {
                                var min = font.tables.fvar.axes[b].minValue;
                                var max = font.tables.fvar.axes[b].maxValue;
                                var tag = font.tables.fvar.axes[b].tag;
                                var name = font.tables.fvar.axes[b].name.en;
                                if (localStorage.getItem(itemID+'-slider-'+tag+'-val')) {
                                    var defaultValue = localStorage.getItem(itemID+'-slider-'+tag+'-val');
                                    fvarStyle += '\''+tag+'\' '+defaultValue+' ';
                                } else {
                                    var defaultValue = font.tables.fvar.axes[b].defaultValue;
                                    fvarStyle += '\''+tag+'\' '+defaultValue+' ';
                                }
                                html += '<label for="'+sliderID+'-'+tag+'">'+name+' </label>';
                                html += '<span class="t__right" id="'+sliderID+'-'+tag+'-val">'+defaultValue+'</span>';
                                html += '<input id="'+sliderID+'-'+tag+'" type="range" class="slider" min="'+min+'" max="'+max+'" value="'+defaultValue+'" oninput="passfvarValue(\''+itemID+'\', \''+tag+'\', this.value, \''+fvarSupport+'\')">';
                                if (b != font.tables.fvar.axes.length - 1) {
                                      fvarStyle += ", ";
                                }
                           }
                           fvarStyle += ';';

                        }

                  }
                    html = '';
                    if (font.tables.gsub && font.tables.gsub.features) {
                        gsubFeatures = font.tables.gsub.features;
                    } else {
                        gsubFeatures = ""
                    };
                    // gsubFeatures = font.tables.gsub.features;
                    if (font.tables.gpos && font.tables.gpos.features) {
                        gposFeatures = font.tables.gpos.features;
                    } else {
                        gposFeatures = ""
                    };
                    var taglist = [];
                    for (var i in gsubFeatures) {
                        var tag = gsubFeatures[i].tag;
                        if (proof["Features"][tag] != undefined) {
                              taglist.push(tag);
                        }
                    }
                    for (var i in gposFeatures) {
                        var tag = gposFeatures[i].tag;
                        if (proof["Features"][tag] != undefined) {
                              taglist.push(tag);
                        }
                    }
                    taglist = preserveUnique(taglist);

                    for(var title in proof[stage]) {
                        if (stage === "Features" && !taglist.includes(title)) {
                              continue;
                        } else {
                              var textClass = whichFontSize(proof[stage][title]);
                              var testAreaID = 'section__proofing-'+title;
                              var itemID = 'item--'+title;
                              var sliderID = itemID+'-slider';
                              var inlineStyle = '';

                              // font value check localstorage
                              if (localStorage.getItem(sliderID+'-fontSize-val')) {
                                    var fontSize = localStorage.getItem(sliderID+'-fontSize-val');
                                    inlineStyle += 'font-size: '+fontSize+'pt;';
                              } else {
                                      var fontSize = whichFontSize(textClass);
                              }
                              if (localStorage.getItem(sliderID+'-lineHeight-val')) {
                                    var lineHeight = localStorage.getItem(sliderID+'-lineHeight-val');
                                    inlineStyle += 'line-height: '+lineHeight+';';
                              } else {
                                    var lineHeight = '1.2';
                                    inlineStyle += 'line-height: 1.2;';
                              }
                              if (localStorage.getItem(sliderID+'-letterSpacing-val')) {
                                    var letterSpacing = localStorage.getItem(sliderID+'-letterSpacing-val');
                                    inlineStyle += 'letter-spacing: '+letterSpacing+'em;';
                              } else {
                                    var letterSpacing = '0em';
                                    inlineStyle += 'letter-spacing: 0em;';
                              }
                              html += '<div id="'+itemID+'" class="item">';
                              html += '<button class="btn btn-link add-item-above chip" onclick="insertField(\''+itemID+'\')">+ Add Proof Window</button>';
                              html += '<div class="u__flex">';
                              html += '<div class="item__sliders mr-6 pt-2"><div class="item__sliders-wrapper">';
                              html += '<label for="'+sliderID+'-fontSize">Font Size </label><span class="t__right" id="'+sliderID+'-fontSize-val">'+fontSize+'pt</span><input id="'+sliderID+'-fontSize" type="range" class="slider" min="4" max="160" step="2" value="'+fontSize+'" oninput="passStyleValue(\''+itemID+'\', \'fontSize\', this.value)">';
                              html += '<label for="'+sliderID+'-lineHeight">Line Height </label><span class="t__right" id="'+sliderID+'-lineHeight-val">'+lineHeight+'</span><input id="'+sliderID+'-lineHeight" type="range" class="slider" min="0.6" max="3.0" step="0.01" value="'+lineHeight+'" oninput="passStyleValue(\''+itemID+'\', \'lineHeight\', this.value)">';
                              html += '<label for="'+sliderID+'-letterSpacing">Letter Spacing </label><span class="t__right" id="'+sliderID+'-letterSpacing-val">'+letterSpacing+'</span><input id="'+sliderID+'-letterSpacing" type="range" class="slider" min="-0.4" max="0.4" step="0.01" value="'+letterSpacing+'" oninput="passStyleValue(\''+itemID+'\', \'letterSpacing\', this.value)">';
                              //Variable sliders
                              addVariableSliders();

                              html += '<div id="btn__wrapper-case" class="u__flex btn__wrapper">';
                              // other style buttons
                              html += '<button class="btn btn-link textTransform-uppercase mr-1 mb-1" title="Uppercase" onclick="passStyleValue(\''+itemID+'\',\'textTransform\', \'uppercase\')">TT</button>';
                              html += '<button class="btn btn-link textTransform-capitalize mr-1 mb-1" title="Capitalize" onclick="passStyleValue(\''+itemID+'\',\'textTransform\', \'capitalize\')">Tt</button>';
                              html += '<button class="btn btn-link textTransform-lowercase mr-1 mb-1" title="Lowercase" onclick="passStyleValue(\''+itemID+'\',\'textTransform\', \'lowercase\')">tt</button>';
                              html += '</div>';
                              html += '<div id="btn__wrapper-columns" class="u__flex btn__wrapper">';
                              html += '<button class="btn btn-link column-count-1 mr-1 mb-1" title="1 column layout" onclick="passStyleValue(\''+itemID+'\',\'column-count\', \'1\')">☱</button>';
                              html += '<button class="btn btn-link column-count-2 mr-1 mb-1" title="2 column layout" onclick="passStyleValue(\''+itemID+'\',\'column-count\', \'2\')">☷</button>';
                              html += '<button class="btn btn-link column-count-3 mr-1 mb-1" title="3 column layout" onclick="passStyleValue(\''+itemID+'\',\'column-count\', \'3\')">☵</button>';
                              html += '</div>';
                              //add features checkboxes
                              html += '<div class="btn__wrapper t_left mt-3">';
                              for (t = 0; t < taglist.length; t++) {
                                    var tag = taglist[t];
                                    var name = proof["Features"][tag]["abstract"];
                                    html += '<div class="btn__setfont mt-1 d-block">';
                                    if (otDefaults.includes(tag)) {
                                        html += '<input id="'+itemID+'-checkbox-'+tag+'" type="checkbox" name="" onclick="passfeatValue(\''+itemID+'\', \''+tag+'\', \''+taglist+'\')" checked>';
                                     } else {
                                        html += '<input id="'+itemID+'-checkbox-'+tag+'" type="checkbox" name="" onclick="passfeatValue(\''+itemID+'\', \''+tag+'\', \''+taglist+'\')"> ';
                                    }
                                    html += name+'<span class="float-right">'+tag+'</span></div>';
                              }
                              html += '</div>';
                              html += '<button class="btn btn-secondary mr-1 mb-1 mt-6" title="Applies styles above to all text fields currently visable." onclick="passStyleValue(\''+itemID+'\',\'idiocracy\',\'global\')">Global Idiocracy</button>';
                              //close tools
                              html += '</div>';
                              html += '</div>';
                              html += '<div class="item__proof">';
                              html += '<button class="btn btn-link remove-item-this" onclick="removeElementsByID(\''+itemID+'\')">×</button>';
                              if (stage === "Features") {
                                    var textClass = whichFontSize(proof[stage][title].sample);
                                    html += '<h6 class="h6" title="'+proof[stage][title].definition+'" contentEditable="true" onkeyup="saveData(\''+testAreaID+'-title\', \'thisContent\')">'+title+'</h6><span class="testarea-values small"> <span class="fontSize">fontSize: '+fontSize+'pt</span> <span class="lineHeight">lineHeight: '+lineHeight+'</span> <span class="letterSpacing">letterSpacing: '+letterSpacing+'</span></span>';
                                    html += '<div id="'+testAreaID+'" style="'+inlineStyle+' '+fvarStyle+'" class="t__importedfontfamily '+textClass+' testarea" contenteditable="true" spellcheck="false" onkeyup="saveData(\''+testAreaID+'\', \'thisContent\')">';
                                    // content check localstorage
                                    if (localStorage.getItem(testAreaID)) {
                                          html += localStorage.getItem(testAreaID);
                                    } else {
                                           html +=  proof[stage][title].sample;
                                    }
                              } else {
                                    html += '<h6 contentEditable="true" onkeyup="saveData(\''+testAreaID+'-title\', \'thisContent\')">'+title+'</h6><span class="testarea-values small"> <span class="fontSize">fontSize: '+fontSize+'pt</span> <span class="lineHeight">lineHeight: '+lineHeight+'</span> <span class="letterSpacing">letterSpacing: '+letterSpacing+'</span></span>';
                                    html += '<div id="'+testAreaID+'" style="'+inlineStyle+' '+fvarStyle+'" class="t__importedfontfamily '+textClass+' testarea" contentEditable="true" spellcheck="false" onkeyup="saveData(\''+testAreaID+'\', \'thisContent\')">';
                                    // content check localstorage
                                    if (localStorage.getItem(testAreaID)) {
                                          html += localStorage.getItem(testAreaID);
                                    } else {
                                           html += proof[stage][title];
                                    }
                              }
                              html += '</div>';
                              html += '</div>';
                              html += '</div>';
                              html += '</div>';
                        }
                    }
                }
                if (html === '') {
                      html += '<div class="item u__flex t__center"><div class="item__proof">No features found! :...(</div></div>';
                }
               if (stage === thisStage) {
                     buttonhtml += '<li class="tab-item active tab__setstage" onclick="setStage(\''+stage+'\')"><a class="#">'+stage+'</a></li>';
               } else {
                     buttonhtml += '<li class="tab-item tab__setstage" onclick="setStage(\''+stage+'\')"><a class="#">'+stage+'</a></li>';
               }
        }
        stageButtons.innerHTML = buttonhtml;
        article.innerHTML = html;
        $("#style__opentype-features").html(styles);

    });
    saveData("proofingPhase",thisStage);
}

function insertField(aboveHere) {
    var thisClone = jQuery("#"+aboveHere).clone();
    $("#"+aboveHere).prepend(thisClone);
    var thisCloneHeight = thisClone.height();
    thisClone.css('height','auto');
    thisClone.css('height','0px').animate({height: thisCloneHeight}, 600);
}

function passStyleValue(itemID,property,value) {
      if (property === "fontSize" || property === "lineHeight" || property === "letterSpacing") {
            saveData(itemID+"-slider-"+property+"-val", value);
            if (property === "fontSize") {
                  value += "pt";
            } else if (property === "letterSpacing") {
                  value += "em";
            }
            document.getElementById(itemID+"-slider-"+property+"-val").innerHTML=value;
      } else {
            saveData(itemID+property, value);
      }
      if (property === "idiocracy") {
            var css = $("#"+itemID+" .testarea").attr("style");
            $( ".testarea" ).attr("style", css);
      } else {
            $( "#"+itemID+" .testarea" ).css(property,value);
      }
      //update inline text
      if ($("#"+itemID+" .testarea-values").has("."+property).length) {
            $("#"+itemID+" .testarea-values"+" ."+property).html(" "+property+": "+value);
      } else {
            var html = "<span class='"+property+"'> "+property+": "+value+"</span>";
            $("#"+itemID+" .testarea-values").append(html);
      }
      $(".btn."+property+"-"+value).addClass('active').siblings(".btn").removeClass('active');
}
function passfvarValue(itemID,property,value,fvarSupport) {
      // update text values
      document.getElementById(itemID+"-slider-"+property+"-val").innerHTML=value;
      // save in local storage
      saveData(itemID+"-slider-"+property+"-val", value);
      if (!(Array.isArray(fvarSupport))){
            fvarSupport = fvarSupport.split(',');
      }
       var fvarcss = "";
       if (fvarSupport.length == 1) {
             fvarcss += "'"+property+"' "+value+" ";
      } else {
            for (f = 0; f < fvarSupport.length; f++) {
                   if (property == fvarSupport[f]) {
                        fvarcss += "'"+property+"' "+value;
                  } else {
                        var fvalue = document.getElementById(itemID+"-slider-"+fvarSupport[f]).value;
                        fvarcss += "'"+String(fvarSupport[f])+"' "+fvalue;
                  }
                  if (f != fvarSupport.length - 1) {
                        fvarcss += ", ";
                  }
             }
      }
      $("#"+itemID+" .testarea").css('font-variation-settings', fvarcss);
      //update inline text
      if ($("#"+itemID+" .testarea-values").has(".fvar").length) {
            $("#"+itemID+" .testarea-values .fvar").html(fvarcss);
      } else {
            var html = "<span class='fvar'>"+fvarcss+"</span>";
            $("#"+itemID+" .testarea-values").append(html);
      }
}

function passfeatValue(itemID,feature,featureSupport) {
      var featSupport = featureSupport.split(',');
      var featcss = "";
    //   console.log(featSupport);

      for (f = 0; f < featSupport.length; f++) {
             if (document.getElementById(itemID+"-checkbox-"+featSupport[f]).checked) {
                  featcss += "'"+featSupport[f]+"' 1,";
                  // save in local storage
                  // saveData(itemID+"-feature-"+featSupport[f], featSupport[f]);
            } else {
                  featcss += "'"+featSupport[f]+"' 0,";
            }
       }
       featcss = featcss.replace(/,\s*$/, "");
      $("#"+itemID+" .testarea").css('font-feature-settings', featcss);
}

// function initfeatValue(taglist) {
//     var featSupport = taglist.split(',');
//     var featcss = "";
//     console.log(featSupport);

//     for (f = 0; f < featSupport.length; f++) {
//            if (document.getElementById(itemID+"-checkbox-"+featSupport[f]).checked) {
//                 featcss += "'"+featSupport[f]+"' 1,";
//                 // save in local storage
//                 // saveData(itemID+"-feature-"+featSupport[f], featSupport[f]);
//           } else {
//                 featcss += "'"+featSupport[f]+"' 0,";
//           }
//      }
//      featcss = featcss.replace(/,\s*$/, "");
//     // $("#"+itemID+" .testarea").css('font-feature-settings', featcss);
// }

function displayFontData(fontFamily) {

    var tablename, table, property, value, tag;
    var styles = '';

    for (tablename in font.tables) {
        table = font.tables[tablename];

        if (tablename === 'cmap') {
            var gim = font.tables.cmap.glyphIndexMap;
            var gimLength = Object.keys(gim).length;
            if (gimLength <= 100 ) {
                window.proofingPhase = "Hamburgers";
            } else if (gimLength >= 400 ) {
                window.proofingPhase = "Diacritics";
            } else {
                window.proofingPhase = "Spacing";
            }
        }
        // Determine if TTF or OTF
        var fontFormat = font.outlinesFormat;
        fontFormat = fontFormats[fontFormat];
        // Inserting header data: font name, foundry name, etc.
        if (tablename === 'name') {
                nameHtml = '';
                if (font.names.designer) {
                    var designerName = font.names.designer.en;
                } else {
                    var designerName = "No Designer Name :(";
                }
                if (font.names.postScriptName) {
                    var postScriptName = font.names.postScriptName.en;
                } else {
                    var postScriptName = "Font Name";
                }
                nameHtml += '<h6 class="h6 section__header-name u__flex-grow-1 t__left" contenteditable="true" spellcheck="false">'+designerName+'</h6>';

                nameHtml += '<a class="off-canvas-toggle h6 section__header-name u__flex-grow-1 t__center p-sticky" href="#sidebar-demo" spellcheck="false">'+postScriptName+'</a>';
                styles += '.t__importedfontfamily { font-family: "'+fontFamily+'" }';
                nameHtml += '<h6 class="h6 section__header-name  u__flex-grow-1 t__right">'+utc+'</h6>';
                document.getElementById('section__header-names').innerHTML = nameHtml;
                continue;
        }
    }
    //Inject css of necessary features
    $("#style__fontfamily").html(styles);
    //setStage
    if (localStorage.getItem('proofingPhase')) {
            // Check for local storage settings
            setStage(localStorage.getItem('proofingPhase'));
    } else {
            setStage(window.proofingPhase);
    }
}

function onFontLoaded(font, fontFamilySource, fontFamily) {
    window.font = font;
    var binaryData = [];
    binaryData.push(font);
    window.URL.createObjectURL(new Blob(binaryData, {type: "application/zip"}));
    window.fontFamily = fontFamily;

    // Do the actual proofing build
    displayFontData(fontFamily);
    //Set selection into localstorage for potential  livereload later
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === "") {
        localStorage.setItem("fontFamily", fontFamily);
        localStorage.setItem("fontFamilySource", fontFamilySource);
    }

}


function onReadFile(e) {
      var html = '',
           style = '',
           file = e.target.files[0],
           files = e.target.files;
    if (e.target.files.length > 1) {
         for(var i=0; i<e.target.files.length; i++) {
           var f = files[i];
           var reader = new FileReader;
           reader.onload = function(e) {
                 var dv = new DataView(e.target.result);
                 var font = opentype.parse(e.target.result);
                 font.file = {
                     name: e.name,
                     lastModified: e.lastModified,
                     size: e.size,
                     type: e.type,
                 };
                 font.type = "upload";
                 font.fontFamily = font.names.postScriptName.en;
                 font.menuName = font.fontFamily;
                 var tempUint8array = new Uint8Array(e.target.result);
                $("#style__fontface").append("@font-face {font-family:'" + font.fontFamily + "'; " + "src: url('data:;base64," + uint8ToBase64(tempUint8array) + "') format('truetype');} ");
                $("#section__header-file-buttons").append('<span class="btn__setfont chip d-block" title="'+font.fontFamily+'" id="btn__setfont-'+font.fontFamily+'" onclick="setFont(\'data:;base64,' + uint8ToBase64(tempUint8array) + '\', \''+font.fontFamily+'\')">'+font.fontFamily+'</span>');

          };
          reader.readAsArrayBuffer(f);
    }
   } else {
          var reader = new FileReader();
          reader.onload = function(e) {
              try {
                  var font = opentype.parse(e.target.result);
                  var fontFamily = font.names.postScriptName.en;
                  var fontFamilySource = "fonts/"+font.names.postScriptName.en;
                  onFontLoaded(font, fontFamilySource, fontFamily);

                  // store info about the file
                  font.file = {
                      name: e.name,
                      lastModified: e.lastModified,
                      size: e.size,
                      type: e.type,
                  };
                  font.type = "user:local";

                  var tempUint8array = new Uint8Array(e.target.result);
                  $("#style__fontface").html("@font-face {font-family:'" +window.fontFamily+ "'; " + " src: url('data:;base64," + uint8ToBase64(tempUint8array) + "') format('truetype');} ");
                  showErrorMessage('');
              } catch (err) {
                  showErrorMessage(err.toString());
                  if (err.stack) console.log(err.stack);
              throw(err);
              }
          };
          reader.onerror = function(err) {
              showErrorMessage(err.toString());
          };
          reader.readAsArrayBuffer(file);
    }
}

function setFont(fontFamilySource, fontFamily) {
    opentype.load(fontFamilySource, function(err, font) {
        onFontLoaded(font, fontFamilySource, fontFamily);
    });
}
// Server load up fonts
function serverLoad() {
      // server
      var fileButtonParent = document.getElementById('section__header-file-buttons');
      // set first load as gooper
      setFont('fonts/gooper-VF.ttf', 'gooper-VF-ttf');
      $('#style__fontface').html('@font-face { font-family: "gooper-VF-ttf"; src: url("fonts/gooper-VF.ttf");}');
      // watch for user upload
      var fileButtonHtml = '<form class="box has-advanced-upload" method="post" action="" enctype="multipart/form-data">';
      fileButtonHtml += '<div class="box__input">';
      fileButtonHtml += '<input id="fontInput" class="box__file" type="file" name="files[]"  data-multiple-caption="{count} files selected" multiple />';
      fileButtonHtml += '</form>';
      fileButtonHtml += '<div id="message"></div>'
      fileButtonHtml += '<div id="listfonts"></div>'
      fileButtonParent.innerHTML = fileButtonHtml;
      var fileButton = document.getElementById('fontInput');
      fileButton.addEventListener('change', onReadFile, false);
}
// Local load up font
function localLoad() {
      // local
      var fileButtonParent = document.getElementById('section__header-file-buttons');
      document.getElementById('section__header-file-buttons').innerHTML = 'Place fonts you want to proof into <code>/fonts</code> to begin';
      var html = '';
      var style = '';
      var allFontFilesInFolder = '';
      $.get( "../src/txt/fonts.txt", {}, function( data ) {
          allFontFilesInFolder = data.split("fonts/");
          var fonts = [];
          for(var a=0; a<allFontFilesInFolder.length; a++) {
             if (allFontFilesInFolder[a] != "") {
                  thisFont = allFontFilesInFolder[a].trim();
                  fonts.push(thisFont);
             }
          }
          preserveUnique(fonts)
          fonts.sort();
          for(var a=0; a<fonts.length; a++) {
                var thisFontSource = fonts[a],
                     thisFontType = thisFontSource.split('.').pop();
                     thisFontName = thisFontSource.replace('ignore/','').replace('-',' ').replace(/([A-Z])/g, ' $1').trim(),
                     thisFontFamily = thisFontSource.replace('.', '-');
                html += '<div class="btn__setfont chip d-block" title="'+thisFontSource+'" id="btn__setfont-'+thisFontFamily+'" onclick="setFont(\'fonts/'+thisFontSource+'\', \''+thisFontFamily+'\')">'+thisFontName.substring(0, thisFontName.length - 4)+'<span class="float-right">'+thisFontType+'</span></div>';
                style += '@font-face { font-family: "'+thisFontFamily+'"; src: url("fonts/'+thisFontSource+'");}';
          }
          fileButtonParent.innerHTML = html;
          if (localStorage.getItem('fontFamilySource')) {
                  // Check for local storage settings
                var fontFamilySource = localStorage.getItem('fontFamilySource');
                var fontFamily = localStorage.getItem('fontFamily');
          } else {
                  var fontFamilySource = "fonts/"+fonts[fonts.length - 1];
                  var fontFamily = thisFontFamily;
          }
          setFont(fontFamilySource, fontFamily);
          $('#style__fontface').append(style);

          // check local storage values
          // var i;
          // console.log("local storage");
          // for (i = 0; i < localStorage.length; i++)   {
          //    console.log(localStorage.key(i) + "=[" + localStorage.getItem(localStorage.key(i)) + "]");
          // }

      }, "text");
}

window.onload = function() {

    //how the fonts are populated
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === "") {
          localLoad();
    } else {
          serverLoad();
    }

    //Active button toggles
    $('#section__header-file-buttons').on('click', '.btn__setfont', function() {
        $(this).addClass('active').siblings().removeClass('active');
        $(this).addClass('visited');
    });
    $('#section__header-stage-buttons').on('click', '.btn__setstage', function() {
        $(this).addClass('active').siblings().removeClass('active');
    });
    $('#btn__view-tools-toggle').on('click', function(e) {
        $('.body__idiotproofed').toggleClass("tools-visible");
    });

    document.body.className += " loaded";
    // passfeatValue();
}



// Specimen maker
var isAnimating = null;
function animatefvarValue(itemID,property,value,minValue,maxValue,fvarSupport) {
        document.getElementById(itemID+"-slider-"+property+"-val").value=value;
        //generate insert keyframe animation based on value
        var styles = '',
            addKeyFrames = null;
        if (isAnimating !== null) {
            $("#style__fvar-animation").html('');
            isAnimating = null;
        } else {
            addKeyFrames = function(name, frames){
                if (CSSRule.WEBKIT_KEYFRAMES_RULE) { // WebKit
                    styles += "@-webkit-keyframes " + name + " {" + frames + "}";
                } else if (CSSRule.MOZ_KEYFRAMES_RULE) { // Mozilla
                    styles += "@-moz-keyframes " + name + " {" + frames + "}";
                } else if (CSSRule.KEYFRAMES_RULE) { // W3C
                    styles += "@keyframes " + name + " {" + frames + "}";
                }
            }
            if (!(Array.isArray(fvarSupport))){
                fvarSupport = fvarSupport.split(',');
            }
            var fvarcss = "";
            if (fvarSupport.length == 1) {
                 addKeyFrames(
                    property+'infinite',
                    '0%, 100% {font-variation-settings:"'+property+'" '+value+';}' +
                    '25% {font-variation-settings:"'+property+'" '+minValue+';}' +
                    '50% {font-variation-settings:"'+property+'" '+maxValue+';}'
                );
            } else {
                for (f = 0; f < fvarSupport.length; f++) {
                    if (property !== fvarSupport[f]) {
                        var fvalue = document.getElementById(id+"-slider-"+fvarSupport[f]).value;
                        fvarcss += "'"+String(fvarSupport[f])+"' "+fvalue+",";
                    }
                 }
                 fvarcss = fvarcss.substring(0, fvarcss.length - 1);
                addKeyFrames(
                    property+'infinite',
                    '0%, 100% {font-variation-settings:"'+property+'" '+value+', '+fvarcss+';}' +
                    '25% {font-variation-settings:"'+property+'" '+minValue+', '+fvarcss+';}' +
                    '50% {font-variation-settings:"'+property+'" '+maxValue+', '+fvarcss+';}'
                );
            }
            $("#style__fvar-animation").html(styles);
            $('#' + itemID).css("font-variation-settings","unset").css('animation',  property+'infinite 4s ease-in-out infinite');
            isAnimating = true;
        }
}
