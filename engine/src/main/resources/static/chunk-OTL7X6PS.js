import{a as S,b as T}from"./chunk-2JCW2XGL.js";import{Eb as C,Ja as O,Na as w,P as h,R as g,S as c,U as b,da as l,h as s,oc as I,qa as v,xa as p,y as m,ya as x,za as y}from"./chunk-OWV6CK4N.js";var V="eventState",N="countryState",P="compositionState";function d(e){return e!=null&&typeof e.label=="string"&&typeof e.value=="number"}function R(e){return d(e.value)?null:{notAnOption:!0}}function $(e){return e!=null}var j=class{isErrorState(t,i){let o=i&&i.submitted;return!!(t&&t.invalid&&(t.dirty||t.touched||o))}};function z(e,t){return e=e??"",t=t??"",e.toLowerCase()===t.toLowerCase()}function B(e){return e===void 0?null:e}function G(e){if(d(e))return e.value}function Y(e){return{label:`${e.name} (${e.compositionCode})`,value:e.id}}var r=class{constructor(t){this.overlayRef=t,this.closed=new s}close(t){this.overlayRef.dispose(),this.closed.next(t),this.closed.complete()}afterClosed(){return this.closed.asObservable()}};var L=new g("DIALOG_DATA"),te=(()=>{let t=class t{constructor(o,n){this.overlay=o,this.injector=n}open(o,n){let u=this.overlay.position().global().centerHorizontally().centerVertically(),a=this.overlay.create({positionStrategy:u,hasBackdrop:!0,backdropClass:"overlay-backdrop",panelClass:"overlay-panel",disposeOnNavigation:!0});a.backdropClick().pipe(m(1)).subscribe(()=>a.dispose());let f=new r(a),E=l.create({parent:this.injector,providers:[{provide:r,useValue:f},{provide:L,useValue:n?.data}]}),A=new C(o,null,E);return a.attach(A),f}};t.\u0275fac=function(n){return new(n||t)(c(I),c(l))},t.\u0275prov=h({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})();var k=class{constructor(){this.scrolled$=new s,this.offset=0}onScroll(){this.scrolled$.next()}getOffset(){let t=this.viewport.getRenderedRange().end,i=this.viewport.getDataLength();t===i&&t>this.offset&&(this.offset=t,this.getNewBatch())}};var ae=(()=>{let t=class t{constructor(){this.EMPTY_FOLDER="../../assets/no-results.png"}};t.\u0275fac=function(n){return new(n||t)},t.\u0275cmp=b({type:t,selectors:[["app-no-data"]],standalone:!0,features:[w],decls:4,vars:2,consts:[[1,"wrapper"],[1,"image"],[1,"label"]],template:function(n,u){n&1&&(p(0,"div",0),y(1,"div",1),p(2,"h3",2),O(3,"No data found"),x()()),n&2&&v("@fadeIn",void 0)("@fadeOut",void 0)},styles:['.wrapper[_ngcontent-%COMP%]{width:inherit;height:inherit;display:flex;align-items:center;justify-content:center;flex-direction:column}.wrapper[_ngcontent-%COMP%]   .image[_ngcontent-%COMP%]{margin-top:-100px;width:300px;height:300px;background-size:cover;background-image:url("./media/no-results-4BEI4XE4.png")}.wrapper[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%]{margin-top:-30px;margin-left:-10px}[_nghost-%COMP%]{display:inline-block;width:100%;height:100%}'],data:{animation:[S,T]},changeDetection:0});let e=t;return e})();export{V as a,N as b,P as c,d,R as e,$ as f,j as g,z as h,B as i,G as j,Y as k,r as l,L as m,te as n,k as o,ae as p};