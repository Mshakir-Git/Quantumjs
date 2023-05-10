import { TW,TH } from "../config.js"
import { setAnimationFrame } from "../animation/animation.js"
import { checkGlobalCollisions } from "../physics/physics.js"
const int=n=>Math.floor(n)


// width:TW,height:(TH-8)*2,

//TODO: Take this common
const viewport={
	x:0,y:0,
	width:TW,height:(TH-8)*2,
}
	// width:TW,height:(TH-6>70?70:TH-6)*2,

const vp = viewport
//oframe might cause pass by ref issues
const oframe=[...Array(viewport.height).keys()].map(y=>{
return [...Array(viewport.width).keys()].map(xi=>{return {r:0,g:0,b:0,a:0} })
})
let prev_frame=[...Array(int(viewport.height/2)).keys()].map(y=>{
    return [...Array(viewport.width).keys()].map(xi=>{return {fg:{r:0,g:0,b:0,a:0},bg:{r:0,g:0,b:0,a:0},c:"\u2580"} })
    })
const objequals=(obj1,obj2)=>{
	let equals=true
	Object.keys(obj1).forEach(k=>{
		equals = equals&&obj1[k]==obj2[k]
	})
	return equals
}


//TODO: Move shade
function shade(px,i,j,frame){
    return px
//     if(j>26&&frame[50-j]){
//       let r=frame[50-j][i]
//       return {c:r.c,fg:
// {r:(r.bg.r-30)>0?(r.bg.r-30):0,g:(r.bg.g-30)>0?(r.bg.g-30):0,b:80}, bg:
// {r:(r.fg.r-30)>0?(r.fg.r-30):0,g:(r.fg.g-30)>0?(r.fg.g-30):0,b:80}}
//     }
   // return px
	return (vp.x-i)>120&&(vp.x-i)<170?{...px,fg:{r:255-px.fg.r,g:255-px.fg.g,b:255-px.fg.b},bg:{r:255-px.bg.r,g:255-px.bg.g,b:255-px.bg.b}}:px
}

const compressFrame=(frame)=>{
//return console.log(frame[0][0],frame[22][0])
let pfg={r:"s",g:"s",b:"s"}
let pbg={r:"s",g:"s",b:"s"}
let frameStr=""
let j=0
let new_prev=[]
let moved_already=false
	while(j<frame.length){
    let row=frame[j]
    let row2=frame[j+1]
    let row_prev=prev_frame[int(j/2)]
    let new_prev_row=[]
    moved_already=false

	let rowStr=""

	let i=row.length+1

	while(--i){
        let px={}
        if(row[row.length-i].c||row2[row2.length-i].c){
            //Ascii
            if(row[row.length-i].c){px=row[row.length-i]}  
            if(row2[row2.length-i].c){px=row2[row2.length-i]}

        }
        else {

            //pixel based
            let pxb=shade(row[row.length-i],row.length-i,frame.length-j,frame)
            let pxb2=shade(row2[row2.length-i],row.length-i,frame.length-j,frame) //fix j coords
            px=combinePixel(pxb,pxb2)
        }
        //Diff rendering (check with prev frame)
        new_prev_row.push(px)
        let moveTostr=""
        let px_prev=row_prev[row.length-i]
        if(px.fg.r==px_prev.fg.r&&px.fg.b==px_prev.fg.b&&px.fg.g==px_prev.fg.g&&px.bg.r==px_prev.bg.r&&px.bg.b==px_prev.bg.b&&px.bg.g==px_prev.bg.g&&px.c==px_prev.c){
        moved_already=false
            continue
        } else {
        if(!moved_already){
            moveTostr=`\x1b[${int(j/2)};${row.length-i+1}H`
            moved_already=true
            }
        }
        

	let fgstr=(px.fg.r==pfg.r&&px.fg.b==pfg.b&&px.fg.g==pfg.g)?"":`\x1b[38;2;${px.fg.r};${px.fg.g};${px.fg.b}m`
	let bgstr=(px.bg.r==pbg.r&&px.bg.b==pbg.b&&px.bg.g==pbg.g)?"":`\x1b[48;2;${px.bg.r};${px.bg.g};${px.bg.b}m`
	pfg={...px.fg}
	pbg={...px.bg}

	rowStr+=px.c?`${moveTostr}${fgstr}${bgstr}${px.c}`:`${moveTostr}${fgstr}${bgstr} `
	
    

	}
    new_prev.push(new_prev_row)
	frameStr+= rowStr +""
   
        j+=2
	}
    // set cursor to (TW,TH)
    prev_frame=new_prev
	return frameStr + `\x1b[${int(vp.height/2)};${vp.width}H`
}

const combinePixel=(p1,p2,bg)=>{

let p1n=p1.a>0?p1:(bg?bg.fg:{r:0,g:0,b:0})
let p2n=p2.a>0?p2:(bg?bg.bg:{r:0,g:0,b:0})
let c=" "
if(p1n.r==p2n.r&&p1n.g==p2n.g&&p1n.b==p2n.b){
 c=" "	
} else {
 c="\u2580"
}
	return {fg:p1,bg:p2,c:c}

}

//mix alpha for tranparency
const mixPixels=(p1,p2)=>{
    if(!p1){return p2}
    const p2_o=p2.a/255
    const p1_o=1-p2_o
    return {r:int(p1.r*p1_o)+int(p2.r*p2_o),g:int(p1.g*p1_o)+int(p2.g*p2_o),b:int(p1.b*p1_o)+int(p2.b*p2_o),a:255}
}

const makeFrame=(w)=>{
    //new empty frame
    const frame=oframe.map(i=>[...i])
    //filter all objs and get currently visible ones
  /*  const allobjs=w.objs.reduce((all,o)=>
 o.children?all.concat([o,...o.children]):all.concat([o]
    ),[])*/
    const filter=w.objs.filter(item=>{
        const inx=(viewport.x>item.x&&
                  viewport.x<=item.maxx)||
                  (viewport.x+viewport.width>item.x&&
                   viewport.x+viewport.width<=item.maxx)||
                   (viewport.x<=item.x&&
                     viewport.x+viewport.width>item.maxx)

                  
        // const iny=item.y>=viewport.y&&
        //           item.y<viewport.y+viewport.height
        const iny=(viewport.y>item.y&&
            viewport.y<=item.arr.length*2)||
            (viewport.y+viewport.height>item.y&&
             viewport.y+viewport.height<=item.arr.length*2)||
             (viewport.y<=item.y&&
               viewport.y+viewport.height>item.arr.length*2)
    	return inx && iny
    })
    
    console.time("collision")

    const colls=filter.filter(o=>o.collision)
    w.visibleColliders=colls
    checkGlobalCollisions(colls)
    console.timeEnd("collision")
    console.time("img")
    //for each object fill the respective cells in frame
    filter.forEach(i=>{

      //Animations: Set current Animation frame
      if(i.animation){setAnimationFrame(i,+new Date())}

        //Object x,y relative to camera
    	const vx=int(i.x-viewport.x)
    	const vy=int(i.y-viewport.y)
    	
    	!i.txt?
    	 i.pixels&&i.pixels.length?
    	  i.getScaledPixels().forEach((ii,indy)=>{
            //change above foreach to for also (not all y, just visible y)
   for(let indx=vx<0?-vx:0;indx<(ii.length>-vx+vp.width?-vx+vp.width:ii.length);indx++){
    	         if(i.x+indx>=vp.x&&vx+indx<viewport.width){//instead of foreach use for smhow
const px=ii[indx]
let newX=indx
let newY=indy
//move origin to pivot point
//rotate
//move origin back to 0,0
let angle=i.angle||0
if(angle!=0){
    angle=angle*Math.PI/180
    const xo=(indx-(ii.length/2))
    const yo=(indy-(i.pixels.length/2))
    const r=Math.sqrt(xo**2  +  yo**2)
    const sinAngle=Math.sin(angle)
    const cosAngle=Math.cos(angle)
    // r * cos(a+b) + origindiff
    newX=Math.round((xo*cosAngle) - (yo*sinAngle)   + (ii.length/2))
    newY=Math.round((yo*cosAngle) + (xo*sinAngle)   + (i.pixels.length/2))
}
if(i.x+newX>=vp.x&&vx+newX<viewport.width&&i.y+newY>=vp.y&&vy+newY<viewport.height){
    //shift above condition to above for loops(once done)
    	      px.a>0&&frame[vy+newY]?frame[vy+newY][vx+newX]=mixPixels(frame[vy+newY][vx+newX],i.shader?i.shader(px,indx,indy,i.pixels):px):null
}  
            
            }
    	              }
    	              }     
    	          )
    	 :null
    	:i.arr.forEach((ii,indy)=>
    	 	ii.forEach((tx,indx)=>{
    	   	if(vx+indx<viewport.width){
    frame[vy+indy][vx+indx]={fg:i.color,bg:{r:0,g:0,b:0},c:
    tx}
    

             }
    	 	})
    	)
    	// children part (ascii ony)

    	// i.children?i.children.forEach(j=>{
    	        
    	//         const jvx=int(vx+j.x)
    	//         const jvy=int(vy+j.y)
    	//         j.arr.forEach((ii,indy)=>
    	//             ii.forEach((tx,indx)=>{
    	//             if(jvx+indx<viewport.width){
    	//     frame[jvy+indy][jvx+indx]={fg:j.color,bg:{r:0,g:0,b:0},c:tx}
    	//     //(j.color||"")+tx+"\033[37m"
    	//              }
    	//             //maybe add collisions here
    	//             })
    	//         )
    	
    	//     }):null
    	    
    })//END-Filter Objects loop
    console.timeEnd("img")

    w.canvasObjs.forEach(i=>{
            const vx=int(i.x)
            const vy=int(i.y)
            i.arr.forEach((ii,indy)=>
                ii.forEach((tx,indx)=>{
                if(vx+indx<viewport.width){
        frame[vy+indy][vx+indx]={fg:i.color,bg:{r:0,g:0,b:0},c:tx}
                 }

                })
            )
        })
    
	return frame
}
const drawFrame=(frame)=>{
   process.stdout.write('\x1b[H\x1B[?25l'+frame+'\n'+'\x1b[37m\x1b[48;2;0;0;0m')
}
export {compressFrame,makeFrame,drawFrame,vp}