PlayersList = new Mongo.Collection('playerslist');
if (Meteor.isClient) {
  Template.LeaderBoard.helpers({
    
  });

  Template.LeaderBoard.events({
    
  });
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
