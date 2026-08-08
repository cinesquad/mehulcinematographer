import"./hoisted.B410Xb_9.js";(function(){
  function d(e){return document.getElementById(e)}
  function u(e,a,i){e.addEventListener(a,i)}
  var n=d("videoGrid"),o=d("sortSelect"),
      f=Array.from(document.querySelectorAll(".cat-btn")),
      c=Array.from(document.querySelectorAll(".vid-card"));
  if(!n||!o)return;
  function activeCat(){var a=document.querySelector(".cat-btn.active");return a&&a.dataset.cat||"all"}
  function l(){
    var e=o.value,i=activeCat();
    c.sort(function(r,t){var s=Number(r.dataset.year)||0,v=Number(t.dataset.year)||0;return e==="newest"?v-s:s-v}),
    c.forEach(function(r){n.appendChild(r)}),
    n.classList.add("fading"),
    setTimeout(function(){
      var r=0;
      c.forEach(function(t){
        var s=i==="all"||t.dataset.cat===i;
        s?(t.style.display="",t.style.setProperty("--s",String(r++)),t.classList.remove("in"),t.offsetWidth,t.classList.add("in")):t.style.display="none"
      }),
      n.classList.remove("fading")
    },180)
  }
  function selectCat(name){
    var target=null;
    f.forEach(function(b){if(b.dataset.cat.toLowerCase()===String(name).toLowerCase())target=b});
    if(!target)return;
    f.forEach(function(a){a.classList.remove("active")}),
    target.classList.add("active"),
    l()
  }
  function syncUrl(){
    var cat=activeCat(),url=location.pathname+(cat==="all"?"":"?cat="+encodeURIComponent(cat));
    history.replaceState(null,"",url)
  }
  f.forEach(function(e){u(e,"click",function(){
    f.forEach(function(a){a.classList.remove("active")}),e.classList.add("active"),l(),syncUrl()
  })});
  u(o,"change",l);
  var wanted=new URLSearchParams(location.search).get("cat");
  if(wanted)selectCat(wanted);else l();
})();
