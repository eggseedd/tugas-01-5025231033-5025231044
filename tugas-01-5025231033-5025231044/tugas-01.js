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
var near = 0.3;
var thetacam = 0.0;
var far = 3.0;
var radius = 4.0;
var phi = 0.0;
var dr = 5.0 * Math.PI/180.0;


var lightPosition = [0, -0.075, 2];
var lightPositionLoc;
// Lighting properties - sekarang boolean untuk toggle
var ambientEnabled = true;
var diffuseEnabled = true; 
var specularEnabled = true;
var shininess = 15.0;
var normalLoc;
var viewPositionLoc;

// Light stays white and neutral
var lightAmbient   = vec4(1.0, 1.0, 1.0, 1.0);
var lightDiffuse   = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular  = vec4(1.0, 1.0, 1.0, 1.0);

// Material: warm brown diffuse, weak specular
var materialAmbient   = vec4(0.25, 0.15, 0.1, 1.0);
var materialDiffuse   = vec4(0.6, 0.3, 0.15, 1.0);
var materialSpecular  = vec4(0.2, 0.2, 0.2, 1.0);

// Uniform locations
var ambientEnabledLoc, diffuseEnabledLoc, specularEnabledLoc, shininessLoc;

var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect;       // Viewport aspect ratio
var modelViewMatrixLoc, projectionMatrixLoc;
var modelViewMatrix, projectionMatrix;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

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

    // kaki kiri depan
    vec3(-0.8, -1.0, -1.605),
    vec3(-0.8, -0.3, -1.605),
    vec3(-0.7, -0.3, -1.605),
    vec3(-0.7, -1.0, -1.605),
    vec3(-0.8, -1.0, -1.705),
    vec3(-0.8, -0.3, -1.705),
    vec3(-0.7, -0.3, -1.705),
    vec3(-0.7, -1.0, -1.705),

    // kaki kanan depan
    vec3(0.7, -1.0, -1.605),
    vec3(0.7, -0.3, -1.605),
    vec3(0.8, -0.3, -1.605),
    vec3(0.8, -1.0, -1.605),
    vec3(0.7, -1.0, -1.705),
    vec3(0.7, -0.3, -1.705),
    vec3(0.8, -0.3, -1.705),
    vec3(0.8, -1.0, -1.705),

    // kaki kiri belakang
    vec3(-0.8, -1.0, -2.355),
    vec3(-0.8, -0.3, -2.355),
    vec3(-0.7, -0.3, -2.355),
    vec3(-0.7, -1.0, -2.355),
    vec3(-0.8, -1.0, -2.455),
    vec3(-0.8, -0.3, -2.455),
    vec3(-0.7, -0.3, -2.455),
    vec3(-0.7, -1.0, -2.455),

    // kaki kanan belakang
    vec3(0.7, -1.0, -2.355),
    vec3(0.7, -0.3, -2.355),
    vec3(0.8, -0.3, -2.355),
    vec3(0.8, -1.0, -2.355),
    vec3(0.7, -1.0, -2.455),
    vec3(0.7, -0.3, -2.455),
    vec3(0.8, -0.3, -2.455),
    vec3(0.8, -1.0, -2.455),

    // connector fb-left
    vec3(-0.78, -0.45, -1.605),  
    vec3(-0.78, -0.30, -1.605),  
    vec3(-0.7, -0.30, -1.605),
    vec3(-0.7, -0.45, -1.605),

    vec3(-0.78, -0.45, -2.455),
    vec3(-0.78, -0.30, -2.455),
    vec3(-0.7, -0.30, -2.455),
    vec3(-0.7, -0.45, -2.455),

    // connector fb-right
    vec3(0.7, -0.45, -1.605),
    vec3(0.7, -0.30, -1.605),
    vec3(0.78, -0.30, -1.605),
    vec3(0.78, -0.45, -1.605),

    vec3(0.7, -0.45, -2.455),
    vec3(0.7, -0.30, -2.455),
    vec3(0.78, -0.30, -2.455),
    vec3(0.78, -0.45, -2.455),

    // ff connector
    vec3(-0.8, -0.45, -1.625),
    vec3(-0.8, -0.30, -1.625),
    vec3( 0.8, -0.30, -1.625),
    vec3( 0.8, -0.45, -1.625),

    vec3(-0.8, -0.45, -1.705),
    vec3(-0.8, -0.30, -1.705),
    vec3( 0.8, -0.30, -1.705),
    vec3( 0.8, -0.45, -1.705),

    // Bb connector
    vec3(-0.8, -0.45, -2.355),
    vec3(-0.8, -0.30, -2.355),
    vec3( 0.8, -0.30, -2.355),
    vec3( 0.8, -0.45, -2.355),

    vec3(-0.8, -0.45, -2.435),
    vec3(-0.8, -0.30, -2.435),
    vec3( 0.8, -0.30, -2.435),
    vec3( 0.8, -0.45, -2.435),

    // plank A
    vec3(-0.8, -0.3, -1.605),  
    vec3(-0.8, -0.27, -1.605),  
    vec3( 0.8, -0.27, -1.605),  
    vec3( 0.8, -0.3, -1.605),  
    vec3(-0.8, -0.3, -1.872),  
    vec3(-0.8, -0.27, -1.872),  
    vec3( 0.8, -0.27, -1.872),  
    vec3( 0.8, -0.3, -1.872),  

    // Plank b
    vec3(-0.8, -0.3, -1.880),  
    vec3(-0.8, -0.27, -1.880),  
    vec3( 0.8, -0.27, -1.880), 
    vec3( 0.8, -0.3, -1.880), 
    vec3(-0.8, -0.3, -2.180),  
    vec3(-0.8, -0.27, -2.180),  
    vec3( 0.8, -0.27, -2.180),  
    vec3( 0.8, -0.3, -2.180),  

    // plank C
    vec3(-0.8, -0.3, -2.188),  
    vec3(-0.8, -0.27, -2.188),  
    vec3( 0.8, -0.27, -2.188), 
    vec3( 0.8, -0.3, -2.188), 
    vec3(-0.8, -0.3, -2.455),  
    vec3(-0.8, -0.27, -2.455),  
    vec3( 0.8, -0.27, -2.455),  
    vec3( 0.8, -0.3, -2.455),
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

    // Kursi kedua

    // Front-left leg (112–119)
    113,112,115, 115,114,113,
    114,115,119, 119,118,114,
    115,112,116, 116,119,115,
    118,117,113, 113,114,118,
    116,117,118, 118,119,116,
    117,116,112, 112,113,117,

    // Front-right leg (120–127)
    121,120,123, 123,122,121,
    122,123,127, 127,126,122,
    123,120,124, 124,127,123,
    126,125,121, 121,122,126,
    124,125,126, 126,127,124,
    125,124,120, 120,121,125,

    // Back-left leg (128–135)
    129,128,131, 131,130,129,
    130,131,135, 135,134,130,
    131,128,132, 132,135,131,
    134,133,129, 129,130,134,
    132,133,134, 134,135,132,
    133,132,128, 128,129,133,

    // Back-right leg (136–143)
    137,136,139, 139,138,137,
    138,139,143, 143,142,138,
    139,136,140, 140,143,139,
    142,141,137, 137,138,142,
    140,141,142, 142,143,140,
    141,140,136, 136,137,141,

    // connector fb-left (144–151)
    145,144,147, 147,146,145,
    146,147,151, 151,150,146,
    147,144,148, 148,151,147,
    150,149,145, 145,146,150,
    148,149,150, 150,151,148,
    149,148,144, 144,145,149,

    // connector fb-right (152–159)
    153,152,155, 155,154,153,
    154,155,159, 159,158,154,
    155,152,156, 156,159,155,
    158,157,153, 153,154,158,
    156,157,158, 158,159,156,
    157,156,152, 152,153,157,

    // ff connector (160–167)
    161,160,163, 163,162,161,
    162,163,167, 167,166,162,
    163,160,164, 164,167,163,
    166,165,161, 161,162,166,
    164,165,166, 166,167,164,
    165,164,160, 160,161,165,

    // bb connector (168–175)
    169,168,171, 171,170,169,
    170,171,175, 175,174,170,
    171,168,172, 172,175,171,
    174,173,169, 169,170,174,
    172,173,174, 174,175,172,
    173,172,168, 168,169,173,

    // plank a (176–183)
    177,176,179, 179,178,177,
    178,179,183, 183,182,178,
    179,176,180, 180,183,179,
    182,181,177, 177,178,182,
    180,181,182, 182,183,180,
    181,180,176, 176,177,181,

    // plank b (184–191)
    185,184,187, 187,186,185,
    186,187,191, 191,190,186,
    187,184,188, 188,191,187,
    190,189,185, 185,186,190,
    188,189,190, 190,191,188,
    189,188,184, 184,185,189,

    // plank c (192–199)
    193,192,195, 195,194,193,
    194,195,199, 199,198,194,
    195,192,196, 196,199,195,
    198,197,193, 193,194,198,
    196,197,198, 198,199,196,
    197,196,192, 192,193,197,
];

numElements = indices.length;

var colors = [];

for (let i = 0; i < vertices.length; i++) {
    if (
        // plank A (64–71), B (72–79), C (80–87),
        // dan kursi kedua plank A (184–191), B (192–199), C (200–207)
        (i >= 64 && i <= 71) ||
        (i >= 80 && i <= 87) ||
        (i >= 176 && i <= 183) ||
        (i >= 192 && i <= 199)
    ) {
        // Hitam (0.141, 0.067, 0.051, 1.0)
        colors.push(0.141, 0.067, 0.051, 1.0);
    } else {
        // Coklat kayu (0.396, 0.267, 0.133, 1.0)
        colors.push(0.396, 0.267, 0.133, 1.0);
    }
}




init();

function init()
{
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");


    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    aspect =  canvas.width/canvas.height;

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
        
        // Reset toggle lighting
ambientEnabled = true;
diffuseEnabled = true;
specularEnabled = true;
shininess = 15.0;

document.getElementById('ambientToggle').checked = true;
document.getElementById('ambientStatus').textContent = 'ON';
document.getElementById('diffuseToggle').checked = true;
document.getElementById('diffuseStatus').textContent = 'ON';
document.getElementById('specularToggle').checked = true;
document.getElementById('specularStatus').textContent = 'ON';
document.getElementById('shininess').value = 15;
document.getElementById('shininessValue').textContent = '15';

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
        
                // Reset posisi cahaya
        lightPosition = [0, -0.075, 2];
        document.getElementById('lightX').value = 0;
        document.getElementById('lightXValue').textContent = '0';
        document.getElementById('lightY').value = -0.075;
        document.getElementById('lightYValue').textContent = '-0.075';
        document.getElementById('lightZ').value = 2;
        document.getElementById('lightZValue').textContent = '2.0';
        
        autoRotate = true;
        autoRotateBtn.textContent = "Hentikan Rotasi";
    });

    // Event listeners untuk toggle lighting
document.getElementById('ambientToggle').addEventListener('change', function() {
    ambientEnabled = this.checked;
    document.getElementById('ambientStatus').textContent = ambientEnabled ? "ON" : "OFF";
});

document.getElementById('diffuseToggle').addEventListener('change', function() {
    diffuseEnabled = this.checked;
    document.getElementById('diffuseStatus').textContent = diffuseEnabled ? "ON" : "OFF";
});

document.getElementById('specularToggle').addEventListener('change', function() {
    specularEnabled = this.checked;
    document.getElementById('specularStatus').textContent = specularEnabled ? "ON" : "OFF";
});

document.getElementById('shininess').addEventListener('input', function() {
    shininess = parseFloat(this.value);
    document.getElementById('shininessValue').textContent = shininess;
});
    
        // Event listeners untuk kontrol posisi cahaya
    document.getElementById('lightX').addEventListener('input', function() {
        lightPosition[0] = parseFloat(this.value);
        document.getElementById('lightXValue').textContent = lightPosition[0].toFixed(1);
    });

    document.getElementById('lightY').addEventListener('input', function() {
        lightPosition[1] = parseFloat(this.value);
        document.getElementById('lightYValue').textContent = lightPosition[1].toFixed(1);
    });

    document.getElementById('lightZ').addEventListener('input', function() {
        lightPosition[2] = parseFloat(this.value);
        document.getElementById('lightZValue').textContent = lightPosition[2].toFixed(1);
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
        // Dapatkan lokasi atribut dan uniform untuk lighting
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);


    normalLoc = gl.getAttribLocation(program, "aNormal");
    viewPositionLoc = gl.getUniformLocation(program, "uViewPosition");
    
    // Buat dan kirim data normal
    var normals = calculateNormals(vertices, indices);
    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);

    // array element buffer

    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

    // // color array atrribute buffer

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    var aColor = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aColor);

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
    // thetaColor = gl.getUniformLocation(program, "thetaColor");
    scaleLoc = gl.getUniformLocation(program, "uScale");
    // Di fungsi init(), setelah membuat program
ambientEnabledLoc = gl.getUniformLocation(program, "uAmbientEnabled");
diffuseEnabledLoc = gl.getUniformLocation(program, "uDiffuseEnabled");
specularEnabledLoc = gl.getUniformLocation(program, "uSpecularEnabled");
shininessLoc = gl.getUniformLocation(program, "uShininess");

    lightPositionLoc = gl.getUniformLocation(program, "uLightPosition");
    //event listeners for buttons

    modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");

    gl.uniform4fv(gl.getUniformLocation(program,
       "uAmbientProduct"),flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program,
       "uDiffuseProduct"),flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program,
       "uSpecularProduct"),flatten(specularProduct));

// buttons for viewing parameters

    document.getElementById("Button1").onclick = function(){near  *= 1.1; far *= 1.1;};
    document.getElementById("Button2").onclick = function(){near *= 0.9; far *= 0.9;};
    document.getElementById("Button3").onclick = function(){radius *= 2.0;};
    document.getElementById("Button4").onclick = function(){radius *= 0.5;};
document.getElementById("Button5").onclick = function(){thetacam += dr;}; // PERBAIKAN: thetacam bukan theta
document.getElementById("Button6").onclick = function(){thetacam -= dr;}; // PERBAIKAN: thetacam bukan theta
    document.getElementById("Button7").onclick = function(){phi += dr;};
    document.getElementById("Button8").onclick = function(){phi -= dr;};

    render();
}
// PERBAIKI fungsi calculateNormals:
function calculateNormals(vertices, indices) {
    // Inisialisasi array normal dengan ukuran yang benar
    const normals = new Array(vertices.length * 3);
    for (let i = 0; i < normals.length; i++) {
        normals[i] = 0;
    }
    
    for (let i = 0; i < indices.length; i += 3) {
        const idx1 = indices[i];
        const idx2 = indices[i + 1];
        const idx3 = indices[i + 2];
        
        const v1 = vertices[idx1];
        const v2 = vertices[idx2];
        const v3 = vertices[idx3];
        
        const u = subtract(v2, v1);
        const v = subtract(v3, v1);
        const normal = normalize(cross(u, v));
        
        // Tambahkan normal ke setiap vertex
        for (let j = 0; j < 3; j++) {
            normals[idx1 * 3 + j] += normal[j];
            normals[idx2 * 3 + j] += normal[j];
            normals[idx3 * 3 + j] += normal[j];
        }
    }
    
    // Normalize semua normal
    for (let i = 0; i < vertices.length; i++) {
        const nx = normals[i * 3];
        const ny = normals[i * 3 + 1];
        const nz = normals[i * 3 + 2];
        
        const length = Math.sqrt(nx * nx + ny * ny + nz * nz);
        
        if (length > 0.0001) {
            normals[i * 3] = nx / length;
            normals[i * 3 + 1] = ny / length;
            normals[i * 3 + 2] = nz / length;
        } else {
            // Default normal jika tidak valid
            normals[i * 3] = 0.0;
            normals[i * 3 + 1] = 1.0;
            normals[i * 3 + 2] = 0.0;
        }
    }
    
    return normals;
}
function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // Rotasi otomatis jika tidak didrag
    if (autoRotate && !isDragging) {
        theta[1] += 0.7;
    }
    
    // === INI DITARUH DI SINI - DI AWAL RENDER ===
    
    // Transformasi kamera
    eye = vec3(radius*Math.sin(thetacam)*Math.cos(phi),
        radius*Math.sin(thetacam)*Math.sin(phi), radius*Math.cos(thetacam));
    modelViewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(fovy, aspect, near, far);

    // Kirim uniform untuk lighting
    gl.uniform3fv(viewPositionLoc, eye); // Posisi kamera untuk specular
    gl.uniform3fv(lightPositionLoc, lightPosition);
    
    // Kirim uniform lainnya
    gl.uniform3fv(thetaLoc, theta);
    gl.uniform3fv(positionLoc, position);
    gl.uniform1f(scaleLoc, currentScale);
    
    // Kirim toggle lighting
    gl.uniform1i(ambientEnabledLoc, ambientEnabled);
    gl.uniform1i(diffuseEnabledLoc, diffuseEnabled);
    gl.uniform1i(specularEnabledLoc, specularEnabled);
    gl.uniform1f(shininessLoc, shininess);
    
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    
    gl.drawElements(gl.TRIANGLES, numElements, gl.UNSIGNED_BYTE, 0);
    
    requestAnimationFrame(render);
}