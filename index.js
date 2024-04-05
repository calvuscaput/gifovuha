let gif = new GIF({
  workers: 2,
  quality: 10,
  width: 400,
  height: 300,
});

let isRendering = false
gif.on('finished', function(blob) {
  var image = document.getElementById("image")
  image.src = URL.createObjectURL(blob)
  isRendering = false
  gif.abort()
  gif.frames = [];
  delete gif.imageParts;
  delete gif.finishedFrames;
  delete gif.nextFrame;
});

function debounce(func, ms) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, arguments), ms);
  };
}

function writeTextToCanvas(ctx, text, x, y, maxWidth, lineHeight) {
  isRendering = true
  ctx.fillStyle = '#FFF'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  let words = text.split(' ');
  let line = ''
  let testLine = ''
  let lineArray = []

  for(var n = 0; n < words.length; n++) {
    testLine += `${words[n]} `;
    let metrics = ctx.measureText(testLine);
    let testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      lineArray.push([line, x, y]);
      y += lineHeight;
      line = `${words[n]} `;
      testLine = `${words[n]} `;
    }
    else {
      line += `${words[n]} `;
    }
    if(n === words.length - 1) {
      lineArray.push([line, x, y]);
    }
}
  lineArray.forEach(function(item) {
  ctx.fillStyle = '#000'

    ctx.fillText(item[0], item[1], item[2]); 
  })
  gif.addFrame(ctx, {copy: true, delay: 200});
}

async function run(text) {
  const splittedText = text.split('')
  let canvasText = '';
  for (let sym of splittedText) {
    canvasText = canvasText + sym;
    writeTextToCanvas(ctx, canvasText, 8, 24, canvas.width-20, 18)
  }
  gif.render();
}

function onInput(e) {
  if(isRendering) return;
  run(e.target.value)
}

const textarea = document.querySelector('#text');
textarea.addEventListener('input', debounce(onInput, 300))

var canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d", { willReadFrequently: true });


ctx.font = "16px Roboto";
