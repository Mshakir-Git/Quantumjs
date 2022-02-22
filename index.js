console.clear()
const Jimp=require("jimp")


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
/*var baudio = require('baudio');
var b = baudio(function (t) {
    var x = Math.sin(t * 3602);
    return x;
});*/
//echo -e "\033[31;42m\u2580\033[37;49m"
const TW=process.stdout.columns
const TH=process.stdout.rows

const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
if (key.ctrl) {
    process.exit();
   } else {
    events(key)
   }
})


const int=n=>Math.floor(n)
class World {
    constructor(newobjs,canobjs){
     this.objs=[...newobjs].sort((a,b)=>b.z-a.z)
     this.canvasObjs=[...canobjs].sort((a,b)=>b.z-a.z)
    }
    addObj(obj){
        this.objs.push(obj)
        this.sort()
    }
    sort(){
    	this.objs.sort((a,b)=>b.z-a.z)
    }
}
exports.World=World
let w={}
const setScene=s=>{w=s}
exports.setScene=setScene
class Obj {
//options, collider collision trigger, children
    constructor(x,y,z,opts){
     this.x=x
     this.y=y
     this.z=z
     this.txt=opts.text||""
     this.image=opts.image
     this.pixels=null
     this.tile=opts.tile
     this.image?this.getPixels():null
     this.collision=opts.collision
     this.color=opts.color?`\x1b[38;2;${opts.color.r};${opts.color.g};${opts.color.b}m`:""
     this.velocity=opts.velocity
     this.children=opts.children?opts.children.map(function(c){return{...c,parent:this}}):null
     this.arr=this.txt.split("\n").map(i=>i.split(""))
     this.setText=t=>{this.arr=t.split("\n").map(i=>i.split(""))}
     this.maxx=x+this.getMaxx([...this.arr])
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
   
    }
    reverse(){
    	this.pixels=this.pixels.map(row=>row.reverse())
    }
    
    getMaxx(arr){
    return arr.sort((a,b)=>b.length-a.length)[0].length
    }
}
exports.Obj=Obj
class Kobj extends Obj{
	constructor(x,y,z,txt,col,vel){
      super(x,y,z,txt,col)
      this.velocity=vel
	}
}
exports.Kobj=Kobj
const viewport={
	x:0,y:0,
	width:TW,height:TH-6>40?40:TH-6,
}
const vp = viewport
exports.vp=vp
const oframe=[...Array(viewport.height).keys()].map(y=>{
return [...Array(viewport.width).keys()].map(xi=>" ")
})
const combinePixel=(p1,p2,bg)=>{
let p1n=`\x1b[48;2;${p1.r};${p1.g};${p1.b}m`
let p2n=`\x1b[38;2;${p2.r};${p2.g};${p2.b}m\u2580`
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
	//return p2.a>0?`${p1n}${p2n}`:`${p1n}\x1b[38;2;20;16;20m\u2580`
	return `${p1n}${p2n}`
/*let x2=int((p2.r+p2.g+p2.b)/3)
let x1=int((p1.r+p1.g+p1.b)/3)
	return `\x1b[38;2;${x1};${x1};${x1}m\x1b[48;2;${x2};${x2};${x2}m\u2580`*/
	
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

                  
        const iny=item.y>=viewport.y&&
                  item.y<viewport.y+viewport.height
    	return inx && iny
    })
    
    //console.time()
    //collision detection
    const colls=filter.filter(o=>o.collision)
    colls.forEach(o=>{
    	colls.forEach(i=>{
    	if(o!=i){
    		const ix=int(i.x)
    		const iy=int(i.y)
    		const ox=int(o.x)
    	    const oy=int(o.y)
    	  i.arr.forEach((iarr,indyi)=>{
    	  	o.arr.forEach((oarr,indyo)=>{
    	  		iarr.forEach((iar,indxi)=>{
    	  		    oarr.forEach((oar,indxo)=>{                         if(indxi+ix==indxo+ox&&indyi+iy==indyo+oy){
    	  		if(oar!=" "&&iar!=" "){collision(o,i)}
    	  		            }
    	  	  })
    	  	})
    	  })
    	})

    }
    })
    })
    //console.timeEnd()
    
    //for each object fill the respective cells in frame
    filter.forEach(i=>{
     
        const maxx=i.x
    	const vx=int(i.x-viewport.x)
    	const vy=int(i.y-viewport.y)
    	
    	i.image?
    	 i.pixels?
    	  i.pixels.forEach((ii,indy)=>
    	              ii.forEach((px,indx)=>{
    	              if(vx+indx<viewport.width&&indy%2==0){
   const px2=i.pixels[indy+1]?i.pixels[indy+1][indx]:
   {r:0,g:0,b:0,a:0}
    	      px.a>0||px2.a>0?frame[vy+int(indy/2)][vx+indx]=
`${combinePixel(px2,px,frame[vy+int(indy/2)][vx+indx])}\x1b[37m\x1b[48;2;0;0;0m`:null
    	               }
    	              //maybe add collisions here
    	              })
    	          )
    	 :null//add pixel data loop
    	:i.arr.forEach((ii,indy)=>
    	 	ii.forEach((tx,indx)=>{
    	   	if(vx+indx<viewport.width){
    frame[vy+indy][vx+indx]=
    (i.color||"")+"\x1b[48;2;0;0;0m"+tx+"\033[37m"
             }
            //maybe add collisions here
    	 	})
    	)
    	/* children part

    	i.children?i.children.forEach(j=>{
    	        
    	        const jvx=int(vx+j.x)
    	        const jvy=int(vy+j.y)
    	        j.arr.forEach((ii,indy)=>
    	            ii.forEach((tx,indx)=>{
    	            if(jvx+indx<viewport.width){
    	    frame[jvy+indy][jvx+indx]=
    	    (j.color||"")+tx+"\033[37m"
    	             }
    	            //maybe add collisions here
    	            })
    	        )
    	
    	    }):null
    	    */
    	
    })
    w.canvasObjs.forEach(i=>{
            const maxx=i.x
            const vx=int(i.x)
            const vy=int(i.y)
            i.arr.forEach((ii,indy)=>
                ii.forEach((tx,indx)=>{
                if(vx+indx<viewport.width){
        frame[vy+indy][vx+indx]=
        (i.color||"")+'\x1b[48;2;0;0;0m'+tx+"\033[37m"
                 }

                })
            )
        })
    
    const textFrame=frame.map(i=>i.join("")).join("\n")
	return textFrame
}

let n=10
let gameLoop=()=>{
//console.time()
    w.objs.filter(o=>o.velocity).forEach(o=>{
           o.x+=o.velocity.x*(40/1000)
           o.y+=o.velocity.y*(40/1000)
      })
    const frame=drawFrame()
console.time()
    process.stdout.write('\033[H\x1B[?25l'+frame+'\n')
    /*if(n==0){
    fs.writeFile('mynewfile3.txt', '\033[H\x1B[?25l'+frame+'\n',()=>{})
    setTimeout(()=>process.exit(),1000)
    }
    n--*/
console.timeEnd()
    setTimeout(gameLoop,80)
    }
const K_TIME=30
let sideLoop=()=>{
    w.objs.filter(o=>o.velocity).forEach(o=>{
        o.x+=o.velocity.x*(K_TIME/1000)
        o.y+=o.velocity.y*(K_TIME/1000)
    })

    setTimeout(sideLoop,K_TIME)
    }

const KINEMATICS=false
var fs = require('fs');
const play=()=>{
gameLoop()
if(KINEMATICS){sideLoop()}
}
exports.play=play

event=e=>{}
exports.setEvents=(e)=>{
	events=e
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

