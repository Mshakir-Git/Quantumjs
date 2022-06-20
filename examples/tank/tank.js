
const game = require('../../')


const int = n => Math.floor(n)
const makeBox = (w, h, c) => {
  return [...Array(h)].map(row => {
    return [...Array(w)].map(px => c)
  })
}
const ko = new game.GameObject(10, 40, 1, {
  image: "assets/tank2.png",
  collision: { bounds: [] },
  velocity: { x: 0, y: 0 },
  color: { r: 100, g: 50, b: 200 }
})
const bg = new game.GameObject(0, 6, 4, {
  image: "assets/bg.png",
  tile: 5,
  collision: { bounds: [{ x: 0, y: 0, w: 23, h: 26 }] }
})

const k = new game.GameObject(70, 40, 1, {
  image: "assets/tank.png",
  collision: {},
  scale: { x: 1, y: 1 },
  velocity: { x: 0, y: 0 },
  color: { r: 100, g: 50, b: 200 }
})
//const box=new game.GameObject(7,7,1,{})
//box.image="custom"
//box.pixels=makeBox(10,10,{r:200,g:50,b:20,a:255})
const w = new game.Scene([ko, k], [])
game.setScene(w)
let dir = [0, -1]
const tileMatrix = [
  [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
  [3, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 3],
  [3, 0, 2, 2, 1, 0, 0, 0, 0, 1, 2, 3],
  [3, 3, 3, 0, 1, 1, 2, 1, 1, 1, 2, 3],
  [3, 1, 1, 1, 2, 2, 1, 2, 0, 0, 2, 3],
  [3, 0, 1, 0, 3, 3, 3, 0, 0, 0, 0, 3],
  [3, 0, 2, 2, 2, 2, 1, 1, 0, 0, 0, 3],
  [3, 0, 1, 1, 1, 1, 0, 2, 2, 0, 0, 3],
  [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
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
scale(tileMatrix, 2).forEach((row, y) => {
  row.forEach((n, x) => {
    if (n > 0) {
      const width = 10
      const heigth = 10
      // new game.GameObject(x * width, y * heigth, 1, { pixels: makeBox(width, heigth, { r: n * 100, g: 100 * 2 % n, b: 50, a: 255 }) })
      n===1?w.addObj(new game.GameObject(x * width, y * heigth, 1, { image: "assets/brick.png", collision:{} })):null
      n===2?w.addObj(new game.GameObject(x * width, y * heigth, 1, { image: "assets/magicbrick.png" , collision:{}})):null
      n===3?w.addObj(new game.GameObject(x * width, y * heigth, 1, { image: "assets/cement.png" , collision:{}})):null

    } else if(Math.random()<0.2){
      const width = 10
      const heigth = 10
      w.addObj(new game.GameObject(x * width, y * heigth, 1, { image: "assets/brick.png"  , collision:{}}))    
    }
  })
})
let showColliders = (o) => {
  o.collision.bounds.forEach(b => {
    w.addObj(new game.GameObject(o.x + b.x, o.y + b.y, o.z, { pixels: makeBox(b.w, b.h, { r: 250, g: 0, b: 20, a: 100 }) }))
  })
}
w.setEvents((key) => {
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
    ko.x -= 1
    ko.angle = 270
    dir = [-1, 0]
    //    game.vp.x=ko.x-10
  }
  if (key.name == "right") {
    ko.x += 1
    ko.angle = 90
    dir = [1, 0]
    // game.vp.x=ko.x-10
  }
  if (key.name == "up") {
    ko.y -= 1
    ko.angle = 0
    dir = [0, -1]
  }
  if (key.name == "down") {
    ko.y += 1
    ko.angle = 180
    dir = [0, 1]
  }
  if (key.name == "m") {
    const xd = dir[0] == 0 ? 2 + (1 + dir[1]) / 2 : (1 + dir[0]) * 2
    const yd = dir[1] == 0 ? 3 + (1 - dir[0]) / 2 : (1 + dir[1]) * 2
    const bullet = new game.GameObject(ko.x + xd, ko.y + yd, ko.z + 1, {
      velocity: { x: 30 * dir[0], y: 30 * dir[1] },
      collision: { bounds: [{ x: 0, y: 0, w: 1, h: 1 }] }
    })
    bullet.image = "bullet"
    bullet.arr = [["#"]]
    bullet.pixels = makeBox(1, 1, { r: 250, g: 0, b: 20, a: 255 })
    showColliders(bg)
    w.addObj(bullet)
    //game.setHint("hello")
  }

})

game.setCollision((a, b) => {

  if (a.image == "bullet" && b != ko && b != bg) {
    a.pixels = [[]]
    b.pixels = [[]]
  }
})
game.play()
