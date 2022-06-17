const game = require('./index.js')
//clears console and inits
const makeBox=(w,h,c)=>{
    return [...Array(h)].map(row=>{
        return [...Array(w)].map(px=>c)
    })
}
const cco = new game.GameObject(0, 10, 1,
    {
        text: "oooooo\no    o\no    o\noooooo",
        color: { r: 100, g: 50, b: 20 },
    })
const ko = new game.GameObject(10, 20, 1, {
     image: "examples/dino/assets/dino.png",
    collision: true,
    // velocity: { x: 35, y: 0 },
    color: { r: 100, g: 50, b: 200 },
    children: [
        cco
    ]
})
const o1 = new game.GameObject(0, 2, 1,{})
const o2 = new game.GameObject(40, 2, 1,{})
const o3 = new game.GameObject(0, 42, 1,{})
const o4 = new game.GameObject(40, 42, 1,{})
o1.image="1";o1.pixels=makeBox(14,14,{r:10,g:10,b:255,a:140})
o2.image="1";o2.pixels=makeBox(14,14,{r:10,g:255,b:255,a:140})
o3.image="1";o3.pixels=makeBox(14,14,{r:10,g:255,b:10,a:140})
o4.image="1";o4.pixels=makeBox(14,14,{r:255,g:10,b:10,a:140})

const bg = new game.GameObject(0, 0, 2,{})
bg.image="1";bg.pixels=makeBox(100,100,{r:0,g:0,b:0,a:255})



// ko.image="sss"
// async function l(){ko.pixels=await game.loadImage("examples/dino/assets/dino.png")})
ko.angle=270
const move = new game.Animation([{ x: 20, key: 0 }, { x: 50, key: 0.4 }, { x: 53, key: 0.7 }, { x: 57, key: 1 }], 1000)

const move1 = new game.Animation([{ x: 0, y: 2, key: 0 }, { x: 20, y: 20, key: 1 }], 3000)
const move2 = new game.Animation([{ x: 40, y: 2, key: 0 }, { x: 20, y: 20, key: 1 }], 3000)
const move3 = new game.Animation([{ x: 0, y: 42, key: 0 }, { x: 20, y: 20, key: 1 }], 3000)
const move4 = new game.Animation([{ x: 40, y: 42, key: 0 }, { x: 20, y: 20, key: 1 }], 3000)

const w = new game.Scene([o1,o2,o3,o4,bg], [])
const wx = new game.Scene([cco], [])
let input = ""
w.setEvents((k) => {
    if (k.name == "left") {
        o1.y -= 0.5
    }
    if (k.name == "right") {
        o1.y += 0.5
    }
    if (k.name == "a") {
        ko.play(move)
    }
    if (k.name == "x") {
        o1.play(move1)
        o2.play(move2)
        o3.play(move3)
        o4.play(move4)
    }


    //input IMPLEMENTED
    // if(k.name=="return"){
    //     console.warn(input)
    // }
    // input+=k.sequence
    // game.setHint(input)

    if (k.name == "f") {
        game.setScene(wx)
        game.setHint("New world")
        //console.log()
    }
})
wx.setEvents((k) => {
    if (k.name == "f") {
        game.setScene(w)
        game.setHint("Old world")
        //console.log()
    }
})
game.setScene(w)
game.play()

//Which funcs belong to which objs
//Game: setscene, play
//Scene: setEvents, Update , (onCollision)
//GameObject: OnCollision

//scene manager: History?, transitions?
//Collision: Box model?
//Camera:
//getters for scene name etc
//game.end game.pause
//User input

