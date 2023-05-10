const mouse_enabled=true
if(mouse_enabled){process.stdout.write("\x1b[?1002h")}

let events=e=>{}
const setEvents=(e)=>{
	events=e
}
let mouse_ev=(k,x,y)=>{}
const setMouseEvents=mev=>{mouse_ev=mev}
const mouseEvent=(k,x,y)=>{if(k==0){
mouse_ev(k,(x-1),(y-1)*2)	
}

/*
console.log("Mouse Event : ",k,(x-1),(y-1)*2)
const obbj=new GameObject((x-1),(y-1)*2, 1, {})
obbj.image="custom"
obbj.pixels=utils.makeCircle(8,{r:250,g:0,b:20,a:255})
w.addObj(obbj)*/
}
let count=0
let mouseArr=[]

import  readline from 'readline'
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
if (key.ctrl&&key.name=="c") {
    process.stdout.write("\x1b[?1002l")
    process.stdout.write("\x1B[?25h")
    process.exit();
   } else {
   if(count){
   count--;mouseArr.push(key.sequence.charCodeAt(0)-32);
   if(count==0){mouseEvent(...mouseArr);mouseArr=[]};return}
   
   if(key.sequence=="\x1b[M"){
      //console.log(key.sequence.charCodeAt(0)-32)
      //console.log(key)
      count=3
   }
   // console.log(key)
//    console.log(rep(" ",30),prev_frame[0][0])
    events(key)
   }
})

export {setEvents,setMouseEvents}