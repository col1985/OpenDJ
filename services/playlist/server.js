'use strict';

//mongoose file must be loaded before all other files in order to provide
// models to other modules
var express = require('express'),
  router = express.Router(),
  bodyParser = require('body-parser'),
  swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('./swagger.json');


  var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
      ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
      mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
      mongoURLLabel = "";


var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Mockgoose = require('mock-mongoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
mockgoose.prepareStorage().then(function() {
    mongoose.connect('mongodb://mongodb-playlist:27017/playlist');
});

var PlaylistSchema = new Schema({
  name: {type: String}
});

mongoose.model('Playlist', PlaylistSchema);
var Playlist = require('mongoose').model('Playlist');

var app = express();

//rest API requirements
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//middleware for create
var createPlaylist = function (req, res, next) {
  var playlist = new Playlist(req.body);

  playlist.save(function (err) {
    if (err) {
      next(err);
    } else {
      res.json(playlist);
    }
  });
};

var updatePlaylist = function (req, res, next) {
  Playlist.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, playlist) {
    if (err) {
      next(err);
    } else {
      res.json(playlist);
    }
  });
};

var deletePlaylist = function (req, res, next) {
  req.playlist.remove(function (err) {
    if (err) {
      next(err);
    } else {
      res.json(req.playlist);
    }
  });
};

var getAllPlaylists = function (req, res, next) {
  Playlist.find(function (err, playlists) {
    if (err) {
      next(err);
    } else {
      res.json(playlists);
    }
  });
};

var getOnePlaylist = function (req, res) {
  res.json(req.playlist);
};

var getByIdPlaylist = function (req, res, next, id) {
  Playlist.findOne({_id: id}, function (err, playlist) {
    if (err) {
      next(err);
    } else {
      req.playlist = playlist;
      next();
    }
  });
};

router.route('/playlists')
  .post(createPlaylist)
  .get(getAllPlaylists);

router.route('/playlists/:playlistId')
  .get(getOnePlaylist)
  .put(updatePlaylist)
  .delete(deletePlaylist);

router.param('playlistId', getByIdPlaylist);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', router);

app.listen(port,ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app;