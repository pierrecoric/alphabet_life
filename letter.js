//Global variables

//The Force and speed.
maxForce = 0.1;
maxSpeed = 3.9;
//The different radiuses.
alignmentRadius = 77;
cohesionRadius = 68;
separationRadius = 45;
//The min and max values.
alignMin = -0.2;
alignMax = 1;
cohesionMin = -0.3;
cohesionMax = 0.9;
separationMin = -0.1;
separationMax = 1.8;

//Functions to handle the sliders
function setupSlider(sliderId, valueId, managed) {
    let slider = document.getElementById(sliderId);
    let valueDisplay = document.getElementById(valueId);

    slider.addEventListener('input', () => {
        valueDisplay.textContent = slider.value;
        window[managed] = parseFloat(slider.value);
    });
}

//Funciton to reset a slider to a value.
function resetSlider(sliderId, valueId, value) {
    let slider = document.getElementById(sliderId);
    let valueDisplay = document.getElementById(valueId);
    valueDisplay.textContent = value;
    slider.value = value
}

//Function to reset all forces to the original values.
function resetAllForces() {
    resetSlider('maxForceSlider', 'maxForce', 0.1);
    resetSlider('maxSpeedSlider', 'maxSpeed', 3.9);
    resetSlider('alignmentRadiusSlider', 'alignmentRadius', 77);
    resetSlider('cohesionRadiusSlider', 'cohesionRadius', 68);
    resetSlider('separationRadiusSlider', 'separationRadius', 45);
    resetSlider('alignmentMinSlider', 'alignmentMin', -0.2);
    resetSlider('alignmentMaxSlider', 'alignmentMax', 1);
    resetSlider('cohesionMinSlider', 'cohesionMin', -0.3);
    resetSlider('cohesionMaxSlider', 'cohesionMax', 0.9);
    resetSlider('separationMinSlider', 'separationMin', -0.1);
    setupSlider('separationMaxSlider', 'separationMax', 1.8);

    maxForce = 0.1;
    maxSpeed = 3.9;

    alignmentRadius = 77;
    cohesionRadius = 68;
    separationRadius = 45;

    alignMin = -0.2;
    alignMax = 1;
    cohesionMin = -0.3;
    cohesionMax = 0.9;
    separationMin = -0.1;
    separationMax = 1.8;
}

//Function to constantly listen to the sliders.
function listenToSliders() {
    setupSlider('alignmentRadiusSlider', 'alignmentRadius', 'alignmentRadius');
    setupSlider('cohesionRadiusSlider', 'cohesionRadius', 'cohesionRadius');
    setupSlider('separationRadiusSlider', 'separationRadius', 'separationRadius');
    setupSlider('maxForceSlider', 'maxForce', 'maxForce');
    setupSlider('maxSpeedSlider', 'maxSpeed', 'maxSpeed');
    setupSlider('alignmentMinSlider', 'alignmentMin', 'alignmentMin');
    setupSlider('alignmentMaxSlider', 'alignmentMax', 'alignmentMax');
    setupSlider('cohesionMinSlider', 'cohesionMin', 'cohesionMin');
    setupSlider('cohesionMaxSlider', 'cohesionMax', 'cohesionMax');
    setupSlider('separationMinSlider', 'separationMin', 'separationMin');
    setupSlider('separationMaxSlider', 'separationMax', 'separationMax');
}

//Activation of the above function.
listenToSliders();

//The letter boid class.
class Letter {
    constructor(character, xPos, yPos, size) {
        //Basic variables.
        this.character = character;
        this.xPos = xPos;
        this.yPos = yPos;
        this.size = size;
        this.speed = character.charCodeAt(0) / 10;
        this.xIncrease = true;
        this.yIncrease = true;
        //Boid variables.
        this.position = createVector(xPos, yPos);
        this.velocity = createVector();
        this.acceleration = createVector();
    }

    //Function that displays the letter.
    display() {
        //Handle the colouring.
        if (colorReccuring) {
            this.fillColor = map(occurencesLetters[this.charToPosition(this.character)], 0, mostOccuringLetter, 0, 255);
        }
        else {
            this.fillColor = 0;
        }
        fill(255, 255 - this.fillColor, 255 - this.fillColor);
        stroke(0);
        circle(this.position.x, this.position.y, this.size);
        const characterWidth = textWidth(this.character);
        const offsetX = characterWidth / 2;
        fill(0);
        noStroke();
        text(this.character, this.position.x - offsetX, this.position.y + 4);
    }

    //Function to display the different attraction radiuses
    displayRadius() {
        noFill();
        stroke(255, 0, 0);
        circle(this.position.x, this.position.y, 2 * alignmentRadius);
        stroke(0, 255, 0);
        circle(this.position.x, this.position.y, 2 * cohesionRadius);
        stroke(0, 0, 255);
        circle(this.position.x, this.position.y, 2 * separationRadius);
    }

    //ALignement.
    align(letters) {
        let perceptionDistance = alignmentRadius;
        let total = 0;
        let steering = createVector();
        for (let other of letters) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (d < perceptionDistance && other != this) {
                let weightRec = map(heatmap[this.charToPosition(this.character)][this.charToPosition(other.character)], 0, occurencesMostReccuringPair, alignMin, alignMax);
                let weight = map(d, 0, perceptionDistance, 1, 0);
                // Apply the weight to the position
                let weightedPosition = other.position.copy().mult(weightRec);
                weightedPosition.add(other.position.copy().mult(weight));
                steering.add(weightedPosition);
                //Increment by 2 as we add two kinds of weights.
                total += 2;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(maxSpeed);
            steering.sub(this.velocity);
            steering.limit(maxForce);
        }
        return steering;
    }

    //Cohesion
    cohesion(letters) {
        let perceptionDistance = cohesionRadius;
        let total = 0;
        let steering = createVector();
        for (let other of letters) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (d < perceptionDistance && other != this) {
                let weightRec = map(heatmap[this.charToPosition(this.character)][this.charToPosition(other.character)], 0, occurencesMostReccuringPair, cohesionMax, cohesionMin);
                let weight = map(d, 0, perceptionDistance, 1, 0);
                // Apply the weight to the position
                let weightedPosition = other.position.copy().mult(weightRec);
                weightedPosition.add(other.position.copy().mult(weight));
                steering.add(weightedPosition);
                //Increment by 2 as we add two kinds of weights.
                total += 2;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.sub(this.position);
            steering.setMag(maxSpeed);
            steering.sub(this.velocity);
            steering.limit(maxForce);
        }
        return steering;
    }

    //Separation
    separation(letters) {
        let perceptionDistance = separationRadius;
        let total = 0;
        let steering = createVector();
        for (let other of letters) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (d < perceptionDistance && other != this) {
                let diff = p5.Vector.sub(this.position, other.position);
                diff.div(d);
                let weightRec = map(heatmap[this.charToPosition(this.character)][this.charToPosition(other.character)], 0, occurencesMostReccuringPair, separationMin, separationMax);
                let weight = map(d, 0, perceptionDistance, 1, 0);
                diff.mult(weightRec);
                diff.mult(weight)
                steering.add(diff);
                //Increment by 2 as we add two kinds of weights.
                total += 2;
            }
        }
        if (total > 0) {
            steering.div(total); // Normalize by total weight
            steering.setMag(maxSpeed);
            steering.sub(this.velocity);
            steering.limit(maxForce);
        }
        return steering;
    }

    //Flocking function.
    flock(letters) {
        let alignment = this.align(letters);
        let cohesion = this.cohesion(letters);
        let separation = this.separation(letters);

        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);
        if(wrap) {
            this.edgesOpen();
        }
        else {
            this.edges();
        }
    }

    //Update according to the different forces that have been calculated.
    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(maxSpeed);
        //reset the acceleration.
        this.acceleration.mult(0);
    }

    //Function to handle the edges of the screen.
    edges() {
        if (this.position.x < this.size / 2) {
            this.position.x = this.size / 2; // Prevent overlap with boundary
            this.velocity.x = abs(this.velocity.x); // Reflect velocity
        } else if (this.position.x > width - this.size / 2) {
            this.position.x = width - this.size / 2;
            this.velocity.x = -abs(this.velocity.x);
        }

        if (this.position.y < this.size / 2) {
            this.position.y = this.size / 2;
            this.velocity.y = abs(this.velocity.y);
        } else if (this.position.y > height - this.size / 2) {
            this.position.y = height - this.size / 2;
            this.velocity.y = -abs(this.velocity.y);
        }
    }

    //Function to handle the edges of the screen and wrap around.
    edgesOpen() {
        if (this.position.x < 0 - this.size / 2) {
            this.position.x = width;
        }
        else if (this.position.x > width + this.size / 2) {
            this.position.x = 0;
        }
        if (this.position.y < 0 - this.size / 2) {
            this.position.y = height;
        }
        else if (this.position.y > height + this.size / 2) {
            this.position.y = 0;
        }
    }

    charToPosition(char) {
        return char.charCodeAt(0) - 'A'.charCodeAt(0);
    }
}
