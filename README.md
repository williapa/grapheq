# GraphEQ
GraphEQ is my javascript graphic equalizer project with which to make cool visualizers for youtube (stay tuned).

# Getting Started

this project uses [node.js.](https://nodejs.org/en/)

after you clone this repository, run
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

### Future ideas

- Create "home page" text input that lets you type a file name (drag and drop?)
- equalizer bar shape options (do a proper growing parabola, try and copy some other styles)
- let user write the draw script in the window (ace editor?)
- configurable EQ continued - select bands to monitor / combine, set threshold for band and trigger bounce based on thresh
- eq bar options - figure out better color control
- make wave visualizer and add it to clock - width could grow in place of dark rectangle
- [beat detection](http://joesul.li/van/beat-detection-using-web-audio/)
- [more help](https://stackoverflow.com/questions/30110701/how-can-i-use-js-webaudioapi-for-beat-detection)

