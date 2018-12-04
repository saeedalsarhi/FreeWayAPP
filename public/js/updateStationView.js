class updateStationView {
    constructor(containerElement) {
        this.containerElement = containerElement;

        this.oldStationNameInput = document.querySelector('#oldStationNameInput');
        this.newStationNameInput = document.querySelector('#newStationNameInput');
        this.form = document.querySelector('form');
        this.updateStationView = document.querySelector('#updateStationView');

        // Bind methods.
        this._onFormStart = this._onFormStart.bind(this);
        this._onFormChange = this._onFormChange.bind(this);
        this._onFormSubmit = this._onFormSubmit.bind(this);
        this._saveValuesFromInput = this._saveValuesFromInput.bind(this);

        // Add event listeners.
        window.addEventListener('load', this._onFormStart);
        this.newStationNameInput.addEventListener('keyup', this._onFormChange);
        this.form.addEventListener('submit', this._onFormSubmit);
        this._saveValuesFromInput();

        // this.containerElement.classList.remove('hidden');
    }

    async _onFormStart(event) {
        event.preventDefault();

        const params = {
            stationNames: ''
        }
        const fetchOptions = {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        };

        const result = await fetch('/populate', fetchOptions);
        const json = await result.json();

        for (var i = 0; i < json.stationNames.length; i++) {
            var option = document.createElement("option");
            option.text = json.stationNames[i];
            option.value = json.stationNames[i];
            var select = document.getElementById("oldStationNameInput");
            select.appendChild(option);
        }
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
        const result = await fetch('/save', fetchOptions);
        const json = await result.json();
    }

    _saveValuesFromInput() {
        // Save old Name.
        if(this.oldStationNameInput !== null)
            this.oldStationName = this.oldStationNameInput.value;
        // Save new Name.
        if(this.newStationNameInput !== null)
            this.newStationName = this.newStationNameInput.value;
    }
}