PlayersList = new Mongo.Collection('playerslist');
if (Meteor.isClient) {
  var selectedPlayer = new ReactiveVar('');
  Template.LeaderBoard.helpers({
    players:function(){
      return PlayersList.find({},{sort:{score:-1,name:1}});
    },
    selectedPlayer:function(){
      var playerId=this._id;
      var selectedId = selectedPlayer.get();
      return playerId === selectedId ? 'selected' : '';
    }
  });

  Template.LeaderBoard.events({
    'click .player': function (e,t) {
        var playerId = this._id;
        selectedPlayer.set(playerId);
        console.log(playerId);
    }
  });

  Template.AddPlayer.events({
    'submit form[name=addPlayer]':function(e,t){
      e.preventDefault();
      var playerName=t.find('input[type=text]').value;
      if(playerName !== ''){
        PlayersList.insert({
          name:playerName,
          score:0,
          createdAt:new Date
        });
      }
      t.find('form[name=addPlayer]').reset();
    }
  });
  Template.ScoreButtons.helpers({
    selectedPlayerName:function(){
      var selectedId = selectedPlayer.get();
      return selectedId ? PlayersList.findOne({_id:selectedId}).name : '';
    }
  });
  Template.ScoreButtons.events({
    'click .increment': function (e,t) {
      var selectedId = selectedPlayer.get();
      PlayersList.update({_id:selectedId}, {$inc:{score:5}});
    },
    'click .decrement': function (e,t) {
      var selectedId = selectedPlayer.get();
      PlayersList.update({_id:selectedId}, {$inc:{score:-5}});
    },
    'click .delete':function(){
      var selectedId = selectedPlayer.get();
      PlayersList.remove({_id:selectedId});
    }
  });
  Template.ScoreButtons.rendered = function () {
    Tracker.autorun(function () {
      if(selectedPlayer.get()){
        $('.score-buttons').slideDown('1000');
      }
    });
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    if(PlayersList.find({}).count() === 0){
      var names = ['VinayPuppal','UtkarshShukla','MounishRaja','Prabhat','Aizan'];
      for(var i=0;i<names.length;i++){
          PlayersList.insert({
            name:names[i],
            score:0,
            createdAt:new Date
          });
      }
    }
  });
}
