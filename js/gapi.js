/**
 * Calls the helper method that handles the authentication flow.
 *
 * @param {Object} authResult An Object which contains the access token and
 *   other authentication information.
 */
function onSignInCallback(authResult) {
  googleG.onSignInCallback(authResult);
}

googleG = (function() {
  var BASE_API_PATH = 'plus/v1/';
  var authGlobal;

  return {
    /**
     * Hides the sign in button and starts the post-authorization operations.
     *
     * @param {Object} authResult An Object which contains the access token and
     *   other authentication information.
     */
    onSignInCallback: function(authResult) {
      gapi.client.load('plus','v1', function(){
        if (authResult['access_token']) {
          var authGlobal = authResult;
          $("#peopleBtnTab").click(); // click on button google+
          $(".homeActivity").click();
          googleG.people('me', '#gSignIn', signIn);
        } else if (authResult['error']) {
          console.log('There was an error: ' + authResult['error']);
        }
      });
    },

    /**
     * Calls the OAuth2 endpoint to disconnect the app for the user.
     */
    disconnect: function() {
      console.log("Disconnect");
      // Revoke the access token.
      $.ajax({
        type: 'GET',
        url: 'https://accounts.google.com/o/oauth2/revoke?token=' +
            gapi.auth.getToken().access_token,
        async: false,
        contentType: 'application/json',
        dataType: 'jsonp',
        success: function(result) {
          console.log('revoke response: ' + result);
          $('#gSignOut').hide();
          $('#gSignIn').show();
          signOut();
        },
        error: function(e) {
          console.log(e);
        }
      });
    },
    people: function(userId, selector, callback) {
      if (userId === undefined) {userId = 'me'}
      if (selector === undefined) {selector = '.gAvatar'}
      var request = gapi.client.plus.people.get({'userId': userId});
      request.execute(function(people) {
        callback(userId, selector, people);
      });
    },
    searchPeople: function(keyId, selector, callback) {
      if (keyId === undefined) {keyId = 'me'}
      if (selector === undefined) {selector = '.gAvatar'}
      var request = gapi.client.plus.people.get({'userId': keyId});
      request.execute(function(people) {
        callback(keyId, selector, people);
      });
      var request2 = gapi.client.plus.people.search({'query': keyId});
      request2.execute(function(search) {
        callback(keyId, selector, search);
      });
    },

    /**
     * Gets and renders the list of people visible to this app.
     */
    peopleList: function() {
      var request = gapi.client.plus.people.list({
        'userId': 'me',
        'collection': 'visible'
      });
      request.execute(function(people) {
        $('#visiblePeople').empty();
        $('#visiblePeople').append('Number of people visible to this app: ' +
            people.totalItems + '<br/>');
        for (var personIndex in people.items) {
          person = people.items[personIndex];
          $('#visiblePeople').append('<img src="' + person.image.url + '">');
        }
      });
    },

    /**
     * Gets and renders the currently signed in user's profile data.
     */
    profile: function(){
      var request = gapi.client.plus.people.get( {'userId' : 'me'} );
      request.execute( function(profile) {
        $('#profile').empty();
        if (profile.error) {
          $('#profile').append(profile.error);
          return;
        }
        $('#profile').append(
            $('<p><img src=\"' + profile.image.url + '\"></p>'));
        $('#profile').append(
            $('<p>Hello ' + profile.displayName + '!<br />Tagline: ' +
            profile.tagline + '<br />About: ' + profile.aboutMe + '</p>'));
        if (profile.cover && profile.coverPhoto) {
          $('#profile').append(
              $('<p><img src=\"' + profile.cover.coverPhoto.url + '\"></p>'));
        }
      });
    },
    activities: function(userId, selector , callback, collection) {
      if (userId     === undefined) {userId = 'me'}
      if (selector   === undefined) {selector  = '#activity'}
      if (collection === undefined) {collection = 'public'}
      gapi.client.load('plus', 'v1', function() {
        var request = gapi.client.plus.activities.list({
          'collection': collection,
          'userId': userId
    // Some userIds from users that frequently post publicly using location:
    // '105313830640377595865'
    // '108086881826934773478'
    // '103846222472267112072'
        });
        request.execute(function(resp) {
          callback(userId, selector , resp);
        });
      });
    },
    getUserId: function() {
      return userId;
    },
    setUserId: function(uid) {
      userId = uid;
    },
    removeUserID: function() {
      userId = undefined;
    },
    logged: function() {
      if (userId) return false;
      return true;
    },
  };
})(); 
