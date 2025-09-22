// tinggal interaktifin the shi man
// sama warna plank a c dihytamkan kali ya

"use strict";

var canvas;
var gl;

var axis = 0;
var xAxis = 0;
var yAxis =1;
var zAxis = 2;
var theta = [0, 0, 0];
var position = [0, 0, 0]; 
var thetaLoc;
var thetaColor;
var flag = true;
var numElements;

var isDragging = false;
var lastMouseX = 0;
var lastMouseY = 0;
var autoRotate = true; 
var scaleLoc,positionLoc;
var currentScale = 0.8;

var vertices = [
    // kaki kiri depan
    vec3(-0.8, -1.0,  0.425),
    vec3(-0.8, -0.3,  0.425),
    vec3(-0.7, -0.3,  0.425),
    vec3(-0.7, -1.0,  0.425),
    vec3(-0.8, -1.0,  0.325),
    vec3(-0.8, -0.3,  0.325),
    vec3(-0.7, -0.3,  0.325),
    vec3(-0.7, -1.0,  0.325),

    // kaki kanan depan
    vec3(0.7, -1.0,  0.425),
    vec3(0.7, -0.3,  0.425),
    vec3(0.8, -0.3,  0.425),
    vec3(0.8, -1.0,  0.425),
    vec3(0.7, -1.0,  0.325),
    vec3(0.7, -0.3,  0.325),
    vec3(0.8, -0.3,  0.325),
    vec3(0.8, -1.0,  0.325),

    // kaki kiri belakang
    vec3(-0.8, -1.0, -0.325),
    vec3(-0.8, -0.3, -0.325),
    vec3(-0.7, -0.3, -0.325),
    vec3(-0.7, -1.0, -0.325),
    vec3(-0.8, -1.0, -0.425),
    vec3(-0.8, -0.3, -0.425),
    vec3(-0.7, -0.3, -0.425),
    vec3(-0.7, -1.0, -0.425),

    // kaki kanan belakang
    vec3(0.7, -1.0, -0.325),
    vec3(0.7, -0.3, -0.325),
    vec3(0.8, -0.3, -0.325),
    vec3(0.8, -1.0, -0.325),
    vec3(0.7, -1.0, -0.425),
    vec3(0.7, -0.3, -0.425),
    vec3(0.8, -0.3, -0.425),
    vec3(0.8, -1.0, -0.425),

    // connector fb-left
    vec3(-0.78, -0.45,  0.425),  
    vec3(-0.78, -0.30,  0.425),  
    vec3(-0.7, -0.30,  0.425),
    vec3(-0.7, -0.45,  0.425),

    vec3(-0.78, -0.45, -0.425),
    vec3(-0.78, -0.30, -0.425),
    vec3(-0.7, -0.30, -0.425),
    vec3(-0.7, -0.45, -0.425),

    // connector fb-right
    vec3(0.7, -0.45,  0.425),
    vec3(0.7, -0.30,  0.425),
    vec3(0.78, -0.30,  0.425),
    vec3(0.78, -0.45,  0.425),

    vec3(0.7, -0.45, -0.425),
    vec3(0.7, -0.30, -0.425),
    vec3(0.78, -0.30, -0.425),
    vec3(0.78, -0.45, -0.425),

    // ff connector
    vec3(-0.8, -0.45,  0.405),
    vec3(-0.8, -0.30,  0.405),
    vec3( 0.8, -0.30,  0.405),
    vec3( 0.8, -0.45,  0.405),

    vec3(-0.8, -0.45,  0.325),
    vec3(-0.8, -0.30,  0.325),
    vec3( 0.8, -0.30,  0.325),
    vec3( 0.8, -0.45,  0.325),

    // Bb connector
    vec3(-0.8, -0.45, -0.325),
    vec3(-0.8, -0.30, -0.325),
    vec3( 0.8, -0.30, -0.325),
    vec3( 0.8, -0.45, -0.325),

    vec3(-0.8, -0.45, -0.405),
    vec3(-0.8, -0.30, -0.405),
    vec3( 0.8, -0.30, -0.405),
    vec3( 0.8, -0.45, -0.405),

    // plank A
    vec3(-0.8, -0.3,  0.425),  
    vec3(-0.8, -0.27,  0.425),  
    vec3( 0.8, -0.27,  0.425),  
    vec3( 0.8, -0.3,  0.425),  
    vec3(-0.8, -0.3,  0.158),  
    vec3(-0.8, -0.27,  0.158),  
    vec3( 0.8, -0.27,  0.158),  
    vec3( 0.8, -0.3,  0.158),  

    // Plank b
    vec3(-0.8, -0.3,  0.150),  
    vec3(-0.8, -0.27,  0.150),  
    vec3( 0.8, -0.27,  0.150), 
    vec3( 0.8, -0.3,  0.150), 
    vec3(-0.8, -0.3, -0.150),  
    vec3(-0.8, -0.27, -0.150),  
    vec3( 0.8, -0.27, -0.150),  
    vec3( 0.8, -0.3, -0.150),  

    // plank C
    vec3(-0.8, -0.3, -0.158),  
    vec3(-0.8, -0.27, -0.158),  
    vec3( 0.8, -0.27, -0.158), 
    vec3( 0.8, -0.3, -0.158), 
    vec3(-0.8, -0.3, -0.425),  
    vec3(-0.8, -0.27, -0.425),  
    vec3( 0.8, -0.27, -0.425),  
    vec3( 0.8, -0.3, -0.425), 

// --- Kaki meja ---
vec3( -0.55, -1.00,  -0.500),
vec3( -0.55, -0.90,  -0.500),
vec3( 0.55, -0.90,  -0.500),
vec3( 0.55, -1.00,  -0.500),
vec3( -0.55, -1.00, -1.530),
vec3( -0.55, -0.90, -1.530),
vec3( 0.55, -0.90, -1.530),
vec3( 0.55, -1.00, -1.530),

// --- Tiang meja ---
vec3( -0.25, -0.90,  -0.790),
vec3( -0.25, -0.15,  -0.790),
vec3( 0.245, -0.15,  -0.790),
vec3( 0.245, -0.90,  -0.790),
vec3( -0.25, -0.90, -1.24),
vec3( -0.25, -0.15, -1.24),
vec3( 0.245, -0.15, -1.24),
vec3( 0.245, -0.90, -1.24),

// --- Permukaan meja ---
vec3( -0.725, -0.15,  -0.340),
vec3( -0.725,  0.00,  -0.340),
vec3( 0.725,  0.00,  -0.340),
vec3( 0.725, -0.15,  -0.340),
vec3( -0.725, -0.15, -1.69),
vec3( -0.725,  0.00, -1.69),
vec3( 0.725,  0.00, -1.69),
vec3( 0.725, -0.15, -1.69),


];


    // var vertexColors = [
    //     vec4(0.0, 0.0, 0.0, 1.0),  // black
    //     vec4(1.0, 0.0, 0.0, 1.0),  // red
    //     vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    //     vec4(0.0, 1.0, 0.0, 1.0),  // green
    //     vec4(0.0, 0.0, 1.0, 1.0),  // blue
    //     vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    //     vec4(1.0, 1.0, 1.0, 1.0),  // white
    //     vec4(0.0, 1.0, 1.0, 1.0)   // cyan
    // ];

var indices = [
    // Front-left leg (0–7)
    1,0,3,  3,2,1,
    2,3,7,  7,6,2,
    3,0,4,  4,7,3,
    6,5,1,  1,2,6,
    4,5,6,  6,7,4,
    5,4,0,  0,1,5,

    // Front-right leg (8–15)
    9,8,11, 11,10,9,
    10,11,15, 15,14,10,
    11,8,12, 12,15,11,
    14,13,9, 9,10,14,
    12,13,14, 14,15,12,
    13,12,8, 8,9,13,

    // Back-left leg (16–23)
    17,16,19, 19,18,17,
    18,19,23, 23,22,18,
    19,16,20, 20,23,19,
    22,21,17, 17,18,22,
    20,21,22, 22,23,20,
    21,20,16, 16,17,21,

    // Back-right leg (24–31)
    25,24,27, 27,26,25,
    26,27,31, 31,30,26,
    27,24,28, 28,31,27,
    30,29,25, 25,26,30,
    28,29,30, 30,31,28,
    29,28,24, 24,25,29,

    // connector fb-left
    33,32,35, 35,34,33,
    34,35,39, 39,38,34,
    35,32,36, 36,39,35,
    38,37,33, 33,34,38,
    36,37,38, 38,39,36,
    37,36,32, 32,33,37,

    // connector fb-right
    41,40,43, 43,42,41,
    42,43,47, 47,46,42,
    43,40,44, 44,47,43,
    46,45,41, 41,42,46,
    44,45,46, 46,47,44,
    45,44,40, 40,41,45,

    // ff connector
    49,48,51, 51,50,49,
    50,51,55, 55,54,50,
    51,48,52, 52,55,51,
    54,53,49, 49,50,54,
    52,53,54, 54,55,52,
    53,52,48, 48,49,53,

    // bb connector
    57,56,59, 59,58,57,
    58,59,63, 63,62,58,
    59,56,60, 60,63,59,
    62,61,57, 57,58,62,
    60,61,62, 62,63,60,
    61,60,56, 56,57,61,

    // plank a
    65,64,67, 67,66,65,
    66,67,71, 71,70,66,
    67,64,68, 68,71,67,
    70,69,65, 65,66,70,
    68,69,70, 70,71,68,
    69,68,64, 64,65,69,

    // plank b
    73,72,75, 75,74,73,
    74,75,79, 79,78,74,
    75,72,76, 76,79,75,
    78,77,73, 73,74,78,
    76,77,78, 78,79,76,
    77,76,72, 72,73,77,

    // plank C
    81,80,83, 83,82,81,
    82,83,87, 87,86,82,
    83,80,84, 84,87,83,
    86,85,81, 81,82,86,
    84,85,86, 86,87,84,
    85,84,80, 80,81,85,
    
    // --- Indices untuk meja: kaki (offset 88) ---
    89,88,91, 91,90,89, 
    90,91,95, 95,94,90, 
    91,88,92, 92,95,91, 
    94,93,89, 89,90,94, 
    92,93,94, 94,95,92, 
    93,92,88, 88,89,93,

    // --- Indices untuk meja: kolom (offset 96) ---
    97,96,99, 99,98,97, 
    98,99,103, 103,102,98, 
    99,96,100, 100,103,99, 
    102,101,97, 97,98,102, 
    100,101,102, 102,103,100, 
    101,100,96, 96,97,101,

    // --- Indices untuk meja: permukaan (offset 104) ---
    105,104,107, 107,106,105, 
    106,107,111, 111,110,106, 
    107,104,108, 108,111,107, 
    110,109,105, 105,106,110, 
    108,109,110, 110,111,108, 
    109,108,104, 104,105,109,

];


numElements = indices.length;

init();

function init()
{
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");


    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    canvas.addEventListener('mousedown', function(event) {
        isDragging = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
        autoRotate = false; 
    });

    canvas.addEventListener('mousemove', function(event) {
        if (!isDragging) return;
        
        var deltaX = event.clientX - lastMouseX;
        var deltaY = event.clientY - lastMouseY;
        
        theta[1] += deltaX * 0.5; // Rotasi horizontal
        theta[0] += deltaY * 0.5; // Rotasi vertikal
        
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    });

    canvas.addEventListener('mouseup', function() {
        isDragging = false;
    });

    canvas.addEventListener('mouseleave', function() {
        isDragging = false;
    });

    canvas.addEventListener('touchend', function() {
        isDragging = false;
    });

    // Double click untuk toggle auto rotate
    canvas.addEventListener('dblclick', function() {
        autoRotate = !autoRotate;
    });
    // Event listeners untuk kontrol ukuran
    var scaleSlider = document.getElementById('scale-slider');
    var scaleValue = document.getElementById('scaleValue');
    var smallerBtn = document.getElementById('smaller');
    var largerBtn = document.getElementById('larger');
    var resetBtn = document.getElementById('reset');
    var autoRotateBtn = document.getElementById('autoRotate');
    
    // Update tampilan nilai slider
    scaleValue.textContent = currentScale.toFixed(1) + 'x';
    scaleSlider.value = currentScale;
    
    // Event saat slider diubah
    scaleSlider.addEventListener('input', function() {
        currentScale = parseFloat(this.value);
        scaleValue.textContent = currentScale.toFixed(1) + 'x';
    });
    
    // Tombol perkecil
    smallerBtn.addEventListener('click', function() {
        if (currentScale > 0.1) {
            currentScale -= 0.1;
            currentScale = Math.max(0.1, currentScale);
            scaleSlider.value = currentScale;
            scaleValue.textContent = currentScale.toFixed(1) + 'x';
        }
    });
    
    // Tombol perbesar
    largerBtn.addEventListener('click', function() {
        if (currentScale < 2.0) {
            currentScale += 0.1;
            currentScale = Math.min(2.0, currentScale);
            scaleSlider.value = currentScale;
            scaleValue.textContent = currentScale.toFixed(1) + 'x';
        }
    });
    
    // Tombol reset
    resetBtn.addEventListener('click', function() {
        currentScale = 0.8;
        scaleSlider.value = currentScale;
        scaleValue.textContent = currentScale.toFixed(1) + 'x';
        
        theta = [0, 0, 0];
        position = [0, 0, 0];
        
        // Reset slider rotasi
        document.getElementById('rotateX').value = 0;
        document.getElementById('rotateXValue').textContent = '0°';
        document.getElementById('rotateY').value = 0;
        document.getElementById('rotateYValue').textContent = '0°';
        document.getElementById('rotateZ').value = 0;
        document.getElementById('rotateZValue').textContent = '0°';
        
        // Reset slider posisi
        document.getElementById('posX').value = 0;
        document.getElementById('posXValue').textContent = '0.0';
        document.getElementById('posY').value = 0;
        document.getElementById('posYValue').textContent = '0.0';

        
        autoRotate = true;
        autoRotateBtn.textContent = "Hentikan Rotasi";
    });
    
    // Tombol rotasi otomatis
    autoRotateBtn.addEventListener('click', function() {
        autoRotate = !autoRotate;
        this.textContent = autoRotate ? "Hentikan Rotasi" : "Rotasi Otomatis";
    });
    
    // Event listeners untuk kontrol rotasi
    document.getElementById('rotateX').addEventListener('input', function() {
        theta[0] = parseFloat(this.value);
        document.getElementById('rotateXValue').textContent = Math.round(theta[0]) + '°';
        autoRotate = false;
        autoRotateBtn.textContent = "Rotasi Otomatis";
    });
    
    document.getElementById('rotateY').addEventListener('input', function() {
        theta[1] = parseFloat(this.value);
        document.getElementById('rotateYValue').textContent = Math.round(theta[1]) + '°';
        autoRotate = false;
        autoRotateBtn.textContent = "Rotasi Otomatis";
    });
    
    document.getElementById('rotateZ').addEventListener('input', function() {
        theta[2] = parseFloat(this.value);
        document.getElementById('rotateZValue').textContent = Math.round(theta[2]) + '°';
        autoRotate = false;
        autoRotateBtn.textContent = "Rotasi Otomatis";
    });
    
    // Event listeners untuk kontrol posisi
    document.getElementById('posX').addEventListener('input', function() {
        position[0] = parseFloat(this.value);
        document.getElementById('posXValue').textContent = position[0].toFixed(1);
    });
    
    document.getElementById('posY').addEventListener('input', function() {
        position[1] = parseFloat(this.value);
        document.getElementById('posYValue').textContent = position[1].toFixed(1);
    });
    



    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // array element buffer

    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

    // // color array atrribute buffer

    // var cBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);

    // var colorLoc = gl.getAttribLocation(program, "thetaColor");
    // gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(colorLoc);

    // vertex array attribute buffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var positionAttrLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionAttrLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionAttrLoc);

    // Dapatkan lokasi uniform
    thetaLoc = gl.getUniformLocation(program, "uTheta");
    positionLoc = gl.getUniformLocation(program, "uPosition");
    thetaColor = gl.getUniformLocation(program, "thetaColor");
    scaleLoc = gl.getUniformLocation(program, "uScale");
    //event listeners for buttons



    render();
}

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // Rotasi otomatis jika tidak didrag
    if (autoRotate && !isDragging) {
        theta[1] += 0.7;
    }
    
    gl.uniform3fv(thetaLoc, theta);
    gl.uniform3fv(positionLoc, position);
    gl.uniform1f(scaleLoc, currentScale);
    
    // Gambar seluruh objek dengan warna kayu
    gl.uniform4fv(thetaColor, vec4(0.396, 0.267, 0.133, 1.0)); // Warna kayu
    gl.drawElements(gl.TRIANGLES, numElements, gl.UNSIGNED_BYTE, 0);
    
    requestAnimationFrame(render);
}