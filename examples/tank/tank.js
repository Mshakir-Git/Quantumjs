
import { game } from "../../index.js"


const int = n => Math.floor(n)
const makeBox = (w, h, c) => {
  return [...Array(h)].map(row => {
    return [...Array(w)].map(px => c)
  })
}
const ko = new game.GameObject(90,190, 1, {
  // text:"  ||  /n#####/n#####",
  image: "assets/tank2.png",
  collision: { bounds: [], rigidbody:true },
  velocity: { x: 0, y: 0 },
  color: { r: 100, g: 50, b: 200 },
  data:{isgreen:false  ,life:6},
  shader(p){if(!this.data.isgreen){return p} return {r:p.r,g:p.g+50,b:p.b,a:255}
 }
})
const bg = new game.GameObject(0, 6, 4, {
  image: "assets/bg.png",
  tile: 5,
  collision: { bounds: [{ x: 0, y: 0, w: 23, h: 26 }] }
})
const blink = new game.Animation([{data:{isgreen:true}, key: 0 },{ data:{isgreen:false}, key: 0.3 },{data:{isgreen:true}, key: 0.6 },{ data:{isgreen:false}, key: 1 }],300)
const blink2 = new game.Animation([{data:{isbright:true}, key: 0 },{ data:{isbright:false}, key: 0.3 },{data:{isbright:true}, key: 0.6 },{ data:{isbright:false}, key: 1 }],300)
const spriteAnim = new game.Animation([{sprite:{u:10,v:0,w:10,h:10}, key: 0 },{ sprite:{u:0,v:0,w:10,h:10}, key: 0.5 },{sprite:{u:10,v:0,w:10,h:10}, key: 1 }],400,{loop:true})

const k = new game.GameObject(60, 20, 1, {
  // text:"  #  /n#####/n#####",
  image: "assets/tank.png",
  collision: {bounds: [],rigidbody:true },
  scale: { x: 1, y: 1 },
  velocity: { x: 0, y: 0 },
  color: { r: 100, g: 50, b: 200 },
  data:{life:3}
  // shader(p){if(p.r<100){return p} return {r:p.r,g:50,b:p.b,a:255}}

})
//const box=new game.GameObject(7,7,1,{})
//box.image="custom"
//box.pixels=makeBox(10,10,{r:200,g:50,b:20,a:255})
const w = new game.Scene([ko, k], [])
game.Scene.setScene(w)
let dir = [0, -1]
const tileMatrix = [
  [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  [3, 5, 0, 0, 0, 0, 0, 0, 0, 0, 5, 3],
  [3, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 3],
  [3, 5, 2, 2, 1, 0, 0, 0, 0, 1, 2, 3],
  [3, 3, 3, 0, 1, 1, 2, 1, 1, 1, 2, 3],
  [3, 1, 1, 1, 2, 2, 1, 2, 0, 0, 2, 3],
  [3, 0, 1, 0, 3, 3, 3, 0, 0, 0, 5, 3],
  [3, 0, 2, 2, 0, 2, 1, 1, 0, 0, 0, 3],
  [3, 0, 1, 1, 2, 2, 2, 2, 2, 0, 0, 3],
  [3, 0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 3],
  [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],

]
const brick=new game.GameObject(0, 0, 1, { image: "assets/tank2.png",pixels:[] })
const mbrick={}
const cement={}
const tiles=[brick,mbrick,cement]
const scale = (matrix, s) => {
  const tempArr = []
  matrix.forEach(row => {
    const tempRow = []
    row.forEach(item => {
      [...Array(Math.round(s))].forEach(xx => { tempRow.push(item) })
    })
    const tempNum = [...Array(Math.round(s))]
    tempNum.forEach(yy => { tempArr.push(tempRow) })
  })
  return tempArr

}
//make map
scale(tileMatrix, 2).forEach((row, y) => {
  row.forEach((n, x) => {
    if (n > 0) {
      const width = 10
      const heigth = 10
      
      // new game.GameObject(x * width, y * heigth, 1, { pixels: makeBox(width, heigth, { r: n * 100, g: 100 * 2 % n, b: 50, a: 255 }) })
      n===1?w.addObj(new game.GameObject(x * width, y * heigth, 1, { image: "assets/brick.png", collision:{} ,data:{life:1,isbright:false},shader(p){if(!this.data.isbright){return p} return {r:p.r+50,g:p.g,b:p.b,a:255} }})):null
      n===2?w.addObj(new game.GameObject(x * width, y * heigth, 1, { image: "assets/bricksheet.png", sprite:{u:10,v:0,w:10,h:10} , collision:{}, data:{life:2,isbright:false},shader(p){if(!this.data.isbright){return p} return {r:p.r+50,g:p.g,b:p.b,a:255} }})):null
      n===3?w.addObj(new game.GameObject(x * width, y * heigth, 1, { image: "assets/cement.png" , collision:{}, data:{life:1000,isbright:false},shader(p){if(!this.data.isbright){return p} return {r:p.r+50,g:p.g+50,b:p.b,a:255} }})):null

    } else if(Math.random()<0.2){
      const width = 10
      const heigth = 10
      w.addObj(new game.GameObject(x * width, y * heigth, 1, { image: "assets/brick.png"  , collision:{}, data:{life:1,isbright:false},shader(p){if(!this.data.isbright){return p} return {r:p.r+50,g:p.g,b:p.b,a:255} }}))    
    }
  })
})
//make home
w.addObj(new game.GameObject(100, 180, 1, { image: "assets/bricksheet.png", sprite:{u:10,v:0,w:10,h:10} , collision:{}, data:{life:2,isbright:false},shader(p){if(!this.data.isbright){return p} return {r:p.r+50,g:p.g,b:p.b,a:255} }}))
w.addObj(new game.GameObject(100, 190, 1, { image: "assets/bricksheet.png", sprite:{u:10,v:0,w:10,h:10} , collision:{}, data:{life:2,isbright:false},shader(p){if(!this.data.isbright){return p} return {r:p.r+50,g:p.g,b:p.b,a:255} }}))
w.addObj(new game.GameObject(110, 180, 1, { image: "assets/bricksheet.png", sprite:{u:10,v:0,w:10,h:10} , collision:{}, data:{life:2,isbright:false},shader(p){if(!this.data.isbright){return p} return {r:p.r+50,g:p.g,b:p.b,a:255} }}))
w.addObj(new game.GameObject(120, 180,1, { image: "assets/bricksheet.png", sprite:{u:10,v:0,w:10,h:10} , collision:{}, data:{life:2,isbright:false},shader(p){if(!this.data.isbright){return p} return {r:p.r+50,g:p.g,b:p.b,a:255} }}))
w.addObj(new game.GameObject(120, 190 , 1, { image: "assets/bricksheet.png", sprite:{u:10,v:0,w:10,h:10} , collision:{}, data:{life:2,isbright:false},shader(p){if(!this.data.isbright){return p} return {r:p.r+50,g:p.g,b:p.b,a:255} }}))

w.addObj(new game.GameObject(110, 190 , 1, { image: "assets/home.png" , collision:{}, data:{life:2,isbright:false},shader(p){if(!this.data.isbright){return p} return {r:p.r+50,g:p.g,b:p.b,a:255} }}))

let showColliders = (o) => {
  o.collision.bounds.forEach(b => {
    w.addObj(new game.GameObject(o.x + b.x, o.y + b.y, o.z, { pixels: makeBox(b.w, b.h, { r: 250, g: 0, b: 20, a: 100 }) }))
  })
}

// setTimeout(()=>showColliders(ko),1000)
w.setEvents((key) => {
  const cols=ko.checkCollisions(w)
  // game.setHint(cols+"")
  if (key.name == "f") {
    /*  w.addObj(
              new game.Kobj(ko.x+7,ko.y,2,"o",true,{x:40,y:0})
     )*/
    //    ko.reverse()
    w.objs.forEach(o => {
      console.log(o.image, o.y)
    })
    process.exit()
    return
  }
  if (key.name == "left") {

    ko.move(w,-1,0)
    // ko.x -= 1
    ko.angle = 270
    dir = [-1, 0]

    ko.x<game.vp.x+20?game.vp.x=ko.x-game.vp.width+20:null
    //    game.vp.x=ko.x-10
  }
  if (key.name == "right") {
    ko.move(w,1,0)
    ko.angle = 90
    dir = [1, 0]
    ko.x>game.vp.x+game.vp.width-20?game.vp.x=ko.x-20:null

    // game.vp.x=ko.x-10
  }
  if (key.name == "up") {
    ko.move(w,0,-1)
    ko.angle = 0
    dir = [0, -1]
    ko.y<game.vp.y+20?game.vp.y=ko.y-game.vp.height+20:null
  }
  if (key.name == "down") {
    //  ko.play(blink)
    ko.move(w,0,1)
    ko.angle = 180
    dir = [0, 1]
    ko.y>game.vp.y+game.vp.height-20?game.vp.y=ko.y-20:null

  }


  if (key.name == "m") {
    const xd = dir[0] == 0 ? 2 + (1 + dir[1]) / 2 : (1 + dir[0]) * 2
    const yd = dir[1] == 0 ? 3 + (1 - dir[0]) / 2 : (1 + dir[1]) * 2
    const bullet = new game.GameObject(ko.x + xd, ko.y + yd, ko.z + 1, {
      velocity: { x: 30 * dir[0], y: 30 * dir[1] },
      collision: { bounds: [{ x: 0, y: 0, w: 1, h: 1 }] ,rigidbody:true }
    })
    bullet.image = "bullet"
    bullet.arr = [["#"]]
    bullet.pixels = makeBox(1, 1, { r: 250, g: 0, b: 20, a: 255 })
    // showColliders(bg)
    w.addObj(bullet)
    //game.setHint("hello")
  }

})
k.data={}
const angleList={"0/-1":0,"0/1":180,"1/0":90,"-1/0":270,}
const t=Math.round(Math.random())
k.data.direction=[(Math.round(Math.random())*2 -1)*t,(Math.round(Math.random())*2 -1)*(t==0?1:0)]
k.angle=angleList[k.data.direction[0]+"/"+k.data.direction[1]]

// const ray=new game.GameObject(k.x+2,k.y-10,k.z,{pixels:makeBox(1, 8, { r: 250, g: 0, b: 20, a: 200 }),collision:{rigidbody:true,bounds:[{x:0,y:0,w:1,h:8}]}})
// w.addObj(ray)
setInterval(()=>{
//   const cols=k.checkCollisions(w)
// if(cols.indexOf(true)!=-1){
//   const r=cols.map(c=>c?1:0)
//   k.move(r[0]-r[1],r[2]-r[3])
  const t=Math.round(Math.random())
  k.data.direction=[(Math.round(Math.random())*2 -1)*t,(Math.round(Math.random())*2 -1)*(t==0?1:0)]
  k.angle=angleList[k.data.direction[0]+"/"+k.data.direction[1]]
// k.data.direction=[r[2]+r[3],r[0]-r[1]]

// }


// console.log("                                 "+ray.checkCollisions(w))
},3000)
setInterval(()=>{
  if(Math.random()<0.2){shoot(k)}
  k.move(w,k.data.direction[0],k.data.direction[1],true)
},100)
function shoot(go){
    const dir=go.data.direction||[0,1]
    const xd = dir[0] == 0 ? 2 + (1 + dir[1]) / 2 : (1 + dir[0]) * 2
    const yd = dir[1] == 0 ? 3 + (1 - dir[0]) / 2 : (1 + dir[1]) * 2
    const bullet = new game.GameObject(go.x + xd, go.y + yd, go.z + 1, {
      velocity: { x: 30 * dir[0], y: 30 * dir[1] },
      collision: { bounds: [{ x: 0, y: 0, w: 1, h: 1 }] ,rigidbody:true }
    })
    bullet.image = "ebullet"
    bullet.arr = [["#"]]
    bullet.pixels = makeBox(1, 1, { r: 250, g: 0, b: 20, a: 255 })
    // showColliders(bg)
    w.addObj(bullet)
    //game.setHint("hello")
  
}
game.setCollision((a, b, dir) => {

  if (a.image == "bullet" && b != ko && b != bg) {
    // a.pixels = [[]]
    // b.pixels = [[]]
    b.data?b.data.life--:null;
    b.data?b.play(blink2):null
    // if(b.sprite){b.sprite.u=0;console.log(b.sprite)}
    // if(b.sprite){b.play(spriteAnim)}

    if(b.data&&b.data.life<=0){w.remove(b)}
    w.remove(a)
    // w.remove(b)

  }
  
  if (a.image == "ebullet" && b == ko){
    ko.play(blink)
    game.setHint("GAME OVER")
    // b.data?b.data.life--:null;
    // // b.data?b.play(blink):null
    // if(b.data&&b.data.life<=0){w.remove(b);game.setHint("GAME OVER")}
  }
  if (a.image == "ebullet" && b != k && b != bg) {
    // a.pixels = [[]]
    // b.pixels = [[]]
    b.data?b.data.life--:null;
    b.data?b.play(blink2):null
    // if(b.sprite){b.sprite.u=0;console.log(b.sprite)}
    // if(b.sprite){b.play(spriteAnim)}

    if(b.data&&b.data.life<=0){w.remove(b)}
    w.remove(a)
    // w.remove(b)

  }

})
game.play()
