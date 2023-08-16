export default class Storage {
    data;

    constructor() {
        this.#manageData();
    }

    #manageData() {
        const helper = [];

        // Get data from local storage
        for (let i = 0; i < localStorage.length; i++) {
            helper.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
        }

        this.data = helper;
    }

    set(workout) {
        // Set data to the local storage
        localStorage.setItem(workout.id, JSON.stringify(workout));

        this.#manageData();
    }

    get() {
        // Return data from local storage
        return this.data;
    }

    check() {
        // Check if variable data is undefined or empty arry
        return typeof this.data === 'undefined' || this.data.length === 0 ? false : true;
    }
}
