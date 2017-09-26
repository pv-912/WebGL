 var vertexShaderText = 
  [
  'precision mediump float;',
  '',
  'attribute vec2 vertPosition;',
  'attribute vec3 vertColor;',
  'varying vec3 fragColor;',
  '',
  'void main()',
  '{', 
  'fragColor = vertColor; ',
  'gl_Position = vec4(vertPosition,0.0,1.0);',
  '}'
  ].join('\n');


  var fragmentShaderText = 
  [
  'precision mediump float;',
  '',
  'varying vec3 fragColor;',

  'void main()',
  '{',
  'gl_FragColor = vec4(fragColor,1.0);',//initially 3 color + 1 opacity argument is needed but as fragColor has 3 argument its compensate that
  '}'
  ].join('\n');


  var InitDemo = function (){
    console.log('this is working');

    var canvas = document.getElementById('game-surface');
    var gl = canvas.getContext('webgl');

    if(!gl){
      gl = canvas.getContext('experimental-webgl');
    }

    if(!gl){
      alert('your browser dont support webgl');
    }

    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;

    gl.clearColor(0.0,0.0,0.0,.5);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  

  // Create shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);


    gl.shaderSource(vertexShader,vertexShaderText);
    gl.shaderSource(fragmentShader,fragmentShaderText);

    //compile shader
    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader,gl.COMPILE_STATUS)){
      console.error('Error in compiling vertex shader',gl.getShaderInfoLog(vertexShader));
      return;
    }

    gl.compileShader(fragmentShader);
    if(!gl.getShaderParameter(fragmentShader,gl.COMPILE_STATUS)){
      console.error('Error in compiling fragment shader',gl.getShaderInfoLog(vertexShader));
      return;
    }

    //attach the shader

    var program = gl.createProgram();
    gl.attachShader(program,vertexShader);
    gl.attachShader(program,fragmentShader);
    
    gl.linkProgram(program);//link the program
    
    //checking error
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
      console.error('error in linking program ',gl.getProgramInfoLog(program));
      return;
    }

    //validating program
    gl.validateProgram(program);
    if(!gl.getProgramParameter(program,gl.VALIDATE_STATUS)){
      console.error('Error in validating program' , gl.getProgramInfoLog(program));
      return;
    }

    // Create Buffer

    var triangleVertices = 
    [//x,y  , R,G,B
      0.0,0.5,   1.0,0.0,1.0,
      -0.5,-0.5,  0.5,0.6,1,
      0.5,-0.5 ,  0.6,0.2,0.0
    ];

    var triangleVerticesBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,triangleVerticesBufferObject);  //binding buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices),gl.STATIC_DRAW);

    //to handle on the attribute

    var positionAttribLocation = gl.getAttribLocation(program,'vertPosition');
     var colorAttribLocation = gl.getAttribLocation(program,'vertColor'); //for another attribute


    // to specify the layout 
    gl.vertexAttribPointer(   // 5 arguments
      positionAttribLocation,  //Attribute location
      2,    //no. of element per attribute x,y
      gl.FLOAT,   //type of element
      gl.FALSE,
      5*Float32Array.BYTES_PER_ELEMENT,   //5*4 Size of aan individual vertex
      0  //Offset from the begining of a single vertex to this attribute
      );
    gl.vertexAttribPointer(   // 5 arguments
      colorAttribLocation,  //Attribute location
      3,    //no. of element per attribute r,g,b
      gl.FLOAT,   //type of element
      gl.FALSE,
      5*Float32Array.BYTES_PER_ELEMENT,   //Size of aan individual vertex
      2 *Float32Array.BYTES_PER_ELEMENT,   //Offset from the begining of a single vertex to this attribute
      );



    //enable the attributre
    gl.enableVertexAttribArray(positionAttribLocation);
     gl.enableVertexAttribArray(colorAttribLocation);

    //main render loop

    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES,0,3);

  };