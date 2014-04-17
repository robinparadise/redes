/*
// @autor Robin Giles Ribera
// @grado en ingeniería en Tecnologías de las telecomunicaciones
// @project Redes
// 2013
*/
var panorama

function setStreetView(lat, lon) {
	// See if the is a message selected.
	if (lat === undefined && lon === undefined) {
		var selMessage = $("#activity .ui-selected .feedBody").last();
		if (selMessage) {
			if (selMessage.attr('latitude') && selMessage.attr('longitude')) {
				lat = selMessage.attr('latitude');
				lon = selMessage.attr('longitude');
			}
		}
	}
	// Else, we have a default place to show
	// Great Canyon 36.065642,-112.137378
	if (lat === undefined) lat = 36.065642;
	if (lon === undefined) lon = -112.137378;

  var fenway = new google.maps.LatLng(lat, lon);
  var panoramaOptions = {
    position: fenway,
    pov: {
      heading: 34,
      pitch: 10
    }
  };
  $pano = $("#pano");
  var temp = $pano.children();
  panorama = new  google.maps.StreetViewPanorama($pano[0], panoramaOptions);
  if (temp.size())
  	temp.remove();
}

resizeStreetView = function(off) {
	if (panorama) {
		panorama.setVisible(true);
	}
}


// var flashEnabled = !!(navigator.mimeTypes["application/x-shockwave-flash"] || 
// 	window.ActiveXObject && 
// 	new ActiveXObject('ShockwaveFlash.ShockwaveFlash'));

// initStreetView = function(){
// 	if (!flashEnabled) return;

// 	$pano = $('#pano');
// 	$pano.children().remove();
// 	//setStreetView(37.8, -122.4);
// 	var lat = 37.8;
// 	var lon = -122.4;
// 	var selMessage = $("#activity .ui-selected .feedBody").last();
// 	if (selMessage) {
// 		if (selMessage.attr('latitude') && selMessage.attr('longitude')) {
// 			lat = selMessage.attr('latitude');
// 			lon = selMessage.attr('longitude');
// 		}
// 	}

// 	setStreetView(lat, lon);
// 	//setStreetView(37.76, -122.43)
// 	//setStreetViewNearest(lat, lon)
// 	//getStreetViewNearest(lat, lon)
// }
	
// setStreetView = function(lat, lng){

// 	pano = new GStreetviewPanorama($pano[0], {
// 		latlng: new GLatLng(lat, lng),
// 		features: { userPhotos: false},
// 		enableFullScreen: true
// 	});

// 	GEvent.addListener(pano, 'error', function(e){
// 		if (e == 600){
// 			console.log("No street view data available for this location.");
// 			//$pano.html("No street view data available for this location.");
// 			return;
// 		}
// 	});
// }

// llStreetView = function(lat, lng) {
// 	$pano.children().remove();
// 	setStreetView(lat, lng);
// }

// Search for the Nearest location

// function computeAngle(endLatLng, startLatLng) {
//   var DEGREE_PER_RADIAN = 57.2957795;
//   var RADIAN_PER_DEGREE = 0.017453;

//   var dlat = endLatLng.lat() - startLatLng.lat();
//   var dlng = endLatLng.lng() - startLatLng.lng();
//   // We multiply dlng with cos(endLat), since the two points are very closeby,
//   // so we assume their cos values are approximately equal.
//   var yaw = Math.atan2(dlng * Math.cos(endLatLng.lat() * RADIAN_PER_DEGREE), dlat) * DEGREE_PER_RADIAN;
//   return wrapAngle(yaw);
// }

// function wrapAngle(angle) {
// 	if (angle >= 360) {
// 		angle -= 360;
// 	} else if (angle < 0) {
// 		angle += 360;
// 	}
// 	return angle;
// }

// function showPanoData(panoData) {
// 	if (panoData.code == 600) {
// 		console.log("No street view data available for this location.");
// 		//$("#streetview").html("No street view data available for this location.");
// 		//setStreetView(37.8, -122.4);
// 	}
// 	else {
// 		$pano.html("");
// 		var lat = panoData.location.lat;
// 		var lon = panoData.location.lon;
// 		var lonlatGCS = OpenLayers.Layer.SphericalMercator.inverseMercator(lon, lat);
// 		var theloc = new GLatLng(lonlatGCS.lat,lonlatGCS.lon);
// 		var angle = computeAngle(theloc, panoData.location.latlng);
// 		pano = new GStreetviewPanorama($pano[0], {
// 			latlng: new GLatLng(panoData.location.latlng.lat,
// 				panoData.location.latlng.lon),
// 			features: { userPhotos: false},
// 			enableFullScreen: false
// 		});
// 			//pano.setLocationAndPOV(panoData.location.latlng, {yaw: angle});
// 		// if (!pano)
// 		// 	setStreetView();
// 	}
// }

// setStreetViewNearest = function(lat, lng) {
// 	var theloc = new GLatLng(lat, lng);
// 	panoClient = new GStreetviewClient();
// 	panoClient.getNearestPanorama(theloc, showPanoData);
// }


// checkNearestStreetView = function (panoData) {
//   if(panoData){
//     if(panoData.location){
//       if(panoData.location.latLng){
//         // Well done you can use a nearest existing street view coordinates
//         llStreetView(panoData.location.latLng.lat, panoData.location.latLng.lon)
//       }
//     }
//   }
// }
// getStreetViewNearest = function(lat, lng) {
// 	var astorPlace = new GLatLng(lat, lng);
// 	var webService = new google.maps.StreetViewService();  
// 	//Check in a perimeter of 50 meters
// 	var checkaround = 50;
// 	// checkNearestStreetView is a valid callback function
// 	webService.getPanoramaByLocation(astorPlace,checkaround ,checkNearestStreetView);
//}
