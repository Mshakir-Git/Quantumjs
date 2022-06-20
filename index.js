console.clear()

//TODO jimp to getpixels
const Jimp=require("jimp")

const makeBox=(w,h,c)=>{
     return [...Array(h)].map(row=>{
         return [...Array(w)].map(px=>c)
     })
}
const makeCircle=(r,c)=>{
const d=r*2
      return [...Array(d)].map((row,y)=>{
         return [...Array(d)].map((px,x)=>{
         if(Math.sqrt((x-r)**2 + (y-r)**2)<=r &&x!=0&&y!=0) return c
         else return {r:0,g:0,b:0,a:0}
         })
   })
 }

const make= async (img)=>{

const image=await Jimp.read(img)
const pixels=[]
let row=[]
image.scan(0, 0, image.bitmap.width, image.bitmap.height, function
(x, y, idx) {
const d=this.bitmap.data
const p={r:d[idx + 0],g:d[idx + 1],b:d[idx + 2],a:d[idx + 3]};
row.push(p)
if(x==image.bitmap.width-1){pixels.push(row);row=[]}
})
return pixels

}
exports.loadImage=make
/*var baudio = require('baudio');
var b = baudio(function (t) {
    var x = Math.sin(t * 3602);
    return x;
});*/
//echo -e "\033[31;42m\u2580\033[37;49m"
const mouse_enabled=true
if(mouse_enabled){process.stdout.write("\x1b[?1002h")}

let mouse_ev=(k,x,y)=>{}
exports.setMouseEvents=mev=>{mouse_ev=mev}
const mouseEvent=(k,x,y)=>{if(k==0){
mouse_ev(k,(x-1),(y-1)*2)	
}
/*
console.log("Mouse Event : ",k,(x-1),(y-1)*2)
const obbj=new GameObject((x-1),(y-1)*2, 1, {})
obbj.image="custom"
obbj.pixels=makeCircle(8,{r:250,g:0,b:20,a:255})
w.addObj(obbj)*/
}
let count=0
let mouseArr=[]
const TW=process.stdout.columns
const TH=process.stdout.rows

const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
if (key.ctrl&&key.name=="c") {
    process.stdout.write("\x1b[?1002l")
    process.stdout.write("\x1B[?25h")
    process.exit();
   } else {
   if(count){
   count--;mouseArr.push(key.sequence.charCodeAt(0)-32);
   if(count==0){mouseEvent(...mouseArr);mouseArr=[]};return}
   
   if(key.sequence=="\x1b[M"){
      //console.log(key.sequence.charCodeAt(0)-32)
      //console.log(key)
      count=3
   }
//    console.log(rep(" ",30),prev_frame[0][0])
    events(key)
   }
})


const int=n=>Math.floor(n)

class Animation {
    constructor(keyFrames, time){
        this.keyFrames=keyFrames
        this.time=time
        this.startTime=0
        this.loop=false
        this.iterpolate=true
    }

}
exports.Animation=Animation

class Scene {
    constructor(newobjs,canobjs){
     this.objs=[...newobjs].sort((a,b)=>b.z-a.z)
     this.canvasObjs=[...canobjs].sort((a,b)=>b.z-a.z)
     this.events=()=>{}
    }
    addObj(obj){
        this.objs.push(obj)
        this.sort()
    }
    remove(obj){
    	this.objs=this.objs.filter(o=>o!=obj)
    	this.sort()
    }
    sort(){
    	this.objs.sort((a,b)=>b.z-a.z)
    }
    setEvents(e){
        this.events=e
        events=e
    }
}
exports.Scene=Scene
let w={}
//set scene sets the scene to newScene and events to newScene.events
const setScene=s=>{w=s;events=s.events}
exports.setScene=setScene
class GameObject {
//options, collider collision trigger, children
    constructor(x,y,z,opts){
     this.x=x
     this.y=y
     this.z=z
     this.txt=opts.text||""
     this.image=opts.image
     this.name=opts.name
     this.scale=opts.scale?opts.scale:{x:1,y:1}
     this.pixels=null
     this.tile=opts.tile
     this.collision=opts.collision
     this.pixels=opts.pixels?opts.pixels:[]
     this.image?this.getPixels():null
     this.color=opts.color?opts.color:{r:255,g:255,b:255}
     this.velocity=opts.velocity
     this.children=opts.children?opts.children.map(function(c){return{...c,parent:this}}):null
     this.arr=this.txt.split("\n").map(i=>i.split(""))
     this.setText=t=>{this.arr=t.split("\n").map(i=>i.split(""))}
     this.maxx=x+this.getMaxx([...this.arr])
     this.animation=null
    }
    async getPixels(){
    	this.pixels=await make(this.image)
    	//console.log(this.tile)
    	//process.exit()
    	if(this.tile){
    	this.pixels=this.pixels.map(r=>{
 return [...Array(this.tile)].reduce((a,rw)=>a.concat(r),[])
    	})}
     	this.arr=this.pixels.reduce((acc,row,ri)=>{
    	 if(ri%2==0){
    	 	return [...acc,row.map(px=>px.a>0?"#":" ")]
    	 } else {return acc} 	
    	},[])
    	this.maxx=this.x+this.getMaxx([...this.arr])
        if(this.collision){
            if(!this.collision.bounds||this.collision.bounds.length===0){
                this.collision.bounds=[{x:0,y:0,w:this.pixels[0].length,h:this.pixels.length}]
            }
        }
   
    }
    getScaledPixels(){
        if(this.scaledPixels&&this.scaledPixels.length==this.pixels.length*this.scale.y&&this.scaledPixels[0].length==this.pixels[0].length*this.scale.x){

        } else {
            const tempArr=[]
            this.pixels.forEach(row=>{
                const tempRow=[]
                row.forEach(item=>{
                    [...Array(Math.round(this.scale.x))].forEach(xx=>{tempRow.push(item)})
                })
                const tempNum=[...Array(Math.round(this.scale.y))]
                tempNum.forEach(yy=>{tempArr.push(tempRow)})  
            })
            this.scaledPixels=tempArr
        }
        return this.scaledPixels
    }
    reverse(){
    	this.pixels=this.pixels.map(row=>row.reverse())
    }
    reverseY(){
            this.pixels=this.pixels.reverse()
        }
    
    getMaxx(arr){
    return arr.sort((a,b)=>b.length-a.length)[0].length
    }
    play(animation){
        animation.startTime=0
        this.animation=animation
    }
}
exports.GameObject=GameObject
class Kobj extends GameObject{
	constructor(x,y,z,txt,col,vel){
      super(x,y,z,txt,col)
      this.velocity=vel
	}
}
exports.Kobj=Kobj
const viewport={
	x:0,y:0,
	width:TW,height:(TH-6)*2,
}
	// width:TW,height:(TH-6>70?70:TH-6)*2,

const vp = viewport
exports.vp=vp
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

const compress=(frame)=>{
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
const setAnimationFrame=(gameObject, currentTime)=>{
    const anim=gameObject.animation
    if(anim.startTime==0){anim.startTime=currentTime}
    let elapsedTime=currentTime-anim.startTime
    let currentFrame={}
    let nextFrame={}
    anim.keyFrames.forEach((frame,index)=>{
        if(frame.key*anim.time<=elapsedTime){
            currentFrame=frame
            nextFrame=index+1<anim.keyFrames.length? anim.keyFrames[index+1]: null
        }
    })
    Object.keys(currentFrame).forEach(key=>{
        //&& elapsedTime <= anim.time
        if(key!='key'){
                const deltaTime=nextFrame?(nextFrame.key - currentFrame.key)*anim.time:0 //0.2*1000
                const elapsedTimeSince=nextFrame?elapsedTime- (currentFrame.key*anim.time):0//50
            
            // console.log("\n\n")
            // if(!nextFrame){console.log(currentFrame);process.exit()}
            // setTimeout(()=>{process.exit()},400)
            gameObject[key]=anim.iterpolate && nextFrame?currentFrame[key] + (nextFrame[key]-currentFrame[key])*(elapsedTimeSince/deltaTime):currentFrame[key]
        }
        
    })
    //loop anim
    if(elapsedTime>anim.time && anim.loop){
        anim.startTime=currentTime
        elapsedTime=0
    }
}
const drawFrame=()=>{
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
    //collision detection
    // const colls=filter.filter(o=>o.collision)
    // colls.forEach(o=>{
    // 	colls.forEach(i=>{
    // 	if(o!=i){
    // 		const ix=int(i.x)
    // 		const iy=int(i.y/2)
    // 		const ox=int(o.x)
    // 	    const oy=int(o.y/2)
    // 	  i.arr.forEach((iarr,indyi)=>{
    // 	  	o.arr.forEach((oarr,indyo)=>{
    // 	  		iarr.forEach((iar,indxi)=>{
    // 	  		    oarr.forEach((oar,indxo)=>{                         if(indxi+ix==indxo+ox&&indyi+iy==indyo+oy){
    // 	  		if(oar!=" "&&iar!=" "){collision(o,i)}
    // 	  		            }
    // 	  	  })
    // 	  	})
    // 	  })
    // 	})

    // }
    // })
    // })
    const colls=filter.filter(o=>o.collision)
    colls.forEach(o=>{
    	colls.forEach(i=>{
    	if(o!=i){
            o.collision.bounds?o.collision.bounds.forEach(ob=>{
                i.collision.bounds?i.collision.bounds.forEach(ib=>{
                    let [x,xw,y,yw]=[i.x +ib.x,i.x+(ib.w*i.scale.x),i.y+ib.y,i.y+(ib.h*i.scale.y)]
                    let [ox,oxw,oy,oyw]=[o.x +ob.x,o.x+(ob.w*o.scale.x),o.y+ob.y,o.y+(ob.h*o.scale.y)]
                    // if(i.name=="dino"||o.name=="dino"){}
                    if(x>=ox&&x<=oxw||xw>=ox&&xw<=oxw||x>=ox&&xw<=oxw||ox>=x&&oxw<=xw){
                        if(y>=oy&&y<=oyw||yw>=oy&&yw<=oyw||y>=oy&&yw<=oyw||oy>=y&&oyw<=yw){
                            // console.log(rep(" ",20)+[x,xw,y,yw],[ox,oxw,oy,oyw])
                        collision(o,i)
                        }
                    }
                }):null
            }):null
                // let [x,xw,y,yw]=[i.x,i.x,i.y,i.y]
                // if(i.pixels){xw+=i.pixels[0].length;yw+=i.pixels.length}
                // else       {xw+=i.arr[0].length;yw+=i.arr.length*2}
                // let [ox,oxw,oy,oyw]=[o.x,o.x,o.y,o.y]
                // if(o.pixels){oxw+=o.pixels[0].length;oyw+=o.pixels.length}
                // else       {oxw+=o.arr[0].length;oyw+=o.arr.length*2}

                // if(x>=ox&&x<=oxw||xw>=ox&&xw<=oxw||x>=ox&&xw<=oxw||ox>=x&&oxw<=xw){
                //     if(y>=oy&&y<=oyw||yw>=oy&&xw<=oyw||y>=oy&&yw<=oyw||oy>=y&&oyw<=yw){
                //         // console.log(rep(" ",20)+[x,xw,y,yw],[ox,oxw,oy,oyw])
                //     collision(o,i)
                //     }
                // }


    }
    })
    })
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

   for(let indx=vx<0?-vx:0;indx<(ii.length>-vx+vp.width?-vx+vp.width:ii.length);indx++){
    	         if(i.x+indx>=vp.x&&vx+indx<viewport.width){//instead of foreach use for smhow
const px=ii[indx]
let newX=indx
let newY=indy
    	      px.a>0&&frame[vy+newY]?frame[vy+newY][vx+newX]=mixPixels(frame[vy+newY][vx+newX],px):null
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



let hint=""
//var stdout = require('stdout-stream');
//var exec = require('child_process').execFile
let gameLoop=()=>{
console.time()
 /*   w.objs.filter(o=>o.velocity).forEach(o=>{
           o.x+=o.velocity.x*(40/1000)
           o.y+=o.velocity.y*(40/1000)
      })*/
 //  const writer=process.stdout
 //  writer.uncork()
   
   const aframe=drawFrame()
   console.time("c")
   const frame=compress(aframe)
   console.timeEnd("c")
  // const frame=[...Array(1000)].map((x,i)=>`\x1b[48;2;${int(Math.random()*255)};${int(Math.random()*255)};${int(Math.random()*255)}m\x1b[38;2;${int(Math.random()*255)};${int(Math.random()*255)};${int(Math.random()*255)}m\u2580`).join('')
   //console.timeEnd()
//console.time()
  // outsideframe=frame;
   process.stdout.write('\033[H\x1B[?25l'+frame+'\n\033[37m\x1b[48;2;0;0;0m')

   hint.length>0?process.stdout.write(hint.substring(0,TW)+ rep(" ",TW-hint.length) +"\n"):null

   
   //const writer=process.stdout
 //  writer.cork()
//   writer.write('\033[H\x1B[?25l'+frame+'\n\033[37m\x1b[48;2;0;0;0m')
  // writer.cork()
   
   //exec("echo hello")
  // exec('\033[H\x1B[?25l'+frame+'\n\033[37m\x1b[48;2;0;0;0m')
   
 // stdout.write('\033[H\x1B[?25l'+frame+'\n\033[37m\x1b[48;2;0;0;0m')
   /*if(n==0){
    fs.writeFile('mynewfile3.txt', '\033[H\x1B[?25l'+frame+'\n',()=>{})
    setTimeout(()=>process.exit(),1000)
    }
    n--*/
console.timeEnd()
console.log(__dirname)
//writer.end()
    setTimeout(gameLoop,50)
    }
/*var outsideframe=""
const lopp=()=>{
	process.stdout.write('\033[H\x1B[?25l'+outsideframe+'\n\033[37m\x1b[48;2;0;0;0m',()=>lopp())
}
lopp()*/
const K_TIME=30
let sideLoop=()=>{
    w.objs.filter(o=>o.velocity).forEach(o=>{
        o.x+=o.velocity.x*(K_TIME/1000)
        o.y+=o.velocity.y*(K_TIME/1000)
    })

    setTimeout(sideLoop,K_TIME)
    }

const KINEMATICS=true
var fs = require('fs');
const { MIME_X_MS_BMP } = require("jimp")
const play=()=>{
gameLoop()
if(KINEMATICS){sideLoop()}
}
exports.play=play

let events=e=>{}
exports.setEvents=(e)=>{
	events=e
}

exports.setHint=(h)=>{
	hint=h
}


function rep(s,n){
	let sn=""
	for(let i =0;i<n;i++){
		sn+=s
	}
	return sn
}
exports.rep=rep

let collision=(a,b)=>{}
exports.setCollision=(col_func)=>{
    collision=col_func
}








// USEFULL JUNK

// ROTATION
// if(ii.length<=14 && (i.image=="assets/tank2.png" || i.image=="examples/dino/assets/dino.png" )){

// //move origin to pivot point
// //rotate
// //move origin back to 0,0
// let angle=i.angle||0
// angle=angle*Math.PI/180
// const r=Math.sqrt((indx-(ii.length/2))**2  +  (indy-(i.pixels.length/2))**2)

// // newX=Math.round(r * Math.cos(Math.atan2((indy-(i.pixels.length/2)),(indx-(ii.length/2))) +  angle)  + (ii.length/2))
// // newY=Math.round(r * Math.sin(Math.atan2((indy-(i.pixels.length/2)),(indx-(ii.length/2))) +  angle)  + (i.pixels.length/2))

// const xxx=Math.round(r * Math.cos(Math.atan2((indy-(i.pixels.length/2)),(indx-(ii.length/2))) +  angle)  + (ii.length/2))
// const yyy=Math.round(r * Math.sin(Math.atan2((indy-(i.pixels.length/2)),(indx-(ii.length/2))) +  angle)  + (i.pixels.length/2))
// tempArr.push({x:xxx,y:yyy})
// newX=int(xxx);newY=int(yyy);
// // process.exit()
// }
// const rot=ii.length>14?0:int(indy)
// const rot2=ii.length>14?0:int(indx)

//ASCII
   // (i.color||"")+"\x1b[48;2;0;0;0m"+tx+"\033[37m"

//COMPRESS
	/*
	 let same=true
	 row.forEach((px,i)=>{
	 	if(i>0){same=same&&objequals(px.fg,row[i-1].fg)&&objequals(px.bg,row[i-1].bg)&&px.c==row[i-1].c}
	 })
	 if(same){
	 
	  let px=row[0]
	 	return `\x1b[38;2;${px.fg.r};${px.fg.g};${px.fg.b}m\x1b[48;2;${px.bg.r};${px.bg.g};${px.bg.b}m${rep(' ',row.length)}`
	 }
	 */

//COMBINE PIXEL
    //let p1n=`\x1b[48;2;${p1.r};${p1.g};${p1.b}m`
//let p2n=`\x1b[38;2;${p2.r};${p2.g};${p2.b}m\u2580`
/*let p1n=p1.r>20?".":" "
let p2n=p2.r>20?".":" "
if(bg){
const bgdata=bg.split('\x1b[')
const bg1=bgdata.find(t=>t.indexOf("48;")==0)
const bg2=bgdata.find(t=>t.indexOf("38;")==0)
if(bg1){
p1n=p1.a>0?p1n:"\x1b["+bg1
}
if(bg2){
p2n=p2.a>0?p2n:"\x1b["+bg2
}
}
*/
	//return p2.a>0?`${p1n}${p2n}`:`${p1n}\x1b[38;2;20;16;20m\u2580`
	//return `${p1n}${p2n}`
/*let x2=int((p2.r+p2.g+p2.b)/3)
let x1=int((p1.r+p1.g+p1.b)/3)
	return `\x1b[38;2;${x1};${x1};${x1}m\x1b[48;2;${x2};${x2};${x2}m\u2580`*/
	