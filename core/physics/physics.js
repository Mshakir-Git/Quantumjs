import { K_TIME } from "../config.js"
//TODO: Implement Physics Engine
//Physics Engine Loop
const physicsLoop=(scene)=>{
    scene.objs.filter(o=>o.velocity).forEach(o=>{
        o.x+=o.velocity.x*(K_TIME/1000)
        o.y+=o.velocity.y*(K_TIME/1000)
    })

    setTimeout(()=>physicsLoop(scene),K_TIME)
}




let collision=(a,b,dir)=>{}
const setCollision=(col_func)=>{
    collision=col_func
}


//collision detection
const checkGlobalCollisions=(colls)=>{


    // const colls=filter.filter(o=>o.collision)
    // colls.forEach(o=>{
    // 	colls.forEach(i=>{
    // 	if(o!=i){
    // 		const ix=int(i.x)
    // 		const iy=int(i.y/2)
    // 		const ox=int(o.x)
    // 	    const oy=int(o.y/2)
    // 	  i.arr.forEach((iarr,indyi)=>{
    // 	  	o.arr.forEach((oarr,indyo)=>{
    // 	  		iarr.forEach((iar,indxi)=>{
    // 	  		    oarr.forEach((oar,indxo)=>{                         if(indxi+ix==indxo+ox&&indyi+iy==indyo+oy){
    // 	  		if(oar!=" "&&iar!=" "){collision(o,i)}
    // 	  		            }
    // 	  	  })
    // 	  	})
    // 	  })
    // 	})

    // }
    // })
    // })
    const rigidbodies=colls.filter(o=>o.collision.rigidbody)
    rigidbodies.forEach(o=>{
    	colls.forEach(i=>{
    	if(o!=i){
            o.collision.bounds?o.collision.bounds.forEach(ob=>{
                i.collision.bounds?i.collision.bounds.forEach(ib=>{
                    let [x,xw,y,yw]=[i.x +ib.x,i.x+(ib.w*i.scale.x),i.y+ib.y,i.y+(ib.h*i.scale.y)]
                    let [ox,oxw,oy,oyw]=[o.x +ob.x,o.x+(ob.w*o.scale.x),o.y+ob.y,o.y+(ob.h*o.scale.y)]
                    // if(i.name=="dino"||o.name=="dino"){}
                    // if(x>=ox&&x<=oxw||xw>=ox&&xw<=oxw||x>=ox&&xw<=oxw||ox>=x&&oxw<=xw){
                    //     if(y>=oy&&y<=oyw||yw>=oy&&yw<=oyw||y>=oy&&yw<=oyw||oy>=y&&oyw<=yw){
                            // console.log(rep(" ",20)+[x,xw,y,yw],[ox,oxw,oy,oyw])
                            //direction is [l,r,t,b]
                            const ycheck=((oy<yw&&oyw>=yw)||(oyw>y&&oy<=y)||(oy<=y&&oyw>=yw)||(oy>y&&oyw<yw))
                            const xcheck=((ox<xw&&oxw>=xw)||(oxw>x&&ox<=x)||(ox<=x&&oxw>=xw)||(ox>x&&oxw<xw))
                            if((ox>=x&&ox<=xw&&ycheck)||(oxw>=x&&oxw<=xw&&ycheck)||(oy>=y&&oy<=yw&&xcheck)||(oyw>=y&&oyw<=yw&&xcheck)){
                        collision(o,i,[(ox>=x&&ox<=xw&&ycheck),(oxw>=x&&oxw<=xw&&ycheck),(oy>=y&&oy<=yw&&xcheck),(oyw>=y&&oyw<=yw&&xcheck)])
                            }
                    //     }
                    // }
                }):null
            }):null
                // let [x,xw,y,yw]=[i.x,i.x,i.y,i.y]
                // if(i.pixels){xw+=i.pixels[0].length;yw+=i.pixels.length}
                // else       {xw+=i.arr[0].length;yw+=i.arr.length*2}
                // let [ox,oxw,oy,oyw]=[o.x,o.x,o.y,o.y]
                // if(o.pixels){oxw+=o.pixels[0].length;oyw+=o.pixels.length}
                // else       {oxw+=o.arr[0].length;oyw+=o.arr.length*2}

                // if(x>=ox&&x<=oxw||xw>=ox&&xw<=oxw||x>=ox&&xw<=oxw||ox>=x&&oxw<=xw){
                //     if(y>=oy&&y<=oyw||yw>=oy&&xw<=oyw||y>=oy&&yw<=oyw||oy>=y&&oyw<=yw){
                //         // console.log(rep(" ",20)+[x,xw,y,yw],[ox,oxw,oy,oyw])
                //     collision(o,i)
                //     }
                // }


    }
    })
    })
}
const checkCollisions=(gameobject,scene,all=false)=>{
    let collisions=[false,false,false,false]
    let colliders=all?scene.objs.filter(o=>o.collision):scene.visibleColliders
    if(colliders){
            const o=gameobject
            colliders.forEach(i=>{
            if(o!=i){
                o.collision.bounds?o.collision.bounds.forEach(ob=>{
                    i.collision.bounds?i.collision.bounds.forEach(ib=>{
                        let [x,xw,y,yw]=[i.x +ib.x,i.x+(ib.w*i.scale.x),i.y+ib.y,i.y+(ib.h*i.scale.y)]
                        let [ox,oxw,oy,oyw]=[o.x +ob.x,o.x+(ob.w*o.scale.x),o.y+ob.y,o.y+(ob.h*o.scale.y)]
                                const ycheck=((oy<yw&&oyw>=yw)||(oyw>y&&oy<=y)||(oy<=y&&oyw>=yw)||(oy>y&&oyw<yw))
                                const xcheck=((ox<xw&&oxw>=xw)||(oxw>x&&ox<=x)||(ox<=x&&oxw>=xw)||(ox>x&&oxw<xw))
                                if((ox>=x&&ox<=xw&&ycheck)||(oxw>=x&&oxw<=xw&&ycheck)||(oy>=y&&oy<=yw&&xcheck)||(oyw>=y&&oyw<=yw&&xcheck)){
                                    const newCollisions=[(ox>=x&&ox<=xw&&ycheck),(oxw>=x&&oxw<=xw&&ycheck),(oy>=y&&oy<=yw&&xcheck),(oyw>=y&&oyw<=yw&&xcheck)]
                                    collisions=collisions.map((c,i)=>c||newCollisions[i])
                                }
                    }):null
                }):null   
        }
        })
        
    }
    return collisions
}

export {checkGlobalCollisions,checkCollisions,setCollision,physicsLoop}