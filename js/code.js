

//Init view, start animation
var camera, scene, renderer, particles, geometry, materials = [], parameters, i, h, color, size;

var posX = 0;
var posY = 0;
var posZ = 0;

var HandRightX;
var HandRightY;

var HandLeftX;
var HandLeftY;



var SEPARATION = 100, AMOUNTX = 120, AMOUNTY = 120;

var container, stats;
var camera, scene, renderer;

var particles, particle, count = 0;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {


    ///////////////////////KINECT STUFF /////////////////////

    //Init Kinect connection, start depth
    FusionKinect.connect("172.17.11.137");
    FusionKinect.setSkeletonsEnabled(true);


    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.5, 1000);
    renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(0x000000);
    renderer.setSize(window.innerWidth, window.innerHeight);

    var axis = new THREE.AxisHelper(10);
    scene.add(axis);

    var gridHelper = new THREE.GridHelper( 50, 50);
    scene.add( gridHelper );

    var cubeGeometry = new THREE.BoxGeometry(100, 100, 100);
    var cubeMaterial = new THREE.MeshBasicMaterial({
        color: 0xdddddd,
        wireframe: true
    });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    cube.position.x = 0;
    cube.position.y = 0;
    cube.position.z = -5;

    scene.add(cube);

    renderer.render(scene, camera);
    $("#webGL-container").append(renderer.domElement);

    ////////////////////////////////////////////////////////


    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x050505, 1, 100);

    particles = new Array();

    var PI2 = Math.PI * 2;
    var material = new THREE.SpriteCanvasMaterial( {

        color: 0xffffff,
        program: function ( context ) {

            context.beginPath();
            context.arc( 0, 0, 0.5, 0, PI2, true );
            context.fill();

        }

    } );

    var i = 0;

    for ( var ix = 0; ix < AMOUNTX; ix ++ ) {

        for ( var iy = 0; iy < AMOUNTY; iy ++ ) {

            particle = particles[ i ++ ] = new THREE.Sprite( material );
            particle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
            particle.position.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
            scene.add( particle );

        }
    }

    renderer = new THREE.CanvasRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    stats = new Stats();
    container.appendChild( stats.dom );


}


function animate() {

    requestAnimationFrame( animate );

    render();
    stats.update();

}

function render() {
    data = FusionKinect.getSkeletonData();

//        console.log(data.Skeletons);


    var calcSizeZ = data.Skeletons[0].absoluteRawSkeleton.Head.position.Z*500;
    var calcSizeX = data.Skeletons[0].absoluteRawSkeleton.Head.position.X*500;
    var calcSizeY = data.Skeletons[0].absoluteRawSkeleton.Head.position.Y*900+400;

    HandRightY = data.Skeletons[0].absoluteRawSkeleton.HandRight.position.Y*100+50;
    HandRightX = data.Skeletons[0].absoluteRawSkeleton.HandRight.position.X*10+10;

    HandLeftY = data.Skeletons[0].absoluteRawSkeleton.HandLeft.position.Y*10+10;
    HandLeftX = data.Skeletons[0].absoluteRawSkeleton.HandLeft.position.X*10+20;

    console.log(HandRightY,HandRightX);

    camera.position.x = posX;
    camera.position.y = posY;
    camera.position.z = posZ;

    posX = calcSizeX/5;
    posY = calcSizeY/5;
    posZ = calcSizeZ/5;

    camera.lookAt(scene.position);

    var i = 0;

    for ( var ix = 0; ix < AMOUNTX; ix ++ ) {

        for ( var iy = 0; iy < AMOUNTY; iy ++ ) {

            particle = particles[ i++ ];
            particle.position.y = ( Math.sin( ( ix + count ) * 0.3 ) * 50 ) +
                ( Math.sin( ( iy + count ) * 0.5 ) * HandRightY );
            particle.scale.x = particle.scale.y = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 4 +
                ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * HandLeftY;

        }

    }

    renderer.render( scene, camera );

    count += 0.1;

}
