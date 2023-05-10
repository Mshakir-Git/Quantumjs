import Jimp from "jimp"

function rep(s,n){
	let sn=""
	for(let i =0;i<n;i++){
		sn+=s
	}
	return sn
}

const objequals=(obj1,obj2)=>{
	let equals=true
	Object.keys(obj1).forEach(k=>{
		equals = equals&&obj1[k]==obj2[k]
	})
	return equals
}
const int = n => Math.floor(n)
const range = n => [...Array(n)]
const makeBox=(w,h,c)=>{
    return [...Array(h)].map(row=>{
        return [...Array(w)].map(px=>c)
    })
}
const makeCircle=(r,c)=>{
const d=r*2
     return [...Array(d)].map((row,y)=>{
        return [...Array(d)].map((px,x)=>{
        if(Math.sqrt((x-r)**2 + (y-r)**2)<=r &&x!=0&&y!=0) return c
        else return {r:0,g:0,b:0,a:0}
        })
  })
}

const cacheImagesflag=false
const cacheImages={}
const loadImage= async (img)=>{
if(cacheImagesflag&&cacheImages[img]){return cacheImages[img]}
const image=await Jimp.read(img)
const pixels=[]
let row=[]
image.scan(0, 0, image.bitmap.width, image.bitmap.height, function
(x, y, idx) {
const d=this.bitmap.data
const p={r:d[idx + 0],g:d[idx + 1],b:d[idx + 2],a:d[idx + 3]};
row.push(p)
if(x==image.bitmap.width-1){pixels.push(row);row=[]}
})
if(cacheImagesflag){cacheImages[img]=pixels}
return pixels

}

export default {makeBox,makeCircle,loadImage,rep,int,range}