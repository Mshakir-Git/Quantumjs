
const game=require('./index.js')

const int=n=>Math.floor(n)
const o=new game.Obj(10,20,1,"oooooo\no    o\no    o\noooooo")

const ko=new game.Kobj(10,22,1," ##----\n[###] ",true,{x:20,y:0})
const ob=new game.Obj(0,23,2,game.rep("_",3000)+"\n"+game.rep("- -",1000))
const cob=new game.Obj(0,5,2,"001")
const cob2=new game.Obj(game.vp.width-12,5,2,"Score: 0")
const w=new game.World([ob,ko],[cob,cob2])
game.setScene(w)
let canjump=true
game.setEvents((key)=>{
	if(key.name=="f"){
	    w.addObj(
	            new game.Kobj(ko.x+7,ko.y,2,"o",true,{x:40,y:0})
	   )
    return
  }
  if(canjump){
	canjump=false
	ko.y=ko.y-5
	setTimeout(()=>{ko.y=ko.y+5;canjump=true},12000/(ko.velocity.x||1))
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
const spike=new game.Obj(game.vp.x+game.vp.width,22,2," #\n#*#",true)
spikes.push(spike)
w.addObj(
	spike
)
w.addObj(
    new game.Obj(game.vp.x+game.vp.width+int(Math.random()*10),3+int(Math.random()*5),2,"  --- ---",true)
)
setTimeout(objAddLoop,30000/(ko.velocity.x||1))
}
objAddLoop()

game.play()
