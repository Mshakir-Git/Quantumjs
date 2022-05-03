
const game=require('../../../Quantum.js')
//import game from './index.js'

const int=n=>Math.floor(n)
//const o=new game.GameObject(10,20,1,"oooooo\no    o\no    o\noooooo")
const cco=new game.GameObject(0,-10,1,
{text:"oooooo\no    o\no    o\noooooo",
color:{r:100,g:50,b:20},})
const ko=new game.GameObject(10,40,1,{
image:"assets/dino.png",
collision:true,
velocity:{x:35,y:0},
color:{r:100,g:50,b:200},
children:[
	cco
]
})
const bg=new game.GameObject(0,26,3,{
image:"assets/bg1.png",tile:50})
const bgsky=new game.GameObject(0,0,4,{image:"assets/bgsky.png",tile:50})
const gr=new game.GameObject(0,46,3,{
image:"assets/bg2.png",tile:50})

const ob=new game.GameObject(0,46,2,{text:game.rep("_",3000)+"\n"+game.rep("- -",1000),color:{r:70,g:200,b:70}})
const cob=new game.GameObject(0,5,2,{text:"001"})
const cob2=new game.GameObject(game.vp.width-12,5,2,{text:"Score: 0"})

//dynamic keyframes {y: funcName} if(typeof val == function) obj[key]=val()

const jump = new game.Animation([{ y: ko.y, key: 0 }, { y: ko.y-6, key: 0.4 },{ y: ko.y-6, key: 0.7 }, { y: ko.y, key: 1 }], 350)

const w=new game.Scene([ko,gr,bg,bgsky],[cob2])
game.setScene(w)
let canjump=true
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
  /*if(key.name=="left"){
  	ko.x-=2
  	game.vp.x=ko.x-10
  }
  if(key.name=="right"){
      ko.x+=2
      game.vp.x=ko.x-10                                            }*/
  if(canjump){
	canjump=false
	ko.play(jump)
	// ko.y=ko.y-5
	// setTimeout(()=>{ko.y=ko.y+5;canjump=true},25000/(ko.velocity.x||1))
	setTimeout(()=>{canjump=true},25000/(ko.velocity.x||1))

	}
})

game.setCollision((a,b)=>{
	if(a==ko){
		ko.velocity={x:0,y:0}
		ko.color="\x1b[38;2;200;0;0m"
		process.stdout.write("\033[31m")        
		setTimeout(()=>{
		process.stdout.write("     GAME OVER  \033[37m \n")
		process.exit()
		},200)
	}
	if(a.txt=="o"&&b!=ko){
	    b.arr=[]
	}
})

setInterval(()=>{
    game.vp.x=ko.x-10
    ko.velocity.x+=0.01
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
const spike=new game.GameObject(game.vp.x+game.vp.width,44,2,
{text:" #\n#*#",image:"assets/spike.png",collision:true,color:{r:209,g:0,b:20}})
spikes.push(spike)
w.addObj(
	spike
)
/*w.addObj(
    new game.Obj(game.vp.x+game.vp.width+int(Math.random()*10),3+int(Math.random()*5),2,{text:"  --- ---",color:{r:100,g:100,b:200}})
)*/
setTimeout(objAddLoop,50000/(ko.velocity.x||1))
}
objAddLoop()

game.play()
