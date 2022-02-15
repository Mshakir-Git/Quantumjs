
const x=require('./index.js')
console.log(x)

const o=new x.Obj(10,20,1,"oooooo\no    o\no    o\noooooo")
console.log(o)
const ko=new x.Kobj(10,22,1," ##----\n[###] ",true,{x:10,y:0})
//const ob=new x.Obj(0,23,2,rep("_",3000)+"\n"+rep("- -",1000))
const cob=new x.Obj(0,5,2,"001")
//const cob2=new x.Obj(vp.width-12,5,2,"Score: 0")
const w=new x.World([ko],[cob])
x.setScene(w)
x.setEvents((key)=>{
	if(key.name=="f"){
	    w.addObj(
	            new x.Kobj(ko.x+7,ko.y,2,"o",true,{x:40,y:0})
	   )
    return
  }
})
x.play()
