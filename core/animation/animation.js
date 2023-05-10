class Animation {
    constructor(keyFrames, time, opts={}){
        this.keyFrames=keyFrames
        this.time=time
        this.startTime=0
        this.loop=opts.loop
        this.iterpolate=opts.iterpolate
    }

}
const setAnimationFrame=(gameObject, currentTime)=>{
    const anim=gameObject.animation
    if(anim.startTime==0){anim.startTime=currentTime}
    let elapsedTime=currentTime-anim.startTime
    let currentFrame={}
    let nextFrame={}
    anim.keyFrames.forEach((frame,index)=>{
        if(frame.key*anim.time<=elapsedTime){
            currentFrame=frame
            nextFrame=index+1<anim.keyFrames.length? anim.keyFrames[index+1]: null
        }
    })
    Object.keys(currentFrame).forEach(key=>{
        //&& elapsedTime <= anim.time
        if(key!='key'){
                const deltaTime=nextFrame?(nextFrame.key - currentFrame.key)*anim.time:0 //0.2*1000
                const elapsedTimeSince=nextFrame?elapsedTime- (currentFrame.key*anim.time):0//50
            
            // console.log("\n\n")
            // if(!nextFrame){console.log(currentFrame);process.exit()}
            // setTimeout(()=>{process.exit()},400)
            if(key == 'data'){
                Object.keys(currentFrame['data']).forEach(dkey=>{
                    gameObject['data'][dkey]=anim.iterpolate && nextFrame?currentFrame['data'][dkey] + (nextFrame['data'][dkey]-currentFrame['data'][dkey])*(elapsedTimeSince/deltaTime):currentFrame['data'][dkey]
                })
            } else {
                gameObject[key]=anim.iterpolate && nextFrame?currentFrame[key] + (nextFrame[key]-currentFrame[key])*(elapsedTimeSince/deltaTime):currentFrame[key]
            }
        }
        
    })
    //loop anim
    if(elapsedTime>anim.time && anim.loop){
        anim.startTime=currentTime
        elapsedTime=0
    }
}
export {Animation,setAnimationFrame}