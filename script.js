const RATE = 4;
const WA = "13019195969";
const $ = (id) => document.getElementById(id);

function money(n){ return "$" + n.toFixed(2); }
function waLink(text){ return "https://wa.me/" + WA + "?text=" + encodeURIComponent(text); }

// burger
const burger = $("burger"), mm = $("mobilemenu");
if (burger) burger.addEventListener("click", () => {
  const open = mm.hasAttribute("hidden");
  if (open) mm.removeAttribute("hidden"); else mm.setAttribute("hidden","");
  burger.setAttribute("aria-expanded", String(open));
});
if (mm) mm.querySelectorAll("a").forEach(a => a.addEventListener("click", () => mm.setAttribute("hidden","")));

// hero mini calc
const heroLbs = $("heroLbs"), heroRange = $("heroRange"), heroTotal = $("heroTotal"), heroLbsLabel = $("heroLbsLabel"), heroWa = $("heroWa");
function syncHero(lbs){
  lbs = Math.max(0.5, Math.min(500, Math.round(Number(lbs)*2)/2 || 1));
  const total = lbs * RATE;
  heroLbs.value = lbs; heroRange.value = Math.min(60, lbs);
  heroTotal.textContent = money(total);
  heroLbsLabel.textContent = lbs + " lb";
  heroWa.href = waLink(`Hola La Esperanza 🙏 Mi envío pesa ${lbs} lb (~${money(total)}). Quiero cotizar.`);
}
if (heroLbs){
  heroLbs.addEventListener("input", e => syncHero(e.target.value));
  heroRange.addEventListener("input", e => syncHero(e.target.value));
  document.querySelectorAll('.hero__card [data-step]').forEach(b => b.addEventListener("click", () => syncHero(Number(heroLbs.value) + Number(b.dataset.step))));
  document.querySelectorAll('.hero__card [data-lbs]').forEach(b => b.addEventListener("click", () => {
    document.querySelectorAll('.hero__card [data-lbs]').forEach(x => x.classList.remove("on"));
    b.classList.add("on"); syncHero(b.dataset.lbs);
  }));
  syncHero(5);
}

// main calc
const lbs = $("lbs"), range = $("range"), total = $("total"), detail = $("detail"), waCalc = $("waCalc"), notes = $("notes");
let shipType = "Encomienda";
function syncMain(v){
  v = Math.max(0.5, Math.min(500, Math.round(Number(v)*2)/2 || 1));
  const t = v * RATE;
  lbs.value = v; range.value = Math.min(80, v);
  total.textContent = money(t);
  detail.textContent = `${v} lb × $${RATE}.00`;
  const extra = notes && notes.value.trim() ? ` (${notes.value.trim()})` : "";
  waCalc.href = waLink(`Hola La Esperanza 🙏 Cotización en línea: ${shipType}${extra} — ${v} lb = ${money(t)}. Quiero apartar mi espacio.`);
}
if (lbs){
  lbs.addEventListener("input", e => syncMain(e.target.value));
  range.addEventListener("input", e => syncMain(e.target.value));
  if (notes) notes.addEventListener("input", () => syncMain(lbs.value));
  $("minus").addEventListener("click", () => syncMain(Number(lbs.value) - 1));
  $("plus").addEventListener("click", () => syncMain(Number(lbs.value) + 1));
  document.querySelectorAll(".calc__tabs button").forEach(b => b.addEventListener("click", () => {
    document.querySelectorAll(".calc__tabs button").forEach(x => x.classList.remove("on"));
    b.classList.add("on"); shipType = b.dataset.type; syncMain(lbs.value);
  }));
  document.querySelectorAll(".calc .chips button").forEach(b => b.addEventListener("click", () => syncMain(b.dataset.lbs)));
  syncMain(8);
}

// reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target);} }), {threshold:.12});
document.querySelectorAll(".card,.calc,.route2,.eship__card,.faq details,.hero__card").forEach(el => { el.classList.add("reveal"); io.observe(el); });
