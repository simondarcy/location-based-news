function addArticle(article){
    $('#demo').append('<p><a href="'+article.url+'" target="_blank">' + article.title + '</a></p>');
}

function getData(lat, lon){

    var latLonStr = lat + "," + lon;
    console.log(latLonStr);
    //latLonStr = "53.3153782,-6.2244367";
    //console.log(latLonStr);
    var distance = 50;

    $.ajax({
        'url': 'https://feeds.rasset.ie/sitesearch/newsnowlive/select',
        'data': {
            'wt':'json',
            'q':'*:*',
            'fq':'location:[* TO *] AND type:article AND sub_type:newsdocument AND {!geofilt pt='+latLonStr+' sfield=location_geo d='+distance+'}',
            'rows':100,
            'sort':'geodist(location_sort,'+latLonStr+') asc, date_modified desc'
        },
        'success': function(data) {
            articles = data.response.docs;

            $.each( articles, function( i, article){
                addArticle( article );//add image to carousel
            });
        },
        'dataType': 'jsonp',
        'jsonp': 'json.wrf'
    });


}

function getLocation() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("This page requires your location.");
    }
}

function showPosition(position) {
    console.log("Latitude: " + position.coords.latitude +  " Longitude: " + position.coords.longitude);

    getData(position.coords.latitude, position.coords.longitude);
}

getLocation();
