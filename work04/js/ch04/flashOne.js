"use strict";

var gl;
var vBuffer;
var cBuffer;
var index = 0;

function initRectCanvas() {
    var canvas = document.getElementById("rect-canvas");
    gl = canvas.getContext("webgl");
    if (!gl) {
        alert("无法初始化WebGL");
        return;
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    initShaders();
}

function initShaders() {
    var vertexShaderSource = document.getElementById("vertex-shader").text;
    var fragmentShaderSource = document.getElementById("fragment-shader").text;
    
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    vBuffer = gl.createBuffer();
    cBuffer = gl.createBuffer();
}

function drawSquare() {
    var x = parseFloat(document.getElementById("x").value);
    var y = parseFloat(document.getElementById("y").value);
    var size = 0.5;

    var vertices = new Float32Array([
        x, y,
        x + size, y,
        x + size, y + size,
        x, y + size
    ]);

    var color = new Float32Array([
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0
    ]);

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    var vPosition = gl.getAttribLocation(gl.getParameter(gl.CURRENT_PROGRAM), "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, color, gl.STATIC_DRAW);
    var vColor = gl.getAttribLocation(gl.getParameter(gl.CURRENT_PROGRAM), "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}