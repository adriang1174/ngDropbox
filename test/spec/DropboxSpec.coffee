'use strict'


describe 'Dropbox', ->


  {DropboxProvider,Dropbox,$httpBackend,credentials} = {}


  headers =
    'Accept': 'application/json, text/plain, */*'
    'Authorization': 'Bearer XXT8_UkGb4cAAAAAAAADV2MQOd3QAgyo2dv2HX6euSVfmhmy0-AIJ97tXIs0NDcF'


  beforeEach module 'dropbox'


  beforeEach inject ($injector) ->
    Dropbox      = $injector.get 'Dropbox'
    $httpBackend = $injector.get '$httpBackend'
    credentials  = access_token: 'XXT8_UkGb4cAAAAAAAADV2MQOd3QAgyo2dv2HX6euSVfmhmy0-AIJ97tXIs0NDcF'
    Dropbox.setCredentials credentials


  afterEach ->
    $httpBackend.verifyNoOutstandingExpectation()
    $httpBackend.verifyNoOutstandingRequest()


  describe 'authorize', ->
    # TEST THE MESSAGE EVENT ON WINDOW


  describe 'credentials', ->

    it 'should return OAuth credentials', ->
      expect(Dropbox.credentials()).toEqual(credentials)


  describe 'authenticate', ->

    it 'should return a promise', ->
      expect(typeof Dropbox.authenticate().then).toEqual 'function'


  describe 'isAuthenticated', ->

    it 'should ...', ->
      expect(Dropbox.isAuthenticated()).toEqual true


  describe 'signOut', ->


  describe 'signOff', ->


  describe 'accountInfo', ->

    it 'should get account info', ->
      $httpBackend.expectGET("#{Dropbox.urls.accountInfo}").respond(null)
      Dropbox.accountInfo()
      $httpBackend.flush()


  describe 'readFile', ->

    it 'should get the contents of a file', ->
      url = "#{Dropbox.urls.getFile}directory/name.ext"
      $httpBackend.expectGET(url, headers).respond null
      Dropbox.readFile 'directory/name.ext'
      $httpBackend.flush()

#    it 'should get the contents of a file as a blob', ->
#      url = "#{Dropbox.urls.getFile}directory/name.ext?blob=true"
#      $httpBackend.expectGET(url, headers).respond null
#      Dropbox.readFile 'directory/name.ext', 'blob' : true
#      $httpBackend.flush()

  describe 'writeFile', ->

    it 'should write string data', ->
      url = "#{Dropbox.urls.putFile}directory/file.txt"
      content = "contents of file"
      $httpBackend.expectPOST(url, content, headers).respond null
      Dropbox.writeFile 'directory/file.txt', content
      $httpBackend.flush()

    it 'should write ArrayBuffer data'
    it 'should write ArrayBuffer view data'
    it 'should write Blob data'
    it 'should write File data'
    it 'should write Buffer data'


  describe 'resumableUploadStep', ->


  describe 'resumableUploadFinish', ->


  describe 'stat', ->

    it 'should get the stat for a path', ->
      url = "#{Dropbox.urls.metadata}/ayc.sql"
      $httpBackend.expectGET(url, headers).respond null
      Dropbox.stat '/ayc.sql'
      $httpBackend.flush()


  describe 'readdir', ->
    # HOW TO TEST THIS?


  describe 'metadata', ->

    it 'should get the metadata for a path', ->
      url = "#{Dropbox.urls.metadata}/ayc.sql"
      $httpBackend.expectGET(url, headers).respond null
      Dropbox.metadata '/ayc.sql'
      $httpBackend.flush()


  describe 'makeUrl', ->


  describe 'history', ->

    it 'should get the history for a path', ->
      url = "#{Dropbox.urls.revisions}/ayc.sql"
      $httpBackend.expectGET(url, headers).respond null
      Dropbox.history '/ayc.sql'
      $httpBackend.flush()


  describe 'revisions', ->

    it 'should get the revisions for a path', ->
      url = "#{Dropbox.urls.revisions}/ayc.sql"
      $httpBackend.expectGET(url, headers).respond null
      Dropbox.revisions '/ayc.sql'
      $httpBackend.flush()


#  describe 'thumbnailUrl', ->

#    it 'should make a signed url for a thumbnail', ->
#      url = "#{Dropbox.urls.thumbnails}directory/image.jpeg?format=jpeg&size=m&access_token=#{credentials.access_token}"
#      expect(Dropbox.thumbnailUrl('directory/image.jpeg')).toEqual(url)


  describe 'readThumbnail', ->


  describe 'revertFile', ->


#    it 'should restore a previous version', ->
#      url = "#{Dropbox.urls.restore}file1.txt?rev=1234"
#      $httpBackend.expectPOST(url, undefined).respond null
#      Dropbox.revertFile 'file1.txt', '1234'
#      $httpBackend.flush()


#  describe 'restore', ->

#    it 'should restore a previous version', ->
#      url = "#{Dropbox.urls.restore}file1.txt?rev=1234"
#      $httpBackend.expectPOST(url, undefined).respond null
#      Dropbox.restore 'file1.txt', '1234'
#      $httpBackend.flush()


  describe 'findByName', ->

    it 'should get query a path', ->
      url = "#{Dropbox.urls.search}directory/name.ext?query=terms"
      $httpBackend.expectGET(url, headers).respond null
      Dropbox.findByName 'directory/name.ext', 'terms'
      $httpBackend.flush()


  describe 'search', ->

    it 'should get query a path', ->
      url = "#{Dropbox.urls.search}directory/name.ext?query=terms"
      $httpBackend.expectGET(url, headers).respond null
      Dropbox.search 'directory/name.ext', 'terms'
      $httpBackend.flush()


  describe 'makeCopyReference', ->


  describe 'copyRef', ->


  describe 'pullChanges', ->


  describe 'delta', ->


  describe 'mkdir', ->

    it 'should create a folder', ->
      url = "#{Dropbox.urls.createFolder}?path=folder1&root=auto"
      $httpBackend.expectPOST(url, undefined).respond null
      Dropbox.mkdir 'folder1'
      $httpBackend.flush()


  describe 'remove', ->

    it 'should remove a file', ->
      url = "#{Dropbox.urls.fileopsDelete}?path=dir%2Ffile.ext&root=auto"
      $httpBackend.expectPOST(url, undefined).respond null
      Dropbox.remove 'dir/file.ext'
      $httpBackend.flush()


  describe 'unlink', ->

    it 'should remove a file', ->
      url = "#{Dropbox.urls.fileopsDelete}?path=dir%2Ffile.ext&root=auto"
      $httpBackend.expectPOST(url, undefined).respond null
      Dropbox.unlink 'dir/file.ext'
      $httpBackend.flush()


  describe 'delete', ->

    it 'should delete a file', ->
      url = "#{Dropbox.urls.fileopsDelete}?path=dir%2Ffile.ext&root=auto"
      $httpBackend.expectPOST(url, undefined).respond null
      Dropbox.delete 'dir/file.ext'
      $httpBackend.flush()


  describe 'copy', ->

    it 'should copy a file from one path to another', ->
      url = "#{Dropbox.urls.fileopsCopy}?from_path=dir%2Ffile1.ext&root=auto&to_path=dir%2Ffile2.ext"
      $httpBackend.expectPOST(url, undefined).respond null
      Dropbox.copy 'dir/file1.ext', 'dir/file2.ext'
      $httpBackend.flush()


  describe 'move', ->

    it 'should move a file', ->
      url = "#{Dropbox.urls.fileopsMove}?from_path=dir%2Ffile1.ext&root=auto&to_path=dir%2Ffile2.ext"
      $httpBackend.expectPOST(url, undefined).respond null
      Dropbox.move 'dir/file1.ext', 'dir/file2.ext'
      $httpBackend.flush()


  describe 'reset', ->


  describe 'setCredentials', ->


  describe 'appHash', ->

