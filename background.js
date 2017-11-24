var GMaps = 'http://maps.googleapis.com/maps/api/geocode/json';

function ajax(options) {
    var http_request = new XMLHttpRequest();
    http_request.open(options.type || 'GET', options.url, true);
    if (typeof options.headers === 'undefined') {
        for (var i = 0; i < options.headers.length; i++) {
            http_request.setRequestHeader(options.headers[i][0], options.headers[i][1]);
        }
    }
    http_request.send(options.data || null);
    http_request.onreadystatechange = function() {
        if (http_request.readyState == 4) {
            if (http_request.status >= 200 && http_request.status < 300) {
                var type = options.dataType || '';
                switch (type.toLowerCase()) {
                    default:
                    options.success(http_request.responseText);
                    break;
                    case 'json':
                    options.success(JSON.parse(http_request.responseText));
                    break;
                }
            } else {
                options.error();
            }
        }
    }
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.cd1 && request.cd2)
        {
            ajax({
                url: GMaps,
                type: "GET",
                data: {latlng: request.cd1 + ',' + request.cd2 },
                headers: [['Access-Control-Allow-Origin', '*']],
                error: function(e) { sendResponse({data: null}); },
                success: function(d) { sendResponse({data: d}); }
            });
        }
        else
        {
            ajax({
                url: request.url,
                type: "GET",
                headers: [['Access-Control-Allow-Origin', '*']],
                error: function(e) { sendResponse({data: null}); },
                success: function(d) { sendResponse({data: d}); }
            });
        }
        return true;
    }
);
