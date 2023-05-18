console.clear()
// import {port} from "./soc.js"
// console.log(port)
import { TW, TH, KINEMATICS } from "./core/config.js"
import { setEvents, setMouseEvents } from "./core/input/input.js"
import { checkCollisions, setCollision, physicsLoop } from "./core/physics/physics.js"
import { makeFrame, compressFrame, drawFrame, setGlobalShader, vp } from "./core/renderer/renderer.js"
import { Animation } from "./core/animation/animation.js"
import utils from "./core/utils/utils.js"
const range = utils.range
let current_scene = {}



class Scene {
    constructor(newobjs, canobjs) {
        this.objs = [...newobjs].sort((a, b) => b.z - a.z)
        this.canvasObjs = [...canobjs].sort((a, b) => b.z - a.z)
        this.visibleColliders = []
        this.events = () => { }
    }
    addObj(obj) {
        this.objs.push(obj)
        this.sort()
    }
    remove(obj) {
        this.objs = this.objs.filter(o => o != obj)
        this.sort()
    }
    sort() {
        //Z-Sort
        this.objs.sort((a, b) => b.z - a.z)
    }
    setEvents(e) {
        this.events = e
        setEvents(e)
    }
    static setScene = s => { current_scene = s; setEvents(s.events) }
}
//Component system (binding etc)
//Cache Or precompute shaders
class GameObject {
    //options, collider collision trigger, children
    constructor(x, y, z, opts) {
        this.x = x
        this.y = y
        this.z = z
        this.txt = opts.text || ""
        this.image = opts.image
        this.name = opts.name
        this.data = opts.data
        this.sprite = opts.sprite
        this.shader = opts.shader ? opts.shader.bind(this) : null
        this.scale = opts.scale ? opts.scale : { x: 1, y: 1 }
        this.pixels = null
        this.tile = opts.tile ? opts.tile : { x: 0, y: 0 }
        this.collision = opts.collision //micro physics
        this.pixels = opts.pixels ? opts.pixels : []
        this.image ? this.getPixels() : null
        this.color = opts.color ? opts.color : { r: 255, g: 255, b: 255 } //separate into fg-bg
        this.velocity = opts.velocity //micro physics
        this.children = opts.children ? opts.children.map(function (c) { return { ...c, parent: this } }) : null
        this.arr = this.getText(this.txt, opts)
        this.setText = t => this.arr = this.getText(t)
        this.maxx = x + this.getMaxx([...this.arr])
        this.animation = null

    }
    getText(txt, o) {
        const rows = this.txt.split("\n").map(i => range(this.tile.x || 1).reduce((a, t) => a += i, "").split(""))
        return range(this.tile.y || 1).reduce((a, rw) => a.concat(rows), [])
    }
    async getPixels() {
        this.pixels = await utils.loadImage(this.image)
        this.arr = this.pixels.reduce((acc, row, ri) => {
            if (ri % 2 == 0) {
                return [...acc, row.map(px => px.a > 0 ? "#" : " ")]
            } else { return acc }
        }, [])
        this.maxx = this.x + this.getMaxx([...this.arr])
        if (this.collision) {
            if (!this.collision.bounds || this.collision.bounds.length === 0) {
                this.collision.bounds = [{ x: 0, y: 0, w: this.getUVpixels()[0].length, h: this.getUVpixels().length }]
            }
        }

    }
    getScaledPixels() {
        if (this.scaledPixels && this.scaledPixels.length == this.getUVpixels().length * this.scale.y && this.scaledPixels[0].length == this.getUVpixels()[0].length * this.scale.x) {

        } else {
            const tempArr = []
            this.getUVpixels().forEach(row => {
                const tempRow = []
                row.forEach(item => {
                    range(Math.round(this.scale.x)).forEach(xx => { tempRow.push(item) })
                })
                const tempNum = range(Math.round(this.scale.y))
                tempNum.forEach(yy => { tempArr.push(tempRow) })
            })
            this.scaledPixels = tempArr
        }
        return this.scaledPixels
    }
    getTiledPixels(pixels) {
        if (this.tile.x || this.tile.y) {
            if (this.tiledPixels && this.tiledPixels.length === this.pixels.length * this.tile.y && this.tiledPixels[0].length === this.pixels[0].length * this.tile.x) {
                return this.tiledPixels
            } else {


                let tempPixels = [...pixels]
                if (this.tile.x) {
                    tempPixels = tempPixels.map(r => {
                        return range(this.tile.x).reduce((a, rw) => a.concat(r), [])
                    })
                }
                if (this.tile.y) {
                    tempPixels = range(this.tile.y).reduce((a, rw) => a.concat(tempPixels), [])
                }
                this.tiledPixels = tempPixels
                return tempPixels
            }
        }
        else {
            return pixels
        }
    }
    getUVpixels() {
        if (!this.sprite) { return this.getTiledPixels(this.pixels) }
        const checkUV = this.cacheUV && this.cacheUV.u === this.sprite.u && this.cacheUV.v === this.sprite.v && this.cacheUV.w === this.sprite.w && this.cacheUV.h === this.sprite.h
        if (this.cacheUVpixels && checkUV) {
            return this.cacheUVpixels
        }
        let tempPixels = []
        for (let j = 0; j < this.sprite.h; j++) {
            let tempRow = []
            for (let i = 0; i < this.sprite.w; i++) {
                tempRow.push(this.pixels[j + this.sprite.v][i + this.sprite.u])
                // tempRow.push({r:100,g:100,b:100,a:200})

            }
            tempPixels.push(tempRow)
        }
        this.scaledPixels = [[]]
        this.cacheUVpixels = this.getTiledPixels(tempPixels)
        this.cacheUV = { ...this.sprite }
        // console.log(tempPixels,this.sprite)
        return this.cacheUVpixels
    }
    reverse() {
        this.pixels = this.pixels.map(row => row.reverse())
    }
    reverseY() {
        this.pixels = this.pixels.reverse()
    }

    getMaxx(arr) {
        return arr.sort((a, b) => b.length - a.length)[0].length
    }
    play(animation) {
        animation.startTime = 0
        this.animation = { ...animation }
    }
    checkCollisions(scene, all = false) {
        return checkCollisions(this, scene, all)
    }
    move(scene, x, y, all = false) {
        const cols = this.checkCollisions(scene, all)
        x < 0 && !cols[0] ? this.x += x : null
        x > 0 && !cols[1] ? this.x += x : null
        y < 0 && !cols[2] ? this.y += y : null
        y > 0 && !cols[3] ? this.y += y : null

    }
}



let hint = ""
const drawHint = () => {
    hint.length > 0 ? process.stdout.write(hint.substring(0, TW) + utils.rep(" ", TW - hint.length) + "\n") : null
}

let gameLoop = () => {
    console.time()
    const aframe = makeFrame(current_scene)
    console.time("c")
    const frame = compressFrame(aframe)
    console.timeEnd("c")

    drawFrame(frame)
    drawHint()

    console.timeEnd()
    setTimeout(gameLoop, 10)
}


const play = () => {
    gameLoop()
    if (KINEMATICS) {
        physicsLoop(current_scene)
    }
}

const setHint = (h) => {
    hint = h
}



const renderer = { makeFrame, compressFrame, drawFrame, setGlobalShader }
const game = { Animation, utils, Scene, GameObject, setCollision, setHint, setEvents, setMouseEvents, play, vp }
export { game, renderer }

