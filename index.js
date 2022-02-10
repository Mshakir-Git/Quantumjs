console.clear()
/*var baudio = require('baudio');
var b = baudio(function (t) {
    var x = Math.sin(t * 3602);
    return x;
});*/
const TW=process.stdout.columns
const TH=process.stdout.rows
console.log(TH)
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
    constructor(newobjs){
     this.objs=[...newobjs].sort((a,b)=>b.z-a.z)
    }
    addObj(obj){
        this.objs.push(obj)
        this.sort()
    }
    sort(){
    	this.objs.sort((a,b)=>b.z-a.z)
    }
}
class Obj {
    constructor(x,y,z,txt,col=false){
     this.x=x
     this.y=y
     this.z=z
     this.txt=txt
     this.collision=col
     this.arr=txt.split("\n").map(i=>i.split(""))
     this.maxx=x+this.getMaxx([...this.arr])
    }
    getMaxx(arr){
    return arr.sort((a,b)=>b.length-a.length)[0].length
    }
}
class Kobj extends Obj{
	constructor(x,y,z,txt,col,vel){
      super(x,y,z,txt,col)
      this.velocity=vel
	}
}
const viewport={
	x:0,y:0,
	width:TW,height:40,
}
const vp = viewport
const oframe=[...Array(viewport.height).keys()].map(y=>{
return [...Array(viewport.width).keys()].map(xi=>" ")
})
const o=new Obj(10,20,1,"oooooo\no    o\no    o\noooooo")
const ko=new Kobj(10,22,1," ##----\n[###] ",true,{x:10,y:0})
const ob=new Obj(0,23,2,rep("_",3000)+"\n"+rep("- -",1000))
const w=new World([ob,ko])
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
    frame[vy+indy][vx+indx]=tx
             }
    	 	})
    	)
    })
    
    const textFrame=frame.map(i=>i.join("")).join("\n")
	return textFrame
}

let n=0
let gameLoop=setInterval(()=>{
const frame=drawFrame()
process.stdout.write('\033[H\x1B[?25l'+frame+'\n')

},20)
const K_TIME=30
let sideLoop=setInterval(()=>{
w.objs.filter(o=>(o instanceof Kobj)).forEach(o=>{
	o.x+=o.velocity.x*(K_TIME/1000)
	o.y+=o.velocity.y*(K_TIME/1000)
})
viewport.x=ko.x-10
},K_TIME)
let objAddLoop=setInterval(()=>{
w.addObj(
	new Obj(vp.x+vp.width,22,2," #\n#*#",true)
)
},3000)

var canjump=true
function event(key){
if(key.name=="f"){
	w.addObj(
	     new Kobj(ko.x+7,ko.y,2,"o",true,{x:40,y:0})
	 )
	 return 
}
 if(canjump){
 canjump=false
 ko.y=ko.y-5
 setTimeout(()=>{ko.y=ko.y+5;canjump=true},1000)
 }
}

function rep(s,n){
	let sn=""
	for(let i =0;i<n;i++){
		sn+=s
	}
	return sn
}
function collision(a,b){
	if(a==ko){
		ko.velocity={x:0,y:0}
		process.stdout.write("\033[31m")        
		setTimeout(()=>{
		process.stdout.write("     GAME OVER  \033[37m \n")
		process.exit()
		},200)
	}
	if(a.txt=="o"&&b!=ko){
	    b.arr=[]
	}
}
