var Skipper = {
  previousSongStack: [],
  currentStationId: '',
  currentSongQueue: [],
  keys: {
    nowPlaying: 'p-nowPlaying',
    currentSkips: 'p-station-'+this.currentStationId,
    overallSkips: 'p-station-skips',
    songQueue: 'p-tracks'
  },

  initialize: function() {
    this.update();
  },

  readValue: function(key) {
    return $.parseJSON(localStorage.getItem(this.keys[key]));
  },

  setValue: function(key, value) {
    localStorage.setItem(this.keys[key], JSON.stringify(value));
  },

  update: function() {
    this.currentStationId = this.readValue('nowPlaying').data.id;
    this.currentSongQueue = this.readValue('songQueue')[this.currentStationId];
    this.keys.currentSkips = 'p-station-'+this.currentStationId;
    console.log(this.currentSong);
  },

  skip: function() {
    this.previousSongStack.push(this.currentSongQueue[0]);
    this.update();
    var currentSkips = this.readValue('currentSkips');
    var overallSkips = this.readValue('overallSkips');
    overallSkips.count = 0;
    currentSkips.count = 0;
    this.setValue('currentSkips', currentSkips);
    this.setValue('overallSkips', overallSkips);
  },

  previousSong: function() {
    //Not working correctly yet
    var songQueue = this.readValue('songQueue');
    songQueue[this.currentStationId].unshift(this.previousSongStack.pop());
    songQueue[this.currentStationId].unshift(this.previousSongStack.pop());
    this.setValue('songQueue', songQueue);
    $('#playerNext').click();
  }
}

$('.b-playStation, #playerPlay').click(function(){
  setTimeout(Skipper.initialize.bind(Skipper), 200);
});
$('#playerNext').click(function(){
  Skipper.skip();
});
