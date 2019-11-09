function executeCode(func) {
    var script = document.createElement('script');
    script.id = 'tmpScript';
    script.appendChild(document.createTextNode(`(${func.toString()})()`));
    (document.body || document.head || document.documentElement).appendChild(script);
}

executeCode(function () {
    function cheaterLog(message, type) {
        console[typeof type !== 'undefined' ? type : 'log']('%cGeoguessr cheater\t%c' + message, 'color:blue', 'color:black');
    }

    /*** intercept Google Maps API ***/
    if (typeof window.MapConstructor === 'undefined' && typeof google !== 'undefined' && typeof google.maps !== 'undefined' && typeof google.maps.Map !== 'undefined')
        window.MapConstructor = google.maps.Map;

    /*** intercept game information ***/
    const callback = function () {
        try {
            const gameDetails = JSON.parse(this.response);
            const roundDetails = gameDetails.rounds[gameDetails.round - 1];
            const latitude = roundDetails.lat;
            const longitude = roundDetails.lng;
            try {
                cheaterLog(`Round: ${gameDetails.round}\tLatitude: ${latitude}\tLongitude: ${longitude}`, 'info');
                var CMap = new MapConstructor(document.getElementsByClassName('game-usps')[0], { zoom: 3, center: { lat: latitude, lng: longitude } });
                new google.maps.Marker({ position: { lat: latitude, lng: longitude }, map: CMap });
            } catch (e) {
                console.error('Geoguessr cheater error:', e);
            }
        } catch (e) { }
    }
    var originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        this.addEventListener('load', callback);
        originalOpen.apply(this, arguments);
    };
});
