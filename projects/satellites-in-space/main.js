let world, satManager, satClickManager, searchManager;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
const UPDATE_RATE = 60;

window.onload = (event) => {
    init();
};

function init() {
    document.getElementById("info").style.display = "none";
    world = new World();
    satManager = new SatelliteManager(world  );
    satClickManager = new SatelliteClickManager(this, this.world);
    searchManager = new SearchManager();
    //exitLoadingScreen();
}

function exitLoadingScreen() {
    const loadingScreen = document.getElementById("loading");
    loadingScreen.style.opacity = "0";
    loadingScreen.remove();

    document.getElementById("overlay").style.opacity = "100";
    world.renderer.domElement.style.opacity = "100";
}

function animate() {
	requestAnimationFrame(animate);

    if(satManager.loaded)
	   render();
}

function render() {
    world.camera.updateProjectionMatrix();
    satManager.updateCurrentPositions();
    world.controls.update();
    world.renderer.render(world.scene, world.camera);
}
