var ht=Symbol.for("immer-nothing"),ze=Symbol.for("immer-draftable"),S=Symbol.for("immer-state");function I(e,...t){throw new Error(`[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`)}var H=Object.getPrototypeOf;function j(e){return!!e&&!!e[S]}function W(e){var t;return e?gt(e)||Array.isArray(e)||!!e[ze]||!!((t=e.constructor)!=null&&t[ze])||X(e)||ce(e):!1}var Ft=Object.prototype.constructor.toString();function gt(e){if(!e||typeof e!="object")return!1;const t=H(e);if(t===null)return!0;const a=Object.hasOwnProperty.call(t,"constructor")&&t.constructor;return a===Object?!0:typeof a=="function"&&Function.toString.call(a)===Ft}function ne(e,t){le(e)===0?Reflect.ownKeys(e).forEach(a=>{t(a,e[a],e)}):e.forEach((a,s)=>t(s,a,e))}function le(e){const t=e[S];return t?t.type_:Array.isArray(e)?1:X(e)?2:ce(e)?3:0}function Ne(e,t){return le(e)===2?e.has(t):Object.prototype.hasOwnProperty.call(e,t)}function pt(e,t,a){const s=le(e);s===2?e.set(t,a):s===3?e.add(a):e[t]=a}function Tt(e,t){return e===t?e!==0||1/e===1/t:e!==e&&t!==t}function X(e){return e instanceof Map}function ce(e){return e instanceof Set}function D(e){return e.copy_||e.base_}function Re(e,t){if(X(e))return new Map(e);if(ce(e))return new Set(e);if(Array.isArray(e))return Array.prototype.slice.call(e);const a=gt(e);if(t===!0||t==="class_only"&&!a){const s=Object.getOwnPropertyDescriptors(e);delete s[S];let n=Reflect.ownKeys(s);for(let r=0;r<n.length;r++){const o=n[r],l=s[o];l.writable===!1&&(l.writable=!0,l.configurable=!0),(l.get||l.set)&&(s[o]={configurable:!0,writable:!0,enumerable:l.enumerable,value:e[o]})}return Object.create(H(e),s)}else{const s=H(e);if(s!==null&&a)return{...e};const n=Object.create(s);return Object.assign(n,e)}}function Ie(e,t=!1){return de(e)||j(e)||!W(e)||(le(e)>1&&Object.defineProperties(e,{set:{value:ae},add:{value:ae},clear:{value:ae},delete:{value:ae}}),Object.freeze(e),t&&Object.values(e).forEach(a=>Ie(a,!0))),e}function ae(){I(2)}function de(e){return Object.isFrozen(e)}var Gt={};function O(e){const t=Gt[e];return t||I(0,e),t}var q;function yt(){return q}function Dt(e,t){return{drafts_:[],parent_:e,immer_:t,canAutoFreeze_:!0,unfinalizedDrafts_:0}}function Ue(e,t){t&&(O("Patches"),e.patches_=[],e.inversePatches_=[],e.patchListener_=t)}function ke(e){Be(e),e.drafts_.forEach(xt),e.drafts_=null}function Be(e){e===q&&(q=e.parent_)}function Ke(e){return q=Dt(q,e)}function xt(e){const t=e[S];t.type_===0||t.type_===1?t.revoke_():t.revoked_=!0}function He(e,t){t.unfinalizedDrafts_=t.drafts_.length;const a=t.drafts_[0];return e!==void 0&&e!==a?(a[S].modified_&&(ke(t),I(4)),W(e)&&(e=re(t,e),t.parent_||oe(t,e)),t.patches_&&O("Patches").generateReplacementPatches_(a[S].base_,e,t.patches_,t.inversePatches_)):e=re(t,a,[]),ke(t),t.patches_&&t.patchListener_(t.patches_,t.inversePatches_),e!==ht?e:void 0}function re(e,t,a){if(de(t))return t;const s=t[S];if(!s)return ne(t,(n,r)=>je(e,s,t,n,r,a)),t;if(s.scope_!==e)return t;if(!s.modified_)return oe(e,s.base_,!0),s.base_;if(!s.finalized_){s.finalized_=!0,s.scope_.unfinalizedDrafts_--;const n=s.copy_;let r=n,o=!1;s.type_===3&&(r=new Set(n),n.clear(),o=!0),ne(r,(l,c)=>je(e,s,n,l,c,a,o)),oe(e,n,!1),a&&e.patches_&&O("Patches").generatePatches_(s,a,e.patches_,e.inversePatches_)}return s.copy_}function je(e,t,a,s,n,r,o){if(j(n)){const l=r&&t&&t.type_!==3&&!Ne(t.assigned_,s)?r.concat(s):void 0,c=re(e,n,l);if(pt(a,s,c),j(c))e.canAutoFreeze_=!1;else return}else o&&a.add(n);if(W(n)&&!de(n)){if(!e.immer_.autoFreeze_&&e.unfinalizedDrafts_<1)return;re(e,n),(!t||!t.scope_.parent_)&&typeof s!="symbol"&&(X(a)?a.has(s):Object.prototype.propertyIsEnumerable.call(a,s))&&oe(e,n)}}function oe(e,t,a=!1){!e.parent_&&e.immer_.autoFreeze_&&e.canAutoFreeze_&&Ie(t,a)}function _t(e,t){const a=Array.isArray(e),s={type_:a?1:0,scope_:t?t.scope_:yt(),modified_:!1,finalized_:!1,assigned_:{},parent_:t,base_:e,draft_:null,copy_:null,revoke_:null,isManual_:!1};let n=s,r=we;a&&(n=[s],r=Y);const{revoke:o,proxy:l}=Proxy.revocable(n,r);return s.draft_=l,s.revoke_=o,l}var we={get(e,t){if(t===S)return e;const a=D(e);if(!Ne(a,t))return Wt(e,a,t);const s=a[t];return e.finalized_||!W(s)?s:s===pe(e.base_,t)?(ye(e),e.copy_[t]=Se(s,e)):s},has(e,t){return t in D(e)},ownKeys(e){return Reflect.ownKeys(D(e))},set(e,t,a){const s=bt(D(e),t);if(s!=null&&s.set)return s.set.call(e.draft_,a),!0;if(!e.modified_){const n=pe(D(e),t),r=n==null?void 0:n[S];if(r&&r.base_===a)return e.copy_[t]=a,e.assigned_[t]=!1,!0;if(Tt(a,n)&&(a!==void 0||Ne(e.base_,t)))return!0;ye(e),Ae(e)}return e.copy_[t]===a&&(a!==void 0||t in e.copy_)||Number.isNaN(a)&&Number.isNaN(e.copy_[t])||(e.copy_[t]=a,e.assigned_[t]=!0),!0},deleteProperty(e,t){return pe(e.base_,t)!==void 0||t in e.base_?(e.assigned_[t]=!1,ye(e),Ae(e)):delete e.assigned_[t],e.copy_&&delete e.copy_[t],!0},getOwnPropertyDescriptor(e,t){const a=D(e),s=Reflect.getOwnPropertyDescriptor(a,t);return s&&{writable:!0,configurable:e.type_!==1||t!=="length",enumerable:s.enumerable,value:a[t]}},defineProperty(){I(11)},getPrototypeOf(e){return H(e.base_)},setPrototypeOf(){I(12)}},Y={};ne(we,(e,t)=>{Y[e]=function(){return arguments[0]=arguments[0][0],t.apply(this,arguments)}});Y.deleteProperty=function(e,t){return Y.set.call(this,e,t,void 0)};Y.set=function(e,t,a){return we.set.call(this,e[0],t,a,e[0])};function pe(e,t){const a=e[S];return(a?D(a):e)[t]}function Wt(e,t,a){var n;const s=bt(t,a);return s?"value"in s?s.value:(n=s.get)==null?void 0:n.call(e.draft_):void 0}function bt(e,t){if(!(t in e))return;let a=H(e);for(;a;){const s=Object.getOwnPropertyDescriptor(a,t);if(s)return s;a=H(a)}}function Ae(e){e.modified_||(e.modified_=!0,e.parent_&&Ae(e.parent_))}function ye(e){e.copy_||(e.copy_=Re(e.base_,e.scope_.immer_.useStrictShallowCopy_))}var Ot=class{constructor(e){this.autoFreeze_=!0,this.useStrictShallowCopy_=!1,this.produce=(t,a,s)=>{if(typeof t=="function"&&typeof a!="function"){const r=a;a=t;const o=this;return function(c=r,...d){return o.produce(c,u=>a.call(this,u,...d))}}typeof a!="function"&&I(6),s!==void 0&&typeof s!="function"&&I(7);let n;if(W(t)){const r=Ke(this),o=Se(t,void 0);let l=!0;try{n=a(o),l=!1}finally{l?ke(r):Be(r)}return Ue(r,s),He(n,r)}else if(!t||typeof t!="object"){if(n=a(t),n===void 0&&(n=t),n===ht&&(n=void 0),this.autoFreeze_&&Ie(n,!0),s){const r=[],o=[];O("Patches").generateReplacementPatches_(t,n,r,o),s(r,o)}return n}else I(1,t)},this.produceWithPatches=(t,a)=>{if(typeof t=="function")return(o,...l)=>this.produceWithPatches(o,c=>t(c,...l));let s,n;return[this.produce(t,a,(o,l)=>{s=o,n=l}),s,n]},typeof(e==null?void 0:e.autoFreeze)=="boolean"&&this.setAutoFreeze(e.autoFreeze),typeof(e==null?void 0:e.useStrictShallowCopy)=="boolean"&&this.setUseStrictShallowCopy(e.useStrictShallowCopy)}createDraft(e){W(e)||I(8),j(e)&&(e=zt(e));const t=Ke(this),a=Se(e,void 0);return a[S].isManual_=!0,Be(t),a}finishDraft(e,t){const a=e&&e[S];(!a||!a.isManual_)&&I(9);const{scope_:s}=a;return Ue(s,t),He(void 0,s)}setAutoFreeze(e){this.autoFreeze_=e}setUseStrictShallowCopy(e){this.useStrictShallowCopy_=e}applyPatches(e,t){let a;for(a=t.length-1;a>=0;a--){const n=t[a];if(n.path.length===0&&n.op==="replace"){e=n.value;break}}a>-1&&(t=t.slice(a+1));const s=O("Patches").applyPatches_;return j(e)?s(e,t):this.produce(e,n=>s(n,t))}};function Se(e,t){const a=X(e)?O("MapSet").proxyMap_(e,t):ce(e)?O("MapSet").proxySet_(e,t):_t(e,t);return(t?t.scope_:yt()).drafts_.push(a),a}function zt(e){return j(e)||I(10,e),vt(e)}function vt(e){if(!W(e)||de(e))return e;const t=e[S];let a;if(t){if(!t.modified_)return t.base_;t.finalized_=!0,a=Re(e,t.scope_.immer_.useStrictShallowCopy_)}else a=Re(e,!0);return ne(a,(s,n)=>{pt(a,s,vt(n))}),t&&(t.finalized_=!1),a}var Ut=new Ot,Kt=Ut.produce;const Ht=e=>(t,a,s)=>(s.setState=(n,r,...o)=>{const l=typeof n=="function"?Kt(n):n;return t(l,r,...o)},e(s.setState,a,s)),jt=Ht,Jt={},Je=e=>{let t;const a=new Set,s=(u,f)=>{const h=typeof u=="function"?u(t):u;if(!Object.is(h,t)){const y=t;t=f??(typeof h!="object"||h===null)?h:Object.assign({},t,h),a.forEach(R=>R(t,y))}},n=()=>t,c={setState:s,getState:n,getInitialState:()=>d,subscribe:u=>(a.add(u),()=>a.delete(u)),destroy:()=>{(Jt?"production":void 0)!=="production"&&console.warn("[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."),a.clear()}},d=t=e(s,n,c);return c},qt=e=>e?Je(e):Je;function be(e,t){return(e<<t|e>>64n-t)&(1n<<64n)-1n}function Yt(e){let t=e&(1n<<64n)-1n;return()=>{t=t+0x9e3779b97f4a7c15n&(1n<<64n)-1n;let a=t;return a=(a^a>>30n)*0xbf58476d1ce4e5b9n&(1n<<64n)-1n,a=(a^a>>27n)*0x94d049bb133111ebn&(1n<<64n)-1n,a^a>>31n}}function ue(e){const t=Yt(BigInt(e.s1)<<32n|BigInt(e.s2));let a=t(),s=t();const n=()=>{const r=be(a+s,17n)+a;return s^=a,a=be(a,49n)^s^s<<21n,s=be(s,28n),Number(r&(1n<<64n)-1n)};return{next(){return(n()>>>0)/4294967296},nextInt(r){if(r<=0)throw new Error("max must be positive");return Math.floor(this.next()*r)},pick(r){if(!r.length)throw new Error("cannot pick from empty array");return r[this.nextInt(r.length)]}}}function fe(e,t){const a=ue(e);for(let r=0;r<t%5;r+=1)a.next();const s=Math.floor(a.next()*4294967295),n=Math.floor(a.next()*4294967295);return{s1:s,s2:n}}function Me(e){const t=e.day+1;if(t<7)return{...e,day:t};const a=e.week+1;return a<52?{season:e.season,week:a,day:0}:{season:e.season+1,week:0,day:0}}function Zt(e,t){return e.season===t.season&&e.week===t.week&&e.day===t.day}function Ct(e,t,a){const s=[...e],n=[];let r={...a},o=1;for(let c=0;c<s.length-1;c+=1){for(let d=0;d<s.length/2;d+=1){const u=s[d],f=s[s.length-1-d];n.push({id:`fixture-${o++}`,competitionId:t,homeId:u.id,awayId:f.id,date:{...r},played:!1})}r=Me(r),Xt(s)}const l=n.map(c=>({...c,id:`fixture-${o++}`,homeId:c.awayId,awayId:c.homeId,date:Me(c.date)}));return[...n,...l]}function Xt(e){const t=e[0],a=e.slice(1);a.unshift(a.pop()),e.splice(0,e.length,t,...a)}function Nt(e,t,a){const s=fe(a,Number(t.id.replace(/\D/g,""))||0),n=ue(s),r=Ze(e,t.homeId),o=Ze(e,t.awayId),l={fixture:t,homePlayers:r,awayPlayers:o},{homeScore:c,awayScore:d,events:u,homeStats:f,awayStats:h,playerStats:y}=Qt(l,n);return{id:`match-${t.id}`,fixtureId:t.id,events:u,stats:[f,h],playerStats:y,state:"Complete",score:{home:c,away:d}}}function Qt(e,t){const s=[{minute:0,type:"Kickoff",description:"Kick-off"}];let n=50,r=50;const o=qe(e.homePlayers),l=qe(e.awayPlayers),c=o+l,d=8+Math.round(o/c*6),u=8+Math.round(l/c*6);let f=0,h=0;for(let b=5;b<=90;b+=5){const $=t.next()*10-5;if(n=Xe(n+$,35,65),r=100-n,t.next()<d/100){const k=t.pick(e.homePlayers),V=.04+Ye(k)*.06+o/(c*2);s.push({minute:b,type:"Shot",description:`${k.name} tries his luck from distance for the home side`,teamId:e.fixture.homeId,playerId:k.id}),t.next()<V&&(f+=1,s.push({minute:b,type:"Goal",description:`${k.name} scores for the hosts!`,teamId:e.fixture.homeId,playerId:k.id}))}if(t.next()<u/100){const k=t.pick(e.awayPlayers),V=.04+Ye(k)*.06+l/(c*2);s.push({minute:b,type:"Shot",description:`${k.name} lines up a chance for the visitors`,teamId:e.fixture.awayId,playerId:k.id}),t.next()<V&&(h+=1,s.push({minute:b,type:"Goal",description:`${k.name} finds the net for the visitors!`,teamId:e.fixture.awayId,playerId:k.id}))}b===45&&s.push({minute:b,type:"HalfTime",description:"Half-time whistle"})}s.push({minute:90,type:"FullTime",description:"Full-time"});const y={clubId:e.fixture.homeId,goals:f,shots:Math.round(d*1.2),shotsOnTarget:Math.round(d*.6),possession:Math.round(n)},R={clubId:e.fixture.awayId,goals:h,shots:Math.round(u*1.2),shotsOnTarget:Math.round(u*.6),possession:Math.round(r)},M=[...e.homePlayers,...e.awayPlayers].map(b=>{const $=(b.currentAbility-140)/80,k=Xe(6.2+t.next()*1.6+$,5,10);return{playerId:b.id,rating:k,minutes:90,goals:s.filter(L=>L.type==="Goal"&&L.playerId===b.id).length,assists:0,shots:Math.round(t.next()*3),passesCompleted:Math.round(t.next()*40),tacklesWon:Math.round(t.next()*5)}});return{homeScore:f,awayScore:h,events:s,homeStats:y,awayStats:R,playerStats:M}}function qe(e){return e.reduce((t,a)=>t+a.currentAbility,0)}function Ye(e){const{finishing:t,composure:a,offTheBall:s}=e.attributes;return(t+a+s)/60}function Ze(e,t){const a=e.clubs.find(s=>s.id===t);if(!a)throw new Error(`Club not found: ${t}`);return a.roster.map(s=>e.players.find(n=>n.id===s)).sort((s,n)=>n.currentAbility-s.currentAbility).slice(0,11)}function Xe(e,t,a){return Math.max(t,Math.min(a,e))}const ea={id:"premier-league",name:"Premier League",nation:"England",level:1,clubs:[{id:"arsenal",name:"Arsenal",shortName:"ARS",colors:["#EF0107","#063672"],formation:"4-3-3",mentality:"Positive",tempo:68,press:70,rep:8600,marketValue:101e7,transferBudget:7e7,wageBudget:22e5,players:[i("arsenal","Aaron Ramsdale",25,"ENG","Right",["GK"],152,158,38e6,12e4,4),i("arsenal","David Raya",28,"ESP","Right",["GK"],148,150,32e6,11e4,3),i("arsenal","William Saliba",23,"FRA","Right",["CB"],165,175,7e7,18e4,5),i("arsenal","Gabriel",26,"BRA","Left",["CB"],158,162,52e6,15e4,4),i("arsenal","Ben White",26,"ENG","Right",["RB","CB"],156,160,5e7,16e4,4),i("arsenal","Oleksandr Zinchenko",27,"UKR","Left",["LB","CM"],152,156,42e6,14e4,4),i("arsenal","Declan Rice",25,"ENG","Right",["DM","CM"],170,178,95e6,24e4,6),i("arsenal","Martin Ødegaard",25,"NOR","Left",["AM","CM"],168,175,85e6,23e4,5),i("arsenal","Bukayo Saka",22,"ENG","Left",["RW","LW"],172,185,11e7,25e4,6),i("arsenal","Gabriel Martinelli",22,"BRA","Right",["LW","ST"],160,172,76e6,19e4,5),i("arsenal","Gabriel Jesus",27,"BRA","Right",["ST","RW"],160,164,65e6,2e5,4),i("arsenal","Kai Havertz",24,"GER","Left",["AM","ST"],158,165,6e7,21e4,4),i("arsenal","Jorginho",32,"ITA","Right",["DM","CM"],150,150,22e6,18e4,2),i("arsenal","Takehiro Tomiyasu",25,"JPN","Right",["RB","CB","LB"],150,154,28e6,11e4,3),i("arsenal","Leandro Trossard",29,"BEL","Right",["LW","AM"],154,156,36e6,16e4,3)]},{id:"man-city",name:"Manchester City",shortName:"MCI",colors:["#6CABDD","#1C2C5B"],formation:"4-3-3",mentality:"Positive",tempo:64,press:72,rep:9300,marketValue:12e8,transferBudget:9e7,wageBudget:26e5,players:[i("man-city","Ederson",30,"BRA","Left",["GK"],162,166,65e6,22e4,4),i("man-city","Stefan Ortega",31,"GER","Right",["GK"],148,150,18e6,9e4,3),i("man-city","Kyle Walker",34,"ENG","Right",["RB"],158,158,18e6,175e3,2),i("man-city","Rúben Dias",27,"POR","Right",["CB"],168,170,78e6,23e4,5),i("man-city","John Stones",29,"ENG","Right",["CB"],162,164,52e6,21e4,4),i("man-city","Josko Gvardiol",22,"CRO","Left",["CB","LB"],165,180,82e6,19e4,6),i("man-city","Rodri",27,"ESP","Right",["DM"],176,180,105e6,26e4,6),i("man-city","Kevin De Bruyne",32,"BEL","Right",["CM","AM"],180,180,9e7,35e4,3),i("man-city","Phil Foden",23,"ENG","Left",["AM","RW"],170,182,11e7,25e4,5),i("man-city","Bernardo Silva",29,"POR","Left",["RW","AM","CM"],170,170,78e6,3e5,4),i("man-city","Jack Grealish",28,"ENG","Right",["LW"],160,162,62e6,3e5,4),i("man-city","Erling Haaland",23,"NOR","Left",["ST"],185,195,18e7,4e5,5),i("man-city","Julián Álvarez",24,"ARG","Right",["ST","AM"],164,176,82e6,19e4,5),i("man-city","Matheus Nunes",25,"POR","Right",["CM"],156,162,42e6,16e4,4),i("man-city","Manuel Akanji",28,"SUI","Right",["CB","RB"],160,162,4e7,18e4,4)]},{id:"liverpool",name:"Liverpool",shortName:"LIV",colors:["#C8102E","#00B2A9"],formation:"4-3-3",mentality:"Positive",tempo:70,press:74,rep:9e3,marketValue:96e7,transferBudget:65e6,wageBudget:23e5,players:[i("liverpool","Alisson Becker",31,"BRA","Right",["GK"],170,172,78e6,25e4,4),i("liverpool","Caoimhín Kelleher",25,"IRL","Right",["GK"],148,154,16e6,6e4,4),i("liverpool","Virgil van Dijk",32,"NED","Right",["CB"],175,175,65e6,22e4,3),i("liverpool","Ibrahima Konaté",24,"FRA","Right",["CB"],162,172,52e6,17e4,4),i("liverpool","Trent Alexander-Arnold",25,"ENG","Right",["RB","CM"],168,176,82e6,22e4,4),i("liverpool","Andy Robertson",29,"SCO","Left",["LB"],160,162,45e6,18e4,4),i("liverpool","Alexis Mac Allister",25,"ARG","Right",["CM","DM"],160,168,52e6,16e4,5),i("liverpool","Dominik Szoboszlai",23,"HUN","Right",["AM","CM"],164,176,72e6,2e5,5),i("liverpool","Curtis Jones",23,"ENG","Right",["CM","AM"],150,164,26e6,9e4,4),i("liverpool","Mohamed Salah",31,"EGY","Left",["RW"],178,178,1e8,35e4,3),i("liverpool","Luis Díaz",27,"COL","Right",["LW"],162,168,62e6,19e4,4),i("liverpool","Diogo Jota",27,"POR","Right",["ST","LW"],160,164,55e6,18e4,4),i("liverpool","Darwin Núñez",24,"URU","Right",["ST"],158,172,6e7,21e4,5),i("liverpool","Wataru Endo",31,"JPN","Right",["DM"],150,152,15e6,9e4,2),i("liverpool","Joe Gomez",26,"ENG","Right",["CB","RB"],154,158,3e7,12e4,4)]},{id:"man-united",name:"Manchester United",shortName:"MUN",colors:["#DA291C","#000000"],formation:"4-2-3-1",mentality:"Balanced",tempo:66,press:68,rep:9100,marketValue:87e7,transferBudget:75e6,wageBudget:25e5,players:[i("man-united","Andre Onana",28,"CMR","Right",["GK"],160,164,52e6,21e4,5),i("man-united","Altay Bayındır",26,"TUR","Right",["GK"],145,150,12e6,6e4,3),i("man-united","Lisandro Martínez",26,"ARG","Left",["CB"],160,166,52e6,19e4,5),i("man-united","Raphaël Varane",31,"FRA","Right",["CB"],165,165,42e6,3e5,2),i("man-united","Harry Maguire",31,"ENG","Right",["CB"],148,148,2e7,19e4,3),i("man-united","Luke Shaw",28,"ENG","Left",["LB"],158,160,34e6,2e5,4),i("man-united","Diogo Dalot",25,"POR","Right",["RB","LB"],152,158,28e6,14e4,4),i("man-united","Casemiro",32,"BRA","Right",["DM"],162,162,35e6,3e5,3),i("man-united","Kobbie Mainoo",19,"ENG","Right",["CM"],148,170,26e6,45e3,6),i("man-united","Bruno Fernandes",29,"POR","Right",["AM"],170,170,85e6,27e4,5),i("man-united","Marcus Rashford",26,"ENG","Right",["LW","ST"],166,170,92e6,3e5,5),i("man-united","Alejandro Garnacho",19,"ARG","Right",["LW"],154,176,52e6,9e4,6),i("man-united","Antony",24,"BRA","Left",["RW"],152,160,42e6,2e5,5),i("man-united","Rasmus Højlund",21,"DEN","Left",["ST"],158,178,65e6,18e4,6),i("man-united","Christian Eriksen",32,"DEN","Right",["CM","AM"],156,156,26e6,21e4,3)]},{id:"chelsea",name:"Chelsea",shortName:"CHE",colors:["#034694","#DBA111"],formation:"4-2-3-1",mentality:"Balanced",tempo:64,press:70,rep:8800,marketValue:86e7,transferBudget:8e7,wageBudget:24e5,players:[i("chelsea","Djordje Petrović",24,"SRB","Right",["GK"],150,162,24e6,65e3,5),i("chelsea","Robert Sánchez",26,"ESP","Right",["GK"],150,154,25e6,12e4,5),i("chelsea","Reece James",24,"ENG","Right",["RB"],162,170,7e7,22e4,5),i("chelsea","Ben Chilwell",27,"ENG","Left",["LB"],156,160,45e6,19e4,4),i("chelsea","Axel Disasi",26,"FRA","Right",["CB"],154,158,36e6,16e4,5),i("chelsea","Levi Colwill",21,"ENG","Left",["CB","LB"],156,174,55e6,14e4,6),i("chelsea","Thiago Silva",39,"BRA","Right",["CB"],160,160,1e7,16e4,1),i("chelsea","Moisés Caicedo",22,"ECU","Right",["DM"],162,176,9e7,22e4,8),i("chelsea","Enzo Fernández",23,"ARG","Right",["CM"],162,178,85e6,23e4,7),i("chelsea","Conor Gallagher",24,"ENG","Right",["CM"],154,164,42e6,15e4,3),i("chelsea","Cole Palmer",21,"ENG","Left",["RW","AM"],156,174,52e6,16e4,6),i("chelsea","Raheem Sterling",29,"ENG","Right",["LW","RW"],160,160,46e6,3e5,4),i("chelsea","Mykhailo Mudryk",23,"UKR","Right",["LW"],152,170,42e6,21e4,7),i("chelsea","Christopher Nkunku",26,"FRA","Right",["ST","AM"],164,170,7e7,25e4,5),i("chelsea","Nicolas Jackson",22,"SEN","Right",["ST"],154,170,42e6,14e4,8)]},{id:"tottenham",name:"Tottenham Hotspur",shortName:"TOT",colors:["#132257","#FFFFFF"],formation:"4-3-3",mentality:"Positive",tempo:68,press:72,rep:8700,marketValue:78e7,transferBudget:6e7,wageBudget:21e5,players:[i("tottenham","Guglielmo Vicario",27,"ITA","Right",["GK"],156,162,32e6,12e4,5),i("tottenham","Fraser Forster",36,"ENG","Right",["GK"],140,140,5e6,7e4,2),i("tottenham","Cristian Romero",26,"ARG","Right",["CB"],164,168,62e6,18e4,5),i("tottenham","Micky van de Ven",23,"NED","Left",["CB"],158,176,55e6,16e4,6),i("tottenham","Pedro Porro",24,"POR","Right",["RB"],156,166,42e6,14e4,5),i("tottenham","Destiny Udogie",21,"ITA","Left",["LB"],154,172,38e6,12e4,6),i("tottenham","Yves Bissouma",27,"MLI","Right",["DM","CM"],156,160,42e6,15e4,4),i("tottenham","Pape Matar Sarr",21,"SEN","Right",["CM"],152,170,36e6,9e4,6),i("tottenham","James Maddison",27,"ENG","Right",["AM"],166,168,65e6,22e4,5),i("tottenham","Dejan Kulusevski",24,"SWE","Left",["RW","AM"],160,168,58e6,18e4,5),i("tottenham","Heung-min Son",31,"KOR","Both",["LW","ST"],170,170,82e6,29e4,4),i("tottenham","Richarlison",26,"BRA","Right",["ST","LW"],158,160,52e6,19e4,4),i("tottenham","Brennan Johnson",22,"WAL","Right",["RW","ST"],152,168,36e6,12e4,6),i("tottenham","Giovani Lo Celso",27,"ARG","Left",["CM","AM"],154,156,28e6,15e4,3),i("tottenham","Rodrigo Bentancur",26,"URU","Right",["CM","DM"],158,164,42e6,18e4,4)]},{id:"newcastle",name:"Newcastle United",shortName:"NEW",colors:["#241F20","#FFFFFF"],formation:"4-3-3",mentality:"Positive",tempo:66,press:70,rep:8400,marketValue:72e7,transferBudget:55e6,wageBudget:2e6,players:[i("newcastle","Nick Pope",31,"ENG","Right",["GK"],158,160,38e6,13e4,4),i("newcastle","Martin Dúbravka",35,"SVK","Right",["GK"],148,148,9e6,75e3,2),i("newcastle","Kieran Trippier",33,"ENG","Right",["RB"],158,158,26e6,17e4,2),i("newcastle","Sven Botman",24,"NED","Left",["CB"],160,170,52e6,14e4,5),i("newcastle","Fabian Schär",32,"SUI","Right",["CB"],154,154,18e6,9e4,3),i("newcastle","Dan Burn",31,"ENG","Left",["LB","CB"],152,152,16e6,85e3,3),i("newcastle","Bruno Guimarães",26,"BRA","Right",["CM","DM"],166,174,72e6,2e5,5),i("newcastle","Sandro Tonali",23,"ITA","Right",["CM","DM"],162,178,7e7,22e4,6),i("newcastle","Joelinton",27,"BRA","Right",["CM","AM"],156,160,42e6,16e4,4),i("newcastle","Miguel Almirón",30,"PAR","Left",["RW"],154,156,28e6,12e4,4),i("newcastle","Anthony Gordon",23,"ENG","Right",["LW"],156,168,48e6,15e4,5),i("newcastle","Alexander Isak",24,"SWE","Right",["ST"],166,176,82e6,2e5,5),i("newcastle","Callum Wilson",32,"ENG","Right",["ST"],158,158,26e6,15e4,2),i("newcastle","Harvey Barnes",26,"ENG","Right",["LW"],156,160,42e6,15e4,4),i("newcastle","Tino Livramento",21,"ENG","Right",["RB"],150,168,28e6,9e4,6)]},{id:"aston-villa",name:"Aston Villa",shortName:"AVL",colors:["#670E36","#95BFE5"],formation:"4-2-3-1",mentality:"Positive",tempo:64,press:66,rep:8200,marketValue:62e7,transferBudget:45e6,wageBudget:17e5,players:[i("aston-villa","Emiliano Martínez",31,"ARG","Right",["GK"],166,166,6e7,18e4,4),i("aston-villa","Robin Olsen",34,"SWE","Right",["GK"],142,142,5e6,6e4,2),i("aston-villa","Ezri Konsa",26,"ENG","Right",["CB"],156,160,32e6,12e4,4),i("aston-villa","Pau Torres",27,"ESP","Left",["CB"],158,164,42e6,16e4,5),i("aston-villa","Lucas Digne",30,"FRA","Left",["LB"],154,154,22e6,15e4,3),i("aston-villa","Matty Cash",26,"POL","Right",["RB"],152,154,22e6,12e4,4),i("aston-villa","Douglas Luiz",25,"BRA","Right",["DM","CM"],160,168,52e6,15e4,4),i("aston-villa","Boubacar Kamara",24,"FRA","Right",["DM","CB"],158,170,48e6,16e4,5),i("aston-villa","John McGinn",29,"SCO","Left",["CM","AM"],156,156,32e6,13e4,4),i("aston-villa","Moussa Diaby",24,"FRA","Left",["RW","LW"],160,170,6e7,18e4,5),i("aston-villa","Leon Bailey",26,"JAM","Left",["RW","LW"],156,160,38e6,14e4,4),i("aston-villa","Ollie Watkins",28,"ENG","Right",["ST"],164,166,62e6,2e5,5),i("aston-villa","Youri Tielemans",27,"BEL","Right",["CM"],156,160,3e7,16e4,4),i("aston-villa","Jacob Ramsey",22,"ENG","Right",["AM","CM"],152,170,32e6,9e4,6),i("aston-villa","Matheus Luiz",23,"BRA","Right",["CM"],148,164,22e6,8e4,5)]},{id:"brighton",name:"Brighton & Hove Albion",shortName:"BHA",colors:["#0057B8","#FFFFFF"],formation:"4-2-3-1",mentality:"Positive",tempo:68,press:70,rep:7800,marketValue:52e7,transferBudget:42e6,wageBudget:16e5,players:[i("brighton","Bart Verbruggen",21,"NED","Right",["GK"],150,168,28e6,65e3,6),i("brighton","Jason Steele",33,"ENG","Right",["GK"],145,145,4e6,6e4,2),i("brighton","Lewis Dunk",32,"ENG","Right",["CB"],156,156,2e7,9e4,3),i("brighton","Jan Paul van Hecke",23,"NED","Right",["CB"],150,162,2e7,7e4,5),i("brighton","Pervis Estupiñán",26,"ECU","Left",["LB"],156,164,36e6,12e4,4),i("brighton","Tariq Lamptey",23,"GHA","Right",["RB"],150,162,22e6,9e4,4),i("brighton","Billy Gilmour",22,"SCO","Right",["CM"],150,168,24e6,9e4,5),i("brighton","Pascal Groß",32,"GER","Right",["AM","CM"],160,160,26e6,11e4,3),i("brighton","João Pedro",22,"BRA","Right",["ST","AM"],156,172,42e6,14e4,6),i("brighton","Solly March",29,"ENG","Left",["RW","LW"],156,156,26e6,11e4,4),i("brighton","Kaoru Mitoma",26,"JPN","Right",["LW"],160,166,52e6,17e4,4),i("brighton","Evan Ferguson",19,"IRL","Right",["ST"],156,180,48e6,9e4,6),i("brighton","Adam Lallana",35,"ENG","Right",["AM"],148,148,6e6,7e4,2),i("brighton","Simon Adingra",22,"CIV","Right",["RW","LW"],152,168,32e6,85e3,5),i("brighton","Facundo Buonanotte",19,"ARG","Left",["AM","RW"],148,170,26e6,6e4,6)]},{id:"west-ham",name:"West Ham United",shortName:"WHU",colors:["#7A263A","#1BB1E7"],formation:"4-2-3-1",mentality:"Balanced",tempo:62,press:64,rep:7800,marketValue:48e7,transferBudget:38e6,wageBudget:15e5,players:[i("west-ham","Alphonse Areola",31,"FRA","Right",["GK"],156,158,28e6,14e4,4),i("west-ham","Lukasz Fabianski",38,"POL","Right",["GK"],148,148,3e6,8e4,1),i("west-ham","Kurt Zouma",29,"FRA","Right",["CB"],154,154,26e6,15e4,3),i("west-ham","Nayef Aguerd",28,"MAR","Left",["CB"],154,160,32e6,14e4,4),i("west-ham","Vladimir Coufal",31,"CZE","Right",["RB"],150,150,14e6,9e4,2),i("west-ham","Emerson Palmieri",29,"ITA","Left",["LB"],150,150,16e6,85e3,3),i("west-ham","Edson Álvarez",26,"MEX","Right",["DM","CB"],156,162,42e6,15e4,5),i("west-ham","James Ward-Prowse",29,"ENG","Right",["CM","AM"],156,156,32e6,16e4,4),i("west-ham","Lucas Paquetá",26,"BRA","Right",["AM","CM"],164,170,72e6,22e4,5),i("west-ham","Jarrod Bowen",27,"ENG","Left",["RW","ST"],160,162,56e6,19e4,4),i("west-ham","Michail Antonio",34,"JAM","Right",["ST"],150,150,8e6,11e4,2),i("west-ham","Mohammed Kudus",23,"GHA","Left",["AM","RW"],160,174,6e7,18e4,5),i("west-ham","Saïd Benrahma",28,"ALG","Right",["LW","AM"],154,156,28e6,14e4,3),i("west-ham","Tomáš Souček",29,"CZE","Right",["CM","DM"],154,154,26e6,12e4,4),i("west-ham","Pablo Fornals",28,"ESP","Right",["AM","CM"],152,152,22e6,13e4,3)]}]};function i(e,t,a,s,n,r,o,l,c,d,u){return{id:`${e}-${t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")}`,name:t,age:a,nationality:s,foot:n,positions:r,currentAbility:o,potentialAbility:l,value:c,wage:d,contractYears:u}}const ta={elite:{baseAbility:162,rep:9050,transferBudget:12e7,wageBudget:26e5,tempo:66,press:68},contender:{baseAbility:152,rep:8600,transferBudget:8e7,wageBudget:19e5,tempo:64,press:66},challenger:{baseAbility:144,rep:8100,transferBudget:55e6,wageBudget:13e5,tempo:62,press:64},solid:{baseAbility:136,rep:7600,transferBudget:34e6,wageBudget:95e4,tempo:60,press:62},rising:{baseAbility:128,rep:7e3,transferBudget:22e6,wageBudget:7e5,tempo:58,press:60},developing:{baseAbility:120,rep:6400,transferBudget:12e6,wageBudget:48e4,tempo:56,press:58}},Qe=[8,4,-4,0,6,-2,-6,3,5,-5,7,-3,2,-1,4,-4,6,-6,1,-2],aa=[{positions:["GK"],preferredFoot:"Right"},{positions:["RB"],preferredFoot:"Right"},{positions:["CB"],preferredFoot:"Right"},{positions:["CB"],preferredFoot:"Left"},{positions:["LB"],preferredFoot:"Left"},{positions:["DM"],preferredFoot:"Right"},{positions:["CM"],preferredFoot:"Right"},{positions:["CM"],preferredFoot:"Left"},{positions:["AM"],preferredFoot:"Right"},{positions:["RW"],preferredFoot:"Left"},{positions:["LW"],preferredFoot:"Right"},{positions:["ST"],preferredFoot:"Right"},{positions:["GK"],preferredFoot:"Left"},{positions:["CB"],preferredFoot:"Right"},{positions:["RB","LB"],preferredFoot:"Both"},{positions:["DM","CM"],preferredFoot:"Right"},{positions:["CM"],preferredFoot:"Left"},{positions:["AM","RW"],preferredFoot:"Left"},{positions:["ST"],preferredFoot:"Left"},{positions:["LW","ST"],preferredFoot:"Right"}],sa={ENG:{first:["James","Harry","Declan","Marcus","Bukayo","Phil"],last:["Walker","Smith","Johnson","Brown","Wilson","Taylor"]},ESP:{first:["Pedro","Sergio","Iker","Marco","Unai","Andrés"],last:["García","Hernández","Alonso","Martínez","Ruiz","Santos"]},ITA:{first:["Marco","Federico","Lorenzo","Nicolo","Sandro","Gianluca"],last:["Rossi","Bianchi","Esposito","Ferrari","Mancini","Romano"]},GER:{first:["Jonas","Lukas","Leon","Julian","Timo","Florian"],last:["Müller","Schmidt","Schneider","Fischer","Becker","Wagner"]},FRA:{first:["Kylian","Antoine","Benjamin","Theo","Loïc","Adrien"],last:["Dupont","Bernard","Moreau","Lefevre","Roux","Fontaine"]},NED:{first:["Davy","Memphis","Stefan","Jurrien","Cody","Xavi"],last:["de Jong","van Dijk","Klaassen","Bergkamp","Koopmeiners","Blind"]},PRT:{first:["Rui","João","Gonçalo","Pedro","Nuno","Tiago"],last:["Silva","Costa","Pereira","Ferreira","Carvalho","Santos"]},USA:{first:["Tyler","Christian","Weston","Brenden","Giovanni","Miles"],last:["Adams","Pulisic","McKennie","Aaronson","Dest","Zimmerman"]},BRA:{first:["Gabriel","Lucas","Raphinha","Danilo","João","Pedro"],last:["Silva","Souza","Oliveira","Costa","Ferreira","Alves"]},JPN:{first:["Daichi","Takumi","Ritsu","Wataru","Takehiro","Kaoru"],last:["Tanaka","Minamino","Doan","Endo","Tomiyasu","Mitoma"]}},na={first:["Alex","Sam","Jordan","Taylor","Morgan","Casey"],last:["Andersen","Lopez","Ivanov","Petrov","Khan","Singh"]};function N(e){return{id:e.id,name:e.name,nation:e.nation,level:e.level,clubs:e.clubs.map(t=>ra(t,e))}}function ra(e,t){const a=ta[e.strength],s=e.qualityDelta??0,n=e.nationality??t.nationCode,r=a.baseAbility+s,o=e.marketValue??Math.round(Math.max(28e6,(r-90)*(r-88)*6e4)),l=e.transferBudget??Math.round(o*.085),c=e.wageBudget??Math.round(Math.max(a.wageBudget,o*.0022)),d=e.rep??Math.round(Math.min(9300,a.rep+Math.log10(o/1e6)*460));return{id:e.id,name:e.name,shortName:e.shortName,colors:e.colors,formation:e.formation??"4-3-3",mentality:e.mentality??"Balanced",tempo:e.tempo??a.tempo,press:e.press??a.press,rep:d,marketValue:o,transferBudget:l,wageBudget:c,players:Rt(e.id,n,r)}}function Rt(e,t,a){const s=sa[t]??na,n=oa(e);return aa.map((r,o)=>{const l=s.first[(o+n)%s.first.length],c=s.last[(o*2+n)%s.last.length],d=et(a+Qe[o%Qe.length],94,178),u=et(d+8+(o+n)%4*3,d+5,190),f=Math.round(Math.max(5e5,d**2*750)),h=Math.round(Math.max(6e3,d*800)),y=r.preferredFoot??(o%3===0?"Right":o%3===1?"Left":"Both");return{id:`${e}-p${o+1}`,name:`${l} ${c}`,age:19+(o+n)%12,nationality:t,foot:y,positions:r.positions,currentAbility:d,potentialAbility:u,value:f,wage:h,contractYears:3+(o+n)%3}})}function oa(e){let t=0;for(let a=0;a<e.length;a+=1)t=(t*31+e.charCodeAt(a))%97;return t}function et(e,t,a){return Math.max(t,Math.min(a,e))}const ia=[N({id:"la-liga",name:"La Liga",nation:"Spain",level:1,nationCode:"ESP",clubs:[{id:"real-madrid",name:"Real Madrid",shortName:"RMA",colors:["#ffffff","#3a296d"],strength:"elite",mentality:"Positive",qualityDelta:6,marketValue:105e7},{id:"barcelona",name:"FC Barcelona",shortName:"BAR",colors:["#004d98","#a50044"],strength:"elite",mentality:"Positive",tempo:68,press:70,marketValue:102e7},{id:"atletico-madrid",name:"Atlético Madrid",shortName:"ATL",colors:["#c8102e","#041e42"],strength:"contender",mentality:"Cautious",marketValue:62e7},{id:"real-sociedad",name:"Real Sociedad",shortName:"RSO",colors:["#005aa7","#ffffff"],strength:"challenger",marketValue:41e7},{id:"villarreal",name:"Villarreal",shortName:"VIL",colors:["#fbe106","#0b1f8c"],strength:"challenger",mentality:"Positive",marketValue:36e7},{id:"sevilla",name:"Sevilla",shortName:"SEV",colors:["#ffffff","#ff0000"],strength:"challenger",marketValue:28e7},{id:"real-betis",name:"Real Betis",shortName:"BET",colors:["#00965e","#ffffff"],strength:"solid",marketValue:25e7},{id:"athletic-club",name:"Athletic Club",shortName:"ATH",colors:["#da1212","#ffffff"],strength:"solid",marketValue:305e6},{id:"valencia",name:"Valencia CF",shortName:"VAL",colors:["#ff8200","#000000"],strength:"solid",marketValue:22e7},{id:"girona",name:"Girona FC",shortName:"GIR",colors:["#e5002b","#ffffff"],strength:"rising",marketValue:215e6}]}),N({id:"serie-a",name:"Serie A",nation:"Italy",level:1,nationCode:"ITA",clubs:[{id:"inter",name:"Inter",shortName:"INT",colors:["#1b65be","#000000"],strength:"elite",mentality:"Positive",press:69,marketValue:7e8},{id:"juventus",name:"Juventus",shortName:"JUV",colors:["#000000","#ffffff"],strength:"elite",mentality:"Balanced",marketValue:65e7},{id:"ac-milan",name:"AC Milan",shortName:"MIL",colors:["#a50044","#000000"],strength:"contender",mentality:"Positive",marketValue:56e7},{id:"napoli",name:"Napoli",shortName:"NAP",colors:["#0078d7","#002654"],strength:"contender",marketValue:52e7},{id:"roma",name:"AS Roma",shortName:"ROM",colors:["#8e1f1f","#f7a81b"],strength:"challenger",marketValue:38e7},{id:"lazio",name:"Lazio",shortName:"LAZ",colors:["#65aadb","#ffffff"],strength:"challenger",marketValue:36e7},{id:"atalanta",name:"Atalanta",shortName:"ATA",colors:["#1f4e8c","#000000"],strength:"challenger",marketValue:35e7},{id:"fiorentina",name:"Fiorentina",shortName:"FIO",colors:["#592d82","#ffffff"],strength:"solid",marketValue:29e7},{id:"bologna",name:"Bologna",shortName:"BOL",colors:["#a6192e","#132257"],strength:"solid",marketValue:24e7},{id:"torino",name:"Torino",shortName:"TOR",colors:["#7f1d1d","#ffffff"],strength:"solid",marketValue:21e7}]}),N({id:"bundesliga",name:"Bundesliga",nation:"Germany",level:1,nationCode:"GER",clubs:[{id:"bayern",name:"Bayern Munich",shortName:"FCB",colors:["#dc052d","#0066b2"],strength:"elite",mentality:"Positive",tempo:70,marketValue:97e7},{id:"dortmund",name:"Borussia Dortmund",shortName:"BVB",colors:["#fdd102","#000000"],strength:"contender",mentality:"Positive",marketValue:65e7},{id:"rb-leipzig",name:"RB Leipzig",shortName:"RBL",colors:["#d72027","#ffffff"],strength:"contender",marketValue:51e7},{id:"leverkusen",name:"Bayer Leverkusen",shortName:"B04",colors:["#e32219","#000000"],strength:"challenger",marketValue:61e7},{id:"union-berlin",name:"Union Berlin",shortName:"FCU",colors:["#e31b23","#f4c300"],strength:"challenger",mentality:"Cautious",marketValue:22e7},{id:"freiburg",name:"SC Freiburg",shortName:"SCF",colors:["#000000","#ffffff"],strength:"solid",marketValue:21e7},{id:"stuttgart",name:"VfB Stuttgart",shortName:"VFB",colors:["#ed2939","#ffffff"],strength:"solid",marketValue:27e7},{id:"frankfurt",name:"Eintracht Frankfurt",shortName:"SGE",colors:["#e60026","#000000"],strength:"solid",marketValue:25e7},{id:"monchengladbach",name:"Borussia M'Gladbach",shortName:"BMG",colors:["#0b5c0b","#ffffff"],strength:"solid",marketValue:22e7},{id:"wolfsburg",name:"Wolfsburg",shortName:"WOB",colors:["#14b53a","#ffffff"],strength:"solid",marketValue:2e8}]}),N({id:"ligue-1",name:"Ligue 1",nation:"France",level:1,nationCode:"FRA",clubs:[{id:"psg",name:"Paris Saint-Germain",shortName:"PSG",colors:["#004170","#e30613"],strength:"elite",mentality:"Positive",press:72,marketValue:89e7},{id:"marseille",name:"Marseille",shortName:"OM",colors:["#00a3e0","#ffffff"],strength:"contender",mentality:"Positive",marketValue:33e7},{id:"monaco",name:"AS Monaco",shortName:"ASM",colors:["#e2001a","#ffffff"],strength:"contender",marketValue:35e7},{id:"lyon",name:"Lyon",shortName:"OL",colors:["#273e8c","#e60012"],strength:"challenger",marketValue:32e7},{id:"lille",name:"Lille",shortName:"LIL",colors:["#e2001a","#1b3f8b"],strength:"challenger",marketValue:32e7},{id:"rennes",name:"Rennes",shortName:"REN",colors:["#e41b17","#1d1d1b"],strength:"challenger",marketValue:31e7},{id:"nice",name:"Nice",shortName:"NCE",colors:["#a00000","#000000"],strength:"solid",marketValue:29e7},{id:"lens",name:"Lens",shortName:"RCL",colors:["#f4d130","#c30404"],strength:"solid",marketValue:28e7},{id:"nantes",name:"Nantes",shortName:"NAN",colors:["#ffe600","#007a33"],strength:"rising",marketValue:145e6},{id:"reims",name:"Reims",shortName:"REI",colors:["#d40000","#ffffff"],strength:"rising",marketValue:17e7}]}),N({id:"eredivisie",name:"Eredivisie",nation:"Netherlands",level:1,nationCode:"NED",clubs:[{id:"ajax",name:"Ajax",shortName:"AJA",colors:["#ffffff","#d20a0a"],strength:"contender",mentality:"Positive",marketValue:36e7},{id:"psv",name:"PSV",shortName:"PSV",colors:["#ff0000","#ffffff"],strength:"contender",marketValue:31e7},{id:"feyenoord",name:"Feyenoord",shortName:"FEY",colors:["#ff0000","#ffffff"],strength:"contender",marketValue:32e7},{id:"az-alkmaar",name:"AZ Alkmaar",shortName:"AZ",colors:["#e2001a","#000000"],strength:"challenger",marketValue:22e7},{id:"twente",name:"FC Twente",shortName:"TWE",colors:["#d71920","#ffffff"],strength:"challenger",marketValue:18e7},{id:"utrecht",name:"FC Utrecht",shortName:"UTR",colors:["#d71920","#005ca7"],strength:"solid",marketValue:12e7},{id:"heerenveen",name:"Heerenveen",shortName:"HEE",colors:["#0b4ea2","#ffffff"],strength:"solid",marketValue:95e6},{id:"vitesse",name:"Vitesse",shortName:"VIT",colors:["#f6c800","#000000"],strength:"solid",marketValue:85e6},{id:"groningen",name:"Groningen",shortName:"GRO",colors:["#009639","#ffffff"],strength:"rising",marketValue:75e6},{id:"nec",name:"NEC Nijmegen",shortName:"NEC",colors:["#009639","#e03c31"],strength:"rising",marketValue:7e7}]}),N({id:"primeira-liga",name:"Primeira Liga",nation:"Portugal",level:1,nationCode:"PRT",clubs:[{id:"benfica",name:"Benfica",shortName:"BEN",colors:["#ff0000","#ffffff"],strength:"contender",mentality:"Positive",marketValue:37e7},{id:"porto",name:"FC Porto",shortName:"FCP",colors:["#0033a0","#ffffff"],strength:"contender",marketValue:35e7},{id:"sporting",name:"Sporting CP",shortName:"SCP",colors:["#00874b","#ffffff"],strength:"contender",marketValue:36e7},{id:"braga",name:"SC Braga",shortName:"BRA",colors:["#c4171d","#ffffff"],strength:"challenger",marketValue:21e7},{id:"guimaraes",name:"Vitória SC",shortName:"GUI",colors:["#ffffff","#000000"],strength:"challenger",marketValue:12e7},{id:"boavista",name:"Boavista",shortName:"BOA",colors:["#000000","#ffffff"],strength:"solid",marketValue:55e6},{id:"rio-ave",name:"Rio Ave",shortName:"RIO",colors:["#009639","#ff8200"],strength:"solid",marketValue:4e7},{id:"famalicao",name:"Famalicão",shortName:"FAM",colors:["#003a70","#fdda24"],strength:"solid",marketValue:45e6},{id:"estoril",name:"Estoril",shortName:"EST",colors:["#fdda24","#0033a0"],strength:"rising",marketValue:35e6},{id:"gil-vicente",name:"Gil Vicente",shortName:"GIL",colors:["#e00034","#001489"],strength:"rising",marketValue:32e6}]}),N({id:"mls",name:"Major League Soccer",nation:"United States",level:1,nationCode:"USA",clubs:[{id:"la-galaxy",name:"LA Galaxy",shortName:"LAG",colors:["#00245d","#ffd200"],strength:"solid",mentality:"Positive",marketValue:85e6},{id:"la-fc",name:"LAFC",shortName:"LAFC",colors:["#000000","#c59d5f"],strength:"solid",marketValue:95e6},{id:"seattle",name:"Seattle Sounders",shortName:"SEA",colors:["#2c68b1","#66b32e"],strength:"solid",marketValue:8e7},{id:"atlanta",name:"Atlanta United",shortName:"ATL",colors:["#a4000f","#000000"],strength:"solid",marketValue:9e7},{id:"nycfc",name:"NYCFC",shortName:"NYC",colors:["#6cadde","#00285e"],strength:"solid",marketValue:75e6},{id:"inter-miami",name:"Inter Miami",shortName:"MIA",colors:["#ff82ad","#000000"],strength:"rising",marketValue:15e7},{id:"philadelphia",name:"Philadelphia Union",shortName:"PHI",colors:["#002d55","#b4975a"],strength:"solid",marketValue:6e7},{id:"toronto",name:"Toronto FC",shortName:"TOR",colors:["#e31837","#4b9cd3"],strength:"solid",marketValue:5e7},{id:"new-england",name:"New England Revolution",shortName:"NER",colors:["#0a2240","#c8102e"],strength:"rising",marketValue:55e6},{id:"columbus",name:"Columbus Crew",shortName:"CLB",colors:["#fedd00","#000000"],strength:"rising",marketValue:7e7}]}),N({id:"brasileirao",name:"Brasileirão Série A",nation:"Brazil",level:1,nationCode:"BRA",clubs:[{id:"flamengo",name:"Flamengo",shortName:"FLA",colors:["#c8102e","#000000"],strength:"contender",mentality:"Positive",marketValue:195e6},{id:"palmeiras",name:"Palmeiras",shortName:"PAL",colors:["#006437","#ffffff"],strength:"contender",marketValue:18e7},{id:"corinthians",name:"Corinthians",shortName:"COR",colors:["#000000","#ffffff"],strength:"challenger",marketValue:11e7},{id:"sao-paulo",name:"São Paulo",shortName:"SAO",colors:["#ff0000","#000000"],strength:"challenger",marketValue:125e6},{id:"gremio",name:"Grêmio",shortName:"GRE",colors:["#0094d4","#000000"],strength:"challenger",marketValue:115e6},{id:"internacional",name:"Internacional",shortName:"INT",colors:["#ff0000","#ffffff"],strength:"challenger",marketValue:11e7},{id:"atletico-mg",name:"Atlético Mineiro",shortName:"CAM",colors:["#000000","#ffffff"],strength:"challenger",marketValue:14e7},{id:"fluminense",name:"Fluminense",shortName:"FLU",colors:["#900021","#006341"],strength:"solid",marketValue:135e6},{id:"botafogo",name:"Botafogo",shortName:"BOT",colors:["#000000","#ffffff"],strength:"solid",marketValue:95e6},{id:"santos",name:"Santos",shortName:"SAN",colors:["#000000","#ffffff"],strength:"solid",marketValue:8e7}]}),N({id:"j1-league",name:"J1 League",nation:"Japan",level:1,nationCode:"JPN",clubs:[{id:"kawasaki-frontale",name:"Kawasaki Frontale",shortName:"KAW",colors:["#00a0e9","#000000"],strength:"challenger",mentality:"Positive",marketValue:38e6},{id:"yokohama-f-marinos",name:"Yokohama F. Marinos",shortName:"YFM",colors:["#00205b","#d22f27"],strength:"challenger",marketValue:35e6},{id:"kashima-antlers",name:"Kashima Antlers",shortName:"KAS",colors:["#c8102e","#00205b"],strength:"challenger",marketValue:32e6},{id:"urawa-reds",name:"Urawa Reds",shortName:"URW",colors:["#c8102e","#000000"],strength:"challenger",marketValue:33e6},{id:"cerezo-osaka",name:"Cerezo Osaka",shortName:"CER",colors:["#ff5fa2","#002a5c"],strength:"solid",marketValue:28e6},{id:"gamba-osaka",name:"Gamba Osaka",shortName:"GAM",colors:["#0c1b3a","#0091d4"],strength:"solid",marketValue:27e6},{id:"hiroshima",name:"Sanfrecce Hiroshima",shortName:"SAN",colors:["#4c2f91","#ffffff"],strength:"solid",marketValue:3e7},{id:"vissel-kobe",name:"Vissel Kobe",shortName:"VIS",colors:["#9c1830","#ffffff"],strength:"solid",marketValue:45e6},{id:"fc-tokyo",name:"FC Tokyo",shortName:"FCT",colors:["#003da5","#d50032"],strength:"solid",marketValue:26e6},{id:"nagoya",name:"Nagoya Grampus",shortName:"NAG",colors:["#e60012","#f8b500"],strength:"solid",marketValue:34e6}]}),N({id:"championship",name:"EFL Championship",nation:"England",level:2,nationCode:"ENG",clubs:[{id:"leicester",name:"Leicester City",shortName:"LEI",colors:["#003090","#fdb913"],strength:"challenger",marketValue:27e7},{id:"leeds",name:"Leeds United",shortName:"LEE",colors:["#fff200","#1d428a"],strength:"challenger",marketValue:25e7},{id:"southampton",name:"Southampton",shortName:"SOU",colors:["#d71920","#130c0e"],strength:"challenger",marketValue:23e7},{id:"ipswich",name:"Ipswich Town",shortName:"IPS",colors:["#003399","#ffffff"],strength:"solid",marketValue:9e7},{id:"watford",name:"Watford",shortName:"WAT",colors:["#fbee23","#ed2127"],strength:"solid",marketValue:95e6},{id:"norwich",name:"Norwich",shortName:"NOR",colors:["#fff200","#007f3a"],strength:"solid",marketValue:11e7},{id:"sunderland",name:"Sunderland",shortName:"SUN",colors:["#ee2737","#ffffff"],strength:"solid",marketValue:8e7},{id:"middlesbrough",name:"Middlesbrough",shortName:"MID",colors:["#da2128","#ffffff"],strength:"solid",marketValue:85e6},{id:"coventry",name:"Coventry City",shortName:"COV",colors:["#8dc1e8","#000000"],strength:"rising",marketValue:75e6},{id:"west-brom",name:"West Brom",shortName:"WBA",colors:["#0d2340","#ffffff"],strength:"rising",marketValue:78e6}]}),N({id:"la-liga-2",name:"La Liga 2",nation:"Spain",level:2,nationCode:"ESP",clubs:[{id:"leganes",name:"Leganés",shortName:"LEG",colors:["#ffffff","#005baa"],strength:"solid",marketValue:45e6},{id:"espanyol",name:"Espanyol",shortName:"ESP",colors:["#007ac2","#ffffff"],strength:"solid",marketValue:11e7},{id:"elche",name:"Elche",shortName:"ELC",colors:["#0f7b3e","#ffffff"],strength:"solid",marketValue:6e7},{id:"oviedo",name:"Real Oviedo",shortName:"OVI",colors:["#0055a4","#ffc400"],strength:"solid",marketValue:55e6},{id:"zaragoza",name:"Real Zaragoza",shortName:"ZAR",colors:["#00529f","#ffffff"],strength:"solid",marketValue:58e6},{id:"levante",name:"Levante",shortName:"LEV",colors:["#041c2c","#9e1b32"],strength:"solid",marketValue:65e6},{id:"malaga",name:"Málaga",shortName:"MAL",colors:["#6bb3dd","#ffffff"],strength:"rising",marketValue:4e7},{id:"tenerife",name:"Tenerife",shortName:"TEN",colors:["#1c3f95","#ffffff"],strength:"rising",marketValue:32e6},{id:"valladolid",name:"Valladolid",shortName:"VLL",colors:["#4b0082","#ffffff"],strength:"rising",marketValue:85e6},{id:"sporting-gijon",name:"Sporting Gijón",shortName:"SPG",colors:["#d50032","#ffffff"],strength:"rising",marketValue:45e6}]}),N({id:"serie-b",name:"Serie B",nation:"Italy",level:2,nationCode:"ITA",clubs:[{id:"parma",name:"Parma",shortName:"PAR",colors:["#002f87","#ffdd00"],strength:"solid",marketValue:65e6},{id:"palermo",name:"Palermo",shortName:"PAL",colors:["#f5a8b8","#000000"],strength:"solid",marketValue:52e6},{id:"cagliari",name:"Cagliari",shortName:"CAG",colors:["#003366","#a50034"],strength:"solid",marketValue:95e6},{id:"brescia",name:"Brescia",shortName:"BRE",colors:["#0054a6","#ffffff"],strength:"solid",marketValue:45e6},{id:"como",name:"Como",shortName:"COM",colors:["#003399","#ffffff"],strength:"solid",marketValue:6e7},{id:"pisa",name:"Pisa",shortName:"PIS",colors:["#000000","#0076bf"],strength:"rising",marketValue:38e6},{id:"frosinone",name:"Frosinone",shortName:"FRO",colors:["#004aad","#ffda44"],strength:"rising",marketValue:7e7},{id:"spezia",name:"Spezia",shortName:"SPE",colors:["#000000","#ffffff"],strength:"rising",marketValue:75e6},{id:"reggina",name:"Reggina",shortName:"REG",colors:["#800000","#ffffff"],strength:"rising",marketValue:35e6},{id:"lecce",name:"Lecce",shortName:"LEC",colors:["#004aad","#ffdd00"],strength:"rising",marketValue:9e7}]}),N({id:"2-bundesliga",name:"2. Bundesliga",nation:"Germany",level:2,nationCode:"GER",clubs:[{id:"hamburg",name:"Hamburg",shortName:"HSV",colors:["#005ca9","#ffffff"],strength:"solid",marketValue:7e7},{id:"schalke",name:"Schalke",shortName:"S04",colors:["#0d47a1","#ffffff"],strength:"solid",marketValue:8e7},{id:"hertha",name:"Hertha BSC",shortName:"BSC",colors:["#0041ab","#ffffff"],strength:"solid",marketValue:85e6},{id:"st-pauli",name:"St. Pauli",shortName:"STP",colors:["#4b3621","#ffffff"],strength:"solid",marketValue:6e7},{id:"dusseldorf",name:"Fortuna Düsseldorf",shortName:"F95",colors:["#d11241","#ffffff"],strength:"solid",marketValue:55e6},{id:"hannover",name:"Hannover 96",shortName:"H96",colors:["#006633","#000000"],strength:"solid",marketValue:5e7},{id:"nurnberg",name:"Nürnberg",shortName:"FCN",colors:["#800000","#ffffff"],strength:"solid",marketValue:45e6},{id:"paderborn",name:"Paderborn",shortName:"SCP",colors:["#003399","#ffffff"],strength:"rising",marketValue:45e6},{id:"karlsruhe",name:"Karlsruhe",shortName:"KSC",colors:["#0054a6","#ffffff"],strength:"rising",marketValue:38e6},{id:"holstein-kiel",name:"Holstein Kiel",shortName:"KIE",colors:["#005ca9","#ff0000"],strength:"rising",marketValue:4e7}]}),N({id:"ligue-2",name:"Ligue 2",nation:"France",level:2,nationCode:"FRA",clubs:[{id:"auxerre",name:"Auxerre",shortName:"AJA",colors:["#0f5bb3","#ffffff"],strength:"solid",marketValue:35e6},{id:"saint-etienne",name:"Saint-Étienne",shortName:"ASSE",colors:["#00a55c","#ffffff"],strength:"solid",marketValue:5e7},{id:"angers",name:"Angers SCO",shortName:"ANG",colors:["#000000","#ffffff"],strength:"solid",marketValue:4e7},{id:"caen",name:"Caen",shortName:"CAE",colors:["#003087","#e4002b"],strength:"solid",marketValue:25e6},{id:"guingamp",name:"Guingamp",shortName:"GUI",colors:["#d40000","#000000"],strength:"solid",marketValue:24e6},{id:"bastia",name:"Bastia",shortName:"BAS",colors:["#0033a0","#ffffff"],strength:"solid",marketValue:22e6},{id:"dijon",name:"Dijon",shortName:"DIJ",colors:["#d50032","#ffffff"],strength:"rising",marketValue:2e7},{id:"sochaux",name:"Sochaux",shortName:"SOC",colors:["#f9d616","#003a70"],strength:"rising",marketValue:23e6},{id:"grenoble",name:"Grenoble",shortName:"GRE",colors:["#00539f","#ffffff"],strength:"rising",marketValue:18e6},{id:"amiens",name:"Amiens",shortName:"AMI",colors:["#6c757d","#ffffff"],strength:"rising",marketValue:3e7}]}),N({id:"eerste-divisie",name:"Eerste Divisie",nation:"Netherlands",level:2,nationCode:"NED",clubs:[{id:"zwolle",name:"PEC Zwolle",shortName:"ZWO",colors:["#007bc7","#ffffff"],strength:"solid",marketValue:25e6},{id:"willem-ii",name:"Willem II",shortName:"WII",colors:["#a50034","#132257"],strength:"solid",marketValue:22e6},{id:"nac-breda",name:"NAC Breda",shortName:"NAC",colors:["#ffcc00","#000000"],strength:"solid",marketValue:2e7},{id:"de-graafschap",name:"De Graafschap",shortName:"GRA",colors:["#0b4ea2","#ffffff"],strength:"solid",marketValue:15e6},{id:"roda-jc",name:"Roda JC",shortName:"RJC",colors:["#ffcd00","#000000"],strength:"solid",marketValue:14e6},{id:"den-haag",name:"ADO Den Haag",shortName:"ADO",colors:["#007f3b","#ffdd00"],strength:"rising",marketValue:18e6},{id:"almere-city",name:"Almere City",shortName:"ALM",colors:["#e32219","#ffffff"],strength:"rising",marketValue:16e6},{id:"excelsior",name:"Excelsior",shortName:"EXC",colors:["#000000","#ffffff"],strength:"rising",marketValue:17e6},{id:"top-oss",name:"TOP Oss",shortName:"OSS",colors:["#d50032","#ffffff"],strength:"developing",marketValue:8e6},{id:"telstar",name:"Telstar",shortName:"TEL",colors:["#ffffff","#f9a602"],strength:"developing",marketValue:7e6}]}),N({id:"league-one",name:"EFL League One",nation:"England",level:3,nationCode:"ENG",clubs:[{id:"portsmouth",name:"Portsmouth",shortName:"POR",colors:["#003399","#ffffff"],strength:"rising",transferBudget:12e6,wageBudget:4e5,marketValue:28e6},{id:"derby",name:"Derby County",shortName:"DER",colors:["#000000","#ffffff"],strength:"rising",transferBudget:11e6,wageBudget:38e4,marketValue:26e6},{id:"bolton",name:"Bolton Wanderers",shortName:"BOL",colors:["#001489","#ffffff"],strength:"rising",transferBudget:1e7,wageBudget:36e4,marketValue:24e6},{id:"blackpool",name:"Blackpool",shortName:"BLA",colors:["#ff5f00","#ffffff"],strength:"developing",transferBudget:9e6,wageBudget:34e4,marketValue:16e6},{id:"charlton",name:"Charlton",shortName:"CHA",colors:["#c60c30","#ffffff"],strength:"developing",transferBudget:8e6,wageBudget:32e4,marketValue:18e6},{id:"wycombe",name:"Wycombe",shortName:"WYC",colors:["#4f9ec4","#0f1c2c"],strength:"developing",transferBudget:75e5,wageBudget:3e5,marketValue:12e6},{id:"peterborough",name:"Peterborough",shortName:"PET",colors:["#0057b7","#ffffff"],strength:"developing",transferBudget:7e6,wageBudget:28e4,marketValue:2e7},{id:"oxford",name:"Oxford United",shortName:"OXF",colors:["#f4c800","#001489"],strength:"developing",transferBudget:65e5,wageBudget:26e4,marketValue:15e6},{id:"barnsley",name:"Barnsley",shortName:"BAR",colors:["#c8102e","#ffffff"],strength:"developing",transferBudget:6e6,wageBudget:25e4,marketValue:14e6},{id:"lincoln",name:"Lincoln City",shortName:"LIN",colors:["#d4021d","#ffffff"],strength:"developing",transferBudget:55e5,wageBudget:23e4,marketValue:11e6}]}),N({id:"primera-rfef",name:"Primera Federación",nation:"Spain",level:3,nationCode:"ESP",clubs:[{id:"deportivo",name:"Deportivo La Coruña",shortName:"DEP",colors:["#1d4ba0","#ffffff"],strength:"rising",transferBudget:85e5,wageBudget:32e4,marketValue:18e6},{id:"cordoba",name:"Córdoba",shortName:"COR",colors:["#007a33","#ffffff"],strength:"rising",transferBudget:78e5,wageBudget:3e5,marketValue:16e6},{id:"cultural",name:"Cultural Leonesa",shortName:"CUL",colors:["#ffffff","#c8102e"],strength:"developing",transferBudget:72e5,wageBudget:28e4,marketValue:9e6},{id:"murcia",name:"Real Murcia",shortName:"MUR",colors:["#c8102e","#ffffff"],strength:"developing",transferBudget:68e5,wageBudget:26e4,marketValue:1e7},{id:"ponferradina",name:"Ponferradina",shortName:"PON",colors:["#003399","#ffffff"],strength:"developing",transferBudget:65e5,wageBudget:25e4,marketValue:9e6},{id:"alcorcon",name:"Alcorcón",shortName:"ALC",colors:["#ffd100","#0033a0"],strength:"developing",transferBudget:6e6,wageBudget:23e4,marketValue:85e5},{id:"sabadell",name:"Sabadell",shortName:"SAB",colors:["#1b3f8b","#ffffff"],strength:"developing",transferBudget:58e5,wageBudget:22e4,marketValue:8e6},{id:"castellon",name:"Castellón",shortName:"CAS",colors:["#000000","#ffffff"],strength:"developing",transferBudget:55e5,wageBudget:21e4,marketValue:85e5},{id:"ferrol",name:"Racing Ferrol",shortName:"FER",colors:["#007f3a","#ffffff"],strength:"developing",transferBudget:52e5,wageBudget:2e5,marketValue:75e5},{id:"barcelona-b",name:"Barcelona Atlètic",shortName:"BARB",colors:["#004d98","#a50044"],strength:"developing",transferBudget:5e6,wageBudget:19e4,marketValue:25e6}]}),N({id:"serie-c",name:"Serie C",nation:"Italy",level:3,nationCode:"ITA",clubs:[{id:"sudtirol",name:"Südtirol",shortName:"SUD",colors:["#a50034","#ffffff"],strength:"rising",transferBudget:8e6,wageBudget:32e4,marketValue:16e6},{id:"padova",name:"Padova",shortName:"PAD",colors:["#c8102e","#ffffff"],strength:"rising",transferBudget:75e5,wageBudget:3e5,marketValue:14e6},{id:"perugia",name:"Perugia",shortName:"PER",colors:["#d50032","#ffffff"],strength:"developing",transferBudget:7e6,wageBudget:28e4,marketValue:13e6},{id:"ternana",name:"Ternana",shortName:"TER",colors:["#007a33","#d50032"],strength:"developing",transferBudget:65e5,wageBudget:26e4,marketValue:12e6},{id:"modena",name:"Modena",shortName:"MOD",colors:["#002d72","#ffd200"],strength:"developing",transferBudget:62e5,wageBudget:24e4,marketValue:15e6},{id:"cesena",name:"Cesena",shortName:"CES",colors:["#000000","#ffffff"],strength:"developing",transferBudget:6e6,wageBudget:23e4,marketValue:11e6},{id:"catanzaro",name:"Catanzaro",shortName:"CAT",colors:["#ff0000","#ffff00"],strength:"developing",transferBudget:58e5,wageBudget:22e4,marketValue:1e7},{id:"avellino",name:"Avellino",shortName:"AVE",colors:["#007a3d","#ffffff"],strength:"developing",transferBudget:56e5,wageBudget:21e4,marketValue:9e6},{id:"monopoli",name:"Monopoli",shortName:"MON",colors:["#00843d","#ffffff"],strength:"developing",transferBudget:54e5,wageBudget:2e5,marketValue:8e6},{id:"trieste",name:"Triestina",shortName:"TRI",colors:["#c8102e","#ffffff"],strength:"developing",transferBudget:52e5,wageBudget:19e4,marketValue:9e6}]})],la=[ea,...ia],ca="useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";let da=(e=21)=>{let t="",a=crypto.getRandomValues(new Uint8Array(e|=0));for(;e--;)t+=ca[a[e]&63];return t};const ua=2024;function fa(e){const t=ue(e),a={season:ua,week:0,day:0},s=[],n=[],r=[],o=[];la.forEach(d=>{const u=[],f=[];d.clubs.forEach(h=>{const y=At(h,d.id);u.push(y.id);const R=St(h,y,a,t);y.roster.push(...R.map(M=>M.id)),y.wageCommitment=R.reduce((M,b)=>M+b.wage,0),f.push(y),n.push(y),r.push(...R)}),o.push(...Ct(f,d.id,a)),s.push({id:d.id,name:d.name,nation:d.nation,level:d.level,clubIds:u})});const l=va(n,r,t),c={seed:e,date:a,leagues:s,clubs:n,players:r,fixtures:o,matches:[],inbox:["Welcome to HTML5 Football Manager."],results:[],standings:{},transferListings:l,transferHistory:[],userClubId:null,userLeagueId:null};return s.forEach(d=>{c.standings[d.id]=Ve(c,d.id)}),c}function tt(e){const t=e.fixtures.filter(r=>!r.played&&Zt(r.date,e.date)),a=fe(e.seed,e.date.week*10+e.date.day),s=t.map(r=>Nt(e,r,a));if(s.forEach(r=>Bt(e,r)),e.date=Me(e.date),!t.length)return{matches:[],messages:["No fixtures scheduled today."]};const n=t.map(r=>{const o=e.matches.find(u=>u.fixtureId===r.id),l=st(e,r.homeId),c=st(e,r.awayId),d=o?`${o.score.home}-${o.score.away}`:"vs";return`${l} ${d} ${c}`});return{matches:s,messages:n}}function ma(e,t){const a=e.fixtures.find(r=>r.id===t.fixtureId);if(!a||a.played)return null;const s=fe(e.seed,Number(a.id.replace(/\D/g,""))||1),n=Nt(e,a,s);return Bt(e,n),n}function ha(e,t){const a=e.players.find(c=>c.id===t.playerId);if(!a||a.clubId===null)return"Selected player is unavailable.";const s=e.clubs.find(c=>c.id===a.clubId),n=e.clubs.find(c=>c.id===t.buyingClubId);if(!s||!n)return"Invalid clubs for transfer bid.";if(s.id===n.id)return"You already employ this player.";if(t.offer>n.transferBudget)return"Offer exceeds available transfer budget.";const r=e.transferListings.find(c=>c.playerId===a.id),o=(r==null?void 0:r.askingPrice)??Math.round(a.value*1.1);if(t.offer<o*.85)return r==null||r.interestedClubIds.push(n.id),"Bid rejected – the offer is too low.";s.transferBudget+=t.offer,n.transferBudget-=t.offer,s.roster=s.roster.filter(c=>c!==a.id),n.roster.push(a.id),a.clubId=n.id,a.transferListed=!1,n.wageCommitment+=a.wage,s.wageCommitment-=a.wage;const l={id:da(),playerId:a.id,fromClubId:s.id,toClubId:n.id,fee:t.offer,date:{...e.date}};return e.transferHistory.unshift(l),r&&(r.status="Completed"),e.inbox.unshift(`${a.name} has signed for ${n.name} for £${Na(t.offer)}.`),`${a.name} agrees to join ${n.name}.`}const at={academy:{baseAbility:134,tempo:59,press:60},challenger:{baseAbility:144,tempo:62,press:64},elite:{baseAbility:152,tempo:64,press:66}},ga={England:"ENG",Spain:"ESP",Italy:"ITA",Germany:"GER",France:"FRA",Netherlands:"NED",Portugal:"PRT",Brazil:"BRA",Japan:"JPN",USA:"USA"};function pa(e,t){const a=e.leagues.find(m=>m.id===t.leagueId);if(!a)return{success:!1,message:"Selected league does not exist."};const s=t.name.trim();if(s.length<3)return{success:!1,message:"Club name must be at least three characters."};const n=t.shortName.trim().toUpperCase();if(n.length<2||n.length>5)return{success:!1,message:"Short name must be 2-5 characters."};if(e.clubs.some(m=>m.name.toLowerCase()===s.toLowerCase()))return{success:!1,message:"A club with that name already exists."};if(e.clubs.some(m=>m.shortName.toUpperCase()===n))return{success:!1,message:"Short name is already in use."};const r=at[t.profile]??at.academy,o=Ca(s)||`custom-${e.clubs.length+1}`;let l=o,c=1;for(;e.clubs.some(m=>m.id===l);)l=`${o}-${c}`,c+=1;const d=t.nationality??ga[a.nation]??"ENG",u=Rt(l,d,r.baseAbility),f=u.reduce((m,p)=>m+p.value,0),h=Math.round(Math.max(2e7,f*.09)),y=Math.round(Math.max(45e4,f*.0025)),R=Math.round(Math.min(9200,6900+Math.log10(f/1e6)*520)),M={id:l,name:s,shortName:n,colors:[t.primaryColor,t.secondaryColor],formation:t.formation,mentality:t.mentality,tempo:r.tempo,press:r.press,rep:R,marketValue:f,transferBudget:h,wageBudget:y,players:u},b=At(M,a.id),$=fe(e.seed,e.players.length+e.clubs.length+17),k=ue($),L=St(M,b,e.date,k);b.roster.push(...L.map(m=>m.id)),b.wageCommitment=L.reduce((m,p)=>m+p.wage,0),e.clubs.push(b),e.players.push(...L);const V=e.leagues.find(m=>m.id===a.id);V&&(V.clubIds=[...V.clubIds,b.id]),e.fixtures=e.fixtures.filter(m=>m.competitionId!==a.id);const v=e.clubs.filter(m=>m.leagueId===a.id);return e.fixtures.push(...Ct(v,a.id,e.date)),e.standings[a.id]=Ve(e,a.id),e.inbox.unshift(`${b.name} has been founded and joins ${a.name}.`),{success:!0,clubId:b.id,message:`${b.name} is ready for its inaugural season in ${a.name}.`}}function kt(e,t){return t?e.fixtures.filter(a=>!a.played&&(a.homeId===t||a.awayId===t)).sort((a,s)=>nt(a.date)-nt(s.date)).slice(0,5):[]}function Bt(e,t){e.matches.push(t),e.results.unshift(t);const a=e.fixtures.find(s=>s.id===t.fixtureId);a&&(a.played=!0,a.matchId=t.id,e.standings[a.competitionId]=Ve(e,a.competitionId))}function At(e,t){const a=e.marketValue??ya(e);return{id:e.id,name:e.name,shortName:e.shortName,leagueId:t,roster:[],colors:e.colors,tactics:{formation:e.formation,mentality:e.mentality,tempo:e.tempo,press:e.press},rep:e.rep,marketValue:a,transferBudget:e.transferBudget,wageBudget:e.wageBudget,wageCommitment:0}}function ya(e){return e.players.length?e.players.reduce((t,a)=>t+a.value,0):12e7}function St(e,t,a,s){return e.players.map(n=>({id:n.id,name:n.name,age:n.age,nationality:n.nationality,foot:n.foot,positions:n.positions,attributes:ba(n,s),currentAbility:n.currentAbility,potentialAbility:n.potentialAbility,morale:75+Math.round(s.next()*10),condition:88+Math.round(s.next()*10),sharpness:70+Math.round(s.next()*15),value:n.value,wage:n.wage,contractExpirySeason:a.season+n.contractYears,clubId:t.id,form:[],transferListed:n.contractYears<=2&&n.age>30}))}function ba(e,t){const a=Math.max(6,Math.min(19,Math.round(e.currentAbility/10))),s=()=>Le(a+Math.round((t.next()-.5)*4),3,20),n={finishing:B(e.positions,["ST","AM","LW","RW"],s,a+1,t),firstTouch:s(),passing:B(e.positions,["CM","DM","AM","RB","LB"],s,a+1,t),crossing:B(e.positions,["RB","LB","LW","RW"],s,a,t),dribbling:B(e.positions,["LW","RW","AM","ST"],s,a+1,t),heading:B(e.positions,["CB","ST"],s,a,t),tackling:B(e.positions,["CB","DM","RB","LB"],s,a+1,t),marking:B(e.positions,["CB","DM"],s,a+1,t),longShots:s(),setPieces:s(),decisions:a+Math.round(t.next()*2),anticipation:s(),vision:B(e.positions,["AM","CM"],s,a+1,t),workRate:a+Math.round(t.next()*3),bravery:a+Math.round(t.next()*3),composure:B(e.positions,["ST","AM","CM"],s,a+1,t),offTheBall:B(e.positions,["ST","AM","LW","RW"],s,a+1,t),positioning:B(e.positions,["CB","DM"],s,a+1,t),leadership:a-1+Math.round(t.next()*3),flair:B(e.positions,["AM","LW","RW"],s,a+2,t),pace:B(e.positions,["LW","RW","ST","RB","LB"],s,a+1,t),acceleration:B(e.positions,["LW","RW","ST"],s,a+1,t),strength:B(e.positions,["CB","ST","DM"],s,a,t),stamina:a+Math.round(t.next()*3),agility:s(),jumping:B(e.positions,["CB","ST"],s,a,t),handling:e.positions.includes("GK")?a+2:1,reflexes:e.positions.includes("GK")?a+1:1,aerial:e.positions.includes("GK")?a+1:s(),distribution:e.positions.includes("GK")?a+1:s()},r=Object.entries(n),o={};return r.forEach(([l,c])=>{o[l]=Le(c,1,20)}),o}function B(e,t,a,s,n){return e.some(r=>t.includes(r))?Le(s+Math.round((n.next()-.4)*4),1,20):a()}function va(e,t,a){const s=[];if(t.filter(n=>n.transferListed).forEach(n=>{s.push({playerId:n.id,fromClubId:n.clubId,askingPrice:Math.round(n.value*(1+a.next()*.1)),interestedClubIds:[],status:"Available"})}),s.length<8){const n=[...t].filter(r=>r.clubId!==null).sort((r,o)=>o.currentAbility-r.currentAbility);for(const r of n)if(!s.some(o=>o.playerId===r.id)&&(s.push({playerId:r.id,fromClubId:r.clubId,askingPrice:Math.round(r.value*1.15),interestedClubIds:[],status:"Available"}),s.length>=8))break}return s}function Ve(e,t){const a=e.clubs.filter(r=>r.leagueId===t),s=new Map,n=new Map(e.fixtures.map(r=>[r.id,r]));return a.forEach(r=>{s.set(r.id,{clubId:r.id,played:0,won:0,drawn:0,lost:0,goalsFor:0,goalsAgainst:0,goalDifference:0,points:0,form:[]})}),e.results.slice().reverse().forEach(r=>{const o=n.get(r.fixtureId);if(!o||o.competitionId!==t)return;const l=[r.stats[0].clubId,r.stats[1].clubId];l.forEach((c,d)=>{const u=s.get(c);if(!u)return;const f=l[1-d];if(!s.has(f))return;const h=r.stats[d].goals,y=r.stats[1-d].goals;u.played+=1,u.goalsFor+=h,u.goalsAgainst+=y,u.goalDifference=u.goalsFor-u.goalsAgainst,h>y?(u.won+=1,u.points+=3,u.form.push("W")):h===y?(u.drawn+=1,u.points+=1,u.form.push("D")):(u.lost+=1,u.form.push("L")),u.form.length>5&&(u.form=u.form.slice(u.form.length-5))})}),Array.from(s.values()).sort((r,o)=>o.points!==r.points?o.points-r.points:o.goalDifference!==r.goalDifference?o.goalDifference-r.goalDifference:o.goalsFor!==r.goalsFor?o.goalsFor-r.goalsFor:a.findIndex(l=>l.id===r.clubId)-a.findIndex(l=>l.id===o.clubId))}function Ca(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,40)}function Mt(e,t){return t?e.standings[t]??[]:[]}function st(e,t){var a;return((a=e.clubs.find(s=>s.id===t))==null?void 0:a.shortName)??"Unknown"}function Le(e,t,a){return Math.max(t,Math.min(a,e))}function nt(e){return e.season*1e3+e.week*10+e.day}function Na(e){return new Intl.NumberFormat("en-GB",{notation:"compact",compactDisplay:"short"}).format(e)}function Q(e){return`Season ${e.season} • Week ${e.week+1} • Day ${e.day+1}`}function Ra(e){const t=fa(e);return qt(jt((a,s)=>({world:t,lastSummary:null,advanceDay:()=>{const n=tt(s().world);return a(r=>{r.lastSummary=n}),n},advanceDays:n=>{let r={matches:[],messages:[]};for(let o=0;o<n;o+=1)r=tt(s().world);return a(o=>{o.lastSummary=r}),r},runFixture:n=>{const r=ma(s().world,n);return r?(a(o=>{o.lastSummary={matches:[r],messages:[`${Q(o.world.date)}: ${r.score.home}-${r.score.away}`]}}),{matchId:r.id,message:"Match simulated successfully."}):{matchId:null,message:"Fixture could not be simulated."}},placeBid:n=>{const r=ha(s().world,n);return a(o=>{o.lastSummary={matches:[],messages:[r]}}),r},buildCustomClub:n=>{const r=pa(s().world,n);return a(o=>{o.lastSummary={matches:[],messages:[r.message]}}),r},setUserClub:n=>{a(r=>{r.world.userClubId=n;const o=r.world.clubs.find(l=>l.id===n);r.world.userLeagueId=(o==null?void 0:o.leagueId)??null})}})))}class ka{constructor(t){this.listeners=new Set,this.store=Ra(t)}get snapshot(){return this.store.getState().world}get summary(){return this.store.getState().lastSummary}dispatch(t){var s;const a=this.store.getState();switch(t.type){case"ADVANCE_DAY":{const n=a.advanceDay();return this.notify(),n}case"ADVANCE_DAYS":{const n=((s=t.payload)==null?void 0:s.days)??7,r=a.advanceDays(n);return this.notify(),r}case"SIMULATE_FIXTURE":{const n=a.runFixture(t.payload);return this.notify(),n}case"MAKE_TRANSFER_BID":{const n=a.placeBid(t.payload);return this.notify(),n}case"CREATE_CUSTOM_CLUB":{const n=a.buildCustomClub(t.payload);return this.notify(),n}case"SET_USER_CLUB":return a.setUserClub(t.payload.clubId),this.notify(),null;default:return null}}subscribe(t){const a=this.store.subscribe(()=>{t()});return this.listeners.add(t),()=>{this.listeners.delete(t),a()}}notify(){this.listeners.forEach(t=>t())}}function Ba(){const e=Date.now();return{s1:e&4294967295,s2:e>>32&4294967295}}function Aa(e){if(!e)return;const t=e.getContext("2d");if(!t)return;const{width:a,height:s}=e;t.fillStyle="#0b5d23",t.fillRect(0,0,a,s),t.strokeStyle="#ffffff",t.lineWidth=2,t.strokeRect(20,20,a-40,s-40),t.beginPath(),t.moveTo(a/2,20),t.lineTo(a/2,s-20),t.stroke(),t.beginPath(),t.arc(a/2,s/2,60,0,Math.PI*2),t.stroke(),rt(t,20,s/2-70,80,140),rt(t,a-100,s/2-70,80,140),t.beginPath(),t.arc(60,s/2,12,0,Math.PI*2),t.stroke(),t.beginPath(),t.arc(a-60,s/2,12,0,Math.PI*2),t.stroke()}function rt(e,t,a,s,n){e.strokeRect(t,a,s,n),e.strokeRect(t,a+30,s,n-60)}function ot(e){return`Season ${e.season} • Week ${e.week+1} • Day ${e.day+1}`}function Sa(e){if(e.userClubId)return e.fixtures.find(t=>!t.played&&(t.homeId===e.userClubId||t.awayId===e.userClubId))}function Ma(e){var u;const t=Sa(e),a=e.inbox.slice(0,4),s=e.results.slice(0,4),n=e.clubs.find(f=>f.id===e.userClubId);if(!n)return`
      <section class="card hero">
        <div class="hero-text">
          <span class="eyebrow">Welcome</span>
          <h2>Pick your club</h2>
          <p>Use the setup prompt to choose a team and unlock the dashboard.</p>
        </div>
      </section>
      <section class="card">
        <p class="empty">A club selection is required to view fixtures, standings, and finances.</p>
      </section>
    `;const r=e.leagues.find(f=>f.id===n.leagueId),o=new Map(e.fixtures.map(f=>[f.id,f])),l=kt(e,e.userClubId).slice(0,3).map(f=>({id:f.id,home:f.homeId===e.userClubId,opponentId:f.homeId===e.userClubId?f.awayId:f.homeId,date:f.date})),c=n.leagueId??e.userLeagueId??((u=e.leagues[0])==null?void 0:u.id)??null,d=Mt(e,c).slice(0,6);return`
    <section class="card hero">
      <div class="hero-text">
        <span class="eyebrow">Today</span>
        <h2>${(n==null?void 0:n.name)??"HTML5 Football Manager"}</h2>
        <p>${ot(e.date)}</p>
        <div class="hero-meta">
          ${r?`<span class="pill">${r.name}</span>`:""}
          <span class="pill">${e.clubs.length} clubs</span>
          <span class="pill">${e.players.length} players</span>
        </div>
      </div>
      <div class="hero-stats">
        ${ve("Form",Va(e.results,o,(n==null?void 0:n.id)??""))}
        ${ve("Goal Difference",Pa(e.results,o,(n==null?void 0:n.id)??""))}
        ${ve("Matches Played",`${$a(e.results,o,(n==null?void 0:n.id)??"")}`)}
      </div>
    </section>
    <section class="card fixture-card">
      <div class="section-heading">
        <span class="eyebrow">Next Fixture</span>
        <h2>On the horizon</h2>
      </div>
      ${t?Ia(e,t):'<p class="empty">No upcoming fixtures scheduled.</p>'}
    </section>
    <section class="card results-card">
      <div class="section-heading">
        <span class="eyebrow">Recent Results</span>
        <h2>Match log</h2>
      </div>
      ${s.length?wa(e,s,o):'<p class="empty">No matches played yet.</p>'}
    </section>
    <section class="card">
      <div class="section-heading">
        <span class="eyebrow">Form guide</span>
        <h2>Upcoming</h2>
      </div>
      ${l.length?`<ul class="fixtures-list">${l.map(f=>`<li><span class="badge">${f.home?"Home":"Away"}</span><strong>${Ea(e,f.opponentId)}</strong><span>${ot(f.date)}</span></li>`).join("")}</ul>`:'<p class="empty">Your schedule is clear.</p>'}
    </section>
    <section class="card">
      <div class="section-heading">
        <span class="eyebrow">Standings</span>
        <h2>Top six</h2>
      </div>
      ${La(e,d)}
    </section>
    <section class="card inbox-card">
      <div class="section-heading">
        <span class="eyebrow">Inbox</span>
        <h2>Latest notes</h2>
      </div>
      <ul class="inbox-list">
        ${a.length?a.map(f=>`<li>${f}</li>`).join(""):"<li>No new mail.</li>"}
      </ul>
    </section>
  `}function La(e,t){return t.length?`
    <table class="data-table compact">
      <thead>
        <tr>
          <th>#</th>
          <th>Club</th>
          <th>Pts</th>
          <th>GD</th>
        </tr>
      </thead>
      <tbody>
        ${t.map((a,s)=>{const n=e.clubs.find(r=>r.id===a.clubId);return`
              <tr>
                <td>${s+1}</td>
                <td>${(n==null?void 0:n.shortName)??a.clubId}</td>
                <td>${a.points}</td>
                <td>${a.goalDifference}</td>
              </tr>
            `}).join("")}
      </tbody>
    </table>
  `:'<p class="empty">No table data yet.</p>'}function Ea(e,t){var a;return((a=e.clubs.find(s=>s.id===t))==null?void 0:a.shortName)??t}function ve(e,t){return`
    <div class="hero-metric">
      <span>${e}</span>
      <strong>${t}</strong>
    </div>
  `}function Ia(e,t){const a=e.clubs.find(n=>n.id===t.homeId),s=e.clubs.find(n=>n.id===t.awayId);return`
    <div class="fixture">
      <div class="club home">
        <span class="badge">Home</span>
        <h3>${(a==null?void 0:a.name)??"Unknown"}</h3>
      </div>
      <div class="vs">VS</div>
      <div class="club away">
        <span class="badge">Away</span>
        <h3>${(s==null?void 0:s.name)??"Unknown"}</h3>
      </div>
    </div>
  `}function wa(e,t,a){return`
    <ul class="results-list">
      ${t.map(s=>{var l,c;const n=a.get(s.fixtureId)??e.fixtures.find(d=>d.id===s.fixtureId),r=((l=e.clubs.find(d=>d.id===(n==null?void 0:n.homeId)))==null?void 0:l.shortName)??"Home",o=((c=e.clubs.find(d=>d.id===(n==null?void 0:n.awayId)))==null?void 0:c.shortName)??"Away";return`
            <li>
              <div class="result-match">
                <strong>${r}</strong>
                <span class="score-pill">${s.score.home} - ${s.score.away}</span>
                <strong>${o}</strong>
              </div>
            </li>
          `}).join("")}
    </ul>
  `}function Va(e,t,a){return a&&e.filter(n=>Lt(t,n,a)).slice(0,5).map(n=>{const r=t.get(n.fixtureId);if(!r)return"-";const o=r.homeId===a,l=o?n.score.home:n.score.away,c=o?n.score.away:n.score.home;return l===c?"D":l>c?"W":"L"}).join(" ")||"-"}function Pa(e,t,a){if(!a)return"0";const s=e.reduce((n,r)=>{const o=t.get(r.fixtureId);if(!o||o.homeId!==a&&o.awayId!==a)return n;const l=o.homeId===a,c=l?r.score.home:r.score.away,d=l?r.score.away:r.score.home;return n+(c-d)},0);return s>=0?`+${s}`:`${s}`}function $a(e,t,a){return a?e.filter(s=>Lt(t,s,a)).length:0}function Lt(e,t,a){const s=e.get(t.fixtureId);return s?s.homeId===a||s.awayId===a:!1}function Fa(e){if(!e.userClubId)return'<section class="card"><p class="empty">Select a club to view matchday reports.</p></section>';const t=e.results[0],a=kt(e,e.userClubId);return`
    <section class="card match-card">
      <div class="section-heading">
        <span class="eyebrow">Last Result</span>
        <h2>Full-time report</h2>
      </div>
      ${t?Ga(e,t):'<p class="empty">No matches played yet.</p>'}
    </section>
    <section class="card">
      <div class="section-heading">
        <span class="eyebrow">Simulation</span>
        <h2>Instant result</h2>
      </div>
      ${a.length?`<form id="manual-sim-form" class="inline-form">
              <label for="manual-sim-select">Upcoming fixture</label>
              <div class="input-row">
                <select id="manual-sim-select" required>
                  ${a.map(s=>`<option value="${s.id}">${s.homeId===e.userClubId?"vs "+lt(e,s.awayId):"at "+lt(e,s.homeId)}</option>`).join("")}
                </select>
                <button type="submit" class="primary">Simulate</button>
              </div>
            </form>`:'<p class="empty">No fixtures remain to simulate.</p>'}
    </section>
  `}function Ta(e,t){const a=e.querySelector("#manual-sim-form");a&&a.addEventListener("submit",s=>{s.preventDefault();const n=a.querySelector("#manual-sim-select");if(!n||!n.value){t.notify("Select a fixture to simulate.");return}const r=t.simulateFixture(n.value);t.handleResult(r)})}function Ga(e,t){const a=e.fixtures.find(l=>l.id===t.fixtureId),s=e.clubs.find(l=>l.id===(a==null?void 0:a.homeId)),n=e.clubs.find(l=>l.id===(a==null?void 0:a.awayId)),r=t.stats.find(l=>l.clubId===(a==null?void 0:a.homeId)),o=t.stats.find(l=>l.clubId===(a==null?void 0:a.awayId));return`
    ${Da((s==null?void 0:s.name)??"Home",(n==null?void 0:n.name)??"Away",t.score.home,t.score.away)}
    <div class="match-stats">
      ${Ce("Shots",(r==null?void 0:r.shots)??0,(o==null?void 0:o.shots)??0)}
      ${Ce("On Target",(r==null?void 0:r.shotsOnTarget)??0,(o==null?void 0:o.shotsOnTarget)??0)}
      ${Ce("Possession",it(r==null?void 0:r.possession),it(o==null?void 0:o.possession))}
    </div>
    <h3>Timeline</h3>
    <ul class="timeline">
      ${t.events.length?t.events.map(l=>`<li><span class="minute">${l.minute}'</span><span>${l.description}</span></li>`).join(""):'<li class="empty">No key events recorded.</li>'}
    </ul>
    <h3>Player impact</h3>
    <table class="data-table">
      <thead>
        <tr>
          <th>Player</th>
          <th>Rating</th>
          <th>Goals</th>
          <th>Shots</th>
          <th>Passes</th>
          <th>Tackles</th>
        </tr>
      </thead>
      <tbody>
        ${t.playerStats.slice().sort((l,c)=>c.rating-l.rating).map(l=>{const c=e.players.find(d=>d.id===l.playerId);return`
              <tr>
                <td>${(c==null?void 0:c.name)??l.playerId}</td>
                <td><span class="stat-badge">${l.rating.toFixed(1)}</span></td>
                <td>${l.goals}</td>
                <td>${l.shots}</td>
                <td>${l.passesCompleted}</td>
                <td>${l.tacklesWon}</td>
              </tr>
            `}).join("")}
      </tbody>
    </table>
  `}function Da(e,t,a,s){return`
    <div class="scoreboard">
      <div class="team">
        <span class="team-name">${e}</span>
        <span class="team-score">${a}</span>
      </div>
      <div class="score-divider">vs</div>
      <div class="team">
        <span class="team-name">${t}</span>
        <span class="team-score">${s}</span>
      </div>
    </div>
  `}function Ce(e,t,a){return`
    <div class="match-stat">
      <span class="label">${e}</span>
      <div class="values">
        <span>${t}</span>
        <span>${a}</span>
      </div>
    </div>
  `}function it(e){return e!==void 0?`${e.toFixed(0)}%`:"-"}function lt(e,t){var a;return((a=e.clubs.find(s=>s.id===t))==null?void 0:a.shortName)??"Unknown"}function xa(e){const t=e.clubs.find(s=>s.id===e.userClubId);if(!t)return'<section class="card"><p>No club selected.</p></section>';const a=t.roster.map(s=>e.players.find(n=>n.id===s)).filter(s=>!!s).sort((s,n)=>n.currentAbility-s.currentAbility);return`
    <section class="card squad-card">
      <div class="section-heading">
        <span class="eyebrow">Squad Overview</span>
        <h2>${t.name}</h2>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Player</th>
            <th>Positions</th>
            <th>Age</th>
            <th>CA</th>
            <th>Morale</th>
            <th>Condition</th>
            <th>Wage</th>
            <th>Value</th>
            <th>Contract</th>
          </tr>
        </thead>
        <tbody>
          ${a.map(s=>{const n=s.nationality;return`
                <tr>
                  <td>
                    <div class="player-cell">
                      <span class="avatar">${s.name.slice(0,1)}</span>
                      <div>
                        <strong>${s.name}</strong>
                        ${n?`<small>${n}</small>`:""}
                      </div>
                    </div>
                  </td>
                  <td>${s.positions.map(r=>`<span class="pill muted">${r}</span>`).join(" ")}</td>
                  <td>${s.age.toFixed(0)}</td>
                  <td><span class="stat-badge">${s.currentAbility}</span></td>
                  <td>
                    <div class="meter" style="--value:${Math.round(s.morale)}"></div>
                    <small>${Math.round(s.morale)}</small>
                  </td>
                  <td>
                    <div class="meter positive" style="--value:${Math.round(s.condition)}"></div>
                    <small>${Math.round(s.condition)}%</small>
                  </td>
                  <td>£${ct(s.wage)}/wk</td>
                  <td>£${ct(s.value)}</td>
                  <td>${s.contractExpirySeason}</td>
                </tr>
              `}).join("")}
        </tbody>
      </table>
    </section>
  `}function ct(e){return new Intl.NumberFormat("en-GB",{maximumFractionDigits:0}).format(e)}function _a(e){const t=e.clubs.find(s=>s.id===e.userClubId);return t?`
    <section class="card tactics-card">
      <div class="section-heading">
        <span class="eyebrow">Tactical Identity</span>
        <h2>Game model</h2>
      </div>
      ${`
    <div class="tactics-controls">
      <div class="control">
        <span class="eyebrow">Formation</span>
        <div class="field">
          <select id="formation-select" disabled>
            ${["4-4-2","4-3-3","3-5-2","4-2-3-1"].map(s=>`<option value="${s}" ${s===t.tactics.formation?"selected":""}>${s}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="control">
        <span class="eyebrow">Mentality</span>
        <div class="field">
          <select id="mentality-select" disabled>
            ${["Cautious","Balanced","Positive"].map(s=>`<option value="${s}" ${s===t.tactics.mentality?"selected":""}>${s}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="control">
        <span class="eyebrow">Tempo</span>
        <div class="slider"><input type="range" min="0" max="100" value="${t.tactics.tempo}" disabled /></div>
      </div>
      <div class="control">
        <span class="eyebrow">Press</span>
        <div class="slider"><input type="range" min="0" max="100" value="${t.tactics.press}" disabled /></div>
      </div>
    </div>
  `}
      <p class="muted-text">
        Editing is locked for this slice. The next milestone unlocks interactive role selection,
        in-possession tweaks, and set-piece blueprints.
      </p>
    </section>
    <section class="card formation-card">
      <div class="section-heading">
        <span class="eyebrow">Shape</span>
        <h2>Formation board</h2>
      </div>
      <canvas id="tactics-pitch" class="pitch" width="900" height="420"></canvas>
    </section>
  `:'<section class="card"><p>No tactics available.</p></section>'}function Wa(e){const t=e.clubs.find(n=>n.id===e.userClubId);if(!t)return'<section class="card"><p class="empty">Select a club to manage transfers.</p></section>';const a=e.transferListings.filter(n=>n.status!=="Completed"),s=e.transferHistory.slice(0,6);return`
    <section class="card">
      <div class="section-heading">
        <span class="eyebrow">Budgets</span>
        <h2>Financial outlook</h2>
      </div>
      <div class="budget-grid">
        <div class="budget-tile">
          <span>Transfer budget</span>
          <strong>£${U(t.transferBudget)}</strong>
        </div>
        <div class="budget-tile">
          <span>Wage budget</span>
          <strong>£${U(t.wageBudget)}/wk</strong>
        </div>
        <div class="budget-tile">
          <span>Committed wages</span>
          <strong>£${U(t.wageCommitment)}/wk</strong>
        </div>
      </div>
    </section>
    <section class="card">
      <div class="section-heading">
        <span class="eyebrow">Marketplace</span>
        <h2>Transfer targets</h2>
      </div>
      ${a.length?`<table class="data-table transfers-table">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Club</th>
                  <th>Value</th>
                  <th>Asking price</th>
                  <th>Bid</th>
                </tr>
              </thead>
              <tbody>
                ${a.map(n=>za(e,n)).join("")}
              </tbody>
            </table>`:'<p class="empty">No players are currently available.</p>'}
    </section>
    <section class="card">
      <div class="section-heading">
        <span class="eyebrow">Recent activity</span>
        <h2>Completed deals</h2>
      </div>
      ${s.length?`<ul class="timeline">${s.map(n=>{const r=e.players.find(c=>c.id===n.playerId),o=e.clubs.find(c=>c.id===n.fromClubId),l=e.clubs.find(c=>c.id===n.toClubId);return`<li><span class="minute">£${U(n.fee)}</span><span>${(r==null?void 0:r.name)??"Player"} → ${(l==null?void 0:l.shortName)??"???"} (${(o==null?void 0:o.shortName)??"???"})</span></li>`}).join("")}</ul>`:'<p class="empty">No recent transfers.</p>'}
    </section>
  `}function Oa(e,t){e.querySelectorAll("[data-transfer-action]").forEach(a=>{a.addEventListener("click",()=>{const s=a.dataset.playerId,n=a.dataset.inputId;if(!s||!n)return;const r=e.querySelector(`#${n}`);if(!r)return;const o=Number.parseInt(r.value.replace(/[^0-9]/g,""),10);if(!Number.isFinite(o)||o<=0){t.notify("Enter a valid offer amount.");return}const l=t.makeTransferBid(s,o);t.notify(l)})})}function za(e,t){const a=e.players.find(r=>r.id===t.playerId),s=e.clubs.find(r=>r.id===t.fromClubId),n=`offer-${t.playerId}`;return`
    <tr>
      <td>
        <div class="player-cell">
          <strong>${(a==null?void 0:a.name)??"Unknown"}</strong>
          <span>${(a==null?void 0:a.positions.join(", "))??""}</span>
        </div>
      </td>
      <td>${(s==null?void 0:s.shortName)??"-"}</td>
      <td>£${U((a==null?void 0:a.value)??0)}</td>
      <td>£${U(t.askingPrice)}</td>
      <td>
        <div class="input-row">
          <input id="${n}" type="number" min="100000" step="500000" value="${t.askingPrice}" />
          <button type="button" class="primary" data-transfer-action data-player-id="${t.playerId}" data-input-id="${n}">
            Submit bid
          </button>
        </div>
      </td>
    </tr>
  `}function U(e){return new Intl.NumberFormat("en-GB",{maximumFractionDigits:0}).format(e)}function Ua(e,t){const a=[...e.leagues].sort((o,l)=>o.level-l.level||o.name.localeCompare(l.name)),s=a.find(o=>o.id===t)??a[0];if(!s)return'<section class="card"><p class="empty">No league data available.</p></section>';const n=Mt(e,s.id),r=`${e.leagues.length} competitions across ${new Set(e.leagues.map(o=>o.nation)).size} nations`;return`
    <section class="card">
      <div class="section-heading">
        <span class="eyebrow">Competition</span>
        <h2>${s.name}</h2>
      </div>
      <div class="toolbar">
        <label for="standings-league" class="muted-text">League</label>
        <select id="standings-league">
          ${a.map(o=>`<option value="${o.id}" ${o.id===s.id?"selected":""}>${o.name} (Tier ${o.level}, ${o.nation})</option>`).join("")}
        </select>
      </div>
      <p class="muted-text">${r}</p>
      <table class="data-table standings-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Club</th>
            <th>P</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GF</th>
            <th>GA</th>
            <th>GD</th>
            <th>Pts</th>
            <th>Form</th>
          </tr>
        </thead>
        <tbody>
          ${Ka(e,n)}
        </tbody>
      </table>
    </section>
  `}function Ka(e,t){return t.map((a,s)=>{const n=e.clubs.find(o=>o.id===a.clubId);return`
        <tr class="${a.clubId===e.userClubId?"highlight":""}">
          <td>${s+1}</td>
          <td>${(n==null?void 0:n.name)??a.clubId}</td>
          <td>${a.played}</td>
          <td>${a.won}</td>
          <td>${a.drawn}</td>
          <td>${a.lost}</td>
          <td>${a.goalsFor}</td>
          <td>${a.goalsAgainst}</td>
          <td>${a.goalDifference}</td>
          <td>${a.points}</td>
          <td><span class="form-seq">${a.form.join(" ")||"-"}</span></td>
        </tr>
      `}).join("")}function Ha(e,t){const a=e.querySelector("#standings-league");a&&a.addEventListener("change",()=>{t.onLeagueChange(a.value)})}const Et="hfm-theme";function ja(){try{const e=window.localStorage.getItem(Et);if(e==="light"||e==="dark")return e}catch{}return null}function Ja(){return window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function qa(e){try{window.localStorage.setItem(Et,e)}catch{}}let w=null,dt=!1;const Pe=document.getElementById("app"),It=ja();let $e=It!==null,Fe=It??Ja(),F=null,P=null,se=!1;const z=[];let ut=0;function E(){if(!w)throw new Error("Game store has not been initialized");return w}const J=document.createElement("button");J.type="button";J.classList.add("ghost");function Te(e,t=!0){Fe=e,document.documentElement.dataset.theme=e,J.textContent=e==="dark"?"☀️ Light":"🌙 Dark",J.setAttribute("aria-label",e==="dark"?"Switch to light mode":"Switch to dark mode"),t&&qa(e)}Te(Fe,$e);const Ya=window.matchMedia("(prefers-color-scheme: dark)");Ya.addEventListener("change",e=>{$e||Te(e.matches?"dark":"light",!1)});if(!Pe)throw new Error("App container not found");Pe.className="shell";const Ge=document.createElement("header");Ge.className="topbar glass";const ee=document.createElement("aside");ee.className="sidebar glass";const x=document.createElement("main");x.className="content";const De=document.createElement("div");De.className="title-group";const K=document.createElement("h1");K.className="page-title";const _=document.createElement("p");_.className="page-subtitle";const xe=document.createElement("div");xe.className="controls";J.addEventListener("click",()=>{$e=!0,Te(Fe==="dark"?"light":"dark")});const G=document.createElement("button");G.type="button";G.className="secondary";G.textContent="Choose Club";G.disabled=!0;G.addEventListener("click",()=>{P==null||P.open()});const te=document.createElement("button");te.textContent="Advance Day";te.className="primary";te.addEventListener("click",()=>{const e=E().dispatch({type:"ADVANCE_DAY"});ge(e)});const me=document.createElement("button");me.textContent="Advance 7 Days";me.addEventListener("click",()=>{const e=E().dispatch({type:"ADVANCE_DAYS",payload:{days:7}});ge(e)});xe.append(J,G,te,me);function wt(e){te.disabled=!e,me.disabled=!e}function Za(e){const t=!!w;G.disabled=!t,G.className=e?"ghost":"primary",G.textContent=e?"Change Club":"Choose Club"}const _e=document.createElement("div");_e.className="brand";_e.innerHTML='<span class="brand-mark">⚽</span><span class="brand-text">Manager</span>';ee.append(_e);const Xa={simulateFixture:e=>E().dispatch({type:"SIMULATE_FIXTURE",payload:{fixtureId:e}}),makeTransferBid:(e,t)=>{const a=E(),s=a.snapshot.userClubId;return s?a.dispatch({type:"MAKE_TRANSFER_BID",payload:{playerId:e,buyingClubId:s,offer:t}}):"Choose a club before making transfer bids."},handleResult:e=>ge(e),notify:T},Vt={dashboard:{render:Ma},squad:{render:xa},tactics:{render:_a},match:{render:Fa,bind:Ta},standings:{render:e=>{var t;return(!F||!e.leagues.some(a=>a.id===F))&&(F=e.userLeagueId??((t=e.leagues[0])==null?void 0:t.id)??null),Ua(e,F)},bind:e=>{Ha(e,{onLeagueChange:t=>{F=t,ie()}})}},transfers:{render:Wa,bind:Oa}};let Z="dashboard";Object.entries(Vt).forEach(([e])=>{const t=document.createElement("button");t.textContent=e.charAt(0).toUpperCase()+e.slice(1),t.dataset.view=e,e===Z&&t.classList.add("active"),t.addEventListener("click",()=>{Z=e,Qa(),ie()}),ee.append(t)});De.append(K,_);Ge.append(De,xe);const he=document.createElement("div");he.className="workspace";he.append(x);Pe.append(ee,Ge,he);function ie(){if(!w){K.textContent="Loading world",_.textContent="Preparing squads and fixtures...",x.innerHTML='<section class="card"><p class="empty">Generating the global league world…</p></section>';return}const e=w.snapshot,t=e.clubs.find(s=>s.id===e.userClubId);wt(!!e.userClubId),Za(t),t?(K.textContent=t.name,_.textContent=Q(e.date),se=!1):(K.textContent="Choose your club",_.textContent="Select a team to begin your journey.",se||(se=!0,window.setTimeout(()=>P==null?void 0:P.open(),0)));const a=Vt[Z];x.innerHTML=a.render(e),Z==="tactics"&&Aa(document.getElementById("tactics-pitch")),a.bind&&a.bind(x,Xa),Oe()}function Qa(){ee.querySelectorAll("button").forEach(e=>{const t=e.dataset.view;t&&e.classList.toggle("active",t===Z)})}const Pt="digest-body",We=document.createElement("aside");We.className="panel glass digest-panel";We.innerHTML=`
  <div class="panel-header">
    <span class="badge info">Digest</span>
    <h2>Daily Summary</h2>
  </div>
  <div id="${Pt}" class="panel-body digest-body">
    <p class="empty">Building the world…</p>
  </div>
`;he.append(We);Oe();function T(e){if(!e)return;const t=z.findIndex(s=>s.text===e);t>=0&&z.splice(t,1),ut+=1;const a=w?Q(w.snapshot.date):new Date().toLocaleString();z.unshift({id:ut,text:e,stamp:a}),z.length>8&&(z.length=8),Oe()}function Oe(){const e=document.getElementById(Pt);if(!e)return;if(!w){e.innerHTML='<p class="empty">Building the world…</p>';return}const t=w.snapshot,a=w.summary,s=a&&a.matches.length?a.matches:t.results.slice(0,3),n=z.slice(0,6),r=s.length?`<ul class="digest-matches">${s.map(l=>es(t,l)).join("")}</ul>`:'<p class="empty">No fixtures have been completed yet.</p>',o=n.length?`<ul class="digest-messages">${n.map(l=>`<li><span class="message-text">${l.text}</span><span class="message-meta">${l.stamp}</span></li>`).join("")}</ul>`:'<p class="empty">Advance time to receive board updates, transfer news, and fixtures.</p>';e.innerHTML=`
    <div class="digest-date">
      <span class="eyebrow">Season status</span>
      <strong>${Q(t.date)}</strong>
    </div>
    <div class="digest-section">
      <h3>Latest results</h3>
      ${r}
    </div>
    <div class="digest-section">
      <h3>Headlines</h3>
      ${o}
    </div>
  `}function es(e,t){var f,h,y;const a=e.fixtures.find(R=>R.id===t.fixtureId),s=(a==null?void 0:a.homeId)??((f=t.stats[0])==null?void 0:f.clubId)??"home",n=(a==null?void 0:a.awayId)??((h=t.stats[1])==null?void 0:h.clubId)??"away",r=ft(e,s),o=ft(e,n),l=a?((y=e.leagues.find(R=>R.id===a.competitionId))==null?void 0:y.name)??"Competition":"Competition",c=a?ts(a.date):Q(e.date),d=s===e.userClubId||n===e.userClubId,u=`${t.score.home}-${t.score.away}`;return`
    <li class="${d?"highlight":""}">
      <div class="digest-match-clubs">
        <span class="club home">${r}</span>
        <span class="score">${u}</span>
        <span class="club away">${o}</span>
      </div>
      <div class="digest-match-meta">
        <span>${l}</span>
        <span>${c}</span>
      </div>
    </li>
  `}function ts(e){return`Week ${e.week+1}, Day ${e.day+1}`}function ft(e,t){var a;return((a=e.clubs.find(s=>s.id===t))==null?void 0:a.name)??t}function ge(e){if(e){if(typeof e=="string"){T(e);return}Array.isArray(e.messages)?e.messages.forEach(t=>T(t)):typeof e.message=="string"&&T(e.message)}}function Ee(){if(!dt){dt=!0;for(let e=0;e<3;e+=1){const t=E().dispatch({type:"ADVANCE_DAY"});ge(t)}}}function as(){const e=document.createElement("div");e.className="modal-backdrop hidden",e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true");const t=document.createElement("div");t.className="modal glass";const a=document.createElement("div");a.className="section-heading",a.innerHTML='<span class="eyebrow">Career setup</span><h2>Select your club</h2>';const s=document.createElement("p");s.className="muted-text",s.textContent="Choose a club to manage. This choice is locked for the current session.";const n=document.createElement("div");n.className="league-list";const r=document.createElement("div");r.className="club-grid";const o=document.createElement("div");o.className="custom-club-panel hidden",o.innerHTML=`
    <form class="custom-club-form">
      <div class="section-heading">
        <span class="eyebrow">Founder mode</span>
        <h3>Create your own club</h3>
      </div>
      <p class="muted-text">Craft a new identity, choose a league, and we'll assemble a squad to match your ambition.</p>
      <label class="field">
        <span>Club name</span>
        <input name="name" type="text" maxlength="40" required placeholder="Newcastle Bluebirds" />
      </label>
      <label class="field-inline">
        <span>Short name</span>
        <input name="short" type="text" maxlength="5" required placeholder="NWB" />
      </label>
      <label class="field">
        <span>League</span>
        <select name="league" required></select>
      </label>
      <div class="field colors">
        <label>
          <span>Primary</span>
          <input name="primary" type="color" value="#113399" />
        </label>
        <label>
          <span>Secondary</span>
          <input name="secondary" type="color" value="#f5f5f5" />
        </label>
      </div>
      <label class="field">
        <span>Mentality</span>
        <select name="mentality">
          <option value="Balanced">Balanced</option>
          <option value="Positive" selected>Positive</option>
          <option value="Cautious">Cautious</option>
        </select>
      </label>
      <label class="field">
        <span>Formation</span>
        <select name="formation">
          <option value="4-3-3">4-3-3</option>
          <option value="4-2-3-1">4-2-3-1</option>
          <option value="3-4-3">3-4-3</option>
          <option value="4-4-2">4-4-2</option>
        </select>
      </label>
      <label class="field">
        <span>Ambition</span>
        <select name="profile">
          <option value="academy">Academy project – build for the future</option>
          <option value="challenger" selected>Challenger – compete immediately</option>
          <option value="elite">Elite – chase silverware</option>
        </select>
      </label>
      <div class="modal-footer">
        <button type="button" class="ghost" data-action="cancel">Back</button>
        <button type="submit" class="primary">Create club</button>
      </div>
    </form>
  `;const l=document.createElement("div");l.className="modal-footer";const c=document.createElement("button");c.type="button",c.className="primary",c.textContent="Confirm club",c.disabled=!0,l.append(c),t.append(a,s,n,r,l,o),e.append(t),document.body.appendChild(e);let d=null,u=null;const f=o.querySelector("form"),h=f.querySelector('select[name="league"]'),y=f.querySelector('button[data-action="cancel"]');function R(){var p;const v=E().snapshot,m=[...v.leagues].sort((C,g)=>C.level-g.level||C.name.localeCompare(g.name));(!d||!m.some(C=>C.id===d))&&(d=v.userLeagueId??((p=m[0])==null?void 0:p.id)??null),n.innerHTML="",m.forEach(C=>{const g=document.createElement("button");g.type="button",g.textContent=`${C.name} (L${C.level})`,g.className="league-option",C.id===d&&g.classList.add("active"),g.addEventListener("click",()=>{d=C.id,R(),M()}),n.append(g)}),V(m)}function M(){const v=E().snapshot;if(r.innerHTML="",c.disabled=!u,!d){r.innerHTML='<p class="empty">No leagues available.</p>';return}const m=v.clubs.filter(g=>g.leagueId===d).sort((g,A)=>g.name.localeCompare(A.name)),p=v.leagues.find(g=>g.id===d);m.forEach(g=>{const A=document.createElement("button");A.type="button",A.className="club-card",g.id===u&&A.classList.add("active");const $t=p?`Level ${p.level}`:"League";A.innerHTML=`
        <div class="club-card-header">
          <span class="badge">${$t}</span>
          <strong>${g.name}</strong>
        </div>
        <div class="club-meta">
          <span>Rep ${g.rep}</span>
          <span>£${mt(g.marketValue)} value</span>
          <span>£${mt(g.wageBudget)}/wk wages</span>
        </div>
      `,A.addEventListener("click",()=>{u=g.id,d=g.leagueId,R(),M(),c.disabled=!1}),r.append(A)});const C=document.createElement("button");C.type="button",C.className="club-card create",C.innerHTML=`
      <div class="club-card-header">
        <span class="badge info">Custom</span>
        <strong>Create your own club</strong>
      </div>
      <div class="club-meta">
        <span>Design colours & crest</span>
        <span>Pick any league</span>
        <span>Tailor ambition</span>
      </div>
    `,C.addEventListener("click",()=>{k()}),r.append(C)}c.addEventListener("click",()=>{if(!u){T("Select a club to continue.");return}const v=E();v.dispatch({type:"SET_USER_CLUB",payload:{clubId:u}}),F=v.snapshot.userLeagueId??F;const p=v.snapshot.clubs.find(C=>C.id===u);T(`You are now in charge of ${(p==null?void 0:p.name)??"your club"}.`),$(),Ee()}),f.addEventListener("submit",v=>{v.preventDefault();const m=new FormData(f),p=m.get("league")||d;if(!p){T("Choose a league for your new club.");return}const C={leagueId:p,name:String(m.get("name")||"").trim(),shortName:String(m.get("short")||"").trim(),primaryColor:String(m.get("primary")||"#113399"),secondaryColor:String(m.get("secondary")||"#f5f5f5"),mentality:m.get("mentality"),formation:String(m.get("formation")||"4-3-3"),profile:m.get("profile")??"academy"},g=E(),A=g.dispatch({type:"CREATE_CUSTOM_CLUB",payload:C});if(!A.success||!A.clubId){T(A.message);return}g.dispatch({type:"SET_USER_CLUB",payload:{clubId:A.clubId}}),F=g.snapshot.userLeagueId??F,T(A.message),L(),$(),Ee()}),y.addEventListener("click",()=>{L()});function b(){var p;const v=E().snapshot;u=v.userClubId;const m=[...v.leagues].sort((C,g)=>C.level-g.level||C.name.localeCompare(g.name));d=v.userLeagueId??((p=m[0])==null?void 0:p.id)??null,R(),M(),c.disabled=!u,L(),e.classList.remove("hidden")}function $(){e.classList.add("hidden")}function k(){var v;t.classList.add("custom-mode"),o.classList.remove("hidden"),n.classList.add("hidden"),r.classList.add("hidden"),l.classList.add("hidden"),d&&(h.value=d),(v=f.querySelector('input[name="name"]'))==null||v.focus()}function L(){t.classList.remove("custom-mode"),o.classList.add("hidden"),n.classList.remove("hidden"),r.classList.remove("hidden"),l.classList.remove("hidden"),f.reset(),V([...E().snapshot.leagues])}function V(v){h.innerHTML="",v.slice().sort((m,p)=>m.level-p.level||m.name.localeCompare(p.name)).forEach(m=>{const p=document.createElement("option");p.value=m.id,p.textContent=`${m.name} (L${m.level})`,h.append(p)}),d&&(h.value=d)}return{open:b,close:$}}function mt(e){return new Intl.NumberFormat("en-GB",{maximumFractionDigits:0}).format(e)}function ss(){wt(!1),K.textContent="Loading world",_.textContent="Creating leagues, clubs, and players...",x.innerHTML='<section class="card"><p class="empty">Building data packs. Please wait…</p></section>',window.setTimeout(()=>{try{w=new ka(Ba());const e=E();P=as(),e.subscribe(ie),ie(),e.snapshot.userClubId?Ee():(P==null||P.open(),se=!0)}catch(e){console.error("Failed to initialize the game store",e),x.innerHTML='<section class="card"><p class="empty">Failed to load the world data. Refresh to try again.</p></section>',_.textContent="Initialization failed"}})}ss();
