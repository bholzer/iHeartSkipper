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
    songQueue: 'p-tracks'
  },

  initialize: function() {
    setTimeout(this.update.bind(this), 400);
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

    //Always reset skips on update
    var currentSkips = this.readValue('currentSkips');
    var overallSkips = this.readValue('overallSkips');
    overallSkips.count = 0;
    currentSkips.count = 0;
    this.setValue('currentSkips', currentSkips);
    this.setValue('overallSkips', overallSkips);
  },

  skip: function() {
    if (!this.triggered) { 
      this.previousSongStack.push(this.currentSong);
      this.triggered = false;
    }
    this.currentSong = this.currentSongQueue[0];
    this.update();
  },

  previousSong: function() {
    console.log("Previous Stack Before Back: ["+this.previousSongStack.join('.')+"]");
    console.log("Queue Before Back: ["+this.currentSongQueue.join(',')+"]");
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
  }
}

$('.b-playStation, #playerPlay').click(function(){
  setTimeout(Skipper.initialize.bind(Skipper), 200);
});
$('#playerNext').click(function(e){
  Skipper.skip();
});
