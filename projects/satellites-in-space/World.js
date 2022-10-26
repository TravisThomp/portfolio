class World {

    constructor() {
        this.onWindowResize = this.onWindowResize.bind(this);

        this.init3d();
        this._scene, this._camera, this._renderer, this._controls, this._earth;
    }

     init3d() {
        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color(0x000000);//0x29335C

        this._camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 4000 );
        this._camera.position.z = -300;
        this._camera.position.x = 650;
        this._camera.position.y = 100;

        //setting up renderer
        this._renderer = new THREE.WebGLRenderer();
        this._renderer.setSize(window.innerWidth, window.innerHeight);


        this._renderer.gammaFactor = 2.2;
        this._renderer.outputEncoding = THREE.GammaEncoding
        document.body.appendChild(this._renderer.domElement);

        const ambientLight = new THREE.AmbientLight( 0xffffff); //white light
        this._scene.add(ambientLight);

        this._controls = new THREE.OrbitControls(this._camera, document.getElementById("middle"));
        this.configureControls();

        let loader = new THREE.GLTFLoader();
        loader.load(
            "models/earth.glb",
            //onLoad
            function(gltf) {

                gltf.scene.scale.set(.13,.13, .13); // scale here

                this._scene.add(gltf.scene);
                this._earth = gltf.scene;
                exitLoadingScreen();
            }.bind(this)
        );

        window.addEventListener('resize', this.onWindowResize, false);
    }

    configureControls() {
        this._controls.enablePan = false; //stops user from moving modelsW
        this._controls.maxDistance = 3000;//max zoom
        this._controls.minDistance = 100;//min zoom
        this._controls.rotateSpeed = .5;
        this._controls.zoomSpeed = .8;
        this._controls.autoRotateSpeed = .25;
        this._controls.autoRotate = true;
        this._controls.enableDamping = true;

        this._controls.addEventListener('start', function(){
            this._controls.autoRotate = false;
        }.bind(this));

        this._controls.update();
    }

    onWindowResize(){
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize( window.innerWidth, window.innerHeight );
    }

    get scene() {
        return this._scene;
    }

    get camera() {
        return this._camera;
    }

    get renderer() {
        return this._renderer;
    }

    get controls() {
        return this._controls;
    }

    get earth() {
        return this._earth;
    }
}
