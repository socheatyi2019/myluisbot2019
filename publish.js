var zipFolder = require('zip-folder');
var path = require('path');
var fs = require('fs');
var request = require('request');

var rootFolder = path.resolve('.');
var zipPath = path.resolve(rootFolder, '../myluisbot2019.zip');
var kuduApi = 'https://myluisbot2019.scm.azurewebsites.net/api/zip/site/wwwroot';
var userName = '$myluisbot2019';
var password = 'r6h8JJ7BS9sNuK12XB9KSa7jHRb6DYKCCJXmq02L5g6FAiluQtxD0zD6m1zB';

function uploadZip(callback) {
  fs.createReadStream(zipPath).pipe(request.put(kuduApi, {
    auth: {
      username: userName,
      password: password,
      sendImmediately: true
    },
    headers: {
      "Content-Type": "applicaton/zip"
    }
  }))
  .on('response', function(resp){
    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      fs.unlink(zipPath);
      callback(null);
    } else if (resp.statusCode >= 400) {
      callback(resp);
    }
  })
  .on('error', function(err) {
    callback(err)
  });
}

function publish(callback) {
  zipFolder(rootFolder, zipPath, function(err) {
    if (!err) {
      uploadZip(callback);
    } else {
      callback(err);
    }
  })
}

publish(function(err) {
  if (!err) {
    console.log('myluisbot2019 publish');
  } else {
    console.error('failed to publish myluisbot2019', err);
  }
});