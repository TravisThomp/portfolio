class SatelliteInstance {

    constructor(name, tle1, tle2, date, futureDate) {
        this.name = name;
        this.satrec = satellite.twoline2satrec(tle1, tle2);
        this.period = (Math.PI * 2) / this.satrec.no;
        this.catalogNumber = tle1.substring(2, 7).trim();

        this.startPosition = this.posToPosArray(satellite.propagate(this.satrec, date).position);


        this.endInfo = satellite.propagate(this.satrec, futureDate);
        this.endPosition = this.posToPosArray(this.endInfo.position);

        this.diff = [((this.endPosition[0] - this.startPosition[0])/UPDATE_RATE),
             ((this.endPosition[1] - this.startPosition[1])/UPDATE_RATE),
             ((this.endPosition[2] - this.startPosition[2])/UPDATE_RATE)];

        this.clickSelected = false;
        this.orbitPath;
        this.orbitPathVisible = false;

    }

    isValidData() {
        return this.startPosition[0] != 0;
    }

    /*
    * Gets the current position of the satellite based of the current time
    * @param timeStepMultiple   the currentSeconds and milliseconds formatted as (seconds).(milliseconds)
    * @return   the current position of the satellite [x, y, z]
    */
    getPosition(timeStepMultiple) {
        let pos = [(this.diff[0]*timeStepMultiple + this.startPosition[0])/100,
            (this.diff[1]*timeStepMultiple + this.startPosition[1])/100,
            (this.diff[2]*timeStepMultiple + this.startPosition[2])/100];

        return pos;
    }

    /*
    * Updates the position estimate of the satellite based on the position of the satellite in the future
    * @param futureDate    The date in the future.
    */
    updatePositionEstimate(futureDate) {
        this.startPosition = this.endPosition;

        this.endInfo = satellite.propagate(this.satrec, futureDate);
        this.endPosition = this.posToPosArray(this.endInfo.position);

        this.diff = [((this.endPosition[0] - this.startPosition[0])/UPDATE_RATE),
             ((this.endPosition[1] - this.startPosition[1])/UPDATE_RATE),
             ((this.endPosition[2] - this.startPosition[2])/UPDATE_RATE)];
    }

    posToPosArray(pos) {
        //console.log(pos);
        if(pos == undefined || pos == null || pos.x == undefined) {
            return [0,0,0];
        }

        return [pos.x, pos.y, pos.z];
    }

    toggleClick() {
        if(this.clickSelected) {
            this.removeOrbitPath();
        } else {
            this.showOrbitPath();
        }
        this.clickSelected = !this.clickSelected;
    }

    toggleOrbitPath() {
        if(this.orbitPathVisible)
            this.removeOrbitPath();
        else
            this.showOrbitPath();
    }

    getOrbitPath() {
        if(this.orbitPath != null) {
            return this.orbitPath;
        }
        let t1 = performance.now();

        let date = new Date();
        //let material = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2, } );
        let material = new THREE.LineDashedMaterial( { color: 0x454ADE, linewidth: 2.5, dashSize: 2, gapSize: 1.5 } );
        let points = [];

        for(let i = 0; i < this.period+1; i++) {
            date = new Date(date.getTime() + 60000);//adding 1min to the date;
            let pos = this.posToPosArray(satellite.propagate(this.satrec, date).position);

            points.push(new THREE.Vector3(pos[0]/100, pos[1]/100, pos[2]/100));
        }
        let orbitGeometry = new THREE.BufferGeometry().setFromPoints( points );
        this.orbitPath = new THREE.Line(orbitGeometry, material);
        this.orbitPath.computeLineDistances();

        let t2 = performance.now();
        console.log("TOOK: " + (t2-t1) + " milliseconds");
        return this.orbitPath;
    }

    showOrbitPath() {
        if(!this.orbitPathVisible)
            world.scene.add(this.getOrbitPath());
        this.orbitPathVisible = true;
    }

    removeHoverObit() {
        if(!this.clickSelected)
            this.removeOrbitPath();
    }

    removeOrbitPath() {
        if(this.orbitPathVisible)
            world.scene.remove(this.getOrbitPath());
        this.orbitPathVisible = false;
    }

    get velocity() {
        let vel = this.endInfo.velocity;
        let velocity = Math.pow(vel.x, 2) + Math.pow(vel.y, 2) + Math.pow(vel.z, 2);
        velocity = Math.sqrt(velocity).toFixed(2);
        return velocity;
    }
}
