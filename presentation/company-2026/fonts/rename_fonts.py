from fontTools.ttLib import TTFont
import os
src='fonts/'; dst='bfonts/'
jobs=[('Manrope-400-normal.ttf','Bridge Manrope','Regular',400,False),
      ('Manrope-600-normal.ttf','Bridge Manrope SemiBold','Regular',600,False),
      ('Manrope-800-normal.ttf','Bridge Manrope ExtraBold','Regular',800,False),
      ('PlayfairDisplay-400-normal.ttf','Bridge Playfair','Regular',400,False),
      ('PlayfairDisplay-400-italic.ttf','Bridge Playfair','Italic',400,True)]
for f,fam,sub,wt,it in jobs:
    t=TTFont(src+f); n=t['name']
    for rid in (16,17,21,22,25): n.removeNames(nameID=rid)
    full=fam if sub=='Regular' else f'{fam} {sub}'
    ps=(fam.replace(' ','')+'-'+sub)
    for pid,eid,lid in ((3,1,0x409),(1,0,0)):
        n.setName(fam,1,pid,eid,lid); n.setName(sub,2,pid,eid,lid); n.setName(full,4,pid,eid,lid)
        n.setName(ps,6,pid,eid,lid); n.setName(f'{ps};bridge',3,pid,eid,lid)
    os2=t['OS/2']; os2.fsType=0
    sel=os2.fsSelection & ~(0b1100001)  # clear italic, bold, regular
    sel |= 1 if it else 0b1000000
    os2.fsSelection=sel
    t['head'].macStyle = 2 if it else 0
    out=dst+ps+'.ttf'; t.save(out); print(out, os.path.getsize(out))
