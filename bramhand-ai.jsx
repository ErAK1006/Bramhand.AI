import { useState, useEffect, useRef, useCallback } from "react";

/* ─── GLOBAL CSS ─────────────────────────────────────────────── */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Sora:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#04070f;--s0:#07101f;--s1:#0b1628;--s2:#101e36;--s3:#152440;
  --bdr:rgba(80,140,255,.13);--bdrH:rgba(80,140,255,.4);
  --gold:#f0c060;--blue:#4a8fff;--cyan:#00e5ff;--green:#00e896;--pink:#ff4fa0;--red:#ff5555;
  --t1:#e8eeff;--t2:#7a9cc8;--t3:#3a5878;
  --r:14px;--rL:20px;--tr:all .2s cubic-bezier(.4,0,.2,1);
}
body{background:var(--bg);color:var(--t1);font-family:'Inter',sans-serif;overflow-x:hidden}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:var(--s3);border-radius:99px}
#cvs{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.55}

/* HEADER */
.hdr{position:fixed;top:0;left:0;right:0;z-index:300;height:60px;display:flex;align-items:center;justify-content:space-between;padding:0 24px;background:rgba(4,7,15,.88);backdrop-filter:blur(24px);border-bottom:1px solid var(--bdr)}
.logo{display:flex;align-items:center;gap:10px;cursor:pointer;user-select:none}
.logo-ic{width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,#1a3a7a,#0a1f50);border:1px solid rgba(74,143,255,.35);display:flex;align-items:center;justify-content:center;font-size:15px;box-shadow:0 0 14px rgba(74,143,255,.2)}
.logo-name{font-family:'Sora',sans-serif;font-size:14px;font-weight:700;color:var(--gold)}
.logo-sub{font-size:9px;letter-spacing:2.5px;color:var(--t3);text-transform:uppercase}
.hdr-nav{display:flex;gap:2px}
.nb{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:8px;border:none;background:transparent;cursor:pointer;font-family:'Inter',sans-serif;font-size:12.5px;font-weight:500;color:var(--t2);transition:var(--tr);white-space:nowrap}
.nb:hover{background:var(--s1);color:var(--t1)}
.nb.on{background:rgba(74,143,255,.12);color:#7ab8ff;border:1px solid rgba(74,143,255,.2)}
.hdr-r{display:flex;gap:8px;align-items:center}
.tbtn{width:32px;height:32px;border-radius:8px;border:1px solid var(--bdr);background:var(--s1);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:13px;color:var(--t2);transition:var(--tr)}
.tbtn:hover{border-color:var(--bdrH);color:var(--t1)}
.pbtn{padding:7px 16px;border-radius:9px;font-size:12px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;transition:var(--tr);background:linear-gradient(135deg,var(--blue),var(--cyan));border:none;color:#fff}
.pbtn:hover{opacity:.85;transform:translateY(-1px)}

/* HERO */
.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:70px 20px 50px;position:relative;z-index:1}
.pill{display:inline-flex;align-items:center;gap:8px;padding:5px 14px;border-radius:99px;background:rgba(0,229,255,.07);border:1px solid rgba(0,229,255,.18);font-size:10.5px;letter-spacing:2.5px;color:var(--cyan);text-transform:uppercase;margin-bottom:24px}
.pill::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--cyan);animation:pd 2s infinite}
@keyframes pd{0%,100%{box-shadow:0 0 0 0 rgba(0,229,255,.5)}50%{box-shadow:0 0 0 6px rgba(0,229,255,0)}}
.h1{font-family:'Sora',sans-serif;font-size:clamp(42px,8vw,88px);font-weight:800;text-align:center;line-height:1.05;letter-spacing:-2px;margin-bottom:18px}
.h1 .l1{background:linear-gradient(135deg,#fff,#7ab8ff 50%,var(--cyan));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.h1 .l2{background:linear-gradient(135deg,var(--gold),#ffd080 50%,#c8902a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-size:.62em}
.hsub{font-size:15px;color:var(--t2);text-align:center;max-width:480px;line-height:1.75;margin-bottom:48px;font-weight:300}
.stats{display:flex;background:var(--s0);border:1px solid var(--bdr);border-radius:var(--rL);overflow:hidden;margin-top:52px}
.stat{padding:18px 34px;text-align:center;border-right:1px solid var(--bdr)}
.stat:last-child{border-right:none}
.sv{font-family:'Sora',sans-serif;font-size:24px;font-weight:700;color:var(--gold)}
.sl{font-size:9.5px;color:var(--t3);letter-spacing:2px;text-transform:uppercase;margin-top:3px}

/* SEARCH BOX */
.sb-wrap{width:100%;max-width:680px}
.cats{display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;justify-content:center}
.cp{padding:5px 13px;border-radius:99px;font-size:11.5px;font-weight:500;border:1px solid var(--bdr);background:var(--s0);color:var(--t2);cursor:pointer;transition:var(--tr)}
.cp:hover{border-color:var(--bdrH);color:var(--t1)}
.cp.on{background:rgba(74,143,255,.14);border-color:rgba(74,143,255,.38);color:#7ab8ff}
.sbar{display:flex;align-items:center;gap:10px;background:var(--s1);border:1px solid var(--bdr);border-radius:var(--rL);padding:7px 7px 7px 18px;box-shadow:0 4px 24px rgba(0,0,0,.5);transition:var(--tr)}
.sbar:focus-within{border-color:rgba(74,143,255,.45);box-shadow:0 4px 24px rgba(0,0,0,.5),0 0 0 3px rgba(74,143,255,.08)}
.si{flex:1;background:transparent;border:none;outline:none;font-family:'Inter',sans-serif;font-size:14.5px;color:var(--t1);caret-color:var(--cyan)}
.si::placeholder{color:var(--t3)}
.sgo{padding:10px 20px;border-radius:12px;background:linear-gradient(135deg,var(--blue),var(--cyan));border:none;color:#fff;font-weight:600;font-size:13px;cursor:pointer;font-family:'Inter',sans-serif;transition:var(--tr);display:flex;align-items:center;gap:7px}
.sgo:hover{opacity:.88}

/* SHORTCUTS GRID */
.shortcuts{display:grid;grid-template-columns:repeat(auto-fill,minmax(138px,1fr));gap:9px;max-width:800px;width:100%;margin-top:42px}
.sc{background:var(--s0);border:1px solid var(--bdr);border-radius:var(--r);padding:16px 10px;cursor:pointer;text-align:center;transition:var(--tr);font-family:'Inter',sans-serif;display:flex;flex-direction:column;align-items:center;gap:6px}
.sc:hover{border-color:rgba(74,143,255,.45);transform:translateY(-3px);box-shadow:0 8px 28px rgba(0,0,0,.4)}
.sc-ic{font-size:22px}
.sc-lb{font-size:11.5px;font-weight:600;color:var(--t2)}

/* PAGE */
.pw{max-width:1160px;margin:0 auto;padding:78px 24px 80px;position:relative;z-index:1}
.fade{animation:fu .25s ease}
@keyframes fu{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.section-bar{background:linear-gradient(var(--s0),var(--s1));border-bottom:1px solid var(--bdr);padding:70px 24px 0;position:relative;z-index:1}
.pg-h{font-family:'Sora',sans-serif;font-size:25px;font-weight:700;margin-bottom:5px}
.pg-s{font-size:13px;color:var(--t2);padding-bottom:22px}
.frow{display:flex;gap:7px;margin-bottom:24px;flex-wrap:wrap}
.fc{padding:6px 15px;border-radius:99px;font-size:12px;font-weight:500;border:1px solid var(--bdr);background:var(--s0);color:var(--t2);cursor:pointer;transition:var(--tr)}
.fc:hover,.fc.on{border-color:var(--blue);color:#7ab8ff;background:rgba(74,143,255,.1)}

/* CARDS */
.grid3{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:13px}
.card{background:var(--s0);border:1px solid var(--bdr);border-radius:var(--rL);padding:20px;transition:var(--tr);cursor:pointer}
.card:hover{border-color:var(--bdrH);box-shadow:0 8px 36px rgba(0,0,0,.5);transform:translateY(-3px)}
.c-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px}
.c-ic{font-size:28px}
.c-cat{font-size:9.5px;letter-spacing:2px;text-transform:uppercase;color:var(--t3);font-weight:600}
.c-title{font-size:15px;font-weight:600;color:var(--t1);margin-bottom:4px}
.c-meta{font-size:12px;color:var(--t3);margin-bottom:8px}
.c-desc{font-size:13px;color:var(--t2);line-height:1.65}
.stars{color:var(--gold);font-size:12px}
.rat{font-size:12px;color:var(--t2);margin-left:5px}
.cbar{height:3px;border-radius:99px;margin-bottom:13px}
.c-acts{display:flex;gap:8px;margin-top:13px}
.cbtn{flex:1;padding:8px;border-radius:9px;font-size:12px;font-weight:500;cursor:pointer;transition:var(--tr);font-family:'Inter',sans-serif;border:none}
.cbtn-g{background:var(--s2);border:1px solid var(--bdr) !important;color:var(--t2)}
.cbtn-g:hover{border-color:var(--bdrH) !important;color:var(--t1)}
.cbtn-b{background:rgba(74,143,255,.14);border:1px solid rgba(74,143,255,.28) !important;color:#7ab8ff}
.cbtn-b:hover{background:rgba(74,143,255,.22)}

/* RESULTS */
.rlist{display:flex;flex-direction:column;gap:10px}
.rcard{background:var(--s0);border:1px solid var(--bdr);border-radius:var(--rL);padding:18px 22px;cursor:pointer;transition:var(--tr)}
.rcard:hover{border-color:var(--bdrH);box-shadow:0 6px 28px rgba(0,0,0,.4);transform:translateY(-2px)}
.rtop{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.rbadge{font-size:9.5px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:3px 9px;border-radius:5px}
.rb-R{background:rgba(74,143,255,.14);color:#7ab8ff}
.rb-T{background:rgba(240,192,96,.12);color:var(--gold)}
.rb-B{background:rgba(0,232,150,.12);color:var(--green)}
.rb-J{background:rgba(255,79,160,.12);color:var(--pink)}
.rb-W{background:rgba(0,229,255,.12);color:var(--cyan)}
.rvenue{font-size:10.5px;color:var(--t3);margin-left:auto}
.rtitle{font-size:15.5px;font-weight:600;color:var(--t1);margin-bottom:3px}
.rsrc{font-size:12px;color:var(--t3);margin-bottom:7px}
.rdesc{font-size:13.5px;color:var(--t2);line-height:1.65;margin-bottom:10px}
.tags{display:flex;gap:6px;flex-wrap:wrap}
.tag{font-size:11px;padding:3px 9px;border-radius:6px;background:var(--s2);border:1px solid var(--bdr);color:var(--t3)}

/* JOBS */
.jlist{display:flex;flex-direction:column;gap:10px}
.jcard{background:var(--s0);border:1px solid var(--bdr);border-radius:var(--rL);padding:18px 22px;display:flex;align-items:center;gap:14px;cursor:pointer;transition:var(--tr)}
.jcard:hover{border-color:var(--bdrH);box-shadow:0 6px 28px rgba(0,0,0,.4);transform:translateY(-2px)}
.jlogo{width:44px;height:44px;border-radius:11px;background:var(--s2);border:1px solid var(--bdr);display:flex;align-items:center;justify-content:center;font-size:19px;flex-shrink:0}
.jinfo{flex:1}
.jt{font-size:15px;font-weight:600;color:var(--t1);margin-bottom:2px}
.jco{font-size:12.5px;color:var(--t2);margin-bottom:7px}
.jm{display:flex;gap:12px;font-size:11.5px;color:var(--t3);flex-wrap:wrap}
.jr{display:flex;flex-direction:column;align-items:flex-end;gap:8px;flex-shrink:0}
.jsal{font-size:14px;font-weight:700;color:var(--gold)}
.rem{font-size:10px;padding:2px 8px;border-radius:5px;font-weight:600;background:rgba(0,232,150,.1);color:var(--green);border:1px solid rgba(0,232,150,.22)}
.abtn{padding:8px 17px;border-radius:9px;background:linear-gradient(135deg,var(--blue),var(--cyan));border:none;color:#fff;font-size:12px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;transition:var(--tr)}
.abtn:hover{opacity:.85}

/* CHAT */
.cwrap{display:grid;grid-template-columns:210px 1fr;gap:13px;height:calc(100vh - 168px)}
.caside{background:var(--s0);border:1px solid var(--bdr);border-radius:var(--rL);padding:13px;overflow-y:auto;display:flex;flex-direction:column;gap:5px}
.cnew{width:100%;padding:9px;border-radius:9px;font-size:12.5px;font-weight:600;background:linear-gradient(135deg,var(--blue),var(--cyan));border:none;color:#fff;cursor:pointer;font-family:'Inter',sans-serif;margin-bottom:5px}
.alab{font-size:9px;letter-spacing:2.5px;color:var(--t3);text-transform:uppercase;padding:5px 4px 3px}
.cconv{padding:8px 10px;border-radius:8px;cursor:pointer;font-size:12px;color:var(--t2);transition:var(--tr);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cconv:hover{background:var(--s2);color:var(--t1)}
.cconv.on{background:rgba(74,143,255,.1);color:#7ab8ff}
.cbody{background:var(--s0);border:1px solid var(--bdr);border-radius:var(--rL);display:flex;flex-direction:column;overflow:hidden}
.ctop{padding:14px 20px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;gap:10px}
.ctop-t{font-size:13.5px;font-weight:600}
.ctop-s{font-size:11px;color:var(--t3)}
.msgs{flex:1;overflow-y:auto;padding:22px;display:flex;flex-direction:column;gap:16px}
.mrow{display:flex;gap:10px}
.mrow.usr{flex-direction:row-reverse}
.mav{width:29px;height:29px;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:12px;background:var(--s2);border:1px solid var(--bdr);font-weight:600;color:var(--t2)}
.mrow.usr .mav{background:rgba(74,143,255,.14);color:#7ab8ff}
.mbub{max-width:80%;padding:13px 17px;border-radius:15px;font-size:13.5px;line-height:1.72;color:var(--t1);background:var(--s1);border:1px solid var(--bdr);white-space:pre-wrap}
.mrow.usr .mbub{background:rgba(74,143,255,.1);border-color:rgba(74,143,255,.22)}
.msrcs{margin-top:9px;display:flex;gap:6px;flex-wrap:wrap}
.schip{font-size:11px;padding:3px 10px;border-radius:7px;background:rgba(240,192,96,.07);border:1px solid rgba(240,192,96,.18);color:var(--gold);cursor:pointer;text-decoration:none;transition:var(--tr)}
.schip:hover{background:rgba(240,192,96,.14)}
.tdots{display:flex;gap:5px;align-items:center;height:18px}
.td{width:7px;height:7px;border-radius:50%;background:var(--cyan);animation:bo 1.2s infinite}
.td:nth-child(2){animation-delay:.2s}.td:nth-child(3){animation-delay:.4s}
@keyframes bo{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-7px)}}
.cfooter{padding:12px 14px;border-top:1px solid var(--bdr);display:flex;gap:9px;align-items:flex-end}
.cta{flex:1;background:var(--s2);border:1px solid var(--bdr);border-radius:11px;padding:10px 14px;color:var(--t1);font-family:'Inter',sans-serif;font-size:13.5px;resize:none;outline:none;min-height:44px;max-height:120px;transition:var(--tr);line-height:1.55}
.cta:focus{border-color:rgba(74,143,255,.38)}
.cta::placeholder{color:var(--t3)}
.csend{width:42px;height:42px;border-radius:10px;background:linear-gradient(135deg,var(--blue),var(--cyan));border:none;color:#fff;cursor:pointer;font-size:17px;display:flex;align-items:center;justify-content:center;transition:var(--tr);flex-shrink:0}
.csend:hover{opacity:.88;transform:scale(1.05)}
.csend:disabled{opacity:.35;transform:none;cursor:default}

/* MODAL */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.78);backdrop-filter:blur(10px);z-index:400;display:flex;align-items:center;justify-content:center;padding:16px;animation:ov .2s ease}
@keyframes ov{from{opacity:0}to{opacity:1}}
.modal{background:var(--s0);border:1px solid var(--bdrH);border-radius:22px;width:100%;max-width:660px;max-height:88vh;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 24px 80px rgba(0,0,0,.8);animation:md .22s ease}
@keyframes md{from{opacity:0;transform:scale(.97) translateY(10px)}to{opacity:1;transform:none}}
.mh{padding:22px 26px 0;border-bottom:1px solid var(--bdr)}
.mh-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px}
.mclose{width:30px;height:30px;border-radius:7px;border:1px solid var(--bdr);background:var(--s2);color:var(--t2);cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:var(--tr)}
.mclose:hover{border-color:var(--bdrH);color:var(--t1)}
.mtabs{display:flex;gap:3px;margin-bottom:-1px}
.mtab{padding:8px 15px;border-radius:8px 8px 0 0;border:1px solid transparent;border-bottom:none;font-size:12px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;transition:var(--tr)}
.mtab.on{border-color:var(--bdrH);background:var(--bg);color:#7ab8ff}
.mtab:not(.on){color:var(--t3)}
.mtab:not(.on):hover{color:var(--t2)}
.mbody{padding:22px 26px;overflow-y:auto;flex:1;font-size:13.5px;color:var(--t2);line-height:1.78}
.mbody code{font-family:'JetBrains Mono',monospace;font-size:12px;background:var(--s2);padding:2px 7px;border-radius:5px;color:var(--cyan)}
.mbody pre{background:var(--s1);border:1px solid var(--bdr);border-radius:10px;padding:16px;font-family:'JetBrains Mono',monospace;font-size:11.5px;line-height:1.7;overflow-x:auto;white-space:pre;color:var(--t2);margin:10px 0}
.chlist{display:grid;grid-template-columns:1fr 1fr;gap:7px}
.chi{display:flex;gap:9px;padding:8px 11px;border-radius:8px;background:var(--s1);border:1px solid var(--bdr)}
.chin{font-size:9.5px;font-family:'JetBrains Mono',monospace;color:var(--t3);font-weight:600;margin-top:1px;min-width:18px}
.cht{font-size:12px;color:var(--t2);line-height:1.4}
.tpills{display:flex;flex-wrap:wrap;gap:9px}
.tpill{padding:8px 15px;border-radius:9px;background:rgba(74,143,255,.1);border:1px solid rgba(74,143,255,.22);color:#7ab8ff;font-size:13px;font-weight:500}
.ai-loading{display:flex;gap:6px;align-items:center;padding:8px 0}
.read-link{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:10px;background:linear-gradient(135deg,var(--blue),var(--cyan));color:#fff;font-size:13px;font-weight:600;text-decoration:none;border:none;cursor:pointer;font-family:'Inter',sans-serif;transition:var(--tr);margin-top:14px}
.read-link:hover{opacity:.86}

/* FOOTER */
.foot{border-top:1px solid var(--bdr);padding:32px 24px;display:flex;flex-direction:column;align-items:center;gap:9px;position:relative;z-index:1}
.foot-brand{font-family:'Sora',sans-serif;font-size:20px;font-weight:700;color:var(--gold)}
.foot-sub{font-size:12px;color:var(--t3);text-align:center}
.foot-tags{display:flex;gap:7px;flex-wrap:wrap;justify-content:center}
.ftag{font-size:10px;padding:3px 9px;border-radius:6px;background:var(--s1);border:1px solid var(--bdr);color:var(--t3)}

/* EMPTY */
.empty{text-align:center;padding:72px 20px;color:var(--t3)}
.empty-ic{font-size:48px;margin-bottom:14px;opacity:.55}

/* LIGHT */
.light{--bg:#f2f5ff;--s0:#fff;--s1:#edf0ff;--s2:#e2e8ff;--s3:#ced6f5;--bdr:rgba(74,143,255,.14);--t1:#0a1428;--t2:#3a5070;--t3:#8a9fc0}
@media(max-width:820px){.hdr-nav{display:none}.cwrap{grid-template-columns:1fr}.caside{display:none}.stats{flex-wrap:wrap}.stat{border-right:none;border-bottom:1px solid var(--bdr)}.chlist{grid-template-columns:1fr}}
`;

/* ─── DATA ────────────────────────────────────────────────────── */
const BOOKS = [
  { id:1, emoji:"📘", title:"Deep Learning", author:"Goodfellow, Bengio & Courville", year:2016, cat:"ML/AI", pages:775, rating:4.9,
    desc:"The definitive graduate-level textbook. Covers fundamentals through advanced generative models — written by three field pioneers. Freely available online.",
    topics:["Neural Networks","Backpropagation","CNNs","RNNs","Autoencoders","Generative Models","Optimization","Regularization"],
    chapters:["Introduction","Linear Algebra","Probability & Info Theory","Numerical Computation","ML Basics","Deep Feedforward Networks","Regularization","Optimization for DL","CNNs","Sequence Modeling","Practical Methodology","Applications","Linear Factor Models","Autoencoders","Representation Learning","Structured Probabilistic Models","Monte Carlo Methods","Confronting the Partition Function","Approximate Inference","Deep Generative Models"],
    link:"https://www.deeplearningbook.org" },
  { id:2, emoji:"📗", title:"Reinforcement Learning: An Introduction", author:"Sutton & Barto", year:2018, cat:"ML/AI", pages:548, rating:4.9,
    desc:"The canonical RL textbook. From MDPs and dynamic programming to TD learning, policy gradients and deep RL. Mathematical foundation every RL practitioner needs.",
    topics:["MDPs","Dynamic Programming","Monte Carlo","TD Learning","Q-Learning","Policy Gradients","Deep RL","Function Approximation"],
    chapters:["The RL Problem","Multi-armed Bandits","Finite MDPs","Dynamic Programming","Monte Carlo Methods","TD Learning","n-step Bootstrapping","Planning with Models","On-policy Approximation","Off-policy Approximation","Eligibility Traces","Policy Gradient Methods","Psychology","Neuroscience","Applications","Frontiers"],
    link:"http://incompleteideas.net/book/the-book-2nd.html" },
  { id:3, emoji:"📙", title:"The Alignment Problem", author:"Brian Christian", year:2020, cat:"AI Safety", pages:368, rating:4.7,
    desc:"A deeply researched narrative on making AI reliably do what we want. Covers reward hacking, distributional shift, interpretability and the human side of AI safety.",
    topics:["AI Safety","Reward Hacking","Interpretability","RLHF","Distributional Shift","Value Alignment","Robustness"],
    chapters:["Representation","Fairness","Transparency","Agency","Rewards","Robustness","Uncertainty","Scalable Oversight","Cooperative IRL","Conclusion"],
    link:"https://brianchristian.org/the-alignment-problem" },
  { id:4, emoji:"📕", title:"Superintelligence", author:"Nick Bostrom", year:2014, cat:"AI Safety", pages:328, rating:4.5,
    desc:"Rigorous philosophical analysis of machine intelligence surpassing human intelligence. Examines paths to superintelligence, the control problem, and survival strategies.",
    topics:["AGI","Control Problem","Orthogonality Thesis","Instrumental Convergence","X-Risk","Treacherous Turn"],
    chapters:["Past Developments","Paths to Superintelligence","Forms of Superintelligence","Decisive Strategic Advantage","Cognitive Superpowers","Motivation","The Control Problem","Oracles Genies Sovereigns","Multipolar Scenarios","Choosing Criteria","Crunch Time"],
    link:"https://nickbostrom.com/superintelligence.html" },
  { id:5, emoji:"📘", title:"Human Compatible", author:"Stuart Russell", year:2019, cat:"AI Ethics", pages:352, rating:4.8,
    desc:"A compelling re-architecting of AI: build machines uncertain about human preferences and learning them over time. A rigorous case for provably beneficial AI.",
    topics:["AI Alignment","CIRL","Value Uncertainty","Beneficial AI","Game Theory","AI Governance","Preference Learning"],
    chapters:["If We Succeed","The Idea of Intelligence","State of the Art","Miscast as the Bad Guy","Problem of Control","Can We Fix It","AI Superpowers","How to Win","Provably Beneficial AI","Conclusion"],
    link:"https://people.eecs.berkeley.edu/~russell/hc.html" },
  { id:6, emoji:"📗", title:"Life 3.0", author:"Max Tegmark", year:2017, cat:"Future AI", pages:384, rating:4.6,
    desc:"Accessible yet rigorous tour of AI futures — near-term disruption to superintelligence. Covers consciousness, ethics, economics, warfare and what it means to be human.",
    topics:["AGI Scenarios","Consciousness","AI Ethics","Economic Impact","AI Governance","Existential Risk","Futures"],
    chapters:["Welcome to the Most Important Conversation","Matter Turns Intelligent","The Near Future","Intelligence Explosion","Aftermath","Our Cosmic Endowment","Goals","Consciousness","The Other Players","How to Proceed"],
    link:"https://futureoflife.org/background/life-3-0" },
  { id:7, emoji:"📙", title:"The Master Algorithm", author:"Pedro Domingos", year:2015, cat:"ML Theory", pages:352, rating:4.5,
    desc:"Engaging tour of the five major ML schools and the quest for one unifying algorithm. Covers symbolists, connectionists, evolutionaries, Bayesians and analogizers.",
    topics:["Symbolists","Connectionists","Evolutionaries","Bayesians","Analogizers","Unified ML","Theory"],
    chapters:["The Machine Learning Revolution","Master Algorithm","Hume's Problem of Induction","How Does Your Brain Learn","Evolution: Nature's Learning Algorithm","Church of Reverend Bayes","You Are What You Resemble","Learning Without a Teacher","Winning by Uniting","Master Algorithm is Found"],
    link:"https://homes.cs.washington.edu/~pedrod/masteralgo.html" },
  { id:8, emoji:"📕", title:"Atlas of AI", author:"Kate Crawford", year:2021, cat:"AI Ethics", pages:254, rating:4.4,
    desc:"Critical examination of AI's material and political dimensions — the mines, data centers, labor and power structures behind the seeming magic of machine intelligence.",
    topics:["AI Ethics","Labor","Data Colonialism","Surveillance","Power","Environmental Cost","Bias","Governance"],
    chapters:["Earth","Labor","Data","Classification","Affect","State","Space","Power"],
    link:"https://yalebooks.yale.edu/book/9780300209570/atlas-of-ai" },
];

const PAPERS = [
  { id:1, title:"Attention Is All You Need", authors:"Vaswani, Shazeer, Parmar et al.", year:2017, venue:"NeurIPS", cites:"98,400+", cat:"NLP", color:"#4a8fff",
    abstract:"Proposes the Transformer architecture, dispensing with recurrence and convolutions entirely in favor of attention mechanisms. Achieves state-of-the-art on machine translation with less training time.",
    contributions:["Multi-head self-attention mechanism","Positional encodings","Encoder-decoder Transformer","Scaled dot-product attention","Parallelizable training"],
    link:"https://arxiv.org/abs/1706.03762" },
  { id:2, title:"BERT: Pre-training of Deep Bidirectional Transformers", authors:"Devlin, Chang, Lee & Toutanova", year:2018, venue:"NAACL", cites:"54,200+", cat:"NLP", color:"#4a8fff",
    abstract:"Introduces BERT, pre-trained on masked language modeling and next sentence prediction. Fine-tuning achieves SOTA on 11 NLP tasks. Bidirectional context is crucial.",
    contributions:["Masked language modeling pre-training","Next sentence prediction","Bidirectional context encoding","Transfer learning for NLP","WordPiece tokenization"],
    link:"https://arxiv.org/abs/1810.04805" },
  { id:3, title:"Playing Atari with Deep Reinforcement Learning", authors:"Mnih, Kavukcuoglu, Silver et al.", year:2013, venue:"ICLR", cites:"18,900+", cat:"RL", color:"#00e896",
    abstract:"First deep learning model to successfully learn control policies directly from high-dimensional sensory input using RL. Outperforms all previous approaches on most Atari games.",
    contributions:["Deep Q-Network (DQN)","Experience replay buffer","Target network stabilization","End-to-end RL from pixels","Convolutional policy networks"],
    link:"https://arxiv.org/abs/1312.5602" },
  { id:4, title:"Generative Adversarial Networks", authors:"Goodfellow, Pouget-Abadie, Mirza et al.", year:2014, venue:"NeurIPS", cites:"63,100+", cat:"Generative", color:"#9b59b6",
    abstract:"Introduces the GAN framework: two networks trained in adversarial fashion. A generator creates samples; a discriminator tries to detect fakes. Generates remarkably realistic images.",
    contributions:["Adversarial training framework","Generator-discriminator minimax game","Implicit density estimation","High-quality image synthesis","Theoretical convergence analysis"],
    link:"https://arxiv.org/abs/1406.2661" },
  { id:5, title:"Constitutional AI: Harmlessness from AI Feedback", authors:"Bai, Jones, Ndousse et al. (Anthropic)", year:2022, venue:"arXiv", cites:"3,200+", cat:"Alignment", color:"#f0c060",
    abstract:"A scalable method to train helpful, harmless AI using AI-generated feedback guided by a set of principles (constitution). Reduces need for human harm labels significantly.",
    contributions:["Constitutional AI (CAI) framework","AI feedback for safety","RLHF with AI-generated critiques","Scalable harmlessness training","Principle-based revision"],
    link:"https://arxiv.org/abs/2212.08073" },
  { id:6, title:"Scaling Laws for Neural Language Models", authors:"Kaplan, McCandlish, Henighan et al.", year:2020, venue:"arXiv", cites:"9,800+", cat:"LLM", color:"#00e5ff",
    abstract:"Empirical study revealing smooth power-law relationships between model performance and compute budget, dataset size, and parameter count. Shapes how every major lab trains models.",
    contributions:["Power-law scaling relationships","Optimal compute allocation","Chinchilla-precursor insights","Data vs parameters tradeoffs","Training efficiency analysis"],
    link:"https://arxiv.org/abs/2001.08361" },
  { id:7, title:"Sparks of AGI: Early experiments with GPT-4", authors:"Bubeck, Chandrasekaran, Eldan et al. (Microsoft)", year:2023, venue:"arXiv", cites:"5,800+", cat:"LLM", color:"#00e5ff",
    abstract:"154-page evaluation of GPT-4 across diverse domains arguing it displays early AGI-like behaviors. Tests math, coding, medicine, law, art, and more with striking results.",
    contributions:["Multi-domain AGI evaluation","Novel benchmark design","Theory of mind experiments","Multi-step reasoning analysis","GPT-4 capability documentation"],
    link:"https://arxiv.org/abs/2303.12528" },
  { id:8, title:"AlphaFold: Highly accurate protein structure prediction", authors:"Jumper, Evans, Pritzel et al. (DeepMind)", year:2021, venue:"Nature", cites:"22,500+", cat:"Biology AI", color:"#ff4fa0",
    abstract:"Solves the 50-year-old protein folding problem with revolutionary accuracy. Uses attention-based architecture over multiple sequence alignments. Released predictions for nearly all known proteins.",
    contributions:["Evoformer attention architecture","End-to-end structure prediction","Structure module with invariant point attention","CASP14 dominance","Public protein database release"],
    link:"https://www.nature.com/articles/s41586-021-03819-2" },
];

const TOOLS = [
  { id:1, name:"Claude 3.5 Sonnet", cat:"Chatbot",  rating:4.9, color:"#e8b84b", emoji:"🤖", desc:"Anthropic's flagship model. Best-in-class reasoning, coding, and nuanced analysis. 200K context. Constitutional AI safety.", tags:["Free/Pro","API","200K ctx"], useFor:"Complex reasoning, coding, research, writing, analysis", link:"https://claude.ai" },
  { id:2, name:"GPT-4o",           cat:"Chatbot",  rating:4.8, color:"#10a37f", emoji:"💬", desc:"OpenAI's multimodal model. Real-time voice, vision, and text. Broad tool use and function calling.", tags:["Free/Pro","API","Multimodal"], useFor:"General tasks, image understanding, real-time voice, function calling", link:"https://chat.openai.com" },
  { id:3, name:"Gemini 1.5 Pro",   cat:"Chatbot",  rating:4.7, color:"#4285f4", emoji:"✨", desc:"Google DeepMind's model with 1M token context window and native multimodal input from day one.", tags:["Free/Pro","API","1M ctx"], useFor:"Long document analysis, code, multimodal tasks, Google integration", link:"https://gemini.google.com" },
  { id:4, name:"Midjourney v6",    cat:"Image Gen",rating:4.9, color:"#9b59b6", emoji:"🎨", desc:"Industry-leading AI image quality. Version 6 is near-photorealistic with exceptional prompt adherence.", tags:["Pro","Discord"], useFor:"Photorealistic images, concept art, product visuals, creative direction", link:"https://midjourney.com" },
  { id:5, name:"FLUX.1",           cat:"Image Gen",rating:4.8, color:"#e74c3c", emoji:"⚡", desc:"Black Forest Labs' open-weight model. Beats DALL-E 3 on multiple benchmarks. Fast, accurate, open.", tags:["Open","API","Fast"], useFor:"Developer image generation, local deployment, fine-tuning, commercial use", link:"https://blackforestlabs.ai" },
  { id:6, name:"Cursor",           cat:"Coding",   rating:4.9, color:"#00d4ff", emoji:"💻", desc:"AI-first IDE built on VSCode. Entire codebase context, autonomous multi-file editing, inline chat with any model.", tags:["Free/Pro","IDE","VSCode"], useFor:"Software development, refactoring, debugging, codebase exploration", link:"https://cursor.sh" },
  { id:7, name:"Perplexity AI",    cat:"Search",   rating:4.7, color:"#3a8fff", emoji:"🔍", desc:"AI-powered search with live web citations. Research-grade answers with source transparency.", tags:["Free/Pro","Citations"], useFor:"Research queries, fact checking, summarizing web content, cited answers", link:"https://perplexity.ai" },
  { id:8, name:"ElevenLabs",       cat:"Voice AI", rating:4.8, color:"#f39c12", emoji:"🎙", desc:"Ultra-realistic voice synthesis and cloning. 29 languages, 1000ms latency, voice design API.", tags:["Pro","API","Multilingual"], useFor:"Voiceovers, audiobooks, voice cloning, real-time TTS, game characters", link:"https://elevenlabs.io" },
  { id:9, name:"Runway Gen-3",     cat:"Video Gen",rating:4.6, color:"#e91e8c", emoji:"🎬", desc:"Most coherent AI video generation. Motion brush, camera controls, text-to-video and image-to-video.", tags:["Pro","API","HD"], useFor:"Short video clips, motion graphics, concept videos, visual effects", link:"https://runwayml.com" },
];

const JOBS = [
  { id:1, emoji:"🔬", title:"AI Research Scientist",      company:"Anthropic",  location:"San Francisco, CA", salary:"$220k–$350k", remote:false, tags:["AI Safety","Research","PhD"],  desc:"Lead alignment and interpretability research on frontier models. Work on constitutional AI, RLHF, and mechanistic interpretability. Co-author published research.", reqs:["PhD in ML/AI or related","Publications at top venues (NeurIPS/ICML/ICLR)","Python, JAX or PyTorch","Strong math background"], link:"https://anthropic.com/careers" },
  { id:2, emoji:"🤖", title:"Senior ML Engineer",         company:"DeepMind",   location:"London, UK",         salary:"£150k–£220k", remote:false, tags:["ML","Research","PyTorch"],   desc:"Lead research engineering on large-scale language and multimodal models. Collaborate with scientists on training infrastructure and evaluation systems.", reqs:["5+ years ML engineering","Distributed training (JAX/XLA preferred)","CUDA optimization experience","Strong software engineering fundamentals"], link:"https://deepmind.google/careers" },
  { id:3, emoji:"⚡", title:"LLM Platform Engineer",      company:"Mistral AI", location:"Remote",             salary:"€130k–€190k", remote:true,  tags:["Infra","CUDA","Remote"],    desc:"Design and scale distributed training infrastructure for open-weight frontier models. Work on Triton CUDA kernels and efficient inference serving.", reqs:["Strong C++/Python systems experience","CUDA / GPU programming","Distributed systems (Ray, NCCL)","Experience with LLM training runs"], link:"https://mistral.ai/jobs" },
  { id:4, emoji:"📊", title:"AI Product Manager",         company:"OpenAI",     location:"San Francisco, CA",  salary:"$200k–$280k", remote:false, tags:["PM","Strategy","LLM"],      desc:"Define the roadmap for developer-facing AI products. Work with research to bring frontier capabilities to market. Deep technical background required.", reqs:["5+ years product management","Technical background (CS degree or equivalent)","Experience shipping developer tools","Strong analytical and communication skills"], link:"https://openai.com/careers" },
  { id:5, emoji:"🏗", title:"ML Infrastructure Engineer", company:"Scale AI",   location:"Remote",             salary:"$160k–$220k", remote:true,  tags:["MLOps","Infra","Remote"],   desc:"Build and maintain the infrastructure powering large-scale data labeling and model evaluation. Kubernetes, distributed systems, ML pipeline optimization.", reqs:["Kubernetes & Docker expertise","Python, Go, or Rust","Distributed data systems","Cloud platforms (AWS/GCP)"], link:"https://scale.com/careers" },
  { id:6, emoji:"👁", title:"Computer Vision Researcher", company:"Meta AI",    location:"Menlo Park, CA",     salary:"$180k–$260k", remote:false, tags:["CV","Research","PyTorch"],  desc:"Research on foundational computer vision models — detection, segmentation, generation. Publish at top venues and open-source impact at scale.", reqs:["PhD in CV/ML","Publications at CVPR/ECCV/NeurIPS","PyTorch proficiency","Experience with large-scale training"], link:"https://ai.meta.com/careers" },
];

const ALL_RESULTS = [
  { type:"R", badge:"rb-R", label:"Research", title:"Attention Is All You Need", venue:"NeurIPS '17", src:"Vaswani et al. · arXiv", desc:"Foundational transformer paper replacing recurrence with multi-head self-attention. Most cited ML paper of the 2010s.", tags:["Transformers","NLP","Architecture"] },
  { type:"T", badge:"rb-T", label:"Tool",     title:"Claude 3.5 Sonnet",         venue:"2024",       src:"Anthropic · anthropic.com", desc:"Best-in-class reasoning and coding model with 200K context. Constitutional AI safety built in.", tags:["LLM","API","Safety"] },
  { type:"B", badge:"rb-B", label:"Book",     title:"Deep Learning",             venue:"Textbook",   src:"Goodfellow, Bengio & Courville · MIT Press", desc:"The definitive deep learning textbook. Free online. Covers everything from basics to generative models.", tags:["Foundations","Textbook","Math"] },
  { type:"J", badge:"rb-J", label:"Job",      title:"AI Research Scientist",     venue:"SF, CA",     src:"Anthropic · $220k–$350k", desc:"Lead alignment research on frontier models. Constitutional AI, RLHF, mechanistic interpretability.", tags:["Research","Safety","PhD"] },
  { type:"W", badge:"rb-W", label:"Web",      title:"State of AI Report 2024",   venue:"Annual",     src:"stateof.ai · October 2024", desc:"Comprehensive annual analysis of AI research, industry trends, compute costs, and policy developments.", tags:["Industry","2024","Report"] },
  { type:"R", badge:"rb-R", label:"Research", title:"Constitutional AI",         venue:"arXiv '22",  src:"Bai et al. · Anthropic", desc:"Scalable method to train harmless AI using AI-generated feedback guided by a set of written principles.", tags:["RLHF","Alignment","Safety"] },
  { type:"T", badge:"rb-T", label:"Tool",     title:"Cursor",                    venue:"IDE",        src:"cursor.sh · ★ 4.9", desc:"AI-first code editor. Entire codebase context, autonomous multi-file editing, best DX available.", tags:["Coding","IDE","Free/Pro"] },
  { type:"B", badge:"rb-B", label:"Book",     title:"Human Compatible",          venue:"AI Ethics",  src:"Stuart Russell · Viking Press", desc:"Rethinking AI to be uncertain about preferences and learn them. Rigorous case for provably beneficial AI.", tags:["Alignment","Ethics","CAIS"] },
];

/* ─── BACKGROUND CANVAS ──────────────────────────────────────── */
function BGCanvas() {
  const ref = useRef(null);
  useEffect(()=>{
    const c=ref.current; if(!c) return;
    const ctx=c.getContext("2d"); let W,H,raf;
    const pts=[];
    const init=()=>{
      W=c.width=window.innerWidth; H=c.height=window.innerHeight;
      pts.length=0;
      for(let i=0;i<80;i++) pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.15,vy:(Math.random()-.5)*.15,r:Math.random()*1.3+.3});
    };
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      for(let i=0;i<pts.length;i++){
        const p=pts[i]; p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<0)p.y=H; if(p.y>H)p.y=0;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle="rgba(100,160,255,.45)"; ctx.fill();
        for(let j=i+1;j<pts.length;j++){
          const q=pts[j],dx=p.x-q.x,dy=p.y-q.y,d=Math.sqrt(dx*dx+dy*dy);
          if(d<110){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(74,143,255,${(1-d/110)*.07})`;ctx.stroke()}
        }
      }
      raf=requestAnimationFrame(draw);
    };
    init(); draw();
    window.addEventListener("resize",init);
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",init)};
  },[]);
  return <canvas id="cvs" ref={ref}/>;
}

/* ─── MODAL WRAPPER ──────────────────────────────────────────── */
function Modal({onClose,children}){
  useEffect(()=>{document.body.style.overflow="hidden";return()=>{document.body.style.overflow=""}},[]);
  return(
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>{children}</div>
    </div>
  );
}

/* ─── AI CALL HELPER ─────────────────────────────────────────── */
async function callClaude(prompt){
  const r=await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]})
  });
  const d=await r.json();
  return d.content?.[0]?.text||"No response.";
}

/* ─── BOOK MODAL ─────────────────────────────────────────────── */
function BookModal({book,onClose}){
  const [tab,setTab]=useState("overview");
  const [sum,setSum]=useState(""); const [loading,setLoading]=useState(false);

  const loadSum=async()=>{
    if(sum){setTab("summary");return;}
    setTab("summary");setLoading(true);
    try{
      const t=await callClaude(`Give a rich 3-paragraph summary of "${book.title}" by ${book.author} (${book.year}). Cover: 1) Core thesis and importance, 2) Key ideas and frameworks readers will learn, 3) Who should read it and what they'll take away. Be specific and insightful.`);
      setSum(t);
    }catch{setSum("Failed to load. Please try again.");}
    setLoading(false);
  };

  return(
    <Modal onClose={onClose}>
      <div className="mh">
        <div className="mh-top">
          <div style={{display:"flex",gap:13,alignItems:"flex-start"}}>
            <div style={{fontSize:46,lineHeight:1,flexShrink:0}}>{book.emoji}</div>
            <div>
              <div style={{fontSize:10,letterSpacing:2,color:"var(--t3)",textTransform:"uppercase",marginBottom:4}}>{book.cat}</div>
              <div style={{fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:700,color:"var(--t1)",lineHeight:1.25,marginBottom:4}}>{book.title}</div>
              <div style={{fontSize:12.5,color:"var(--t2)",marginBottom:5}}>{book.author} · {book.year} · {book.pages} pages</div>
              <div className="stars">{"★".repeat(Math.floor(book.rating))}<span className="rat">{book.rating}</span></div>
            </div>
          </div>
          <button className="mclose" onClick={onClose}>✕</button>
        </div>
        <div className="mtabs">
          {[["overview","Overview"],["chapters","Chapters"],["topics","Topics"],["summary","AI Summary"]].map(([id,lb])=>(
            <button key={id} className={`mtab${tab===id?" on":""}`} onClick={()=>id==="summary"?loadSum():setTab(id)}>{lb}</button>
          ))}
        </div>
      </div>
      <div className="mbody">
        {tab==="overview"&&<div className="fade">
          <p style={{marginBottom:18}}>{book.desc}</p>
          <a className="read-link" href={book.link} target="_blank" rel="noreferrer">Read / Preview Online →</a>
        </div>}
        {tab==="chapters"&&<div className="fade chlist">
          {book.chapters.map((ch,i)=>(
            <div key={i} className="chi"><span className="chin">{String(i+1).padStart(2,"0")}</span><span className="cht">{ch}</span></div>
          ))}
        </div>}
        {tab==="topics"&&<div className="fade tpills">{book.topics.map((t,i)=><span key={i} className="tpill">{t}</span>)}</div>}
        {tab==="summary"&&<div className="fade">
          {loading?<div className="ai-loading"><div className="td"/><div className="td"/><div className="td"/><span style={{fontSize:13,color:"var(--t3)",marginLeft:8}}>Generating AI summary…</span></div>
          :<p style={{whiteSpace:"pre-wrap"}}>{sum}</p>}
        </div>}
      </div>
    </Modal>
  );
}

/* ─── PAPER MODAL ────────────────────────────────────────────── */
function PaperModal({paper,onClose}){
  const [tab,setTab]=useState("abstract");
  const [exp,setExp]=useState(""); const [loading,setLoading]=useState(false);

  const loadExp=async()=>{
    if(exp){setTab("explain");return;}
    setTab("explain");setLoading(true);
    try{const t=await callClaude(`Explain the research paper "${paper.title}" (${paper.year}) by ${paper.authors} in 3 clear paragraphs: 1) The problem it solves and why it matters, 2) The key technical idea/method, 3) Impact and what changed after this paper. Be precise but accessible to a smart non-expert.`);setExp(t);}
    catch{setExp("Failed to load explanation.");}
    setLoading(false);
  };

  return(
    <Modal onClose={onClose}>
      <div className="mh">
        <div className="mh-top">
          <div>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
              <span className="rbadge rb-R">{paper.cat}</span>
              <span style={{fontSize:10.5,padding:"2px 9px",borderRadius:6,background:paper.color+"1a",color:paper.color,fontWeight:600,fontSize:11}}>{paper.venue}</span>
              <span style={{fontSize:11,color:"var(--t3)"}}>{paper.year}</span>
            </div>
            <div style={{fontFamily:"Sora,sans-serif",fontSize:17,fontWeight:700,color:"var(--t1)",lineHeight:1.3,marginBottom:5}}>{paper.title}</div>
            <div style={{fontSize:12.5,color:"var(--t2)",marginBottom:4}}>{paper.authors}</div>
            <div style={{fontSize:12,color:"var(--t3)"}}>{paper.cites} citations</div>
          </div>
          <button className="mclose" onClick={onClose}>✕</button>
        </div>
        <div className="mtabs">
          {[["abstract","Abstract"],["contributions","Key Contributions"],["explain","AI Explain"]].map(([id,lb])=>(
            <button key={id} className={`mtab${tab===id?" on":""}`} onClick={()=>id==="explain"?loadExp():setTab(id)}>{lb}</button>
          ))}
        </div>
      </div>
      <div className="mbody">
        {tab==="abstract"&&<div className="fade">
          <p style={{marginBottom:16}}>{paper.abstract}</p>
          <a className="read-link" href={paper.link} target="_blank" rel="noreferrer">Read on arXiv / Publisher →</a>
        </div>}
        {tab==="contributions"&&<div className="fade" style={{display:"flex",flexDirection:"column",gap:9}}>
          {paper.contributions.map((c,i)=>(
            <div key={i} style={{display:"flex",gap:10,padding:"10px 13px",borderRadius:9,background:"var(--s1)",border:"1px solid var(--bdr)"}}>
              <span style={{color:"var(--cyan)",fontWeight:700,flexShrink:0}}>✦</span>
              <span>{c}</span>
            </div>
          ))}
        </div>}
        {tab==="explain"&&<div className="fade">
          {loading?<div className="ai-loading"><div className="td"/><div className="td"/><div className="td"/><span style={{fontSize:13,color:"var(--t3)",marginLeft:8}}>Claude is explaining this paper…</span></div>
          :<p style={{whiteSpace:"pre-wrap"}}>{exp}</p>}
        </div>}
      </div>
    </Modal>
  );
}

/* ─── TOOL MODAL ─────────────────────────────────────────────── */
function ToolModal({tool,onClose}){
  const [rev,setRev]=useState(""); const [loading,setLoading]=useState(false);
  const [tab,setTab]=useState("info");

  const loadRev=async()=>{
    if(rev){setTab("review");return;}
    setTab("review");setLoading(true);
    try{const t=await callClaude(`Write a concise, honest expert review of the AI tool "${tool.name}" in 3 paragraphs: 1) What it does and what it's best at, 2) Limitations, pricing, and who it's NOT for, 3) How it compares to top alternatives. Be specific and opinionated.`);setRev(t);}
    catch{setRev("Failed to load review.");}
    setLoading(false);
  };

  return(
    <Modal onClose={onClose}>
      <div className="mh">
        <div className="mh-top">
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <div style={{width:44,height:44,borderRadius:11,background:tool.color+"22",border:`1px solid ${tool.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{tool.emoji}</div>
            <div>
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                <div style={{fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:700,color:"var(--t1)"}}>{tool.name}</div>
                <span style={{fontSize:10.5,padding:"2px 9px",borderRadius:6,background:tool.color+"1a",color:tool.color,fontWeight:600}}>{tool.cat}</span>
              </div>
              <div className="stars">{"★".repeat(Math.floor(tool.rating))}<span className="rat">{tool.rating}/5.0</span></div>
            </div>
          </div>
          <button className="mclose" onClick={onClose}>✕</button>
        </div>
        <div className="mtabs">
          {[["info","Overview"],["tags","Details"],["review","AI Review"]].map(([id,lb])=>(
            <button key={id} className={`mtab${tab===id?" on":""}`} onClick={()=>id==="review"?loadRev():setTab(id)}>{lb}</button>
          ))}
        </div>
      </div>
      <div className="mbody">
        {tab==="info"&&<div className="fade">
          <p style={{marginBottom:14}}>{tool.desc}</p>
          <div style={{padding:"12px 16px",borderRadius:10,background:"var(--s1)",border:"1px solid var(--bdr)",marginBottom:16}}>
            <div style={{fontSize:10.5,letterSpacing:2,color:"var(--t3)",textTransform:"uppercase",marginBottom:8}}>Best for</div>
            <div style={{fontSize:13.5,color:"var(--t2)"}}>{tool.useFor}</div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>{tool.tags.map(t=><span key={t} className="tag">{t}</span>)}</div>
          <a className="read-link" href={tool.link} target="_blank" rel="noreferrer">Visit {tool.name} →</a>
        </div>}
        {tab==="tags"&&<div className="fade" style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"flex",justifyContent:"space-between",padding:"12px 16px",borderRadius:9,background:"var(--s1)",border:"1px solid var(--bdr)"}}>
            <span style={{color:"var(--t3)"}}>Category</span><span style={{color:tool.color,fontWeight:600}}>{tool.cat}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"12px 16px",borderRadius:9,background:"var(--s1)",border:"1px solid var(--bdr)"}}>
            <span style={{color:"var(--t3)"}}>Rating</span><span style={{color:"var(--gold)",fontWeight:600}}>{tool.rating} / 5.0</span>
          </div>
          {tool.tags.map((t,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"12px 16px",borderRadius:9,background:"var(--s1)",border:"1px solid var(--bdr)"}}>
              <span style={{color:"var(--t3)"}}>Feature</span><span style={{color:"var(--t2)"}}>{t}</span>
            </div>
          ))}
        </div>}
        {tab==="review"&&<div className="fade">
          {loading?<div className="ai-loading"><div className="td"/><div className="td"/><div className="td"/><span style={{fontSize:13,color:"var(--t3)",marginLeft:8}}>Claude is writing a review…</span></div>
          :<p style={{whiteSpace:"pre-wrap"}}>{rev}</p>}
        </div>}
      </div>
    </Modal>
  );
}

/* ─── JOB MODAL ──────────────────────────────────────────────── */
function JobModal({job,onClose}){
  const [tab,setTab]=useState("detail");
  const [letter,setLetter]=useState(""); const [loading,setLoading]=useState(false);

  const loadLetter=async()=>{
    if(letter){setTab("letter");return;}
    setTab("letter");setLoading(true);
    try{const t=await callClaude(`Write a compelling, professional cover letter template for the role "${job.title}" at ${job.company} (salary: ${job.salary}). Make it enthusiastic but specific, referencing the company's work in AI. Include placeholders like [YOUR NAME], [YOUR BACKGROUND], [RELEVANT PROJECT]. 3 paragraphs: hook, body with skills, closing. Keep it under 300 words.`);setLetter(t);}
    catch{setLetter("Failed to generate cover letter.");}
    setLoading(false);
  };

  return(
    <Modal onClose={onClose}>
      <div className="mh">
        <div className="mh-top">
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <div style={{width:44,height:44,borderRadius:11,background:"var(--s2)",border:"1px solid var(--bdr)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{job.emoji}</div>
            <div>
              <div style={{fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:700,color:"var(--t1)",marginBottom:3}}>{job.title}</div>
              <div style={{fontSize:13,color:"var(--t2)",marginBottom:4}}>{job.company} · {job.location}</div>
              <div style={{fontSize:14,fontWeight:700,color:"var(--gold)"}}>{job.salary}</div>
            </div>
          </div>
          <button className="mclose" onClick={onClose}>✕</button>
        </div>
        <div className="mtabs">
          {[["detail","Details"],["reqs","Requirements"],["letter","Cover Letter AI"]].map(([id,lb])=>(
            <button key={id} className={`mtab${tab===id?" on":""}`} onClick={()=>id==="letter"?loadLetter():setTab(id)}>{lb}</button>
          ))}
        </div>
      </div>
      <div className="mbody">
        {tab==="detail"&&<div className="fade">
          <p style={{marginBottom:16}}>{job.desc}</p>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>{job.tags.map(t=><span key={t} className="tag">{t}</span>)}</div>
          <div style={{display:"flex",gap:10}}>
            <a className="read-link" href={job.link} target="_blank" rel="noreferrer">Apply Now →</a>
            <button onClick={loadLetter} style={{padding:"10px 20px",borderRadius:10,background:"var(--s2)",border:"1px solid var(--bdr)",color:"var(--t2)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>Generate Cover Letter</button>
          </div>
        </div>}
        {tab==="reqs"&&<div className="fade" style={{display:"flex",flexDirection:"column",gap:9}}>
          {job.reqs.map((r,i)=>(
            <div key={i} style={{display:"flex",gap:10,padding:"10px 13px",borderRadius:9,background:"var(--s1)",border:"1px solid var(--bdr)"}}>
              <span style={{color:"var(--green)",fontWeight:700,flexShrink:0}}>✓</span><span>{r}</span>
            </div>
          ))}
        </div>}
        {tab==="letter"&&<div className="fade">
          {loading?<div className="ai-loading"><div className="td"/><div className="td"/><div className="td"/><span style={{fontSize:13,color:"var(--t3)",marginLeft:8}}>Generating your cover letter…</span></div>
          :<><p style={{whiteSpace:"pre-wrap",marginBottom:14}}>{letter}</p>
            <button onClick={()=>{navigator.clipboard?.writeText(letter)}} style={{padding:"8px 18px",borderRadius:9,background:"var(--s2)",border:"1px solid var(--bdr)",color:"var(--t2)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>Copy to Clipboard</button>
          </>}
        </div>}
      </div>
    </Modal>
  );
}

/* ─── PAGES ──────────────────────────────────────────────────── */
function SearchPage({q,setQ,cat,setCat}){
  const CATS=["All","Web","Books","Research","AI Tools","Jobs"];
  const [done,setDone]=useState(false);
  const go=()=>{if(q.trim())setDone(true);};
  const items=ALL_RESULTS.filter(r=>cat==="All"||r.label===cat||
    (cat==="Books"&&r.label==="Book")||(cat==="Research"&&r.label==="Research")||
    (cat==="AI Tools"&&r.label==="Tool")||(cat==="Jobs"&&r.label==="Job")||(cat==="Web"&&r.label==="Web"));
  return(
    <div className="fade">
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",paddingBottom:36}}>
        <div className="cats">
          {CATS.map(c=><button key={c} className={`cp${cat===c?" on":""}`} onClick={()=>setCat(c)}>{c}</button>)}
        </div>
        <div className="sb-wrap">
          <div className="sbar">
            <span style={{color:"var(--t3)",fontSize:17}}>⊙</span>
            <input className="si" placeholder="Search papers, books, tools, jobs..." value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} autoFocus/>
            <button className="sgo" onClick={go}><span>Search</span><span>→</span></button>
          </div>
        </div>
      </div>
      {done&&q.trim()
        ?<div className="rlist">{items.map((r,i)=>(
            <div key={i} className="rcard">
              <div className="rtop"><span className={`rbadge ${r.badge}`}>{r.label}</span><span className="rvenue">{r.venue}</span></div>
              <div className="rtitle">{r.title}</div>
              <div className="rsrc">{r.src}</div>
              <div className="rdesc">{r.desc}</div>
              <div className="tags">{r.tags.map(t=><span key={t} className="tag">{t}</span>)}</div>
            </div>
          ))}</div>
        :<div className="empty"><div className="empty-ic">⊙</div><div style={{fontSize:16,color:"var(--t2)",marginBottom:8}}>Search the AI knowledge universe</div><div style={{fontSize:13}}>Try: "transformers" · "AI safety" · "remote ML jobs" · "deep learning"</div></div>
      }
    </div>
  );
}

function LibraryPage(){
  const [f,setF]=useState("All"); const [open,setOpen]=useState(null);
  const cats=["All","ML/AI","AI Safety","AI Ethics","Future AI","ML Theory"];
  const list=f==="All"?BOOKS:BOOKS.filter(b=>b.cat===f);
  return(
    <div className="fade">
      {open&&<BookModal book={open} onClose={()=>setOpen(null)}/>}
      <div className="frow">{cats.map(c=><button key={c} className={`fc${f===c?" on":""}`} onClick={()=>setF(c)}>{c}</button>)}</div>
      <div className="grid3">
        {list.map(b=>(
          <div key={b.id} className="card" onClick={()=>setOpen(b)}>
            <div className="c-top"><div className="c-ic">{b.emoji}</div><span className="c-cat">{b.cat}</span></div>
            <div className="c-title">{b.title}</div>
            <div className="c-meta">{b.author} · {b.year} · {b.pages}p</div>
            <div className="stars">{"★".repeat(Math.floor(b.rating))}<span className="rat">{b.rating}</span></div>
            <div className="c-acts">
              <button className="cbtn cbtn-g" onClick={e=>{e.stopPropagation();setOpen({...b,_sum:true})}}>AI Summary</button>
              <button className="cbtn cbtn-b" onClick={e=>e.stopPropagation()}>Save ✦</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResearchPage(){
  const [f,setF]=useState("All"); const [open,setOpen]=useState(null);
  const cats=["All","NLP","RL","Generative","Alignment","LLM","Biology AI"];
  const list=f==="All"?PAPERS:PAPERS.filter(p=>p.cat===f);
  return(
    <div className="fade">
      {open&&<PaperModal paper={open} onClose={()=>setOpen(null)}/>}
      <div className="frow">{cats.map(c=><button key={c} className={`fc${f===c?" on":""}`} onClick={()=>setF(c)}>{c}</button>)}</div>
      <div className="rlist">
        {list.map(p=>(
          <div key={p.id} className="rcard" onClick={()=>setOpen(p)}>
            <div className="rtop">
              <span className="rbadge rb-R">{p.cat}</span>
              <span style={{fontSize:11,padding:"2px 9px",borderRadius:6,background:p.color+"1a",color:p.color,fontWeight:600}}>{p.venue}</span>
              <span className="rvenue">{p.year} · ✦ {p.cites}</span>
            </div>
            <div className="rtitle">{p.title}</div>
            <div className="rsrc">{p.authors}</div>
            <div className="rdesc">{p.abstract.slice(0,140)}…</div>
            <div style={{display:"flex",gap:8,marginTop:10}}>
              <button className="cbtn cbtn-g" style={{maxWidth:130}} onClick={e=>{e.stopPropagation();setOpen(p)}}>Open Paper</button>
              <button className="cbtn cbtn-b" style={{maxWidth:130}} onClick={e=>{e.stopPropagation();setOpen({...p,_exp:true})}}>AI Explain</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ToolsPage(){
  const [f,setF]=useState("All"); const [open,setOpen]=useState(null);
  const cats=["All","Chatbot","Image Gen","Video Gen","Coding","Search","Voice AI"];
  const list=f==="All"?TOOLS:TOOLS.filter(t=>t.cat===f);
  return(
    <div className="fade">
      {open&&<ToolModal tool={open} onClose={()=>setOpen(null)}/>}
      <div className="frow">{cats.map(c=><button key={c} className={`fc${f===c?" on":""}`} onClick={()=>setF(c)}>{c}</button>)}</div>
      <div className="grid3">
        {list.map(t=>(
          <div key={t.id} className="card" onClick={()=>setOpen(t)}>
            <div className="cbar" style={{background:t.color}}/>
            <div className="c-top">
              <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:22}}>{t.emoji}</span><div className="c-title" style={{marginBottom:0}}>{t.name}</div></div>
              <span className="c-cat">{t.cat}</span>
            </div>
            <div className="c-desc" style={{marginBottom:12}}>{t.desc}</div>
            <div className="tags" style={{marginBottom:12}}>{t.tags.map(tg=><span key={tg} className="tag">{tg}</span>)}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div className="stars">{"★".repeat(Math.floor(t.rating))}<span className="rat">{t.rating}</span></div>
              <button style={{padding:"6px 14px",borderRadius:8,background:t.color+"20",border:`1px solid ${t.color}40`,color:t.color,fontSize:12,cursor:"pointer",fontWeight:600,fontFamily:"Inter,sans-serif"}} onClick={e=>{e.stopPropagation();window.open(t.link,"_blank")}}>Visit →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function JobsPage(){
  const [f,setF]=useState("All"); const [open,setOpen]=useState(null);
  const list=f==="Remote"?JOBS.filter(j=>j.remote):f==="Onsite"?JOBS.filter(j=>!j.remote):JOBS;
  return(
    <div className="fade">
      {open&&<JobModal job={open} onClose={()=>setOpen(null)}/>}
      <div className="frow">
        {["All","Remote","Onsite","Research","Engineering"].map(c=><button key={c} className={`fc${f===c?" on":""}`} onClick={()=>setF(c)}>{c}</button>)}
      </div>
      <div className="jlist">
        {list.map(j=>(
          <div key={j.id} className="jcard" onClick={()=>setOpen(j)}>
            <div className="jlogo">{j.emoji}</div>
            <div className="jinfo">
              <div className="jt">{j.title}</div>
              <div className="jco">{j.company}</div>
              <div className="jm">
                <span>📍 {j.location}</span>
                <span>⏱ Full-time</span>
                {j.remote&&<span className="rem">Remote</span>}
              </div>
              <div className="tags" style={{marginTop:7}}>{j.tags.map(t=><span key={t} className="tag">{t}</span>)}</div>
            </div>
            <div className="jr">
              <div className="jsal">{j.salary}</div>
              <button className="abtn" onClick={e=>{e.stopPropagation();setOpen(j)}}>View & Apply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatPage(){
  const [msgs,setMsgs]=useState([{role:"assistant",content:"Hello! I'm Bramhand AI — your advanced research assistant powered by Claude.\n\nI can help with:\n• Complex technical questions & research\n• Explaining AI papers and concepts\n• Code review and debugging\n• Analysis and writing\n\nWhat would you like to explore?",sources:[]}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [active,setActive]=useState(0);
  const convs=["Transformer Architecture","AI Safety Overview","FastAPI + pgvector","RAG Pipeline Design","RL Fundamentals"];
  const bot=useRef(null);

  const send=useCallback(async()=>{
    const text=input.trim(); if(!text||loading) return;
    setInput("");
    const hist=[...msgs,{role:"user",content:text,sources:[]}];
    setMsgs(hist); setLoading(true);
    setTimeout(()=>bot.current?.scrollIntoView({behavior:"smooth"}),50);
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:1000,
          system:`You are Bramhand AI, a world-class AI research assistant on Bramhand.ai — a knowledge platform by Aditya Kumar Pal.
Provide expert, precise, well-structured answers. Use code blocks for code. For ML/research topics, cite key papers or authors.
If helpful, end with source references as: [SOURCES: [{"title":"Name","url":"https://..."}]]`,
          messages:hist.map(m=>({role:m.role,content:m.content}))
        })
      });
      const d=await r.json();
      const raw=d.content?.[0]?.text||"I couldn't get a response. Please try again.";
      const match=raw.match(/\[SOURCES:\s*(\[.*?\])\]/s);
      const content=raw.replace(/\[SOURCES:.*?\]/s,"").trim();
      let sources=[];
      if(match){try{sources=JSON.parse(match[1])}catch{}}
      setMsgs(p=>[...p,{role:"assistant",content,sources}]);
    }catch{
      setMsgs(p=>[...p,{role:"assistant",content:"Connection error. Please check your network and try again.",sources:[]}]);
    }
    setLoading(false);
    setTimeout(()=>bot.current?.scrollIntoView({behavior:"smooth"}),100);
  },[input,loading,msgs]);

  return(
    <div className="fade">
      <div className="cwrap">
        <div className="caside">
          <button className="cnew">＋ New Chat</button>
          <div className="alab">Recent</div>
          {convs.map((c,i)=><div key={i} className={`cconv${active===i?" on":""}`} onClick={()=>setActive(i)}>◈ {c}</div>)}
        </div>
        <div className="cbody">
          <div className="ctop">
            <div style={{fontSize:18}}>◈</div>
            <div><div className="ctop-t">Bramhand AI Assistant</div><div className="ctop-s">Claude · RAG-enhanced · Source-cited</div></div>
            <div style={{marginLeft:"auto",display:"flex",gap:6}}>{["claude-3.5","live"].map(b=><span key={b} style={{fontSize:10,padding:"3px 8px",borderRadius:5,background:"var(--s2)",border:"1px solid var(--bdr)",color:"var(--t3)"}}>{b}</span>)}</div>
          </div>
          <div className="msgs">
            {msgs.map((m,i)=>(
              <div key={i} className={`mrow${m.role==="user"?" usr":""}`}>
                <div className="mav">{m.role==="user"?"U":"◈"}</div>
                <div>
                  <div className="mbub">{m.content}</div>
                  {m.sources?.length>0&&<div className="msrcs">{m.sources.map((s,j)=><a key={j} className="schip" href={s.url||"#"} target="_blank" rel="noreferrer">✦ {s.title}</a>)}</div>}
                </div>
              </div>
            ))}
            {loading&&<div className="mrow"><div className="mav">◈</div><div className="mbub"><div className="tdots"><div className="td"/><div className="td"/><div className="td"/></div></div></div>}
            <div ref={bot}/>
          </div>
          <div className="cfooter">
            <textarea className="cta" placeholder="Ask anything — papers, code, research, analysis… (Enter to send, Shift+Enter for newline)" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}}} rows={1}/>
            <button className="csend" onClick={send} disabled={loading}>→</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ROOT ───────────────────────────────────────────────────── */
const NAVS=[
  {id:"search",lb:"Search"},{id:"chat",lb:"AI Chat"},{id:"books",lb:"Library"},
  {id:"research",lb:"Research"},{id:"tools",lb:"AI Tools"},{id:"jobs",lb:"Jobs"},
];
const TITLES={search:"Search",chat:"AI Chat",books:"Library",research:"Research Hub",tools:"AI Tools",jobs:"Job Board"};
const SHORTS=[
  {id:"search",ic:"⊙",lb:"Search"},{id:"chat",ic:"◈",lb:"AI Chat"},
  {id:"books",ic:"📚",lb:"Library"},{id:"research",ic:"✦",lb:"Research"},
  {id:"tools",ic:"⚡",lb:"AI Tools"},{id:"jobs",ic:"💼",lb:"Jobs"},
];

export default function App(){
  const [dark,setDark]=useState(true);
  const [tab,setTab]=useState("home");
  const [q,setQ]=useState(""); const [cat,setCat]=useState("All");
  const cats=["All","Web","Books","Research","AI Tools","Jobs"];
  const isHome=tab==="home";

  return(
    <div className={dark?"":"light"} style={{minHeight:"100vh"}}>
      <style>{G}</style>
      <BGCanvas/>

      {/* HEADER */}
      <header className="hdr">
        <div className="logo" onClick={()=>setTab("home")}>
          <div className="logo-ic">🌌</div>
          <div><div className="logo-name">Bramhand.ai</div><div className="logo-sub">by Aditya Kumar Pal</div></div>
        </div>
        {!isHome&&(
          <nav className="hdr-nav">
            {NAVS.map(n=><button key={n.id} className={`nb${tab===n.id?" on":""}`} onClick={()=>setTab(n.id)}><span style={{opacity:.5,fontSize:9}}>●</span>{n.lb}</button>)}
          </nav>
        )}
        <div className="hdr-r">
          <button className="tbtn" onClick={()=>setDark(!dark)}>{dark?"☀":"◑"}</button>
          {!isHome&&<button className="pbtn" onClick={()=>setTab("chat")}>Try AI Chat →</button>}
          {isHome&&<button className="pbtn" onClick={()=>setTab("chat")}>Get Started →</button>}
        </div>
      </header>

      {/* HOME */}
      {isHome&&(
        <main className="hero">
          <div className="pill">Infinite Knowledge · One Intelligence</div>
          <h1 className="h1">
            <div className="l1">Search Smarter.</div>
            <div className="l2">Bramhand.ai</div>
          </h1>
          <p className="hsub">The most advanced AI knowledge platform — search, research, chat, discover tools and jobs, all in one place.</p>
          <div className="sb-wrap">
            <div className="cats">{cats.map(c=><button key={c} className={`cp${cat===c?" on":""}`} onClick={()=>setCat(c)}>{c}</button>)}</div>
            <div className="sbar">
              <span style={{color:"var(--t3)",fontSize:17}}>⊙</span>
              <input className="si" placeholder="Ask anything — research, books, AI tools, jobs..." value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&q.trim())setTab("search")}}/>
              <button className="sgo" onClick={()=>{if(q.trim())setTab("search")}}><span>Search</span><span>→</span></button>
            </div>
          </div>
          <div className="shortcuts">
            {SHORTS.map(s=>(
              <button key={s.id} className="sc" onClick={()=>setTab(s.id)}>
                <div className="sc-ic">{s.ic}</div>
                <div className="sc-lb">{s.lb}</div>
              </button>
            ))}
          </div>
          <div className="stats">
            {[["10M+","Knowledge Nodes"],["50K+","Research Papers"],["500+","AI Tools"],["10K+","Tech Jobs"]].map(([v,l])=>(
              <div key={l} className="stat"><div className="sv">{v}</div><div className="sl">{l}</div></div>
            ))}
          </div>
        </main>
      )}

      {/* SECTION */}
      {!isHome&&(
        <>
          <div className="section-bar">
            <div style={{maxWidth:1160,margin:"0 auto",padding:"0 24px"}}>
              <div style={{fontSize:10,letterSpacing:3,color:"var(--t3)",textTransform:"uppercase",marginBottom:5}}>Bramhand.ai</div>
              <div className="pg-h">{TITLES[tab]||tab}</div>
              <div className="pg-s">Click any card to open it · AI-powered details inside every item</div>
            </div>
          </div>
          <div className="pw">
            {tab==="search"&&<SearchPage q={q} setQ={setQ} cat={cat} setCat={setCat}/>}
            {tab==="chat"&&<ChatPage/>}
            {tab==="books"&&<LibraryPage/>}
            {tab==="research"&&<ResearchPage/>}
            {tab==="tools"&&<ToolsPage/>}
            {tab==="jobs"&&<JobsPage/>}
          </div>
        </>
      )}

      {isHome&&(
        <footer className="foot">
          <div className="foot-brand">Bramhand.ai</div>
          <div className="foot-sub">Created by <strong style={{color:"var(--gold)"}}>Aditya Kumar Pal</strong> · Powered by Claude AI · © 2025</div>
          <div className="foot-tags">{["Zero Trust","GDPR","SOC 2","99.99% SLA","Open API"].map(t=><span key={t} className="ftag">{t}</span>)}</div>
        </footer>
      )}
    </div>
  );
}
