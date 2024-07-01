import{a as L}from"./chunk-HQLU3KB5.js";import{a as le}from"./chunk-IGLFARZE.js";import{a as nt,b as ce,c as it,d as ae,g as ue,h as pe}from"./chunk-SPCOMQNX.js";import{a as re}from"./chunk-GPDQWZDE.js";import{b as qt,f as tt,g as B,h as Qt,l as te,m as ee,n as et,o as ne,p as ie,q as oe,w as se}from"./chunk-7FJ4ADOC.js";import{a as H}from"./chunk-XALUFRDR.js";import{Bb as Wt,Cb as Jt,Ec as Yt,I as Ct,J as wt,K as Rt,L as k,M as F,N as kt,Na as zt,P as b,Q as jt,R as P,S,T as z,U as Dt,V as Mt,Z as Nt,Za as _t,a as D,aa as Pt,b as M,ba as Lt,bb as Bt,db as Ht,eb as Gt,fb as Zt,g as J,gb as Vt,ha as $t,j as yt,k as It,l as N,m as vt,n as Y,na as Ut,nb as Kt,o as q,ob as _,p as Tt,q as A,qb as Xt,t as Q,u as R,v as C,w as At,x as Ot,y as bt,za as Ft}from"./chunk-OWV6CK4N.js";var fe=[{path:"login",loadComponent:()=>import("./chunk-2D623ZMH.js").then(e=>e.LoginComponent)},{path:"register",loadComponent:()=>import("./chunk-HCXBZBTD.js").then(e=>e.RegisterComponent)},{path:"",loadChildren:()=>import("./chunk-GI3NIQIV.js").then(e=>e.START_ROUTES)}];var U="PERFORM_ACTION",He="REFRESH",ye="RESET",Ie="ROLLBACK",ve="COMMIT",Te="SWEEP",Ae="TOGGLE_ACTION",Oe="SET_ACTIONS_ACTIVE",be="JUMP_TO_STATE",Ce="JUMP_TO_ACTION",St="IMPORT_STATE",we="LOCK_CHANGES",Re="PAUSE_RECORDING",j=class{constructor(t,o){if(this.action=t,this.timestamp=o,this.type=U,typeof t.type>"u")throw new Error('Actions may not have an undefined "type" property. Have you misspelled a constant?')}},ot=class{constructor(){this.type=He}},st=class{constructor(t){this.timestamp=t,this.type=ye}},rt=class{constructor(t){this.timestamp=t,this.type=Ie}},ct=class{constructor(t){this.timestamp=t,this.type=ve}},at=class{constructor(){this.type=Te}},ut=class{constructor(t){this.id=t,this.type=Ae}},he=class{constructor(t,o,n=!0){this.start=t,this.end=o,this.active=n,this.type=Oe}},pt=class{constructor(t){this.index=t,this.type=be}},lt=class{constructor(t){this.actionId=t,this.type=Ce}},ft=class{constructor(t){this.nextLiftedState=t,this.type=St}},ht=class{constructor(t){this.status=t,this.type=we}},dt=class{constructor(t){this.status=t,this.type=Re}},de=class{constructor(){this.maxAge=!1}},K=new P("@ngrx/store-devtools Options"),me=new P("@ngrx/store-devtools Initial Config");function ke(){return null}var Ge="NgRx Store DevTools";function Ze(e){let t={maxAge:!1,monitor:ke,actionSanitizer:void 0,stateSanitizer:void 0,name:Ge,serialize:!1,logOnly:!1,autoPause:!1,trace:!1,traceLimit:75,features:{pause:!0,lock:!0,persist:!0,export:!0,import:"custom",jump:!0,skip:!0,reorder:!0,dispatch:!0,test:!0},connectInZone:!1},o=typeof e=="function"?e():e,n=o.logOnly?{pause:!0,export:!0,test:!0}:!1,i=o.features||n||t.features;i.import===!0&&(i.import="custom");let c=Object.assign({},t,{features:i},o);if(c.maxAge&&c.maxAge<2)throw new Error(`Devtools 'maxAge' cannot be less than 2, got ${c.maxAge}`);return c}function ge(e,t){return e.filter(o=>t.indexOf(o)<0)}function je(e){let{computedStates:t,currentStateIndex:o}=e;if(o>=t.length){let{state:i}=t[t.length-1];return i}let{state:n}=t[o];return n}function dn(e){return e.actionsById[e.nextActionId-1]}function $(e){return new j(e,+Date.now())}function Ve(e,t){return Object.keys(t).reduce((o,n)=>{let i=Number(n);return o[i]=De(e,t[i],i),o},{})}function De(e,t,o){return M(D({},t),{action:e(t.action,o)})}function Ke(e,t){return t.map((o,n)=>({state:Me(e,o.state,n),error:o.error}))}function Me(e,t,o){return e(t,o)}function Ne(e){return e.predicate||e.actionsSafelist||e.actionsBlocklist}function Xe(e,t,o,n){let i=[],c={},d=[];return e.stagedActionIds.forEach((r,g)=>{let u=e.actionsById[r];u&&(g&&Et(e.computedStates[g],u,t,o,n)||(c[r]=u,i.push(r),d.push(e.computedStates[g])))}),M(D({},e),{stagedActionIds:i,actionsById:c,computedStates:d})}function Et(e,t,o,n,i){let c=o&&!o(e,t.action),d=n&&!t.action.type.match(n.map(g=>Se(g)).join("|")),r=i&&t.action.type.match(i.map(g=>Se(g)).join("|"));return c||d||r}function Se(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function Pe(e){return{ngZone:e?z(Ut):null,connectInZone:e}}var X=(()=>{let t=class t extends B{};t.\u0275fac=(()=>{let n;return function(c){return(n||(n=Nt(t)))(c||t)}})(),t.\u0275prov=b({token:t,factory:t.\u0275fac});let e=t;return e})(),G={START:"START",DISPATCH:"DISPATCH",STOP:"STOP",ACTION:"ACTION"},mt=new P("@ngrx/store-devtools Redux Devtools Extension"),Le=(()=>{let _DevtoolsExtension=class _DevtoolsExtension{constructor(e,t,o){this.config=t,this.dispatcher=o,this.zoneConfig=Pe(this.config.connectInZone),this.devtoolsExtension=e,this.createActionStreams()}notify(e,t){if(this.devtoolsExtension)if(e.type===U){if(t.isLocked||t.isPaused)return;let o=je(t);if(Ne(this.config)&&Et(o,e,this.config.predicate,this.config.actionsSafelist,this.config.actionsBlocklist))return;let n=this.config.stateSanitizer?Me(this.config.stateSanitizer,o,t.currentStateIndex):o,i=this.config.actionSanitizer?De(this.config.actionSanitizer,e,t.nextActionId):e;this.sendToReduxDevtools(()=>this.extensionConnection.send(i,n))}else{let o=M(D({},t),{stagedActionIds:t.stagedActionIds,actionsById:this.config.actionSanitizer?Ve(this.config.actionSanitizer,t.actionsById):t.actionsById,computedStates:this.config.stateSanitizer?Ke(this.config.stateSanitizer,t.computedStates):t.computedStates});this.sendToReduxDevtools(()=>this.devtoolsExtension.send(null,o,this.getExtensionConfig(this.config)))}}createChangesObservable(){return this.devtoolsExtension?new J(e=>{let t=this.zoneConfig.connectInZone?this.zoneConfig.ngZone.runOutsideAngular(()=>this.devtoolsExtension.connect(this.getExtensionConfig(this.config))):this.devtoolsExtension.connect(this.getExtensionConfig(this.config));return this.extensionConnection=t,t.init(),t.subscribe(o=>e.next(o)),t.unsubscribe}):N}createActionStreams(){let e=this.createChangesObservable().pipe(wt()),t=e.pipe(R(r=>r.type===G.START)),o=e.pipe(R(r=>r.type===G.STOP)),n=e.pipe(R(r=>r.type===G.DISPATCH),A(r=>this.unwrapAction(r.payload)),At(r=>r.type===St?this.dispatcher.pipe(R(g=>g.type===et),Tt(1e3),Ot(1e3),A(()=>r),C(()=>Y(r)),bt(1)):Y(r))),c=e.pipe(R(r=>r.type===G.ACTION),A(r=>this.unwrapAction(r.payload))).pipe(F(o)),d=n.pipe(F(o));this.start$=t.pipe(F(o)),this.actions$=this.start$.pipe(k(()=>c)),this.liftedActions$=this.start$.pipe(k(()=>d))}unwrapAction(action){return typeof action=="string"?eval(`(${action})`):action}getExtensionConfig(e){let t={name:e.name,features:e.features,serialize:e.serialize,autoPause:e.autoPause??!1,trace:e.trace??!1,traceLimit:e.traceLimit??75};return e.maxAge!==!1&&(t.maxAge=e.maxAge),t}sendToReduxDevtools(e){try{e()}catch(t){console.warn("@ngrx/store-devtools: something went wrong inside the redux devtools",t)}}};_DevtoolsExtension.\u0275fac=function(t){return new(t||_DevtoolsExtension)(S(mt),S(K),S(X))},_DevtoolsExtension.\u0275prov=b({token:_DevtoolsExtension,factory:_DevtoolsExtension.\u0275fac});let DevtoolsExtension=_DevtoolsExtension;return DevtoolsExtension})(),V={type:tt},We="@ngrx/store-devtools/recompute",Je={type:We};function $e(e,t,o,n,i){if(n)return{state:o,error:"Interrupted by an error up the chain"};let c=o,d;try{c=e(o,t)}catch(r){d=r.toString(),i.handleError(r)}return{state:c,error:d}}function Z(e,t,o,n,i,c,d,r,g){if(t>=e.length&&e.length===c.length)return e;let u=e.slice(0,t),m=c.length-(g?1:0);for(let s=t;s<m;s++){let f=c[s],y=i[f].action,p=u[s-1],a=p?p.state:n,v=p?p.error:void 0,T=d.indexOf(f)>-1?p:$e(o,y,a,v,r);u.push(T)}return g&&u.push(e[e.length-1]),u}function Ye(e,t){return{monitorState:t(void 0,{}),nextActionId:1,actionsById:{0:$(V)},stagedActionIds:[0],skippedActionIds:[],committedState:e,currentStateIndex:0,computedStates:[],isLocked:!1,isPaused:!1}}function qe(e,t,o,n,i={}){return c=>(d,r)=>{let{monitorState:g,actionsById:u,nextActionId:m,stagedActionIds:s,skippedActionIds:f,committedState:y,currentStateIndex:p,computedStates:a,isLocked:v,isPaused:x}=d||t;d||(u=Object.create(u));function T(E){let h=E,O=s.slice(1,h+1);for(let I=0;I<O.length;I++)if(a[I+1].error){h=I,O=s.slice(1,h+1);break}else delete u[O[I]];f=f.filter(I=>O.indexOf(I)===-1),s=[0,...s.slice(h+1)],y=a[h].state,a=a.slice(h),p=p>h?p-h:0}function w(){u={0:$(V)},m=1,s=[0],f=[],y=a[p].state,p=0,a=[]}let l=0;switch(r.type){case we:{v=r.status,l=1/0;break}case Re:{x=r.status,x?(s=[...s,m],u[m]=new j({type:"@ngrx/devtools/pause"},+Date.now()),m++,l=s.length-1,a=a.concat(a[a.length-1]),p===s.length-2&&p++,l=1/0):w();break}case ye:{u={0:$(V)},m=1,s=[0],f=[],y=e,p=0,a=[];break}case ve:{w();break}case Ie:{u={0:$(V)},m=1,s=[0],f=[],p=0,a=[];break}case Ae:{let{id:E}=r;f.indexOf(E)===-1?f=[E,...f]:f=f.filter(O=>O!==E),l=s.indexOf(E);break}case Oe:{let{start:E,end:h,active:O}=r,I=[];for(let W=E;W<h;W++)I.push(W);O?f=ge(f,I):f=[...f,...I],l=s.indexOf(E);break}case be:{p=r.index,l=1/0;break}case Ce:{let E=s.indexOf(r.actionId);E!==-1&&(p=E),l=1/0;break}case Te:{s=ge(s,f),f=[],p=Math.min(p,s.length-1);break}case U:{if(v)return d||t;if(x||d&&Et(d.computedStates[p],r,i.predicate,i.actionsSafelist,i.actionsBlocklist)){let h=a[a.length-1];a=[...a.slice(0,-1),$e(c,r.action,h.state,h.error,o)],l=1/0;break}i.maxAge&&s.length===i.maxAge&&T(1),p===s.length-1&&p++;let E=m++;u[E]=r,s=[...s,E],l=s.length-1;break}case St:{({monitorState:g,actionsById:u,nextActionId:m,stagedActionIds:s,skippedActionIds:f,committedState:y,currentStateIndex:p,computedStates:a,isLocked:v,isPaused:x}=r.nextLiftedState);break}case tt:{l=0,i.maxAge&&s.length>i.maxAge&&(a=Z(a,l,c,y,u,s,f,o,x),T(s.length-i.maxAge),l=1/0);break}case et:{if(a.filter(h=>h.error).length>0)l=0,i.maxAge&&s.length>i.maxAge&&(a=Z(a,l,c,y,u,s,f,o,x),T(s.length-i.maxAge),l=1/0);else{if(!x&&!v){p===s.length-1&&p++;let h=m++;u[h]=new j(r,+Date.now()),s=[...s,h],l=s.length-1,a=Z(a,l,c,y,u,s,f,o,x)}a=a.map(h=>M(D({},h),{state:c(h.state,Je)})),p=s.length-1,i.maxAge&&s.length>i.maxAge&&T(s.length-i.maxAge),l=1/0}break}default:{l=1/0;break}}return a=Z(a,l,c,y,u,s,f,o,x),g=n(g,r),{monitorState:g,actionsById:u,nextActionId:m,stagedActionIds:s,skippedActionIds:f,committedState:y,currentStateIndex:p,computedStates:a,isLocked:v,isPaused:x}}}var Ee=(()=>{let t=class t{constructor(n,i,c,d,r,g,u,m){let s=Ye(u,m.monitor),f=qe(u,s,g,m.monitor,m),y=Q(Q(i.asObservable().pipe(Rt(1)),d.actions$).pipe(A($)),n,d.liftedActions$).pipe(vt(It)),p=c.pipe(A(f)),a=Pe(m.connectInZone),v=new yt(1);this.liftedStateSubscription=y.pipe(kt(p),xe(a),Ct(({state:w},[l,E])=>{let h=E(w,l);return l.type!==U&&Ne(m)&&(h=Xe(h,m.predicate,m.actionsSafelist,m.actionsBlocklist)),d.notify(l,h),{state:h,action:l}},{state:s,action:null})).subscribe(({state:w,action:l})=>{if(v.next(w),l.type===U){let E=l.action;r.next(E)}}),this.extensionStartSubscription=d.start$.pipe(xe(a)).subscribe(()=>{this.refresh()});let x=v.asObservable(),T=x.pipe(A(je));Object.defineProperty(T,"state",{value:qt(T,{manualCleanup:!0,requireSync:!0})}),this.dispatcher=n,this.liftedState=x,this.state=T}ngOnDestroy(){this.liftedStateSubscription.unsubscribe(),this.extensionStartSubscription.unsubscribe()}dispatch(n){this.dispatcher.next(n)}next(n){this.dispatcher.next(n)}error(n){}complete(){}performAction(n){this.dispatch(new j(n,+Date.now()))}refresh(){this.dispatch(new ot)}reset(){this.dispatch(new st(+Date.now()))}rollback(){this.dispatch(new rt(+Date.now()))}commit(){this.dispatch(new ct(+Date.now()))}sweep(){this.dispatch(new at)}toggleAction(n){this.dispatch(new ut(n))}jumpToAction(n){this.dispatch(new lt(n))}jumpToState(n){this.dispatch(new pt(n))}importState(n){this.dispatch(new ft(n))}lockChanges(n){this.dispatch(new ht(n))}pauseRecording(n){this.dispatch(new dt(n))}};t.\u0275fac=function(i){return new(i||t)(S(X),S(B),S(te),S(Le),S(ne),S($t),S(Qt),S(K))},t.\u0275prov=b({token:t,factory:t.\u0275fac});let e=t;return e})();function xe({ngZone:e,connectInZone:t}){return o=>t?new J(n=>o.subscribe({next:i=>e.run(()=>n.next(i)),error:i=>e.run(()=>n.error(i)),complete:()=>e.run(()=>n.complete())})):o}var Qe=new P("@ngrx/store-devtools Is Devtools Extension or Monitor Present");function tn(e,t){return!!e||t.monitor!==ke}function en(){let e="__REDUX_DEVTOOLS_EXTENSION__";return typeof window=="object"&&typeof window[e]<"u"?window[e]:null}function xt(e={}){return Pt([Le,X,Ee,{provide:me,useValue:e},{provide:Qe,deps:[mt,K],useFactory:tn},{provide:mt,useFactory:en},{provide:K,deps:[me],useFactory:Ze},{provide:ie,deps:[Ee],useFactory:nn},{provide:ee,useExisting:X}])}function nn(e){return e.state}var mn=(()=>{let t=class t{static instrument(n={}){return{ngModule:t,providers:[xt(n)]}}};t.\u0275fac=function(i){return new(i||t)},t.\u0275mod=Mt({type:t}),t.\u0275inj=jt({});let e=t;return e})();var Ue=(()=>{let t=class t{constructor(n,i,c,d,r,g){this.actions$=n,this.authService=i,this.tokenService=c,this.store=d,this.snackbarService=r,this.router=g,this.loginUser=nt(()=>this.actions$.pipe(it(L.loginUser),k(({user:u})=>this.authService.loginUser(u).pipe(A(m=>(this.tokenService.setAuthToken(m),this.router.navigateByUrl("/countries"),L.userLogged({token:m}))),C(()=>(this.snackbarService.open("Wrong password or username",{duration:5e3,panelClasses:["snackbar-warn-color-text"]}),N)))))),this.registerUser=nt(()=>this.actions$.pipe(it(L.registerUser),k(({user:u})=>this.authService.registerUser(u).pipe(A(()=>(this.router.navigateByUrl("/login"),this.snackbarService.open("User created"),L.userRegistered())),C(()=>N)))))}};t.\u0275fac=function(i){return new(i||t)(S(ce),S(re),S(H),S(oe),S(le),S(_))},t.\u0275prov=b({token:t,factory:t.\u0275fac});let e=t;return e})();var Fe=(()=>{let t=class t{constructor(n){this.tokenService=n,this.router=z(_)}intercept(n,i){let c=this.tokenService.getAuthToken();if(c!==null){let d=n.clone({headers:n.headers.set("Authorization",`Bearer ${c}`)});return this.handleResponseError(i.handle(d))}return this.handleResponseError(i.handle(n))}handleError(n){return n.status===401&&this.router.navigateByUrl("/login"),q(()=>n)}handleResponseError(n){return n.pipe(C(i=>(i instanceof Bt&&this.handleError(i),q(()=>i))))}};t.\u0275fac=function(i){return new(i||t)(S(H))},t.\u0275prov=b({token:t,factory:t.\u0275fac});let e=t;return e})();var ze={providers:[Lt(Jt),Xt(fe),Wt(),Gt(Zt()),se({router:ue}),pe(),ae([Ue]),xt(),{provide:Ht,useClass:Fe,multi:!0}]};var _e=(()=>{let t=class t{};t.\u0275fac=function(i){return new(i||t)},t.\u0275cmp=Dt({type:t,selectors:[["app-root"]],standalone:!0,features:[zt],decls:1,vars:0,template:function(i,c){i&1&&Ft(0,"router-outlet")},dependencies:[_t,Kt,Yt]});let e=t;return e})();Vt(_e,ze).catch(e=>console.error(e));