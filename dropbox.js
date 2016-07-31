'use strict';


angular.module('dropbox', [])


  .provider('Dropbox', function DropboxProvider () {


    var clientId, redirectUri;


    this.config = function (id, uri) {
      this.clientId    = clientId    = id;
      this.redirectUri = redirectUri = uri;
    };


    this.$get = [
      '$q',
      '$http',
      '$window',
      function ($q, $http, $window) {


        /**
         * Credentials
         */

        var oauth = {};


        /**
         * Dropbox API Servers
         */

        var authServer = 'https://www.dropbox.com'
          , apiServer  = 'https://api.dropbox.com'
          , fileServer = 'https://api-content.dropbox.com';


        /**
         * API Method URLs
         */

        var urls = {
          // Authentication.
          authorize:           authServer + 'oauth2/authorize',
          token:               apiServer  + 'oauth2/token',
          signOut:             apiServer  + '/oauth2/token/revoke',

          // Accounts.
          accountInfo:         apiServer  + '/2/users/get_current_account',

          // Files and metadata.
          
          getFile:             fileServer + '/2/files/download/',
          postFile:            fileServer + '/2/files/upload/',
          metadata:            apiServer  + '/2/files/get_metadata',
          delta:               apiServer  + '/2/files/list_folder',   //recursive = true
          listFolder:          apiServer  + '/2/files/list_folder',   
          revisions:           apiServer  + '/2/files/list_revisions',
          restore:             apiServer  + '/2/files/restore/',
          search:              apiServer  + '/2/files/search/',
          shareFolder:         apiServer  + '/2/sharing/share_folder',          

          // File operations.
          copy:                apiServer  + '/2/files/copy',
          createFolder:        apiServer  + '/2/files/create_folder',
          delete:              apiServer  + '/2/files/delete',
          move:                apiServer  + '/2/files/move'
        };


        function collect() {
          var ret = {};
          var p = {};
          var len = arguments.length;
          for (var i=0; i<len; i++) {
            for (p in arguments[i]) {
              if (arguments[i].hasOwnProperty(p)) {
                ret[p] = arguments[i][p];
              }
            }
          }
          return ret;
        }

        /**
         * OAuth 2.0 Signatures
         */

        function oauthHeader(options) {
          if (!options.headers) { options.headers = {}; }
          options.headers['Authorization'] = 'Bearer ' + oauth.access_token;
        }


        function oauthParams(options) {
          if (!options.params) { options.params = {}; }
          options.params.access_token = oauth.access_token;
        }


        /**
         * HTTP Request Helper
         */

        function request(config) {
          var deferred = $q.defer();

          oauthHeader(config);
          
          function success(response) {
            console.log(config, response.data);
            deferred.resolve(response.data);
          }

          function failure(fault) {
            console.log(config, fault);
            deferred.reject(fault);
          }

          $http(config).then(success, failure);
          return deferred.promise;
        }


        /**
         * HTTP GET Helper
         */

        function GET(url, params) {
          var responseType = 'text';
          if (params) {
            if (params.arrayBuffer) {
              responseType = 'arraybuffer';
            } else if (params.blob) {
              responseType = 'blob';
            } else if (params.buffer) {
              responseType = 'buffer';
            } else if (params.binary) {
              responseType = 'b'; // See the Dropbox.Util.Xhr.setResponseType docs
            }
          }

          return request({
            responseType: responseType,
            method: 'GET',
            url: url,
            params: params
          });
        }


        /**
         * HTTP POST Helper
         */

        function POST(url, data, params,headers) {
          return request({
            method: 'POST',
            url: url,
            data: data,
            params: params,
            headers: headers
          });
        }


        /**
         * Configure the authorize popup window
         * Adapted from dropbox-js
         */

        function popupSize(popupWidth, popupHeight) {
          var x0, y0, width, height, popupLeft, popupTop;

          // Metrics for the current browser window.
          x0 = $window.screenX || $window.screenLeft
          y0 = $window.screenY || $window.screenTop
          width = $window.outerWidth //|| $document.documentElement.clientWidth
          height = $window.outerHeight //|| $document.documentElement.clientHeight

          // Computed popup window metrics.
          popupLeft = Math.round(x0) + (width - popupWidth) / 2
          popupTop = Math.round(y0) + (height - popupHeight) / 2.5
          if (popupLeft < x0) { popupLeft = x0 }
          if (popupTop < y0) { popupTop = y0 }

          return 'width=' + popupWidth + ',height=' + popupHeight + ',' +
                 'left=' + popupLeft + ',top=' + popupTop + ',' +
                 'dialog=yes,dependent=yes,scrollbars=yes,location=yes';
        }


        /**
         * Parse credentials from Dropbox authorize callback
         * Adapted from dropbox-js
         */

        function queryParamsFromUrl(url) {
          var match = /^[^?#]+(\?([^\#]*))?(\#(.*))?$/.exec(url);
          if (!match) { return {}; }

          var query = match[2] || ''
            , fragment = match[4] || ''
            , fragmentOffset = fragment.indexOf('?')
            , params = {}
            ;

          if (fragmentOffset !== -1) {
            fragment = fragment.substring(fragmentOffset + 1);
          }

          var kvp = query.split('&').concat(fragment.split('&'));
          kvp.forEach(function (kv) {
            var offset = kv.indexOf('=');
            if (offset === -1) { return; }
            params[decodeURIComponent(kv.substring(0, offset))] =
                   decodeURIComponent(kv.substring(offset + 1));
          });

          return params;
        }


        /**
         * Dropbox Service
         */

        return {


          urls: urls,                       // exposed for testing


          credentials: function () {
            return oauth;
          },


          authenticate: function () {
            var self = this
              , deferred = $q.defer()
              , authUrl = urls.authorize
                        + '?client_id=' + clientId
                     // + '&state=' +
                        + '&response_type=token'
                        + '&redirect_uri=' + redirectUri

            function listener(event) {
              var response = queryParamsFromUrl(event.data);

              if (response.access_denied) {
                deferred.reject(response);
              }

              else if (response.access_token) {
                oauth = self.oauth = response;
                deferred.resolve(oauth);
              }

              $window.removeEventListener('message', listener, false);
            }

            $window.addEventListener('message', listener, false);
            $window.open(authUrl,'_dropboxOauthSigninWindow', popupSize(700, 500));

            return deferred.promise;
          },


          isAuthenticated: function () {
            return (oauth.access_token) ? true : false
          },


          // signOut


          // signOff


          accountInfo: function () {
            return GET(urls.accountInfo);
          },


          userInfo: function () {
            return this.accountInfo();
          },


          readFile: function (path, params) {
            var data = {};
            var headers = {};
            headers['Dropbox-API-Arg'] = '{"path":"'+path+'"}';
            return POST(urls.getFile, data, params,headers);
          },


          writeFile: function (path, content, params) {
            var headers = {};
            var pt = {"path":path};
            var args = collect(pt,params)
            headers['Dropbox-API-Arg'] = JSON.stringify(args);;
            headers['Content-Type'] = 'application/octet-stream' ;
            return request({
              method: 'POST',
              url: urls.postFile ,
              data: content,
              headers: headers,
              transformRequest: angular.identity
            });
          },


          stat: function (path, params) {
            var data = collect({"path": path},params);
            return POST(urls.metadata ,data );
          },

          listFolder: function (path, params) {
             var data = collect({"path": path},params); 
            return POST(urls.listFolder , data);
          },
          
          metadata: function (path, params) {
            return this.stat(path, params);
          },


          // makeUrl


          history: function (path, params) {
            var data = collect({"path": path},params);
            return POST(urls.revisions, data);
          },

          revisions: function (path, params) {
            return this.history(path, params);
          },


          // readThumbnail

          revertFile: function (path, rev) {
            return POST(urls.restore , { "path":path, "rev": rev });
          },


          restore: function (path, rev) {
            return this.revertFile(path, rev);
          },


          search: function (path, pattern, params) {
            var data = collect({"path": path,"query":pattern},params);
            return POST(urls.search, data);
          },


          // makeCopyReference


          // copyRef


          // pullChanges


          // delta


          mkdir: function (path) {
            return POST(urls.createFolder, {"path": path});
          },


          delete: function (path) {
            return POST(urls.delete, { "path": path });
          },


          copy: function (from, to) {
            return POST(urls.copy, {
              to_path: to,
              from_path: from
            });
          },


          move: function (from, to) {
            return POST(urls.move, {
              to_path: to,
              from_path: from
            });
          },


          reset: function () {
            oauth = {};
          },


          setCredentials: function (credentials) {
            oauth = credentials;
          },


          // appHash


        };


      }];


  })

