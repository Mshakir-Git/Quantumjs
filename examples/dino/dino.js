
import { game,renderer } from "../../index.js"
//import game from './index.js'
// const {setGlobalShader} =renderer
// setGlobalShader((px, i)=>(i-game.vp.x)>50&&(i-game.vp.x)<100?px={...px,b:int(px.b/2)}:px)
const int=n=>Math.floor(n)
//const o=new game.GameObject(10,20,1,"oooooo\no    o\no    o\noooooo")
const cco=new game.GameObject(0,-10,1,
{text:"oooooo\no    o\no    o\noooooo",
color:{r:100,g:50,b:20},tile:{x:0,y:3}})

const ko=new game.GameObject(10,11,1,{
text:"oooooo\no    o\no    o\noooooo",
// image:"assets/dino.png",
name:"dino",
tile:{x:0,y:3},
collision:{bounds:[]},
velocity:{x:0,y:0},
color:{r:100,g:50,b:200},
children:[
	cco
]
})
const bg=new game.GameObject(0,26,3,{
image:"assets/bg1.png",tile:{x:50,y:0}})
const bgsky=new game.GameObject(0,0,4,{image:"assets/bgsky.png",tile:{x:50,y:0}})
const gr=new game.GameObject(0,46,3,{
image:"assets/bg2.png",tile:{x:50,y:0},collision:{bounds:[{x:0,y:0,w:200,h:60}]} })

const ob=new game.GameObject(0,46,2,{text:game.utils.rep("_",3000)+"\n"+game.utils.rep("- -",1000),color:{r:70,g:200,b:70}})
const cob=new game.GameObject(0,5,2,{text:"001"})
const cob2=new game.GameObject(game.vp.width-12,5,2,{text:"Score: 0"})
const spike1=new game.GameObject(game.vp.width-30,45,1,
	{text:" # \n#*#",tile:{x:5,y:5},collision:{bounds:[]},color:{r:209,g:0,b:20}})
//dynamic keyframes {y: funcName} if(typeof val == function) obj[key]=val()

const jump = new game.Animation([{ y: ko.y, key: 0 }, { y: ko.y-6, key: 0.4 },{ y: ko.y-6, key: 0.7 }, { y: ko.y, key: 1 }], 350)

const w=new game.Scene([ko,gr,bg,bgsky,spike1],[cob2])
game.Scene.setScene(w)
let canjump=false
w.setEvents((key)=>{
	if(key.name=="f"){
	  /*  w.addObj(
	            new game.Kobj(ko.x+7,ko.y,2,"o",true,{x:40,y:0})
	   )*/
	//    ko.reverse()
	w.objs.forEach(o=>{
		console.log(o.image,o.y)
	})
	process.exit()
    return
  }
  if(key.name=="left"){
  	ko.x-=1
  	// game.vp.x=ko.x-10
  }
  if(key.name=="right"){
      ko.x+=1
     game.vp.x=ko.x-10                                       
          }
      if(key.name=="up"){
      	ko.y-=2
      }
      if(key.name=="down"){
      	ko.y+=2
      }
  if(key.name=="k"&&canjump){
	canjump=false
	ko.y-=10
	// ko.play(jump)
	// ko.y=ko.y-5
	// setTimeout(()=>{ko.y=ko.y+5;canjump=true},25000/(ko.velocity.x||1))
	// setTimeout(()=>{canjump=true},25000/(ko.velocity.x||1))

	}
})

game.setCollision((a,b)=>{
	if(a==ko||b==ko){
		if(a==gr||b==gr){canjump=true;return}
		ko.velocity={x:0,y:0}
		ko.color="\x1b[38;2;200;0;0m"
		process.stdout.write("\x1b[31m")        
		setTimeout(()=>{
		process.stdout.write("     GAME OVER  \x1b[37m \n")
		process.exit()
		},200)
	}
	if(a.txt=="o"&&b!=ko){
	    b.arr=[]
	}
})

setInterval(()=>{
	// if(canjump){ko.velocity={x:0,y:0}}
	// else {ko.velocity={x:0,y:10}}
    // game.vp.x=ko.x-10
    // ko.velocity.x+=0.01
   // game.vp.x=ko.x-10
},30)

let score=0
let spikes=[]
let objAddLoop=()=>{
spikes=spikes.filter(s=>{
	if(s.x<ko.x){
		score++
		cob2.setText("Score: "+score)
		return false
	}
	return true
})
const spike=new game.GameObject(game.vp.x+game.vp.width,45,1,
{text:" #\n#*#",tile:{x:0,y:0},image:"assets/spike.png",collision:{bounds:[]},color:{r:209,g:0,b:20}})
spikes.push(spike)
w.addObj(
	spike
)
/*w.addObj(
    new game.Obj(game.vp.x+game.vp.width+int(Math.random()*10),3+int(Math.random()*5),2,{text:"  --- ---",color:{r:100,g:100,b:200}})
)*/
setTimeout(objAddLoop,5000)
}
objAddLoop()

game.play()
