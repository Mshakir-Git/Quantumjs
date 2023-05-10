import {NesJs} from "../../emulator/nes_term.js"
console.log(NesJs)
// import { openAsBlob } from 'node:fs';
import { open } from 'node:fs/promises';
// import {compressFrame,makeFrame,drawFrame} from './qjs/core/renderer.js'
import {renderer,game} from '../../index.js'
import { TW,TH } from "../../core/config.js"

const {compressFrame,drawFrame} = renderer
async function loadRom(url) {
    // e.preventDefault();

    // var reader = new FileReader();

    // reader.onload = function(e) {
    //   putMessage('Loading done.');
    //   run(e.target.result);
    // };

    // reader.onerror = function(e) {
    //   for(var key in reader.error) {
    //     putMessage(key + '=' + reader.error[key]);
    //   }
    // };
    const fd = await open(url);
    const ab =  await fd.readFile()
    run(ab);
    // reader.readAsArrayBuffer(url);

    putMessage('')
    putMessage('Loading rom image...')
  }
function loadRomx(url) {
    // var url = document.getElementById('romList').selectedOptions[0].value;

    var request = new XMLHttpRequest();
    request.responseType = 'arraybuffer';

    request.onload = function() {
      putMessage('Loading done.');
      run(request.response);
    };

    request.onerror = function(e) {
      putMessage('failed to load.');
    };

    request.open('GET', url, true);
    request.send(null);

    putMessage('')
    putMessage('Loading rom image...')
    ROMloaded();
  }

  /**
   *
   */
  function TerminalDisplay() {
    // this.ctx = canvas.getContext('2d');
  
    this.width  = TW;
    this.height  =(TH-8)*2;
    this.offsetX=this.width<256?Math.floor((256-this.width)/2):0
    this.offsetY=this.height<240?Math.floor((240-this.height)/2):0
  
    // this.data = this.ctx.createImageData(this.width, this.height);
    // this.uint32 = new Uint32Array(this.data.data.buffer);
    this.data=[...Array(this.height)].map(row=>{
      return [...Array(this.width)].map(c=>({r:0,g:0,b:0,a:255}))
    })
  }
  Object.assign(TerminalDisplay.prototype, {
    isDisplay: true,
  
    /**
     *
     */
    renderPixel: function(x, y, c) {
        // console.log(x, y, c)
      // var index = y * this.width + x;
      // this.uint32[index] = c;

      let color={}
      color['b'] = (c >> 16) & 0xff; // red
      color['g'] = (c >> 8) & 0xff; // green
      color['r'] = c  & 0xff; // blue
      color['a']=255
      // if(color.r==0&&color.g==0&&color.r==0){color={r:85,g:129,b:203,a:255}}
      if(x<this.width+this.offsetX&&x>=this.offsetX){
        if(y<this.height+this.offsetY&&y>=this.offsetY){
        // this.data[y][x]=c
        this.data[y-this.offsetY][x-this.offsetX]=color
        }


      }
    },
  
    /**
     *
     */
    updateScreen: function() {
      // console.log("Update")
      // console.log(this.data)
      console.time("c")
      // console.log(this.data[100])
      const frame=compressFrame(this.data)
      // console.timeEnd("c")
      drawFrame(frame)
      console.timeEnd("c")
      // console.log(this.data[100])

      // console.log(compressFrame(this.data))
      // this.ctx.putImageData(this.data, 0, 0);
    }
  });

  function run(buffer) {
    try {
      var rom = new NesJs.Rom(buffer);
    } catch(e) {
      putMessage('');
      putMessage(e.toString());
      return;
    }

    putMessage('');
    putMessage('Rom Header info');
    putMessage(rom.header.dump());

    let nes = new NesJs.Nes();

    // nes.addEventListener('fps', function(fps) {
    //   document.getElementById('fps').innerText = fps.toFixed(2);
    // });

    nes.setRom(rom);

    nes.setDisplay(new TerminalDisplay());

    try {
      nes.setAudio(new NesJs.Audio());
    } catch(e) {
      putMessage('');
      putMessage('Disables audio because this browser does not seems to support WebAudio.');
    }
    game.setEvents((k)=>{
      // console.log(k)
      nes.handleKeyUp(k.name)
      // if(k.name=='down'){nes.handleKeyDown();}
    })
    // window.onkeydown = function(e) { nes.handleKeyDown(e); };
    // window.onkeyup = function(e) { nes.handleKeyUp(e); };

    putMessage('');

    putMessage('bootup.');
    nes.bootup();

    putMessage('runs.');
    // NESran();
    nes.run();
  }

  // put message methods

  /**
   *
   */
  function putMessage(str) {
    console.log(str)
    // var area = document.getElementById('dump');
    // area.firstChild.appendData(str + '\n');
    // area.scrollTop = area.scrollHeight;
  }

  // loadRom('./roms/The Invasion.nes')
  // loadRom('./roms/350-in-1 (Menu).nes')
  // loadRom('./roms/Contra (USA).nes')
  loadRom('./roms/Tetris.nes')
  // loadRom('./roms/nestest.nes')