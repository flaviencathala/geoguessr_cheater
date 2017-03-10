var GMaps = 'http://maps.googleapis.com/maps/api/geocode/json';

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.cd1 && request.cd2)
    {
        $.ajax({
            url: GMaps,
            type: "GET",
            data: {latlng: request.cd1 + ',' + request.cd2 },
            crossDomain: true,
            beforeSend: function(xhr){xhr.setRequestHeader('Access-Control-Allow-Origin', '*');},
            error: function(e) { sendResponse({data: null}); },
            success: function(d) { sendResponse({data: d}); }
        });        
    }
    else
    {
        $.ajax({
            url: request.url,
            type: "GET",
            crossDomain: true,
            beforeSend: function(xhr){xhr.setRequestHeader('Access-Control-Allow-Origin', '*');},
            error: function(e) { sendResponse({data: null}); },
            success: function(d) { sendResponse({data: d}); }
        });
    }
    return true;
  }
);
