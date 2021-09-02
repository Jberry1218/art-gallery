// Variable declarations
let canvas;
let ctx;
let savedImageData;
let dragging = false;
let fillColor = "black";
let currentTool = "brush";

let usingBrush = false;
let brushXPoints = new Array();
let brushYPoints = new Array();

let startR;
let startG;
let startB;
let startA;
let fillColorR;
let fillColorG;
let fillColorB;
let fillColorA;


// Bounding box for shape creation
class ShapeBoundingBox {
    constructor(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
}


// Position where mouse clicked down
class MouseDownPos {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}


// Current location of the mouse
class MouseLocation {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}


// Create default objects 
let shapeBoundingBox = new ShapeBoundingBox(0,0,0,0);
let mouseDown = new MouseDownPos(0,0);
let mouseLocation = new MouseLocation(0,0);


document.addEventListener("DOMContentLoaded", function() {

    canvas = document.querySelector("#canvas");

    // If editing image, load existing image. Else, just get context of new canvas
    try {
        let sourceImageData = document.querySelector("#edit-image").value;
        ctx = canvas.getContext("2d");

        let destinationImage = new Image;
        destinationImage.onload = function(){
            ctx.drawImage(destinationImage,0,0);
        };
        
        destinationImage.src = sourceImageData;
    } catch {
        ctx = canvas.getContext("2d");
    }
    
    // Set initial values for canvas
    ctx.lineWidth = document.querySelector("#size").value;
    let color = document.querySelector("#color").value;
    ctx.strokeStyle = color;
    fillColorR = parseInt(color.substring(1,3),16);
    fillColorG = parseInt(color.substring(3,5),16);
    fillColorB = parseInt(color.substring(5,7),16);
    fillColorA = 255;

    // Add eventlisteners for mouse movement on canvas
    canvas.addEventListener("mousedown", FunctionMouseDown);
    canvas.addEventListener("touchstart", FunctionMouseDown);
    canvas.addEventListener("mousemove", FunctionMouseMove);
    canvas.addEventListener("touchmove", FunctionMouseMove);
    canvas.addEventListener("mouseup", FunctionMouseUp);
    canvas.addEventListener("touchend", FunctionMouseUp);

    // Add eventlisteners for tool selection
    document.querySelector("#brush").addEventListener("click", () => ChangeTool("brush"));
    document.querySelector("#bucket").addEventListener("click", () => ChangeTool("bucket"));
    document.querySelector("#line").addEventListener("click", () => ChangeTool("line"));
    document.querySelector("#rectangle").addEventListener("click", () => ChangeTool("rectangle"));
    document.querySelector("#circle").addEventListener("click", () => ChangeTool("circle"));
    document.querySelector("#eraser").addEventListener("click", () => ChangeTool("eraser"));

    // Add eventlistener for changing line width
    document.querySelector("#size").addEventListener("click", () => ChangeLineWidth(`${document.querySelector("#size").value}`));
 
    // Add eventlistener for changing color
    document.querySelector("#color").addEventListener("input", () => ChangeColor(`${document.querySelector("#color").value}`));

    // Add eventlistener for saving file
    document.querySelector("#save").addEventListener("click", SaveToDatabase);

})


// Change drawing tool
function ChangeTool(tool) {
    currentTool = tool;
    console.log(`Switched to ${currentTool}`);
}
 

// Change line width
function ChangeLineWidth(width) {
    ctx.lineWidth = width;
    console.log(`Changed width to ${width}`);
}


// Change color
function ChangeColor(color) {
    ctx.strokeStyle = color;
    fillColorR = parseInt(color.substring(1,3),16);
    fillColorG = parseInt(color.substring(3,5),16);
    fillColorB = parseInt(color.substring(5,7),16);
    fillColorA = 255;
    console.log(`Changed color to ${color}`);
}


// Given absolute mouse position, return mouse position within canvas
function GetMousePosition(x, y) {
    
    // Get position of canvas
    let canvasSizeData = canvas.getBoundingClientRect();

    // Get x and y axis positions
    let x_pos = (x - canvasSizeData.left) * (canvas.width / canvasSizeData.width);
    let y_pos = (y - canvasSizeData.top) * (canvas.height / canvasSizeData.height);

    return {x: x_pos, y: y_pos}
}


// Save canvas image 
function SaveCanvas() {
    savedImageData = ctx.getImageData(0,0,canvas.width,canvas.height);
}


// Redraw canvas image 
function RedrawCanvas() {
    ctx.putImageData(savedImageData,0,0);
}


// Update shape size data 
function UpdateShapeSizeData(loc) {

    // Assign width and height for bounding box
    shapeBoundingBox.width = Math.abs(loc.x - mouseDown.x);
    shapeBoundingBox.height = Math.abs(loc.y - mouseDown.y);

    // Assign left property of bounding box
    if (loc.x > mouseDown.x) {
        shapeBoundingBox.left = mouseDown.x;
    } else {
        shapeBoundingBox.left = loc.x;
    }

    // Assign top property of bounding box
    if (loc.y > mouseDown.y) {
        shapeBoundingBox.top = mouseDown.y;
    } else {
        shapeBoundingBox.top = loc.y;
    }
}


// Update shape on mouse movement 
function UpdateShapeOnMove(loc) {
    UpdateShapeSizeData(loc);
    DrawShape(loc);
}


// Draw shape
function DrawShape(loc) {

    if (currentTool === "line") {
        ctx.beginPath();
        ctx.moveTo(mouseDown.x, mouseDown.y);
        ctx.lineTo(loc.x, loc.y);
        ctx.stroke();
    } else if (currentTool === "rectangle") {
        ctx.strokeRect(shapeBoundingBox.left, 
            shapeBoundingBox.top,
            shapeBoundingBox.width,
            shapeBoundingBox.height);
    } else if (currentTool === "circle") {
        let startingX = shapeBoundingBox.left + shapeBoundingBox.width;
        let startingY = shapeBoundingBox.top + shapeBoundingBox.height;
        let radiusX = shapeBoundingBox.width;
        let radiusY = shapeBoundingBox.height;
        ctx.beginPath();
        ctx.ellipse(startingX, startingY, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.stroke();
    }
}


// Add mouselocations to array for brush tool rendering 
function AddBrushPoint(x, y) {
    brushXPoints.push(x);
    brushYPoints.push(y);
}


// Draw with brush tool 
function DrawBrush() {
    for(let i = 1; i < brushXPoints.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(brushXPoints[i-1],brushYPoints[i-1]);
        ctx.lineTo(brushXPoints[i], brushYPoints[i]);
        ctx.stroke();
    }
}


// Fill paint
function FillPaint(startX, startY) {
    
    let pixelStack = [[startX, startY]];

    let startPos = (startY * canvas.width + startX) * 4;
    startR = savedImageData.data[startPos];
    startG = savedImageData.data[startPos+1];
    startB = savedImageData.data[startPos+2];
    startA = savedImageData.data[startPos+3];

    while (pixelStack.length) {
        
        let newPos = pixelStack.pop();
        let x = newPos[0];
        let y = newPos[1];
        let pixelPos = (y * canvas.width + x) * 4;
        let reachLeft = false;
        let reachRight = false;

        // Move up row by row until you hit a different color pixel or the top boundary
        while (MatchStartColor(pixelPos)) {
            pixelPos -= canvas.width * 4;
            y--;
        }

        pixelPos += canvas.width * 4;
        y++;

        // Move down row by row until you hit a different color pixel or the bottom boundary
        while (MatchStartColor(pixelPos)) {
    
            // Fill the starting pixel
            FillPixel(pixelPos);

            // Add pixels to the left to the stack if they are at the top of a matching group of pixels
            if (x > 0) {
                if (MatchStartColor(pixelPos - 4)) {
                    if (!reachLeft) {
                        pixelStack.push([x - 1, y]);
                        reachLeft = true;
                    }
                } else {
                    reachLeft = false;
                }
            } else if (reachLeft) {
                reachLeft = false;
            }

            // Add pixels to the right to the stack if they are at the top of a matching group of pixels
            if (x < canvas.width-1) {
                if (MatchStartColor(pixelPos + 4)) {
                    if (!reachRight) {
                        pixelStack.push([x + 1, y]);
                        reachRight = true;
                    }
                } else {
                    reachRight = false;
                } 
            } else if (reachRight) {
                reachRight = false;
            }
            
            // Move down one row and start again
            pixelPos += canvas.width * 4;
            y++;
        }
    }
}


// Check if pixel color is the same as the paint area
function MatchStartColor(pixelPos) {

    let r = savedImageData.data[pixelPos];	
    let g = savedImageData.data[pixelPos+1];	
    let b = savedImageData.data[pixelPos+2];
    let a = savedImageData.data[pixelPos+3];

    if (r === fillColorR && g === fillColorG && b === fillColorB && a === fillColorA) {
        match = false;
    } else {
        match = r === startR && g === startG && b === startB && a === startA;
    }

    return (match)
}


// Fill pixel
function FillPixel(pixelPos) {
    savedImageData.data[pixelPos] = fillColorR;
    savedImageData.data[pixelPos+1] = fillColorG;
    savedImageData.data[pixelPos+2] = fillColorB;
    savedImageData.data[pixelPos+3] = fillColorA;
}


// Mousedown on canvas 
function FunctionMouseDown(ev) {
    canvas.style.cursor = "crosshair";
    if (ev.type == 'touchmove'){
        loc = GetMousePosition(ev.touches[0].clientX, ev.touches[0].clientY);
    } else if (ev.type == 'mousemove') {
        loc = GetMousePosition(ev.clientX, ev.clientY);
    }
    SaveCanvas();
    mouseDown.x = loc.x;
    mouseDown.y = loc.y;

    if (currentTool === "bucket") {
        FillPaint(Math.round(mouseDown.x), Math.round(mouseDown.y));
        ctx.putImageData(savedImageData, 0, 0);
    } else if (currentTool === "brush") {
        usingBrush = true;
        AddBrushPoint(mouseDown.x, mouseDown.y);
    } else if (currentTool === "eraser") {
        usingBrush = true;
        AddBrushPoint(mouseDown.x, mouseDown.y);
        ctx.globalCompositeOperation="destination-out";
    }

    dragging = true;
}


// Mousemove on canvas
function FunctionMouseMove(ev) {
    canvas.style.cursor = "crosshair";
    if (ev.type == 'touchmove'){
        loc = GetMousePosition(ev.touches[0].clientX, ev.touches[0].clientY);
    } else if (ev.type == 'mousemove') {
        loc = GetMousePosition(ev.clientX, ev.clientY);
    }

    if ((currentTool === "brush" || currentTool === "eraser") && dragging && usingBrush) {
        AddBrushPoint(loc.x, loc.y);
        DrawBrush();
    } else {
        if (dragging) {
            RedrawCanvas();
            UpdateShapeOnMove(loc);
        }
    }
}


// Mouseup on canvas
function FunctionMouseUp(ev) {
    canvas.style.cursor = "default";
    if (ev.type == 'touchmove'){
        loc = GetMousePosition(ev.touches[0].clientX, ev.touches[0].clientY);
    } else if (ev.type == 'mousemove') {
        loc = GetMousePosition(ev.clientX, ev.clientY);
    } 
    dragging = false;
    
    if (currentTool === "brush" || currentTool === "eraser") {
        brushXPoints = [];
        brushYPoints = [];
        usingBrush = false;
        ctx.strokeStyle = document.querySelector("#color").value;
        ctx.globalCompositeOperation="source-over";
    } else {
        RedrawCanvas();
        UpdateShapeOnMove(loc);
    }
}


// Save image to database
function SaveToDatabase() {

    let title = document.querySelector("#image-title").value;
    let image_data = canvas.toDataURL();

    try {
        imageId = this.value;
        console.log(imageId);
    } catch {
        imageId = "";
    }

    console.log(imageId);

    fetch("/saveimage", {
        method: "POST",
        body: JSON.stringify({
            title: title,
            image: image_data,
            imageId: imageId
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        window.open(`/gallery/${result.username}`,"_self")
    })
    .catch(error => {
        console.log(error);
    });
    return false;
}