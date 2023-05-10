import { TW, TH } from "../config.js"
import { setAnimationFrame } from "../animation/animation.js"
import { checkGlobalCollisions } from "../physics/physics.js"
import utils from '../utils/utils.js'
const { int, range } = utils


// width:TW,height:(TH-8)*2,

//TODO: Take this common
const viewport = {
    x: 0, y: 0,
    width: TW, height: (TH - 8) * 2,
}
// width:TW,height:(TH-6>70?70:TH-6)*2,

const vp = viewport
//empty_frame might cause pass by ref issues
const empty_frame = range(viewport.height).map(_ => {
    return range(viewport.width).map(_ => { return { r: 0, g: 0, b: 0, a: 0 } })
})
//store prev_frame (for compress)
let prev_frame = range(int(viewport.height / 2)).map(y => {
    return range(viewport.width).map(xi => { return { fg: { r: 0, g: 0, b: 0, a: 0 }, bg: { r: 0, g: 0, b: 0, a: 0 }, c: "\u2580" } })
})


//TODO: Move shade
//Global shader
function shade(px, i, j, frame) {
    return px
    //Example shader
    // return (i-vp.x)>50&&(i-vp.x)<100?px={...px,b:int(px.b/2)}:px
}
const setGlobalShader = (shader) => { shade = shader }

const compressFrame = (frame) => {
    //return console.log(frame[0][0],frame[22][0])
    let pfg = { r: "s", g: "s", b: "s" }
    let pbg = { r: "s", g: "s", b: "s" }
    let frameStr = ""
    let j = 0
    let new_prev = []
    let moved_already = false
    while (j < frame.length) {
        let row = frame[j]
        let row2 = frame[j + 1]
        let row_prev = prev_frame[int(j / 2)]
        let new_prev_row = []
        moved_already = false

        let rowStr = ""

        let i = row.length + 1

        while (--i) {
            let px = {}
            if (row[row.length - i].c || row2[row2.length - i].c) {
                //Ascii
                if (row[row.length - i].c) { px = row[row.length - i] }
                if (row2[row2.length - i].c) { px = row2[row2.length - i] }

            }
            else {

                //pixel based
                let px_top = shade(row[row.length - i], row.length - i, frame.length - j, frame)
                let px_bottom = shade(row2[row2.length - i], row.length - i, frame.length - j, frame) //fix j coords
                px = combinePixel(px_top, px_bottom)
            }
            //Diff rendering (check with prev frame)
            new_prev_row.push(px)
            let moveTostr = ""
            let px_prev = row_prev[row.length - i]
            if (px.fg.r == px_prev.fg.r && px.fg.b == px_prev.fg.b && px.fg.g == px_prev.fg.g && px.bg.r == px_prev.bg.r && px.bg.b == px_prev.bg.b && px.bg.g == px_prev.bg.g && px.c == px_prev.c) {
                moved_already = false
                continue
            } else {
                if (!moved_already) {
                    moveTostr = `\x1b[${int(j / 2)};${row.length - i + 1}H`
                    moved_already = true
                }
            }


            let fgstr = (px.fg.r == pfg.r && px.fg.b == pfg.b && px.fg.g == pfg.g) ? "" : `\x1b[38;2;${px.fg.r};${px.fg.g};${px.fg.b}m`
            let bgstr = (px.bg.r == pbg.r && px.bg.b == pbg.b && px.bg.g == pbg.g) ? "" : `\x1b[48;2;${px.bg.r};${px.bg.g};${px.bg.b}m`
            pfg = { ...px.fg }
            pbg = { ...px.bg }

            rowStr += px.c ? `${moveTostr}${fgstr}${bgstr}${px.c}` : `${moveTostr}${fgstr}${bgstr} `



        }
        new_prev.push(new_prev_row)
        frameStr += rowStr + ""

        j += 2
    }
    // set cursor to (TW,TH)
    prev_frame = new_prev
    return frameStr + `\x1b[${int(vp.height / 2)};${vp.width}H`
}

const combinePixel = (p1, p2) => {
    //Combine 2 pixels int fg,bg,c
    let p1n = p1.a > 0 ? p1 : { r: 0, g: 0, b: 0 }
    let p2n = p2.a > 0 ? p2 : { r: 0, g: 0, b: 0 }
    let c = " "
    if (p1n.r == p2n.r && p1n.g == p2n.g && p1n.b == p2n.b) {
        c = " "
    } else {
        c = "\u2580"
    }
    return { fg: p1, bg: p2, c: c }

}

//mix alpha for tranparency
const mixPixels = (p1, p2) => {
    if (!p1) { return p2 }
    const p2_o = p2.a / 255
    const p1_o = 1 - p2_o
    return { r: int(p1.r * p1_o) + int(p2.r * p2_o), g: int(p1.g * p1_o) + int(p2.g * p2_o), b: int(p1.b * p1_o) + int(p2.b * p2_o), a: 255 }
}

const makeFrame = (w) => {
    //new empty frame
    const frame = empty_frame.map(i => [...i])
    //filter all objs and get currently visible ones
    /*  const allobjs=w.objs.reduce((all,o)=>
   o.children?all.concat([o,...o.children]):all.concat([o]
      ),[])*/
    const filter = w.objs.filter(item => {
        const inx = (viewport.x > item.x &&
            viewport.x <= item.maxx) ||
            (viewport.x + viewport.width > item.x &&
                viewport.x + viewport.width <= item.maxx) ||
            (viewport.x <= item.x &&
                viewport.x + viewport.width > item.maxx)

        const iny = (viewport.y > item.y &&
            viewport.y <= item.arr.length * 2) ||
            (viewport.y + viewport.height > item.y &&
                viewport.y + viewport.height <= item.arr.length * 2) ||
            (viewport.y <= item.y &&
                viewport.y + viewport.height > item.arr.length * 2)
        return inx && iny
    })

    //Add Debug logs
    console.time("collision")

    const colls = filter.filter(o => o.collision)
    w.visibleColliders = colls
    checkGlobalCollisions(colls)
    console.timeEnd("collision")
    console.time("img")
    //for each object fill the respective cells in frame
    filter.forEach(object => {

        //Animations: Set current Animation frame
        if (object.animation) { setAnimationFrame(object, +new Date()) }

        //Object x,y relative to camera
        const vx = int(object.x - viewport.x)
        const vy = int(object.y - viewport.y)

        if (!object.txt) {
            //Pixel Based  
            if (object.pixels && object.pixels.length) {
                const rows = object.getScaledPixels() //Full Pixel Image

                //Loop over rows within viewport height
                const y_screen_start = vy < 0 ? -vy : 0
                const y_screen_end = (rows.length > -vy + vp.height ? -vy + vp.height : rows.length)
                for (let y_index = y_screen_start; y_index < y_screen_end; y_index++) {
                    const row = rows[y_index]
                    //loop over pixels within viewport width
                    const x_screen_start = vx < 0 ? -vx : 0
                    const x_screen_end = (row.length > -vx + vp.width ? -vx + vp.width : row.length)
                    for (let x_index = x_screen_start; x_index < x_screen_end; x_index++) {
                        //  if(object.x+x_index>=vp.x&&vx+x_index<viewport.width){//instead of foreach use for smhow
                        const px = row[x_index]
                        let newX = x_index
                        let newY = y_index
                        //move origin to pivot point
                        //rotate
                        //move origin back to 0,0
                        let angle = object.angle || 0
                        if (angle != 0) {
                            angle = angle * Math.PI / 180
                            const xo = (x_index - (row.length / 2))
                            const yo = (y_index - (object.pixels.length / 2))
                            const r = Math.sqrt(xo ** 2 + yo ** 2)
                            const sinAngle = Math.sin(angle)
                            const cosAngle = Math.cos(angle)
                            // r * cos(a+b) + origindiff
                            newX = Math.round((xo * cosAngle) - (yo * sinAngle) + (row.length / 2))
                            newY = Math.round((yo * cosAngle) + (xo * sinAngle) + (object.pixels.length / 2))
                        }
                        if (object.x + newX >= vp.x && vx + newX < viewport.width && object.y + newY >= vp.y && vy + newY < viewport.height) {
                            //shift above condition to above for loops(once done)
                            if (px.a > 0 && frame[vy + newY]) {
                                let prev_px = frame[vy + newY][vx + newX]
                                if (prev_px.c) { prev_px = prev_px.bg }
                                frame[vy + newY][vx + newX] = mixPixels(prev_px, object.shader ? object.shader(px, x_index, y_index, object.pixels) : px)
                            }
                        }

                        // }
                    }
                }
            }
        } else {
            //Text Based
            object.arr.forEach((row, y_index) =>
                row.forEach((tx, x_index) => {
                    
                    if (vx + x_index < viewport.width && vx + x_index >= 0) {
                        //set txt bg in GameObject (fix out of bounds error)
                        if (frame[vy + y_index * 2]) {
                            const prev_px = frame[vy + y_index * 2][vx + x_index]
                            const bg = prev_px && prev_px.bg ? prev_px.bg : prev_px
                            frame[vy + y_index * 2][vx + x_index] = { fg: object.color, bg: bg, c: tx }
                        }

                    }
                })
            )

        }


        // children part (ascii ony)

        // i.children?i.children.forEach(j=>{

        //         const jvx=int(vx+j.x)
        //         const jvy=int(vy+j.y)
        //         j.arr.forEach((ii,indy)=>
        //             ii.forEach((tx,indx)=>{
        //             if(jvx+indx<viewport.width){
        //     frame[jvy+indy][jvx+indx]={fg:j.color,bg:{r:0,g:0,b:0},c:tx}
        //     //(j.color||"")+tx+"\033[37m"
        //              }
        //             //maybe add collisions here
        //             })
        //         )

        //     }):null

    })//END-Filter Objects loop
    console.timeEnd("img")

    w.canvasObjs.forEach(c_object => {
        const vx = int(c_object.x)
        const vy = int(c_object.y)
        c_object.arr.forEach((row, y_index) =>
            row.forEach((txt, x_index) => {
                if (vx + x_index < viewport.width) {
                    const prev_px = frame[vy + y_index][vx + x_index]
                    const bg = prev_px.c ? prev_px.bg : prev_px
                    frame[vy + y_index][vx + x_index] = { fg: c_object.color, bg: bg, c: txt }
                }

            })
        )
    })

    return frame
}
const drawFrame = (frame) => {
    process.stdout.write('\x1b[H\x1B[?25l' + frame + '\n' + '\x1b[37m\x1b[48;2;0;0;0m')
}
export { compressFrame, makeFrame, drawFrame, setGlobalShader, vp }