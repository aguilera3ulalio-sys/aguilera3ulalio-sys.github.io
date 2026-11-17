import{n as e,r as t,s as n,t as r}from"./react-three-fiber.esm-C0owY3f8.js";import{o as i,r as a,t as o}from"./index-8JPQZKtU.js";var s=i(a(),1),c=o(),l=`
  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    // Position on the unit sphere, which is what I draw the seams against.
    vPos = normalize(position);
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`,u=`
  uniform vec3 uBase;
  uniform vec3 uSeam;
  uniform vec3 uRim;
  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec3 vView;

  // Cheap hash so the leather gets a pebbled grain without a texture.
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  void main() {
    vec3 p = vPos;

    // The seams of a basketball: two great circles plus one loop on each side.
    float d = min(abs(p.y), abs(p.x));
    float loops = abs(abs(p.x) - (0.48 + 0.36 * p.y * p.y));
    d = min(d, loops);
    float seam = 1.0 - smoothstep(0.016, 0.030, d);

    // Pebble grain.
    float grain = hash(floor(p * 80.0));

    // Simple lighting done by hand: one key light, a soft fill, a rim glow.
    vec3 n = normalize(vNormal);
    vec3 key = normalize(vec3(0.55, 0.75, 0.65));
    float diff = max(dot(n, key), 0.0);
    float fill = max(dot(n, normalize(vec3(-0.7, -0.2, 0.4))), 0.0) * 0.18;
    float fres = pow(1.0 - max(dot(n, vView), 0.0), 2.6);
    vec3 h = normalize(key + vView);
    float spec = pow(max(dot(n, h), 0.0), 36.0) * 0.28;

    vec3 col = uBase * (0.14 + diff + fill) * (0.88 + 0.22 * grain);
    col = mix(col, uSeam, seam);
    col += uRim * fres * 0.85;
    col += spec * (1.0 - seam);

    gl_FragColor = vec4(col, 1.0);
  }
`;function d({reducedMotion:r}){let i=(0,s.useRef)(null),a=(0,s.useRef)(null),o=(0,s.useRef)(null),d=(0,s.useRef)(null),{viewport:f}=t(),p=(0,s.useRef)({x:0,y:0});(0,s.useEffect)(()=>{let e=e=>{p.current.x=e.clientX/window.innerWidth*2-1,p.current.y=e.clientY/window.innerHeight*2-1};return window.addEventListener(`pointermove`,e,{passive:!0}),()=>window.removeEventListener(`pointermove`,e)},[]);let m=(0,s.useMemo)(()=>({uBase:{value:new n(`#ff5a1f`)},uSeam:{value:new n(`#0b0b0c`)},uRim:{value:new n(`#ffb38a`)}}),[]),h=(0,s.useMemo)(()=>{let e=new Float32Array(1260);for(let t=0;t<420;t++){let n=2.2+Math.random()*5,r=Math.random()*Math.PI*2,i=Math.acos(2*Math.random()-1);e[t*3]=n*Math.sin(i)*Math.cos(r),e[t*3+1]=n*Math.sin(i)*Math.sin(r),e[t*3+2]=n*Math.cos(i)-1.5}return e},[]);return e((e,t)=>{let n=r?0:e.clock.elapsedTime,s=Math.min(f.width,f.height)*.34,c=1-Math.exp(-t*5),l=i.current;l.position.x+=(p.current.x*.12-l.position.x)*c,l.position.y+=(-p.current.y*.08-l.position.y)*c,l.scale.setScalar(l.scale.x+(s-l.scale.x)*c),l.rotation.x+=(p.current.y*.25-l.rotation.x)*c,l.rotation.z+=(-p.current.x*.12-l.rotation.z)*c,a.current.rotation.y=n*.25,a.current.rotation.x=.35,o.current.rotation.z=n*.08,o.current.rotation.y=n*.05,d.current.rotation.y=n*.015}),(0,c.jsxs)(c.Fragment,{children:[(0,c.jsxs)(`group`,{ref:i,scale:.001,children:[(0,c.jsxs)(`mesh`,{ref:a,rotation:[.35,.6,0],children:[(0,c.jsx)(`sphereGeometry`,{args:[1,96,96]}),(0,c.jsx)(`shaderMaterial`,{vertexShader:l,fragmentShader:u,uniforms:m})]}),(0,c.jsxs)(`group`,{ref:o,children:[(0,c.jsxs)(`mesh`,{rotation:[Math.PI/2.3,.3,0],children:[(0,c.jsx)(`torusGeometry`,{args:[1.55,.004,8,180]}),(0,c.jsx)(`meshBasicMaterial`,{color:`#f2efe8`,transparent:!0,opacity:.4})]}),(0,c.jsxs)(`mesh`,{rotation:[Math.PI/1.7,-.5,.4],children:[(0,c.jsx)(`torusGeometry`,{args:[1.85,.003,8,180]}),(0,c.jsx)(`meshBasicMaterial`,{color:`#ff5a1f`,transparent:!0,opacity:.55})]})]})]}),(0,c.jsxs)(`points`,{ref:d,children:[(0,c.jsx)(`bufferGeometry`,{children:(0,c.jsx)(`bufferAttribute`,{attach:`attributes-position`,args:[h,3]})}),(0,c.jsx)(`pointsMaterial`,{color:`#f2efe8`,size:.018,sizeAttenuation:!0,transparent:!0,opacity:.55})]})]})}function f(){let e=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;return(0,c.jsx)(r,{className:`ball-canvas`,style:{pointerEvents:`none`},camera:{position:[0,0,8],fov:35},dpr:[1,1.5],gl:{antialias:!0,alpha:!0,powerPreference:`high-performance`},"aria-hidden":`true`,children:(0,c.jsx)(d,{reducedMotion:e})})}export{f as default};