# AngularDropboxAPI

Forked from ngDropbox is a [Dropbox Core API](https://www.dropbox.com/developers/core/docs) Client for AngularJS adapted from [dropbox-js](https://github.com/dropbox/dropbox-js). It should be familiar to dropbox-js users as well as idiomatic to AngularJS.


## Status

This module is in development. It's pending to implement the rest of the API. If you want to use AngularDropboxAPI but something is missing or doesn't work as expected, please submit an issue. Thanks in advance!


## Install

[Bower](http://bower.io/) is the quickest way to include AngularDropboxAPI in your project.

    $ bower install git@github.com:christiansmith/ngDropbox.git --save

    <script src="bower_components/ngDropbox/dropbox.js"></script>

If you don't use Bower, just download `dropbox.js` into your scripts directory.

    $ curl -O https://raw.github.com/christiansmith/ngDropbox/master/dropbox.js

    <script src="your/js/path/dropbox.js"></script>


## Usage

After you create an app in the [Dropbox App Console](https://www.dropbox.com/developers/apps), add an OAuth Redirect URI pointing to `https://<HOST>/components/ngDropbox/callback.html`.

In your AngularJS app, load the module. Inform your app of the App key and Redirect URI, then inject the service into your controllers and start making API calls. All methods that communicate with the API return promises.

    // load the module
    angular.module('myApp', ['dropbox'])

      .config(function (DropboxProvider) {
        DropboxProvider.config(<APP_KEY>, <REDIRECT_URI>);
      })

      // inject the service
      .controller('DropboxCtrl', function ($scope, Dropbox) {
        
        // assign a promise to scope
        $scope.accountInfo = Dropbox.accountInfo();

        // or use callbacks
        Dropbox.copy('dir/image1.jpg', 'dir/image2.jpg').then(function (res) {
          Dropbox.move('dir/image1.jpg', 'dir/image.jpg').then(function (res) {
            $scope.photos = Dropbox.stat('dir');
          });
        });

      });

### API

* [**Dropbox.accountInfo()**](https://www.dropbox.com/developers/core/docs#account-info)
* [**Dropbox.userInfo()**](https://www.dropbox.com/developers/core/docs#account-info) (alias Dropbox.accountInfo())
* [**Dropbox.readFile(path, params)**](https://www.dropbox.com/developers/core/docs)
* [**Dropbox.writeFile(path, content, params)**](https://www.dropbox.com/developers/core/docs)
* [**Dropbox.stat(path, params)**](https://www.dropbox.com/developers/core/docs#metadata)
* [**Dropbox.metadata(path, params)**](https://www.dropbox.com/developers/core/docs#metadata) (alias Dropbox.stat(path, params))
* [**Dropbox.list_folder(path, params)**](https://www.dropbox.com/developers/core/docs#metadata)
* makeUrl 
* [**Dropbox.history(path, params)**](https://www.dropbox.com/developers/core/docs#revisions)
* [**Dropbox.revisions(path, params)**](https://www.dropbox.com/developers/core/docs#revisions) (alias Dropbox.history(path, params))
* [**Dropbox.revertFile(path, rev)**]()
* [**Dropbox.restore(path, rev)**]()
* [**Dropbox.search(path, pattern, params)**]()
* makeCopyReference/copyRef
* pullChanges/delta
* [**Dropbox.mkdir(path)**](https://www.dropbox.com/developers/core/docs#fileops-create-folder)
* [**Dropbox.remove(path)**](https://www.dropbox.com/developers/core/docs#fileops-delete)
* [**Dropbox.unlink(path)**](https://www.dropbox.com/developers/core/docs#fileops-delete) (alias Dropbox.remove(path))
* [**Dropbox.delete(path)**](https://www.dropbox.com/developers/core/docs#fileops-delete) (alias Dropbox.remove(path))
* [**Dropbox.copy(from, to)**](https://www.dropbox.com/developers/core/docs#fileops-copy)
* [**Dropbox.move(from, to)**](https://www.dropbox.com/developers/core/docs#fileops-move)




## TODO

* Methods for the rest of the API
* Support redirect and other authentication methods in addition to browser popup
* Test in multiple browsers
* Test error cases


## Development

Installing the Karma test runner with `npm install karma -g`, then run the tests with `karma start`.


