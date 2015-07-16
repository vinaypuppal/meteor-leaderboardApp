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
  });
}
