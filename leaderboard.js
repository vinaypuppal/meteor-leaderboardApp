PlayersList = new Mongo.Collection('playerslist');
if (Meteor.isClient) {
  Accounts.ui.config({
    passwordSignupFields:'USERNAME_ONLY'
  });
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
  Template.LeaderBoard.onCreated(function() {  
    this.subscribe('playerslist');
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
      var currentUserId = Meteor.userId();
      if(playerName !== ''){
        Meteor.call('insertPlayerData',playerName, function (error, result) {
          if(error){
            console.log(error);
          }
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
      Meteor.call('updatePlayerScore', selectedId,5, function (error, result) {
        if(error){
          console.log(error);
        }
      });
    },
    'click .decrement': function (e,t) {
      var selectedId = selectedPlayer.get();
      Meteor.call('updatePlayerScore', selectedId,-5, function (error, result) {
        if(error){
          console.log(error);
        }
      });
    },
    'click .delete':function(){
      var selectedId = selectedPlayer.get();
      Meteor.call('removePlayer',selectedId, function (error, result) {
        if(error){
          console.log(error);
        }
      });
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
  Meteor.publish('playerslist',function(){
    return PlayersList.find({userId:this.userId});
  });
  Meteor.methods({
    'insertPlayerData':function(playerName){
      var currentUserId = Meteor.userId();
        PlayersList.insert({
          name:playerName,
          score:0,
          userId:currentUserId,
          createdAt:new Date
        });
    },
    'removePlayer':function(playerId){
      PlayersList.remove({_id:playerId,userId:Meteor.userId()});
    },
    'updatePlayerScore':function(selectedPlayer,scoreValue){
      PlayersList.update({_id:selectedPlayer,userId:Meteor.userId()}, {$inc:{score:scoreValue}});
    }
  })
  Meteor.startup(function () {
    // code to run on server at startup
    // if(PlayersList.find({}).count() === 0){
    //   var names = ['VinayPuppal','UtkarshShukla','MounishRaja','Prabhat','Aizan'];
    //   for(var i=0;i<names.length;i++){
    //       PlayersList.insert({
    //         name:names[i],
    //         score:0,
    //         createdAt:new Date
    //       });
    //   }
    // }
  });
}
