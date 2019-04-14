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

$("#submit-train").on("click", function (event) {
    event.preventDefault();
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var frequency = $("#frequency-input").val().trim();
console.log(firstTrain);

    var addingTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    };

    alert(addingTrain);
    trainData.ref().push(addingTrain);

    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
});

$("#clear-fields").on("click", function (event) {
    event.preventDefault();
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
});