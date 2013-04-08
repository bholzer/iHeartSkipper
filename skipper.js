var Skipper = {
  previousSongStack: [],
  currentStationId: '',
  currentSongQueue: [],
  currentSong: {},
  triggered: false,
  artistSelector: 'hgroup>h2.artist>a',
  titleSelector: 'hgroup>h1.title>a',
  artSelector: '.playerArt>a>img',
  listTemplate: '<div id="songListWrapper"><ul id="songList"></ul></div>',
  keys: {
    nowPlaying: 'p-nowPlaying',
    currentSkips: 'p-station-'+this.currentStationId,
    overallSkips: 'p-station-skips',
    songQueue: 'p-tracks'
  },

  initialize: function() {
    this.initCSS();
    this.initEvents();
    $('.b-playStation, #playerPlay').click(function(){
      setTimeout(this.update.bind(this), 1000);
      this.durationChecker();  
    }.bind(this));
  },

  durationChecker: function() {
    setInterval(function(){
      try {
        var duration = $('.songDuration').html().split('/');
        var current_minute = parseInt(duration[0].replace(/\s+/g,'').split(':')[0]);
        var current_second = parseInt(duration[0].replace(/\s+/g,'').split(':')[1]);
        var total_minute = parseInt(duration[1].replace(/\s+/g,'').split(':')[0]);
        var total_second = parseInt(duration[1].replace(/\s+/g,'').split(':')[1]);
        var minutesToSeconds = function(m,s) {return ((m*60)+s)};
        var current_position = minutesToSeconds(current_minute, current_second);
        var total_duration = minutesToSeconds(total_minute, total_second);
        var isAlmostEnd = function() { return (total_duration-1)-current_position<5}
        if (isAlmostEnd()) {
          setTimeout(this.skip.bind(this), 4000);
        }
      } catch(err) {
      }
    }.bind(this), 3000);
  },

  readValue: function(key) {
    return $.parseJSON(localStorage.getItem(this.keys[key]));
  },

  setValue: function(key, value) {
    localStorage.setItem(this.keys[key], JSON.stringify(value));
  },

  update: function(callback) {
    if (this.readValue('songQueue')) {
      this.currentStationId = this.readValue('nowPlaying').data.id;
      this.currentSongQueue = this.readValue('songQueue')[this.currentStationId];
      this.keys.currentSkips = 'p-station-'+this.currentStationId;
      var currentSkips = this.readValue('currentSkips');
      var overallSkips = this.readValue('overallSkips');
      overallSkips.count = 0;
      currentSkips.count = 0;
      this.setValue('currentSkips', currentSkips);
      this.setValue('overallSkips', overallSkips);
      callback && callback();
    }
  },

  skip: function() {
    if (!this.triggered) { 
      this.previousSongStack.push($.extend(true, {}, this.currentSong));
    } else {
      this.triggered = false;
    }
    if (!$.isEmptyObject(this.currentSong)) {
      var listEl = $('<li class="songItem">').append(
        '<img src="'+this.currentSong.albumArtUrl+'"/>'
      ).append(
        '<span class="artist">'+this.currentSong.artist+'<span>'
      ).append(
        '<span class="title">'+this.currentSong.title+'<span>'
      );
      $('#songList').prepend(listEl);
    }
    this.currentSong.id = this.currentSongQueue[0];
    setTimeout(function(){
      this.update(function() {
        if ($(this.artistSelector).html()) this.currentSong.artist = $(this.artistSelector).html();
        if ($(this.titleSelector).html()) this.currentSong.title = $(this.titleSelector).html();
        if ($(this.artSelector).attr('src')) this.currentSong.albumArtUrl = $(this.artSelector).attr('src');
      }.bind(this));
    }.bind(this), 3000);
  },

  previousSong: function() {
    if (!$.isEmptyObject(this.currentSong)) {
      this.currentSongQueue.unshift(this.currentSong.id);
      var target_song = this.previousSongStack.pop();
      this.currentSongQueue.unshift(target_song.id);
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
    $('#ihr-header').after(this.listTemplate);
    $('#songListWrapper').css({
      'height':'140px',
      'background-color':'whitesmoke'
    });
    $('#songList').css({
      'margin-left': '190px',
      'height': '98%',
      'width': '84%',
      'border': '1px dashed rgb(153, 53, 53)'
    });
    $('#wrap').css('padding-top', '270px');
    $('.navLogo').css('left','-100px');
    $('.playerBtns').css({
      'background-image':'url\('+$('#inject').attr('bgImage')+'\)',
      'width':'134px',
      'left':'70px'
    });
    $('head').append(
      '<style type="text/css">'+
      'li.songItem {display:inline-block; text-align:center; width:80px; vertical-align:top; margin-top:10px;}'+
      'li.songItem>img {display:block;margin:0 auto;}'+
      'li.songItem>span {display: block;}'+
      '</style>'
    );
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

