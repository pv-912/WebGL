 var vertexShaderText = 
  [
  'precision mediump float;',
  '',
  'attribute vec3 vertPosition;', // as three input x,y,z
  'attribute vec3 vertColor;',   //r,g,b
  'varying vec3 fragColor;',
  'uniform mat4 mWorld;',
  'uniform mat4 mView;',
  'uniform mat4 mProj;',
  '',
  'void main()',
  '{', 
  'fragColor = vertColor; ',
  'gl_Position = mProj *mView * mWorld * vec4(vertPosition,1.0);', // right to left operation will be run
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

  var gl;

  var InitDemo = function (){
    console.log('this is working');

    var canvas = document.getElementById('game-surface');
     gl = canvas.getContext('webgl');

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
    gl.enable(gl.DEPTH_TEST);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);  
  

  // Create shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);


    gl.shaderSource(vertexShader,vertexShaderText);
    gl.shaderSource(fragmentShader,fragmentShaderText);

    //compile shader   
    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader,gl.COMPILE_STATUS)){
      console.error('Error in compiling fragment shader',gl.getShaderInfoLog(fragmentShader));
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

    var boxVertices = 
    [//x,y,z  , R,G,B

      //top
      -1.0,1.0,-1.0,  0.5,0.5,0.5,
      -1.0,1.0,1.0,  0.5,0.5,0.5,
      1.0,1.0,1.0,  0.5,0.5,0.5,
      1.0,1.0,-1.0,  0.5,0.5,0.5,

      //left
      -1.0,1.0,1.0,  0.75,0.25,0.5,
      -1.0,-1.0,1.0,  0.75,0.25,0.5,
      -1.0,-1.0,-1.0,  0.75,0.25,0.5,
      -1.0,1.0,-1.0, 0.75,0.25,0.5,
          
     // right
      1.0,1.0,1.0,  0.25,0.25,0.15,
      1.0,-1.0,1.0,  0.25,0.25,0.15,
      1.0,-1.0,-1.0,  0.25,0.25,0.15,
      1.0,1.0,-1.0,  0.25,0.25,0.15,

      // front
      1.0,1.0,1.0,  1.0,0.0,0.15,
      1.0,-1.0,1.0,  1.0,0.0,0.15,
      -1.0,-1.0,1.0,  1.0,0.0,0.15,
      -1.0,1.0,1.0,  1.0,0.0,0.15,

      //back
      1.0,1.0,-1.0,  0.0, 1.0 , 0.15,
      1.0,-1.0,-1.0,  0.0, 1.0 , 0.15,
      -1.0,-1.0,-1.0,  0.0, 1.0 , 0.15,
      -1.0,1.0,-1.0,  0.0, 1.0 , 0.15,

       //bottom
       -1.0,-1.0,-1.0,  0.5, 0.5 , 1.0,
       -1.0,-1.0,1.0,  0.5, 0.5 , 1.0,
       1.0,-1.0,1.0,  0.5, 0.5 , 1.0,
       1.0,-1.0,-1.0,  0.5, 0.5 , 1.0,

    ];

    var boxIndices=
    [
      //top
      0,1,2,
      0,2,3,

      //left
      5,4,6,
      6,4,7,

      //ri8
      8,9,10,
      8,10,11,

      //front
      13,12,14,
      15,14,12,

      //back
      16,17,18,
      16,18,19,

      //bottom
      21,20,22,
      22,20,23
    ]

    var boxVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);  //binding buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices),gl.STATIC_DRAW);


    var boxIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER , boxIndexBufferObject );
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(boxIndices),gl.STATIC_DRAW);
    //to handle on the attribute

    var positionAttribLocation = gl.getAttribLocation(program,'vertPosition');
     var colorAttribLocation = gl.getAttribLocation(program,'vertColor'); //for another attribute


    // to specify the layout 
    gl.vertexAttribPointer(   // 5 arguments
      positionAttribLocation,  //Attribute location
      3,    //no. of element per attribute x,y
      gl.FLOAT,   //type of element
      gl.FALSE,
      6*Float32Array.BYTES_PER_ELEMENT,   //5*4 Size of aan individual vertex
      0  //Offset from the begining of a single vertex to this attribute
      );
    gl.vertexAttribPointer(   // 5 arguments
      colorAttribLocation,  //Attribute location
      3,    //no. of element per attribute r,g,b
      gl.FLOAT,   //type of element
      gl.FALSE,
      6*Float32Array.BYTES_PER_ELEMENT,   //Size of aan individual vertex
      3 *Float32Array.BYTES_PER_ELEMENT,   //Offset from the begining of a single vertex to this attribute
      );



    //enable the attributre
    gl.enableVertexAttribArray(positionAttribLocation);
     gl.enableVertexAttribArray(colorAttribLocation);

     //tell OpenGL state machine  that program should be active  
     gl.useProgram(program);

     //getting location in graphics in gpu memory

     var matWorldUniformLocation = gl.getUniformLocation(program,'mWorld');
     var matViewUniformLocation = gl.getUniformLocation(program,'mView');
     var matProjdUniformLocation = gl.getUniformLocation(program,'mProj');

     var worldMatrix = new Float32Array(16);
     var viewMatrix = new Float32Array(16);
     var projMatrix = new Float32Array(16);


     

     mat4.identity(worldMatrix);//identity matrix for making cube

     mat4.lookAt(viewMatrix, [0,0,-8],[0,0,0],[0.5,0.2,0.6]); // function for camera view , argument (out,eye,center,up)
     // mat4.identity(viewMatrix);

     // mat4.identity(projMatrix);

     mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0); // (out,field of view,aspect ratio viewport width/height,near absolute closing thing to show,far farthest thing to show)

     //type of matrix

     gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);  // uniform for uniform , matrix for matrix . 4 for 4by4 , f fot input type , u have to put gl.TRUE if u want a transpose
     gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);  // uniform for uniform , matrix for matrix . 4 for 4by4 , f fot input type , u have to put gl.TRUE if u want a transpose
     gl.uniformMatrix4fv(matProjdUniformLocation, gl.FALSE, projMatrix);  // uniform for uniform , matrix for matrix . 4 for 4by4 , f fot input type , u have to put gl.TRUE if u want a transpose
    

    //rotation

    var xRotationMatrix = new Float32Array(16);
    var yRotationMatrix = new Float32Array(16);
    var zRotationMatrix = new Float32Array(16);       


    //main render loop
    var identityMatrix = new Float32Array(16);
    mat4.identity(identityMatrix);
    var angle = 0;

    var loop = function(){
        angle = performance.now() / 1000 / 6 * 2 * Math.PI; //in 6 sec it will rotate 2pi angle
        mat4.rotate(xRotationMatrix,identityMatrix, angle,[0,1,0]); // matrix on to use,matrix with respect to rotate , angle,axis to which rotatio will be done
        mat4.rotate(yRotationMatrix,identityMatrix, angle,[1,1,0]); // matrix on to use,matrix with respect to rotate , angle,axis to which rotatio will be done
        mat4.rotate(zRotationMatrix,identityMatrix, angle,[1,1,1]); // matrix on to use,matrix with respect to rotate , angle,axis to which rotatio will be done
        mat4.mul(worldMatrix,xRotationMatrix,yRotationMatrix,zRotationMatrix);

        gl.uniformMatrix4fv(matWorldUniformLocation,gl.FALSE,worldMatrix);

        gl.clearColor(0.75,0.85,0.,1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES,boxIndices.length,gl.UNSIGNED_SHORT,0);
        
        requestAnimationFrame(loop);
    };

   requestAnimationFrame(loop);

  };