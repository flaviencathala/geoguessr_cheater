var GMapsUrl = 'https://maps.googleapis.com/maps/api/js/GeoPhotoService.SingleImageSearch';

function executeCode(scriptContent) {
    var script = document.createElement('script');
    script.id = 'tmpScript';
    script.appendChild(document.createTextNode(scriptContent));
    (document.body || document.head || document.documentElement).appendChild(script);
}

function isScript(event)
{
  if (event.path.length && event.path[0].type === 'text/javascript')
      return true;
  return false;
}

document.addEventListener("load", function(event)
{
  if (isScript(event))
  {
    var url = event.path[0].src;
    if (url.substring(0, GMapsUrl.length) === GMapsUrl)
    {
        chrome.runtime.sendMessage({url: url}, function(response) {
            var data = response.data;
            var realDataStart = data.indexOf('[');
            var realData = data.substr(realDataStart, data.lastIndexOf(']') - realDataStart + 1);
            var data = JSON.parse(realData);
            var cd1 = data[1][5][0][1][0][2];
            var cd2 = data[1][5][0][1][0][3];
            executeCode(`
                var CMap = new google.maps.Map($('.game-usps')[0], {zoom: 2,center: {lat: ` + cd1 + `, lng: ` + cd2 + `}});
                new google.maps.Marker({position: {lat:` + cd1 + `, lng: ` + cd2 + `}, map: CMap});
            `);
            /*chrome.runtime.sendMessage({cd1: cd1, cd2: cd2}, function(response) {
                $('.account-status__sign-out').html(response.data.results[0].formatted_address);
            });*/
        });
    }
  }
}, true);
