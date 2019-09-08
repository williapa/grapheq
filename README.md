# GraphEQ
GraphEQ is my javascript graphic equalizer project with which to make cool visualizers for youtube (stay tuned).

# Getting Started

this project uses [node.js.](https://nodejs.org/en/)

after you git clone this repository, run
```
npm install 
```
to install the http-server, which is required to let you load your mp3 file in the browser. Thanks a lot CHROME

To start the server, run

```
http-server
```

then go to localhost:8080/index.html and click "start animation".

# External References

The animations are all done with [Canvas2D.](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)

[For understanding how audio nodes and the web audio API work.](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API)

## Thoughts

One approach I focused on for the first iteration was picking decibel treshholds and triggering changes according to db levels.

I used individual frequency bands to monitor these changes but a smarter man might use all of them...

If you are experimenting and would like to change the song, drop it in the root of the project and change the file name on line 130.

If you are a normal person that doesn't just want to print emojis all over the screen, you can use that approach to modify "drawMoneyPrint" 
and have lyrics become animated instead. (you may want to use the timeout approach, though instead of a step-oscillating animation for the change)

### Future ideas:
- Create "home page" play controls that let you browse your PC to select a song, as well as play / pause controls (and also track time!!!)
- Similar controls to select a background image
- Better control for 1 shot time changes
- Better control for beat synced animation (this is done very inconsistently right now because framerate will vary based on your computer)
