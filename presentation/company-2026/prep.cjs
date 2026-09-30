const sharp=require('sharp'),fs=require('fs'),QR=require('qrcode');
const P=require('path').join(__dirname,'../../public/'),A=__dirname+'/assets/';
const CARBON={r:13,g:12,b:11};
// px per inch target
async function crop(src,out,w,h,{pos='centre',mod=null,grad=null,q=86}={}){
  let img=sharp(P+src).resize(w,h,{fit:'cover',position:pos});
  if(mod) img=mod(img);
  let buf=await img.toBuffer();
  if(grad){ // svg gradient overlay baked in
    const svg=Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><defs>${grad.defs}</defs><rect width="${w}" height="${h}" fill="url(#g)"/>${grad.extra||''}</svg>`);
    buf=await sharp(buf).composite([{input:svg}]).toBuffer();
  }
  await sharp(buf).jpeg({quality:q,mozjpeg:true}).toFile(A+out);
}
const lin=(x1,y1,x2,y2,stops)=>`<linearGradient id="g" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o,c,a])=>`<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`;
const warm=img=>img.modulate({saturation:0.78}).tint({r:255,g:240,b:220}).gamma(1.05);
fs.mkdirSync(A,{recursive:true});
(async()=>{
  // logo recolour
  const svg=fs.readFileSync(P+'bridge 2.svg','utf8');
  await sharp(Buffer.from(svg.replace(/#5E5E5E/gi,'#F4EFE6'))).resize(1400).png().toFile(A+'logo-paper.png');
  await sharp(Buffer.from(svg.replace(/#5E5E5E/gi,'#1A1816'))).resize(1400).png().toFile(A+'logo-ink.png');
  // cover full bleed 1920x1080
  await crop('poster-elegant.jpg','cover.jpg',1920,1080,{pos:'right',grad:{defs:lin(0,0,1,0,[[0,'#0D0C0B',0.96],[0.38,'#0D0C0B',0.78],[0.62,'#0D0C0B',0.15],[1,'#0D0C0B',0.0]])+''}});
  // about: portrait left panel 5.2 x 7.5 in
  await crop('hero-bg2.png','about.jpg',780,1125,{pos:'left',mod:warm,grad:{defs:lin(0,0,0,1,[[0,'#0D0C0B',0],[0.55,'#0D0C0B',0.05],[1,'#0D0C0B',0.85]])}});
  // stats bg
  await crop('academy-hero.png','stats.jpg',1920,1080,{grad:{defs:lin(0,0,0,1,[[0,'#0D0C0B',0.92],[0.45,'#0D0C0B',0.6],[1,'#0D0C0B',0.93]])}});
  // fidic bg subtle
  await crop('academy-atmosphere.png','fidic.jpg',1920,1080,{grad:{defs:lin(0,0,1,0,[[0,'#0D0C0B',0.9],[1,'#0D0C0B',0.55]])}});
  // projects
  await crop('olympic city.jpg','p-olympic.jpg',1100,675,{mod:warm});
  await crop('tashkent-invest-company.png','p-tic.jpg',1100,675,{mod:warm});
  await crop('kamchik.avif','p-kamchik.jpg',1100,675,{mod:warm});
  await crop('project-water-samarkand.jpg','p-water.jpg',1400,560,{mod:warm});
  await crop('academy-mod-2.png','svc.jpg',900,600,{});
  // why bg
  await crop('hero-bg.png','why.jpg',1920,1080,{pos:'right',grad:{defs:lin(0,0,1,0,[[0,'#0D0C0B',0.97],[0.5,'#0D0C0B',0.82],[1,'#0D0C0B',0.35]])}});
  // contact bg
  await crop('poster-ultra.jpg','contact.jpg',1920,1080,{pos:'right',grad:{defs:lin(0,0,1,0,[[0,'#0D0C0B',0.97],[0.55,'#0D0C0B',0.85],[1,'#0D0C0B',0.4]])}});
  // portraits duotone 3:4
  const duo=img=>img.grayscale().linear(1.05,-4).tint({r:216,g:196,b:168});
  const ppl=[['larisa-belousova.jpg','t-larisa.jpg','north'],['ernest.jpg','t-ernest.jpg','attention'],['lucia.jpg','t-lucia.jpg','north'],['olga.jpg','t-olga.jpg','attention']];
  for(const [s,o,pos] of ppl) await crop(s,o,600,800,{pos:pos==='attention'?sharp.strategy.attention:pos,mod:duo,q:88});
  await sharp(P+'anna.png').extract({left:330,top:150,width:318,height:422}).resize(600,800).grayscale().linear(1.05,-4).tint({r:216,g:196,b:168}).jpeg({quality:88,mozjpeg:true}).toFile(A+'t-anna.jpg');
  // mono logos: ink with alpha from darkness
  const logos=['ADB logo stacked.png','wb.webp','EBRD-Logo-1991.webp','lcia-logo.png','ciarb-logo.png','drbf-logo.png','icaa-logo.png','bureau-veritas.png'];
  for(const [i,l] of logos.entries()){
    const {data,info}=await sharp(P+l).flatten({background:'#ffffff'}).trim({threshold:12}).resize({height:360,withoutEnlargement:false}).raw().toBuffer({resolveWithObject:true});
    const out=Buffer.alloc(info.width*info.height*4);
    for(let p=0;p<info.width*info.height;p++){
      const r=data[p*info.channels],g=data[p*info.channels+1],b=data[p*info.channels+2];
      const lum=(0.299*r+0.587*g+0.114*b)/255;
      let a=Math.min(1,Math.max(0,(1-lum)*1.35));
      out[p*4]=26;out[p*4+1]=24;out[p*4+2]=22;out[p*4+3]=Math.round(a*255);
    }
    await sharp(out,{raw:{width:info.width,height:info.height,channels:4}}).png().toFile(A+`logo-${i}.png`);
    console.log(l,info.width,info.height);
  }
  // QR
  await QR.toFile(A+'qr.png','https://www.bridgeconsult.uz',{margin:0,width:800,color:{dark:'#F4EFE6',light:'#0D0C0B'},errorCorrectionLevel:'M'});
  console.log('done');
})();
