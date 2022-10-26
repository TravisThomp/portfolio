class SatelliteClickManager {

    constructor() {
        this._ratcaster;
        this._mouse = new THREE.Vector2();;
        this.lastHovered = null;
        this.tooltip = document.getElementById("sat-tooltip");
        this.init();
    }

    init() {
        this._raycaster = new THREE.Raycaster();
        this._mouse = new THREE.Vector2();

        window.addEventListener("mousemove", this.onMouseMove.bind(this), false);
        window.addEventListener("click", this.onMouseClick.bind(this), false);
    }

    onMouseClick( event ) {
    	let intersect = this.getSatelliteFromMouse(event);

        if(intersect != undefined) {
            let satIndex = intersect.index;
            let sat = satManager.satArray[satIndex];
            sat.toggleClick();
            this.toggleSatelliteSelect(sat);
        }
    }

    onMouseMove( event ) {
        let intersect = this.getSatelliteFromMouse(event);

        if(intersect != undefined) {
            let satIndex = intersect.index;
            let sat = satManager.satArray[satIndex];
            if(this.lastHovered != sat) {
                this.updateHoveredSat(sat);

                this.showToolTip(sat);
            }
        } else {
            if(this.lastHovered != null) {
                this.removeToolTip();

                this.lastHovered.removeHoverObit();
                this.lastHovered = null;
            }
        }
    }

    updateHoveredSat(sat) {
        if(this.lastHovered != null)
            this.lastHovered.removeHoverObit();

        sat.showOrbitPath();
        this.lastHovered = sat;
    }


    showToolTip(sat) {
        document.getElementById("tooltip-name").textContent = sat.name;
        this.setToolTipLocation(this.tooltip, event);
        this.tooltip.style.display = "block";
    }

    removeToolTip() {
        this.tooltip.style.display = "none";
    }

    setToolTipLocation(tooltip, event) {
        let x = (event.clientX + 10) + 'px',
        y = (event.clientY - 10) + 'px';

        tooltip.style.top = y;
        tooltip.style.left = x;
    }

    getSatelliteFromMouse(event) {
        this._mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    	this._mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        this._raycaster.setFromCamera(this._mouse, world.camera);
        var intersects = this._raycaster.intersectObject(satManager.satellites);

        return intersects[0];
    }

    toggleSatelliteSelect(sat) {
        this.updateSatDisplayInfo(sat);

        if(sat.clickSelected) {
            document.getElementById("intro").style.display = "none";
            document.getElementById("info").style.display = "block";
        } else {
            document.getElementById("intro").style.display = "block";
            document.getElementById("info").style.display = "none";
        }
        searchManager.toggleColor(sat.catalogNumber);
    }

    focusSatellite(sat) {
        let pos = sat.getPosition(satManager.timeStepMultiple);
        const DISTANCE_MULT = 5;
        world.camera.position.x = pos[0] + Math.sign(pos[0]) * DISTANCE_MULT ;
        world.camera.position.y = pos[1] + Math.sign(pos[1]) * DISTANCE_MULT;
        world.camera.position.z = pos[2] + Math.sign(pos[2]) * DISTANCE_MULT;
        world.camera.lookAt(sat);
        console.log(world.camera.position);
    }

    updateSatDisplayInfo(sat) {
        document.getElementById("object-name").textContent = sat.name;
        document.getElementById("object-velocity").textContent = sat.velocity + " km/s"
        document.getElementById("object-period").textContent = (sat.period).toFixed(2) + " MIN";
    }

}
