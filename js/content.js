// @autor Robin Giles Ribera
// @grado en ingeniería en Tecnologías de las telecomunicaciones
// @project Redes
// 2013
$(document).ready(function() {

  // Resize Element for a perfect scroll ;)
  resizeElements = function(e) {
    $(window).off('resize');
    var win = $(window);
    // Resize PeopleList & PeopleSearch
    resizePeople();
    // Resize Activity
    var titleActivity = $("#titleActivity").height();
    var activityHeight = win.height() - titleActivity;
    $("#sideActivity").css({'height': activityHeight, 'top': titleActivity});
    // Resize font from courtain
    if ($('#courtain').is(":not(:hidden)"))
      $('#courtain').css({'font-size': Math.min(win.height(), win.width())/5});
    // Resize Content & Map
    var off = calculeOffsetActivity(); // width side panel
    resizeContent(off);
    // Resize Images too
    resizeImages();
    $(window).on('resize', resizeElements);
  }

  // Resize People List and Search
  resizePeople = function() {
    var win = $(window);
    var peopleListHeight = win.height() - $("#peopleListContent").offset().top;
    var peopleSearchHeight = win.height() - $("#peopleSearchContent").offset().top;
    $("#peopleSearchContent").css({'height': peopleSearchHeight});
    $("#peopleListContent").css({'height': peopleListHeight});
  }

  // Resize images
  resizeImages = function() {
    var hidden = $("#titleActivity, #sideActivity").is(":hidden");
    if (hidden) {
      var off = $("#sideMain").width();
    } else {
      var off = $("#sideActivity").width() + $("#sideMain").width();
    }
    $("#images").width("").width($("#images").width() + off + 20);
  }

  // Resize Wrapper & Map & then render map
  var resizeContent = function(off, delay) {
    if (delay === undefined) delay = 0;
    if (off   === undefined) return false;
    var limit = $(".gAvatar:not(:hidden)").offset().left; // limit until sign in picture
    var minWidth = limit - off;
    $("#wrapper").animate({'padding-left': off}, 200);
    $("#map").width(minWidth);
    if (minWidth < 150) // Hide content
      $(".contentHolder.main").hide();
    else
      $(".contentHolder.main").show();
    $(".streetview").animate({'right': off + 60}, 200);
    // Map Height
    var heightMap = $(window).height() - $("#omnibarMenu").height() - 40;
    $("#map").height(heightMap);
    setTimeout(function(){mapGlobal.renderMap()}, delay); // We need to render Map
  }

  // Calculate the offset from the panel moved (Activity panel)
  var calculeOffsetActivity = function(click) {
    var activity = $("#titleActivity, #sideActivity");
    var widthActivity = $("#sideActivity").width();
    var hidden = activity.is(":not(:hidden)");
    if (click) hidden = !hidden; // Means the acticity is changing
    if (hidden) { // Now is Shown
      return widthActivity + $("#sideMain").width();
    } else { // Now is Hidden
      return $("#sideMain").width();
    }
  }

  // Resize when ToggleBtn Activity panel is clicked
  $(".toggleActivity").click(function(event) {
    event.preventDefault();
    var off = calculeOffsetActivity(true); // click because we wanna click this
    $("#titleActivity, #sideActivity").toggle("slide", function() {
      // Resize Images
      resizeImages();
    });
    // Resize content & render map with delay 200 
    resizeContent(off, 200);
    //$("#images").width("").width($("#images").width() + off + 420);
  });

  // Mouse wheel behavior for side scrolling.
  $(".contentHolder.main").mousewheel(function(event, delta) {
    event.preventDefault();
    this.scrollLeft -= (delta *90);
    if ($("#images").offset().left < 0)
      $(".scrollHome").addClass("active");
    else
      $(".scrollHome").removeClass("active");
  });

  // Restart everything
  restartPage = function() {
    $(".homeActivity").removeClass("onHome");
    $("#images").children().remove();
    $("#activity").children().remove();
    $(".people, .people img").removeClass("selected");
    mapGlobal.removeMarkers();
    $(".contentHolder.main").mousewheel(); // go to map
    resizeElements();
  }

  $(".scrollHome").click(function(event) {
    event.preventDefault();
    $(this).removeClass("active");
    $(".contentHolder.main").mousewheel(); // go to map
  });

  // StreetView toggle
  $(".toggleStreetView").removeClass("active");
  $("#streetview").hide();
  $(".toggleStreetView").click(function(event) {
    event.preventDefault();
    $(this).toggleClass("active");
    $("#streetview").toggle(); // show street Map
   setStreetView();
  });
  // Make StreetView resizable
  $( "#streetview" ).resizable({
    maxHeight: 500, maxWidth: 800,
    minHeight: 300, minWidth: 400,
    handles: "sw", helper: "ui-resizable-helper"
  });
  // when the resize event stop we reload Streetview
  $( "#streetview" ).on( "resizestop", function( event, ui ) { resizeStreetView() } );

  // Make Map droppable
  $( "#map" ).droppable({
    accept: "#activity .feedHead",
    activeClass: "ui-state-hover",
    hoverClass: "ui-state-active",
    drop: function( event, ui ) {
      dropMessage($(ui.draggable[0]));
    }
  }).hide();

  mapGlobal.createMap();

  // Start
  $("#sideActivity").perfectScrollbar({wheelSpeed:50});
  $("#peopleListContent").perfectScrollbar({wheelSpeed:50}); // scrollbar for people list
  $("#peopleSearchContent").perfectScrollbar({wheelSpeed:50}); // scrollbar for people Search
  
  resizeElements(); // resize Now when you're watching the courtain page
  $(window).on('resize', resizeElements); // Event resize
});