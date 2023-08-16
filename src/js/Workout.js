class Workout {
    date = new Date();
    id = Date.now() + "";
  
    constructor(distance, duration, coords) {
      this.distance = distance;
      this.duration = duration;
      this.coords = coords;
    }
  
    setDescription() {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
  
      this.description = `${this.type[0].toUpperCase()}${this.type.slice(
        1
      )} on the ${months[this.date.getMonth()]} ${this.date.getDate()}`;
    }
  }
  
  export class Running extends Workout {
    type = "running";
  
    constructor(distance, duration, coords, cadence) {
      super(distance, duration, coords);
      this.cadence = cadence;
      this.pace = this.calcPace();
      this.setDescription();
    }
  
    calcPace() {
      return this.duration / this.distance;
    }
  }
  
  export class Cycling extends Workout {
    type = "cycling";
  
    constructor(distance, duration, coords, elevationGrin) {
      super(distance, duration, coords);
      this.elevationGrin = elevationGrin;
      this.speed = this.calcSpeed();
      this.setDescription();
    }
  
    calcSpeed() {
      return this.distance / (this.duration / 60);
    }
  }
