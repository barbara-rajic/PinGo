export default class Form {
    #form = document.querySelector(".form");
    #type = document.querySelector(".form__input--type");
    #distance = document.querySelector(".form__input--distance");
    #duration = document.querySelector(".form__input--duration");
    #cadence = document.querySelector(".form__input--cadence");
    #elevation = document.querySelector(".form__input--elevation");

    constructor() {
      // Add event listeners
      this.#type.addEventListener(
        "change",
        this.#toggleFields.bind(this)
      );
    }

    get() {
      return this.#form;
    }

    type() {
      return this.#type;
    }

    distance() {
      return this.#distance;
    }

    duration() {
      return this.#duration;
    }

    cadence() {
      return this.#cadence;
    }

    elevation() {
      return this.#elevation;
    }

    #clearInputs() {
        // Clear input fields
      this.#duration.value =
      this.#distance.value =
      this.#cadence.value =
      this.#elevation.value =
        "";
    }

    hidde() { // Hidde form
      // Clear inputs from fields
      this.#clearInputs();

      // Hidde form
      this.#form.classList.add("hidden");
    }

    #hiddeField(input) {
      input.closest(".form__row").classList.add("form__row--hidden");
    }

    #chooseField() {
      if (this.#type.value === "running") {
          // If value is running
          this.#hiddeField(this.#elevation);
        } else {
          // if value is cycling
          this.#hiddeField(this.#cadence);
        }
  }

    show() { // Show form
      // Choose form type
      this.#chooseField()

      // Show form
      this.#form.classList.remove("hidden");
    }

    #toggleField(input) {
      input.closest(".form__row").classList.toggle("form__row--hidden");
    }

    #toggleFields() {
      this.#toggleField(this.#elevation);
      this.#toggleField(this.#cadence);
    }
}
