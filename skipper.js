var Skipper = {
  previousSongStack: [],
  currentStationId: '',
  currentSongQueue: [],
  currentSong: 'END',
  triggered: false,
  keys: {
    nowPlaying: 'p-nowPlaying',
    currentSkips: 'p-station-'+this.currentStationId,
    overallSkips: 'p-station-skips',
    songQueue: 'p-tracks',
    isPaused: 'p-state'
  },

  initialize: function() {
    setTimeout(this.update.bind(this), 400);
    this.initCSS();
    this.initEvents();
    this.durationChecker();
  },

  durationChecker: function() {
    setInterval(function(){
      if (!this.readValue('isPaused')) {
        var duration = $('.songDuration').html().split('/');
        var current_minute = parseInt(duration[0].replace(/\s+/g,'').split(':')[0]);
        var current_second = parseInt(duration[0].replace(/\s+/g,'').split(':')[1]);
        var total_minute = parseInt(duration[1].replace(/\s+/g,'').split(':')[0]);
        var total_second = parseInt(duration[1].replace(/\s+/g,'').split(':')[1]);
        var isAlmostEnd = function() { return total_second-current_second<5}
        if (current_minute==total_minute && isAlmostEnd()) {
          this.skip();
        }
      } else {
      }
    }.bind(this), 4000);
  },

  readValue: function(key) {
    return $.parseJSON(localStorage.getItem(this.keys[key]));
  },

  setValue: function(key, value) {
    localStorage.setItem(this.keys[key], JSON.stringify(value));
  },

  update: function() {
    if (this.readValue('songQueue')) {
      this.currentStationId = this.readValue('nowPlaying').data.id;
      this.currentSongQueue = this.readValue('songQueue')[this.currentStationId];
      this.keys.currentSkips = 'p-station-'+this.currentStationId;

      //Always reset skips on update
      var currentSkips = this.readValue('currentSkips');
      var overallSkips = this.readValue('overallSkips');
      overallSkips.count = 0;
      currentSkips.count = 0;
      this.setValue('currentSkips', currentSkips);
      this.setValue('overallSkips', overallSkips);
    }
  },

  skip: function() {
    if (!this.triggered) { 
      this.previousSongStack.push(this.currentSong);
      this.triggered = false;
    }
    this.currentSong = this.currentSongQueue[0];
    setTimeout(this.update.bind(this), 2000);
  },

  previousSong: function() {
    if (this.currentSong !== 'END') {
      this.currentSongQueue.unshift(this.currentSong);
      var target_song = this.previousSongStack.pop();
      this.currentSongQueue.unshift(target_song);
      var queue_obj = {};
      queue_obj[this.currentStationId] = this.currentSongQueue;
      this.setValue('songQueue', queue_obj);
      this.update();
      this.triggered = true;
      $('#playerNext').click();
    } else {
      return false;
    }
  },

  initCSS: function() {
    var rewindEl = $('<input>').attr({
      'id':'playerLast',
      'class':'playerLast',
      'type':'button'
    }).css({
      'width':'32px',
      'height':'50px',
      'top':'8px',
      'left':'2px',
      'background-position':'-247px 0',
      '-moz-transform': 'scaleX\(-1\)',
      '-webkit-transform': 'scaleX\(-1\)',
      '-o-transform': 'scaleX\(-1\)',
      'transform': 'scaleX\(-1\)',
      'filter': 'FlipH',
      '-ms-filter': '\“FlipH\”',
    });
    $('#playerPlay').css('left','38px');
    $('#playerNext').css('left','98px');
    $('.playerBtns').prepend(rewindEl);
    $('.navLogo').css('left','-100px');
    $('.playerBtns').css({
      'background-image':'url\('+$('#inject').attr('bgImage')+'\)',
      'width':'134px',
      'left':'70px'
    });
  },

  initEvents: function() {
    $('#playerNext').click(function(e){
      this.skip();
    }.bind(this));
    $('#playerLast').click(function(e){
      this.previousSong();
    }.bind(this));
  }
}
Skipper.initialize();

