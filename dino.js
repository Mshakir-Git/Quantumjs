
const game=require('./index.js')

const int=n=>Math.floor(n)
//const o=new game.Obj(10,20,1,"oooooo\no    o\no    o\noooooo")
const cco=new game.Obj(0,-10,1,
{text:"oooooo\no    o\no    o\noooooo",
color:{r:100,g:50,b:20},})
const ko=new game.Obj(10,20,1,{
image:"dino.png",
collision:true,
velocity:{x:70,y:0},
color:{r:100,g:50,b:200},
children:[
	cco
]
})
const bg=new game.Obj(0,13,3,{
image:"bg1.png",tile:10})
const gr=new game.Obj(0,23,3,{
image:"gr3.png",tile:10})

const ob=new game.Obj(0,23,2,{text:game.rep("_",3000)+"\n"+game.rep("- -",1000),color:{r:70,g:200,b:70}})
const cob=new game.Obj(0,5,2,{text:"001"})
const cob2=new game.Obj(game.vp.width-12,5,2,{text:"Score: 0"})

const w=new game.World([ko,gr,bg],[cob2])
game.setScene(w)
let canjump=true
game.setEvents((key)=>{
	if(key.name=="f"){
	  /*  w.addObj(
	            new game.Kobj(ko.x+7,ko.y,2,"o",true,{x:40,y:0})
	   )*/
	   ko.reverse()
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
	ko.y=ko.y-5
	setTimeout(()=>{ko.y=ko.y+5;canjump=true},52000/(ko.velocity.x||1))
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
    ko.velocity.x+=0.01
    game.vp.x=ko.x-10
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
const spike=new game.Obj(game.vp.x+game.vp.width,22,2,
{text:" #\n#*#",image:"spike.png",collision:true,color:{r:209,g:0,b:20}})
spikes.push(spike)
w.addObj(
	spike
)
w.addObj(
    new game.Obj(game.vp.x+game.vp.width+int(Math.random()*10),3+int(Math.random()*5),2,{text:"  --- ---",color:{r:100,g:100,b:200}})
)
setTimeout(objAddLoop,90000/(ko.velocity.x||1))
}
objAddLoop()

game.play()
