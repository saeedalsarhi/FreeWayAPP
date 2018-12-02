class updateStationView {
    constructor(containerElement) {
        this.containerElement = containerElement;

        this.oldStationNameInput = document.querySelector('#oldStationNameInput');
        this.newStationNameInput = document.querySelector('#newStationNameInput');
        console.log(this.oldStationNameInput.value);
        this.form = document.querySelector('form');
        this.updateStationView = document.querySelector('#updateStationView');

        // Bind methods.
        this._onFormChange = this._onFormChange.bind(this);
        this._onFormSubmit = this._onFormSubmit.bind(this);
        this._saveValuesFromInput = this._saveValuesFromInput.bind(this);

        // Add event listeners.
        this.oldStationNameInput.addEventListener('keyup', this._onFormChange);
        this.newStationNameInput.addEventListener('keyup', this._onFormChange);
        this.form.addEventListener('submit', this._onFormSubmit);
        console.log(this.oldStationNameInput.value);
        this._saveValuesFromInput();

        // this.containerElement.classList.remove('hidden');
    }
    _onFormChange() {
        this._saveValuesFromInput();
    }

    async _onFormSubmit(event) {
        event.preventDefault();

        this._saveValuesFromInput();

        const params = {
            oldStationName: this.oldStationName,
            newStationName: this.newStationName,
        }
        const fetchOptions = {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        };
        console.log(params);
        const result = await fetch('/save', fetchOptions);
        const json = await result.json();

    }

    _saveValuesFromInput() {
        // Save old Name.
        // console.log(this.oldStationName.value);
        if(this.oldStationNameInput !== null)
            this.oldStationName = this.oldStationNameInput.value;
        // Save new Name.
        if(this.newStationNameInput !== null)
            this.newStationName = this.newStationNameInput.value;
    }
}