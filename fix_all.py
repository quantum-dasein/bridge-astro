import re

std_three_js_script = """    <script>
    (function(){
        window._threeQ=window._threeQ||[];
        window._threeQ.push(function(){stdInitThreeJs();});
        if(typeof THREE!=='undefined'){stdInitThreeJs();return;}
        if(document.getElementById('pf3d-three-js')){return;}
        var s=document.createElement('script');
        s.id='pf3d-three-js';
        s.src='https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.min.js';
        s.onload=function(){(window._threeQ||[]).forEach(function(cb){cb();});window._threeQ=[];};
        s.onerror=function(){};
        document.head.appendChild(s);
        function stdInitThreeJs(){
            var canvas=document.getElementById('std-bg');
            var section=document.getElementById('standards');
            if(!canvas||typeof THREE==='undefined')return;
            var W=section.offsetWidth,H=section.offsetHeight;
            var renderer=new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:false});
            renderer.setSize(W,H);renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
            var scene=new THREE.Scene();
            var camera=new THREE.PerspectiveCamera(60,W/H,0.1,100);
            camera.position.z=7;
            var N=80,pPos=new Float32Array(N*3),vel=new Float32Array(N*2);
            for(var i=0;i<N;i++){pPos[i*3]=(Math.random()-.5)*22;pPos[i*3+1]=(Math.random()-.5)*14;pPos[i*3+2]=(Math.random()-.5)*3-1;vel[i*2]=(Math.random()-.5)*.007;vel[i*2+1]=(Math.random()-.5)*.005;}
            var ptGeo=new THREE.BufferGeometry();ptGeo.setAttribute('position',new THREE.BufferAttribute(pPos,3));
            var pts=new THREE.Points(ptGeo,new THREE.PointsMaterial({color:0x8A7B66,size:0.055,transparent:true,opacity:0.65,sizeAttenuation:true}));
            scene.add(pts);
            var MAXL=300,lPos=new Float32Array(MAXL*6),lGeo=new THREE.BufferGeometry();
            lGeo.setAttribute('position',new THREE.BufferAttribute(lPos,3));lGeo.setDrawRange(0,0);
            var lMesh=new THREE.LineSegments(lGeo,new THREE.LineBasicMaterial({color:0x8A7B66,transparent:true,opacity:0.18}));
            scene.add(lMesh);
            var mx=0,my=0,cx=0,cy=0;
            section.addEventListener('mousemove',function(e){var r=section.getBoundingClientRect();mx=(e.clientX-r.left)/r.width-.5;my=(e.clientY-r.top)/r.height-.5;});
            (function loop(){
                requestAnimationFrame(loop);
                cx+=(mx*.7-cx)*.03;cy+=(-my*.45-cy)*.03;
                camera.position.x=cx;camera.position.y=cy;
                for(var i=0;i<N;i++){pPos[i*3]+=vel[i*2];pPos[i*3+1]+=vel[i*2+1];if(pPos[i*3]>12)pPos[i*3]=-12;if(pPos[i*3]<-12)pPos[i*3]=12;if(pPos[i*3+1]>8)pPos[i*3+1]=-8;if(pPos[i*3+1]<-8)pPos[i*3+1]=8;}
                ptGeo.attributes.position.needsUpdate=true;
                var lc=0;
                for(var i=0;i<N&&lc<MAXL;i++){for(var j=i+1;j<N&&lc<MAXL;j++){var dx=pPos[i*3]-pPos[j*3],dy=pPos[i*3+1]-pPos[j*3+1],d=dx*dx+dy*dy;if(d<16){lPos[lc*6]=pPos[i*3];lPos[lc*6+1]=pPos[i*3+1];lPos[lc*6+2]=pPos[i*3+2];lPos[lc*6+3]=pPos[j*3];lPos[lc*6+4]=pPos[j*3+1];lPos[lc*6+5]=pPos[j*3+2];lc++;}}}
                lGeo.setDrawRange(0,lc*2);lGeo.attributes.position.needsUpdate=true;
                renderer.render(scene,camera);
            })();
            window.addEventListener('resize',function(){var W2=section.offsetWidth,H2=section.offsetHeight;renderer.setSize(W2,H2);camera.aspect=W2/H2;camera.updateProjectionMatrix();});
        }
    })();
    </script>\n"""

pf_loader_old = """    (function(){
        if(document.getElementById('pf3d-three-js'))return;
        var s=document.createElement('script');
        s.id='pf3d-three-js';
        s.src='https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.min.js';
        s.onload=function(){pfInitThreeJs();};
        s.onerror=function(){/* silent fallback \xe2\x80\x94 particles skipped */};
        document.head.appendChild(s);
    })();"""

pf_loader_new = """    (function(){
        window._threeQ=window._threeQ||[];
        window._threeQ.push(function(){pfInitThreeJs();});
        if(typeof THREE!=='undefined'){pfInitThreeJs();return;}
        if(document.getElementById('pf3d-three-js')){return;}
        var s=document.createElement('script');
        s.id='pf3d-three-js';
        s.src='https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.min.js';
        s.onload=function(){(window._threeQ||[]).forEach(function(cb){cb();});window._threeQ=[];};
        s.onerror=function(){};
        document.head.appendChild(s);
    })();"""

logo_css_old = '    #team img.grayscale{filter:grayscale(1) brightness(2.2)!important;opacity:.85!important;}\n    #team a.group:hover img{filter:brightness(1.05)!important;opacity:1!important;}'
logo_css_new = '    #team img.grayscale{filter:brightness(0) invert(1)!important;opacity:.65!important;}\n    #team a.group:hover img{filter:brightness(1.1)!important;opacity:1!important;}\n    #team .text-gray-600.font-bold{color:rgba(240,237,232,.8)!important;}'

news_bridge = '<div aria-hidden="true" style="height:60px;background:linear-gradient(to bottom,#292724,#1a1816);margin:0;"></div>\n'

files = [
    r'C:\Users\user\Documents\bridge-astro\public\index.html',
    r'C:\Users\user\Documents\bridge-astro\public\EN\index.html',
    r'C:\Users\user\Documents\bridge-astro\public\UZ\index.html',
]

for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()

    short = path.split('\\')[-2] + '/' + path.split('\\')[-1]

    # 1. Add id="standards" and replace blob with canvas
    old_std_open = '<section class="py-32 bg-bridge-dark relative overflow-hidden font-sans">\n    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150vw] md:w-[800px] aspect-square max-w-[800px] bg-bridge-taupe/20 rounded-full blur-[100px] md:blur-[150px] pointer-events-none"></div>'
    new_std_open = '<section id="standards" class="py-32 bg-bridge-dark relative overflow-hidden font-sans">\n    <canvas id="std-bg" aria-hidden="true" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:.5;"></canvas>'
    if old_std_open in c:
        c = c.replace(old_std_open, new_std_open, 1)
        print(f'{short}: 1. Standards header ok')
    else:
        print(f'{short}: 1. WARN standards header not found')

    # 2. Add Three.js script before close of standards section
    old_std_close = '\n    </div>\n</section>\n\n<section class="py-32 relative overflow-hidden bg-bridge-dark font-sans">'
    new_std_close = '\n    </div>\n' + std_three_js_script + '</section>\n\n<section class="py-32 relative overflow-hidden bg-bridge-dark font-sans">'
    if old_std_close in c:
        c = c.replace(old_std_close, new_std_close, 1)
        print(f'{short}: 2. Three.js script ok')
    else:
        print(f'{short}: 2. WARN standards close not found')

    # 3. Portfolio loader update
    if pf_loader_old in c:
        c = c.replace(pf_loader_old, pf_loader_new, 1)
        print(f'{short}: 3. Portfolio loader ok')
    else:
        print(f'{short}: 3. WARN portfolio loader not found')

    # 4. Logo CSS fix
    if logo_css_old in c:
        c = c.replace(logo_css_old, logo_css_new, 1)
        print(f'{short}: 4. Logo CSS ok')
    else:
        # Try without the last line (UZ/EN might differ)
        logo_css_old2 = '    #team img.grayscale{filter:grayscale(1) brightness(2.2)!important;opacity:.85!important;}\n    #team .group:hover img.grayscale{filter:brightness(1.05)!important;opacity:1!important;}'
        if logo_css_old2 in c:
            c = c.replace(logo_css_old2, logo_css_new, 1)
            print(f'{short}: 4. Logo CSS ok (alt)')
        else:
            print(f'{short}: 4. WARN logo CSS not found')

    # 5. News bridge
    news_marker = '<!-- НОВОСТНОЙ БЛОК                                           -->\n<!-- ======================================================== -->\n<section id="news"'
    if news_marker in c:
        c = c.replace(news_marker, news_marker.replace('<section id="news"', news_bridge + '<section id="news"'), 1)
        print(f'{short}: 5. News bridge ok')
    elif news_bridge + '<section id="news"' not in c and '<section id="news"' in c:
        c = c.replace('<section id="news"', news_bridge + '<section id="news"', 1)
        print(f'{short}: 5. News bridge ok (simple)')
    else:
        print(f'{short}: 5. News bridge already present or not found')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print()
