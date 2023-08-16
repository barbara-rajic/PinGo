import L from 'leaflet';

import '/src/scss/style.scss';
import '/node_modules/leaflet/dist/leaflet.css';

import '/node_modules/leaflet/dist/images/marker-icon-2x.png';
import '/node_modules/leaflet/dist/images/marker-shadow.png';

import Form from './UIcontroller';
import Storage from './Storage';
import {Cycling, Running} from './Workout';
  
  class App {
    map;
    mapEvent;
    mapZoom = 15;
    form = new Form();
    workouts = new Storage();
    workoutsContainer = document.querySelector(".workouts");
  
    constructor() {
      // Get user's position
      this.findCoordinatesAsync()
      .then((position) => {
        // Load map
        this.loadMap(position)

        // Get stored data
        this.getStorage()

        // Add event listeners
        this.map.on('click', this.showForm.bind(this))
        this.form.get().addEventListener("submit", this.newWorkout.bind(this));
        this.workoutsContainer.addEventListener("click", this.moveToPosition.bind(this));
      })
      .catch((error) => alert(`${error}. Please try again!`));
    }

    loadMap(position) {
      // Set the map
      this.map = L.map("map").setView([position.latitude, position.longitude], this.mapZoom);

      // Display tile layers on the map
      L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);
    }

    findCoordinatesAsync() {
      // Find user's position
      return new Promise ((resolve, reject) => {
        if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
            resolve(position.coords)
          },(error) => {
            // If position not found alert user
            reject(error.message)
          })};
      });
    }
    
    showForm(mapEvent) {
      // Asign value to global variable mapEvent
      this.mapEvent = mapEvent;
  
      // Display form
      this.form.show()
    }

    newWorkout(event) {
      // Prevent page reload
      event.preventDefault();
  
      // Helpers
      const inputsValid = (...inputs) =>
        inputs.every((input) => Number.isFinite(input));
  
      const inputsPositive = (...inputs) => inputs.every((input) => input > 0);
  
      // Get marker's coordinates
      const { lat, lng } = this.mapEvent.latlng;
  
      // Get data from input forms
      const type = this.form.type().value;
      const duration = +this.form.duration().value;
      const distance = +this.form.distance().value;
  
      // Create new workout
      let workout;
  
      if (type === "running") {
        // Create object if type is running
        const cadence = +this.form.cadence().value;
  
        if (
          !inputsValid(duration, distance, cadence) ||
          !inputsPositive(duration, distance, cadence)
        )
          return alert("Inputs have to be positive numbers");
  
        workout = new Running(distance, duration, [lat, lng], cadence);
      }
  
      if (type === "cycling") {
        // Create object if type is cycling
        const elevation = +this.form.elevation().value;
  
        if (
          !inputsValid(duration, distance, elevation) ||
          !inputsPositive(duration, distance)
        )
          return alert("Inputs have to be positive numbers");
  
        workout = new Cycling(distance, duration, [lat, lng], elevation);
      }
  
      // Render workout on map as marker
      this.renderWorkoutMarker(workout);
  
      // Render workout on list
      this.renderWorkoutOnList(workout);
  
      // Hide form and clear input fields
      this.form.hidde()
  
      // Add new workout to the storage
      this.workouts.set(workout);
    }
  
    // Create marker
    renderWorkoutMarker(workout) {
      L.marker(workout.coords)
        .addTo(this.map)
        .bindPopup(
          L.popup({
            maxWidth: 250,
            minWidth: 100,
            autoClose: false,
            className: `${workout.type}-popup`,
          })
        )
        .setPopupContent(
          `${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${workout.description}`
        )
        .openPopup();
    }
  
    renderWorkoutOnList(workout) {
      var html = `
        <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <h1>${workout.description}</h1>
          <div class="workout__container">
            <div class="workout__details">
              <span class="workout__icon">${
                workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"
              }</span>
              <span class="workout__value">${workout.distance}</span>
              <span class="workout__unit">km</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">⏱</span>
              <span class="workout__value">${workout.duration}</span>
              <span class="workout__unit">min</span>
            </div> 
        `;
  
      if (workout.type === "running") {
        html += `
          <div class="workout__details">
              <span class="workout__icon">⚡️</span>
              <span class="workout__value">${workout.pace.toFixed(1)}</span>
              <span class="workout__unit">min/km</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">🦶🏼</span>
              <span class="workout__value">${workout.cadence}</span>
              <span class="workout__unit">spm</span>
            </div>
          </div>
        `;
      } else {
        html += `
          <div class="workout__details">
              <span class="workout__icon">⚡️</span>
              <span class="workout__value">${workout.speed.toFixed(1)}</span>
              <span class="workout__unit">km/h</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">⛰</span>
              <span class="workout__value">${workout.elevationGrin}</span>
              <span class="workout__unit">m</span>
            </div>
          </div>
        `;
      }
      html += `</li>`;
  
      this.form.get().insertAdjacentHTML("afterend", html);
    }
  
    moveToPosition(event) {
      
      const workoutElement = event.target.closest(".workout");
  
      if (!workoutElement) return;
  
      const workout = this.workouts.get().find(
        (work) => work.id === workoutElement.dataset.id
      );
  
      this.map.setView(workout.coords, this.mapZoom, {
        animate: true,
        pan: {
          duration: 1,
        },
      });
    }

    getStorage() {
      if (this.workouts.check() === false) return;

      this.workouts.get().forEach((workout) => {
        this.renderWorkoutOnList(workout);
        this.renderWorkoutMarker(workout)
      });
    }
  }
  
  const app = new App();

