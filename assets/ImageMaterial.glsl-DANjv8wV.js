import{ue as P,uf as v,ug as y,O as f,uh as l,ui as O,uj as A,uk as S,ul as $,hX as i,p4 as _,um as C,un as c,uo as E,lQ as d,up as x,uq as b,ur as w,us as M,ut as N,uu as D,uv as I,uw as R,ux as F,uy as L,uz as U,uA as j,uB as z,uC as B,uD as G,rw as g,uE as W,_ as H,e as o,uF as n,uG as q,uH as Q,hY as p,uI as V,uJ as k,uK as J,uL as K}from"./index-BZRBOKU4.js";function T(a){const e=new P,{vertex:t,fragment:s}=e;return v(t,a),e.include(y,a),e.attributes.add(f.POSITION,"vec3"),e.attributes.add(f.UV0,"vec2"),e.varyings.add("vpos","vec3"),a.hasMultipassTerrain&&e.varyings.add("depth","float"),t.code.add(l`
    void main(void) {
      vpos = position;
      ${a.hasMultipassTerrain?"depth = (view * vec4(vpos, 1.0)).z;":""}
      vTexCoord = uv0;
      gl_Position = transformPosition(proj, view, vpos);
    }
  `),e.include(O,a),e.include(A,a),s.uniforms.add(new S("tex",u=>u.texture),new $("opacity",u=>u.opacity)),e.varyings.add("vTexCoord","vec2"),a.output===i.Alpha?s.code.add(l`
    void main() {
      discardBySlice(vpos);
      ${a.hasMultipassTerrain?"terrainDepthTest(gl_FragCoord, depth);":""}

      float alpha = texture(tex, vTexCoord).a * opacity;
      if (alpha  < ${l.float(_)}) {
        discard;
      }

      fragColor = vec4(alpha);
    }
    `):(s.include(C),s.code.add(l`
    void main() {
      discardBySlice(vpos);
      ${a.hasMultipassTerrain?"terrainDepthTest(gl_FragCoord, depth);":""}
      fragColor = texture(tex, vTexCoord) * opacity;

      if (fragColor.a < ${l.float(_)}) {
        discard;
      }

      fragColor = highlightSlice(fragColor, vpos);
      ${a.transparencyPassType===c.Color?"fragColor = premultiplyAlpha(fragColor);":""}
    }
    `)),e}const X=Object.freeze(Object.defineProperty({__proto__:null,build:T},Symbol.toStringTag,{value:"Module"}));class h extends x{initializeProgram(e){return new b(e.rctx,h.shader.get().build(this.configuration),w)}_setPipelineState(e,t){const s=this.configuration,u=e===c.NONE,m=e===c.FrontFace;return M({blending:s.output!==i.Color&&s.output!==i.Alpha||!s.transparent?null:u?Y:G(e),culling:z(s.cullFace),depthTest:{func:j(e)},depthWrite:u?s.writeDepth?L:null:U(e),colorWrite:F,stencilWrite:s.hasOccludees?R:null,stencilTest:s.hasOccludees?t?D:I:null,polygonOffset:u||m?null:N(s.enableOffset)})}initializePipeline(){return this._occludeePipelineState=this._setPipelineState(this.configuration.transparencyPassType,!0),this._setPipelineState(this.configuration.transparencyPassType,!1)}getPipelineState(e,t){return t?this._occludeePipelineState:super.getPipelineState(e,t)}}h.shader=new W(X,()=>H(()=>Promise.resolve().then(()=>te),void 0));const Y=B(g.ONE,g.ONE_MINUS_SRC_ALPHA);class r extends E{constructor(){super(...arguments),this.output=i.Color,this.cullFace=d.None,this.hasSlicePlane=!1,this.transparent=!1,this.enableOffset=!0,this.writeDepth=!0,this.hasOccludees=!1,this.transparencyPassType=c.NONE,this.hasMultipassTerrain=!1,this.cullAboveGround=!1}}o([n({count:i.COUNT})],r.prototype,"output",void 0),o([n({count:d.COUNT})],r.prototype,"cullFace",void 0),o([n()],r.prototype,"hasSlicePlane",void 0),o([n()],r.prototype,"transparent",void 0),o([n()],r.prototype,"enableOffset",void 0),o([n()],r.prototype,"writeDepth",void 0),o([n()],r.prototype,"hasOccludees",void 0),o([n({count:c.COUNT})],r.prototype,"transparencyPassType",void 0),o([n()],r.prototype,"hasMultipassTerrain",void 0),o([n()],r.prototype,"cullAboveGround",void 0);class se extends q{constructor(e){super(e,new ee),this.supportsEdges=!0,this._configuration=new r}getConfiguration(e,t){return this._configuration.output=e,this._configuration.cullFace=this.parameters.cullFace,this._configuration.hasSlicePlane=this.parameters.hasSlicePlane,this._configuration.transparent=this.parameters.transparent,this._configuration.writeDepth=this.parameters.writeDepth,this._configuration.hasOccludees=this.parameters.hasOccludees,this._configuration.transparencyPassType=t.transparencyPassType,this._configuration.enableOffset=t.camera.relativeElevation<Q,this._configuration.hasMultipassTerrain=t.multipassTerrain.enabled,this._configuration.cullAboveGround=t.multipassTerrain.cullAboveGround,this._configuration}requiresSlot(e,t){return t===i.Color||t===i.Alpha||t===i.Highlight?e===p.DRAPED_MATERIAL?!0:t===i.Highlight?e===p.OPAQUE_MATERIAL:e===(this.parameters.transparent?this.parameters.writeDepth?p.TRANSPARENT_MATERIAL:p.TRANSPARENT_DEPTH_WRITE_DISABLED_MATERIAL:p.OPAQUE_MATERIAL):!1}createGLMaterial(e){return new Z(e)}createBufferWriter(){return new V(k)}}class Z extends K{constructor(e){super({...e,...e.material.parameters})}_updateParameters(e){return this.updateTexture(this._material.parameters.textureId),this._material.setParameters(this.textureBindParameters),this.ensureTechnique(h,e)}_updateOccludeeState(e){e.hasOccludees!==this._material.parameters.hasOccludees&&(this._material.setParameters({hasOccludees:e.hasOccludees}),this._updateParameters(e))}beginSlot(e){return this._output!==i.Color&&this._output!==i.Alpha||this._updateOccludeeState(e),this._updateParameters(e)}}class ee extends J{constructor(){super(...arguments),this.transparent=!1,this.writeDepth=!0,this.hasSlicePlane=!1,this.cullFace=d.None,this.hasOccludees=!1,this.opacity=1,this.textureId=null,this.initTextureTransparent=!0}}const te=Object.freeze(Object.defineProperty({__proto__:null,build:T},Symbol.toStringTag,{value:"Module"}));export{se as c};
