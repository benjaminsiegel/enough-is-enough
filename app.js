(function(){
  "use strict";

  var rows = Array.isArray(window.STATIC_SIGNATURES) ? window.STATIC_SIGNATURES : [];
  var SHARE_TEXT = "4,000 people have demanded safer streets in Boston. Read the open letter delivered to Mayor Wu:";
  var url = location.origin && location.origin !== "null"
    ? location.href.split("#")[0]
    : "https://benjaminsiegel.github.io/enough-is-enough/";

  function updateShareLinks(){
    var enc = encodeURIComponent;
    document.getElementById("pre-sh-text").href = "sms:?&body=" + enc(SHARE_TEXT + "\n\n" + url);
    document.getElementById("pre-sh-wa").href = "https://wa.me/?text=" + enc(SHARE_TEXT + "\n\n" + url);
    document.getElementById("pre-sh-em").href = "mailto:?subject=" + enc("4,000 people demand safer Boston streets") + "&body=" + enc(SHARE_TEXT + "\n\n" + url);
  }

  function copyLink(button){
    if(!navigator.clipboard){ return; }
    navigator.clipboard.writeText(url).then(function(){ button.textContent = "Link copied"; });
  }

  var copyButton = document.getElementById("pre-copylink");
  copyButton.addEventListener("click", function(){ copyLink(copyButton); });
  updateShareLinks();

  var pressLink = document.getElementById("pressmail");
  pressLink.addEventListener("click", function(event){
    event.preventDefault();
    var address = ["benjamin","robert","siegel"].join(".") + "@" + "gmail" + ".com";
    location.href = "mailto:" + address + "?subject=" + encodeURIComponent("Enough is Enough — press inquiry");
  });

  function lastNameKey(name){
    var parts = String(name || "").trim().split(/\s+/);
    return (parts[parts.length - 1] + " " + name).toLowerCase();
  }

  var notesTrigger = document.getElementById("notes-trigger");
  var notesOverlay = document.getElementById("notes-overlay");
  var notesDialog = document.getElementById("notes-dialog");
  var notesClose = document.getElementById("notes-close");
  var notesList = document.getElementById("notes-list");
  var notesSummary = document.getElementById("notes-summary");
  var notesSort = document.getElementById("notes-sort");
  var notesRenderKey = "";
  var notesPreviousFocus = null;
  var notesRows = rows.filter(function(row){ return row.message && row.message.trim(); });
  notesSort.value = "recent";

  var mapTrigger = document.getElementById("map-trigger");
  var mapLinks = document.querySelectorAll("[data-map-trigger]");
  var mapOverlay = document.getElementById("map-overlay");
  var mapDialog = document.getElementById("map-dialog");
  var mapClose = document.getElementById("map-close");
  var mapFrame = document.querySelector(".map-frame");
  var mapPreviousFocus = null;

  var vigilTriggers = document.querySelectorAll(".vigil-trigger");
  var vigilOverlay = document.getElementById("vigil-overlay");
  var vigilDialog = document.getElementById("vigil-dialog");
  var vigilClose = document.getElementById("vigil-close");
  var vigilPreviousFocus = null;

  function closeNotes(){
    if(notesOverlay.hidden) return;
    notesOverlay.hidden = true;
    document.body.classList.remove("notes-open");
    if(notesPreviousFocus) notesPreviousFocus.focus();
  }

  function openMap(trigger){
    mapPreviousFocus = trigger || document.activeElement;
    mapOverlay.hidden = false;
    document.body.classList.add("map-open");
    mapDialog.focus();
    if(!mapFrame.getAttribute("src")){
      mapFrame.setAttribute("src", mapFrame.getAttribute("data-src"));
    }else{
      focusMapOnLouisa();
    }
  }

  function focusMapOnLouisa(){
    window.requestAnimationFrame(function(){
      try{
        if(mapFrame.contentWindow && typeof mapFrame.contentWindow.focusLouisa === "function"){
          mapFrame.contentWindow.focusLouisa();
        }
      }catch(error){}
    });
  }

  function closeMap(){
    if(mapOverlay.hidden) return;
    mapOverlay.hidden = true;
    document.body.classList.remove("map-open");
    if(mapPreviousFocus) mapPreviousFocus.focus();
  }

  function openVigil(trigger){
    vigilPreviousFocus = trigger || document.activeElement;
    vigilOverlay.hidden = false;
    document.body.classList.add("vigil-open");
    vigilDialog.focus();
  }

  function closeVigil(){
    if(vigilOverlay.hidden) return;
    vigilOverlay.hidden = true;
    document.body.classList.remove("vigil-open");
    if(vigilPreviousFocus) vigilPreviousFocus.focus();
  }

  function renderNotes(noteRows){
    var key = notesSort.value + "\u0003" + noteRows.map(function(row){
      return row.name + "\u0001" + row.zip + "\u0001" + row.message;
    }).join("\u0002");
    if(key === notesRenderKey) return;
    notesRenderKey = key;
    notesList.innerHTML = "";
    noteRows.forEach(function(row){
      var note = document.createElement("article");
      note.className = "mayor-note";
      var quote = document.createElement("blockquote");
      quote.textContent = row.message.trim();
      var footer = document.createElement("footer");
      footer.textContent = row.name;
      var zip = document.createElement("span");
      zip.className = "note-zip";
      zip.textContent = row.zip;
      footer.appendChild(zip);
      note.appendChild(quote);
      note.appendChild(footer);
      notesList.appendChild(note);
    });
  }

  function sortedNotes(){
    var sorted = notesRows.slice();
    if(notesSort.value === "recent"){
      sorted.reverse();
    }else{
      sorted.sort(function(a,b){
        return lastNameKey(a.name).localeCompare(lastNameKey(b.name), undefined, {sensitivity:"base"});
      });
    }
    return sorted;
  }

  function updateNotesSummary(){
    var count = notesRows.length;
    notesSummary.textContent = count.toLocaleString() + " " + (count === 1 ? "note" : "notes") +
      " from signatories, " + (notesSort.value === "recent" ? "newest first." : "alphabetized by last name.");
  }

  notesTrigger.addEventListener("click", function(){
    notesPreviousFocus = document.activeElement;
    notesOverlay.hidden = false;
    document.body.classList.add("notes-open");
    notesDialog.focus();
  });
  notesClose.addEventListener("click", closeNotes);
  notesOverlay.addEventListener("click", function(event){ if(event.target === notesOverlay) closeNotes(); });
  notesSort.addEventListener("change", function(){ updateNotesSummary(); renderNotes(sortedNotes()); });

  mapTrigger.addEventListener("click", function(){ openMap(mapTrigger); });
  mapLinks.forEach(function(link){
    link.addEventListener("click", function(event){ event.preventDefault(); openMap(link); });
  });
  mapFrame.addEventListener("load", function(){ if(!mapOverlay.hidden) focusMapOnLouisa(); });
  mapClose.addEventListener("click", closeMap);
  mapOverlay.addEventListener("click", function(event){ if(event.target === mapOverlay) closeMap(); });

  vigilTriggers.forEach(function(trigger){ trigger.addEventListener("click", function(){ openVigil(trigger); }); });
  vigilClose.addEventListener("click", closeVigil);
  vigilOverlay.addEventListener("click", function(event){ if(event.target === vigilOverlay) closeVigil(); });

  document.addEventListener("keydown", function(event){
    if(event.key === "Escape"){
      closeNotes();
      closeMap();
      closeVigil();
    }
  });

  function resetOverlays(){
    notesOverlay.hidden = true;
    mapOverlay.hidden = true;
    vigilOverlay.hidden = true;
    document.body.classList.remove("notes-open", "map-open", "vigil-open");
  }
  resetOverlays();
  window.addEventListener("pageshow", resetOverlays);

  var BOSTON_ZIPS = {
    "02108":true,"02109":true,"02110":true,"02111":true,"02112":true,"02113":true,"02114":true,"02115":true,"02116":true,"02117":true,
    "02118":true,"02119":true,"02120":true,"02121":true,"02122":true,"02123":true,"02124":true,"02125":true,"02126":true,
    "02127":true,"02128":true,"02129":true,"02130":true,"02131":true,"02132":true,"02133":true,"02134":true,
    "02135":true,"02136":true,"02137":true,"02163":true,"02196":true,"02199":true,"02201":true,"02202":true,
    "02203":true,"02204":true,"02205":true,"02206":true,"02207":true,"02208":true,"02209":true,"02210":true,
    "02211":true,"02212":true,"02213":true,"02214":true,"02215":true,"02216":true,"02217":true
  };
  var SOMERVILLE_ZIPS = {"02143":true,"02144":true,"02145":true};
  var CAMBRIDGE_ZIPS = {"02138":true,"02139":true,"02140":true,"02141":true,"02142":true};
  var BROOKLINE_ZIPS = {"02445":true,"02446":true,"02447":true,"02467":true};

  function isMassachusettsZip(zip){
    return /^(?:0(?:1\d|2[0-7])\d{2}|055\d{2})$/.test(String(zip || "").trim());
  }

  function signerGroup(zip){
    zip = String(zip || "").trim();
    if(BOSTON_ZIPS[zip]) return "boston";
    if(SOMERVILLE_ZIPS[zip]) return "somerville";
    if(CAMBRIDGE_ZIPS[zip]) return "cambridge";
    if(BROOKLINE_ZIPS[zip]) return "brookline";
    return isMassachusettsZip(zip) ? "massachusetts" : "elsewhere";
  }

  function renderSignerList(box, signerRows, startIndex){
    signerRows.forEach(function(row, index){
      var signer = document.createElement("div");
      signer.className = "signer";
      signer.textContent = row.name + " ";
      var zip = document.createElement("span");
      zip.className = "z";
      zip.textContent = row.zip;
      signer.appendChild(zip);
      if(row.message && row.message.trim()){
        var tooltip = document.createElement("span");
        var tooltipId = "comment-" + (startIndex + index);
        tooltip.className = "comment-tooltip";
        tooltip.id = tooltipId;
        tooltip.setAttribute("role", "tooltip");
        tooltip.textContent = row.message.trim();
        signer.classList.add("has-comment");
        signer.tabIndex = 0;
        signer.setAttribute("aria-describedby", tooltipId);
        var marker = document.createElement("span");
        marker.className = "comment-marker";
        marker.setAttribute("aria-hidden", "true");
        signer.appendChild(marker);
        signer.appendChild(tooltip);
      }
      box.appendChild(signer);
    });
  }

  function renderWall(){
    var commentCount = notesRows.length;
    document.getElementById("wallhint").textContent =
      "A yellow dot marks a signer who left a note — hover or focus their name to read one of " +
      commentCount.toLocaleString() + " comments to the Mayor.";
    notesTrigger.hidden = !commentCount;
    notesTrigger.textContent = "Read " + commentCount.toLocaleString() + " " +
      (commentCount === 1 ? "note" : "notes") + " to the Mayor";
    updateNotesSummary();
    renderNotes(sortedNotes());

    var alphabetized = rows.slice().sort(function(a,b){
      return lastNameKey(a.name).localeCompare(lastNameKey(b.name), undefined, {sensitivity:"base"});
    });
    var grouped = {boston:[],somerville:[],cambridge:[],brookline:[],massachusetts:[],elsewhere:[]};
    alphabetized.forEach(function(row){ grouped[signerGroup(row.zip)].push(row); });
    var groups = [
      {key:"boston",groupId:null,labelId:"boston-label",boxId:"wallnames",label:"Boston signatories"},
      {key:"somerville",groupId:"somerville-group",labelId:"somerville-label",boxId:"somerville-wallnames",label:"Somerville signatories"},
      {key:"cambridge",groupId:"cambridge-group",labelId:"cambridge-label",boxId:"cambridge-wallnames",label:"Cambridge signatories"},
      {key:"brookline",groupId:"brookline-group",labelId:"brookline-label",boxId:"brookline-wallnames",label:"Brookline signatories"},
      {key:"massachusetts",groupId:"massachusetts-group",labelId:"massachusetts-label",boxId:"massachusetts-wallnames",label:"Elsewhere in Massachusetts"},
      {key:"elsewhere",groupId:"elsewhere-group",labelId:"elsewhere-label",boxId:"elsewhere-wallnames",label:"Elsewhere"}
    ];
    var position = 0;
    groups.forEach(function(group){
      var groupRows = grouped[group.key];
      var box = document.getElementById(group.boxId);
      box.innerHTML = "";
      document.getElementById(group.labelId).textContent = group.label + " (" + groupRows.length.toLocaleString() + ")";
      if(group.groupId) document.getElementById(group.groupId).hidden = !groupRows.length;
      renderSignerList(box, groupRows, position);
      position += groupRows.length;
    });
    document.getElementById("wallcount").textContent = rows.length.toLocaleString() + " signatories — in alphabetical order.";
    document.getElementById("wall").style.display = "block";
  }

  renderWall();
})();
