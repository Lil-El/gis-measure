import{ra as Le,rb as We,N as Ue,rc as Ae,bv as Ge,u as ke,j4 as ce,f8 as Be,kU as Je,dL as Ke,l2 as Q,a4 as Ye,d6 as ue,rd as ze,re as je,rf as Xe,qL as se,qa as U,rg as K,rh as oe,ri as he,rj as Qe,rk as Ze,rl as Oe,eg as et,a$ as tt,bD as it,rm as nt,o$ as at,rn as rt,ly as st,ro as ot,rp as Y,c2 as de,h$ as W,rq as N,rr as lt,rs as ct,rt as ut,o0 as q,ru as ht,rv as dt,q7 as A,pY as $e,rw as ae,q8 as ee,aV as fe,b as ft,rx as _t,ry as mt,a_ as pt,g as gt,w as vt,v as yt,l as _e,e as F,y as G,a as xt}from"./index-DXZ_271k.js";import{t as $}from"./Rect-BAnET0xx.js";import{n as wt}from"./pbf-B2bOPeqh.js";import{e as bt}from"./rasterizingUtils-B4PaN2r4.js";import{h as St,T as H}from"./TileInfoView-CbygSGiw.js";import{e as z,t as Ne,r as me}from"./definitions-CcFp96QY.js";import{M as ie}from"./number-B9cdMe9q.js";import{c as pe}from"./GeometryUtils-Bk_ReTuC.js";import{l as ge}from"./StyleRepository-ClH_LBil.js";import{n as Tt}from"./LayerView3D-Sf5UcdS3.js";import{o as Pt}from"./TiledLayerView3D-EYVxmh9q.js";import{d as It}from"./LayerView-D85gm5GC.js";import"./colorUtils-DA8Qa9eB.js";import"./TileClipper-BvkO341x.js";let Mt=class{constructor(e,i,t){this._scale=e,this._shift=i,this._levelShift=t}getLevelRowColumn(e){const i=this.getLevelShift(e[0]),t=this._shift+i;return t?[e[0]-i,e[1]>>t,e[2]>>t]:e}getLevelShift(e){return Math.min(e,this._levelShift)}getOffset(e,i){let t=0,n=0;const a=this._shift+this.getLevelShift(e[0]);if(a){const r=(1<<a)-1,s=i/(this._scale*(1<<a-1));t=(e[2]&r)*s,n=(e[1]&r)*s}return[t,n]}getScale(e){return this._scale*(1<<this._shift+this.getLevelShift(e))}},te=class{constructor(e,i){this._width=0,this._height=0,this._free=[],this._width=e,this._height=i,this._free.push(new $(0,0,e,i))}get width(){return this._width}get height(){return this._height}allocate(e,i){if(e>this._width||i>this._height)return new $;let t=null,n=-1;for(let a=0;a<this._free.length;++a){const r=this._free[a];e<=r.width&&i<=r.height&&(t===null||r.y<=t.y&&r.x<=t.x)&&(t=r,n=a)}return t===null?new $:(this._free.splice(n,1),t.width<t.height?(t.width>e&&this._free.push(new $(t.x+e,t.y,t.width-e,i)),t.height>i&&this._free.push(new $(t.x,t.y+i,t.width,t.height-i))):(t.width>e&&this._free.push(new $(t.x+e,t.y,t.width-e,t.height)),t.height>i&&this._free.push(new $(t.x,t.y+i,e,t.height-i))),new $(t.x,t.y,e,i))}release(e){for(let i=0;i<this._free.length;++i){const t=this._free[i];if(t.y===e.y&&t.height===e.height&&t.x+t.width===e.x)t.width+=e.width;else if(t.x===e.x&&t.width===e.width&&t.y+t.height===e.y)t.height+=e.height;else if(e.y===t.y&&e.height===t.height&&e.x+e.width===t.x)t.x=e.x,t.width+=e.width;else{if(e.x!==t.x||e.width!==t.width||e.y+e.height!==t.y)continue;t.y=e.y,t.height+=e.height}this._free.splice(i,1),this.release(e)}this._free.push(e)}},ve=class{constructor(e,i,t){this.width=0,this.height=0,this._dirties=[],this._glyphData=[],this._currentPage=0,this._glyphIndex={},this._textures=[],this._rangePromises=new Map,this.width=e,this.height=i,this._glyphSource=t,this._binPack=new te(e-4,i-4),this._glyphData.push(new Uint8Array(e*i)),this._dirties.push(!0),this._textures.push(void 0)}getGlyphItems(e,i){const t=[],n=this._glyphSource,a=new Set,r=1/256;for(const o of i){const l=Math.floor(o*r);a.add(l)}const s=[];return a.forEach(o=>{const l=e+o;if(this._rangePromises.has(l))s.push(this._rangePromises.get(l));else{const h=n.getRange(e,o).then(()=>{this._rangePromises.delete(l)},()=>{this._rangePromises.delete(l)});this._rangePromises.set(l,h),s.push(h)}}),Promise.all(s).then(()=>{let o=this._glyphIndex[e];o||(o={},this._glyphIndex[e]=o);for(const l of i){const h=o[l];if(h){t[l]={sdf:!0,rect:h.rect,metrics:h.metrics,page:h.page,code:l};continue}const d=n.getGlyph(e,l);if(!d||!d.metrics)continue;const f=d.metrics;let c;if(f.width===0)c=new $(0,0,0,0);else{const p=f.width+6,_=f.height+2*3;let m=p%4?4-p%4:4,y=_%4?4-_%4:4;m===1&&(m=5),y===1&&(y=5),c=this._binPack.allocate(p+m,_+y),c.isEmpty&&(this._dirties[this._currentPage]||(this._glyphData[this._currentPage]=null),this._currentPage=this._glyphData.length,this._glyphData.push(new Uint8Array(this.width*this.height)),this._dirties.push(!0),this._textures.push(void 0),this._binPack=new te(this.width-4,this.height-4),c=this._binPack.allocate(p+m,_+y));const P=this._glyphData[this._currentPage],I=d.bitmap;let x,b;if(I)for(let w=0;w<_;w++){x=p*w,b=this.width*(c.y+w+1)+c.x;for(let g=0;g<p;g++)P[b+g+1]=I[x+g]}}o[l]={rect:c,metrics:f,tileIDs:null,page:this._currentPage},t[l]={sdf:!0,rect:c,metrics:f,page:this._currentPage,code:l},this._dirties[this._currentPage]=!0}return t})}removeGlyphs(e){for(const i in this._glyphIndex){const t=this._glyphIndex[i];if(!t)continue;let n;for(const a in t)if(n=t[a],n.tileIDs.delete(e),n.tileIDs.size===0){const r=this._glyphData[n.page],s=n.rect;let o,l;for(let h=0;h<s.height;h++)for(o=this.width*(s.y+h)+s.x,l=0;l<s.width;l++)r[o+l]=0;delete t[a],this._dirties[n.page]=!0}}}bind(e,i,t,n=0){if(!this._textures[t]){const r=new Le;r.pixelFormat=We.ALPHA,r.wrapMode=Ue.CLAMP_TO_EDGE,r.width=this.width,r.height=this.height,this._textures[t]=new Ae(e,r,new Uint8Array(this.width*this.height))}const a=this._textures[t];a.setSamplingMode(i),this._dirties[t]&&a.setData(this._glyphData[t]),e.bindTexture(a,n),this._dirties[t]=!1}dispose(){this._binPack=null;for(const e of this._textures)e&&e.dispose();this._textures.length=0}},re=class{constructor(e){if(this._metrics=[],this._bitmaps=[],e)for(;e.next();)switch(e.tag()){case 1:{const i=e.getMessage();for(;i.next();)switch(i.tag()){case 3:{const t=i.getMessage();let n,a,r,s,o,l,h;for(;t.next();)switch(t.tag()){case 1:n=t.getUInt32();break;case 2:a=t.getBytes();break;case 3:r=t.getUInt32();break;case 4:s=t.getUInt32();break;case 5:o=t.getSInt32();break;case 6:l=t.getSInt32();break;case 7:h=t.getUInt32();break;default:t.skip()}t.release(),n&&(this._metrics[n]={width:r,height:s,left:o,top:l,advance:h},this._bitmaps[n]=a);break}default:i.skip()}i.release();break}default:e.skip()}}getMetrics(e){return this._metrics[e]}getBitmap(e){return this._bitmaps[e]}},Rt=class{constructor(){this._ranges=[]}getRange(e){return this._ranges[e]}addRange(e,i){this._ranges[e]=i}},ye=class{constructor(e){this._glyphInfo={},this._baseURL=e}getRange(e,i){const t=this._getFontStack(e);if(t.getRange(i))return Promise.resolve();const n=256*i,a=n+255;if(this._baseURL){const r=this._baseURL.replace("{fontstack}",e).replace("{range}",n+"-"+a);return Ge(r,{responseType:"array-buffer"}).then(s=>{t.addRange(i,new re(new wt(new Uint8Array(s.data),new DataView(s.data))))}).catch(()=>{t.addRange(i,new re)})}return t.addRange(i,new re),Promise.resolve()}getGlyph(e,i){const t=this._getFontStack(e);if(!t)return;const n=Math.floor(i/256),a=t.getRange(n);return a?{metrics:a.getMetrics(i),bitmap:a.getBitmap(i)}:void 0}_getFontStack(e){let i=this._glyphInfo[e];return i||(i=this._glyphInfo[e]=new Rt),i}};const Dt="dasharray-";let xe=class Ve{constructor(e,i,t=0){this._size=[],this._mosaicsData=[],this._textures=[],this._dirties=[],this._maxItemSize=0,this._currentPage=0,this._pageWidth=0,this._pageHeight=0,this._mosaicRects={},this.pixelRatio=1,(e<=0||i<=0)&&console.error("Sprites mosaic defaultWidth and defaultHeight must be greater than zero!"),this._pageWidth=e,this._pageHeight=i,t>0&&(this._maxItemSize=t),this._binPack=new te(e-4,i-4)}dispose(){this._binPack=null,this._mosaicRects={};for(const e of this._textures)e&&e.dispose();this._textures.length=0}getWidth(e){return e>=this._size.length?-1:this._size[e][0]}getHeight(e){return e>=this._size.length?-1:this._size[e][1]}getPageSize(e){return e>=this._size.length?null:this._size[e]}setSpriteSource(e){if(this.dispose(),this.pixelRatio=e.devicePixelRatio,this._mosaicsData.length===0){this._binPack=new te(this._pageWidth-4,this._pageHeight-4);const i=Math.floor(this._pageWidth),t=Math.floor(this._pageHeight),n=new Uint32Array(i*t);this._mosaicsData[0]=n,this._dirties.push(!0),this._size.push([this._pageWidth,this._pageHeight]),this._textures.push(void 0)}this._sprites=e}getSpriteItem(e,i=!1){let t,n,a=this._mosaicRects[e];if(a)return a;if(!this._sprites||this._sprites.loadStatus!=="loaded"||(e&&e.startsWith(Dt)?([t,n]=this._rasterizeDash(e),i=!0):t=this._sprites.getSpriteInfo(e),!t||!t.width||!t.height||t.width<0||t.height<0))return null;const r=t.width,s=t.height,[o,l,h]=this._allocateImage(r,s);return o.width<=0?null:(this._copy(o,t,l,h,i,n),a={rect:o,width:r,height:s,sdf:t.sdf,simplePattern:!1,pixelRatio:t.pixelRatio,page:l},this._mosaicRects[e]=a,a)}getSpriteItems(e){const i={};for(const t of e)i[t.name]=this.getSpriteItem(t.name,t.repeat);return i}getMosaicItemPosition(e,i){const t=this.getSpriteItem(e,i),n=t&&t.rect;if(!n)return null;n.width=t.width,n.height=t.height;const a=t.width,r=t.height,s=2;return{tl:[n.x+s,n.y+s],br:[n.x+s+a,n.y+s+r],page:t.page}}bind(e,i,t=0,n=0){if(t>=this._size.length||t>=this._mosaicsData.length)return;if(!this._textures[t]){const r=new Le;r.wrapMode=Ue.CLAMP_TO_EDGE,r.width=this._size[t][0],r.height=this._size[t][1],this._textures[t]=new Ae(e,r,new Uint8Array(this._mosaicsData[t].buffer))}const a=this._textures[t];a.setSamplingMode(i),this._dirties[t]&&a.setData(new Uint8Array(this._mosaicsData[t].buffer)),e.bindTexture(a,n),this._dirties[t]=!1}static _copyBits(e,i,t,n,a,r,s,o,l,h,d){let f=n*i+t,c=o*r+s;if(d){c-=r;for(let v=-1;v<=h;v++,f=((v+h)%h+n)*i+t,c+=r)for(let p=-1;p<=l;p++)a[c+p]=e[f+(p+l)%l]}else for(let v=0;v<h;v++){for(let p=0;p<l;p++)a[c+p]=e[f+p];f+=i,c+=r}}_copy(e,i,t,n,a,r){if(!this._sprites||this._sprites.loadStatus!=="loaded"||t>=this._mosaicsData.length)return;const s=new Uint32Array(r?r.buffer:this._sprites.image.buffer),o=this._mosaicsData[t];o&&s||console.error("Source or target images are uninitialized!");const l=2,h=r?i.width:this._sprites.width;Ve._copyBits(s,h,i.x,i.y,o,n[0],e.x+l,e.y+l,i.width,i.height,a),this._dirties[t]=!0}_allocateImage(e,i){e+=2,i+=2;const t=Math.max(e,i);if(this._maxItemSize&&this._maxItemSize<t){const s=new $(0,0,e,i);return this._mosaicsData.push(new Uint32Array(e*i)),this._dirties.push(!0),this._size.push([e,i]),this._textures.push(void 0),[s,this._mosaicsData.length-1,[e,i]]}let n=e%4?4-e%4:4,a=i%4?4-i%4:4;n===1&&(n=5),a===1&&(a=5);const r=this._binPack.allocate(e+n,i+a);return r.width<=0?(this._dirties[this._currentPage]||(this._mosaicsData[this._currentPage]=null),this._currentPage=this._mosaicsData.length,this._mosaicsData.push(new Uint32Array(this._pageWidth*this._pageHeight)),this._dirties.push(!0),this._size.push([this._pageWidth,this._pageHeight]),this._textures.push(void 0),this._binPack=new te(this._pageWidth-4,this._pageHeight-4),this._allocateImage(e,i)):[r,this._currentPage,[this._pageWidth,this._pageHeight]]}_rasterizeDash(e){const i=/\[(.*?)\]/,t=e.match(i);if(!t)return null;const n=t[1].split(",").map(Number),a=e.slice(e.lastIndexOf("-")+1),[r,s,o]=bt(n,a);return[{x:0,y:0,width:s,height:o,sdf:!0,pixelRatio:1},new Uint8Array(r.buffer)]}},Ct=class{constructor(e,i,t){this._layer=e,this._styleRepository=i,this.devicePixelRatio=t,this._spriteMosaic=null,this._glyphMosaic=null,this._connection=null,this._spriteSourceAbortController=null,this._startOptionsInputSignal=null,this._inputSignalEventListener=null}destroy(){var e,i;(e=this._connection)==null||e.close(),this._connection=null,this._styleRepository=null,this._layer=null,this._spriteMosaic=null,this._glyphMosaic=null,this._spriteSourceAbortController=ke(this._spriteSourceAbortController),this._spriteSourcePromise=null,this._inputSignalEventListener&&((i=this._startOptionsInputSignal)==null||i.removeEventListener("abort",this._inputSignalEventListener)),this._startOptionsInputSignal=null,this._inputSignalEventListener=null}get spriteMosaic(){return this._spriteSourcePromise.then(()=>this._spriteMosaic)}get glyphMosaic(){return this._glyphMosaic}async start(e){this._requestSprite(e);const i=this._layer.currentStyleInfo.glyphsUrl,t=new ye(i?ce(i,{...this._layer.customParameters,token:this._layer.apiKey}):null);this._glyphMosaic=new ve(1024,1024,t),this._broadcastPromise=Be("WorkerTileHandler",{client:this,schedule:e.schedule,signal:e.signal}).then(n=>{var a;if(this._layer&&((a=this._connection)==null||a.close(),this._connection=n,this._layer&&!this._connection.closed)){const r=n.broadcast("setStyle",this._layer.currentStyleInfo.style,e);Promise.all(r).catch(s=>Je(s))}})}_requestSprite(e){var r,s;(r=this._spriteSourceAbortController)==null||r.abort();const i=new AbortController;this._spriteSourceAbortController=i;const t=e==null?void 0:e.signal;this._inputSignalEventListener&&((s=this._startOptionsInputSignal)==null||s.removeEventListener("abort",this._inputSignalEventListener)),this._startOptionsInputSignal=null,t&&(this._inputSignalEventListener=Et(i),t.addEventListener("abort",this._inputSignalEventListener,{once:!0}));const{signal:n}=i,a={...e,signal:n};this._spriteSourcePromise=this._layer.loadSpriteSource(this.devicePixelRatio,a),this._spriteSourcePromise.then(o=>{Ke(n),this._spriteMosaic=new xe(1024,1024,250),this._spriteMosaic.setSpriteSource(o)})}async updateStyle(e){return await this._broadcastPromise,this._broadcastPromise=Promise.all(this._connection.broadcast("updateStyle",e)),this._broadcastPromise}setSpriteSource(e){const i=new xe(1024,1024,250);return i.setSpriteSource(e),this._spriteMosaic=i,this._spriteSourcePromise=Promise.resolve(e),this._spriteSourceAbortController=null,i}async setStyle(e,i){await this._broadcastPromise,this._styleRepository=e,this._requestSprite();const t=new ye(this._layer.currentStyleInfo.glyphsUrl?ce(this._layer.currentStyleInfo.glyphsUrl,{...this._layer.customParameters,token:this._layer.apiKey}):null);return this._glyphMosaic=new ve(1024,1024,t),this._broadcastPromise=Promise.all(this._connection.broadcast("setStyle",i)),this._broadcastPromise}fetchTileData(e,i){return this._getRefKeys(e,i).then(t=>{const n=this._layer.sourceNameToSource,a=[];for(const r in n)a.push(r);return this._getSourcesData(a,t,i)})}parseTileData(e,i){const t=e&&e.data;if(!t)return Promise.resolve(null);const{sourceName2DataAndRefKey:n,transferList:a}=t;return Object.keys(n).length===0?Promise.resolve(null):this._broadcastPromise.then(()=>this._connection.invoke("createTileAndParse",{key:e.key.id,sourceName2DataAndRefKey:n,styleLayerUIDs:e.styleLayerUIDs},{...i,transferList:a}))}async getSprites(e){return await this._spriteSourcePromise,this._spriteMosaic.getSpriteItems(e)}getGlyphs(e){return this._glyphMosaic.getGlyphItems(e.font,e.codePoints)}async _getTilePayload(e,i,t){const n=Q.pool.acquire(e.id),a=this._layer.sourceNameToSource[i],{level:r,row:s,col:o}=n;Q.pool.release(n);try{return{protobuff:await a.requestTile(r,s,o,t),sourceName:i}}catch(l){if(Ye(l))throw l;return{protobuff:null,sourceName:i}}}_getRefKeys(e,i){const t=this._layer.sourceNameToSource,n=new Array;for(const a in t){const r=t[a].getRefKey(e,i);n.push(r)}return ue(n)}_getSourcesData(e,i,t){const n=[];for(let a=0;a<i.length;a++)if(i[a].value==null||e[a]==null)n.push(null);else{const r=this._getTilePayload(i[a].value,e[a],t);n.push(r)}return ue(n).then(a=>{const r={},s=[];for(let o=0;o<a.length;o++){const l=a[o].value;if(l&&l.protobuff&&l.protobuff.byteLength>0){const h=i[o].value.id;r[l.sourceName]={refKey:h,protobuff:l.protobuff},s.push(l.protobuff)}}return{sourceName2DataAndRefKey:r,transferList:s}})}};function Et(u){return()=>u.abort()}function Lt(u,e,i,t,n,a){const{iconRotationAlignment:r,textRotationAlignment:s,iconTranslate:o,iconTranslateAnchor:l,textTranslate:h,textTranslateAnchor:d}=t;let f=0;for(const c of u.colliders){const[v,p]=c.partIndex===0?o:h,_=c.partIndex===0?l:d,m=c.minLod<=a&&a<=c.maxLod;f+=m?0:1,c.enabled=m,c.xScreen=c.xTile*n[0]+c.yTile*n[3]+n[6],c.yScreen=c.xTile*n[1]+c.yTile*n[4]+n[7],_===K.MAP?(c.xScreen+=i*v-e*p,c.yScreen+=e*v+i*p):(c.xScreen+=v,c.yScreen+=p),U.VIEWPORT===(c.partIndex===0?r:s)?(c.dxScreen=c.dxPixels,c.dyScreen=c.dyPixels):(c.dxScreen=i*(c.dxPixels+c.width/2)-e*(c.dyPixels+c.height/2)-c.width/2,c.dyScreen=e*(c.dxPixels+c.width/2)+i*(c.dyPixels+c.height/2)-c.height/2)}u.colliders.length>0&&f===u.colliders.length&&(u.unique.show=!1)}let Ut=class{constructor(e,i,t,n,a,r){this._symbols=e,this._styleRepository=n,this._zoom=a,this._currentLayerCursor=0,this._currentSymbolCursor=0,this._styleProps=new Map,this._allNeededMatrices=new Map,this._gridIndex=new ze(i,t,je),this._si=Math.sin(Math.PI*r/180),this._co=Math.cos(Math.PI*r/180);for(const s of e)for(const o of s.symbols)this._allNeededMatrices.has(o.tile)||this._allNeededMatrices.set(o.tile,Xe(o.tile.transforms.tileUnitsToPixels))}work(e){const i=this._gridIndex;function t(a){const r=a.xScreen+a.dxScreen,s=a.yScreen+a.dyScreen,o=r+a.width,l=s+a.height,[h,d,f,c]=i.getCellSpan(r,s,o,l);for(let v=d;v<=c;v++)for(let p=h;p<=f;p++){const _=i.cells[v][p];for(const m of _){const y=m.xScreen+m.dxScreen,P=m.yScreen+m.dyScreen,I=y+m.width,x=P+m.height;if(!(o<y||r>I||l<P||s>x))return!0}}return!1}const n=performance.now();for(;this._currentLayerCursor<this._symbols.length;this._currentLayerCursor++,this._currentSymbolCursor=0){const a=this._symbols[this._currentLayerCursor],r=this._getProperties(a.styleLayerUID);for(;this._currentSymbolCursor<a.symbols.length;this._currentSymbolCursor++){if(this._currentSymbolCursor%100==99&&performance.now()-n>e)return!1;const s=a.symbols[this._currentSymbolCursor];if(!s.unique.show)continue;Lt(s,this._si,this._co,r,this._allNeededMatrices.get(s.tile),this._zoom);const o=s.unique;if(!o.show)continue;const{iconAllowOverlap:l,iconIgnorePlacement:h,textAllowOverlap:d,textIgnorePlacement:f}=r;for(const c of s.colliders){if(!c.enabled)continue;const v=o.parts[c.partIndex];v.show&&!(c.partIndex?d:l)&&t(c)&&(c.hard?o.show=!1:v.show=!1)}if(o.show)for(const c of s.colliders){if(!c.enabled||(c.partIndex?f:h)||!o.parts[c.partIndex].show)continue;const v=c.xScreen+c.dxScreen,p=c.yScreen+c.dyScreen,_=v+c.width,m=p+c.height,[y,P,I,x]=this._gridIndex.getCellSpan(v,p,_,m);for(let b=P;b<=x;b++)for(let w=y;w<=I;w++)this._gridIndex.cells[b][w].push(c)}}}return!0}_getProperties(e){const i=this._styleProps.get(e);if(i)return i;const t=this._zoom,n=this._styleRepository.getStyleLayerByUID(e),a=n.getLayoutValue("symbol-placement",t)!==se.POINT;let r=n.getLayoutValue("icon-rotation-alignment",t);r===U.AUTO&&(r=a?U.MAP:U.VIEWPORT);let s=n.getLayoutValue("text-rotation-alignment",t);s===U.AUTO&&(s=a?U.MAP:U.VIEWPORT);const o=n.getPaintValue("icon-translate",t),l=n.getPaintValue("icon-translate-anchor",t),h=n.getPaintValue("text-translate",t),d=n.getPaintValue("text-translate-anchor",t),f={iconAllowOverlap:n.getLayoutValue("icon-allow-overlap",t),iconIgnorePlacement:n.getLayoutValue("icon-ignore-placement",t),textAllowOverlap:n.getLayoutValue("text-allow-overlap",t),textIgnorePlacement:n.getLayoutValue("text-ignore-placement",t),iconRotationAlignment:r,textRotationAlignment:s,iconTranslateAnchor:l,iconTranslate:o,textTranslateAnchor:d,textTranslate:h};return this._styleProps.set(e,f),f}};function At(u,e){if(u.priority-e.priority)return u.priority-e.priority;const i=u.tile.key,t=e.tile.key;return i.world-t.world?i.world-t.world:i.level-t.level?i.level-t.level:i.row-t.row?i.row-t.row:i.col-t.col?i.col-t.col:u.xTile-e.xTile?u.xTile-e.xTile:u.yTile-e.yTile}let kt=class{get running(){return this._running}constructor(e,i,t,n,a,r){this._visibleTiles=e,this._symbolRepository=i,this._createCollisionJob=t,this._assignTileSymbolsOpacity=n,this._symbolLayerSorter=a,this._isLayerVisible=r,this._selectionJob=null,this._selectionJobCompleted=!1,this._collisionJob=null,this._collisionJobCompleted=!1,this._opacityJob=null,this._opacityJobCompleted=!1,this._running=!0}setScreenSize(e,i){this._screenWidth===e&&this._screenHeight===i||this.restart(),this._screenWidth=e,this._screenHeight=i}restart(){this._selectionJob=null,this._selectionJobCompleted=!1,this._collisionJob=null,this._collisionJobCompleted=!1,this._opacityJob=null,this._opacityJobCompleted=!1,this._running=!0}continue(e){if(this._selectionJob||(this._selectionJob=this._createSelectionJob()),!this._selectionJobCompleted){const i=performance.now();if(!this._selectionJob.work(e)||(this._selectionJobCompleted=!0,(e=Math.max(0,e-(performance.now()-i)))===0))return!1}if(this._collisionJob||(this._collisionJob=this._createCollisionJob(this._selectionJob.sortedSymbols,this._screenWidth,this._screenHeight)),!this._collisionJobCompleted){const i=performance.now();if(!this._collisionJob.work(e)||(this._collisionJobCompleted=!0,(e=Math.max(0,e-(performance.now()-i)))===0))return!1}if(this._opacityJob||(this._opacityJob=this._createOpacityJob()),!this._opacityJobCompleted){const i=performance.now();if(!this._opacityJob.work(e)||(this._opacityJobCompleted=!0,(e=Math.max(0,e-(performance.now()-i)))===0))return!1}return this._running=!1,!0}_createSelectionJob(){const e=this._symbolRepository.uniqueSymbols;for(let o=0;o<e.length;o++){const l=e[o];for(let h=0;h<l.uniqueSymbols.length;h++){const d=l.uniqueSymbols[h];for(const f of d.tileSymbols)f.selectedForRendering=!1}}const i=[];let t=0,n=0;const a=this._isLayerVisible;function r(o){let l;const h=performance.now();for(;n<e.length;n++,t=0){const d=e[n],f=d.styleLayerUID;if(!a(f)){i[n]||(i[n]={styleLayerUID:f,symbols:[]});continue}i[n]=i[n]||{styleLayerUID:f,symbols:[]};const c=i[n];for(;t<d.uniqueSymbols.length;t++){if(l=d.uniqueSymbols[t],t%100==99&&performance.now()-h>o)return!1;let v=null,p=!1,_=!1;for(const m of l.tileSymbols)if(!_||!p){const y=m.tile;(!v||y.isCoverage||y.neededForCoverage&&!p)&&(v=m,(y.neededForCoverage||y.isCoverage)&&(_=!0),y.isCoverage&&(p=!0))}if(v.selectedForRendering=!0,_){c.symbols.push(v),l.show=!0;for(const m of l.parts)m.show=!0}else l.show=!1}}for(const d of i)d.symbols.sort(At);return!0}const s=this._symbolLayerSorter;return{work:r,get sortedSymbols(){return i.sort(s)}}}_createOpacityJob(){const e=this._assignTileSymbolsOpacity,i=this._visibleTiles;let t=0;function n(a,r){const s=a.symbols;for(const[o,l]of s)zt(l,r);e(a,r);for(const o of a.childrenTiles)n(o,r)}return{work(a){const r=performance.now();for(;t<i.length;t++){if(performance.now()-r>a)return!1;const s=i[t];s.parentTile==null&&n(s,performance.now())}return!0}}}};function zt(u,e){for(const i of u){const t=i.unique;for(const n of t.parts){const a=n.targetOpacity>.5?1:-1;n.startOpacity+=a*((e-n.startTime)/oe),n.startOpacity=Math.min(Math.max(n.startOpacity,0),1),n.startTime=e,n.targetOpacity=t.show&&n.show?1:0}}}const Ot=32,$t=8,Nt=64;let Vt=class{constructor(e,i,t){this.tileCoordRange=e,this._visibleTiles=i,this._createUnique=t,this._tiles=new Map,this._uniqueSymbolsReferences=new Map}get uniqueSymbols(){return this._uniqueSymbolLayerArray==null&&(this._uniqueSymbolLayerArray=this._createUniqueSymbolLayerArray()),this._uniqueSymbolLayerArray}add(e,i){this._uniqueSymbolLayerArray=null;let t=this._tiles.get(e.id);t||(t={symbols:new Map},this._tiles.set(e.id,t));const n=new Map;if(i)for(const s of i)t.symbols.has(s)&&(n.set(s,t.symbols.get(s)),t.symbols.delete(s));else for(const[s,o]of e.layerData)t.symbols.has(s)&&(n.set(s,t.symbols.get(s)),t.symbols.delete(s));this._removeSymbols(n);const a=e.symbols,r=new Map;for(const[s,o]of a){let l=o.length;if(l>=Ot){let h=this.tileCoordRange;do h/=2,l/=4;while(l>$t&&h>Nt);const d=new ze(this.tileCoordRange,this.tileCoordRange,h);r.set(s,{flat:o,index:d}),t.symbols.set(s,{flat:o,index:d});for(const f of o)d.getCell(f.xTile,f.yTile).push(f)}else r.set(s,{flat:o}),t.symbols.set(s,{flat:o})}this._addSymbols(e.key,a)}deleteStyleLayers(e){this._uniqueSymbolLayerArray=null;for(const[i,t]of this._tiles){const n=new Map;for(const a of e)t.symbols.has(a)&&(n.set(a,t.symbols.get(a)),t.symbols.delete(a));this._removeSymbols(n),t.symbols.size===0&&this._tiles.delete(i)}}removeTile(e){this._uniqueSymbolLayerArray=null;const i=this._tiles.get(e.id);if(!i)return;const t=new Map;for(const[n,a]of e.symbols)i.symbols.has(n)&&(t.set(n,i.symbols.get(n)),i.symbols.delete(n));this._removeSymbols(t),i.symbols.size===0&&this._tiles.delete(e.id)}_removeSymbols(e){for(const[i,{flat:t}]of e)for(const n of t){const a=n.unique,r=a.tileSymbols,s=r.length-1;for(let o=0;o<s;o++)if(r[o]===n){r[o]=r[s];break}if(r.length=s,s===0){const o=this._uniqueSymbolsReferences.get(i);o.delete(a),o.size===0&&this._uniqueSymbolsReferences.delete(i)}n.unique=null}}_addSymbols(e,i){if(i.size===0)return;const t=this._visibleTiles;for(const n of t)n.parentTile||n.key.world!==e.world||n.key.level===e.level&&!n.key.equals(e)||this._matchSymbols(n,e,i);for(const[n,a]of i)for(const r of a)if(r.unique==null){const s=this._createUnique();r.unique=s,s.tileSymbols.push(r);let o=this._uniqueSymbolsReferences.get(n);o||(o=new Set,this._uniqueSymbolsReferences.set(n,o)),o.add(s)}}_matchSymbols(e,i,t){if(e.key.level>i.level){const a=e.key.level-i.level;if(e.key.row>>a!==i.row||e.key.col>>a!==i.col)return}if(i.level>e.key.level){const a=i.level-e.key.level;if(i.row>>a!==e.key.row||i.col>>a!==e.key.col)return}if(i.equals(e.key)){for(const a of e.childrenTiles)this._matchSymbols(a,i,t);return}const n=new Map;for(const[a,r]of t){const s=[];for(const d of r){const f=he(this.tileCoordRange,d.xTile,i.level,i.col,e.key.level,e.key.col),c=he(this.tileCoordRange,d.yTile,i.level,i.row,e.key.level,e.key.row);f>=0&&f<this.tileCoordRange&&c>=0&&c<this.tileCoordRange&&s.push({symbol:d,xTransformed:f,yTransformed:c})}const o=[],l=e.key.level<i.level?1:1<<e.key.level-i.level,h=this._tiles.get(e.id).symbols.get(a);if(h){const d=h.flat;for(const f of s){let c,v=!1;const p=f.xTransformed,_=f.yTransformed;c=h.index!=null?h.index.getCell(p,_):d;const m=f.symbol,y=m.hash;for(const P of c)if(y===P.hash&&Math.abs(p-P.xTile)<=l&&Math.abs(_-P.yTile)<=l){const I=P.unique;m.unique=I,I.tileSymbols.push(m),v=!0;break}v||o.push(m)}}o.length>0&&n.set(a,o)}for(const a of e.childrenTiles)this._matchSymbols(a,i,n)}_createUniqueSymbolLayerArray(){const e=this._uniqueSymbolsReferences,i=new Array(e.size);let t,n=0;for(const[a,r]of e){const s=new Array(r.size);t=0;for(const o of r)s[t++]=o;i[n]={styleLayerUID:a,uniqueSymbols:s},n++}return i}};function Ft(u){const e=[],i=new Vt(4096,e,()=>{const n=new Qe;return n.show=!1,n.parts.push({startTime:0,startOpacity:0,targetOpacity:0,show:!1}),n.parts.push({startTime:0,startOpacity:0,targetOpacity:0,show:!1}),n}),t=new kt(e,i,(n,a,r)=>new Ut(n,a,r,u.styleRepository,u.key.level,0),(n,a)=>{Ze(n,a,!1)},()=>0,n=>{const a=u.styleRepository.getStyleLayerByUID(n).getLayoutProperty("visibility");return!a||a.getValue()!==Oe.NONE});e.push(u),i.add(u),t.setScreenSize(512,512),t.continue(1/0)}let qt=class extends St{constructor(){super(...arguments),this._fullCacheLodInfos=null,this._levelByScale={}}getTileParentId(e){const i=Q.pool.acquire(e),t=i.level===0?null:Q.getId(i.level-1,i.row>>1,i.col>>1,i.world);return Q.pool.release(i),t}getTileCoverage(e,i,t=!0,n){const a=super.getTileCoverage(e,i,t,n);if(!a)return a;const r=1<<a.lodInfo.level;return a.spans=a.spans.filter(s=>s.row>=0&&s.row<r),a}scaleToLevel(e){if(this._fullCacheLodInfos||this._initializeFullCacheLODs(this._lodInfos),this._levelByScale[e])return this._levelByScale[e];{const i=this._fullCacheLodInfos;if(e>i[0].scale)return i[0].level;let t,n;for(let a=0;a<i.length-1;a++)if(n=i[a+1],e>n.scale)return t=i[a],t.level+(t.scale-e)/(t.scale-n.scale);return i[i.length-1].level}}_initializeFullCacheLODs(e){let i;if(e[0].level===0)i=e.map(t=>({level:t.level,resolution:t.resolution,scale:t.scale}));else{const t=this.tileInfo.size[0],n=this.tileInfo.spatialReference;i=et.create({size:t,spatialReference:n}).lods.map(a=>({level:a.level,resolution:a.resolution,scale:a.scale}))}for(let t=0;t<i.length;t++)this._levelByScale[i[t].scale]=i[t].level;this._fullCacheLodInfos=i}},we=class extends Ct{constructor(e,i,t,n){super(e,i,t),this._memCache=n,this._ongoingTileRequests=new Map,this._ongoingRequestToController=new Map,this._tileInfoView=new qt(e.tileInfo,e.fullExtent)}destroy(){super.destroy(),this._ongoingRequestToController.forEach(e=>e.abort()),this._ongoingRequestToController.clear(),this._ongoingTileRequests.clear()}async getVectorTile(e,i,t,n){const a=new Q(e,i,t,0);let r=this._memCache.get(a.id);if(r!=null)return r.retain(),r;const s=await this._getVectorTileData(a);if(tt(n),!this._layer)return null;if(r=this._memCache.get(a.id),r!=null)return r.retain(),r;const o=this._layer.tileInfo.getTileBounds(it(),a),l=this._tileInfoView.getTileResolution(e);return r=new nt(a,l,o[0],o[3],512,512,this._styleRepository,this._memCache),s?(r.setData(s),r.retain(),this._memCache.put(a.id,r,r.memoryUsed,at)):r.setData(null),r.neededForCoverage=!0,r.transforms.tileUnitsToPixels=rt(1/8,0,0,0,1/8,0,0,0,1),Ft(r),r}_getVectorTileData(e){const i=e.id;if(this._ongoingTileRequests.has(i))return this._ongoingTileRequests.get(i);const t=new AbortController,n={signal:t.signal},a=this._getParsedVectorTileData(e,n).then(r=>(this._ongoingTileRequests.delete(i),this._ongoingRequestToController.delete(i),r)).catch(()=>(this._ongoingTileRequests.delete(i),this._ongoingRequestToController.delete(i),null));return this._ongoingTileRequests.set(i,a),this._ongoingRequestToController.set(i,t),a}_getParsedVectorTileData(e,i){return this.fetchTileData(e,i).then(t=>this.parseTileData({key:e,data:t},i))}},ne=class{constructor(){this.name=this.constructor.name||"UnnamedBrush",this.brushEffect=null}prepareState(e,i){}draw(e,i,t){}drawMany(e,i,t){for(const n of i)n.visible&&this.draw(e,n,t)}},Ht=class extends ne{constructor(){super(...arguments),this._color=st(1,0,0,1),this._patternMatrix=ot(),this._programOptions={id:!1,pattern:!1}}dispose(){this._vao&&(this._vao.dispose(),this._vao=null)}drawMany(e,i){const{context:t,painter:n,styleLayerUID:a,requestRender:r,allowDelayedRender:s}=e;this._loadWGLResources(e);const o=e.displayLevel,l=e.styleLayer,h=l.backgroundMaterial,d=n.vectorTilesMaterialManager,f=l.getPaintValue("background-color",o),c=l.getPaintValue("background-opacity",o),v=l.getPaintValue("background-pattern",o),p=v!==void 0,_=f[3]*c,m=1|window.devicePixelRatio,y=e.spriteMosaic;let P,I;const x=m>Ne?2:1,b=e.drawPhase===H.HITTEST,w=this._programOptions;w.id=b,w.pattern=p;const g=d.getMaterialProgram(t,h,w);if(!s||r==null||g.compiled){if(t.bindVAO(this._vao),t.useProgram(g),p){const S=y.getMosaicItemPosition(v,!0);if(S!=null){const{tl:M,br:T,page:D}=S;P=T[0]-M[0],I=T[1]-M[1];const R=y.getPageSize(D);R!=null&&(y.bind(t,Y.LINEAR,D,z),g.setUniform4f("u_tlbr",M[0],M[1],T[0],T[1]),g.setUniform2fv("u_mosaicSize",R),g.setUniform1i("u_texture",z))}g.setUniform1f("u_opacity",c)}else this._color[0]=_*f[0],this._color[1]=_*f[1],this._color[2]=_*f[2],this._color[3]=_,g.setUniform4fv("u_color",this._color);if(g.setUniform1f("u_depth",l.z||0),b){const S=ie(a+1);g.setUniform4fv("u_id",S)}for(const S of i){if(g.setUniform1f("u_coord_range",S.rangeX),g.setUniformMatrix3fv("u_dvsMat3",S.transforms.dvs),p){const M=Math.max(2**(Math.round(o)-S.key.level),1),T=x*S.width*M,D=T/de(P),R=T/de(I);this._patternMatrix[0]=D,this._patternMatrix[4]=R,g.setUniformMatrix3fv("u_pattern_matrix",this._patternMatrix)}t.setStencilFunction(W.EQUAL,0,255),t.drawArrays(N.TRIANGLE_STRIP,0,4)}}else r()}_loadWGLResources(e){if(this._vao)return;const{context:i,styleLayer:t}=e,n=t.backgroundMaterial,a=new Int8Array([0,0,1,0,0,1,1,1]),r=lt.createVertex(i,ct.STATIC_DRAW,a),s=new ut(i,n.getAttributeLocations(),n.getLayoutInfo(),{geometry:r});this._vao=s}},Wt=class extends ne{constructor(){super(...arguments),this._programOptions={id:!1}}dispose(){}drawMany(e,i){const{context:t,displayLevel:n,requiredLevel:a,state:r,drawPhase:s,painter:o,spriteMosaic:l,styleLayerUID:h,requestRender:d,allowDelayedRender:f}=e;if(!i.some(w=>{var g;return((g=w.layerData.get(h))==null?void 0:g.circleIndexCount)??!1}))return;const c=e.styleLayer,v=c.circleMaterial,p=o.vectorTilesMaterialManager,_=1.2,m=c.getPaintValue("circle-translate",n),y=c.getPaintValue("circle-translate-anchor",n),P=s===H.HITTEST,I=this._programOptions;I.id=P;const x=p.getMaterialProgram(t,v,I);if(f&&d!=null&&!x.compiled)return void d();t.useProgram(x),x.setUniformMatrix3fv("u_displayMat3",y===K.VIEWPORT?r.displayMat3:r.displayViewMat3),x.setUniform2fv("u_circleTranslation",m),x.setUniform1f("u_depth",c.z),x.setUniform1f("u_antialiasingWidth",_);let b=-1;if(P){const w=ie(h+1);x.setUniform4fv("u_id",w)}for(const w of i){if(!w.layerData.has(h))continue;w.key.level!==b&&(b=w.key.level,v.setDataUniforms(x,n,c,b,l));const g=w.layerData.get(h);if(!g.circleIndexCount)continue;g.prepareForRendering(t);const S=g.vao;S!=null&&(t.bindVAO(S),x.setUniformMatrix3fv("u_dvsMat3",w.transforms.dvs),a!==w.key.level?t.setStencilFunction(W.EQUAL,w.stencilRef,255):t.setStencilFunction(W.GREATER,255,255),t.drawElements(N.TRIANGLES,g.circleIndexCount,q.UNSIGNED_INT,Uint32Array.BYTES_PER_ELEMENT*g.circleIndexStart),w.triangleCount+=g.circleIndexCount/3)}}};const be=1/65536;let Gt=class extends ne{constructor(){super(...arguments),this._fillProgramOptions={id:!1,pattern:!1},this._outlineProgramOptions={id:!1}}dispose(){}drawMany(e,i){const{displayLevel:t,drawPhase:n,renderPass:a,spriteMosaic:r,styleLayerUID:s}=e;let o=!1;for(const x of i)if(x.layerData.has(s)){const b=x.layerData.get(s);if(b.fillIndexCount>0||b.outlineIndexCount>0){o=!0;break}}if(!o)return;const l=e.styleLayer,h=l.getPaintProperty("fill-pattern"),d=h!==void 0,f=d&&h.isDataDriven;let c;if(d&&!f){const x=h.getValue(t);c=r.getMosaicItemPosition(x,!0)}const v=!d&&l.getPaintValue("fill-antialias",t);let p=!0,_=1;if(!d){const x=l.getPaintProperty("fill-color"),b=l.getPaintProperty("fill-opacity");if(!(x!=null&&x.isDataDriven)&&!(b!=null&&b.isDataDriven)){const w=l.getPaintValue("fill-color",t);_=l.getPaintValue("fill-opacity",t)*w[3],_>=1&&(p=!1)}}if(p&&a==="opaque")return;let m;n===H.HITTEST&&(m=ie(s+1));const y=l.getPaintValue("fill-translate",t),P=l.getPaintValue("fill-translate-anchor",t);(p||a!=="translucent")&&this._drawFill(e,s,l,i,y,P,d,c,f,m);const I=!l.hasDataDrivenOutlineColor&&l.outlineUsesFillColor&&_<1;v&&a!=="opaque"&&!I&&this._drawOutline(e,s,l,i,y,P,m)}_drawFill(e,i,t,n,a,r,s,o,l,h){if(s&&!l&&o==null)return;const{context:d,displayLevel:f,state:c,drawPhase:v,painter:p,pixelRatio:_,spriteMosaic:m,requestRender:y,allowDelayedRender:P}=e,I=t.fillMaterial,x=p.vectorTilesMaterialManager,b=_>Ne?2:1,w=v===H.HITTEST,g=this._fillProgramOptions;g.id=w,g.pattern=s;const S=x.getMaterialProgram(d,I,g);if(P&&y!=null&&!S.compiled)return void y();if(d.useProgram(S),o!=null){const{page:T}=o,D=m.getPageSize(T);D!=null&&(m.bind(d,Y.LINEAR,T,z),S.setUniform2fv("u_mosaicSize",D),S.setUniform1i("u_texture",z))}S.setUniformMatrix3fv("u_displayMat3",r===K.VIEWPORT?c.displayMat3:c.displayViewMat3),S.setUniform2fv("u_fillTranslation",a),S.setUniform1f("u_depth",t.z+be),w&&S.setUniform4fv("u_id",h);let M=-1;for(const T of n){if(!T.layerData.has(i))continue;T.key.level!==M&&(M=T.key.level,I.setDataUniforms(S,f,t,M,m));const D=T.layerData.get(i);if(!D.fillIndexCount)continue;D.prepareForRendering(d);const R=D.fillVAO;if(R!=null){if(d.bindVAO(R),S.setUniformMatrix3fv("u_dvsMat3",T.transforms.dvs),d.setStencilFunction(W.EQUAL,T.stencilRef,255),s){const E=Math.max(2**(Math.round(f)-T.key.level),1),L=T.rangeX/(b*T.width*E);S.setUniform1f("u_patternFactor",L)}if(l){const E=D.patternMap;if(!E)continue;for(const[L,B]of E){const J=m.getPageSize(L);J!=null&&(m.bind(d,Y.LINEAR,L,z),S.setUniform2fv("u_mosaicSize",J),S.setUniform1i("u_texture",z),d.drawElements(N.TRIANGLES,B[1],q.UNSIGNED_INT,Uint32Array.BYTES_PER_ELEMENT*B[0]))}}else d.drawElements(N.TRIANGLES,D.fillIndexCount,q.UNSIGNED_INT,Uint32Array.BYTES_PER_ELEMENT*D.fillIndexStart);T.triangleCount+=D.fillIndexCount/3}}}_drawOutline(e,i,t,n,a,r,s){const{context:o,displayLevel:l,state:h,drawPhase:d,painter:f,pixelRatio:c,spriteMosaic:v,requestRender:p,allowDelayedRender:_}=e,m=t.outlineMaterial,y=f.vectorTilesMaterialManager,P=.75/c,I=d===H.HITTEST,x=this._outlineProgramOptions;x.id=I;const b=y.getMaterialProgram(o,m,x);if(_&&p!=null&&!b.compiled)return void p();o.useProgram(b),b.setUniformMatrix3fv("u_displayMat3",r===K.VIEWPORT?h.displayMat3:h.displayViewMat3),b.setUniform2fv("u_fillTranslation",a),b.setUniform1f("u_depth",t.z+be),b.setUniform1f("u_outline_width",P),I&&b.setUniform4fv("u_id",s);let w=-1;for(const g of n){if(!g.layerData.has(i))continue;g.key.level!==w&&(w=g.key.level,m.setDataUniforms(b,l,t,w,v));const S=g.layerData.get(i);if(S.prepareForRendering(o),!S.outlineIndexCount)continue;const M=S.outlineVAO;M!=null&&(o.bindVAO(M),b.setUniformMatrix3fv("u_dvsMat3",g.transforms.dvs),o.setStencilFunction(W.EQUAL,g.stencilRef,255),o.drawElements(N.TRIANGLES,S.outlineIndexCount,q.UNSIGNED_INT,Uint32Array.BYTES_PER_ELEMENT*S.outlineIndexStart),g.triangleCount+=S.outlineIndexCount/3)}}},Bt=class extends ne{constructor(){super(...arguments),this._programOptions={id:!1,pattern:!1,sdf:!1}}dispose(){}drawMany(e,i){const{context:t,displayLevel:n,state:a,drawPhase:r,painter:s,pixelRatio:o,spriteMosaic:l,styleLayerUID:h,requestRender:d,allowDelayedRender:f}=e;if(!i.some(R=>{var E;return((E=R.layerData.get(h))==null?void 0:E.lineIndexCount)??!1}))return;const c=e.styleLayer,v=c.lineMaterial,p=s.vectorTilesMaterialManager,_=c.getPaintValue("line-translate",n),m=c.getPaintValue("line-translate-anchor",n),y=c.getPaintProperty("line-pattern"),P=y!==void 0,I=P&&y.isDataDriven;let x,b;if(P&&!I){const R=y.getValue(n);x=l.getMosaicItemPosition(R)}let w=!1;if(!P){const R=c.getPaintProperty("line-dasharray");if(b=R!==void 0,w=b&&R.isDataDriven,b&&!w){const E=R.getValue(n),L=c.getDashKey(E,c.getLayoutValue("line-cap",n));x=l.getMosaicItemPosition(L)}}const g=1/o,S=r===H.HITTEST,M=this._programOptions;M.id=S,M.pattern=P,M.sdf=b;const T=p.getMaterialProgram(t,v,M);if(f&&d!=null&&!T.compiled)return void d();if(t.useProgram(T),T.setUniformMatrix3fv("u_displayViewMat3",a.displayViewMat3),T.setUniformMatrix3fv("u_displayMat3",m===K.VIEWPORT?a.displayMat3:a.displayViewMat3),T.setUniform2fv("u_lineTranslation",_),T.setUniform1f("u_depth",c.z),T.setUniform1f("u_antialiasing",g),S){const R=ie(h+1);T.setUniform4fv("u_id",R)}if(x&&x!=null){const{page:R}=x,E=l.getPageSize(R);E!=null&&(l.bind(t,Y.LINEAR,R,z),T.setUniform2fv("u_mosaicSize",E),T.setUniform1i("u_texture",z))}let D=-1;for(const R of i){if(!R.layerData.has(h))continue;R.key.level!==D&&(D=R.key.level,v.setDataUniforms(T,n,c,D,l));const E=2**(n-D)/o;T.setUniform1f("u_zoomFactor",E);const L=R.layerData.get(h);if(!L.lineIndexCount)continue;L.prepareForRendering(t);const B=L.vao;if(B!=null){if(t.bindVAO(B),T.setUniformMatrix3fv("u_dvsMat3",R.transforms.dvs),t.setStencilFunction(W.EQUAL,R.stencilRef,255),I||w){const J=L.patternMap;if(!J)continue;for(const[Z,C]of J){const X=l.getPageSize(Z);X!=null&&(l.bind(t,Y.LINEAR,Z,z),T.setUniform2fv("u_mosaicSize",X),T.setUniform1i("u_texture",z),t.drawElements(N.TRIANGLES,C[1],q.UNSIGNED_INT,Uint32Array.BYTES_PER_ELEMENT*C[0]))}}else t.drawElements(N.TRIANGLES,L.lineIndexCount,q.UNSIGNED_INT,Uint32Array.BYTES_PER_ELEMENT*L.lineIndexStart);R.triangleCount+=L.lineIndexCount/3}}}};const Jt=1/65536;class Kt extends ne{constructor(){super(...arguments),this._iconProgramOptions={id:!1,sdf:!1},this._sdfProgramOptions={id:!1},this._spritesTextureSize=ht()}dispose(){}drawMany(e,i){const{drawPhase:t,styleLayerUID:n}=e,a=e.styleLayer;let r;t===H.HITTEST&&(r=ie(n+1)),this._drawIcons(e,a,i,r),this._drawText(e,a,i,r)}_drawIcons(e,i,t,n){const{context:a,displayLevel:r,drawPhase:s,painter:o,spriteMosaic:l,state:h,styleLayerUID:d,requestRender:f,allowDelayedRender:c}=e,v=i.iconMaterial,p=o.vectorTilesMaterialManager;let _,m=!1;for(const D of t)if(D.layerData.has(d)&&(_=D.layerData.get(d),_.iconPerPageElementsMap.size>0)){m=!0;break}if(!m)return;const y=i.getPaintValue("icon-translate",r),P=i.getPaintValue("icon-translate-anchor",r);let I=i.getLayoutValue("icon-rotation-alignment",r);I===U.AUTO&&(I=i.getLayoutValue("symbol-placement",r)===se.POINT?U.VIEWPORT:U.MAP);const x=I===U.MAP,b=i.getLayoutValue("icon-keep-upright",r)&&x,w=_.isIconSDF,g=s===H.HITTEST,S=this._iconProgramOptions;S.id=g,S.sdf=w;const M=p.getMaterialProgram(a,v,S);if(c&&f!=null&&!M.compiled)return void f();a.useProgram(M),M.setUniformMatrix3fv("u_displayViewMat3",I===U.MAP?h.displayViewMat3:h.displayMat3),M.setUniformMatrix3fv("u_displayMat3",P===K.VIEWPORT?h.displayMat3:h.displayViewMat3),M.setUniform2fv("u_iconTranslation",y),M.setUniform1f("u_depth",i.z),M.setUniform1f("u_mapRotation",pe(h.rotation)),M.setUniform1f("u_keepUpright",b?1:0),M.setUniform1f("u_level",10*r),M.setUniform1i("u_texture",z),M.setUniform1f("u_fadeDuration",oe/1e3),g&&M.setUniform4fv("u_id",n);let T=-1;for(const D of t){if(!D.layerData.has(d)||(D.key.level!==T&&(T=D.key.level,v.setDataUniforms(M,r,i,T,l)),_=D.layerData.get(d),_.iconPerPageElementsMap.size===0))continue;_.prepareForRendering(a),_.updateOpacityInfo();const R=_.iconVAO;if(R!=null){a.bindVAO(R),M.setUniformMatrix3fv("u_dvsMat3",D.transforms.dvs),M.setUniform1f("u_time",(performance.now()-_.lastOpacityUpdate)/1e3);for(const[E,L]of _.iconPerPageElementsMap)this._renderIconRange(e,M,L,E,D)}}}_renderIconRange(e,i,t,n,a){const{context:r,spriteMosaic:s}=e;this._spritesTextureSize[0]=s.getWidth(n)/4,this._spritesTextureSize[1]=s.getHeight(n)/4,i.setUniform2fv("u_mosaicSize",this._spritesTextureSize),s.bind(r,Y.LINEAR,n,z),r.setStencilTestEnabled(!0),r.setStencilFunction(W.GREATER,255,255),r.setStencilWriteMask(0),r.drawElements(N.TRIANGLES,t[1],q.UNSIGNED_INT,Uint32Array.BYTES_PER_ELEMENT*t[0]),a.triangleCount+=t[1]/3}_drawText(e,i,t,n){const{context:a,displayLevel:r,drawPhase:s,glyphMosaic:o,painter:l,pixelRatio:h,spriteMosaic:d,state:f,styleLayerUID:c,requestRender:v,allowDelayedRender:p}=e,_=i.textMaterial,m=l.vectorTilesMaterialManager;let y,P=!1;for(const V of t)if(V.layerData.has(c)&&(y=V.layerData.get(c),y.glyphPerPageElementsMap.size>0)){P=!0;break}if(!P)return;const I=i.getPaintProperty("text-opacity");if(I&&!I.isDataDriven&&I.getValue(r)===0)return;const x=i.getPaintProperty("text-color"),b=!x||x.isDataDriven||x.getValue(r)[3]>0,w=i.getPaintProperty("text-halo-width"),g=i.getPaintProperty("text-halo-color"),S=(!w||w.isDataDriven||w.getValue(r)>0)&&(!g||g.isDataDriven||g.getValue(r)[3]>0);if(!b&&!S)return;const M=24/8;let T=i.getLayoutValue("text-rotation-alignment",r);T===U.AUTO&&(T=i.getLayoutValue("symbol-placement",r)===se.POINT?U.VIEWPORT:U.MAP);const D=T===U.MAP,R=i.getLayoutValue("text-keep-upright",r)&&D,E=s===H.HITTEST,L=.8*M/h;this._glyphTextureSize||(this._glyphTextureSize=dt(o.width/4,o.height/4));const B=i.getPaintValue("text-translate",r),J=i.getPaintValue("text-translate-anchor",r),Z=this._sdfProgramOptions;Z.id=E;const C=m.getMaterialProgram(a,_,Z);if(p&&v!=null&&!C.compiled)return void v();a.useProgram(C),C.setUniformMatrix3fv("u_displayViewMat3",T===U.MAP?f.displayViewMat3:f.displayMat3),C.setUniformMatrix3fv("u_displayMat3",J===K.VIEWPORT?f.displayMat3:f.displayViewMat3),C.setUniform2fv("u_textTranslation",B),C.setUniform1f("u_depth",i.z+Jt),C.setUniform2fv("u_mosaicSize",this._glyphTextureSize),C.setUniform1f("u_mapRotation",pe(f.rotation)),C.setUniform1f("u_keepUpright",R?1:0),C.setUniform1f("u_level",10*r),C.setUniform1i("u_texture",me),C.setUniform1f("u_antialiasingWidth",L),C.setUniform1f("u_fadeDuration",oe/1e3),E&&C.setUniform4fv("u_id",n);let X=-1;for(const V of t){if(!V.layerData.has(c)||(V.key.level!==X&&(X=V.key.level,_.setDataUniforms(C,r,i,X,d)),y=V.layerData.get(c),y.glyphPerPageElementsMap.size===0))continue;y.prepareForRendering(a),y.updateOpacityInfo();const le=y.textVAO;if(le==null)continue;a.bindVAO(le),C.setUniformMatrix3fv("u_dvsMat3",V.transforms.dvs),a.setStencilTestEnabled(!0),a.setStencilFunction(W.GREATER,255,255),a.setStencilWriteMask(0);const Fe=(performance.now()-y.lastOpacityUpdate)/1e3;C.setUniform1f("u_time",Fe),y.glyphPerPageElementsMap.forEach((qe,He)=>{this._renderGlyphRange(a,qe,He,o,C,S,b,V)})}}_renderGlyphRange(e,i,t,n,a,r,s,o){n.bind(e,Y.LINEAR,t,me),r&&(a.setUniform1f("u_halo",1),e.drawElements(N.TRIANGLES,i[1],q.UNSIGNED_INT,Uint32Array.BYTES_PER_ELEMENT*i[0]),o.triangleCount+=i[1]/3),s&&(a.setUniform1f("u_halo",0),e.drawElements(N.TRIANGLES,i[1],q.UNSIGNED_INT,Uint32Array.BYTES_PER_ELEMENT*i[0]),o.triangleCount+=i[1]/3)}}const Yt={vtlBackground:Ht,vtlFill:Gt,vtlLine:Bt,vtlCircle:Wt,vtlSymbol:Kt},jt={background:{"background.frag":`#ifdef PATTERN
uniform lowp float u_opacity;
uniform lowp sampler2D u_texture;
varying mediump vec4 v_tlbr;
varying mediump vec2 v_tileTextureCoord;
#else
uniform lowp vec4 u_color;
#endif
#ifdef ID
varying mediump vec4 v_id;
#endif
void main() {
#ifdef PATTERN
mediump vec2 normalizedTextureCoord = mod(v_tileTextureCoord, 1.0);
mediump vec2 samplePos = mix(v_tlbr.xy, v_tlbr.zw, normalizedTextureCoord);
lowp vec4 color = texture2D(u_texture, samplePos);
gl_FragColor = u_opacity * color;
#else
gl_FragColor = u_color;
#endif
#ifdef ID
if (gl_FragColor.a < 1.0 / 255.0) {
discard;
}
gl_FragColor = v_id;
#endif
}`,"background.vert":`precision mediump float;
attribute vec2 a_pos;
#ifdef ID
uniform mediump vec4 u_id;
varying mediump vec4 v_id;
#endif
uniform highp mat3 u_dvsMat3;
uniform mediump float u_coord_range;
uniform mediump float u_depth;
#ifdef PATTERN
uniform mediump mat3 u_pattern_matrix;
varying mediump vec2 v_tileTextureCoord;
uniform mediump vec4 u_tlbr;
uniform mediump vec2 u_mosaicSize;
varying mediump vec4 v_tlbr;
#endif
void main() {
gl_Position = vec4((u_dvsMat3 * vec3(u_coord_range * a_pos, 1.0)).xy, u_depth, 1.0);
#ifdef PATTERN
v_tileTextureCoord = (u_pattern_matrix * vec3(a_pos, 1.0)).xy;
v_tlbr             = u_tlbr / u_mosaicSize.xyxy;
#endif
#ifdef ID
v_id = u_id / 255.0;
#endif
}`},circle:{"circle.frag":`precision lowp float;
varying lowp vec4 v_color;
varying lowp vec4 v_stroke_color;
varying mediump float v_blur;
varying mediump float v_stroke_width;
varying mediump float v_radius;
varying mediump vec2 v_offset;
#ifdef ID
varying mediump vec4 v_id;
#endif
void main()
{
mediump float dist = length(v_offset);
mediump float alpha = smoothstep(0.0, -v_blur, dist - 1.0);
lowp float color_mix_ratio = v_stroke_width < 0.01 ? 0.0 : smoothstep(-v_blur, 0.0, dist - v_radius / (v_radius + v_stroke_width));
gl_FragColor = alpha * mix(v_color, v_stroke_color, color_mix_ratio);
#ifdef ID
if (gl_FragColor.a < 1.0 / 255.0) {
discard;
}
gl_FragColor = v_id;
#endif
}`,"circle.vert":`precision mediump float;
attribute vec2 a_pos;
#pragma header
varying lowp vec4 v_color;
varying lowp vec4 v_stroke_color;
varying mediump float v_blur;
varying mediump float v_stroke_width;
varying mediump float v_radius;
varying mediump vec2 v_offset;
#ifdef ID
uniform mediump vec4 u_id;
varying mediump vec4 v_id;
#endif
uniform highp mat3 u_dvsMat3;
uniform highp mat3 u_displayMat3;
uniform mediump vec2 u_circleTranslation;
uniform mediump float u_depth;
uniform mediump float u_antialiasingWidth;
void main()
{
#pragma main
v_color = color * opacity;
v_stroke_color = stroke_color * stroke_opacity;
v_stroke_width = stroke_width;
v_radius = radius;
v_blur = max(blur, u_antialiasingWidth / (radius + stroke_width));
mediump vec2 offset = vec2(mod(a_pos, 2.0) * 2.0 - 1.0);
v_offset = offset;
#ifdef ID
v_id = u_id / 255.0;
#endif
mediump vec3 pos = u_dvsMat3 * vec3(a_pos * 0.5, 1.0) + u_displayMat3 * vec3((v_radius + v_stroke_width) * offset + u_circleTranslation, 0.0);
gl_Position = vec4(pos.xy, u_depth, 1.0);
}`},fill:{"fill.frag":`precision lowp float;
#ifdef PATTERN
uniform lowp sampler2D u_texture;
varying mediump vec2 v_tileTextureCoord;
varying mediump vec4 v_tlbr;
#endif
#ifdef ID
varying mediump vec4 v_id;
#endif
varying lowp vec4 v_color;
vec4 mixColors(vec4 color1, vec4 color2) {
float compositeAlpha = color2.a + color1.a * (1.0 - color2.a);
vec3 compositeColor = color2.rgb + color1.rgb * (1.0 - color2.a);
return vec4(compositeColor, compositeAlpha);
}
void main()
{
#ifdef PATTERN
mediump vec2 normalizedTextureCoord = fract(v_tileTextureCoord);
mediump vec2 samplePos = mix(v_tlbr.xy, v_tlbr.zw, normalizedTextureCoord);
lowp vec4 color = texture2D(u_texture, samplePos);
gl_FragColor = v_color[3] * color;
#else
gl_FragColor = v_color;
#endif
#ifdef ID
if (gl_FragColor.a < 1.0 / 255.0) {
discard;
}
gl_FragColor = v_id;
#endif
}`,"fill.vert":`precision mediump float;
attribute vec2 a_pos;
#pragma header
uniform highp mat3 u_dvsMat3;
uniform highp mat3 u_displayMat3;
uniform mediump float u_depth;
uniform mediump vec2 u_fillTranslation;
#ifdef PATTERN
#include <util/util.glsl>
uniform mediump vec2 u_mosaicSize;
uniform mediump float u_patternFactor;
varying mediump vec2 v_tileTextureCoord;
varying mediump vec4 v_tlbr;
#endif
#ifdef ID
uniform mediump vec4 u_id;
varying mediump vec4 v_id;
#endif
varying lowp vec4 v_color;
void main()
{
#pragma main
v_color = color * opacity;
#ifdef ID
v_id = u_id / 255.0;
#endif
#ifdef PATTERN
float patternWidth = nextPOT(tlbr.z - tlbr.x);
float patternHeight = nextPOT(tlbr.w - tlbr.y);
float scaleX = 1.0 / (patternWidth * u_patternFactor);
float scaleY = 1.0 / (patternHeight * u_patternFactor);
mat3 patterMat = mat3(scaleX, 0.0,    0.0,
0.0,    -scaleY, 0.0,
0.0,    0.0,    1.0);
v_tileTextureCoord = (patterMat * vec3(a_pos, 1.0)).xy;
v_tlbr             = tlbr / u_mosaicSize.xyxy;
#endif
vec3 pos = u_dvsMat3 * vec3(a_pos, 1.0) + u_displayMat3 * vec3(u_fillTranslation, 0.0);
gl_Position = vec4(pos.xy, u_depth, 1.0);
}`},icon:{"icon.frag":`precision mediump float;
uniform lowp sampler2D u_texture;
#ifdef SDF
uniform lowp vec4 u_color;
uniform lowp vec4 u_outlineColor;
#endif
varying mediump vec2 v_tex;
varying lowp float v_opacity;
varying mediump vec2 v_size;
varying lowp vec4 v_color;
#ifdef SDF
varying mediump flaot v_halo_width;
#endif
#ifdef ID
varying mediump vec4 v_id;
#endif
#include <util/encoding.glsl>
vec4 mixColors(vec4 color1, vec4 color2) {
float compositeAlpha = color2.a + color1.a * (1.0 - color2.a);
vec3 compositeColor = color2.rgb + color1.rgb * (1.0 - color2.a);
return vec4(compositeColor, compositeAlpha);
}
void main()
{
#ifdef SDF
lowp vec4 fillPixelColor = v_color;
float d = rgba2float(texture2D(u_texture, v_tex)) - 0.5;
const float softEdgeRatio = 0.248062016;
float size = max(v_size.x, v_size.y);
float dist = d * softEdgeRatio * size;
fillPixelColor *= clamp(0.5 - dist, 0.0, 1.0);
if (v_halo_width > 0.25) {
lowp vec4 outlinePixelColor = u_outlineColor;
const float outlineLimitRatio = (16.0 / 86.0);
float clampedOutlineSize = softEdgeRatio * min(v_halo_width, outlineLimitRatio * max(v_size.x, v_size.y));
outlinePixelColor *= clamp(0.5 - (abs(dist) - clampedOutlineSize), 0.0, 1.0);
gl_FragColor = v_opacity * mixColors(fillPixelColor, outlinePixelColor);
}
else {
gl_FragColor = v_opacity * fillPixelColor;
}
#else
lowp vec4 texColor = texture2D(u_texture, v_tex);
gl_FragColor = v_opacity * texColor;
#endif
#ifdef ID
if (gl_FragColor.a < 1.0 / 255.0) {
discard;
}
gl_FragColor = v_id;
#endif
}`,"icon.vert":`attribute vec2 a_pos;
attribute vec2 a_vertexOffset;
attribute vec4 a_texAngleRange;
attribute vec4 a_levelInfo;
attribute float a_opacityInfo;
#pragma header
#ifdef ID
uniform mediump vec4 u_id;
varying mediump vec4 v_id;
#endif
varying lowp vec4 v_color;
#ifdef SDF
varying mediump float v_halo_width;
#endif
uniform highp mat3 u_dvsMat3;
uniform highp mat3 u_displayMat3;
uniform highp mat3 u_displayViewMat3;
uniform mediump vec2 u_iconTranslation;
uniform vec2 u_mosaicSize;
uniform mediump float u_depth;
uniform mediump float u_mapRotation;
uniform mediump float u_level;
uniform lowp float u_keepUpright;
uniform mediump float u_fadeDuration;
varying mediump vec2 v_tex;
varying lowp float v_opacity;
varying mediump vec2 v_size;
const float C_OFFSET_PRECISION = 1.0 / 8.0;
const float C_256_TO_RAD = 3.14159265359 / 128.0;
const float C_DEG_TO_RAD = 3.14159265359 / 180.0;
const float tileCoordRatio = 1.0 / 8.0;
uniform highp float u_time;
void main()
{
#pragma main
v_color = color;
v_opacity = opacity;
#ifdef SDF
v_halo_width = halo_width;
#endif
float modded = mod(a_opacityInfo, 128.0);
float targetOpacity = (a_opacityInfo - modded) / 128.0;
float startOpacity = modded / 127.0;
float interpolatedOpacity = clamp(startOpacity + 2.0 * (targetOpacity - 0.5) * u_time / u_fadeDuration, 0.0, 1.0);
v_opacity *= interpolatedOpacity;
mediump float a_angle         = a_levelInfo[1];
mediump float a_minLevel      = a_levelInfo[2];
mediump float a_maxLevel      = a_levelInfo[3];
mediump vec2 a_tex            = a_texAngleRange.xy;
mediump float delta_z = 0.0;
mediump float rotated = mod(a_angle + u_mapRotation, 256.0);
delta_z += (1.0 - step(u_keepUpright, 0.0)) * step(64.0, rotated) * (1.0 - step(192.0, rotated));
delta_z += 1.0 - step(a_minLevel, u_level);
delta_z += step(a_maxLevel, u_level);
delta_z += step(v_opacity, 0.0);
vec2 offset = C_OFFSET_PRECISION * a_vertexOffset;
v_size = abs(offset);
#ifdef SDF
offset = (120.0 / 86.0) * offset;
#endif
mediump vec3 pos = u_dvsMat3 * vec3(a_pos, 1.0) + u_displayViewMat3 * vec3(size * offset, 0.0) + u_displayMat3 * vec3(u_iconTranslation, 0.0);
gl_Position = vec4(pos.xy, u_depth + delta_z, 1.0);
#ifdef ID
v_id = u_id / 255.0;
#endif
v_tex = a_tex.xy / u_mosaicSize;
}`},line:{"line.frag":`precision lowp float;
varying mediump vec2 v_normal;
varying highp float v_accumulatedDistance;
varying mediump float v_lineHalfWidth;
varying lowp vec4 v_color;
varying mediump float v_blur;
#if defined (PATTERN) || defined(SDF)
varying mediump vec4 v_tlbr;
varying mediump vec2 v_patternSize;
varying mediump float v_widthRatio;
uniform sampler2D u_texture;
uniform mediump float u_antialiasing;
#endif
#ifdef SDF
#include <util/encoding.glsl>
#endif
#ifdef ID
varying mediump vec4 v_id;
#endif
void main()
{
mediump float fragDist = length(v_normal) * v_lineHalfWidth;
lowp float alpha = clamp((v_lineHalfWidth - fragDist) / v_blur, 0.0, 1.0);
#ifdef PATTERN
mediump float relativeTexX = fract(v_accumulatedDistance / (v_patternSize.x * v_widthRatio));
mediump float relativeTexY = 0.5 + v_normal.y * v_lineHalfWidth / (v_patternSize.y * v_widthRatio);
mediump vec2 texCoord = mix(v_tlbr.xy, v_tlbr.zw, vec2(relativeTexX, relativeTexY));
lowp vec4 color = texture2D(u_texture, texCoord);
gl_FragColor = alpha * v_color[3] * color;
#elif defined(SDF)
mediump float relativeTexX = fract((v_accumulatedDistance * 0.5) / (v_patternSize.x * v_widthRatio));
mediump float relativeTexY =  0.5 + 0.25 * v_normal.y;
mediump vec2 texCoord = mix(v_tlbr.xy, v_tlbr.zw, vec2(relativeTexX, relativeTexY));
mediump float d = rgba2float(texture2D(u_texture, texCoord)) - 0.5;
float dist = d * (v_lineHalfWidth + u_antialiasing / 2.0);
gl_FragColor = alpha * clamp(0.5 - dist, 0.0, 1.0) * v_color;
#else
gl_FragColor = alpha * v_color;
#endif
#ifdef ID
if (gl_FragColor.a < 1.0 / 255.0) {
discard;
}
gl_FragColor = v_id;
#endif
}`,"line.vert":`precision mediump float;
attribute vec2 a_pos;
attribute vec4 a_extrude_offset;
attribute vec4 a_dir_normal;
attribute vec2 a_accumulatedDistance;
#pragma header
uniform highp mat3 u_dvsMat3;
uniform highp mat3 u_displayMat3;
uniform highp mat3 u_displayViewMat3;
uniform mediump float u_zoomFactor;
uniform mediump vec2 u_lineTranslation;
uniform mediump float u_antialiasing;
uniform mediump float u_depth;
varying mediump vec2 v_normal;
varying highp float v_accumulatedDistance;
const float scale = 1.0 / 31.0;
const mediump float tileCoordRatio = 8.0;
#if defined (SDF)
const mediump float sdfPatternHalfWidth = 15.5;
#endif
#if defined (PATTERN) || defined(SDF)
uniform mediump vec2 u_mosaicSize;
varying mediump vec4 v_tlbr;
varying mediump vec2 v_patternSize;
varying mediump float v_widthRatio;
#endif
#ifdef ID
uniform mediump vec4 u_id;
varying mediump vec4 v_id;
#endif
varying lowp vec4 v_color;
varying mediump float v_lineHalfWidth;
varying mediump float v_blur;
void main()
{
#pragma main
v_color = color * opacity;
v_blur = blur + u_antialiasing;
v_normal = a_dir_normal.zw * scale;
#if defined (PATTERN) || defined(SDF)
v_tlbr          = tlbr / u_mosaicSize.xyxy;
v_patternSize   = vec2(tlbr.z - tlbr.x, tlbr.y - tlbr.w);
#if defined (PATTERN)
v_widthRatio = width / v_patternSize.y;
#else
v_widthRatio = width / sdfPatternHalfWidth / 2.0;
#endif
#endif
v_lineHalfWidth = (width + u_antialiasing) * 0.5;
mediump vec2 dir = a_dir_normal.xy * scale;
mediump vec2 offset_ = a_extrude_offset.zw * scale * offset;
mediump vec2 dist = v_lineHalfWidth * scale * a_extrude_offset.xy;
mediump vec3 pos = u_dvsMat3 * vec3(a_pos + offset_ * tileCoordRatio / u_zoomFactor, 1.0) + u_displayViewMat3 * vec3(dist, 0.0) + u_displayMat3 * vec3(u_lineTranslation, 0.0);
gl_Position = vec4(pos.xy, u_depth, 1.0);
#if defined (PATTERN) || defined(SDF)
v_accumulatedDistance = a_accumulatedDistance.x * u_zoomFactor / tileCoordRatio + dot(dir, dist + offset_);
#endif
#ifdef ID
v_id = u_id / 255.0;
#endif
}`},outline:{"outline.frag":`varying lowp vec4 v_color;
varying mediump vec2 v_normal;
#ifdef ID
varying mediump vec4 v_id;
#endif
void main()
{
lowp float dist = abs(v_normal.y);
lowp float alpha = smoothstep(1.0, 0.0, dist);
gl_FragColor = alpha * v_color;
#ifdef ID
if (gl_FragColor.a < 1.0 / 255.0) {
discard;
}
gl_FragColor = v_id;
#endif
}`,"outline.vert":`attribute vec2 a_pos;
attribute vec2 a_offset;
attribute vec2 a_xnormal;
#pragma header
varying lowp vec4 v_color;
#ifdef ID
uniform mediump vec4 u_id;
varying mediump vec4 v_id;
#endif
uniform highp mat3 u_dvsMat3;
uniform highp mat3 u_displayMat3;
uniform mediump vec2 u_fillTranslation;
uniform mediump float u_depth;
uniform mediump float u_outline_width;
varying lowp vec2 v_normal;
const float scale = 1.0 / 15.0;
void main()
{
#pragma main
v_color = color * opacity;
#ifdef ID
v_id = u_id / 255.0;
#endif
v_normal = a_xnormal;
mediump vec2 dist = u_outline_width * scale * a_offset;
mediump vec3 pos = u_dvsMat3 * vec3(a_pos, 1.0) + u_displayMat3 * vec3(dist + u_fillTranslation, 0.0);
gl_Position = vec4(pos.xy, u_depth, 1.0);
}`},text:{"text.frag":`uniform lowp sampler2D u_texture;
varying lowp vec2 v_tex;
varying lowp vec4 v_color;
varying mediump float v_edgeWidth;
varying mediump float v_edgeDistance;
#ifdef ID
varying mediump vec4 v_id;
#endif
void main()
{
lowp float dist = texture2D(u_texture, v_tex).a;
mediump float alpha = smoothstep(v_edgeDistance - v_edgeWidth, v_edgeDistance + v_edgeWidth, dist);
gl_FragColor = alpha * v_color;
#ifdef ID
if (gl_FragColor.a < 1.0 / 255.0) {
discard;
}
gl_FragColor = v_id;
#endif
}`,"text.vert":`attribute vec2 a_pos;
attribute vec2 a_vertexOffset;
attribute vec4 a_texAngleRange;
attribute vec4 a_levelInfo;
attribute float a_opacityInfo;
#pragma header
varying lowp vec4 v_color;
#ifdef ID
uniform mediump vec4 u_id;
varying mediump vec4 v_id;
#endif
uniform highp mat3 u_dvsMat3;
uniform highp mat3 u_displayMat3;
uniform highp mat3 u_displayViewMat3;
uniform mediump vec2 u_textTranslation;
uniform vec2 u_mosaicSize;
uniform mediump float u_depth;
uniform mediump float u_mapRotation;
uniform mediump float u_level;
uniform lowp float u_keepUpright;
uniform mediump float u_fadeDuration;
varying lowp vec2 v_tex;
const float offsetPrecision = 1.0 / 8.0;
const mediump float edgePos = 0.75;
uniform mediump float u_antialiasingWidth;
varying mediump float v_edgeDistance;
varying mediump float v_edgeWidth;
uniform lowp float u_halo;
const float sdfFontScale = 1.0 / 24.0;
const float sdfPixel = 3.0;
uniform highp float u_time;
void main()
{
#pragma main
if (u_halo > 0.5)
{
v_color = halo_color * opacity;
halo_width *= sdfPixel;
halo_blur *= sdfPixel;
}
else
{
v_color = color * opacity;
halo_width = 0.0;
halo_blur = 0.0;
}
float modded = mod(a_opacityInfo, 128.0);
float targetOpacity = (a_opacityInfo - modded) / 128.0;
float startOpacity = modded / 127.0;
float interpolatedOpacity = clamp(startOpacity + 2.0 * (targetOpacity - 0.5) * u_time / u_fadeDuration, 0.0, 1.0);
v_color *= interpolatedOpacity;
mediump float a_angle       = a_levelInfo[1];
mediump float a_minLevel    = a_levelInfo[2];
mediump float a_maxLevel    = a_levelInfo[3];
mediump vec2 a_tex          = a_texAngleRange.xy;
mediump float a_visMinAngle    = a_texAngleRange.z;
mediump float a_visMaxAngle    = a_texAngleRange.w;
mediump float delta_z = 0.0;
mediump float angle = mod(a_angle + u_mapRotation, 256.0);
if (a_visMinAngle < a_visMaxAngle)
{
delta_z += (1.0 - step(u_keepUpright, 0.0)) * (step(a_visMaxAngle, angle) + (1.0 - step(a_visMinAngle, angle)));
}
else
{
delta_z += (1.0 - step(u_keepUpright, 0.0)) * (step(a_visMaxAngle, angle) * (1.0 - step(a_visMinAngle, angle)));
}
delta_z += 1.0 - step(a_minLevel, u_level);
delta_z += step(a_maxLevel, u_level);
delta_z += step(v_color[3], 0.0);
v_tex = a_tex.xy / u_mosaicSize;
#ifdef ID
v_id = u_id / 255.0;
#endif
v_edgeDistance = edgePos - halo_width / size;
v_edgeWidth = (u_antialiasingWidth + halo_blur) / size;
mediump vec3 pos = u_dvsMat3 * vec3(a_pos, 1.0) + sdfFontScale * u_displayViewMat3 * vec3(offsetPrecision * size * a_vertexOffset, 0.0) + u_displayMat3 * vec3(u_textTranslation, 0.0);
gl_Position = vec4(pos.xy, u_depth + delta_z, 1.0);
}`},util:{"encoding.glsl":`const vec4 rgba2float_factors = vec4(
255.0 / (256.0),
255.0 / (256.0 * 256.0),
255.0 / (256.0 * 256.0 * 256.0),
255.0 / (256.0 * 256.0 * 256.0 * 256.0)
);
float rgba2float(vec4 rgba) {
return dot(rgba, rgba2float_factors);
}`,"util.glsl":`float nextPOT(in float x) {
return pow(2.0, ceil(log2(abs(x))));
}`}};let Xt=class{constructor(e){this._readFile=e}resolveIncludes(e){return this._resolve(e)}_resolve(e,i=new Map){if(i.has(e))return i.get(e);const t=this._read(e);if(!t)throw new Error(`cannot find shader file ${e}`);const n=/^[^\S\n]*#include\s+<(\S+)>[^\S\n]?/gm;let a=n.exec(t);const r=[];for(;a!=null;)r.push({path:a[1],start:a.index,length:a[0].length}),a=n.exec(t);let s=0,o="";return r.forEach(l=>{o+=t.slice(s,l.start),o+=i.has(l.path)?"":this._resolve(l.path,i),s=l.start+l.length}),o+=t.slice(s),i.set(e,o),o}_read(e){return this._readFile(e)}};function Qt(u){let e=jt;return u.split("/").forEach(i=>{e&&(e=e[i])}),e}const Zt=new Xt(Qt);function k(u){return Zt.resolveIncludes(u)}function ei(u){const{options:e,value:i}=u;return typeof e[i]=="number"}function j(u){let e="";for(const i in u){const t=u[i];if(typeof t=="boolean")t&&(e+=`#define ${i}
`);else if(typeof t=="number")e+=`#define ${i} ${t.toFixed()}
`;else if(typeof t=="object")if(ei(t)){const{value:n,options:a,namespace:r}=t,s=r?`${r}_`:"";for(const o in a)e+=`#define ${s}${o} ${a[o].toFixed()}
`;e+=`#define ${i} ${s}${n}
`}else{const n=t.options;let a=0;for(const r in n)e+=`#define ${n[r]} ${(a++).toFixed()}
`;e+=`#define ${i} ${n[t.value]}
`}}return e}const Se=u=>j({ID:u.id,PATTERN:u.pattern}),ti={shaders:u=>({vertexShader:Se(u)+k("background/background.vert"),fragmentShader:Se(u)+k("background/background.frag")})},Te=u=>j({ID:u.id}),ii={shaders:u=>({vertexShader:Te(u)+k("circle/circle.vert"),fragmentShader:Te(u)+k("circle/circle.frag")})},Pe=u=>j({ID:u.id,PATTERN:u.pattern}),ni={shaders:u=>({vertexShader:Pe(u)+k("fill/fill.vert"),fragmentShader:Pe(u)+k("fill/fill.frag")})},Ie=u=>j({ID:u.id}),ai={shaders:u=>({vertexShader:Ie(u)+k("outline/outline.vert"),fragmentShader:Ie(u)+k("outline/outline.frag")})},Me=u=>j({ID:u.id,SDF:u.sdf}),ri={shaders:u=>({vertexShader:Me(u)+k("icon/icon.vert"),fragmentShader:Me(u)+k("icon/icon.frag")})},Re=u=>j({ID:u.id,PATTERN:u.pattern,SDF:u.sdf}),si={shaders:u=>({vertexShader:Re(u)+k("line/line.vert"),fragmentShader:Re(u)+k("line/line.frag")})},De=u=>j({ID:u.id}),oi={shaders:u=>({vertexShader:De(u)+k("text/text.vert"),fragmentShader:De(u)+k("text/text.frag")})};let li=class{constructor(){this._programByKey=new Map}dispose(){this._programByKey.forEach(e=>e.dispose()),this._programByKey.clear()}getMaterialProgram(e,i,t){const n=i.key<<3|this._getMaterialOptionsValue(i.type,t);if(this._programByKey.has(n))return this._programByKey.get(n);const a=this._getProgramTemplate(i.type),{shaders:r}=a,{vertexShader:s,fragmentShader:o}=r(t),l=i.getShaderHeader(),h=i.getShaderMain(),d=s.replace("#pragma header",l).replace("#pragma main",h),f=e.programCache.acquire(d,o,i.getAttributeLocations());return this._programByKey.set(n,f),f}_getMaterialOptionsValue(e,i){switch(e){case A.BACKGROUND:{const t=i;return(t.pattern?1:0)<<1|(t.id?1:0)}case A.FILL:{const t=i;return(t.pattern?1:0)<<1|(t.id?1:0)}case A.OUTLINE:return i.id?1:0;case A.LINE:{const t=i;return(t.sdf?1:0)<<2|(t.pattern?1:0)<<1|(t.id?1:0)}case A.ICON:{const t=i;return(t.sdf?1:0)<<1|(t.id?1:0)}case A.CIRCLE:return i.id?1:0;case A.TEXT:return i.id?1:0;default:return 0}}_getProgramTemplate(e){switch(e){case A.BACKGROUND:return ti;case A.CIRCLE:return ii;case A.FILL:return ni;case A.ICON:return ri;case A.LINE:return si;case A.OUTLINE:return ai;case A.TEXT:return oi;default:return null}}};const Ce=1e-6;class Ee{constructor(e,i){this.spriteMosaic=e,this.glyphMosaic=i,this._brushCache=new Map,this._vtlMaterialManager=new li}dispose(){this._brushCache&&(this._brushCache.forEach(e=>e.dispose()),this._brushCache=null),this._vtlMaterialManager=$e(this._vtlMaterialManager),this.spriteMosaic.dispose(),this.glyphMosaic.dispose()}get vectorTilesMaterialManager(){return this._vtlMaterialManager}drawTile(e,i,t,n){const{context:a}=e,r=t.layers;t.backgroundBucketIds.length>0&&(e.renderPass="background",t.backgroundBucketIds.forEach(s=>{const o=t.getLayerById(s);n!=null&&n!==o.type||this._renderStyleLayer(o,e,i,!0)})),a.setBlendingEnabled(!1),a.setDepthTestEnabled(!0),a.setDepthWriteEnabled(!0),a.setDepthFunction(W.LEQUAL),e.renderPass="opaque";for(let s=r.length-1;s>=0;s--){const o=r[s];n!=null&&n!==o.type||this._renderStyleLayer(o,e,i,!1)}a.setDepthWriteEnabled(!1),a.setBlendingEnabled(!0),a.setBlendFunctionSeparate(ae.ONE,ae.ONE_MINUS_SRC_ALPHA,ae.ONE,ae.ONE_MINUS_SRC_ALPHA),e.renderPass="translucent";for(let s=0;s<r.length;s++){const o=r[s];n!=null&&n!==o.type||this._renderStyleLayer(o,e,i,!1)}a.setDepthTestEnabled(!1),a.bindVAO()}_renderStyleLayer(e,i,t,n){if(!(n||e&&t.layerData.has(e.uid)))return;const a=e.getLayoutProperty("visibility");if(a&&a.getValue()===Oe.NONE)return;const{renderPass:r}=i;let s;switch(e.type){case ee.BACKGROUND:if(r!=="background")return;s="vtlBackground";break;case ee.FILL:if(r!=="opaque"&&i.renderPass!=="translucent")return;s="vtlFill";break;case ee.LINE:if(r!=="translucent")return;s="vtlLine";break;case ee.CIRCLE:if(r!=="translucent")return;s="vtlCircle";break;case ee.SYMBOL:if(r!=="translucent")return;s="vtlSymbol"}const o=i.displayLevel;e.minzoom!==void 0&&e.minzoom>o+Ce||e.maxzoom!==void 0&&e.maxzoom<=o-Ce||(i.styleLayerUID=e.uid,i.styleLayer=e,this._drawWithBrush(i,t,s))}_drawWithBrush(e,i,t){if(!this._brushCache.has(t)){const n=Yt[t];this._brushCache.set(t,new n)}this._brushCache.get(t).drawMany(e,[i])}}let O=class extends Pt(Tt(It)){constructor(){super(...arguments),this._tileHandlerController=null,this.type="vector-tile-3d",this.levelShift=fe("disable-feature:vtl-level-shift")?0:1,this.contentZoom=fe("disable-feature:vtl-level-shift")?1:1.5}initialize(){if(this.layer.fullExtent==null)return void this.addResolvingPromise(Promise.reject(new ft("vectortilelayerview:full-extent-undefined","This layer view's layer does not define a fullExtent.")));const{basemapTerrain:u,spatialReference:e,state:i,viewingMode:t}=this.view,n=t==="local"&&!_t(e)||mt.force512VTL,a=this.layer.tileInfo.spatialReference.isGeographic,r=n?this.layer.tileInfo:this.layer.tileInfo.getOrCreateCompatible(256,a?1:2),s=this._getTileInfoSupportError(r,this.layer.fullExtent);if(s!=null)return this.addResolvingPromise(Promise.reject(s));const o=pt(()=>{var _,m;return(m=(_=this.view)==null?void 0:_.basemapTerrain)==null?void 0:m.tilingSchemeLocked}).then(()=>{var w,g,S;const _=u.tilingScheme,m=_.pixelSize,y=m===256?1:2,P=(w=u.spatialReference)!=null&&w.isGeographic&&m===256?1:0,I=(g=u.spatialReference)!=null&&g.isGeographic||m!==256?0:1;let x;if(this.schemaHelper=new Mt(y,P,this.levelShift+I),m===256){const M=this.layer.tileInfo.spatialReference.isGeographic;x=this.layer.tileInfo.getOrCreateCompatible(256,M?1:2)}else x=(S=this.view.spatialReference)!=null&&S.isGeographic?this.layer.tileInfo.getOrCreateCompatible(512,.5):this.layer.tileInfo;const b=this._getTileInfoCompatibilityError(x,_);if(b)throw b;this.tileInfo=x});this._tileHandlerController=new AbortController;const l=this.view.resourceController;this._memCache=l.memoryController.newCache(`vtl-${this.layer.uid}`,_=>{_.release()}),this.handles.add(gt(()=>this.view.qualitySettings.memoryLimit,_=>this._memCache.maxSize=Math.ceil(_/10*1048576),vt));const h=new ge(this.layer.currentStyleInfo.style);this._tileHandler=new we(this.layer,h,i.contentPixelRatio,this._memCache);const d=this._tileHandlerController.signal,f=ci(l),c=this._tileHandler.start({signal:d,schedule:f}),v=this._tileHandler.spriteMosaic;v.then(_=>{!yt(d)&&this._tileHandler&&(this.painter=new Ee(_,this._tileHandler.glyphMosaic))}),c.then(()=>this._tileHandlerController=null),this.updatingHandles.add(()=>{var _;return{style:this.layer.currentStyleInfo.style,pixelRatio:(_=this.view.state)==null?void 0:_.contentPixelRatio}},({style:_,pixelRatio:m})=>{this._tileHandlerController&&this._tileHandlerController.abort(),this._tileHandlerController=new AbortController,this._memCache.clear();const y=new ge(_),P=new we(this.layer,y,m,this._memCache),I=P.start({signal:this._tileHandlerController.signal,schedule:f}),x=P.spriteMosaic;I.then(()=>this._tileHandlerController=null),this.updatingHandles.addPromise(Promise.all([I,x]).then(([,b])=>{const w=this._tileHandler,g=this.painter;this.painter=new Ee(b,P.glyphMosaic),this._tileHandler=P,this.emit("data-changed"),w.destroy(),g&&g.dispose()}))});const p=Promise.all([o,c,v]);this.addResolvingPromise(p)}destroy(){this.painter=$e(this.painter),this._tileHandlerController=ke(this._tileHandlerController),this._tileHandler=_e(this._tileHandler),this._memCache=_e(this._memCache)}get displayLevelRange(){const u=this.tileInfo.lods,e=this.layer.minScale||u[0].scale,i=this.layer.maxScale||u[u.length-1].scale,t=this.levelRangeFromScaleRange(e,i);return this.layer.maxScale?t.maxLevel++:t.maxLevel+=this.levelShift,t}get dataScaleRange(){const u=this.tileInfo.lods;return{minScale:u[0].scale,maxScale:u[u.length-1].scale}}get dataLevelRange(){const{minScale:u,maxScale:e}=this.dataScaleRange,i=this.levelRangeFromScaleRange(u,e);return i.minLevel===1&&this.tileInfo.size[0]===256&&(i.minLevel=0),i.maxLevel+=this.levelShift,i}async fetchTile(u,e,i,t){return this._tileHandler.getVectorTile(u,e,i,t)}};F([G()],O.prototype,"layer",void 0),F([G()],O.prototype,"levelShift",void 0),F([G()],O.prototype,"contentZoom",void 0),F([G()],O.prototype,"displayLevelRange",null),F([G()],O.prototype,"tileInfo",void 0),F([G()],O.prototype,"dataScaleRange",null),F([G()],O.prototype,"dataLevelRange",null),F([G()],O.prototype,"updatingProgressValue",void 0),O=F([xt("esri.views.3d.layers.VectorTileLayerView3D")],O);const Hi=O;function ci(u){return e=>u.immediate.schedule(e)}export{Hi as default};
