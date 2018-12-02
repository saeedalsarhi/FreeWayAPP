class App {
  constructor() {
    const urlPathString = window.location.pathname;
    const parts = urlPathString.split('/');
    if (parts[1] === 'update.html') {
      this._showUpdateStationView();
    } else {
      this._showCalculationView();
    }
  }

  _showCalculationView() {
    const viewContainer = document.querySelector('#calculationView');
    const creatorView = new calculationView(viewContainer);
  }

  _showUpdateStationView() {
    const viewContainer = document.querySelector('#updateStationView');
    const updateStation = new updateStationView(viewContainer);
  }
}
