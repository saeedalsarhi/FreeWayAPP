class calculationView{
    constructor(containerElement) {
        this.containerElement = containerElement;

        this.startDateInput   = document.querySelector('#startDateInput');
        this.endDateInput     = document.querySelector('#endDateInput');
        this.stationNameInput = document.querySelector('#stationNameInput');
        this.form             = document.querySelector('form');
        this.calculationView  = document.querySelector('#calculationView');

        // Bind methods.
        this._onFormChange        = this._onFormChange.bind(this);
        this._onFormSubmit        = this._onFormSubmit.bind(this);
        this._saveValuesFromInput = this._saveValuesFromInput.bind(this);

        // Add event listeners.
        // this.startDateInput.addEventListener    ('keyup', this._onFormChange);
        // this.endDateInput.addEventListener      ('keyup', this._onFormChange);
        // this.stationNameInput.addEventListener  ('keyup', this._onFormChange);
        this.form.addEventListener('submit', this._onFormSubmit);

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
            startDate   : this.startDate,
            endDate     : this.endDate,
            stationName : this.stationName
        }
        const fetchOptions = {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        };
        // console.log(fetchOptions);
        const result = await fetch('/calc', fetchOptions);
        const json = await result.json();

    }

    _saveValuesFromInput() {
        
        // Save Start Date.
        if (this.startDateInput !== null)
            this.startDate = this.startDateInput.value;
        // Save End Date.
        if (this.endDateInput !== null)
            this.endDate = this.endDateInput.value;
        // Save Station Name.
        if (this.stationNameInput !== null)
            this.stationName = this.stationNameInput.value;
    }
}