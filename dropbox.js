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
          postFile:            fileServer + '/2/files/upload',
          metadata:            apiServer  + '/2/files/get_metadata/',
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

        function POST(url, data, params) {
          return request({
            method: 'POST',
            url: url,
            data: data,
            params: params
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
          width = $window.outerWidth || $document.documentElement.clientWidth
          height = $window.outerHeight || $document.documentElement.clientHeight

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
            return GET(urls.getFile + path, params);
          },


          writeFile: function (path, content, params) {
            return request({
              method: 'POST',
              url: urls.postFile + path,
              data: content,
              headers: { 'Content-Type': undefined },
              transformRequest: angular.identity,
              params: params
            });
          },


          stat: function (path, params) {
            return GET(urls.metadata + path, params);
          },

          listfolder: function (path, params) {
            return GET(urls.listFolder + path, params);
          },
          
          /*
          readdir: function (path, params) {
            var deferred = $q.defer();

            function success(stat) {
              var entries = stat.contents.map(function (entry) {
                return entry.path;
              });

              console.log('readdir of ' + path, entries);
              deferred.resolve(entries);
            }

            function failure(fault) { deferred.reject(fault); }

            this.stat(path, params).then(success, failure);
            return deferred.promise;
          },
*/

          metadata: function (path, params) {
            return this.stat(path, params);
          },


          // makeUrl


          history: function (path, params) {
            return GET(urls.revisions + path, params);
          },

          revisions: function (path, params) {
            return this.history(path, params);
          },


          // readThumbnail

          revertFile: function (path, rev) {
            return POST(urls.restore + path, null, { rev: rev });
          },


          restore: function (path, rev) {
            return this.revertFile(path, rev);
          },


          findByName: function (path, pattern, params) {
            var params = params || {};
            params.query = pattern;

            return GET(urls.search + path, params);
          },


          search: function (path, pattern, params) {
            return this.findByName(path, pattern, params);
          },


          // makeCopyReference


          // copyRef


          // pullChanges


          // delta


          mkdir: function (path) {
            return POST(urls.createFolder, null, {
              root: 'auto',
              path: path
            });
          },


          remove: function (path) {
            return POST(urls.delete, null, {
              root: 'auto',
              path: path
            });
          },


          unlink: function (path) {
            return this.remove(path);
          },


          delete: function (path) {
            return this.remove(path);
          },


          copy: function (from, to) {
            return POST(urls.copy, null, {
              root: 'auto',
              to_path: to,
              from_path: from
            });
          },


          move: function (from, to) {
            return POST(urls.move, null, {
              root: 'auto',
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

