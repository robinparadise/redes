// @autor Robin Giles Ribera
// @grado en ingeniería en Tecnologías de las telecomunicaciones
// @project Redes
// 2013
$(document).ready(function() {

  // Sign In on Google plus //
  $("#courtain").click(function() {
    $("#gSignIn").click();
  })
  signIn = function(user, selector, data) {
    $(selector).hide();
    googleG.setUserId(data.id);
    selector = "#gSignOut";
    that = $(selector); // the login picture

    var defaultAvatar = "img/avatars/default-avatar.png";
    if (data.image)
      var avatar = data.image.url || defaultAvatar;
    else
      var avatar = defaultAvatar;
    if (data.displayName) {
      var name = data.displayName.split(" ");
      var firstName = name[0];
      var lastName = name.slice(1).join(" ");
    }
    else { // The name is unique
      var name = data.displayName
      var firstName = '';
      var lastName = '';
    }

    $(selector+" .gAvatar").css({
      'background-image': 'url("'+avatar+'")',
      'zIndex': 100});
    that.find(".first-name").text(firstName);
    that.find(".last-name").text(lastName);
    that.find(".googleBrand").hide();
    that.find("#gDisconnectBtn").addClass('disconnect');
    that.unbind().click(googleG.disconnect);
    that.show();
    $("#courtain").slideUp('slow');
    $("#omnibarMenu").css({'z-index': 1});
    setTimeout(function() {
      resizeElements();
    }, 1800);
  }

  signOut = function() {
    $(".people").remove(); // Remove People List & Search
    $("#images *").remove(); // Remove Flickr images
    mapGlobal.removeMarkers(); // Remove Markers
    $("#activity").children().remove(); // Remove messages
    $(".btnTab").removeClass("btnTabSelected");
    $(".homeActivity").removeClass("onHome");
    // Courtain shown
    $("#omnibarMenu").css({'z-index': 100});
    $("#courtain").slideDown('fast');
    setTimeout(function() {
      resizeElements();
    }, 100);
  }


  // Localstorage //

  var getFromStorage = function(name) {
    if (name === '' || name === undefined) {return []}
    if (localStorage) { // Check if the browser support Local Storage
      var data = JSON.parse(localStorage.getItem(name));
      if (data === null) {data = []};
      return data;
    }
  }
  var pushToStorage = function(name, data) {
    if (name === '' || name === undefined) {return}
    if (localStorage) { // Check if the browser support Local Storage
      var old = JSON.parse(localStorage.getItem(name));
      if (old === null || typeof(old) !== "object") {old = []};
      old.push(data);
      localStorage.setItem(name, JSON.stringify(old));
    }
  }
  var destroyElementArray = function(arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id === val) {
        arr.splice(i, 1);
      }
    }
    return arr;
  }
  var deleteFromStorage = function(name, search) {
    if (name   === '' || name   === undefined) {return}
    if (search === '' || search === undefined) {return}
    if (localStorage) { // Check if the browser support Local Storage
      var old = JSON.parse(localStorage.getItem(name));
      if (old === null) old = [];
      else {
        old = destroyElementArray(old, search);
      }
      localStorage.setItem(name, JSON.stringify(old));
    }
  }
  var deleteIDFromStorage = function(key, name) {
    if (name === '' || name === undefined) {return}
    if (key  === '' || key  === undefined) {return}
    if (localStorage) { // Check if the browser support Local
      var data = JSON.parse(localStorage.getItem(key));
      if (typeof(data) === "object" && data[name]) {
        delete data[name];
        localStorage.setItem(key, JSON.stringify(data));
      }
    }
    return true;
  }
  var setToStorage = function(name, data) {
    if (name === '' || name === undefined) {return}
    if (data === undefined) {data = ''}
    if (localStorage) { // Check if the browser support Local Storage
      if (typeof(data) !== "string") {
        data = JSON.stringify(data);
      }
      localStorage.setItem(name, data);
    }
  }
  var valueFromStorage = function(name) {
    if (name === '' || name === undefined) {return ''}
    var data = '';
    if (localStorage) { // Check if the browser support LocalStorage
      var data = localStorage.getItem(name);
      if (data === undefined) {data = ''}
    }
  return data
  }
  // Search by ClientID on key "peopleSearch" and put it on the key "people"
  var copySearchToStorage = function(from, key, to) {
    var fromData = getFromStorage(from);
    for (var i=0; i < fromData.length; i++) {
      pushToStorage(to, fromData[i]);
    };
  }
  // Search by ClientID on key "peopleSearch" and put it on the key "people"
  var copyThisToStorage = function(that, key, to) {
    var fromData = getFromStorage("peopleSearch");
    for (var i=0; i < fromData.length; i++) {
      if (fromData[i].id === key)
        pushToStorage(to, fromData[i]);
    };
  }

  // Find element with the same value and return length
  var foundElementVal = function(selector, key) {
    var timeArray = [];
    $(selector).each(function(i, that) {
      if( $(that).val() === key ) {
        timeArray[i] = $(that).val();
      }
    });
    return timeArray.length > 0;
  }

  // Remove class of elements who match the attr value
  var toggleClassByValue = function(selector, value, remove, toggle) {
    $(selector).each(function(i, that) {
      if( $(that).val() === value ) {
        $(that).children().addClass(toggle).removeClass(remove);
      }
    });
  }

  var appendCover = function(selector, url) {
    var rule = "url('"+url+"') no-repeat center center fixed";
    //$(selector).animate({'background': rule}).addClass("fullscreen");
  }

  // append People to the List people contain
  var appendPeopleList = function(userId, selector, data) {
    if (userId   === undefined) { return }
    if (selector === undefined) { return }
    else {selector = "#"+selector} // Convert to Selector by ID
    if (data     === undefined || data.length <= 0) {return}
    if (userId   === "me" || foundElementVal("#peopleList .people", data.id)) {return} // Already on search list

    var heading  = $(document.createElement('div')).addClass("people").val(data.id);
    // append attr fullcreen to append photo to the content body
    try{heading.attr('fullscreen', data.cover.coverPhoto.url)}catch (ex){}
    var image    = document.createElement('img');
    image.src    = data.image.url.replace("?sz=50", "?sz=100");
    var closeBtn = $(document.createElement('div')).addClass("closeBtn");
    var overlay  = $(document.createElement('div')).addClass("overlay").text(data.displayName);
    heading.append(image).append(closeBtn).append(overlay);
    $(selector).append(heading);
    // Event Listener for click img, close
    bindPeopleClickActivity(); // click for show Activity
    $(selector+" img").unbind().click(clickPeopleImg);
    $(".people .closeBtn").unbind().click(clickClosePeople);

  }

  // append People to the List people contain
  var appendPeopleClone = function(that, selector) {
    var thatclone = that.parent().clone();
    var clientID  = that.parent().val();
    if (clientID === 'me' || foundElementVal(selector+" .people", clientID)) { return false }
    thatclone.val(clientID).removeClass("search");
    $(selector).append(thatclone);
    // Event Listener for click img, close
    $(".people img").unbind().click(clickPeopleImg);
    $(".people .closeBtn").unbind().click(clickClosePeople);
    return true;
  }

  var onShowPeopleList = function() {
    var data = getFromStorage("people");
    if (data === undefined || typeof(data) !== "object") {return}
    for (var i=0; i < data.length; i++) {
      appendPeopleList(data[i].id, "peopleList", data[i]);
    };
    bindPeopleClickActivity();
  }

  // append People to the search contain
  var appendPeopleSearch = function(userId, selector, data) {
    if (userId   === undefined) { return }
    if (selector === undefined) { return }
    if (data     === undefined || data.length <= 0) {return}
    var addPeople = 'addPeople'; // Test if the userId is already added to List
    if (foundElementVal("#peopleSearch .people", data.id)) {return} // Already on search list
    if (userId === 'me' || foundElementVal("#peopleList .people", data.id)
      || googleG.getUserId() === data.id ) {
      addPeople = 'addedPeople'; // Already on People list
    }

    var heading  = $(document.createElement('div')).addClass("people search").val(data.id);
    var image    = document.createElement('img');
    image.src    = data.image.url.replace("?sz=50", "?sz=100");
    var closeBtn = $(document.createElement('div')).addClass("closeBtn").addClass(addPeople);
    var overlay  = $(document.createElement('div')).addClass("overlay").text(data.displayName);
    heading.append(image).append(closeBtn).append(overlay);
    $(selector).append(heading);
    // Event Listener for click img, close
    bindPeopleClickActivity(); // Click to show activity
    $(selector+" img").unbind().click(clickPeopleImg);
    $(".people .closeBtn").unbind().click(clickClosePeople);
  }

  var afterPeopleSearch = function(userId, selector, dataList) {
    if (dataList.items) {
      var data = dataList.items;
    }else {
      var data = dataList;
    }
    keyStore = selector.replace("#", "");
    if (data.error !== undefined) {
      setToStorage(keyStore.replace("#", ""), "[]"); // Delete peopleSearch from localStorage
      return;
    }
    setToStorage("peopleSearchText", $("#inputSearchClientId").val()); // on sloth1 save search key
    if (typeof(data[0]) === "object") {
      for (n in data) {
        pushToStorage(keyStore, data[n]);
        appendPeopleSearch(data[n].id, "#peopleSearch", data[n]); // Append to the list search
      }
    }
    else {
      pushToStorage(keyStore, data); // Save to LocalStorage on sloth 0
      appendPeopleSearch(data.id, "#peopleSearch", data);
    }
    resizePeople()
  }

  var onShowPeopleSearch = function() {
    var data = getFromStorage("peopleSearch");
    var searchkey = valueFromStorage("peopleSearchText");
    if (data === undefined || typeof(data) !== "object") {return}
    if (data[0] !== undefined) {
      var searchData = data[0];
    } else { return }
    if (data.length <= 0) { return }
    for (n in data)
      appendPeopleSearch(searchData.id, "#peopleSearch", data[n]);
    $("#inputSearchClientId").val(searchkey); // append value of key search
  }

  // After Search People, 'enter',  call getPeople and callback appendPeople 
  $("#inputSearchClientId").keypress(function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13') { // Enter Key
      $("#peopleSearch .people").remove(); // Clean list search
      setToStorage("peopleSearch", "[]");
      var clientID = $(this).val();
      googleG.searchPeople(clientID, "#peopleSearch", afterPeopleSearch);
    }
  });
  $(".btn-clear-peopleSearch").click(function() {
    $(this).siblings(":first-child").val('');
    $("#peopleSearch .people").remove(); // Clean list search
    setToStorage("peopleSearchText", ""); // clean value search key
    setToStorage("peopleSearch", "[]");
    //deleteFromStorage("people", $(this).parent().val());
    //setToStorage("peopleSearch", "[]"); // Clean search people to LocalStorage
  });

  // Click People
  var clickPeopleImg = function() {
    var that = $(this);
    $(".people, .people img").removeClass("selected");
    that.addClass("selected").parent().addClass("selected");
    // Content with the cover photo
    // try{ appendCover(".contentHolder.main", that.parent().attr('fullscreen'))}
    // catch (ex) {}
  }
  //$(".people img").click(clickPeopleImg);

  // Click close People button: remove or addPeople
  var clickClosePeople = function() {
    var that = $(this);
    var clientID = that.parent().val();
    if (that.hasClass("addPeople")) { // appendPeople, clone from search
      that.removeClass("addPeople");
      if (appendPeopleClone(that, "#peopleList")) { // Append to my List
        //copySearchToStorage("peopleSearch", clientID, "people"); // Copy search to LocalStorage on key "people"
        copyThisToStorage(that.parent(), clientID, "people");
      }
      that.addClass("addedPeople");
    }
    else if (!that.hasClass("addPeople") && !that.hasClass("addedPeople")) { // close
      setTimeout(function() {that.parent().remove()}, 500);
      toggleClassByValue('.people', clientID, 'addedPeople', 'addPeople');
      that.parent().hide('drop');
      deleteFromStorage("people", clientID); // Delete from LocalStorage
      deleteIDFromStorage("Activities", clientID);
    }
  }
  //$(".people .closeBtn").click(clickClosePeople);


  // Button people, search
  $(".btnTab").click(function() {
    if ($(this).hasClass("btnTabSelected")) return;
    $(".btnTab").removeClass("btnTabSelected");
    $(this).addClass("btnTabSelected");

    if ($(this).attr('id') === "searchBtnTab") {
      $("#peopleListContent").hide();
      $("#peopleSearchContent").show();
      onShowPeopleSearch();
    }
    else {
      $("#peopleSearchContent").hide();
      $("#peopleListContent").show();
      onShowPeopleList();
    }
    resizePeople();
  });
  
})