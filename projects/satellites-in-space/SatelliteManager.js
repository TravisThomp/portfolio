class SatelliteManager {

    constructor(newWorld) {
        this.world = newWorld;
        this._satArray = [];
        this._material = this.getMaterial();
        this._geometry;
        this._satellites;
        this.loaded = false;
        this._date = new Date();
        this._futureDate = new Date(this._date.getTime() + 1*60000);
        this._timeStepMultiple = 0;
        this.loadSatDate = this.loadSatData.bind(this);
        this.loadSatData();

    }

    init3d() {
        this._geometry = new THREE.InstancedBufferGeometry();
        this._geometry.maxInstancedCount = this._satArray.length;
        this._geometry.setDrawRange(0, 100);

        this._geometry.setAttribute("position", new THREE.InstancedBufferAttribute(new Float32Array(this._satArray.length * 3), 3));
        this._geometry.setAttribute("color", new THREE.BufferAttribute(this.getColorArray(), 3));

        this.updatePositionsArray();
        var pointsTornadoMat = new THREE.PointsMaterial(
          {
          vertexColors: THREE.VertexColors,
            size: 2,
            map: new THREE.TextureLoader().load("./resources/disc.png", tex => {
              tex.center.setScalar(0.5);
              tex.rotation = -Math.PI * 0.5;
            }),
            alphaTest: 0.5
          }
        );
        this._satellites = new THREE.Points(this._geometry, pointsTornadoMat);
        this.world.scene.add(this._satellites);
        this.loaded = true;
    }

    getColorArray() {
        let color = new THREE.Color(0xffffff);
        let colors = new Float32Array(this._satArray.length * 3);
        for(let i = 0; i < this._satArray.length * 3; i+=3) {
            //color =  new THREE.Color(Math.random(), Math.random(), Math.random());
            colors[i] = color.r;
            colors[i+1] = color.g;
            colors[i+2] = color.b;
        }
        return colors;
    }


    /*
    * Upadates the position of each satellite based on the current time, and makes sure the time is up to date
    */
    updateCurrentPositions() {
        this._date = new Date();
        let oldTimeStep = this._timeStepMultiple;
        this._timeStepMultiple = this._date.getSeconds() + this._date.getMilliseconds() * .001;

        if(oldTimeStep > this._timeStepMultiple) {
            console.log("UPDATE");
            this._futureDate = new Date(this._date.getTime() + 1*60000);
            this.updateSatellitePositionEstimates();
        }

        this.updatePositionsArray();
    }

    /*
    * Updates the position array for each satellite
    */
    updatePositionsArray() {
        for(let i = 0; i < this._satArray.length*3; i+=3) {
            this.updatePosition(i);
        }

        this._geometry.attributes.position.needsUpdate = true;
    }

    /*
    * Updates the position array for a single satellite
    */
    updatePosition(locationInArray) {
        let positionArray = this._geometry.attributes.position.array;
        let satPosition = this._satArray[locationInArray/3].getPosition(this._timeStepMultiple);

        for(let j = 0; j < 3; j++)
            positionArray[locationInArray + j] = satPosition[j];
    }

    /*
    * Updates the estimate of the satellite position of each satellite for a more accurate estimate.
    */
    updateSatellitePositionEstimates() {
        this._satArray.forEach((sat) => {
            sat.updatePositionEstimate(this._futureDate);
        });
    }

    getMaterial() {
        var sprite = new THREE.TextureLoader().load('./resources/disc2.png');
        //var material = new THREE.PointsMaterial( { size: 2, vertexColors: true, color: 0xffffff } );
        var material = new THREE.PointsMaterial({
            vertexColors: THREE.VertexColors,
            size: 8,
            color: 0xffffff,
            map: new THREE.TextureLoader().load("./resources/disc2.png", tex => {
            tex.center.setScalar(0.5);
            tex.rotation = -Math.PI * 0.5;
        }),
        alphaTest: 0.5
      }
    );
        return material;
    }

    loadSatData() {
        fetch("./serverside/sat.json")
            .then((resp) => {
                return resp.json();
            })
            .then((data) => {
                data.satellites.forEach((satData) => {
                    let sat = new SatelliteInstance(satData.name, satData.tle1, satData.tle2, this._date, this._futureDate);
                    if(sat.isValidData()) {
                        this._satArray.push(sat);
                        searchManager.addItemToList(sat);
                    }
                });
            })
            .then(() => {
                this.init3d();
            }).then(() => {
                animate();
            });
    }

    getSatByCatalog(satCatalog) {
        for(let i = 0; i < this._satArray.length; i++) {
            if(this._satArray[i].catalogNumber == satCatalog) {
                return this._satArray[i];
            }
        }
        return this._satArray[0];
    }

    get geometry() {
        return this._geometry;
    }

    get satellites() {
        return this._satellites;
    }

    get satArray() {
        return this._satArray;
    }

    get timeStepMultiple() {
        return this._timeStepMultiple;
    }
}
