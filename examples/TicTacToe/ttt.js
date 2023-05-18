import { game } from "../../index.js"

const makeBox=(w,h,c,b)=>{
     return [...Array(h)].map((row,y)=>{
         return [...Array(w)].map((px,x)=>{
         if(x==0||y==0||x==w-1||y==h-1) return b
         else return c
         })
     })
}
const row_reverse=a=>{
	const b=a.map(aitem=>[])
	a.forEach((ay,iy)=>{
		ay.forEach((item,ix)=>{
			b[ix][iy]=item
		})
	})
return b
}

const bw=30
const bh=30
const s=new game.Scene([],[])
let arr=[["","",""],["","",""],["","",""]]
let cellArr=[]
let touchToReset=false

const cell=makeBox(bw,bh,{r:50,g:50,b:50,a:255},{r:230,g:230,b:230,a:255})
const cell2=makeBox(bw,bh,{r:250,g:50,b:50,a:255},{r:230,g:230,b:230,a:255})
const cell3=makeBox(bw,bh,{r:50,g:250,b:50,a:255},{r:230,g:230,b:230,a:255})
const cell4=makeBox(bw,bh,{r:50,g:50,b:50,a:255},{r:130,g:130,b:230,a:255})
let player="x"

const makeCells=()=>{
arr.forEach((iy,y)=>{
	iy.forEach((ix,x)=>{
	 const co=new game.GameObject(x*bw,y*bh +2,3,{})
	 co.image="custom"
	 co.pixels=cell
	 cellArr.push(co)
	 s.addObj(co)
	})
})
}
makeCells()

game.setMouseEvents((k,x,y)=>{
if(touchToReset){reset();touchToReset=false;return}
 arr.forEach((iy,ay)=>{
     iy.forEach((ix,ax)=>{
       if(ix==""&&x>ax*bw&&x<=(ax+1)*bw&&y>ay*bh&&y<=(ay+1)*bh){
      // console.log(s.objs[1])
       	arr[ay][ax]=player
       //	console.log(arr)
       const xoro=player=="x"?"x22.png":"o2.png"
       	const co=new game.GameObject(ax*bw,ay*bh +2,1,{
       		image:"assets/"+xoro
       	})
       	     //co.image="custom"
       	     //co.pixels=player=="x"?cell2:cell3
       	s.addObj(co)
       	player=player=="x"?"o":"x"
       	checkWin()
       }
     })
   })
	//s.remove(s.objs[3])
})
const checkWin=()=>{
	arr.forEach(row=>{
	if(row.toString()=="x,x,x") win("x")
	if(row.toString()=="o,o,o") win("o")
	})
	row_reverse(arr).forEach(row=>{
	    if(row.toString()=="x,x,x") win("x")
	    if(row.toString()=="o,o,o") win("o")
	    })
	const d1 =arr[0][0]+arr[1][1]+arr[2][2]
	const d2 =arr[0][2]+arr[1][1]+arr[2][0]
	if(d1=="xxx"||d2=="xxx") win("x")
	if(d1=="ooo"||d2=="ooo") win("o")
}
const win=(p)=>{
if(p=="x"){cellArr.forEach(c=>{c.pixels=cell4})}
else {cellArr.forEach(c=>{c.pixels=cell4})}
game.setHint("---------------------------------- "+p.toUpperCase()+" Won -------------------------------")
touchToReset=true

}
const reset=()=>{
    s.objs.forEach(o=>s.remove(o))
	arr=arr.map(i=>["","",""])
	cellArr=[]
	makeCells()
	game.setHint("                                                                   ")
}
game.Scene.setScene(s)
game.play()
