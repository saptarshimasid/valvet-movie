"use client";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowUpRight, Check, Clock3, MapPin, Menu, Ticket, X, Play, Sparkles, Plus, Minus, ShoppingBag, Wine, Flame } from "lucide-react";

const films = [
  { title: "ASTRA", type: "SCI-FI / ADVENTURE", length: "2H 18M", img: "/films/astra.webp", alt: "Astronaut beneath a red eclipse" },
  { title: "AFTER THE RAIN", type: "ROMANCE / DRAMA", length: "1H 52M", img: "/films/after-rain.webp", alt: "Two people at a rainy railway platform" },
  { title: "THE LAST LIGHT", type: "MYSTERY / THRILLER", length: "2H 06M", img: "/films/last-light.webp", alt: "Woman on a foggy coastal road near a lighthouse" },
];
const moods = [
  { name:"Go beyond", feeling:"A little wonder", detail:"For the nights you want to leave Earth behind.", film:"ASTRA", symbol:"✳", tone:"cosmos" },
  { name:"Feel it all", feeling:"A lot of heart", detail:"For the stories that follow you home.", film:"AFTER THE RAIN", symbol:"♡", tone:"heart" },
  { name:"Stay curious", feeling:"A good mystery", detail:"For the thrill of one more twist.", film:"THE LAST LIGHT", symbol:"◈", tone:"mystery" },
];
const initialDays = [{label:"FRI",n:"25",full:"25 SEP 2026"},{label:"SAT",n:"26",full:"26 SEP 2026"},{label:"SUN",n:"27",full:"27 SEP 2026"},{label:"MON",n:"28",full:"28 SEP 2026"},{label:"TUE",n:"29",full:"29 SEP 2026"}];
const times = ["11:30 AM","02:45 PM","06:15 PM","09:30 PM"];
const taken = new Set(["E3","E4","D7","D8","C2","C8","B5","A1","A9"]);

const foodCategories = [
  { id: "all", label: "All Offerings" },
  { id: "snacks", label: "🍿 Gourmet Popcorn & Bites" },
  { id: "drinks", label: "🍸 Handcrafted Cocktails & Sips" },
  { id: "desserts", label: "🍫 Artisanal Epilogues" },
];

const menuItems = [
  {
    id: "popcorn",
    name: "Truffle & Smoked Butter Popcorn",
    category: "snacks",
    price: 480,
    badge: "Cinema Signature",
    img: "/food/popcorn.jpg",
    alt: "Artisanal truffle popcorn in copper bowl",
    desc: "Perigord black truffle shavings, warm French browned butter glaze, and Maldon smoked sea salt flakes.",
    notes: "Earthy · Brown Butter · Flaky Salt",
    calories: "420 kcal",
    pairedFilm: "ASTRA",
  },
  {
    id: "cocktail",
    name: "Velvet Noir Smoked Old Fashioned",
    category: "drinks",
    price: 620,
    badge: "House Reserve",
    img: "/food/cocktail.jpg",
    alt: "Handcrafted smoked cocktail with flamed orange zest",
    desc: "Single-cask oak aged bourbon, aromatic Angostura bitters, rich demerara syrup, and flamed citrus oil enveloped in Applewood smoke.",
    notes: "Aromatic · Oak Smoke · Candied Orange",
    calories: "190 kcal",
    pairedFilm: "THE LAST LIGHT",
  },
  {
    id: "sliders",
    name: "Truffle Wagyu Brioche Sliders",
    category: "snacks",
    price: 690,
    badge: "Chef's Small Plate",
    img: "/food/sliders.jpg",
    alt: "Wagyu beef sliders with melted gruyere and truffle aioli",
    desc: "A5 Wagyu beef duo, cave-aged Swiss Gruyère, balsamic caramelized sweet onions, black garlic truffle aioli on toasted brioche.",
    notes: "Savory Umami · Melty Gruyère · Herb Brioche",
    calories: "580 kcal",
    pairedFilm: "Intermission Favorite",
  },
  {
    id: "gelato",
    name: "Madagascar Gold Bourbon Gelato",
    category: "desserts",
    price: 440,
    badge: "Sweet Finale",
    img: "/food/gelato.jpg",
    alt: "Bourbon vanilla gelato with dark chocolate drip and 24k gold",
    desc: "Slow-churned bourbon vanilla bean gelato drizzled with warm Valrhona 70% dark chocolate ganache, crushed green Sicilian pistachios, and 24k gold leaf.",
    notes: "Silky Vanilla · Bittersweet Ganache · Gold Leaf",
    calories: "360 kcal",
    pairedFilm: "AFTER THE RAIN",
  },
];

const pairings = [
  {
    film: "ASTRA",
    tagline: "Cosmic Sci-Fi Sensory Flight",
    title: "The Starlight Flight",
    itemIds: ["popcorn", "cocktail"],
    itemsLabel: "Truffle & Smoked Butter Popcorn + Velvet Noir Cocktail",
    bundlePrice: 990,
    regularPrice: 1100,
    saving: 110,
    accent: "cosmos",
    sommelierQuote: "Rich earthy black truffle grounds the senses while aromatic applewood smoke and bourbon warmth evoke deep space exploration.",
  },
  {
    film: "AFTER THE RAIN",
    tagline: "Romantic Melodrama Duet",
    title: "The Velvet Waltz",
    itemIds: ["gelato", "cocktail"],
    itemsLabel: "Madagascar Gold Gelato + Velvet Noir Cocktail",
    bundlePrice: 950,
    regularPrice: 1060,
    saving: 110,
    accent: "heart",
    sommelierQuote: "Warm chocolate ganache melting over cold bourbon vanilla paired with dark citrus notes — bittersweet cinema poetry.",
  },
  {
    film: "THE LAST LIGHT",
    tagline: "Noir Coastal Mystery Board",
    title: "Midnight Lighthouse Board",
    itemIds: ["sliders", "cocktail"],
    itemsLabel: "Truffle Wagyu Sliders + Velvet Noir Cocktail",
    bundlePrice: 1180,
    regularPrice: 1310,
    saving: 130,
    accent: "mystery",
    sommelierQuote: "Bold, umami-packed Wagyu with caramelized onion richness matched with slow-sipping oak and citrus smoke.",
  },
];

const HERO_INTERVAL = 5000;
const heroTaglines = [
  { line1: "Make tonight", line2: "unforgettable." },
  { line1: "Feel every", line2: "raindrop." },
  { line1: "Chase the", line2: "last light." },
];

/* Floating particles for cinematic depth */
function HeroParticles() {
  const count = 18;
  return (
    <div className="hero-particles" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="hero-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${4 + Math.random() * 5}s`,
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            opacity: 0.15 + Math.random() * 0.4,
          }}
        />
      ))}
    </div>
  );
}

/* Word-by-word stagger animation wrapper */
const wordVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};
const singleWord = {
  hidden: { y: 80, opacity: 0, rotateX: 45 },
  visible: { y: 0, opacity: 1, rotateX: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  exit: { y: -50, opacity: 0, transition: { duration: 0.35, ease: [0.55, 0, 1, 0.45] } },
};

function AnimatedWords({ text, className }: { text: string; className?: string }) {
  return (
    <motion.span className={className} variants={wordVariants} style={{ display: "flex", flexWrap: "wrap", gap: "0 .32em" }}>
      {text.split(" ").map((word, i) => (
        <motion.span key={i} variants={singleWord} style={{ display: "inline-block" }}>
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

function HeroSection({ go, films: filmList }: { go: (id: string) => void; films: typeof films }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const advance = useCallback(() => {
    setActive(prev => (prev + 1) % filmList.length);
  }, [filmList.length]);

  /* Auto-cycle */
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(advance, HERO_INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, advance, active]);

  /* Progress bar restart animation */
  useEffect(() => {
    if (progressRef.current) {
      const bars = progressRef.current.querySelectorAll<HTMLElement>(".hero-prog-fill");
      bars.forEach((bar, i) => {
        bar.style.animation = "none";
        void bar.offsetWidth; // reflow
        bar.style.animation = "";
        if (i === active && !paused) {
          bar.style.animationName = "heroProgFill";
          bar.style.animationDuration = `${HERO_INTERVAL}ms`;
          bar.style.animationTimingFunction = "linear";
          bar.style.animationFillMode = "forwards";
        } else {
          bar.style.animationName = "none";
        }
      });
    }
  }, [active, paused]);

  const jumpTo = (i: number) => {
    setActive(i);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const film = filmList[active];
  const tagline = heroTaglines[active];

  return (
    <section
      id="top"
      className="hero pad"
      data-scroll-section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background film images with Ken Burns */}
      <div className="hero-bg-wrap" aria-hidden="true">
        <AnimatePresence initial={false}>
          <motion.div
            key={active}
            className={`hero-bg-slide hero-kb-${active % 3}`}
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={film.img} alt="" />
          </motion.div>
        </AnimatePresence>
        <div className="hero-bg-overlay" />
      </div>

      <HeroParticles />

      {/* Decorative orbit rings */}
      <div className="hero-orbit" data-parallax aria-hidden="true" />
      <div className="hero-orbit hero-orbit-2" aria-hidden="true" />

      {/* Main content with animated text */}
      <div className="hero-content">
        <motion.span
          className="kicker"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <i /> NOW SHOWING
        </motion.span>

        <h1>
          <AnimatePresence mode="wait">
            <motion.span
              key={`tagline-${active}`}
              className="hero-h1-inner"
              variants={wordVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <AnimatedWords text={tagline.line1} className="hero-h1-line" />
              <AnimatedWords text={tagline.line2} className="hero-h1-line hero-h1-em" />
            </motion.span>
          </AnimatePresence>
        </h1>

        <AnimatePresence mode="wait">
          <motion.p
            key={`desc-${active}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, delay: 0.55 }}
          >
            {film.type} · {film.length}
          </motion.p>
        </AnimatePresence>

        <motion.div
          className="hero-cta-row"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <button className="round-cta" onClick={() => go("films")}>
            Explore movies <ArrowUpRight size={20} />
          </button>
          <button className="hero-play-btn" onClick={() => go("booking")} aria-label="Book tickets">
            <Play size={18} fill="currentColor" />
          </button>
        </motion.div>
      </div>

      {/* Film info side panel */}
      <div className="hero-side" aria-hidden="true">
        <AnimatePresence mode="wait">
          <motion.div
            key={`side-${active}`}
            className="hero-side-inner"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6 }}
          >
            <span>0{active + 1} / 0{filmList.length}</span>
            <strong>{film.title}</strong>
            <span>{film.type}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom bar: progress + scroll prompt */}
      <div className="hero-bottom">
        <div className="hero-progress" ref={progressRef}>
          {filmList.map((f, i) => (
            <button
              key={f.title}
              className={`hero-prog-item${active === i ? " active" : ""}`}
              onClick={() => jumpTo(i)}
              aria-label={`Show ${f.title}`}
            >
              <span className="hero-prog-label">{f.title}</span>
              <span className="hero-prog-track">
                <span className="hero-prog-fill" />
              </span>
            </button>
          ))}
        </div>
        <button className="hero-scroll-btn" onClick={() => go("films")} aria-label="Scroll to explore">
          <ArrowDown size={19} />
          <span>SCROLL</span>
        </button>
      </div>
    </section>
  );
}

/* ── Preloader ── */
function Preloader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "reveal">("loading");

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 2200;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const pct = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - pct, 3);
      setProgress(Math.round(eased * 100));
      if (pct < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setPhase("reveal");
        setTimeout(onDone, 900);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onDone]);

  return (
    <motion.div
      className="preloader"
      initial={{ opacity: 1 }}
      animate={phase === "reveal" ? { opacity: 0, scale: 1.05 } : {}}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="preloader-inner">
        {/* Animated film reel icon */}
        <div className="preloader-reel">
          <svg viewBox="0 0 80 80" className="preloader-reel-svg" aria-hidden="true">
            <circle cx="40" cy="40" r="36" fill="none" stroke="#e3644525" strokeWidth="1.5" />
            <circle cx="40" cy="40" r="36" fill="none" stroke="#e36445" strokeWidth="2"
              strokeDasharray={`${progress * 2.26} 226`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 0.1s", transform: "rotate(-90deg)", transformOrigin: "center" }}
            />
            <circle cx="40" cy="40" r="5" fill="#e36445" className="preloader-dot" />
            {[0, 60, 120, 180, 240, 300].map(deg => (
              <circle key={deg} cx="40" cy="12" r="3" fill="#e3644555"
                style={{ transform: `rotate(${deg}deg)`, transformOrigin: "40px 40px" }}
              />
            ))}
          </svg>
        </div>

        {/* Logo text */}
        <motion.div
          className="preloader-logo"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <b className="logo-icon">✦</b>
          <span>VELVET<em>CINEMA</em></span>
        </motion.div>

        {/* Progress counter */}
        <motion.span
          className="preloader-pct"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {progress}%
        </motion.span>

        {/* Animated progress bar */}
        <div className="preloader-bar">
          <motion.div className="preloader-bar-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Tagline */}
        <motion.p
          className="preloader-tag"
          initial={{ opacity: 0 }}
          animate={{ opacity: progress > 30 ? 0.6 : 0 }}
          transition={{ duration: 0.5 }}
        >
          PREPARING YOUR EXPERIENCE
        </motion.p>
      </div>

      {/* Background particles */}
      <div className="preloader-particles" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i} className="preloader-spark" style={{
            left: `${15 + Math.random() * 70}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }} />
        ))}
      </div>
    </motion.div>
  );
}

export default function Home() {
  const container = useRef<HTMLDivElement>(null);
  const locoRef = useRef<any>(null);
  const [movie,setMovie] = useState(0), [day,setDay] = useState(1), [time,setTime] = useState(2);
  const [days,setDays] = useState(initialDays);
  const [seats,setSeats] = useState<string[]>(["C5","C6"]);
  const [seatMap,setSeatMap] = useState(false), [menu,setMenu] = useState(false), [confirmed,setConfirmed] = useState(false);
  const [mood,setMood] = useState(0);
  const [loaded,setLoaded] = useState(false);
  const [foodCategory, setFoodCategory] = useState<string>("all");
  const [foodCart, setFoodCart] = useState<Record<string, number>>({});
  const [activePairing, setActivePairing] = useState<number>(0);

  const addFood = (id: string) => {
    setFoodCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFood = (id: string) => {
    setFoodCart((prev) => {
      const count = prev[id] || 0;
      if (count <= 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: count - 1 };
    });
  };

  const addPairing = (index: number) => {
    const pair = pairings[index];
    setFoodCart((prev) => {
      const next = { ...prev };
      pair.itemIds.forEach((id) => {
        next[id] = (next[id] || 0) + 1;
      });
      return next;
    });
  };

  const foodItemCount = useMemo(() => {
    return Object.values(foodCart).reduce((a, b) => a + b, 0);
  }, [foodCart]);

  const foodTotal = useMemo(() => {
    return Object.entries(foodCart).reduce((total, [id, qty]) => {
      const item = menuItems.find((m) => m.id === id);
      return total + (item ? item.price * qty : 0);
    }, 0);
  }, [foodCart]);

  const filteredItems = useMemo(() => {
    if (foodCategory === "all") return menuItems;
    return menuItems.filter((item) => item.category === foodCategory);
  }, [foodCategory]);

  const handlePreloaderDone = useCallback(() => setLoaded(true), []);
  useEffect(() => {
    type BookingInput = { movieIndex:number; dayIndex:number; timeIndex:number; seats:string[] };
    type Context = { registerTool: (tool:object,options:{signal:AbortSignal}) => void | Promise<void> };
    const context=(document as Document & {modelContext?:Context}).modelContext;
    if (!context?.registerTool) return;
    const lifecycle=new AbortController();
    try {
      void Promise.resolve(context.registerTool({
        name:"configure_movie_booking",title:"Configure movie booking",
        description:"Select a movie, one of the next five days, a showtime, and available seats in the visible booking form. This stages a demo booking without payment.",
        inputSchema:{type:"object",properties:{movieIndex:{type:"integer",minimum:0,maximum:2},dayIndex:{type:"integer",minimum:0,maximum:4},timeIndex:{type:"integer",minimum:0,maximum:3},seats:{type:"array",minItems:1,maxItems:6,uniqueItems:true,items:{type:"string",pattern:"^[A-E][1-9]$"}}},required:["movieIndex","dayIndex","timeIndex","seats"],additionalProperties:false},
        annotations:{readOnlyHint:false,untrustedContentHint:false},
        execute(input:unknown) {
          const v=input as BookingInput;
          if (!v || !Number.isInteger(v.movieIndex) || v.movieIndex<0 || v.movieIndex>2 || !Number.isInteger(v.dayIndex) || v.dayIndex<0 || v.dayIndex>4 || !Number.isInteger(v.timeIndex) || v.timeIndex<0 || v.timeIndex>3 || !Array.isArray(v.seats) || v.seats.length<1 || v.seats.length>6 || new Set(v.seats).size!==v.seats.length || v.seats.some(id=>typeof id!=="string" || !/^[A-E][1-9]$/.test(id) || taken.has(id))) throw new Error("Invalid selection or unavailable seats.");
          setMovie(v.movieIndex);setDay(v.dayIndex);setTime(v.timeIndex);setSeats(v.seats);setSeatMap(true);setConfirmed(false);
          document.getElementById("booking")?.scrollIntoView({behavior:"smooth"});
          return {status:"staged",movie:films[v.movieIndex].title,seats:v.seats,totalINR:v.seats.length*320};
        }
      },{signal:lifecycle.signal})).catch(()=>{});
    } catch {}
    return () => lifecycle.abort();
  },[]);
  useEffect(() => {
    const parts = new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Kolkata",year:"numeric",month:"short",day:"2-digit"}).formatToParts(new Date());
    const val=(type:string)=>parts.find(p=>p.type===type)?.value||"";
    const base = new Date(Date.UTC(Number(val("year")),["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(val("month")),Number(val("day"))));
    setDays(Array.from({length:5},(_,i)=>{const d=new Date(base.getTime()+i*86400000);return {label:new Intl.DateTimeFormat("en-GB",{weekday:"short",timeZone:"UTC"}).format(d).toUpperCase(),n:String(d.getUTCDate()).padStart(2,"0"),full:new Intl.DateTimeFormat("en-GB",{day:"2-digit",month:"short",year:"numeric",timeZone:"UTC"}).format(d).toUpperCase()}}));
    setDay(0);
  },[]);
  useEffect(() => {
    let alive = true, loco: any, ScrollTrigger: any, refresh: (() => void) | undefined;
    (async () => {
      const [g,s,l] = await Promise.all([import("gsap"),import("gsap/ScrollTrigger"),import("locomotive-scroll")]);
      if (!alive || !container.current) return;
      const gsap = g.default; ScrollTrigger = s.ScrollTrigger; gsap.registerPlugin(ScrollTrigger);
      const el = container.current, reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduce && innerWidth > 767) {
        loco = new l.default({el,smooth:true,multiplier:.85,smartphone:{smooth:false},tablet:{smooth:false}});
        locoRef.current = loco;
        loco.on("scroll",ScrollTrigger.update);
        ScrollTrigger.scrollerProxy(el,{
          scrollTop(value?:number) { if (arguments.length) loco.scrollTo(value,{duration:0,disableLerp:true}); return loco.scroll.instance.scroll.y; },
          getBoundingClientRect() { return {top:0,left:0,width:innerWidth,height:innerHeight}; },
          pinType: el.style.transform ? "transform" : "fixed"
        });
        refresh = () => loco.update(); ScrollTrigger.addEventListener("refresh",refresh);
      }
      const scroller = loco ? {scroller:el} : {};
      if (!reduce) {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach(node => gsap.fromTo(node,{y:65,opacity:0},{y:0,opacity:1,duration:1.05,ease:"power3.out",scrollTrigger:{trigger:node,start:"top 88%",toggleActions:"play reverse play reverse",...scroller}}));
        gsap.utils.toArray<HTMLElement>("[data-image-reveal]").forEach(node => gsap.fromTo(node,{clipPath:"inset(0 0 100% 0)",scale:1.08},{clipPath:"inset(0 0 0% 0)",scale:1,duration:1.2,ease:"power3.inOut",scrollTrigger:{trigger:node,start:"top 90%",toggleActions:"play reverse play reverse",...scroller}}));
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach(node => gsap.fromTo(node,{yPercent:-12},{yPercent:12,ease:"none",scrollTrigger:{trigger:node.parentElement,start:"top bottom",end:"bottom top",scrub:true,...scroller}}));
        gsap.utils.toArray<HTMLElement>("[data-spin]").forEach(node => gsap.fromTo(node,{rotation:-38},{rotation:145,ease:"none",scrollTrigger:{trigger:node.parentElement,start:"top bottom",end:"bottom top",scrub:1,...scroller}}));
      }
      ScrollTrigger.refresh();
    })();
    return () => { alive=false; ScrollTrigger?.getAll().forEach((t:any)=>t.kill()); if (refresh) ScrollTrigger?.removeEventListener("refresh",refresh); loco?.destroy(); locoRef.current=null; };
  },[]);
  useEffect(() => { const timer=setTimeout(()=>locoRef.current?.update(),450); return ()=>clearTimeout(timer); },[seatMap, foodCategory, activePairing, foodCart]);
  const go=(id:string)=>{setMenu(false); const target=document.getElementById(id); if (!target)return; if(locoRef.current)locoRef.current.scrollTo(target);else target.scrollIntoView({behavior:"smooth"});};
  const pickSeat=(id:string)=>{if(taken.has(id))return;setConfirmed(false);setSeats(old=>old.includes(id)?old.filter(x=>x!==id):old.length<6?[...old,id]:old);};
  const chooseFilm=(i:number)=>{setMovie(i);setConfirmed(false);go("booking");};
  return <>
  <AnimatePresence>{!loaded && <Preloader onDone={handlePreloaderDone} />}</AnimatePresence>
  <div className={`site${loaded ? " site-ready" : ""}`} data-scroll-container ref={container}>
    <header className="header" data-scroll-section>
      <button className="logo" onClick={()=>go("top")} aria-label="Velvet Cinema home"><b className="logo-icon">✦</b> VELVET<span>CINEMA</span></button>
      <nav className={menu?"nav open":"nav"} aria-label="Main navigation">
        <button onClick={()=>go("films")}>Movies</button>
        <button onClick={()=>go("experience")}>Experience</button>
        <button onClick={()=>go("concessions")}>Concessions</button>
        <button onClick={()=>go("location")}>Location</button>
      </nav>
      <button className="header-cta" onClick={()=>go("booking")}>Book tickets <ArrowUpRight size={16}/></button>
      <button className="menu" onClick={()=>setMenu(!menu)} aria-label={menu?"Close menu":"Open menu"}>{menu?<X/>:<Menu/>}</button>
    </header>
    <main>
      <HeroSection go={go} films={films} />
      <div className="marquee" data-scroll-section><div>LIGHTS DOWN <span>✦</span> VOLUME UP <span>✦</span> THE WORLD AWAY <span>✦</span> LIGHTS DOWN <span>✦</span> VOLUME UP <span>✦</span> THE WORLD AWAY <span>✦</span></div></div>
      <section id="films" className="films pad" data-scroll-section>
        <div className="section-head" data-reveal><div><span className="kicker ink">01 / THE LINEUP</span><h2>Now <em>showing.</em></h2></div><p>One screen. A thousand places to go. Find the story that stays with you.</p></div>
        <div className="film-grid">{films.map((f,i)=><article className="film" key={f.title}><button className="poster" data-image-reveal onClick={()=>chooseFilm(i)} aria-label={"Book "+f.title}><img src={f.img} alt={f.alt} loading="lazy"/><span className="poster-number">0{i+1}</span><span className="poster-arrow"><ArrowUpRight/></span></button><div className="film-info"><span>{f.type}</span><span>{f.length}</span></div><button className="film-name" onClick={()=>chooseFilm(i)}><span>{f.title}</span><ArrowUpRight size={23}/></button></article>)}</div>
      </section>
      <section id="mood" className="mood-section pad" data-scroll-section>
        <div className="mood-heading" data-reveal><span className="kicker ink">02 / FOLLOW THE FEELING</span><h2>What's your<br/><em>kind of night?</em></h2><p>Pick a feeling. We'll find your film.</p></div>
        <div className="mood-stage">
          <div className="mood-list" role="group" aria-label="Choose a movie mood">{moods.map((m,i)=><button key={m.name} className={mood===i?"mood-option active":"mood-option"} aria-pressed={mood===i} onClick={()=>setMood(i)}><span className="mood-count">0{i+1}</span><span className="mood-name">{m.name}</span><ArrowUpRight size={25}/></button>)}</div>
          <div className="mood-display" data-reveal><AnimatePresence mode="wait"><motion.div key={mood} className={"mood-art "+moods[mood].tone} initial={{opacity:0,rotate:-8,scale:.88}} animate={{opacity:1,rotate:0,scale:1}} exit={{opacity:0,rotate:7,scale:1.08}} transition={{duration:.55,ease:[.2,.8,.2,1]}}><span className="mood-symbol" aria-hidden="true">{moods[mood].symbol}</span><span className="mood-stamp">VELVET / 0{mood+1}</span></motion.div></AnimatePresence><div className="mood-caption"><span>{moods[mood].feeling}</span><p>{moods[mood].detail}</p><button onClick={()=>chooseFilm(mood)}>Book {moods[mood].film} <ArrowUpRight size={19}/></button></div></div>
        </div>
      </section>
      <section id="experience" className="experience pad" data-scroll-section><div className="experience-glow" data-parallax/><div className="experience-copy"><span className="kicker">03 / MORE THAN A MOVIE</span><h2 data-reveal>Feel <em>every</em><br/>frame.</h2><p data-reveal>Step out of the everyday. Sink into your seat, let the sound surround you, and lose yourself in the story.</p><div className="stats" data-reveal><div><strong>4K</strong><span>CRYSTAL CLEAR</span></div><div><strong>360°</strong><span>IMMERSIVE SOUND</span></div><div><strong>100%</strong><span>MOVIE MAGIC</span></div></div></div><div className="experience-disc" aria-hidden="true">V<br/>C</div></section>
      
      {/* ── 04 / Concessions & Artisanal Parlour ── */}
      <section id="concessions" className="concessions pad" data-scroll-section>
        <div className="concessions-glow" aria-hidden="true" />
        <div className="section-head concessions-head" data-reveal>
          <div>
            <span className="kicker ink">04 / THE ARTISANAL PARLOUR</span>
            <h2>Savour every <em>scene.</em></h2>
          </div>
          <p>
            Artisanal truffle popcorn, chef-curated small plates, and smoky barrel-aged cocktails — prepared fresh and delivered silently to your velvet lounger.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="food-tabs-wrapper" data-reveal>
          <div className="food-tabs" role="tablist" aria-label="Concession Categories">
            {foodCategories.map((cat) => (
              <button
                key={cat.id}
                role="tab"
                aria-selected={foodCategory === cat.id}
                className={`food-tab${foodCategory === cat.id ? " active" : ""}`}
                onClick={() => setFoodCategory(cat.id)}
              >
                <span>{cat.label}</span>
                {foodCategory === cat.id && (
                  <motion.div
                    className="food-tab-pill"
                    layoutId="foodTabIndicator"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
              </button>
            ))}
          </div>
          <div className="in-seat-badge">
            <Sparkles size={14} />
            <span>Silent In-Seat Delivery Included</span>
          </div>
        </div>

        {/* Menu Cards Grid */}
        <motion.div layout className="food-grid">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => {
              const qty = foodCart[item.id] || 0;
              return (
                <motion.article
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.45 }}
                  className="food-card"
                >
                  <div className="food-img-wrap">
                    <img src={item.img} alt={item.alt} loading="lazy" />
                    <span className="food-badge">{item.badge}</span>
                    <span className="food-film-tag">Pair: {item.pairedFilm}</span>
                  </div>
                  <div className="food-body">
                    <div className="food-title-row">
                      <h3 className="food-title">{item.name}</h3>
                      <span className="food-price">₹{item.price}</span>
                    </div>
                    <p className="food-desc">{item.desc}</p>
                    <div className="food-meta">
                      <span className="food-notes">{item.notes}</span>
                      <span className="food-cal">{item.calories}</span>
                    </div>
                    <div className="food-card-action">
                      {qty === 0 ? (
                        <button
                          className="food-add-btn"
                          onClick={() => addFood(item.id)}
                          aria-label={`Add ${item.name} to seat delivery`}
                        >
                          <Plus size={16} />
                          <span>Add to In-Seat Tray</span>
                        </button>
                      ) : (
                        <div className="food-qty-selector">
                          <button
                            onClick={() => removeFood(item.id)}
                            aria-label={`Decrease ${item.name}`}
                          >
                            <Minus size={15} />
                          </button>
                          <span className="food-qty-val">
                            <Check size={14} /> {qty} on Tray
                          </span>
                          <button
                            onClick={() => addFood(item.id)}
                            aria-label={`Increase ${item.name}`}
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Sommelier Film & Flavor Pairing Stage */}
        <div className="pairing-stage" data-reveal>
          <div className="pairing-header">
            <div>
              <span className="kicker">FILM & FLAVOUR PAIRINGS</span>
              <h3>Curated by our Sommeliers</h3>
            </div>
            <p>Each screening has a signature tasting flight designed to deepen the cinematic atmosphere.</p>
          </div>

          <div className="pairing-film-tabs">
            {pairings.map((p, idx) => (
              <button
                key={p.film}
                className={`pairing-tab${activePairing === idx ? " active" : ""}`}
                onClick={() => setActivePairing(idx)}
              >
                <span>{p.film}</span>
                <small>{p.tagline}</small>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activePairing}
              className={`pairing-card ${pairings[activePairing].accent}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
            >
              <div className="pairing-info">
                <span className="pairing-eyebrow">SOMMELIER SELECTION</span>
                <h4 className="pairing-title">{pairings[activePairing].title}</h4>
                <p className="pairing-items">{pairings[activePairing].itemsLabel}</p>
                <blockquote className="pairing-quote">
                  "{pairings[activePairing].sommelierQuote}"
                </blockquote>
              </div>
              <div className="pairing-action-box">
                <div className="pairing-pricing">
                  <span className="pairing-save-badge">Save ₹{pairings[activePairing].saving}</span>
                  <div className="pairing-price-row">
                    <span className="pairing-total">₹{pairings[activePairing].bundlePrice}</span>
                    <span className="pairing-original">₹{pairings[activePairing].regularPrice}</span>
                  </div>
                  <small>Delivered together at screening</small>
                </div>
                <button
                  className="pairing-add-btn"
                  onClick={() => addPairing(activePairing)}
                >
                  <ShoppingBag size={17} />
                  <span>Add Pairing Flight</span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating In-Seat Tray Indicator Bar */}
        <AnimatePresence>
          {foodItemCount > 0 && (
            <motion.div
              className="food-tray-bar"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.4 }}
            >
              <div className="tray-details">
                <span className="tray-icon">🍿</span>
                <div>
                  <strong>{foodItemCount} refreshment{foodItemCount > 1 ? "s" : ""} on Tray · ₹{foodTotal}</strong>
                  <span>Delivered to your seat when you arrive</span>
                </div>
              </div>
              <div className="tray-actions">
                <button className="tray-clear-btn" onClick={() => setFoodCart({})}>
                  Clear
                </button>
                <button className="tray-proceed-btn" onClick={() => go("booking")}>
                  Proceed to Seats <ArrowUpRight size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section id="booking" className="booking pad" data-scroll-section>
        <div className="section-head" data-reveal><div><span className="kicker ink">05 / YOUR NIGHT, YOUR WAY</span><h2>Book your <em>moment.</em></h2></div><p>A few simple choices between you and the big screen.</p></div>
        <div className="booking-grid"><div className="choices">
          <div className="choice"><h3><span>01</span> Choose your film</h3><div className="film-options">{films.map((f,i)=><button key={f.title} className={movie===i?"active":""} onClick={()=>{setMovie(i);setConfirmed(false)}}>{f.title}{movie===i?<Check size={16}/>:<ArrowUpRight size={16}/>}</button>)}</div></div>
          <div className="choice"><h3><span>02</span> Pick a day</h3><div className="day-options">{days.map((d,i)=><button key={d.n} className={day===i?"active":""} onClick={()=>{setDay(i);setConfirmed(false)}}><span>{d.label}</span><strong>{d.n}</strong></button>)}</div></div>
          <div className="choice"><h3><span>03</span> Choose a showtime</h3><div className="time-options">{times.map((t,i)=><button key={t} className={time===i?"active":""} onClick={()=>{setTime(i);setConfirmed(false)}}>{t}</button>)}</div></div>
          <div className="choice"><h3><span>04</span> Find your seats</h3><button className="seat-link" onClick={()=>setSeatMap(!seatMap)}>{seatMap?"Hide seat map":"Select seats"} <span>{seatMap?"−":"+"}</span></button><AnimatePresence>{seatMap&&<motion.div className="seat-panel" initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}><div className="screen">SCREEN</div>{["E","D","C","B","A"].map(r=><div className="seat-row" key={r}><span>{r}</span>{Array.from({length:9},(_,i)=>{const id=r+(i+1);return <button key={id} className={"seat "+(seats.includes(id)?"selected":"")} disabled={taken.has(id)} onClick={()=>pickSeat(id)} aria-label={"Seat "+id+(taken.has(id)?", unavailable":"")} aria-pressed={seats.includes(id)}/>})}<span>{r}</span></div>)}<div className="legend"><span><i/> Available</span><span><i className="selected"/> Selected</span><span><i className="taken"/> Taken</span></div><small>Select up to 6 seats.</small></motion.div>}</AnimatePresence></div>
        </div><aside className="summary"><div className="summary-label">YOUR BOOKING <Ticket size={22}/></div><div className="summary-title"><small>VELVET CINEMA PRESENTS</small><h3>{films[movie].title}</h3><p>{films[movie].type}</p></div><div className="summary-lines"><div><span>DATE</span><strong>{days[day].full}</strong></div><div><span>TIME</span><strong>{times[time]}</strong></div><div><span>SEATS</span><strong>{seats.length?seats.join(", "):"Select seats"}</strong></div>{foodTotal > 0 && <div><span>CONCESSIONS</span><strong>₹{foodTotal} ({foodItemCount} items)</strong></div>}<div><span>LOCATION</span><strong>Kolkata</strong></div></div><div className="total"><span>TOTAL · {seats.length} TICKETS{foodTotal > 0 ? " + CONCESSIONS" : ""}</span><strong>₹{seats.length*320 + foodTotal}</strong></div><button className="reserve" disabled={!seats.length} onClick={()=>setConfirmed(true)}>Reserve seats <ArrowUpRight size={19}/></button><AnimatePresence>{confirmed&&<motion.p className="confirmed" role="status" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}><Check size={17}/> Your selection is ready. This is a demo booking; no payment has been taken.</motion.p>}</AnimatePresence><small className="demo">Demo experience · no payment is collected</small></aside></div>
      </section>
      <section id="ritual" className="ritual pad" data-scroll-section>
        <div className="ritual-intro" data-reveal><span className="kicker">06 / THE NIGHT UNFOLDS</span><h2>From the first<br/><em>click</em> to the<br/>final scene.</h2><p>The best part of a movie night starts before the lights go down.</p></div>
        <div className="ritual-reel" data-spin aria-hidden="true"><span>V</span><i/><i/><i/><i/><i/><i/><i/><i/></div>
        <div className="ritual-acts"><article data-reveal><span>ACT 01 / ANTICIPATION</span><strong>Choose the story.</strong><p>Find the film that feels like tonight.</p></article><article data-reveal><span>ACT 02 / ARRIVAL</span><strong>Find your place.</strong><p>Your seat is waiting. The room begins to hush.</p></article><article data-reveal><span>ACT 03 / ESCAPE</span><strong>Let go.</strong><p>The screen glows. Everything else fades away.</p></article></div>
        <button className="ritual-cta" onClick={()=>go("booking")}>Make a night of it <ArrowUpRight size={19}/></button>
      </section>
      <section className="interlude pad" data-scroll-section><span className="stars">✦ &nbsp; ✦ &nbsp; ✦</span><span className="kicker ink">07 / THE LITTLE THINGS</span><blockquote data-reveal>“For a couple of hours,<br/>the world can <em>wait.</em>”</blockquote><div className="small-rule"/><p>GOOD STORIES. GREAT SEATS. BETTER NIGHTS.</p></section>
      <section id="location" className="location pad" data-scroll-section>
        <div>
          <span className="kicker">08 / FIND US</span>
          <h2 data-reveal>Meet us at<br/><em>the movies.</em></h2>
          <p data-reveal>Your next night out is just around the corner.</p>
          <div className="location-details" data-reveal>
            <div><MapPin size={20}/> Velvet Cinema<br/>Kolkata, West Bengal</div>
            <div><Clock3 size={20}/> Doors open daily<br/>10:30 AM – 11:30 PM</div>
          </div>
          <button className="location-link" onClick={()=>go("booking")}>Choose your show <ArrowUpRight size={20}/></button>
        </div>
        <div className="location-art" aria-hidden="true">
          <svg viewBox="0 0 500 500" className="location-art-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="locGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#7a3e2e" />
                <stop offset="42%" stopColor="#552c20" />
                <stop offset="78%" stopColor="#2e1b17" />
                <stop offset="100%" stopColor="#252625" />
              </radialGradient>
              <radialGradient id="locGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#e57252" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#e57252" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* Background full circular disc */}
            <circle cx="250" cy="250" r="236" fill="url(#locGrad)" />
            <circle cx="250" cy="250" r="236" fill="url(#locGlow)" />
            {/* Concentric rings - fully contained with margin */}
            <circle cx="250" cy="250" r="236" fill="none" stroke="#e57252" strokeWidth="1" opacity="0.2" />
            <circle cx="250" cy="250" r="215" fill="none" stroke="#e57252" strokeWidth="1.2" opacity="0.35" />
            <circle cx="250" cy="250" r="185" fill="none" stroke="#e57252" strokeWidth="1.8" strokeDasharray="3 3" opacity="0.55" />
            <circle cx="250" cy="250" r="180" fill="none" stroke="#e57252" strokeWidth="1.5" opacity="0.85" />
            <circle cx="250" cy="250" r="140" fill="none" stroke="#e57252" strokeWidth="1" opacity="0.25" />
            {/* V lettermark */}
            <text
              x="250"
              y="322"
              textAnchor="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontStyle="italic"
              fontSize="230"
              fill="#e57252"
              style={{ filter: "drop-shadow(0 14px 35px rgba(0, 0, 0, 0.6))" }}
            >
              V
            </text>
          </svg>
        </div>
      </section>
    </main>
    <footer className="footer pad" data-scroll-section><div className="footer-top"><div><span className="kicker ink">THE BEST SEAT IS WAITING</span><h2>See you <em>there.</em></h2></div><button onClick={()=>go("booking")} aria-label="Book tickets"><ArrowUpRight size={32}/></button></div><div className="footer-bottom"><span className="logo"><b className="logo-icon">✦</b> VELVET<span>CINEMA</span></span><span>© 2026 VELVET CINEMA</span><button onClick={()=>go("top")}>BACK TO TOP ↑</button></div></footer>
  </div>
  </>;
}
