/*
* le News Map
* */

var map;
var defaultLat = 53.3478;
var defaultLon = -6.2597;
var defaultZoom = 6;

var infoWindows = [];
var markers = [];

function createMap() {

    //Create Google Map using SDK V3

    var myLatlng = new google.maps.LatLng(defaultLat, defaultLon);

    var mapOptions = {
        center: myLatlng,
        zoom: defaultZoom
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    //get content
    loadArticles();

    //Initialize carousel

    //setTimeout(function(){
    //
    //    $('.image-carousel').slick({
    //        arrows: true,
    //        slidesToShow: 10
    //    });
    //}, 1000);


}


function get_icon(pillar){
    pillar = pillar.toLowerCase(); //for some reason pillar occasionally comes in as caps?
    if(pillar == "news"){
        icon = "marker-news.png";
    }
    else if(pillar == "sport"){
        icon = "marker-sport.png";
    }
    else if(pillar == "ten"){
        icon = "marker-ten.png";
    }
    else{
        icon = "marker.png"
    }
    return icon;

}

function loadArticles(){

    //Load article data from feed

    $.ajax({
       // 'url': 'http://feeds.rasset.ie/sitesearch/newsnowlive/select'//,
       // 'data': {'wt':'json', 'q':'*:*', 'fq':'date_created:[2016-10-20T00:27:49Z TO 2016-11-101T14:27:49Z]', 'fq' : 'location:[* TO *] AND type:article AND sub_type:newsdocument', 'rows':100, 'sort':'date_created desc'},
       'url': 'http://feeds.rasset.ie/sitesearch/newsnowlive/select?q=date_created:[2016-11-21T00:00:49Z+TO+2016-11-271T23:59:49Z]',
       'data': {'wt':'json', 'q':'*:*',  'fq' : 'location:[* TO *] AND type:article AND pillar:news', 'rows':200, 'sort':'date_created desc'},
        'success': function(data) {
            articles = data.response.docs;

            $.each( articles, function( i, article){
                addMarker( article );//add marker to map
                addImage( article );//add image to carousel
            });
        },
        'dataType': 'jsonp',
        'jsonp': 'json.wrf'
    });

}


function closeAllInfoWindows(){
    $.each( infoWindows, function( i, article){
        infoWindows[i].close();
    });
}

idx = 0;
function addImage(article){
    //function to update slider
    carousel = $('.articles');
    snippet = '<div class="article" data-idx="'+(idx++)+'"><img src="http:\/\/img.rasset.ie\/'+article.thumbnail_refcode+'-150.jpg"\/><\/div>';
    carousel.append(snippet);

}

function addMarker(article){
    // To add the marker to the map, use the 'map' property

    locSplit = article.location.split(", "); //Split the location in the feed as its a string
    Latlng = new google.maps.LatLng(locSplit[0], locSplit[1]);

    icon = get_icon(article.pillar);


    //Create marker
    marker = new google.maps.Marker({
        position: Latlng,
        icon:icon,
        map: map,
        animation: google.maps.Animation.DROP,
        title:article.title
    });

    //add marker to map
    marker.setMap(map);

    //Create snippet for info window
    contentString = '<h1>'+article.title+'</h1>'+
        '<img style="width:100%;" src="http://img.rasset.ie/' + article.thumbnail_refcode + '-300.jpg"/>'+
        '<p>'+article.excerpt+'</p>'+
        '<a href="http://www.rte.ie'+article.url+'" target="_blank">Read full story</a>';


    //create the info window
    infoWindows.push(
        marker.infowindow = new google.maps.InfoWindow({
            content: contentString
        })
    );

    //add click event to marker opening the info window
    google.maps.event.addListener(marker, 'click', function(){
        //close any open info windows

        closeAllInfoWindows();

        map.panTo(this.position);

        if( map.getZoom() <= 8 ){
            map.setZoom(8);
        }

        this.infowindow.open(map,this);


    });

    markers.push(marker);
}


function showPosition(position) {
    defaultLat = position.coords.latitude;
    defaultLon = position.coords.longitude;
    defaultZoom = 13;
    createMap();

    //Create marker for user
    Latlng = new google.maps.LatLng(defaultLat, defaultLon);
    marker = new google.maps.Marker({
        position: Latlng,
        icon:"marker.png",
        map: map,
        animation: google.maps.Animation.Drop,
        title:"Current Location"
    });



}

function noPosition(err){
    console.log('Position denied');
    createMap();
}

$( document ).ready(function() {


    //try get location from user
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, noPosition);
    } else {
        createMap();
    }

    $('body').on('click', '.carousel-item', function (){

        closeAllInfoWindows();
        IDX = $(this).data('idx');

        if( map.getZoom() <= 8 ){
            map.setZoom(8);
        }

        infoWindows[IDX].open(map, markers[IDX]);
    });







});