// Set the configuration for your app
// TODO: Replace with your project's config object
var config = {
    apiKey: "AIzaSyCqlUJ6-rsdd6KK9n1E2d8egBEOYxeYDZ0",
    authDomain: "acbihm-train-scheduler.firebaseapp.com",
    databaseURL: "https://acbihm-train-scheduler.firebaseio.com",
    storageBucket: "acbihm-train-scheduler.appspot.com",

};
firebase.initializeApp(config);

var database = firebase.database();

var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");
connectedRef.on("value", function (snap) {

    if (snap.val()) {
        var con = connectionsRef.push(true);
        con.onDisconnect().remove();
    }
});