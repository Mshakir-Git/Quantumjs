const game = require('./index.js')
//clears console and inits
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
const move = new game.Animation([{ x: 20, key: 0 }, { x: 50, key: 0.4 }, { x: 53, key: 0.7 }, { x: 57, key: 1 }], 1000)
const w = new game.Scene([ko], [])
const wx = new game.Scene([cco], [])
let input = ""
w.setEvents((k) => {
    if (k.name == "left") {
        ko.y -= 0.5
    }
    if (k.name == "right") {
        ko.y += 0.5
    }
    if (k.name == "a") {
        ko.play(move)
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

