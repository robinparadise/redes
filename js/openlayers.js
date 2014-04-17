// @autor Robin Giles Ribera
// @grado en ingeniería en Tecnologías de las telecomunicaciones
// @project Redes
// 2013

// JavaScript for openlayers.html

mapGlobal = (function() {
  var AutoSizeAnchoredMinSize = OpenLayers.Class(OpenLayers.Popup.Anchored, {
    'autoSize': true, 
    'minSize': new OpenLayers.Size(200,80),
    'maxSize': new OpenLayers.Size(360,600)
  });
  // World Geodetic System 1984 projection (lon/lat)
  var WGS84 = new OpenLayers.Projection("EPSG:4326");
  // WGS84 Google Mercator projection (meters)
  var WGS84_google_mercator = new OpenLayers.Projection("EPSG:900913");
  var epsg4326 = new OpenLayers.Projection("EPSG:4326");
  var epsg900913 = new OpenLayers.Projection("EPSG:900913");
  // API key for http://openlayers.org. Please get your own at
  // http://bingmapsportal.com/ and use that instead.
  var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";
  var NominatimAPI = 'http://nominatim.openstreetmap.org/reverse?json_callback=?';
  var urlFlickr = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
  // var markerslayer = new OpenLayers.Layer.Markers( "Markers" );
  var markers = new OpenLayers.Layer.Markers("Mapline");
  var iconNormal = "openlayer/img/marker.png";
  var iconSelected = "openlayer/img/marker2.png";
  var map = undefined, streetview;
  var thisMap = $("#map");

  return {
    renderMap: function() {
      try{map.render("map")}
      catch(ex) {}
    },
    createMap: function(options) {
      thisMap = $("#map"); // Update
      // Options for map
      var latOp, lonOp, zoom, mapLayer;

      if (options) {
        latOp = options['lat']  || 40.4;
        lonOp = options['lon']  || -3.7;
        zoom  = options['zoom'] || 1;
        mapLayer = options['mapLayer'] || 'Road';
      }

      var pid;
      var initMap = function() {
        //clearInterval(pid);
        var osm = new OpenLayers.Layer.OSM();
        var road = new OpenLayers.Layer.Bing({
          key: apiKey,
          type: "Road",
          metadataParams: {mapVersion: "v1"},
          wrapDateLine: true
        });
        var hybrid = new OpenLayers.Layer.Bing({
          key: apiKey,
          type: "AerialWithLabels",
          name: "Bing Aerial",
          visibility: false,
          wrapDateLine: true
        });

        //try {
          map = new OpenLayers.Map("map", {
            controls: [
                new OpenLayers.Control.LayerSwitcher(),
                new OpenLayers.Control.PanZoom(),
                new OpenLayers.Control.ArgParser(),
                new OpenLayers.Control.NavToolbar,
                new OpenLayers.Control.ScaleLine(),
                new OpenLayers.Control.OverviewMap(),
                new OpenLayers.Control.TouchNavigation({
                  dragPanOptions: {enableKinetic: true}
                }),
                new OpenLayers.Control.Navigation({zoomWheelEnabled: false}),
            ],
            projection: WGS84_google_mercator,
            displayProjection: WGS84,
          });

          //Add Maps
          map.addLayers([road, hybrid, osm]);
          map.addLayer(markers);
          //map.disableZoomWheel();
          controls = map.getControlsByClass('OpenLayers.Control.Navigation');
          for(var i = 0; i < controls.length; ++i)
            controls[i].disableZoomWheel();

          //var lonlatTransf = OpenLayers.LonLat.fromArray([lonOp, latOp]);
          //var lonlatCenter = lonlatTransf.transform(WGS84, map.getProjectionObject());
          map.setCenter(new OpenLayers.LonLat(20, 20), zoom);

          // When Loaded add class mapLoaded
          $("#map").addClass("mapLoaded").show("slow");
          //clearInterval(pid);
        //} catch (Ex) {console.log("[Error]", Ex)}

      }
      setTimeout(initMap, 400);
      //pid = setTimeout(initMap, 1200);

    },
    setZoom: function(lon, lat, zoom) {
      if (zoom === undefined) zoom = 16;
      map.setCenter(new OpenLayers.LonLat(lon, lat), 16);
    },
    setZoomPopup: function(popup) {
      if (popup)
        mapGlobal.setZoom(popup.lonlat.lon, popup.lonlat.lat);
    },
    getLonLat: function(lon, lat) {
      var lonlatTransf = OpenLayers.LonLat.fromArray([lon, lat]);
      var lonlat = lonlatTransf.transform(WGS84, map.getProjectionObject());
      return lonlat;
    },
    getMap: function() {
      return map;
    },
    getMarkers: function() {
      return markers;
    },
    redraw: function(popup) {
      popup.feature.marker.draw();
    },
    appendTitle: function(title, popup) {
      var htmlOLD = popup.feature.data.popupContentHTML;
      var htmlNEW = "<p class='nominatim'>"+title+"</p>"+htmlOLD;
      popup.setContentHTML(htmlNEW);
      popup.draw();
    },
    iconSelected: function(popup) {
      popup.feature.marker.icon.url = iconSelected;
      popup.feature.marker.draw();
    },
    iconNormal: function(popup) {
      popup.feature.marker.icon.url = iconNormal;
      popup.feature.marker.draw();
    },
    selectPopupByPid: function(pid) {
      var pops = map.popups;
      for (var a = 0; a < pops.length; a++) {
        if (map.popups[a].pid === pid) {
          return map.popups[a];
        }
      }
    },
    toggleIcon: function(pid) {
      var pops = map.popups, popup;
      for (var a = 0; a < pops.length; a++) {
        if (map.popups[a].pid === pid) {
          popup = map.popups[a];
        }
      }
      if (popup === undefined) return;
      if (popup.feature.marker.icon.url === iconSelected)
        mapGlobal.hidePopup(popup);
      else
        mapGlobal.iconSelected(popup);
    },
    showPopup: function(popup) {
      popup.show();
      mapGlobal.iconSelected(popup);
    },
    showPopupByPid: function(pid) {
      var pops = map.popups;
      for (var a = 0; a < pops.length; a++) {
        if (map.popups[a].pid === pid) {
          map.popups[a].show();
          mapGlobal.iconSelected(map.popups[a]);
        }
      }
    },
    hidePopup: function(popup) {
      popup.hide();
      mapGlobal.iconNormal(popup);
    },
    hidePopupByPid: function(pid) {
      var pops = map.popups;
      for (var a = 0; a < pops.length; a++) {
        if (map.popups[a].pid === pid) {
          map.popups[a].hide();
          mapGlobal.iconNormal(map.popups[a]);
        }
      }
    },
    togglePopups: function() {
      var pops = map.popups;
      for (var a = 0; a < pops.length; a++) {
        map.popups[a].toggle();
      }
    },
    hidePopups: function() {
      var pops = map.popups;
      for (var a = 0; a < pops.length; a++) {
        mapGlobal.hidePopup(map.popups[a]);
      }
    },
    noPopupSelected: function() {
      var pops = map.popups;
      for (var a = 0; a < pops.length; a++) {
        if (pops[a].feature.marker.icon.url === iconSelected)
          return false;
      }
      return true
    },
    removeMarkers: function() {
      markers.clearMarkers();
      if (!map) return;
      if (!map.popups) return;
      while( map.popups.length ) {
        map.removePopup(map.popups[0]);
      }
      map.popups = [];
    },
    addMarker: function(ll, gll, popupClass, HTML, pid, closeBox, overflow) {
      var feature = new OpenLayers.Feature(markers, ll); 
      feature.closeBox = closeBox;
      feature.popupClass = popupClass;
      feature.data.popupContentHTML = HTML;
      feature.data.overflow = (overflow) ? "auto" : "hidden";
      feature.data.iconNormal = "openlayer/img/marker.png";
      feature.data.iconSelected = "openlayer/img/marker2.png";
      feature.data.latlong = gll;
              
      var marker = feature.createMarker();
      feature.createPopup(feature.closeBox);
      // Find address with Nominatim
      mapGlobal.nominatim(feature.popup, gll);
      // We add an id
      feature.popup['pid'] = pid;
      // Bind click button like
      // clickButtonLike($(feature.popup.contentDiv)); 
      // add valiable popup to map
      map.addPopup(feature.popup);
      feature.popup.hide();
      var markerClick = function (evt) {
        if (this.popup == null) {
          this.popup = this.createPopup(this.closeBox);
          map.addPopup(this.popup);
          this.popup.show();
        } else if (this.popup.visible()) { // It'll be hidden
          mapGlobal.hidePopup(this.popup); // hide > iconNormal > redraw
          clickMessage(this.popup.pid, 'hide'); // click to unselect Message
        } else if (!this.popup.visible()) { // It'll be shown
          mapGlobal.showPopup(this.popup); // show > iconSelected > redraw
          clickMessage(this.popup.pid, 'show'); // click to Select Message
          mapGlobal.sendToStreetView(this.popup); // get from popup location and set StreetView
        }
        OpenLayers.Event.stop(evt);
      };

      var onPopupClose = function() {
        mapGlobal.hidePopup(this.popup);
      }
      marker.events.register("mousedown", feature, markerClick);
      markers.addMarker(marker);
    },
    addMakerPopup: function(options) {
      var lat, lon, zoom, mapLayer, html, pid;

      if (options) {
        pid = options['pid'] || 0;
        lat = options['lat'];
        lon = options['lon'];
        zoom  = options['zoom'] || 1;
        mapLayer = options['mapLayer'] || 'Road';
        html = options['html'];
      }

      if (lon  === undefined) return;
      if (lat  === undefined) return;
      if (html === undefined) return;
      var ll = mapGlobal.getLonLat(lon, lat);
      var gll = {"lon":lon, "lat": lat};
      var pClass = AutoSizeAnchoredMinSize;
      mapGlobal.addMarker(ll, gll, pClass, html, pid, false);
    },
    onLoad: function(callback) {
      if ($("#map").hasClass('mapLoaded')) {
        callback();
      } else {
        setTimeout(function(){
          callback();
        }, 2000)
      }
    },
    nominatim: function(popup, gll) {
      $.getJSON( NominatimAPI, {
        lat: gll.lat,
        lon: gll.lon,
        zoom: 27,
        addressdetails: 1,
        format: "json"
      }).done(function( data ) {
        mapGlobal.appendTitle(data.display_name, popup);
      });
    },
    parseAddress: function(address) {
      var cities = address.split(",");
      var aux = [];
      for (n in cities) {
        if ( isNaN(Number(cities[n])) )
          aux.push(cities[n]);
      }
      return aux.join(",");
    },
    appendflickr: function(label, pid) {// Flicker
      if (pid === undefined) pid = 0;
      $.getJSON(urlFlickr, {
        tags: mapGlobal.parseAddress(label),
        tagmode: "any",
        format: "json"
      }, function (data) {
        var ctr = 0;
        var htmlString = "";
        $.each(data.items.reverse(), function (i, item) {
          if (item.tags.length < 150) {
            var sourceSquare = item.media.m;
            var sourceOrig = (item.media.m).replace("_m.jpg", ".jpg");

            htmlString += '<td class="flickr_item" ' + 'pid="' + pid +'">'
                +'<a target="_blank" href="' + item.link + '" class="link" title="' + item.title + '">';
            htmlString += '<img title="' + item.title +'" src="' + sourceOrig + '" ';
            htmlString += ' alt="' + item.title + '" pid="' + pid +'" />';
            htmlString += '</a><div class="flickr_title">' + item.title + '</div>' +'</td>';
            ctr = ctr + 1;
          } 
        });
        $('#images table tr').append($(htmlString));
        $('#images').find("img").each(function (item) {
            $(item).load(function () {
              $(this).fadeIn('slow', function () {
                resizeImages();
              });
            });
        });
      });
    },
    addflickr: function(label, pid) {
      if (pid === undefined) pid = 0;
      if ($('#images table tr').size())
        mapGlobal.appendflickr(label, pid);
      else { // new flickr
        var html = $("<table><tr></tr></table>");
        $('#images').append(html);
        mapGlobal.appendflickr(label, pid);
      }
    },
    searchflickr: function(pid) {
      if ($("#images [pid="+pid+"]").size()) {
        return; // there are images with the same id
      }
      var popup = mapGlobal.selectPopupByPid(pid);
      if (!popup) return;
      var html = $(popup.feature.data.popupContentHTML);
      var label = html.find(".nominatim").text();
      mapGlobal.addflickr(label, pid);
    },
    removeflickr: function(pid) {
      $("#images [pid="+pid+"]").remove();
      if (!$("#activity .feedHead").hasClass("ui-selected") ||
        mapGlobal.noPopupSelected()) {
        $("#images *").remove(); //remove all
        resizeImages();
      }
    },
    sendToStreetView: function(popup) {
      var lat = popup.feature.data.latlong.lat;
      var lon = popup.feature.data.latlong.lon;
      if ($("#streetview").is(':not(:hidden)')) {
        setStreetView(lat, lon);
      }
    },
  }
})();

