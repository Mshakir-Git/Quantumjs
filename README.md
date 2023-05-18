# Quantum.js
Terminal game engine.

Uses <a href="https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797">ANSI escape sequences </a> and <a href="https://en.wikipedia.org/wiki/Unicode_block">Unicode Block characters</a> to render pixel graphics.

<img src="https://github.com/Mshakir-Git/Quantum.js/assets/8435609/a028b404-8d39-4fb7-bb56-bf94be24e14a" width="300" />


Disclaimer: <s>Ugly code ahead!!</s> Work in progress

# Getting started

## Table of contents
<ul>
  <li><a href="#installation">Installation</a></li>
  <li><a href="#running">Running</a></li>
</ul>

## Installation
```bash
git clone https://github.com/Mshakir-Git/Quantum.js.git
cd Quantum.js
npm install #Or yarn
```

## Running
```bash
npm run start #Or yarn start
npm run tank #Tank example
npm run nes #NES example
```

## NES Emulator
Can be used to render nes games directly in a terminal. Uses <a href="https://github.com/takahirox/nes-js">nes-js</a> for nes emulation.


## Funtionalities
These functionalities have been implemented (some need improvements)
<ul>
  <li>Basic GameEngine stuff (render loop/GameObject etc)</li>
  <li>Pixel Graphics</li>
  <li>Image Load</li>
  <li>ASCII support</li>
  <li>Collision detection</li>
  <li>Input support</li>
  <li>Basic Filter/Shaders</li>
</ul>

These functionalities have NOT been implemented
<ul>
  <li>Networking</li>
  <li>Proper Physics</li>
  <li>Audio</li>
</ul>
