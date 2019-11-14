function executeCode(func) {
    var script = document.createElement('script');
    script.id = 'tmpScript';
    script.appendChild(document.createTextNode(`(${func.toString()})()`));
    (document.body || document.head || document.documentElement).appendChild(script);
}

executeCode(() => {
    function cheaterLog(message, type) {
        console[typeof type !== 'undefined' ? type : 'log']('%cGeoguessr cheater\t%c' + message, 'color:blue', 'color:black');
    }

    const coordinates = {};

    /*** intercept game information ***/
    const markerProtoOverloaded = false;
    const callbackLoad = function () {
        try {
            const gameDetails = JSON.parse(this.response);
            const roundDetails = gameDetails.rounds[gameDetails.round - 1];
            coordinates.lat = roundDetails.lat;
            coordinates.lng = roundDetails.lng;
            try {
                cheaterLog(`Info found:\tRound: ${gameDetails.round}\tLatitude: ${coordinates.lat}\tLongitude: ${coordinates.lng}`, 'info');
                if (!markerProtoOverloaded) {
                    var originalsetLngLat = mapboxgl.Marker.prototype.setLngLat;
                    mapboxgl.Marker.prototype.setLngLat = function () {
                        return originalsetLngLat.apply(this, [coordinates]);
                    };
                    markerOverloaded = true;
                }
            } catch (e) {
                cheaterLog(e, 'error');
            }
        } catch (e) { }
    }
    var originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        this.addEventListener('load', callbackLoad);
        return originalOpen.apply(this, arguments);
    };
    /*** send correct game information ***/
    var originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
        try {
            const potentialCoordinates = JSON.parse(arguments[0]);
            if (potentialCoordinates && potentialCoordinates.lat && potentialCoordinates.lng) {
                arguments[0] = JSON.stringify({ ...potentialCoordinates, ...coordinates });
                cheaterLog(`Sending info:\tLatitude: ${coordinates.lat}\tLongitude: ${coordinates.lng}`, 'info');
            }
        } catch (e) { }
        return originalSend.apply(this, arguments);
    };
});
