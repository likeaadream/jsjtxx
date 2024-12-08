"use strict";

var gl;
var program;

// 缓存位置
var triangleBuffer;
var squareBuffer;
var trapezoidBuffer;

function initCanvas() {
    var canvas = document.getElementById("canvas");
    gl = canvas.getContext("webgl");

    if (!gl) {
        alert("无法初始化WebGL");
        return;
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    initShaders();
    bindControls();
}

function initShaders() {
    var vertexShaderSource = document.getElementById("vertex-shader").text;
    var fragmentShaderSource = document.getElementById("fragment-shader").text;

    var vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
}

function createShader(type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation failed: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function bindControls() {
    document.getElementById("drawTriangle").onclick = drawTriangle;
    document.getElementById("drawSquare").onclick = drawSquare;
    document.getElementById("drawTrapezoid").onclick = drawTrapezoid;
}

function drawTriangle() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    var scale = parseFloat(document.getElementById("triangleScale").value);
    var vertices = new Float32Array([
        0, 0.5 * scale,
        -0.5 * scale, -0.5 * scale,
        0.5 * scale, -0.5 * scale
    ]);

    var colors = new Float32Array([
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ]);

    triangleBuffer = createBuffer(vertices, colors);
    drawShape(triangleBuffer);
}

function drawSquare() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    var angle = parseFloat(document.getElementById("squareRotate").value) * Math.PI / 180; // 转换为弧度
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    
    var vertices = new Float32Array([
        -0.5, -0.5,
        0.5, -0.5,
        0.5, 0.5,
        -0.5, 0.5
    ]);

    var colors = new Float32Array([
        1.0, 1.0, 0.0, 1.0,
        1.0, 1.0, 0.0, 1.0,
        1.0, 1.0, 0.0, 1.0,
        1.0, 1.0, 0.0, 1.0
    ]);

    squareBuffer = createBuffer(vertices, colors);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer.vertexBuffer);
    var attrLocation = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(attrLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attrLocation);

    // 计算旋转后的顶点
    var rotatedVertices = new Float32Array(4 * 2);
    for (var i = 0; i < 4; i++) {
        rotatedVertices[i * 2] = vertices[i * 2] * cos - vertices[i * 2 + 1] * sin;
        rotatedVertices[i * 2 + 1] = vertices[i * 2] * sin + vertices[i * 2 + 1] * cos;
    }
    
    // 使用旋转后的顶点进行绘制
    gl.bufferData(gl.ARRAY_BUFFER, rotatedVertices, gl.STATIC_DRAW);
    drawShape(squareBuffer);
}

function drawTrapezoid() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    var translateX = parseFloat(document.getElementById("trapezoidTranslateX").value);
    var translateY = parseFloat(document.getElementById("trapezoidTranslateY").value);

    var vertices = new Float32Array([
        -0.5 + translateX, -0.5 + translateY,
        0.5 + translateX, -0.5 + translateY,
        0.3 + translateX, 0.5 + translateY,
        -0.3 + translateX, 0.5 + translateY
    ]);

    var colors = new Float32Array([
        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0
    ]);

    trapezoidBuffer = createBuffer(vertices, colors);
    drawShape(trapezoidBuffer);
}

function createBuffer(vertices, colors) {
    var vertexBuffer = gl.createBuffer();
    var colorBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    return { vertexBuffer: vertexBuffer, colorBuffer: colorBuffer };
}

function drawShape(buffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.vertexBuffer);
    var attrLocation = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(attrLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attrLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.colorBuffer);
    var colorLocation = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLocation);

    // 根据不同的形状绘制
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4); // 对于三角形和正方形
}

window.onload = initCanvas;