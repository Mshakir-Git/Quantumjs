console.clear()
/*var baudio = require('baudio');
var b = baudio(function (t) {
    var x = Math.sin(t * 3602);
    return x;
});*/

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
    constructor(x,y,z,txt){
     this.x=x
     this.y=y
     this.z=z
     this.txt=txt
     this.arr=txt.split("\n").map(i=>i.split(""))
     this.maxx=x+this.getMaxx([...this.arr])
    }
    getMaxx(arr){
    return arr.sort((a,b)=>b.length-a.length)[0].length
    }
}
const viewport={
	x:0,y:0,
	width:57,height:30,
}
const vp = viewport
const oframe=[...Array(viewport.height).keys()].map(y=>{
return [...Array(viewport.width).keys()].map(xi=>" ")
})
const o=new Obj(10,20,1,"oooooo\no    o\no    o\noooooo")
const ob=new Obj(0,23,2,rep("_",3000)+"\n"+rep("- -",1000))
const w=new World([ob,o])
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
    //for each object fill the respective cells in frame
    filter.forEach(i=>{
        const maxx=i.x
    	const vx=i.x-viewport.x
    	const vy=i.y-viewport.y
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
let sideLoop=setInterval(()=>{
o.x++
viewport.x=o.x-10
},70)
let objAddLoop=setInterval(()=>{
w.addObj(
	new Obj(vp.x+vp.width,22,2," #\n#*#")
)
},3000)

var canjump=true
function event(key){
 if(canjump){
 canjump=false
 o.y=o.y-5
 setTimeout(()=>{o.y=o.y+5;canjump=true},1000)
 }
}

function rep(s,n){
	let sn=""
	for(let i =0;i<n;i++){
		sn+=s
	}
	return sn
}
