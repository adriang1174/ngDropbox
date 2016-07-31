'use strict'


describe 'Dropbox', ->


  {DropboxProvider,Dropbox,$httpBackend,credentials} = {}


  headers =
    'Accept': 'application/json, text/plain, */*'
    'Authorization': 'Bearer XXT8_UkGb4cAAAAAAAADV2MQOd3QAgyo2dv2HX6euSVfmhmy0-AIJ97tXIs0NDcF'
    'Content-Type': 'application/json;charset=utf-8'
    
   headers_read =
            'Accept': 'application/json, text/plain, */*'
            'Authorization': 'Bearer XXT8_UkGb4cAAAAAAAADV2MQOd3QAgyo2dv2HX6euSVfmhmy0-AIJ97tXIs0NDcF'
            'Content-Type': 'application/json;charset=utf-8'
            'Dropbox-API-Arg': '{"path":"/ayc.sql"}'
            
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
       url = "#{Dropbox.urls.getFile}"
       data = {}
       $httpBackend.expectPOST(url, data, headers_read).respond null
       Dropbox.readFile '/ayc.sql'
       $httpBackend.flush()

#    it 'should get the contents of a file as a blob', ->
#      url = "#{Dropbox.urls.getFile}directory/name.ext?blob=true"
#      $httpBackend.expectGET(url, headers).respond null
#      Dropbox.readFile 'directory/name.ext', 'blob' : true
#      $httpBackend.flush()

  describe 'writeFile', ->

    it 'should write string data', ->
      url = "#{Dropbox.urls.postFile}"
      content = "contents of file"
      params = {"mode":{".tag":"overwrite"}} 
      headers_write =
            'Accept': 'application/json, text/plain, */*'
            'Authorization': 'Bearer XXT8_UkGb4cAAAAAAAADV2MQOd3QAgyo2dv2HX6euSVfmhmy0-AIJ97tXIs0NDcF'
            'Content-Type': 'application/octet-stream'
            'Dropbox-API-Arg': '{"path":"/file.txt","mode":{".tag":"overwrite"}}'
      $httpBackend.expectPOST(url, content, headers_write).respond null
      Dropbox.writeFile '/file.txt', content, params
      $httpBackend.flush()

#    it 'should write ArrayBuffer data'
#    it 'should write ArrayBuffer view data'
#    it 'should write Blob data'
#    it 'should write File data'
#    it 'should write Buffer data'


  describe 'resumableUploadStep', ->


  describe 'resumableUploadFinish', ->


  describe 'stat', ->

    it 'should get the stat for a path', ->
       url = "#{Dropbox.urls.metadata}"
       data = {"path":"/ayc.sql","include_media_info": false,"include_deleted": true} 
       $httpBackend.expectPOST(url, data, headers).respond null
       Dropbox.stat '/ayc.sql', {"include_media_info": false,"include_deleted": true}
       $httpBackend.flush()


  describe 'readdir', ->
    # HOW TO TEST THIS?


  describe 'metadata', ->

    it 'should get the metadata for a path', ->
      url = "#{Dropbox.urls.metadata}"
      data = {path:"/ayc.sql"}
      $httpBackend.expectPOST(url, data, headers).respond null
      Dropbox.metadata '/ayc.sql'
      $httpBackend.flush()


  describe 'makeUrl', ->


  describe 'history', ->

    it 'should get the history for a path', ->
       url = "#{Dropbox.urls.revisions}"
       content = 'path':'/ayc.sql', 'limit':4
       param = 'limit':4
       $httpBackend.expectPOST(url, content).respond null
       Dropbox.history '/ayc.sql' , param
       $httpBackend.flush()


  describe 'revisions', ->

    it 'should get the revisions for a path', ->
       url = "#{Dropbox.urls.revisions}"
       content = 'path':'/ayc.sql'
       $httpBackend.expectPOST(url, content).respond null
       Dropbox.revisions '/ayc.sql'
       $httpBackend.flush()

  describe 'listFolder', ->

    it 'should get the file list for a path', ->
       url = "#{Dropbox.urls.listFolder}"
       content = 'path':'/' ,  'recursive': false
       param =  'recursive': false
       $httpBackend.expectPOST(url, content, headers).respond null
       Dropbox.listFolder '/' ,  'recursive': false
       $httpBackend.flush()


#  describe 'thumbnailUrl', ->

#    it 'should make a signed url for a thumbnail', ->
#      url = "#{Dropbox.urls.thumbnails}directory/image.jpeg?format=jpeg&size=m&access_token=#{credentials.access_token}"
#      expect(Dropbox.thumbnailUrl('directory/image.jpeg')).toEqual(url)


  describe 'readThumbnail', ->


  describe 'search', ->

    it 'should get query a path', ->
       url = "#{Dropbox.urls.search}"
       content = 'path':'','query':'*.sql'
       $httpBackend.expectPOST(url,content).respond null
       Dropbox.search '', '*.sql'
       $httpBackend.flush()


  describe 'revertFile', ->

    it 'should restore a previous version', ->
       url = "#{Dropbox.urls.restore}"
       content = 'path':'ayc.sql','rev':'1234'
       $httpBackend.expectPOST(url, content).respond null
       Dropbox.revertFile 'ayc.sql', '1234'
       $httpBackend.flush()


#  describe 'makeCopyReference', ->


#  describe 'copyRef', ->


#  describe 'pullChanges', ->


#  describe 'delta', ->


  describe 'mkdir', ->

    it 'should create a folder', ->
      url = "#{Dropbox.urls.createFolder}"
      content = 'path':'folder1'
      $httpBackend.expectPOST(url, content).respond null
      Dropbox.mkdir 'folder1'
      $httpBackend.flush()


  describe 'remove', ->

    it 'should remove a file', ->
       url = "#{Dropbox.urls.delete}"
       content = 'path':'file1'
       $httpBackend.expectPOST(url, content).respond null
       Dropbox.delete 'file1'
       $httpBackend.flush()


  
  describe 'copy', ->

    it 'should copy a file from one path to another', ->
       url = "#{Dropbox.urls.copy}"
       content = 'from_path':'file1','to_path':'file2'
       $httpBackend.expectPOST(url, content).respond null
       Dropbox.copy 'file1', 'file2'
       $httpBackend.flush()


  describe 'move', ->

    it 'should move a file', ->
       url = "#{Dropbox.urls.move}"
       content = 'from_path':'file1','to_path':'file2'
       $httpBackend.expectPOST(url, content).respond null
       Dropbox.move 'file1', 'file2'
       $httpBackend.flush()


#  describe 'reset', ->


#  describe 'setCredentials', ->


#  describe 'appHash', ->

