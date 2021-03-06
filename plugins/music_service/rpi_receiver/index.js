'use strict';

var libQ = require('kew');
var fs=require('fs-extra');
var config = new (require('v-conf'))();
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;


module.exports = rpiReceiver;
function rpiReceiver(context) {
	var self = this;

	this.context = context;
	this.commandRouter = this.context.coreCommand;
	this.logger = this.context.logger;
	this.configManager = this.context.configManager;

}


rpiReceiver.prototype.onVolumioStart = function() {

	console.log("Im starting!");

	var self = this;
	var configFile=this.commandRouter.pluginManager.getConfigurationFile(this.context,'config.json');
	this.config = new (require('v-conf'))();
	this.config.loadFile(configFile);

    return libQ.resolve();
}

rpiReceiver.prototype.onStart = function() {
    var self = this;
	var defer=libQ.defer();


	// Once the Plugin has successfull started resolve the promise
	defer.resolve();
    self.addToBrowseSources();
    return defer.promise;
};

rpiReceiver.prototype.onStop = function() {
    var self = this;
    var defer=libQ.defer();

    // Once the Plugin has successfull stopped resolve the promise
    defer.resolve();

    return libQ.resolve();
};

rpiReceiver.prototype.onRestart = function() {
    var self = this;
    // Optional, use if you need it
};


// Configuration Methods -----------------------------------------------------------------------------

rpiReceiver.prototype.getUIConfig = function() {
    var defer = libQ.defer();
    var self = this;

    var lang_code = this.commandRouter.sharedVars.get('language_code');

    self.commandRouter.i18nJson(__dirname+'/i18n/strings_'+lang_code+'.json',
        __dirname+'/i18n/strings_en.json',
        __dirname + '/UIConfig.json')
        .then(function(uiconf)
        {

			uiconf.sections[0].content[0].value = self.config.get('alarmSwitch');
			uiconf.sections[0].content[1].value = self.config.get('alarmTime');
			uiconf.sections[0].content[2].value = self.config.get('busStation');
			//TODO: where get stuff saved?

            defer.resolve(uiconf);
        })
        .fail(function()
        {
            defer.reject(new Error());
        });

    return defer.promise;
};

rpiReceiver.prototype.getConfigurationFiles = function() {
	return ['config.json'];
}

rpiReceiver.prototype.setUIConfig = function(data) {
	var self = this;
	//Perform your installation tasks here
};

rpiReceiver.prototype.getConf = function(varName) {
	var self = this;
	//Perform your installation tasks here
};

rpiReceiver.prototype.setConf = function(varName, varValue) {
	var self = this;
	//Perform your installation tasks here
};

rpiReceiver.prototype.setupAlarm = function(){
	var self = this;
	//TODO: Make alarm working -> look at auxilio folder fkamleit
	//TODO: Implement starting the python programm and receive parameter
};



// Playback Controls ---------------------------------------------------------------------------------------
// If your plugin is not a music_sevice don't use this part and delete it


rpiReceiver.prototype.addToBrowseSources = function () {

	// Use this function to add your music service plugin to music sources
    var data = {
        name: 'rpi-receiver',
        uri: 'etc',
        plugin_type:'music_service',
        plugin_name:'rpi_receiver',
        albumart: '/albumart?sourceicon=music_service/rpi_receiver/radio.svg'
    };
    this.commandRouter.volumioAddToBrowseSources(data);

	//self.commandRouter.pushToastMessage('info', "Add function", "Added plugin to music sources");


};

rpiReceiver.prototype.handleBrowseUri = function (curUri) {
	var self = this;
	self.logger.info('handleBrowseUri: ' + uri);
	self.commandRouter.pushToastMessage('info', 'rpi receiver', ''+ uri);

	if (uri.startsWith('rpi_receiver')) {
		if (uri === 'rpi_receiver') { //root
			return self.getRootContent();
		}


	}
	return libQ.reject();

// Define a method to clear, add, and play an array of tracks
	rpiReceiver.prototype.clearAddPlayTrack = function (track) {
		var self = this;
		self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'rpiReceiver::clearAddPlayTrack');

		self.commandRouter.logger.info(JSON.stringify(track));

		return self.sendSpopCommand('uplay', [track.uri]);
	};

	rpiReceiver.prototype.seek = function (timepos) {
		this.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'rpiReceiver::seek to ' + timepos);

		return this.sendSpopCommand('seek ' + timepos, []);
	};

// Stop
	rpiReceiver.prototype.stop = function () {
		var self = this;
		self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'rpiReceiver::stop');


	};

// Spop pause
	rpiReceiver.prototype.pause = function () {
		var self = this;
		self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'rpiReceiver::pause');


	};

// Get state
	rpiReceiver.prototype.getState = function () {
		var self = this;
		self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'rpiReceiver::getState');


	};

//Parse state
	rpiReceiver.prototype.parseState = function (sState) {
		var self = this;
		self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'rpiReceiver::parseState');

		//Use this method to parse the state and eventually send it with the following function
	};

// Announce updated State
	rpiReceiver.prototype.pushState = function (state) {
		var self = this;
		self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'rpiReceiver::pushState');

		return self.commandRouter.servicePushState(state, self.servicename);
	};


	rpiReceiver.prototype.explodeUri = function (uri) {
		var self = this;
		var defer = libQ.defer();

		// Mandatory: retrieve all info for a given URI

		return defer.promise;
	};

	rpiReceiver.prototype.getAlbumArt = function (data, path) {

		var artist, album;

		if (data != undefined && data.path != undefined) {
			path = data.path;
		}

		var web;

		if (data != undefined && data.artist != undefined) {
			artist = data.artist;
			if (data.album != undefined)
				album = data.album;
			else album = data.artist;

			web = '?web=' + nodetools.urlEncode(artist) + '/' + nodetools.urlEncode(album) + '/large'
		}

		var url = '/albumart';

		if (web != undefined)
			url = url + web;

		if (web != undefined && path != undefined)
			url = url + '&';
		else if (path != undefined)
			url = url + '?';

		if (path != undefined)
			url = url + 'path=' + nodetools.urlEncode(path);

		return url;
	};


	rpiReceiver.prototype.search = function (query) {
		var self = this;
		var defer = libQ.defer();

		// Mandatory, search. You can divide the search in sections using following functions

		return defer.promise;
	};

	rpiReceiver.prototype.searchArtists = function (results) {

	};

	rpiReceiver.prototype.searchAlbums = function (results) {

	};

	rpiReceiver.prototype.searchPlaylists = function (results) {


	};

	rpiReceiver.prototype.searchTracks = function (results) {

	};
}
rpiReceiver.prototype.getRootContent = function () {

	self.commandRouter.pushToastMessage('info', 'rpi receiver', ''+ uri);

	return libQ.resolve(		//TODO: make brows URI working
		{
			navigation: {
				prev: {
					uri: '/'
				},
				lists:
					[
						{
							title: 'AM/FM Receiver',
							icon: 'fa fa-radio',
							availableListViews: ['list', 'grid'],

							items: [	//TODO: Buttons for next freq, etc.
								{
									service: 'youtube',
									type: 'folder',
									title: ' Activities',
									icon: 'fa fa-folder-open-o',
									uri: 'rpiReceiver/root/activities'
								},
								{
									service: 'youtube',
									type: 'folder',
									title: 'Subscriptions',
									icon: 'fa fa-folder-open-o',
									uri: 'rpiReceiver/root/subscriptions'
								},
								{
									service: 'youtube',
									type: 'folder',
									title: 'My Playlists',
									icon: 'fa fa-folder-open-o',
									uri: 'rpiReceiver/root/playlists'
								},
								{
									service: 'youtube',
									type: 'folder',
									title: 'Liked Videos',
									icon: 'fa fa-folder-open-o',
									uri: 'rpiReceiver/root/likedVideos'
								}
							]
						}
					]
			}
		});
}
