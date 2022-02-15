console.clear()
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
    event(key)
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
    constructor(x,y,z,txt,col=false){
     this.x=x
     this.y=y
     this.z=z
     this.txt=txt
     this.collision=col
     this.color="\x1b[38;2;200;100;0m"
     this.arr=txt.split("\n").map(i=>i.split(""))
     this.setText=t=>{this.arr=t.split("\n").map(i=>i.split(""))}
     this.maxx=x+this.getMaxx([...this.arr])
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

const drawFrame=()=>{
    //new empty frame
    const frame=oframe.map(i=>[...i])
    //filter all objs and get currently visible ones
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
    	i.arr.forEach((ii,indy)=>
    	 	ii.forEach((tx,indx)=>{
    	   	if(vx+indx<viewport.width){
    frame[vy+indy][vx+indx]=
    (i.color||"")+tx+"\033[37m"
             }
            //maybe add collisions here
    	 	})
    	)
    })
    w.canvasObjs.forEach(i=>{
            const maxx=i.x
            const vx=int(i.x)
            const vy=int(i.y)
            i.arr.forEach((ii,indy)=>
                ii.forEach((tx,indx)=>{
                if(vx+indx<viewport.width){
        frame[vy+indy][vx+indx]=
        (i.color||"")+tx+"\033[37m"
                 }
                //maybe add collisions here
                })
            )
        })
    
    const textFrame=frame.map(i=>i.join("")).join("\n")
	return textFrame
}

let n=0
let gameLoop=()=>{
    const frame=drawFrame()
    process.stdout.write('\033[H\x1B[?25l'+frame+'\n')
    setTimeout(gameLoop,0)
    }
const K_TIME=30
let sideLoop=()=>{
    w.objs.filter(o=>(o instanceof Kobj)).forEach(o=>{
        o.x+=o.velocity.x*(K_TIME/1000)
        o.y+=o.velocity.y*(K_TIME/1000)
    })

    setTimeout(sideLoop,K_TIME)
    }

const KINEMATICS=true

const play=()=>{
gameLoop()
if(KINEMATICS){sideLoop()}
}
exports.play=play

event=e=>{}
exports.setEvents=(e)=>{
	event=e
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

