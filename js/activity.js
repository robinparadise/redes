// @autor Robin Giles Ribera
// @grado en ingeniería en Tecnologías de las telecomunicaciones
// @project Redes
// 2013
$(document).ready(function() {

  // Parse Date
  Date.prototype.formatDDMMYYYY = function(){
    return this.getDate()+"/"+this.getMonth()+"/"+this.getFullYear();
  }

  // Localstorage //

  var getFromStorage = function(name) {
    if (name === '' || name === undefined) {return {}}
    if (localStorage) { // Check if the browser support Local Storage
      var data = JSON.parse(localStorage.getItem(name));
      if (data === null) {data = {}};
      return data;
    }
  }
  var pushToStorage = function(name, data) {
    if (name === '' || name === undefined) {return}
    if (localStorage) { // Check if the browser support Local Storage
      var old = JSON.parse(localStorage.getItem(name));
      if (old === null || typeof(old) !== "object") {old = {}};
      old.push(data);
      localStorage.setItem(name, JSON.stringify(old));
    }
  }
  getIDFromStorage = function(name, uid) {
    if (name === '' || name === undefined) {return []}
    if (uid  === '' || uid  === undefined) {return []}
    if (localStorage) { // Check if the browser support Local
      var data = getFromStorage(name); 
      for (var n in data.items) {
        if (n === uid) {
          return data[n];
        }
      }
    }
    return [];
  }
  var setToStorage = function(key, name, data) {
    if (key  === '' || key  === undefined) return;
    if (name === '' || name === undefined) return;
    if (data === undefined) data = [];
    if (localStorage) { // Check if the browser support Local Storage
      var dataLocal = localStorage[key];
      if (dataLocal) dataLocal = JSON.parse(dataLocal);
      else dataLocal = {};

      if (typeof(dataLocal) !== "object") dataLocal = {}; 
      dataLocal[name] = data;
      localStorage.setItem(key, JSON.stringify(dataLocal));
    }
  }

  // Functions to Append to Activity sidebar //

  var createFeed = function() {
    var feedHead = $(document.createElement('li')).addClass('feedHead').addClass('ui-widget-content')
      .append($(document.createElement('div')).addClass('feedPhoto'))
      .append($(document.createElement('div')).addClass('feedResume'));
    var feedBody = $(document.createElement('div')).addClass('feedBody');
    return {"feedHead": feedHead, "feedBody": feedBody};
  }

  var appendImage = function(element, avatar) {
    var photo = new Image();
    avatar = avatar.replace("?sz=50", "?sz=100");
    $(photo).addClass('avatar');
    if (avatar !== undefined || avatar !== '') {
      $(photo).error(function() {
        this.src = 'img/avatars/default-avatar.png';
      }).attr('src', avatar);
    } else {
      photo.src = "img/avatars/default-avatar.png";
    }
    element.find('.feedPhoto').append(photo);
  }

  var appendFeedResume = function(element, data) {
    element.val(data.actor.id);
    // append ID info of message
    element.attr('pid', data.id);
    var feedResume = element.find('.feedResume');
    // Date
    var date = new Date(data.published).formatDDMMYYYY();
    var dateElem = $(document.createElement('div'))
        .addClass('feedDate').text(date);
    // Author
    var urlAuthor = data.actor.url;
    var author = $(document.createElement('a'))
      .attr('target', '_blank').attr('href', urlAuthor).text(data.actor.displayName);
    // Title
    var content;
    if (data.title.length > 0) content = data.title;
    else content = data.object.content;
    var title = $(document.createElement('p'))
        .addClass('feedTitle').text(content);
    // Button Like
    var like = createButtonLike(data);
    feedResume.append(dateElem);
    feedResume.append(author);
    feedResume.append(title);
    feedResume.append(like);
  }

  var appendBody = function(element, data) {
    var elem = $(document.createElement('p'));
    if (data['location'] != undefined) {
      var ylat = data.location.position.latitude
      var xlong = data.location.position.longitude
      var coordLat = elem.clone().text("Latitude: "+ ylat);
      var coordLong = elem.clone().text("Longitude: "+ xlong);
      element.attr('latitude', ylat);
      element.attr('longitude', xlong);
    } else {
      var coordLat = '';
      var coordLong = '';
    }
    
    var body = elem.clone().text(data.object.content);
    element.append(coordLat).append(coordLong);
  }

  function embedYoutube(link, ops) {
    var o = $.extend({
      width: 480,
      height: 320,
      params: ''
    }, ops);
    var id = /\?v\=(\w+)/.exec(link)[1];
   
    return '<iframe style="display: block;"'+
      ' class="youtube-video" type="text/html"'+
      ' width="' + o.width + '" height="' + o.height +
      ' "src="http://www.youtube.com/embed/' + id + '?' + o.params +
      '&amp;wmode=transparent" frameborder="0" />';
  }

  var appendImageLarge = function(element, avatar) {
    var photo = new Image();
    $(photo).addClass('photoLarge');
    if (avatar !== undefined && avatar !== '') {
      $(photo).error(function() {
        $(this).remove();
        return false;
      }).attr('src', avatar);
      element.append(photo);
    }    
  }

  var appendVideo = function(element, link) {
    if (link !== undefined) {
      element.append( embedYoutube(link, { params: 'theme=light' }) );
    }
  }

  var appendMap = function(element, data) {
    if (data !== undefined) {
      element.createMap(data);
    }

  }

  // button Like Count
  clickButtonLike = function(button) {
    if (!button) return;
    button.unbind();
    button.click(function(event) {
      var that = $(this);
      if(!$(event.target).is('.FeedButtonLike') &&
        !$(event.target).is('.buttonLikeCount') &&
        !$(event.target).is('.buttonLike')) return false;
      var number = Number(that.find(".buttonLikeCount").text());
      that.find(".buttonLikeCount").text(number + 1);
      return false;
    });
  }

  var createButtonLike = function(data) {
    var plusoners = data.object.plusoners.totalItems
    var button = $(document.createElement('a')).addClass('FeedButtonLike')
      .attr('target', '_blank').attr('href', data.object.url);
    var like = $(document.createElement('a')).addClass('buttonLike');
    var count = $(document.createElement('a')).addClass('buttonLikeCount').text(plusoners);
    button.append(like).append(count);
    //clickButtonLike(button);
    return button;
  }

  var appendActivity = function(selector, data) {
    var feed = createFeed();
    // Photo
    try {appendImage(feed['feedHead'], data.actor.image.url)}
    catch(ex) {}
    // Date Author Title :: Resume
    appendFeedResume(feed['feedHead'], data);
    // Body
    appendBody(feed['feedBody'], data);
    // Video
    //setTimeout(function() {appendVideo(feed['feedBody'], data['Video'])}, 150);
    // Map
    //setTimeout(function() {appendMap(feed['feedBody'], data['Map'])}, 100);
    //appendMap(feed['feedBody'], data['Map'])
    // Image
    //appendImageLarge(feed['feedBody'], data['Image']);
    // mapGlobal.putMarker();
    feed['feedHead'].append(feed['feedBody']);
    mapGlobal.onLoad(function(){ mapGlobal.addMakerPopup({
      'pid' : feed['feedHead'].attr('pid'),
      'lon' : feed['feedBody'].attr('longitude'),
      'lat' : feed['feedBody'].attr('latitude'),
      'html': feed['feedHead'][0].outerHTML})
    });
    feed['feedHead'].find('.feedBody').hide();

    // $(selector).prepend(feed['feedBody']).show('slow'); //first append Body
    $(selector).append(feed['feedHead']).show('slow'); //second append Head
  }

  // Find element with the same value and return length
  var findByPidActivity = function(selector, key) {
    if ($("#activity [pid="+key+"]").size()) return true;
    return false;
  }

  // Function global
  appendActivities = function(userID, selector, data) {
    for (var iter in data.items) {
      if (!findByPidActivity(selector, data.items[iter].id)) { //If not found on Activity
        appendActivity(selector, data.items[iter]); //append it
      }
    }
    showActivity()
  }

  var objectHasId = function(arr, key) {
    for (var n in arr) {
      if (arr[n].id === key) {
        return true;
      }
    }
    return false;
  }
  // Function global is called from api google+ AND set data to localStorage
  googleActivities = function(userID, selector, data) {
    var localData = getIDFromStorage("Activities", userID);
    var searching = $(".btnTab.btnTabSelected").attr('id') === "searchBtnTab";
    for (var iter in data.items) { // iter over google data
      if (!findByPidActivity(selector, data.items[iter].id)) { // if not in Activity
        if (!objectHasId(data.items[iter].id, localData)) // if not in LocalStorage
          appendActivity(selector, data.items[iter]); // New activity from google
      }
    }
    if (!searching) { // If we are on search dont store
      setToStorage("Activities", userID, data); // Set all data to Storage, yes, overwrite
    }
    showActivity();
  }

  // Get Activity from localStorage AND Google activity
  var getActivity = function(userID, selector) {
    // Reset Activity and markers
    $(selector).children().remove();
    mapGlobal.removeMarkers();
    // get from Local Storage
    var allActivities = getFromStorage("Activities");
    var data;
    if (typeof(data) !== "object") data = {};
    data = allActivities[userID]; // get data activity for user
    if (data)
      appendActivities(userID, selector, data);
    // get from Google+
    googleG.activities(userID, selector, googleActivities);
    $("#sideActivity").mousewheel();
  }

  // Select or unselect messages
  var bindClickMessage = function() {
    $("#activity .feedHead").unbind().click(function() {
      var pid = $(this).attr('pid'); // get pid from message
      var popup = mapGlobal.selectPopupByPid(pid); //find popup
      if (!$(this).hasClass("ui-selected")) { // click to select!
        mapGlobal.searchflickr(pid);
        mapGlobal.setZoomPopup(popup);
        if ($("#streetview").is(':not(:hidden)')) {
          var lat = $(this).find('.feedBody').attr('latitude');
          var lon = $(this).find('.feedBody').attr('longitude');
          setStreetView(lat, lon);
        }
      } else {
        mapGlobal.removeflickr(pid); // Remove fotos of the messages
      }
      $(this).toggleClass("ui-selected", "unselected"); //Select or unselect message
      $(this).find('.feedBody').toggle('Clip'); // and show or hide body
      // We select or unselect marker from Map
      mapGlobal.toggleIcon(pid); // icon of marker
    });
  }

  // 
  var showActivity = function() {
    $("#activity").show('drop', { percent: 100 }, 200);
    try{ // Hack, destroy accordeon
      $("#activity .feedHead").draggable('destroy');
    } catch(Ex) {}
    bindClickMessage(); // bind click message
    $("#activity .feedHead").draggable({
      cancel: "a.ui-icon", // clicking an icon won't initiate dragging
      revert: "valid", // when not dropped, the item will revert back to its initial position
      containment: "document",
      helper: "clone",
      cursor: "move",
      zIndex: 2500,
      greedy: true,
      start: function() {
        $(this).effect("highlight", {}, 500);
      }
    });
  }
  
  // People Activity
  bindPeopleClickActivity = function() {
    $(".people").unbind().click(function(event) {
      if($(event.target).is('.closeBtn'))  return;
      restartPage(); // call from content.js to reset everything
      var that = $(this);
      that.addClass("selected").find("img").addClass("selected"); // select people
      var userID = that.val();
      getActivity(userID, "#activity");
    })
  }
  //bindPeopleClickActivity();

  clickMessage = function(pid, spec) {
    var that = $("#activity .feedHead[pid="+pid+"]");
    if (spec === "show" && that.hasClass("ui-selected")) return;
    if (spec === "hide" && that.hasClass("unselected")) return;
    that.toggleClass("ui-selected", "unselected");
    that.find('.feedBody').toggle('Clip');
    if (spec === "hide") {
      mapGlobal.removeflickr(pid);
    } else {
      mapGlobal.searchflickr(pid);
    }
  }
  dropMessage = function(that) {
    // Marker iconSelected
    var pid = that.attr('pid');
    var popup = mapGlobal.selectPopupByPid(pid);
    if (popup) {
      mapGlobal.searchflickr(pid);
      mapGlobal.iconSelected(popup);
      mapGlobal.setZoomPopup(popup);
      // Message box
      that.addClass("ui-selected");
      that.find('.feedBody').show('Clip');
      // if it has popup, has coordinates. Show StreetView when available
      if ($("#streetview").is(':not(:hidden)')) {
        var lat = that.find('.feedBody').attr('latitude');
        var lon = that.find('.feedBody').attr('longitude');
        setStreetView(lat, lon);
      }
    }
  }
  unselectMessages = function() {
    $("#activity").children().removeClass("ui-selected");
    $("#activity").children().find(".feedBody").hide(); // hide body
    mapGlobal.hidePopups(); // Unselect Marker & popups from map
    $("#images *").remove();
  }
  $(".unselectMessages").click(function(event) {
    event.preventDefault();
    unselectMessages();
    return false;
  });

  // Home, the content of user sign in
  $(".homeActivity").click(function() {
    $(".people").removeClass("selected");
    $(".homeActivity").addClass("onHome");
    getActivity("me", "#activity");
    return false;
  })

})