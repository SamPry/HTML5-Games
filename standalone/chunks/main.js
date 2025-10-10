var it=Symbol.for("immer-nothing"),De=Symbol.for("immer-draftable"),M=Symbol.for("immer-state");function I(e,...t){throw new Error(`[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`)}var O=Object.getPrototypeOf;function z(e){return!!e&&!!e[M]}function D(e){var t;return e?lt(e)||Array.isArray(e)||!!e[De]||!!((t=e.constructor)!=null&&t[De])||q(e)||re(e):!1}var kt=Object.prototype.constructor.toString();function lt(e){if(!e||typeof e!="object")return!1;const t=O(e);if(t===null)return!0;const a=Object.hasOwnProperty.call(t,"constructor")&&t.constructor;return a===Object?!0:typeof a=="function"&&Function.toString.call(a)===kt}function ee(e,t){se(e)===0?Reflect.ownKeys(e).forEach(a=>{t(a,e[a],e)}):e.forEach((a,n)=>t(n,a,e))}function se(e){const t=e[M];return t?t.type_:Array.isArray(e)?1:q(e)?2:re(e)?3:0}function ye(e,t){return se(e)===2?e.has(t):Object.prototype.hasOwnProperty.call(e,t)}function ct(e,t,a){const n=se(e);n===2?e.set(t,a):n===3?e.add(a):e[t]=a}function Et(e,t){return e===t?e!==0||1/e===1/t:e!==e&&t!==t}function q(e){return e instanceof Map}function re(e){return e instanceof Set}function T(e){return e.copy_||e.base_}function be(e,t){if(q(e))return new Map(e);if(re(e))return new Set(e);if(Array.isArray(e))return Array.prototype.slice.call(e);const a=lt(e);if(t===!0||t==="class_only"&&!a){const n=Object.getOwnPropertyDescriptors(e);delete n[M];let s=Reflect.ownKeys(n);for(let r=0;r<s.length;r++){const o=s[r],l=n[o];l.writable===!1&&(l.writable=!0,l.configurable=!0),(l.get||l.set)&&(n[o]={configurable:!0,writable:!0,enumerable:l.enumerable,value:e[o]})}return Object.create(O(e),n)}else{const n=O(e);if(n!==null&&a)return{...e};const s=Object.create(n);return Object.assign(s,e)}}function Me(e,t=!1){return oe(e)||z(e)||!D(e)||(se(e)>1&&Object.defineProperties(e,{set:{value:X},add:{value:X},clear:{value:X},delete:{value:X}}),Object.freeze(e),t&&Object.values(e).forEach(a=>Me(a,!0))),e}function X(){I(2)}function oe(e){return Object.isFrozen(e)}var It={};function _(e){const t=It[e];return t||I(0,e),t}var K;function dt(){return K}function wt(e,t){return{drafts_:[],parent_:e,immer_:t,canAutoFreeze_:!0,unfinalizedDrafts_:0}}function _e(e,t){t&&(_("Patches"),e.patches_=[],e.inversePatches_=[],e.patchListener_=t)}function ve(e){Ne(e),e.drafts_.forEach(Pt),e.drafts_=null}function Ne(e){e===K&&(K=e.parent_)}function xe(e){return K=wt(K,e)}function Pt(e){const t=e[M];t.type_===0||t.type_===1?t.revoke_():t.revoked_=!0}function We(e,t){t.unfinalizedDrafts_=t.drafts_.length;const a=t.drafts_[0];return e!==void 0&&e!==a?(a[M].modified_&&(ve(t),I(4)),D(e)&&(e=te(t,e),t.parent_||ae(t,e)),t.patches_&&_("Patches").generateReplacementPatches_(a[M].base_,e,t.patches_,t.inversePatches_)):e=te(t,a,[]),ve(t),t.patches_&&t.patchListener_(t.patches_,t.inversePatches_),e!==it?e:void 0}function te(e,t,a){if(oe(t))return t;const n=t[M];if(!n)return ee(t,(s,r)=>Oe(e,n,t,s,r,a)),t;if(n.scope_!==e)return t;if(!n.modified_)return ae(e,n.base_,!0),n.base_;if(!n.finalized_){n.finalized_=!0,n.scope_.unfinalizedDrafts_--;const s=n.copy_;let r=s,o=!1;n.type_===3&&(r=new Set(s),s.clear(),o=!0),ee(r,(l,c)=>Oe(e,n,s,l,c,a,o)),ae(e,s,!1),a&&e.patches_&&_("Patches").generatePatches_(n,a,e.patches_,e.inversePatches_)}return n.copy_}function Oe(e,t,a,n,s,r,o){if(z(s)){const l=r&&t&&t.type_!==3&&!ye(t.assigned_,n)?r.concat(n):void 0,c=te(e,s,l);if(ct(a,n,c),z(c))e.canAutoFreeze_=!1;else return}else o&&a.add(s);if(D(s)&&!oe(s)){if(!e.immer_.autoFreeze_&&e.unfinalizedDrafts_<1)return;te(e,s),(!t||!t.scope_.parent_)&&typeof n!="symbol"&&(q(a)?a.has(n):Object.prototype.propertyIsEnumerable.call(a,n))&&ae(e,s)}}function ae(e,t,a=!1){!e.parent_&&e.immer_.autoFreeze_&&e.canAutoFreeze_&&Me(t,a)}function Ft(e,t){const a=Array.isArray(e),n={type_:a?1:0,scope_:t?t.scope_:dt(),modified_:!1,finalized_:!1,assigned_:{},parent_:t,base_:e,draft_:null,copy_:null,revoke_:null,isManual_:!1};let s=n,r=Le;a&&(s=[n],r=H);const{revoke:o,proxy:l}=Proxy.revocable(s,r);return n.draft_=l,n.revoke_=o,l}var Le={get(e,t){if(t===M)return e;const a=T(e);if(!ye(a,t))return $t(e,a,t);const n=a[t];return e.finalized_||!D(n)?n:n===fe(e.base_,t)?(me(e),e.copy_[t]=Re(n,e)):n},has(e,t){return t in T(e)},ownKeys(e){return Reflect.ownKeys(T(e))},set(e,t,a){const n=ut(T(e),t);if(n!=null&&n.set)return n.set.call(e.draft_,a),!0;if(!e.modified_){const s=fe(T(e),t),r=s==null?void 0:s[M];if(r&&r.base_===a)return e.copy_[t]=a,e.assigned_[t]=!1,!0;if(Et(a,s)&&(a!==void 0||ye(e.base_,t)))return!0;me(e),Ce(e)}return e.copy_[t]===a&&(a!==void 0||t in e.copy_)||Number.isNaN(a)&&Number.isNaN(e.copy_[t])||(e.copy_[t]=a,e.assigned_[t]=!0),!0},deleteProperty(e,t){return fe(e.base_,t)!==void 0||t in e.base_?(e.assigned_[t]=!1,me(e),Ce(e)):delete e.assigned_[t],e.copy_&&delete e.copy_[t],!0},getOwnPropertyDescriptor(e,t){const a=T(e),n=Reflect.getOwnPropertyDescriptor(a,t);return n&&{writable:!0,configurable:e.type_!==1||t!=="length",enumerable:n.enumerable,value:a[t]}},defineProperty(){I(11)},getPrototypeOf(e){return O(e.base_)},setPrototypeOf(){I(12)}},H={};ee(Le,(e,t)=>{H[e]=function(){return arguments[0]=arguments[0][0],t.apply(this,arguments)}});H.deleteProperty=function(e,t){return H.set.call(this,e,t,void 0)};H.set=function(e,t,a){return Le.set.call(this,e[0],t,a,e[0])};function fe(e,t){const a=e[M];return(a?T(a):e)[t]}function $t(e,t,a){var s;const n=ut(t,a);return n?"value"in n?n.value:(s=n.get)==null?void 0:s.call(e.draft_):void 0}function ut(e,t){if(!(t in e))return;let a=O(e);for(;a;){const n=Object.getOwnPropertyDescriptor(a,t);if(n)return n;a=O(a)}}function Ce(e){e.modified_||(e.modified_=!0,e.parent_&&Ce(e.parent_))}function me(e){e.copy_||(e.copy_=be(e.base_,e.scope_.immer_.useStrictShallowCopy_))}var Tt=class{constructor(e){this.autoFreeze_=!0,this.useStrictShallowCopy_=!1,this.produce=(t,a,n)=>{if(typeof t=="function"&&typeof a!="function"){const r=a;a=t;const o=this;return function(c=r,...d){return o.produce(c,u=>a.call(this,u,...d))}}typeof a!="function"&&I(6),n!==void 0&&typeof n!="function"&&I(7);let s;if(D(t)){const r=xe(this),o=Re(t,void 0);let l=!0;try{s=a(o),l=!1}finally{l?ve(r):Ne(r)}return _e(r,n),We(s,r)}else if(!t||typeof t!="object"){if(s=a(t),s===void 0&&(s=t),s===it&&(s=void 0),this.autoFreeze_&&Me(s,!0),n){const r=[],o=[];_("Patches").generateReplacementPatches_(t,s,r,o),n(r,o)}return s}else I(1,t)},this.produceWithPatches=(t,a)=>{if(typeof t=="function")return(o,...l)=>this.produceWithPatches(o,c=>t(c,...l));let n,s;return[this.produce(t,a,(o,l)=>{n=o,s=l}),n,s]},typeof(e==null?void 0:e.autoFreeze)=="boolean"&&this.setAutoFreeze(e.autoFreeze),typeof(e==null?void 0:e.useStrictShallowCopy)=="boolean"&&this.setUseStrictShallowCopy(e.useStrictShallowCopy)}createDraft(e){D(e)||I(8),z(e)&&(e=Gt(e));const t=xe(this),a=Re(e,void 0);return a[M].isManual_=!0,Ne(t),a}finishDraft(e,t){const a=e&&e[M];(!a||!a.isManual_)&&I(9);const{scope_:n}=a;return _e(n,t),We(void 0,n)}setAutoFreeze(e){this.autoFreeze_=e}setUseStrictShallowCopy(e){this.useStrictShallowCopy_=e}applyPatches(e,t){let a;for(a=t.length-1;a>=0;a--){const s=t[a];if(s.path.length===0&&s.op==="replace"){e=s.value;break}}a>-1&&(t=t.slice(a+1));const n=_("Patches").applyPatches_;return z(e)?n(e,t):this.produce(e,s=>n(s,t))}};function Re(e,t){const a=q(e)?_("MapSet").proxyMap_(e,t):re(e)?_("MapSet").proxySet_(e,t):Ft(e,t);return(t?t.scope_:dt()).drafts_.push(a),a}function Gt(e){return z(e)||I(10,e),ft(e)}function ft(e){if(!D(e)||oe(e))return e;const t=e[M];let a;if(t){if(!t.modified_)return t.base_;t.finalized_=!0,a=be(e,t.scope_.immer_.useStrictShallowCopy_)}else a=be(e,!0);return ee(a,(n,s)=>{ct(a,n,ft(s))}),t&&(t.finalized_=!1),a}var Vt=new Tt,Dt=Vt.produce;const _t=e=>(t,a,n)=>(n.setState=(s,r,...o)=>{const l=typeof s=="function"?Dt(s):s;return t(l,r,...o)},e(n.setState,a,n)),xt=_t,Wt={},ze=e=>{let t;const a=new Set,n=(u,f)=>{const g=typeof u=="function"?u(t):u;if(!Object.is(g,t)){const b=t;t=f??(typeof g!="object"||g===null)?g:Object.assign({},t,g),a.forEach(S=>S(t,b))}},s=()=>t,c={setState:n,getState:s,getInitialState:()=>d,subscribe:u=>(a.add(u),()=>a.delete(u)),destroy:()=>{(Wt?"production":void 0)!=="production"&&console.warn("[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."),a.clear()}},d=t=e(n,s,c);return c},Ot=e=>e?ze(e):ze;function he(e,t){return(e<<t|e>>64n-t)&(1n<<64n)-1n}function zt(e){let t=e&(1n<<64n)-1n;return()=>{t=t+0x9e3779b97f4a7c15n&(1n<<64n)-1n;let a=t;return a=(a^a>>30n)*0xbf58476d1ce4e5b9n&(1n<<64n)-1n,a=(a^a>>27n)*0x94d049bb133111ebn&(1n<<64n)-1n,a^a>>31n}}function ie(e){const t=zt(BigInt(e.s1)<<32n|BigInt(e.s2));let a=t(),n=t();const s=()=>{const r=he(a+n,17n)+a;return n^=a,a=he(a,49n)^n^n<<21n,n=he(n,28n),Number(r&(1n<<64n)-1n)};return{next(){return(s()>>>0)/4294967296},nextInt(r){if(r<=0)throw new Error("max must be positive");return Math.floor(this.next()*r)},pick(r){if(!r.length)throw new Error("cannot pick from empty array");return r[this.nextInt(r.length)]}}}function le(e,t){const a=ie(e);for(let r=0;r<t%5;r+=1)a.next();const n=Math.floor(a.next()*4294967295),s=Math.floor(a.next()*4294967295);return{s1:n,s2:s}}function Be(e){const t=e.day+1;if(t<7)return{...e,day:t};const a=e.week+1;return a<52?{season:e.season,week:a,day:0}:{season:e.season+1,week:0,day:0}}function Ut(e,t){return e.season===t.season&&e.week===t.week&&e.day===t.day}function mt(e,t,a){const n=[...e],s=[];let r={...a},o=1;for(let c=0;c<n.length-1;c+=1){for(let d=0;d<n.length/2;d+=1){const u=n[d],f=n[n.length-1-d];s.push({id:`fixture-${o++}`,competitionId:t,homeId:u.id,awayId:f.id,date:{...r},played:!1})}r=Be(r),Kt(n)}const l=s.map(c=>({...c,id:`fixture-${o++}`,homeId:c.awayId,awayId:c.homeId,date:Be(c.date)}));return[...s,...l]}function Kt(e){const t=e[0],a=e.slice(1);a.unshift(a.pop()),e.splice(0,e.length,t,...a)}function ht(e,t,a){const n=le(a,Number(t.id.replace(/\D/g,""))||0),s=ie(n),r=He(e,t.homeId),o=He(e,t.awayId),l={fixture:t,homePlayers:r,awayPlayers:o},{homeScore:c,awayScore:d,events:u,homeStats:f,awayStats:g,playerStats:b}=Ht(l,s);return{id:`match-${t.id}`,fixtureId:t.id,events:u,stats:[f,g],playerStats:b,state:"Complete",score:{home:c,away:d}}}function Ht(e,t){const n=[{minute:0,type:"Kickoff",description:"Kick-off"}];let s=50,r=50;const o=Ue(e.homePlayers),l=Ue(e.awayPlayers),c=o+l,d=8+Math.round(o/c*6),u=8+Math.round(l/c*6);let f=0,g=0;for(let y=5;y<=90;y+=5){const P=t.next()*10-5;if(s=je(s+P,35,65),r=100-s,t.next()<d/100){const R=t.pick(e.homePlayers),w=.04+Ke(R)*.06+o/(c*2);n.push({minute:y,type:"Shot",description:`${R.name} tries his luck from distance for the home side`,teamId:e.fixture.homeId,playerId:R.id}),t.next()<w&&(f+=1,n.push({minute:y,type:"Goal",description:`${R.name} scores for the hosts!`,teamId:e.fixture.homeId,playerId:R.id}))}if(t.next()<u/100){const R=t.pick(e.awayPlayers),w=.04+Ke(R)*.06+l/(c*2);n.push({minute:y,type:"Shot",description:`${R.name} lines up a chance for the visitors`,teamId:e.fixture.awayId,playerId:R.id}),t.next()<w&&(g+=1,n.push({minute:y,type:"Goal",description:`${R.name} finds the net for the visitors!`,teamId:e.fixture.awayId,playerId:R.id}))}y===45&&n.push({minute:y,type:"HalfTime",description:"Half-time whistle"})}n.push({minute:90,type:"FullTime",description:"Full-time"});const b={clubId:e.fixture.homeId,goals:f,shots:Math.round(d*1.2),shotsOnTarget:Math.round(d*.6),possession:Math.round(s)},S={clubId:e.fixture.awayId,goals:g,shots:Math.round(u*1.2),shotsOnTarget:Math.round(u*.6),possession:Math.round(r)},L=[...e.homePlayers,...e.awayPlayers].map(y=>{const P=(y.currentAbility-140)/80,R=je(6.2+t.next()*1.6+P,5,10);return{playerId:y.id,rating:R,minutes:90,goals:n.filter(k=>k.type==="Goal"&&k.playerId===y.id).length,assists:0,shots:Math.round(t.next()*3),passesCompleted:Math.round(t.next()*40),tacklesWon:Math.round(t.next()*5)}});return{homeScore:f,awayScore:g,events:n,homeStats:b,awayStats:S,playerStats:L}}function Ue(e){return e.reduce((t,a)=>t+a.currentAbility,0)}function Ke(e){const{finishing:t,composure:a,offTheBall:n}=e.attributes;return(t+a+n)/60}function He(e,t){const a=e.clubs.find(n=>n.id===t);if(!a)throw new Error(`Club not found: ${t}`);return a.roster.map(n=>e.players.find(s=>s.id===n)).sort((n,s)=>s.currentAbility-n.currentAbility).slice(0,11)}function je(e,t,a){return Math.max(t,Math.min(a,e))}const jt={id:"premier-league",name:"Premier League",nation:"England",level:1,clubs:[{id:"arsenal",name:"Arsenal",shortName:"ARS",colors:["#EF0107","#063672"],formation:"4-3-3",mentality:"Positive",tempo:68,press:70,rep:8600,marketValue:101e7,transferBudget:7e7,wageBudget:22e5,players:[i("arsenal","Aaron Ramsdale",25,"ENG","Right",["GK"],152,158,38e6,12e4,4),i("arsenal","David Raya",28,"ESP","Right",["GK"],148,150,32e6,11e4,3),i("arsenal","William Saliba",23,"FRA","Right",["CB"],165,175,7e7,18e4,5),i("arsenal","Gabriel",26,"BRA","Left",["CB"],158,162,52e6,15e4,4),i("arsenal","Ben White",26,"ENG","Right",["RB","CB"],156,160,5e7,16e4,4),i("arsenal","Oleksandr Zinchenko",27,"UKR","Left",["LB","CM"],152,156,42e6,14e4,4),i("arsenal","Declan Rice",25,"ENG","Right",["DM","CM"],170,178,95e6,24e4,6),i("arsenal","Martin Ødegaard",25,"NOR","Left",["AM","CM"],168,175,85e6,23e4,5),i("arsenal","Bukayo Saka",22,"ENG","Left",["RW","LW"],172,185,11e7,25e4,6),i("arsenal","Gabriel Martinelli",22,"BRA","Right",["LW","ST"],160,172,76e6,19e4,5),i("arsenal","Gabriel Jesus",27,"BRA","Right",["ST","RW"],160,164,65e6,2e5,4),i("arsenal","Kai Havertz",24,"GER","Left",["AM","ST"],158,165,6e7,21e4,4),i("arsenal","Jorginho",32,"ITA","Right",["DM","CM"],150,150,22e6,18e4,2),i("arsenal","Takehiro Tomiyasu",25,"JPN","Right",["RB","CB","LB"],150,154,28e6,11e4,3),i("arsenal","Leandro Trossard",29,"BEL","Right",["LW","AM"],154,156,36e6,16e4,3)]},{id:"man-city",name:"Manchester City",shortName:"MCI",colors:["#6CABDD","#1C2C5B"],formation:"4-3-3",mentality:"Positive",tempo:64,press:72,rep:9300,marketValue:12e8,transferBudget:9e7,wageBudget:26e5,players:[i("man-city","Ederson",30,"BRA","Left",["GK"],162,166,65e6,22e4,4),i("man-city","Stefan Ortega",31,"GER","Right",["GK"],148,150,18e6,9e4,3),i("man-city","Kyle Walker",34,"ENG","Right",["RB"],158,158,18e6,175e3,2),i("man-city","Rúben Dias",27,"POR","Right",["CB"],168,170,78e6,23e4,5),i("man-city","John Stones",29,"ENG","Right",["CB"],162,164,52e6,21e4,4),i("man-city","Josko Gvardiol",22,"CRO","Left",["CB","LB"],165,180,82e6,19e4,6),i("man-city","Rodri",27,"ESP","Right",["DM"],176,180,105e6,26e4,6),i("man-city","Kevin De Bruyne",32,"BEL","Right",["CM","AM"],180,180,9e7,35e4,3),i("man-city","Phil Foden",23,"ENG","Left",["AM","RW"],170,182,11e7,25e4,5),i("man-city","Bernardo Silva",29,"POR","Left",["RW","AM","CM"],170,170,78e6,3e5,4),i("man-city","Jack Grealish",28,"ENG","Right",["LW"],160,162,62e6,3e5,4),i("man-city","Erling Haaland",23,"NOR","Left",["ST"],185,195,18e7,4e5,5),i("man-city","Julián Álvarez",24,"ARG","Right",["ST","AM"],164,176,82e6,19e4,5),i("man-city","Matheus Nunes",25,"POR","Right",["CM"],156,162,42e6,16e4,4),i("man-city","Manuel Akanji",28,"SUI","Right",["CB","RB"],160,162,4e7,18e4,4)]},{id:"liverpool",name:"Liverpool",shortName:"LIV",colors:["#C8102E","#00B2A9"],formation:"4-3-3",mentality:"Positive",tempo:70,press:74,rep:9e3,marketValue:96e7,transferBudget:65e6,wageBudget:23e5,players:[i("liverpool","Alisson Becker",31,"BRA","Right",["GK"],170,172,78e6,25e4,4),i("liverpool","Caoimhín Kelleher",25,"IRL","Right",["GK"],148,154,16e6,6e4,4),i("liverpool","Virgil van Dijk",32,"NED","Right",["CB"],175,175,65e6,22e4,3),i("liverpool","Ibrahima Konaté",24,"FRA","Right",["CB"],162,172,52e6,17e4,4),i("liverpool","Trent Alexander-Arnold",25,"ENG","Right",["RB","CM"],168,176,82e6,22e4,4),i("liverpool","Andy Robertson",29,"SCO","Left",["LB"],160,162,45e6,18e4,4),i("liverpool","Alexis Mac Allister",25,"ARG","Right",["CM","DM"],160,168,52e6,16e4,5),i("liverpool","Dominik Szoboszlai",23,"HUN","Right",["AM","CM"],164,176,72e6,2e5,5),i("liverpool","Curtis Jones",23,"ENG","Right",["CM","AM"],150,164,26e6,9e4,4),i("liverpool","Mohamed Salah",31,"EGY","Left",["RW"],178,178,1e8,35e4,3),i("liverpool","Luis Díaz",27,"COL","Right",["LW"],162,168,62e6,19e4,4),i("liverpool","Diogo Jota",27,"POR","Right",["ST","LW"],160,164,55e6,18e4,4),i("liverpool","Darwin Núñez",24,"URU","Right",["ST"],158,172,6e7,21e4,5),i("liverpool","Wataru Endo",31,"JPN","Right",["DM"],150,152,15e6,9e4,2),i("liverpool","Joe Gomez",26,"ENG","Right",["CB","RB"],154,158,3e7,12e4,4)]},{id:"man-united",name:"Manchester United",shortName:"MUN",colors:["#DA291C","#000000"],formation:"4-2-3-1",mentality:"Balanced",tempo:66,press:68,rep:9100,marketValue:87e7,transferBudget:75e6,wageBudget:25e5,players:[i("man-united","Andre Onana",28,"CMR","Right",["GK"],160,164,52e6,21e4,5),i("man-united","Altay Bayındır",26,"TUR","Right",["GK"],145,150,12e6,6e4,3),i("man-united","Lisandro Martínez",26,"ARG","Left",["CB"],160,166,52e6,19e4,5),i("man-united","Raphaël Varane",31,"FRA","Right",["CB"],165,165,42e6,3e5,2),i("man-united","Harry Maguire",31,"ENG","Right",["CB"],148,148,2e7,19e4,3),i("man-united","Luke Shaw",28,"ENG","Left",["LB"],158,160,34e6,2e5,4),i("man-united","Diogo Dalot",25,"POR","Right",["RB","LB"],152,158,28e6,14e4,4),i("man-united","Casemiro",32,"BRA","Right",["DM"],162,162,35e6,3e5,3),i("man-united","Kobbie Mainoo",19,"ENG","Right",["CM"],148,170,26e6,45e3,6),i("man-united","Bruno Fernandes",29,"POR","Right",["AM"],170,170,85e6,27e4,5),i("man-united","Marcus Rashford",26,"ENG","Right",["LW","ST"],166,170,92e6,3e5,5),i("man-united","Alejandro Garnacho",19,"ARG","Right",["LW"],154,176,52e6,9e4,6),i("man-united","Antony",24,"BRA","Left",["RW"],152,160,42e6,2e5,5),i("man-united","Rasmus Højlund",21,"DEN","Left",["ST"],158,178,65e6,18e4,6),i("man-united","Christian Eriksen",32,"DEN","Right",["CM","AM"],156,156,26e6,21e4,3)]},{id:"chelsea",name:"Chelsea",shortName:"CHE",colors:["#034694","#DBA111"],formation:"4-2-3-1",mentality:"Balanced",tempo:64,press:70,rep:8800,marketValue:86e7,transferBudget:8e7,wageBudget:24e5,players:[i("chelsea","Djordje Petrović",24,"SRB","Right",["GK"],150,162,24e6,65e3,5),i("chelsea","Robert Sánchez",26,"ESP","Right",["GK"],150,154,25e6,12e4,5),i("chelsea","Reece James",24,"ENG","Right",["RB"],162,170,7e7,22e4,5),i("chelsea","Ben Chilwell",27,"ENG","Left",["LB"],156,160,45e6,19e4,4),i("chelsea","Axel Disasi",26,"FRA","Right",["CB"],154,158,36e6,16e4,5),i("chelsea","Levi Colwill",21,"ENG","Left",["CB","LB"],156,174,55e6,14e4,6),i("chelsea","Thiago Silva",39,"BRA","Right",["CB"],160,160,1e7,16e4,1),i("chelsea","Moisés Caicedo",22,"ECU","Right",["DM"],162,176,9e7,22e4,8),i("chelsea","Enzo Fernández",23,"ARG","Right",["CM"],162,178,85e6,23e4,7),i("chelsea","Conor Gallagher",24,"ENG","Right",["CM"],154,164,42e6,15e4,3),i("chelsea","Cole Palmer",21,"ENG","Left",["RW","AM"],156,174,52e6,16e4,6),i("chelsea","Raheem Sterling",29,"ENG","Right",["LW","RW"],160,160,46e6,3e5,4),i("chelsea","Mykhailo Mudryk",23,"UKR","Right",["LW"],152,170,42e6,21e4,7),i("chelsea","Christopher Nkunku",26,"FRA","Right",["ST","AM"],164,170,7e7,25e4,5),i("chelsea","Nicolas Jackson",22,"SEN","Right",["ST"],154,170,42e6,14e4,8)]},{id:"tottenham",name:"Tottenham Hotspur",shortName:"TOT",colors:["#132257","#FFFFFF"],formation:"4-3-3",mentality:"Positive",tempo:68,press:72,rep:8700,marketValue:78e7,transferBudget:6e7,wageBudget:21e5,players:[i("tottenham","Guglielmo Vicario",27,"ITA","Right",["GK"],156,162,32e6,12e4,5),i("tottenham","Fraser Forster",36,"ENG","Right",["GK"],140,140,5e6,7e4,2),i("tottenham","Cristian Romero",26,"ARG","Right",["CB"],164,168,62e6,18e4,5),i("tottenham","Micky van de Ven",23,"NED","Left",["CB"],158,176,55e6,16e4,6),i("tottenham","Pedro Porro",24,"POR","Right",["RB"],156,166,42e6,14e4,5),i("tottenham","Destiny Udogie",21,"ITA","Left",["LB"],154,172,38e6,12e4,6),i("tottenham","Yves Bissouma",27,"MLI","Right",["DM","CM"],156,160,42e6,15e4,4),i("tottenham","Pape Matar Sarr",21,"SEN","Right",["CM"],152,170,36e6,9e4,6),i("tottenham","James Maddison",27,"ENG","Right",["AM"],166,168,65e6,22e4,5),i("tottenham","Dejan Kulusevski",24,"SWE","Left",["RW","AM"],160,168,58e6,18e4,5),i("tottenham","Heung-min Son",31,"KOR","Both",["LW","ST"],170,170,82e6,29e4,4),i("tottenham","Richarlison",26,"BRA","Right",["ST","LW"],158,160,52e6,19e4,4),i("tottenham","Brennan Johnson",22,"WAL","Right",["RW","ST"],152,168,36e6,12e4,6),i("tottenham","Giovani Lo Celso",27,"ARG","Left",["CM","AM"],154,156,28e6,15e4,3),i("tottenham","Rodrigo Bentancur",26,"URU","Right",["CM","DM"],158,164,42e6,18e4,4)]},{id:"newcastle",name:"Newcastle United",shortName:"NEW",colors:["#241F20","#FFFFFF"],formation:"4-3-3",mentality:"Positive",tempo:66,press:70,rep:8400,marketValue:72e7,transferBudget:55e6,wageBudget:2e6,players:[i("newcastle","Nick Pope",31,"ENG","Right",["GK"],158,160,38e6,13e4,4),i("newcastle","Martin Dúbravka",35,"SVK","Right",["GK"],148,148,9e6,75e3,2),i("newcastle","Kieran Trippier",33,"ENG","Right",["RB"],158,158,26e6,17e4,2),i("newcastle","Sven Botman",24,"NED","Left",["CB"],160,170,52e6,14e4,5),i("newcastle","Fabian Schär",32,"SUI","Right",["CB"],154,154,18e6,9e4,3),i("newcastle","Dan Burn",31,"ENG","Left",["LB","CB"],152,152,16e6,85e3,3),i("newcastle","Bruno Guimarães",26,"BRA","Right",["CM","DM"],166,174,72e6,2e5,5),i("newcastle","Sandro Tonali",23,"ITA","Right",["CM","DM"],162,178,7e7,22e4,6),i("newcastle","Joelinton",27,"BRA","Right",["CM","AM"],156,160,42e6,16e4,4),i("newcastle","Miguel Almirón",30,"PAR","Left",["RW"],154,156,28e6,12e4,4),i("newcastle","Anthony Gordon",23,"ENG","Right",["LW"],156,168,48e6,15e4,5),i("newcastle","Alexander Isak",24,"SWE","Right",["ST"],166,176,82e6,2e5,5),i("newcastle","Callum Wilson",32,"ENG","Right",["ST"],158,158,26e6,15e4,2),i("newcastle","Harvey Barnes",26,"ENG","Right",["LW"],156,160,42e6,15e4,4),i("newcastle","Tino Livramento",21,"ENG","Right",["RB"],150,168,28e6,9e4,6)]},{id:"aston-villa",name:"Aston Villa",shortName:"AVL",colors:["#670E36","#95BFE5"],formation:"4-2-3-1",mentality:"Positive",tempo:64,press:66,rep:8200,marketValue:62e7,transferBudget:45e6,wageBudget:17e5,players:[i("aston-villa","Emiliano Martínez",31,"ARG","Right",["GK"],166,166,6e7,18e4,4),i("aston-villa","Robin Olsen",34,"SWE","Right",["GK"],142,142,5e6,6e4,2),i("aston-villa","Ezri Konsa",26,"ENG","Right",["CB"],156,160,32e6,12e4,4),i("aston-villa","Pau Torres",27,"ESP","Left",["CB"],158,164,42e6,16e4,5),i("aston-villa","Lucas Digne",30,"FRA","Left",["LB"],154,154,22e6,15e4,3),i("aston-villa","Matty Cash",26,"POL","Right",["RB"],152,154,22e6,12e4,4),i("aston-villa","Douglas Luiz",25,"BRA","Right",["DM","CM"],160,168,52e6,15e4,4),i("aston-villa","Boubacar Kamara",24,"FRA","Right",["DM","CB"],158,170,48e6,16e4,5),i("aston-villa","John McGinn",29,"SCO","Left",["CM","AM"],156,156,32e6,13e4,4),i("aston-villa","Moussa Diaby",24,"FRA","Left",["RW","LW"],160,170,6e7,18e4,5),i("aston-villa","Leon Bailey",26,"JAM","Left",["RW","LW"],156,160,38e6,14e4,4),i("aston-villa","Ollie Watkins",28,"ENG","Right",["ST"],164,166,62e6,2e5,5),i("aston-villa","Youri Tielemans",27,"BEL","Right",["CM"],156,160,3e7,16e4,4),i("aston-villa","Jacob Ramsey",22,"ENG","Right",["AM","CM"],152,170,32e6,9e4,6),i("aston-villa","Matheus Luiz",23,"BRA","Right",["CM"],148,164,22e6,8e4,5)]},{id:"brighton",name:"Brighton & Hove Albion",shortName:"BHA",colors:["#0057B8","#FFFFFF"],formation:"4-2-3-1",mentality:"Positive",tempo:68,press:70,rep:7800,marketValue:52e7,transferBudget:42e6,wageBudget:16e5,players:[i("brighton","Bart Verbruggen",21,"NED","Right",["GK"],150,168,28e6,65e3,6),i("brighton","Jason Steele",33,"ENG","Right",["GK"],145,145,4e6,6e4,2),i("brighton","Lewis Dunk",32,"ENG","Right",["CB"],156,156,2e7,9e4,3),i("brighton","Jan Paul van Hecke",23,"NED","Right",["CB"],150,162,2e7,7e4,5),i("brighton","Pervis Estupiñán",26,"ECU","Left",["LB"],156,164,36e6,12e4,4),i("brighton","Tariq Lamptey",23,"GHA","Right",["RB"],150,162,22e6,9e4,4),i("brighton","Billy Gilmour",22,"SCO","Right",["CM"],150,168,24e6,9e4,5),i("brighton","Pascal Groß",32,"GER","Right",["AM","CM"],160,160,26e6,11e4,3),i("brighton","João Pedro",22,"BRA","Right",["ST","AM"],156,172,42e6,14e4,6),i("brighton","Solly March",29,"ENG","Left",["RW","LW"],156,156,26e6,11e4,4),i("brighton","Kaoru Mitoma",26,"JPN","Right",["LW"],160,166,52e6,17e4,4),i("brighton","Evan Ferguson",19,"IRL","Right",["ST"],156,180,48e6,9e4,6),i("brighton","Adam Lallana",35,"ENG","Right",["AM"],148,148,6e6,7e4,2),i("brighton","Simon Adingra",22,"CIV","Right",["RW","LW"],152,168,32e6,85e3,5),i("brighton","Facundo Buonanotte",19,"ARG","Left",["AM","RW"],148,170,26e6,6e4,6)]},{id:"west-ham",name:"West Ham United",shortName:"WHU",colors:["#7A263A","#1BB1E7"],formation:"4-2-3-1",mentality:"Balanced",tempo:62,press:64,rep:7800,marketValue:48e7,transferBudget:38e6,wageBudget:15e5,players:[i("west-ham","Alphonse Areola",31,"FRA","Right",["GK"],156,158,28e6,14e4,4),i("west-ham","Lukasz Fabianski",38,"POL","Right",["GK"],148,148,3e6,8e4,1),i("west-ham","Kurt Zouma",29,"FRA","Right",["CB"],154,154,26e6,15e4,3),i("west-ham","Nayef Aguerd",28,"MAR","Left",["CB"],154,160,32e6,14e4,4),i("west-ham","Vladimir Coufal",31,"CZE","Right",["RB"],150,150,14e6,9e4,2),i("west-ham","Emerson Palmieri",29,"ITA","Left",["LB"],150,150,16e6,85e3,3),i("west-ham","Edson Álvarez",26,"MEX","Right",["DM","CB"],156,162,42e6,15e4,5),i("west-ham","James Ward-Prowse",29,"ENG","Right",["CM","AM"],156,156,32e6,16e4,4),i("west-ham","Lucas Paquetá",26,"BRA","Right",["AM","CM"],164,170,72e6,22e4,5),i("west-ham","Jarrod Bowen",27,"ENG","Left",["RW","ST"],160,162,56e6,19e4,4),i("west-ham","Michail Antonio",34,"JAM","Right",["ST"],150,150,8e6,11e4,2),i("west-ham","Mohammed Kudus",23,"GHA","Left",["AM","RW"],160,174,6e7,18e4,5),i("west-ham","Saïd Benrahma",28,"ALG","Right",["LW","AM"],154,156,28e6,14e4,3),i("west-ham","Tomáš Souček",29,"CZE","Right",["CM","DM"],154,154,26e6,12e4,4),i("west-ham","Pablo Fornals",28,"ESP","Right",["AM","CM"],152,152,22e6,13e4,3)]}]};function i(e,t,a,n,s,r,o,l,c,d,u){return{id:`${e}-${t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")}`,name:t,age:a,nationality:n,foot:s,positions:r,currentAbility:o,potentialAbility:l,value:c,wage:d,contractYears:u}}const Jt={elite:{baseAbility:162,rep:9050,transferBudget:12e7,wageBudget:26e5,tempo:66,press:68},contender:{baseAbility:152,rep:8600,transferBudget:8e7,wageBudget:19e5,tempo:64,press:66},challenger:{baseAbility:144,rep:8100,transferBudget:55e6,wageBudget:13e5,tempo:62,press:64},solid:{baseAbility:136,rep:7600,transferBudget:34e6,wageBudget:95e4,tempo:60,press:62},rising:{baseAbility:128,rep:7e3,transferBudget:22e6,wageBudget:7e5,tempo:58,press:60},developing:{baseAbility:120,rep:6400,transferBudget:12e6,wageBudget:48e4,tempo:56,press:58}},Je=[8,4,-4,0,6,-2,-6,3,5,-5,7,-3,2,-1,4,-4,6,-6,1,-2],qt=[{positions:["GK"],preferredFoot:"Right"},{positions:["RB"],preferredFoot:"Right"},{positions:["CB"],preferredFoot:"Right"},{positions:["CB"],preferredFoot:"Left"},{positions:["LB"],preferredFoot:"Left"},{positions:["DM"],preferredFoot:"Right"},{positions:["CM"],preferredFoot:"Right"},{positions:["CM"],preferredFoot:"Left"},{positions:["AM"],preferredFoot:"Right"},{positions:["RW"],preferredFoot:"Left"},{positions:["LW"],preferredFoot:"Right"},{positions:["ST"],preferredFoot:"Right"},{positions:["GK"],preferredFoot:"Left"},{positions:["CB"],preferredFoot:"Right"},{positions:["RB","LB"],preferredFoot:"Both"},{positions:["DM","CM"],preferredFoot:"Right"},{positions:["CM"],preferredFoot:"Left"},{positions:["AM","RW"],preferredFoot:"Left"},{positions:["ST"],preferredFoot:"Left"},{positions:["LW","ST"],preferredFoot:"Right"}],Yt={ENG:{first:["James","Harry","Declan","Marcus","Bukayo","Phil"],last:["Walker","Smith","Johnson","Brown","Wilson","Taylor"]},ESP:{first:["Pedro","Sergio","Iker","Marco","Unai","Andrés"],last:["García","Hernández","Alonso","Martínez","Ruiz","Santos"]},ITA:{first:["Marco","Federico","Lorenzo","Nicolo","Sandro","Gianluca"],last:["Rossi","Bianchi","Esposito","Ferrari","Mancini","Romano"]},GER:{first:["Jonas","Lukas","Leon","Julian","Timo","Florian"],last:["Müller","Schmidt","Schneider","Fischer","Becker","Wagner"]},FRA:{first:["Kylian","Antoine","Benjamin","Theo","Loïc","Adrien"],last:["Dupont","Bernard","Moreau","Lefevre","Roux","Fontaine"]},NED:{first:["Davy","Memphis","Stefan","Jurrien","Cody","Xavi"],last:["de Jong","van Dijk","Klaassen","Bergkamp","Koopmeiners","Blind"]},PRT:{first:["Rui","João","Gonçalo","Pedro","Nuno","Tiago"],last:["Silva","Costa","Pereira","Ferreira","Carvalho","Santos"]},USA:{first:["Tyler","Christian","Weston","Brenden","Giovanni","Miles"],last:["Adams","Pulisic","McKennie","Aaronson","Dest","Zimmerman"]},BRA:{first:["Gabriel","Lucas","Raphinha","Danilo","João","Pedro"],last:["Silva","Souza","Oliveira","Costa","Ferreira","Alves"]},JPN:{first:["Daichi","Takumi","Ritsu","Wataru","Takehiro","Kaoru"],last:["Tanaka","Minamino","Doan","Endo","Tomiyasu","Mitoma"]}},Zt={first:["Alex","Sam","Jordan","Taylor","Morgan","Casey"],last:["Andersen","Lopez","Ivanov","Petrov","Khan","Singh"]};function C(e){return{id:e.id,name:e.name,nation:e.nation,level:e.level,clubs:e.clubs.map(t=>Xt(t,e))}}function Xt(e,t){const a=Jt[e.strength],n=e.qualityDelta??0,s=e.nationality??t.nationCode,r=a.baseAbility+n,o=e.marketValue??Math.round(Math.max(28e6,(r-90)*(r-88)*6e4)),l=e.transferBudget??Math.round(o*.085),c=e.wageBudget??Math.round(Math.max(a.wageBudget,o*.0022)),d=e.rep??Math.round(Math.min(9300,a.rep+Math.log10(o/1e6)*460));return{id:e.id,name:e.name,shortName:e.shortName,colors:e.colors,formation:e.formation??"4-3-3",mentality:e.mentality??"Balanced",tempo:e.tempo??a.tempo,press:e.press??a.press,rep:d,marketValue:o,transferBudget:l,wageBudget:c,players:gt(e.id,s,r)}}function gt(e,t,a){const n=Yt[t]??Zt,s=Qt(e);return qt.map((r,o)=>{const l=n.first[(o+s)%n.first.length],c=n.last[(o*2+s)%n.last.length],d=qe(a+Je[o%Je.length],94,178),u=qe(d+8+(o+s)%4*3,d+5,190),f=Math.round(Math.max(5e5,d**2*750)),g=Math.round(Math.max(6e3,d*800)),b=r.preferredFoot??(o%3===0?"Right":o%3===1?"Left":"Both");return{id:`${e}-p${o+1}`,name:`${l} ${c}`,age:19+(o+s)%12,nationality:t,foot:b,positions:r.positions,currentAbility:d,potentialAbility:u,value:f,wage:g,contractYears:3+(o+s)%3}})}function Qt(e){let t=0;for(let a=0;a<e.length;a+=1)t=(t*31+e.charCodeAt(a))%97;return t}function qe(e,t,a){return Math.max(t,Math.min(a,e))}const ea=[C({id:"la-liga",name:"La Liga",nation:"Spain",level:1,nationCode:"ESP",clubs:[{id:"real-madrid",name:"Real Madrid",shortName:"RMA",colors:["#ffffff","#3a296d"],strength:"elite",mentality:"Positive",qualityDelta:6,marketValue:105e7},{id:"barcelona",name:"FC Barcelona",shortName:"BAR",colors:["#004d98","#a50044"],strength:"elite",mentality:"Positive",tempo:68,press:70,marketValue:102e7},{id:"atletico-madrid",name:"Atlético Madrid",shortName:"ATL",colors:["#c8102e","#041e42"],strength:"contender",mentality:"Cautious",marketValue:62e7},{id:"real-sociedad",name:"Real Sociedad",shortName:"RSO",colors:["#005aa7","#ffffff"],strength:"challenger",marketValue:41e7},{id:"villarreal",name:"Villarreal",shortName:"VIL",colors:["#fbe106","#0b1f8c"],strength:"challenger",mentality:"Positive",marketValue:36e7},{id:"sevilla",name:"Sevilla",shortName:"SEV",colors:["#ffffff","#ff0000"],strength:"challenger",marketValue:28e7},{id:"real-betis",name:"Real Betis",shortName:"BET",colors:["#00965e","#ffffff"],strength:"solid",marketValue:25e7},{id:"athletic-club",name:"Athletic Club",shortName:"ATH",colors:["#da1212","#ffffff"],strength:"solid",marketValue:305e6},{id:"valencia",name:"Valencia CF",shortName:"VAL",colors:["#ff8200","#000000"],strength:"solid",marketValue:22e7},{id:"girona",name:"Girona FC",shortName:"GIR",colors:["#e5002b","#ffffff"],strength:"rising",marketValue:215e6}]}),C({id:"serie-a",name:"Serie A",nation:"Italy",level:1,nationCode:"ITA",clubs:[{id:"inter",name:"Inter",shortName:"INT",colors:["#1b65be","#000000"],strength:"elite",mentality:"Positive",press:69,marketValue:7e8},{id:"juventus",name:"Juventus",shortName:"JUV",colors:["#000000","#ffffff"],strength:"elite",mentality:"Balanced",marketValue:65e7},{id:"ac-milan",name:"AC Milan",shortName:"MIL",colors:["#a50044","#000000"],strength:"contender",mentality:"Positive",marketValue:56e7},{id:"napoli",name:"Napoli",shortName:"NAP",colors:["#0078d7","#002654"],strength:"contender",marketValue:52e7},{id:"roma",name:"AS Roma",shortName:"ROM",colors:["#8e1f1f","#f7a81b"],strength:"challenger",marketValue:38e7},{id:"lazio",name:"Lazio",shortName:"LAZ",colors:["#65aadb","#ffffff"],strength:"challenger",marketValue:36e7},{id:"atalanta",name:"Atalanta",shortName:"ATA",colors:["#1f4e8c","#000000"],strength:"challenger",marketValue:35e7},{id:"fiorentina",name:"Fiorentina",shortName:"FIO",colors:["#592d82","#ffffff"],strength:"solid",marketValue:29e7},{id:"bologna",name:"Bologna",shortName:"BOL",colors:["#a6192e","#132257"],strength:"solid",marketValue:24e7},{id:"torino",name:"Torino",shortName:"TOR",colors:["#7f1d1d","#ffffff"],strength:"solid",marketValue:21e7}]}),C({id:"bundesliga",name:"Bundesliga",nation:"Germany",level:1,nationCode:"GER",clubs:[{id:"bayern",name:"Bayern Munich",shortName:"FCB",colors:["#dc052d","#0066b2"],strength:"elite",mentality:"Positive",tempo:70,marketValue:97e7},{id:"dortmund",name:"Borussia Dortmund",shortName:"BVB",colors:["#fdd102","#000000"],strength:"contender",mentality:"Positive",marketValue:65e7},{id:"rb-leipzig",name:"RB Leipzig",shortName:"RBL",colors:["#d72027","#ffffff"],strength:"contender",marketValue:51e7},{id:"leverkusen",name:"Bayer Leverkusen",shortName:"B04",colors:["#e32219","#000000"],strength:"challenger",marketValue:61e7},{id:"union-berlin",name:"Union Berlin",shortName:"FCU",colors:["#e31b23","#f4c300"],strength:"challenger",mentality:"Cautious",marketValue:22e7},{id:"freiburg",name:"SC Freiburg",shortName:"SCF",colors:["#000000","#ffffff"],strength:"solid",marketValue:21e7},{id:"stuttgart",name:"VfB Stuttgart",shortName:"VFB",colors:["#ed2939","#ffffff"],strength:"solid",marketValue:27e7},{id:"frankfurt",name:"Eintracht Frankfurt",shortName:"SGE",colors:["#e60026","#000000"],strength:"solid",marketValue:25e7},{id:"monchengladbach",name:"Borussia M'Gladbach",shortName:"BMG",colors:["#0b5c0b","#ffffff"],strength:"solid",marketValue:22e7},{id:"wolfsburg",name:"Wolfsburg",shortName:"WOB",colors:["#14b53a","#ffffff"],strength:"solid",marketValue:2e8}]}),C({id:"ligue-1",name:"Ligue 1",nation:"France",level:1,nationCode:"FRA",clubs:[{id:"psg",name:"Paris Saint-Germain",shortName:"PSG",colors:["#004170","#e30613"],strength:"elite",mentality:"Positive",press:72,marketValue:89e7},{id:"marseille",name:"Marseille",shortName:"OM",colors:["#00a3e0","#ffffff"],strength:"contender",mentality:"Positive",marketValue:33e7},{id:"monaco",name:"AS Monaco",shortName:"ASM",colors:["#e2001a","#ffffff"],strength:"contender",marketValue:35e7},{id:"lyon",name:"Lyon",shortName:"OL",colors:["#273e8c","#e60012"],strength:"challenger",marketValue:32e7},{id:"lille",name:"Lille",shortName:"LIL",colors:["#e2001a","#1b3f8b"],strength:"challenger",marketValue:32e7},{id:"rennes",name:"Rennes",shortName:"REN",colors:["#e41b17","#1d1d1b"],strength:"challenger",marketValue:31e7},{id:"nice",name:"Nice",shortName:"NCE",colors:["#a00000","#000000"],strength:"solid",marketValue:29e7},{id:"lens",name:"Lens",shortName:"RCL",colors:["#f4d130","#c30404"],strength:"solid",marketValue:28e7},{id:"nantes",name:"Nantes",shortName:"NAN",colors:["#ffe600","#007a33"],strength:"rising",marketValue:145e6},{id:"reims",name:"Reims",shortName:"REI",colors:["#d40000","#ffffff"],strength:"rising",marketValue:17e7}]}),C({id:"eredivisie",name:"Eredivisie",nation:"Netherlands",level:1,nationCode:"NED",clubs:[{id:"ajax",name:"Ajax",shortName:"AJA",colors:["#ffffff","#d20a0a"],strength:"contender",mentality:"Positive",marketValue:36e7},{id:"psv",name:"PSV",shortName:"PSV",colors:["#ff0000","#ffffff"],strength:"contender",marketValue:31e7},{id:"feyenoord",name:"Feyenoord",shortName:"FEY",colors:["#ff0000","#ffffff"],strength:"contender",marketValue:32e7},{id:"az-alkmaar",name:"AZ Alkmaar",shortName:"AZ",colors:["#e2001a","#000000"],strength:"challenger",marketValue:22e7},{id:"twente",name:"FC Twente",shortName:"TWE",colors:["#d71920","#ffffff"],strength:"challenger",marketValue:18e7},{id:"utrecht",name:"FC Utrecht",shortName:"UTR",colors:["#d71920","#005ca7"],strength:"solid",marketValue:12e7},{id:"heerenveen",name:"Heerenveen",shortName:"HEE",colors:["#0b4ea2","#ffffff"],strength:"solid",marketValue:95e6},{id:"vitesse",name:"Vitesse",shortName:"VIT",colors:["#f6c800","#000000"],strength:"solid",marketValue:85e6},{id:"groningen",name:"Groningen",shortName:"GRO",colors:["#009639","#ffffff"],strength:"rising",marketValue:75e6},{id:"nec",name:"NEC Nijmegen",shortName:"NEC",colors:["#009639","#e03c31"],strength:"rising",marketValue:7e7}]}),C({id:"primeira-liga",name:"Primeira Liga",nation:"Portugal",level:1,nationCode:"PRT",clubs:[{id:"benfica",name:"Benfica",shortName:"BEN",colors:["#ff0000","#ffffff"],strength:"contender",mentality:"Positive"},{id:"porto",name:"FC Porto",shortName:"FCP",colors:["#0033a0","#ffffff"],strength:"contender"},{id:"sporting",name:"Sporting CP",shortName:"SCP",colors:["#00874b","#ffffff"],strength:"contender"},{id:"braga",name:"SC Braga",shortName:"BRA",colors:["#c4171d","#ffffff"],strength:"challenger"},{id:"guimaraes",name:"Vitória SC",shortName:"GUI",colors:["#ffffff","#000000"],strength:"challenger"},{id:"boavista",name:"Boavista",shortName:"BOA",colors:["#000000","#ffffff"],strength:"solid"},{id:"rio-ave",name:"Rio Ave",shortName:"RIO",colors:["#009639","#ff8200"],strength:"solid"},{id:"famalicao",name:"Famalicão",shortName:"FAM",colors:["#003a70","#fdda24"],strength:"solid"},{id:"estoril",name:"Estoril",shortName:"EST",colors:["#fdda24","#0033a0"],strength:"rising"},{id:"gil-vicente",name:"Gil Vicente",shortName:"GIL",colors:["#e00034","#001489"],strength:"rising"}]}),C({id:"mls",name:"Major League Soccer",nation:"United States",level:1,nationCode:"USA",clubs:[{id:"la-galaxy",name:"LA Galaxy",shortName:"LAG",colors:["#00245d","#ffd200"],strength:"solid",mentality:"Positive"},{id:"la-fc",name:"LAFC",shortName:"LAFC",colors:["#000000","#c59d5f"],strength:"solid"},{id:"seattle",name:"Seattle Sounders",shortName:"SEA",colors:["#2c68b1","#66b32e"],strength:"solid"},{id:"atlanta",name:"Atlanta United",shortName:"ATL",colors:["#a4000f","#000000"],strength:"solid"},{id:"nycfc",name:"NYCFC",shortName:"NYC",colors:["#6cadde","#00285e"],strength:"solid"},{id:"inter-miami",name:"Inter Miami",shortName:"MIA",colors:["#ff82ad","#000000"],strength:"rising"},{id:"philadelphia",name:"Philadelphia Union",shortName:"PHI",colors:["#002d55","#b4975a"],strength:"solid"},{id:"toronto",name:"Toronto FC",shortName:"TOR",colors:["#e31837","#4b9cd3"],strength:"solid"},{id:"new-england",name:"New England Revolution",shortName:"NER",colors:["#0a2240","#c8102e"],strength:"rising"},{id:"columbus",name:"Columbus Crew",shortName:"CLB",colors:["#fedd00","#000000"],strength:"rising"}]}),C({id:"brasileirao",name:"Brasileirão Série A",nation:"Brazil",level:1,nationCode:"BRA",clubs:[{id:"flamengo",name:"Flamengo",shortName:"FLA",colors:["#c8102e","#000000"],strength:"contender",mentality:"Positive"},{id:"palmeiras",name:"Palmeiras",shortName:"PAL",colors:["#006437","#ffffff"],strength:"contender"},{id:"corinthians",name:"Corinthians",shortName:"COR",colors:["#000000","#ffffff"],strength:"challenger"},{id:"sao-paulo",name:"São Paulo",shortName:"SAO",colors:["#ff0000","#000000"],strength:"challenger"},{id:"gremio",name:"Grêmio",shortName:"GRE",colors:["#0094d4","#000000"],strength:"challenger"},{id:"internacional",name:"Internacional",shortName:"INT",colors:["#ff0000","#ffffff"],strength:"challenger"},{id:"atletico-mg",name:"Atlético Mineiro",shortName:"CAM",colors:["#000000","#ffffff"],strength:"challenger"},{id:"fluminense",name:"Fluminense",shortName:"FLU",colors:["#900021","#006341"],strength:"solid"},{id:"botafogo",name:"Botafogo",shortName:"BOT",colors:["#000000","#ffffff"],strength:"solid"},{id:"santos",name:"Santos",shortName:"SAN",colors:["#000000","#ffffff"],strength:"solid"}]}),C({id:"j1-league",name:"J1 League",nation:"Japan",level:1,nationCode:"JPN",clubs:[{id:"kawasaki-frontale",name:"Kawasaki Frontale",shortName:"KAW",colors:["#00a0e9","#000000"],strength:"challenger",mentality:"Positive"},{id:"yokohama-f-marinos",name:"Yokohama F. Marinos",shortName:"YFM",colors:["#00205b","#d22f27"],strength:"challenger"},{id:"kashima-antlers",name:"Kashima Antlers",shortName:"KAS",colors:["#c8102e","#00205b"],strength:"challenger"},{id:"urawa-reds",name:"Urawa Reds",shortName:"URW",colors:["#c8102e","#000000"],strength:"challenger"},{id:"cerezo-osaka",name:"Cerezo Osaka",shortName:"CER",colors:["#ff5fa2","#002a5c"],strength:"solid"},{id:"gamba-osaka",name:"Gamba Osaka",shortName:"GAM",colors:["#0c1b3a","#0091d4"],strength:"solid"},{id:"hiroshima",name:"Sanfrecce Hiroshima",shortName:"SAN",colors:["#4c2f91","#ffffff"],strength:"solid"},{id:"vissel-kobe",name:"Vissel Kobe",shortName:"VIS",colors:["#9c1830","#ffffff"],strength:"solid"},{id:"fc-tokyo",name:"FC Tokyo",shortName:"FCT",colors:["#003da5","#d50032"],strength:"solid"},{id:"nagoya",name:"Nagoya Grampus",shortName:"NAG",colors:["#e60012","#f8b500"],strength:"solid"}]}),C({id:"championship",name:"EFL Championship",nation:"England",level:2,nationCode:"ENG",clubs:[{id:"leicester",name:"Leicester City",shortName:"LEI",colors:["#003090","#fdb913"],strength:"challenger",marketValue:27e7},{id:"leeds",name:"Leeds United",shortName:"LEE",colors:["#fff200","#1d428a"],strength:"challenger",marketValue:25e7},{id:"southampton",name:"Southampton",shortName:"SOU",colors:["#d71920","#130c0e"],strength:"challenger",marketValue:23e7},{id:"ipswich",name:"Ipswich Town",shortName:"IPS",colors:["#003399","#ffffff"],strength:"solid",marketValue:9e7},{id:"watford",name:"Watford",shortName:"WAT",colors:["#fbee23","#ed2127"],strength:"solid",marketValue:95e6},{id:"norwich",name:"Norwich",shortName:"NOR",colors:["#fff200","#007f3a"],strength:"solid",marketValue:11e7},{id:"sunderland",name:"Sunderland",shortName:"SUN",colors:["#ee2737","#ffffff"],strength:"solid",marketValue:8e7},{id:"middlesbrough",name:"Middlesbrough",shortName:"MID",colors:["#da2128","#ffffff"],strength:"solid",marketValue:85e6},{id:"coventry",name:"Coventry City",shortName:"COV",colors:["#8dc1e8","#000000"],strength:"rising",marketValue:75e6},{id:"west-brom",name:"West Brom",shortName:"WBA",colors:["#0d2340","#ffffff"],strength:"rising",marketValue:78e6}]}),C({id:"la-liga-2",name:"La Liga 2",nation:"Spain",level:2,nationCode:"ESP",clubs:[{id:"leganes",name:"Leganés",shortName:"LEG",colors:["#ffffff","#005baa"],strength:"solid",marketValue:45e6},{id:"espanyol",name:"Espanyol",shortName:"ESP",colors:["#007ac2","#ffffff"],strength:"solid",marketValue:11e7},{id:"elche",name:"Elche",shortName:"ELC",colors:["#0f7b3e","#ffffff"],strength:"solid",marketValue:6e7},{id:"oviedo",name:"Real Oviedo",shortName:"OVI",colors:["#0055a4","#ffc400"],strength:"solid",marketValue:55e6},{id:"zaragoza",name:"Real Zaragoza",shortName:"ZAR",colors:["#00529f","#ffffff"],strength:"solid",marketValue:58e6},{id:"levante",name:"Levante",shortName:"LEV",colors:["#041c2c","#9e1b32"],strength:"solid",marketValue:65e6},{id:"malaga",name:"Málaga",shortName:"MAL",colors:["#6bb3dd","#ffffff"],strength:"rising",marketValue:4e7},{id:"tenerife",name:"Tenerife",shortName:"TEN",colors:["#1c3f95","#ffffff"],strength:"rising",marketValue:32e6},{id:"valladolid",name:"Valladolid",shortName:"VLL",colors:["#4b0082","#ffffff"],strength:"rising",marketValue:85e6},{id:"sporting-gijon",name:"Sporting Gijón",shortName:"SPG",colors:["#d50032","#ffffff"],strength:"rising",marketValue:45e6}]}),C({id:"serie-b",name:"Serie B",nation:"Italy",level:2,nationCode:"ITA",clubs:[{id:"parma",name:"Parma",shortName:"PAR",colors:["#002f87","#ffdd00"],strength:"solid",marketValue:65e6},{id:"palermo",name:"Palermo",shortName:"PAL",colors:["#f5a8b8","#000000"],strength:"solid",marketValue:52e6},{id:"cagliari",name:"Cagliari",shortName:"CAG",colors:["#003366","#a50034"],strength:"solid",marketValue:95e6},{id:"brescia",name:"Brescia",shortName:"BRE",colors:["#0054a6","#ffffff"],strength:"solid",marketValue:45e6},{id:"como",name:"Como",shortName:"COM",colors:["#003399","#ffffff"],strength:"solid",marketValue:6e7},{id:"pisa",name:"Pisa",shortName:"PIS",colors:["#000000","#0076bf"],strength:"rising",marketValue:38e6},{id:"frosinone",name:"Frosinone",shortName:"FRO",colors:["#004aad","#ffda44"],strength:"rising",marketValue:7e7},{id:"spezia",name:"Spezia",shortName:"SPE",colors:["#000000","#ffffff"],strength:"rising",marketValue:75e6},{id:"reggina",name:"Reggina",shortName:"REG",colors:["#800000","#ffffff"],strength:"rising",marketValue:35e6},{id:"lecce",name:"Lecce",shortName:"LEC",colors:["#004aad","#ffdd00"],strength:"rising",marketValue:9e7}]}),C({id:"2-bundesliga",name:"2. Bundesliga",nation:"Germany",level:2,nationCode:"GER",clubs:[{id:"hamburg",name:"Hamburg",shortName:"HSV",colors:["#005ca9","#ffffff"],strength:"solid",marketValue:7e7},{id:"schalke",name:"Schalke",shortName:"S04",colors:["#0d47a1","#ffffff"],strength:"solid",marketValue:8e7},{id:"hertha",name:"Hertha BSC",shortName:"BSC",colors:["#0041ab","#ffffff"],strength:"solid",marketValue:85e6},{id:"st-pauli",name:"St. Pauli",shortName:"STP",colors:["#4b3621","#ffffff"],strength:"solid",marketValue:6e7},{id:"dusseldorf",name:"Fortuna Düsseldorf",shortName:"F95",colors:["#d11241","#ffffff"],strength:"solid",marketValue:55e6},{id:"hannover",name:"Hannover 96",shortName:"H96",colors:["#006633","#000000"],strength:"solid",marketValue:5e7},{id:"nurnberg",name:"Nürnberg",shortName:"FCN",colors:["#800000","#ffffff"],strength:"solid",marketValue:45e6},{id:"paderborn",name:"Paderborn",shortName:"SCP",colors:["#003399","#ffffff"],strength:"rising",marketValue:45e6},{id:"karlsruhe",name:"Karlsruhe",shortName:"KSC",colors:["#0054a6","#ffffff"],strength:"rising",marketValue:38e6},{id:"holstein-kiel",name:"Holstein Kiel",shortName:"KIE",colors:["#005ca9","#ff0000"],strength:"rising",marketValue:4e7}]}),C({id:"ligue-2",name:"Ligue 2",nation:"France",level:2,nationCode:"FRA",clubs:[{id:"auxerre",name:"Auxerre",shortName:"AJA",colors:["#0f5bb3","#ffffff"],strength:"solid",marketValue:35e6},{id:"saint-etienne",name:"Saint-Étienne",shortName:"ASSE",colors:["#00a55c","#ffffff"],strength:"solid",marketValue:5e7},{id:"angers",name:"Angers SCO",shortName:"ANG",colors:["#000000","#ffffff"],strength:"solid",marketValue:4e7},{id:"caen",name:"Caen",shortName:"CAE",colors:["#003087","#e4002b"],strength:"solid",marketValue:25e6},{id:"guingamp",name:"Guingamp",shortName:"GUI",colors:["#d40000","#000000"],strength:"solid",marketValue:24e6},{id:"bastia",name:"Bastia",shortName:"BAS",colors:["#0033a0","#ffffff"],strength:"solid",marketValue:22e6},{id:"dijon",name:"Dijon",shortName:"DIJ",colors:["#d50032","#ffffff"],strength:"rising",marketValue:2e7},{id:"sochaux",name:"Sochaux",shortName:"SOC",colors:["#f9d616","#003a70"],strength:"rising",marketValue:23e6},{id:"grenoble",name:"Grenoble",shortName:"GRE",colors:["#00539f","#ffffff"],strength:"rising",marketValue:18e6},{id:"amiens",name:"Amiens",shortName:"AMI",colors:["#6c757d","#ffffff"],strength:"rising",marketValue:3e7}]}),C({id:"eerste-divisie",name:"Eerste Divisie",nation:"Netherlands",level:2,nationCode:"NED",clubs:[{id:"zwolle",name:"PEC Zwolle",shortName:"ZWO",colors:["#007bc7","#ffffff"],strength:"solid",marketValue:25e6},{id:"willem-ii",name:"Willem II",shortName:"WII",colors:["#a50034","#132257"],strength:"solid",marketValue:22e6},{id:"nac-breda",name:"NAC Breda",shortName:"NAC",colors:["#ffcc00","#000000"],strength:"solid",marketValue:2e7},{id:"de-graafschap",name:"De Graafschap",shortName:"GRA",colors:["#0b4ea2","#ffffff"],strength:"solid",marketValue:15e6},{id:"roda-jc",name:"Roda JC",shortName:"RJC",colors:["#ffcd00","#000000"],strength:"solid",marketValue:14e6},{id:"den-haag",name:"ADO Den Haag",shortName:"ADO",colors:["#007f3b","#ffdd00"],strength:"rising",marketValue:18e6},{id:"almere-city",name:"Almere City",shortName:"ALM",colors:["#e32219","#ffffff"],strength:"rising",marketValue:16e6},{id:"excelsior",name:"Excelsior",shortName:"EXC",colors:["#000000","#ffffff"],strength:"rising",marketValue:17e6},{id:"top-oss",name:"TOP Oss",shortName:"OSS",colors:["#d50032","#ffffff"],strength:"developing",marketValue:8e6},{id:"telstar",name:"Telstar",shortName:"TEL",colors:["#ffffff","#f9a602"],strength:"developing",marketValue:7e6}]}),C({id:"league-one",name:"EFL League One",nation:"England",level:3,nationCode:"ENG",clubs:[{id:"portsmouth",name:"Portsmouth",shortName:"POR",colors:["#003399","#ffffff"],strength:"rising",transferBudget:12e6,wageBudget:4e5},{id:"derby",name:"Derby County",shortName:"DER",colors:["#000000","#ffffff"],strength:"rising",transferBudget:11e6,wageBudget:38e4},{id:"bolton",name:"Bolton Wanderers",shortName:"BOL",colors:["#001489","#ffffff"],strength:"rising",transferBudget:1e7,wageBudget:36e4},{id:"blackpool",name:"Blackpool",shortName:"BLA",colors:["#ff5f00","#ffffff"],strength:"developing",transferBudget:9e6,wageBudget:34e4},{id:"charlton",name:"Charlton",shortName:"CHA",colors:["#c60c30","#ffffff"],strength:"developing",transferBudget:8e6,wageBudget:32e4},{id:"wycombe",name:"Wycombe",shortName:"WYC",colors:["#4f9ec4","#0f1c2c"],strength:"developing",transferBudget:75e5,wageBudget:3e5},{id:"peterborough",name:"Peterborough",shortName:"PET",colors:["#0057b7","#ffffff"],strength:"developing",transferBudget:7e6,wageBudget:28e4},{id:"oxford",name:"Oxford United",shortName:"OXF",colors:["#f4c800","#001489"],strength:"developing",transferBudget:65e5,wageBudget:26e4},{id:"barnsley",name:"Barnsley",shortName:"BAR",colors:["#c8102e","#ffffff"],strength:"developing",transferBudget:6e6,wageBudget:25e4},{id:"lincoln",name:"Lincoln City",shortName:"LIN",colors:["#d4021d","#ffffff"],strength:"developing",transferBudget:55e5,wageBudget:23e4}]}),C({id:"primera-rfef",name:"Primera Federación",nation:"Spain",level:3,nationCode:"ESP",clubs:[{id:"deportivo",name:"Deportivo La Coruña",shortName:"DEP",colors:["#1d4ba0","#ffffff"],strength:"rising",transferBudget:85e5,wageBudget:32e4},{id:"cordoba",name:"Córdoba",shortName:"COR",colors:["#007a33","#ffffff"],strength:"rising",transferBudget:78e5,wageBudget:3e5},{id:"cultural",name:"Cultural Leonesa",shortName:"CUL",colors:["#ffffff","#c8102e"],strength:"developing",transferBudget:72e5,wageBudget:28e4},{id:"murcia",name:"Real Murcia",shortName:"MUR",colors:["#c8102e","#ffffff"],strength:"developing",transferBudget:68e5,wageBudget:26e4},{id:"ponferradina",name:"Ponferradina",shortName:"PON",colors:["#003399","#ffffff"],strength:"developing",transferBudget:65e5,wageBudget:25e4},{id:"alcorcon",name:"Alcorcón",shortName:"ALC",colors:["#ffd100","#0033a0"],strength:"developing",transferBudget:6e6,wageBudget:23e4},{id:"sabadell",name:"Sabadell",shortName:"SAB",colors:["#1b3f8b","#ffffff"],strength:"developing",transferBudget:58e5,wageBudget:22e4},{id:"castellon",name:"Castellón",shortName:"CAS",colors:["#000000","#ffffff"],strength:"developing",transferBudget:55e5,wageBudget:21e4},{id:"ferrol",name:"Racing Ferrol",shortName:"FER",colors:["#007f3a","#ffffff"],strength:"developing",transferBudget:52e5,wageBudget:2e5},{id:"barcelona-b",name:"Barcelona Atlètic",shortName:"BARB",colors:["#004d98","#a50044"],strength:"developing",transferBudget:5e6,wageBudget:19e4}]}),C({id:"serie-c",name:"Serie C",nation:"Italy",level:3,nationCode:"ITA",clubs:[{id:"sudtirol",name:"Südtirol",shortName:"SUD",colors:["#a50034","#ffffff"],strength:"rising",transferBudget:8e6,wageBudget:32e4},{id:"padova",name:"Padova",shortName:"PAD",colors:["#c8102e","#ffffff"],strength:"rising",transferBudget:75e5,wageBudget:3e5},{id:"perugia",name:"Perugia",shortName:"PER",colors:["#d50032","#ffffff"],strength:"developing",transferBudget:7e6,wageBudget:28e4},{id:"ternana",name:"Ternana",shortName:"TER",colors:["#007a33","#d50032"],strength:"developing",transferBudget:65e5,wageBudget:26e4},{id:"modena",name:"Modena",shortName:"MOD",colors:["#002d72","#ffd200"],strength:"developing",transferBudget:62e5,wageBudget:24e4},{id:"cesena",name:"Cesena",shortName:"CES",colors:["#000000","#ffffff"],strength:"developing",transferBudget:6e6,wageBudget:23e4},{id:"catanzaro",name:"Catanzaro",shortName:"CAT",colors:["#ff0000","#ffff00"],strength:"developing",transferBudget:58e5,wageBudget:22e4},{id:"avellino",name:"Avellino",shortName:"AVE",colors:["#007a3d","#ffffff"],strength:"developing",transferBudget:56e5,wageBudget:21e4},{id:"monopoli",name:"Monopoli",shortName:"MON",colors:["#00843d","#ffffff"],strength:"developing",transferBudget:54e5,wageBudget:2e5},{id:"trieste",name:"Triestina",shortName:"TRI",colors:["#c8102e","#ffffff"],strength:"developing",transferBudget:52e5,wageBudget:19e4}]})],ta=[jt,...ea],aa="useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";let na=(e=21)=>{let t="",a=crypto.getRandomValues(new Uint8Array(e|=0));for(;e--;)t+=aa[a[e]&63];return t};const sa=2024;function ra(e){const t=ie(e),a={season:sa,week:0,day:0},n=[],s=[],r=[],o=[];ta.forEach(d=>{const u=[],f=[];d.clubs.forEach(g=>{const b=bt(g,d.id);u.push(b.id);const S=vt(g,b,a,t);b.roster.push(...S.map(L=>L.id)),b.wageCommitment=S.reduce((L,y)=>L+y.wage,0),f.push(b),s.push(b),r.push(...S)}),o.push(...mt(f,d.id,a)),n.push({id:d.id,name:d.name,nation:d.nation,level:d.level,clubIds:u})});const l=fa(s,r,t),c={seed:e,date:a,leagues:n,clubs:s,players:r,fixtures:o,matches:[],inbox:["Welcome to HTML5 Football Manager."],results:[],standings:{},transferListings:l,transferHistory:[],userClubId:null,userLeagueId:null};return n.forEach(d=>{c.standings[d.id]=ke(c,d.id)}),c}function Ye(e){const t=e.fixtures.filter(r=>!r.played&&Ut(r.date,e.date)),a=le(e.seed,e.date.week*10+e.date.day),n=t.map(r=>ht(e,r,a));if(n.forEach(r=>yt(e,r)),e.date=Be(e.date),!t.length)return{matches:[],messages:["No fixtures scheduled today."]};const s=t.map(r=>{const o=e.matches.find(u=>u.fixtureId===r.id),l=Xe(e,r.homeId),c=Xe(e,r.awayId),d=o?`${o.score.home}-${o.score.away}`:"vs";return`${l} ${d} ${c}`});return{matches:n,messages:s}}function oa(e,t){const a=e.fixtures.find(r=>r.id===t.fixtureId);if(!a||a.played)return null;const n=le(e.seed,Number(a.id.replace(/\D/g,""))||1),s=ht(e,a,n);return yt(e,s),s}function ia(e,t){const a=e.players.find(c=>c.id===t.playerId);if(!a||a.clubId===null)return"Selected player is unavailable.";const n=e.clubs.find(c=>c.id===a.clubId),s=e.clubs.find(c=>c.id===t.buyingClubId);if(!n||!s)return"Invalid clubs for transfer bid.";if(n.id===s.id)return"You already employ this player.";if(t.offer>s.transferBudget)return"Offer exceeds available transfer budget.";const r=e.transferListings.find(c=>c.playerId===a.id),o=(r==null?void 0:r.askingPrice)??Math.round(a.value*1.1);if(t.offer<o*.85)return r==null||r.interestedClubIds.push(s.id),"Bid rejected – the offer is too low.";n.transferBudget+=t.offer,s.transferBudget-=t.offer,n.roster=n.roster.filter(c=>c!==a.id),s.roster.push(a.id),a.clubId=s.id,a.transferListed=!1,s.wageCommitment+=a.wage,n.wageCommitment-=a.wage;const l={id:na(),playerId:a.id,fromClubId:n.id,toClubId:s.id,fee:t.offer,date:{...e.date}};return e.transferHistory.unshift(l),r&&(r.status="Completed"),e.inbox.unshift(`${a.name} has signed for ${s.name} for £${ha(t.offer)}.`),`${a.name} agrees to join ${s.name}.`}const Ze={academy:{baseAbility:134,tempo:59,press:60},challenger:{baseAbility:144,tempo:62,press:64},elite:{baseAbility:152,tempo:64,press:66}},la={England:"ENG",Spain:"ESP",Italy:"ITA",Germany:"GER",France:"FRA",Netherlands:"NED",Portugal:"PRT",Brazil:"BRA",Japan:"JPN",USA:"USA"};function ca(e,t){const a=e.leagues.find(m=>m.id===t.leagueId);if(!a)return{success:!1,message:"Selected league does not exist."};const n=t.name.trim();if(n.length<3)return{success:!1,message:"Club name must be at least three characters."};const s=t.shortName.trim().toUpperCase();if(s.length<2||s.length>5)return{success:!1,message:"Short name must be 2-5 characters."};if(e.clubs.some(m=>m.name.toLowerCase()===n.toLowerCase()))return{success:!1,message:"A club with that name already exists."};if(e.clubs.some(m=>m.shortName.toUpperCase()===s))return{success:!1,message:"Short name is already in use."};const r=Ze[t.profile]??Ze.academy,o=ma(n)||`custom-${e.clubs.length+1}`;let l=o,c=1;for(;e.clubs.some(m=>m.id===l);)l=`${o}-${c}`,c+=1;const d=t.nationality??la[a.nation]??"ENG",u=gt(l,d,r.baseAbility),f=u.reduce((m,p)=>m+p.value,0),g=Math.round(Math.max(2e7,f*.09)),b=Math.round(Math.max(45e4,f*.0025)),S=Math.round(Math.min(9200,6900+Math.log10(f/1e6)*520)),L={id:l,name:n,shortName:s,colors:[t.primaryColor,t.secondaryColor],formation:t.formation,mentality:t.mentality,tempo:r.tempo,press:r.press,rep:S,marketValue:f,transferBudget:g,wageBudget:b,players:u},y=bt(L,a.id),P=le(e.seed,e.players.length+e.clubs.length+17),R=ie(P),k=vt(L,y,e.date,R);y.roster.push(...k.map(m=>m.id)),y.wageCommitment=k.reduce((m,p)=>m+p.wage,0),e.clubs.push(y),e.players.push(...k);const w=e.leagues.find(m=>m.id===a.id);w&&(w.clubIds=[...w.clubIds,y.id]),e.fixtures=e.fixtures.filter(m=>m.competitionId!==a.id);const v=e.clubs.filter(m=>m.leagueId===a.id);return e.fixtures.push(...mt(v,a.id,e.date)),e.standings[a.id]=ke(e,a.id),e.inbox.unshift(`${y.name} has been founded and joins ${a.name}.`),{success:!0,clubId:y.id,message:`${y.name} is ready for its inaugural season in ${a.name}.`}}function pt(e,t){return t?e.fixtures.filter(a=>!a.played&&(a.homeId===t||a.awayId===t)).sort((a,n)=>Qe(a.date)-Qe(n.date)).slice(0,5):[]}function yt(e,t){e.matches.push(t),e.results.unshift(t);const a=e.fixtures.find(n=>n.id===t.fixtureId);a&&(a.played=!0,a.matchId=t.id,e.standings[a.competitionId]=ke(e,a.competitionId))}function bt(e,t){const a=e.marketValue??da(e);return{id:e.id,name:e.name,shortName:e.shortName,leagueId:t,roster:[],colors:e.colors,tactics:{formation:e.formation,mentality:e.mentality,tempo:e.tempo,press:e.press},rep:e.rep,marketValue:a,transferBudget:e.transferBudget,wageBudget:e.wageBudget,wageCommitment:0}}function da(e){return e.players.length?e.players.reduce((t,a)=>t+a.value,0):12e7}function vt(e,t,a,n){return e.players.map(s=>({id:s.id,name:s.name,age:s.age,nationality:s.nationality,foot:s.foot,positions:s.positions,attributes:ua(s,n),currentAbility:s.currentAbility,potentialAbility:s.potentialAbility,morale:75+Math.round(n.next()*10),condition:88+Math.round(n.next()*10),sharpness:70+Math.round(n.next()*15),value:s.value,wage:s.wage,contractExpirySeason:a.season+s.contractYears,clubId:t.id,form:[],transferListed:s.contractYears<=2&&s.age>30}))}function ua(e,t){const a=Math.max(6,Math.min(19,Math.round(e.currentAbility/10))),n=()=>Ae(a+Math.round((t.next()-.5)*4),3,20),s={finishing:B(e.positions,["ST","AM","LW","RW"],n,a+1,t),firstTouch:n(),passing:B(e.positions,["CM","DM","AM","RB","LB"],n,a+1,t),crossing:B(e.positions,["RB","LB","LW","RW"],n,a,t),dribbling:B(e.positions,["LW","RW","AM","ST"],n,a+1,t),heading:B(e.positions,["CB","ST"],n,a,t),tackling:B(e.positions,["CB","DM","RB","LB"],n,a+1,t),marking:B(e.positions,["CB","DM"],n,a+1,t),longShots:n(),setPieces:n(),decisions:a+Math.round(t.next()*2),anticipation:n(),vision:B(e.positions,["AM","CM"],n,a+1,t),workRate:a+Math.round(t.next()*3),bravery:a+Math.round(t.next()*3),composure:B(e.positions,["ST","AM","CM"],n,a+1,t),offTheBall:B(e.positions,["ST","AM","LW","RW"],n,a+1,t),positioning:B(e.positions,["CB","DM"],n,a+1,t),leadership:a-1+Math.round(t.next()*3),flair:B(e.positions,["AM","LW","RW"],n,a+2,t),pace:B(e.positions,["LW","RW","ST","RB","LB"],n,a+1,t),acceleration:B(e.positions,["LW","RW","ST"],n,a+1,t),strength:B(e.positions,["CB","ST","DM"],n,a,t),stamina:a+Math.round(t.next()*3),agility:n(),jumping:B(e.positions,["CB","ST"],n,a,t),handling:e.positions.includes("GK")?a+2:1,reflexes:e.positions.includes("GK")?a+1:1,aerial:e.positions.includes("GK")?a+1:n(),distribution:e.positions.includes("GK")?a+1:n()},r=Object.entries(s),o={};return r.forEach(([l,c])=>{o[l]=Ae(c,1,20)}),o}function B(e,t,a,n,s){return e.some(r=>t.includes(r))?Ae(n+Math.round((s.next()-.4)*4),1,20):a()}function fa(e,t,a){const n=[];if(t.filter(s=>s.transferListed).forEach(s=>{n.push({playerId:s.id,fromClubId:s.clubId,askingPrice:Math.round(s.value*(1+a.next()*.1)),interestedClubIds:[],status:"Available"})}),n.length<8){const s=[...t].filter(r=>r.clubId!==null).sort((r,o)=>o.currentAbility-r.currentAbility);for(const r of s)if(!n.some(o=>o.playerId===r.id)&&(n.push({playerId:r.id,fromClubId:r.clubId,askingPrice:Math.round(r.value*1.15),interestedClubIds:[],status:"Available"}),n.length>=8))break}return n}function ke(e,t){const a=e.clubs.filter(r=>r.leagueId===t),n=new Map,s=new Map(e.fixtures.map(r=>[r.id,r]));return a.forEach(r=>{n.set(r.id,{clubId:r.id,played:0,won:0,drawn:0,lost:0,goalsFor:0,goalsAgainst:0,goalDifference:0,points:0,form:[]})}),e.results.slice().reverse().forEach(r=>{const o=s.get(r.fixtureId);if(!o||o.competitionId!==t)return;const l=[r.stats[0].clubId,r.stats[1].clubId];l.forEach((c,d)=>{const u=n.get(c);if(!u)return;const f=l[1-d];if(!n.has(f))return;const g=r.stats[d].goals,b=r.stats[1-d].goals;u.played+=1,u.goalsFor+=g,u.goalsAgainst+=b,u.goalDifference=u.goalsFor-u.goalsAgainst,g>b?(u.won+=1,u.points+=3,u.form.push("W")):g===b?(u.drawn+=1,u.points+=1,u.form.push("D")):(u.lost+=1,u.form.push("L")),u.form.length>5&&(u.form=u.form.slice(u.form.length-5))})}),Array.from(n.values()).sort((r,o)=>o.points!==r.points?o.points-r.points:o.goalDifference!==r.goalDifference?o.goalDifference-r.goalDifference:o.goalsFor!==r.goalsFor?o.goalsFor-r.goalsFor:a.findIndex(l=>l.id===r.clubId)-a.findIndex(l=>l.id===o.clubId))}function ma(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,40)}function Nt(e,t){return t?e.standings[t]??[]:[]}function Xe(e,t){var a;return((a=e.clubs.find(n=>n.id===t))==null?void 0:a.shortName)??"Unknown"}function Ae(e,t,a){return Math.max(t,Math.min(a,e))}function Qe(e){return e.season*1e3+e.week*10+e.day}function ha(e){return new Intl.NumberFormat("en-GB",{notation:"compact",compactDisplay:"short"}).format(e)}function Ct(e){return`Season ${e.season} • Week ${e.week+1} • Day ${e.day+1}`}function ga(e){const t=ra(e);return Ot(xt((a,n)=>({world:t,lastSummary:null,advanceDay:()=>{const s=Ye(n().world);return a(r=>{r.lastSummary=s}),s},advanceDays:s=>{let r={matches:[],messages:[]};for(let o=0;o<s;o+=1)r=Ye(n().world);return a(o=>{o.lastSummary=r}),r},runFixture:s=>{const r=oa(n().world,s);return r?(a(o=>{o.lastSummary={matches:[r],messages:[`${Ct(o.world.date)}: ${r.score.home}-${r.score.away}`]}}),{matchId:r.id,message:"Match simulated successfully."}):{matchId:null,message:"Fixture could not be simulated."}},placeBid:s=>{const r=ia(n().world,s);return a(o=>{o.lastSummary={matches:[],messages:[r]}}),r},buildCustomClub:s=>{const r=ca(n().world,s);return a(o=>{o.lastSummary={matches:[],messages:[r.message]}}),r},setUserClub:s=>{a(r=>{r.world.userClubId=s;const o=r.world.clubs.find(l=>l.id===s);r.world.userLeagueId=(o==null?void 0:o.leagueId)??null})}})))}class pa{constructor(t){this.listeners=new Set,this.store=ga(t)}get snapshot(){return this.store.getState().world}dispatch(t){var n;const a=this.store.getState();switch(t.type){case"ADVANCE_DAY":{const s=a.advanceDay();return this.notify(),s}case"ADVANCE_DAYS":{const s=((n=t.payload)==null?void 0:n.days)??7,r=a.advanceDays(s);return this.notify(),r}case"SIMULATE_FIXTURE":{const s=a.runFixture(t.payload);return this.notify(),s}case"MAKE_TRANSFER_BID":{const s=a.placeBid(t.payload);return this.notify(),s}case"CREATE_CUSTOM_CLUB":{const s=a.buildCustomClub(t.payload);return this.notify(),s}case"SET_USER_CLUB":return a.setUserClub(t.payload.clubId),this.notify(),null;default:return null}}subscribe(t){const a=this.store.subscribe(()=>{t()});return this.listeners.add(t),()=>{this.listeners.delete(t),a()}}notify(){this.listeners.forEach(t=>t())}}function ya(){const e=Date.now();return{s1:e&4294967295,s2:e>>32&4294967295}}function ba(e){if(!e)return;const t=e.getContext("2d");if(!t)return;const{width:a,height:n}=e;t.fillStyle="#0b5d23",t.fillRect(0,0,a,n),t.strokeStyle="#ffffff",t.lineWidth=2,t.strokeRect(20,20,a-40,n-40),t.beginPath(),t.moveTo(a/2,20),t.lineTo(a/2,n-20),t.stroke(),t.beginPath(),t.arc(a/2,n/2,60,0,Math.PI*2),t.stroke(),et(t,20,n/2-70,80,140),et(t,a-100,n/2-70,80,140),t.beginPath(),t.arc(60,n/2,12,0,Math.PI*2),t.stroke(),t.beginPath(),t.arc(a-60,n/2,12,0,Math.PI*2),t.stroke()}function et(e,t,a,n,s){e.strokeRect(t,a,n,s),e.strokeRect(t,a+30,n,s-60)}function tt(e){return`Season ${e.season} • Week ${e.week+1} • Day ${e.day+1}`}function va(e){if(e.userClubId)return e.fixtures.find(t=>!t.played&&(t.homeId===e.userClubId||t.awayId===e.userClubId))}function Na(e){var u;const t=va(e),a=e.inbox.slice(0,4),n=e.results.slice(0,4),s=e.clubs.find(f=>f.id===e.userClubId);if(!s)return`
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
    `;const r=e.leagues.find(f=>f.id===s.leagueId),o=new Map(e.fixtures.map(f=>[f.id,f])),l=pt(e,e.userClubId).slice(0,3).map(f=>({id:f.id,home:f.homeId===e.userClubId,opponentId:f.homeId===e.userClubId?f.awayId:f.homeId,date:f.date})),c=s.leagueId??e.userLeagueId??((u=e.leagues[0])==null?void 0:u.id)??null,d=Nt(e,c).slice(0,6);return`
    <section class="card hero">
      <div class="hero-text">
        <span class="eyebrow">Today</span>
        <h2>${(s==null?void 0:s.name)??"HTML5 Football Manager"}</h2>
        <p>${tt(e.date)}</p>
        <div class="hero-meta">
          ${r?`<span class="pill">${r.name}</span>`:""}
          <span class="pill">${e.clubs.length} clubs</span>
          <span class="pill">${e.players.length} players</span>
        </div>
      </div>
      <div class="hero-stats">
        ${ge("Form",Sa(e.results,o,(s==null?void 0:s.id)??""))}
        ${ge("Goal Difference",Ma(e.results,o,(s==null?void 0:s.id)??""))}
        ${ge("Matches Played",`${La(e.results,o,(s==null?void 0:s.id)??"")}`)}
      </div>
    </section>
    <section class="card fixture-card">
      <div class="section-heading">
        <span class="eyebrow">Next Fixture</span>
        <h2>On the horizon</h2>
      </div>
      ${t?Ba(e,t):'<p class="empty">No upcoming fixtures scheduled.</p>'}
    </section>
    <section class="card results-card">
      <div class="section-heading">
        <span class="eyebrow">Recent Results</span>
        <h2>Match log</h2>
      </div>
      ${n.length?Aa(e,n,o):'<p class="empty">No matches played yet.</p>'}
    </section>
    <section class="card">
      <div class="section-heading">
        <span class="eyebrow">Form guide</span>
        <h2>Upcoming</h2>
      </div>
      ${l.length?`<ul class="fixtures-list">${l.map(f=>`<li><span class="badge">${f.home?"Home":"Away"}</span><strong>${Ra(e,f.opponentId)}</strong><span>${tt(f.date)}</span></li>`).join("")}</ul>`:'<p class="empty">Your schedule is clear.</p>'}
    </section>
    <section class="card">
      <div class="section-heading">
        <span class="eyebrow">Standings</span>
        <h2>Top six</h2>
      </div>
      ${Ca(e,d)}
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
  `}function Ca(e,t){return t.length?`
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
        ${t.map((a,n)=>{const s=e.clubs.find(r=>r.id===a.clubId);return`
              <tr>
                <td>${n+1}</td>
                <td>${(s==null?void 0:s.shortName)??a.clubId}</td>
                <td>${a.points}</td>
                <td>${a.goalDifference}</td>
              </tr>
            `}).join("")}
      </tbody>
    </table>
  `:'<p class="empty">No table data yet.</p>'}function Ra(e,t){var a;return((a=e.clubs.find(n=>n.id===t))==null?void 0:a.shortName)??t}function ge(e,t){return`
    <div class="hero-metric">
      <span>${e}</span>
      <strong>${t}</strong>
    </div>
  `}function Ba(e,t){const a=e.clubs.find(s=>s.id===t.homeId),n=e.clubs.find(s=>s.id===t.awayId);return`
    <div class="fixture">
      <div class="club home">
        <span class="badge">Home</span>
        <h3>${(a==null?void 0:a.name)??"Unknown"}</h3>
      </div>
      <div class="vs">VS</div>
      <div class="club away">
        <span class="badge">Away</span>
        <h3>${(n==null?void 0:n.name)??"Unknown"}</h3>
      </div>
    </div>
  `}function Aa(e,t,a){return`
    <ul class="results-list">
      ${t.map(n=>{var l,c;const s=a.get(n.fixtureId)??e.fixtures.find(d=>d.id===n.fixtureId),r=((l=e.clubs.find(d=>d.id===(s==null?void 0:s.homeId)))==null?void 0:l.shortName)??"Home",o=((c=e.clubs.find(d=>d.id===(s==null?void 0:s.awayId)))==null?void 0:c.shortName)??"Away";return`
            <li>
              <div class="result-match">
                <strong>${r}</strong>
                <span class="score-pill">${n.score.home} - ${n.score.away}</span>
                <strong>${o}</strong>
              </div>
            </li>
          `}).join("")}
    </ul>
  `}function Sa(e,t,a){return a&&e.filter(s=>Rt(t,s,a)).slice(0,5).map(s=>{const r=t.get(s.fixtureId);if(!r)return"-";const o=r.homeId===a,l=o?s.score.home:s.score.away,c=o?s.score.away:s.score.home;return l===c?"D":l>c?"W":"L"}).join(" ")||"-"}function Ma(e,t,a){if(!a)return"0";const n=e.reduce((s,r)=>{const o=t.get(r.fixtureId);if(!o||o.homeId!==a&&o.awayId!==a)return s;const l=o.homeId===a,c=l?r.score.home:r.score.away,d=l?r.score.away:r.score.home;return s+(c-d)},0);return n>=0?`+${n}`:`${n}`}function La(e,t,a){return a?e.filter(n=>Rt(t,n,a)).length:0}function Rt(e,t,a){const n=e.get(t.fixtureId);return n?n.homeId===a||n.awayId===a:!1}function ka(e){if(!e.userClubId)return'<section class="card"><p class="empty">Select a club to view matchday reports.</p></section>';const t=e.results[0],a=pt(e,e.userClubId);return`
    <section class="card match-card">
      <div class="section-heading">
        <span class="eyebrow">Last Result</span>
        <h2>Full-time report</h2>
      </div>
      ${t?Ia(e,t):'<p class="empty">No matches played yet.</p>'}
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
                  ${a.map(n=>`<option value="${n.id}">${n.homeId===e.userClubId?"vs "+nt(e,n.awayId):"at "+nt(e,n.homeId)}</option>`).join("")}
                </select>
                <button type="submit" class="primary">Simulate</button>
              </div>
            </form>`:'<p class="empty">No fixtures remain to simulate.</p>'}
    </section>
  `}function Ea(e,t){const a=e.querySelector("#manual-sim-form");a&&a.addEventListener("submit",n=>{n.preventDefault();const s=a.querySelector("#manual-sim-select");if(!s||!s.value){t.notify("Select a fixture to simulate.");return}const r=t.simulateFixture(s.value);t.handleResult(r)})}function Ia(e,t){const a=e.fixtures.find(l=>l.id===t.fixtureId),n=e.clubs.find(l=>l.id===(a==null?void 0:a.homeId)),s=e.clubs.find(l=>l.id===(a==null?void 0:a.awayId)),r=t.stats.find(l=>l.clubId===(a==null?void 0:a.homeId)),o=t.stats.find(l=>l.clubId===(a==null?void 0:a.awayId));return`
    ${wa((n==null?void 0:n.name)??"Home",(s==null?void 0:s.name)??"Away",t.score.home,t.score.away)}
    <div class="match-stats">
      ${pe("Shots",(r==null?void 0:r.shots)??0,(o==null?void 0:o.shots)??0)}
      ${pe("On Target",(r==null?void 0:r.shotsOnTarget)??0,(o==null?void 0:o.shotsOnTarget)??0)}
      ${pe("Possession",at(r==null?void 0:r.possession),at(o==null?void 0:o.possession))}
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
  `}function wa(e,t,a,n){return`
    <div class="scoreboard">
      <div class="team">
        <span class="team-name">${e}</span>
        <span class="team-score">${a}</span>
      </div>
      <div class="score-divider">vs</div>
      <div class="team">
        <span class="team-name">${t}</span>
        <span class="team-score">${n}</span>
      </div>
    </div>
  `}function pe(e,t,a){return`
    <div class="match-stat">
      <span class="label">${e}</span>
      <div class="values">
        <span>${t}</span>
        <span>${a}</span>
      </div>
    </div>
  `}function at(e){return e!==void 0?`${e.toFixed(0)}%`:"-"}function nt(e,t){var a;return((a=e.clubs.find(n=>n.id===t))==null?void 0:a.shortName)??"Unknown"}function Pa(e){const t=e.clubs.find(n=>n.id===e.userClubId);if(!t)return'<section class="card"><p>No club selected.</p></section>';const a=t.roster.map(n=>e.players.find(s=>s.id===n)).filter(n=>!!n).sort((n,s)=>s.currentAbility-n.currentAbility);return`
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
          ${a.map(n=>{const s=n.nationality;return`
                <tr>
                  <td>
                    <div class="player-cell">
                      <span class="avatar">${n.name.slice(0,1)}</span>
                      <div>
                        <strong>${n.name}</strong>
                        ${s?`<small>${s}</small>`:""}
                      </div>
                    </div>
                  </td>
                  <td>${n.positions.map(r=>`<span class="pill muted">${r}</span>`).join(" ")}</td>
                  <td>${n.age.toFixed(0)}</td>
                  <td><span class="stat-badge">${n.currentAbility}</span></td>
                  <td>
                    <div class="meter" style="--value:${Math.round(n.morale)}"></div>
                    <small>${Math.round(n.morale)}</small>
                  </td>
                  <td>
                    <div class="meter positive" style="--value:${Math.round(n.condition)}"></div>
                    <small>${Math.round(n.condition)}%</small>
                  </td>
                  <td>£${st(n.wage)}/wk</td>
                  <td>£${st(n.value)}</td>
                  <td>${n.contractExpirySeason}</td>
                </tr>
              `}).join("")}
        </tbody>
      </table>
    </section>
  `}function st(e){return new Intl.NumberFormat("en-GB",{maximumFractionDigits:0}).format(e)}function Fa(e){const t=e.clubs.find(n=>n.id===e.userClubId);return t?`
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
            ${["4-4-2","4-3-3","3-5-2","4-2-3-1"].map(n=>`<option value="${n}" ${n===t.tactics.formation?"selected":""}>${n}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="control">
        <span class="eyebrow">Mentality</span>
        <div class="field">
          <select id="mentality-select" disabled>
            ${["Cautious","Balanced","Positive"].map(n=>`<option value="${n}" ${n===t.tactics.mentality?"selected":""}>${n}</option>`).join("")}
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
  `:'<section class="card"><p>No tactics available.</p></section>'}function $a(e){const t=e.clubs.find(s=>s.id===e.userClubId);if(!t)return'<section class="card"><p class="empty">Select a club to manage transfers.</p></section>';const a=e.transferListings.filter(s=>s.status!=="Completed"),n=e.transferHistory.slice(0,6);return`
    <section class="card">
      <div class="section-heading">
        <span class="eyebrow">Budgets</span>
        <h2>Financial outlook</h2>
      </div>
      <div class="budget-grid">
        <div class="budget-tile">
          <span>Transfer budget</span>
          <strong>£${x(t.transferBudget)}</strong>
        </div>
        <div class="budget-tile">
          <span>Wage budget</span>
          <strong>£${x(t.wageBudget)}/wk</strong>
        </div>
        <div class="budget-tile">
          <span>Committed wages</span>
          <strong>£${x(t.wageCommitment)}/wk</strong>
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
                ${a.map(s=>Ga(e,s)).join("")}
              </tbody>
            </table>`:'<p class="empty">No players are currently available.</p>'}
    </section>
    <section class="card">
      <div class="section-heading">
        <span class="eyebrow">Recent activity</span>
        <h2>Completed deals</h2>
      </div>
      ${n.length?`<ul class="timeline">${n.map(s=>{const r=e.players.find(c=>c.id===s.playerId),o=e.clubs.find(c=>c.id===s.fromClubId),l=e.clubs.find(c=>c.id===s.toClubId);return`<li><span class="minute">£${x(s.fee)}</span><span>${(r==null?void 0:r.name)??"Player"} → ${(l==null?void 0:l.shortName)??"???"} (${(o==null?void 0:o.shortName)??"???"})</span></li>`}).join("")}</ul>`:'<p class="empty">No recent transfers.</p>'}
    </section>
  `}function Ta(e,t){e.querySelectorAll("[data-transfer-action]").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.playerId,s=a.dataset.inputId;if(!n||!s)return;const r=e.querySelector(`#${s}`);if(!r)return;const o=Number.parseInt(r.value.replace(/[^0-9]/g,""),10);if(!Number.isFinite(o)||o<=0){t.notify("Enter a valid offer amount.");return}const l=t.makeTransferBid(n,o);t.notify(l)})})}function Ga(e,t){const a=e.players.find(r=>r.id===t.playerId),n=e.clubs.find(r=>r.id===t.fromClubId),s=`offer-${t.playerId}`;return`
    <tr>
      <td>
        <div class="player-cell">
          <strong>${(a==null?void 0:a.name)??"Unknown"}</strong>
          <span>${(a==null?void 0:a.positions.join(", "))??""}</span>
        </div>
      </td>
      <td>${(n==null?void 0:n.shortName)??"-"}</td>
      <td>£${x((a==null?void 0:a.value)??0)}</td>
      <td>£${x(t.askingPrice)}</td>
      <td>
        <div class="input-row">
          <input id="${s}" type="number" min="100000" step="500000" value="${t.askingPrice}" />
          <button type="button" class="primary" data-transfer-action data-player-id="${t.playerId}" data-input-id="${s}">
            Submit bid
          </button>
        </div>
      </td>
    </tr>
  `}function x(e){return new Intl.NumberFormat("en-GB",{maximumFractionDigits:0}).format(e)}function Va(e,t){const a=[...e.leagues].sort((o,l)=>o.level-l.level||o.name.localeCompare(l.name)),n=a.find(o=>o.id===t)??a[0];if(!n)return'<section class="card"><p class="empty">No league data available.</p></section>';const s=Nt(e,n.id),r=`${e.leagues.length} competitions across ${new Set(e.leagues.map(o=>o.nation)).size} nations`;return`
    <section class="card">
      <div class="section-heading">
        <span class="eyebrow">Competition</span>
        <h2>${n.name}</h2>
      </div>
      <div class="toolbar">
        <label for="standings-league" class="muted-text">League</label>
        <select id="standings-league">
          ${a.map(o=>`<option value="${o.id}" ${o.id===n.id?"selected":""}>${o.name} (Tier ${o.level}, ${o.nation})</option>`).join("")}
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
          ${Da(e,s)}
        </tbody>
      </table>
    </section>
  `}function Da(e,t){return t.map((a,n)=>{const s=e.clubs.find(o=>o.id===a.clubId);return`
        <tr class="${a.clubId===e.userClubId?"highlight":""}">
          <td>${n+1}</td>
          <td>${(s==null?void 0:s.name)??a.clubId}</td>
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
      `}).join("")}function _a(e,t){const a=e.querySelector("#standings-league");a&&a.addEventListener("change",()=>{t.onLeagueChange(a.value)})}const Bt="hfm-theme";function xa(){try{const e=window.localStorage.getItem(Bt);if(e==="light"||e==="dark")return e}catch{}return null}function Wa(){return window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function Oa(e){try{window.localStorage.setItem(Bt,e)}catch{}}let j=null,rt=!1;const Ee=document.getElementById("app"),At=xa();let Ie=At!==null,we=At??Wa(),F=null,Q=null;function E(){if(!j)throw new Error("Game store has not been initialized");return j}const U=document.createElement("button");U.type="button";U.classList.add("ghost");function Pe(e,t=!0){we=e,document.documentElement.dataset.theme=e,U.textContent=e==="dark"?"☀️ Light":"🌙 Dark",U.setAttribute("aria-label",e==="dark"?"Switch to light mode":"Switch to dark mode"),t&&Oa(e)}Pe(we,Ie);const za=window.matchMedia("(prefers-color-scheme: dark)");za.addEventListener("change",e=>{Ie||Pe(e.matches?"dark":"light",!1)});if(!Ee)throw new Error("App container not found");Ee.className="shell";const Fe=document.createElement("header");Fe.className="topbar glass";const Y=document.createElement("aside");Y.className="sidebar glass";const G=document.createElement("main");G.className="content";const $e=document.createElement("div");$e.className="title-group";const W=document.createElement("h1");W.className="page-title";const V=document.createElement("p");V.className="page-subtitle";const Te=document.createElement("div");Te.className="controls";U.addEventListener("click",()=>{Ie=!0,Pe(we==="dark"?"light":"dark")});const Z=document.createElement("button");Z.textContent="Advance Day";Z.className="primary";Z.addEventListener("click",()=>{const e=E().dispatch({type:"ADVANCE_DAY"});ue(e)});const ce=document.createElement("button");ce.textContent="Advance 7 Days";ce.addEventListener("click",()=>{const e=E().dispatch({type:"ADVANCE_DAYS",payload:{days:7}});ue(e)});Te.append(U,Z,ce);function St(e){Z.disabled=!e,ce.disabled=!e}const Ge=document.createElement("div");Ge.className="brand";Ge.innerHTML='<span class="brand-mark">⚽</span><span class="brand-text">Manager</span>';Y.append(Ge);const Ua={simulateFixture:e=>E().dispatch({type:"SIMULATE_FIXTURE",payload:{fixtureId:e}}),makeTransferBid:(e,t)=>{const a=E(),n=a.snapshot.userClubId;return n?a.dispatch({type:"MAKE_TRANSFER_BID",payload:{playerId:e,buyingClubId:n,offer:t}}):"Choose a club before making transfer bids."},handleResult:e=>ue(e),notify:$},Mt={dashboard:{render:Na},squad:{render:Pa},tactics:{render:Fa},match:{render:ka,bind:Ea},standings:{render:e=>{var t;return(!F||!e.leagues.some(a=>a.id===F))&&(F=e.userLeagueId??((t=e.leagues[0])==null?void 0:t.id)??null),Va(e,F)},bind:e=>{_a(e,{onLeagueChange:t=>{F=t,ne()}})}},transfers:{render:$a,bind:Ta}};let J="dashboard";Object.entries(Mt).forEach(([e])=>{const t=document.createElement("button");t.textContent=e.charAt(0).toUpperCase()+e.slice(1),t.dataset.view=e,e===J&&t.classList.add("active"),t.addEventListener("click",()=>{J=e,Ka(),ne()}),Y.append(t)});$e.append(W,V);Fe.append($e,Te);const de=document.createElement("div");de.className="workspace";de.append(G);Ee.append(Y,Fe,de);function ne(){if(!j){W.textContent="Loading world",V.textContent="Preparing squads and fixtures...",G.innerHTML='<section class="card"><p class="empty">Generating the global league world…</p></section>';return}const e=j.snapshot,t=e.clubs.find(n=>n.id===e.userClubId);St(!!e.userClubId),t?(W.textContent=t.name,V.textContent=Ct(e.date)):(W.textContent="Choose your club",V.textContent="Select a team to begin your journey.");const a=Mt[J];G.innerHTML=a.render(e),J==="tactics"&&ba(document.getElementById("tactics-pitch")),a.bind&&a.bind(G,Ua)}function Ka(){Y.querySelectorAll("button").forEach(e=>{const t=e.dataset.view;t&&e.classList.toggle("active",t===J)})}const Ve=document.createElement("aside");Ve.className="panel glass";Ve.innerHTML='<div class="panel-header"><span class="badge info">Digest</span><h2>Daily Summary</h2></div><div id="notifications" class="panel-body"><p>No messages yet.</p></div>';de.append(Ve);function $(e){const t=document.getElementById("notifications");if(!t)return;const a=t.querySelector("ul")??document.createElement("ul");a.parentElement||(t.innerHTML="",t.appendChild(a));const n=document.createElement("li");n.textContent=e,a.prepend(n)}function ue(e){if(e){if(typeof e=="string"){$(e);return}Array.isArray(e.messages)?e.messages.forEach(t=>$(t)):typeof e.message=="string"&&$(e.message)}}function Se(){if(!rt){rt=!0;for(let e=0;e<3;e+=1){const t=E().dispatch({type:"ADVANCE_DAY"});ue(t)}}}function Ha(){const e=document.createElement("div");e.className="modal-backdrop hidden",e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true");const t=document.createElement("div");t.className="modal glass";const a=document.createElement("div");a.className="section-heading",a.innerHTML='<span class="eyebrow">Career setup</span><h2>Select your club</h2>';const n=document.createElement("p");n.className="muted-text",n.textContent="Choose a club to manage. This choice is locked for the current session.";const s=document.createElement("div");s.className="league-list";const r=document.createElement("div");r.className="club-grid";const o=document.createElement("div");o.className="custom-club-panel hidden",o.innerHTML=`
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
  `;const l=document.createElement("div");l.className="modal-footer";const c=document.createElement("button");c.type="button",c.className="primary",c.textContent="Confirm club",c.disabled=!0,l.append(c),t.append(a,n,s,r,l,o),e.append(t),document.body.appendChild(e);let d=null,u=null;const f=o.querySelector("form"),g=f.querySelector('select[name="league"]'),b=f.querySelector('button[data-action="cancel"]');function S(){var p;const v=E().snapshot,m=[...v.leagues].sort((N,h)=>N.level-h.level||N.name.localeCompare(h.name));(!d||!m.some(N=>N.id===d))&&(d=v.userLeagueId??((p=m[0])==null?void 0:p.id)??null),s.innerHTML="",m.forEach(N=>{const h=document.createElement("button");h.type="button",h.textContent=`${N.name} (L${N.level})`,h.className="league-option",N.id===d&&h.classList.add("active"),h.addEventListener("click",()=>{d=N.id,S(),L()}),s.append(h)}),w(m)}function L(){const v=E().snapshot;if(r.innerHTML="",c.disabled=!u,!d){r.innerHTML='<p class="empty">No leagues available.</p>';return}const m=v.clubs.filter(h=>h.leagueId===d).sort((h,A)=>h.name.localeCompare(A.name)),p=v.leagues.find(h=>h.id===d);m.forEach(h=>{const A=document.createElement("button");A.type="button",A.className="club-card",h.id===u&&A.classList.add("active");const Lt=p?`Level ${p.level}`:"League";A.innerHTML=`
        <div class="club-card-header">
          <span class="badge">${Lt}</span>
          <strong>${h.name}</strong>
        </div>
        <div class="club-meta">
          <span>Rep ${h.rep}</span>
          <span>£${ot(h.marketValue)} value</span>
          <span>£${ot(h.wageBudget)}/wk wages</span>
        </div>
      `,A.addEventListener("click",()=>{u=h.id,d=h.leagueId,S(),L(),c.disabled=!1}),r.append(A)});const N=document.createElement("button");N.type="button",N.className="club-card create",N.innerHTML=`
      <div class="club-card-header">
        <span class="badge info">Custom</span>
        <strong>Create your own club</strong>
      </div>
      <div class="club-meta">
        <span>Design colours & crest</span>
        <span>Pick any league</span>
        <span>Tailor ambition</span>
      </div>
    `,N.addEventListener("click",()=>{R()}),r.append(N)}c.addEventListener("click",()=>{if(!u){$("Select a club to continue.");return}const v=E();v.dispatch({type:"SET_USER_CLUB",payload:{clubId:u}}),F=v.snapshot.userLeagueId??F;const p=v.snapshot.clubs.find(N=>N.id===u);$(`You are now in charge of ${(p==null?void 0:p.name)??"your club"}.`),P(),Se()}),f.addEventListener("submit",v=>{v.preventDefault();const m=new FormData(f),p=m.get("league")||d;if(!p){$("Choose a league for your new club.");return}const N={leagueId:p,name:String(m.get("name")||"").trim(),shortName:String(m.get("short")||"").trim(),primaryColor:String(m.get("primary")||"#113399"),secondaryColor:String(m.get("secondary")||"#f5f5f5"),mentality:m.get("mentality"),formation:String(m.get("formation")||"4-3-3"),profile:m.get("profile")??"academy"},h=E(),A=h.dispatch({type:"CREATE_CUSTOM_CLUB",payload:N});if(!A.success||!A.clubId){$(A.message);return}h.dispatch({type:"SET_USER_CLUB",payload:{clubId:A.clubId}}),F=h.snapshot.userLeagueId??F,$(A.message),k(),P(),Se()}),b.addEventListener("click",()=>{k()});function y(){var p;const v=E().snapshot;u=v.userClubId;const m=[...v.leagues].sort((N,h)=>N.level-h.level||N.name.localeCompare(h.name));d=v.userLeagueId??((p=m[0])==null?void 0:p.id)??null,S(),L(),c.disabled=!u,k(),e.classList.remove("hidden")}function P(){e.classList.add("hidden")}function R(){var v;t.classList.add("custom-mode"),o.classList.remove("hidden"),s.classList.add("hidden"),r.classList.add("hidden"),l.classList.add("hidden"),d&&(g.value=d),(v=f.querySelector('input[name="name"]'))==null||v.focus()}function k(){t.classList.remove("custom-mode"),o.classList.add("hidden"),s.classList.remove("hidden"),r.classList.remove("hidden"),l.classList.remove("hidden"),f.reset(),w([...E().snapshot.leagues])}function w(v){g.innerHTML="",v.slice().sort((m,p)=>m.level-p.level||m.name.localeCompare(p.name)).forEach(m=>{const p=document.createElement("option");p.value=m.id,p.textContent=`${m.name} (L${m.level})`,g.append(p)}),d&&(g.value=d)}return{open:y,close:P}}function ot(e){return new Intl.NumberFormat("en-GB",{maximumFractionDigits:0}).format(e)}function ja(){St(!1),W.textContent="Loading world",V.textContent="Creating leagues, clubs, and players...",G.innerHTML='<section class="card"><p class="empty">Building data packs. Please wait…</p></section>',window.setTimeout(()=>{try{j=new pa(ya());const e=E();Q=Ha(),e.subscribe(ne),ne(),e.snapshot.userClubId?Se():Q==null||Q.open()}catch(e){console.error("Failed to initialize the game store",e),G.innerHTML='<section class="card"><p class="empty">Failed to load the world data. Refresh to try again.</p></section>',V.textContent="Initialization failed"}})}ja();
