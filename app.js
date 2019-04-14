// =====    Authentication and Initializtion    ===============================================

var config = {
    apiKey: "AIzaSyCqlUJ6-rsdd6KK9n1E2d8egBEOYxeYDZ0",
    authDomain: "acbihm-train-scheduler.firebaseapp.com",
    databaseURL: "https://acbihm-train-scheduler.firebaseio.com",
    storageBucket: "acbihm-train-scheduler.appspot.com",
};
firebase.initializeApp(config);

var trainDataTest = firebase.database();
var connectionsRef = trainDataTest.ref("/connections");
var connectedRef = trainDataTest.ref(".info/connected");
connectedRef.on("value", function (snap) {
    if (snap.val()) {
        var con = connectionsRef.push(true);
        con.onDisconnect().remove();
    }
});

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// =====    Grabbing inputs from the DOM, storing them    ===============================================


$("#submit-train").on("click", function (event) {
    event.preventDefault();
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var frequency = $("#frequency-input").val().trim();
    console.log(firstTrain);

    var addingTrain = {
        inputName: trainName,
        inputDestination: destination,
        inputFirstTrain: firstTrain,
        inputFrequency: frequency
    };

    trainDataTest.ref().push(addingTrain);

    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
});

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// =====    Clearing the DOM    ===============================================

$("#clear-fields").on("click", function (event) {
    event.preventDefault();
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
});

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

trainDataTest.ref().on("child_added", function (childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());

    var fb_name = childSnapshot.val().inputName;
    var fb_destination = childSnapshot.val().inputDestination;
    var fb_firstTrain = childSnapshot.val().inputFirstTrain;
    var fb_frequency = childSnapshot.val().inputFrequency;

    var min, arrival;
    var splitTime = fb_firstTrain;
    splitTime = splitTime.split(":");

    // *****    Trying to fix error *******************************************************

    console.log(typeof (splitTime))     //Thought that this being a string would be a problem, but it's not
    console.log(fb_firstTrain);         //This always correctly shows the time of the first train

    // var test = moment().hours(splitTime.charAt(0) + splitTime.charAt(1));
    // alert(test);    //this is me failing to find another way to avoid using .split
    // ************************************************************

    var trainTime = moment().hours(splitTime[0]).minutes(splitTime[1]);
    var maxMoment = moment.max(moment(), trainTime);

    if (maxMoment === trainTime) {
        arrival = trainTime.format("hh:mm A");
        min = trainTime.diff(moment(), "minutes");
    } else {
        var differenceTimes = moment().diff(trainTime, "minutes");
        var timeLeft = differenceTimes % fb_frequency;
        min = fb_frequency - timeLeft;
        arrival = moment().add(min, "m").format("hh:mm A");
    }

    // *****    Appending the table rows to the DOM  *******************************************************

    $("#train-table > tbody").append(
        $("<tr>").append(
            $("<td>").text(fb_name),
            $("<td>").text(fb_destination),
            $("<td>").text(`${fb_frequency} min`),
            $("<td>").text(arrival),
            $("<td>").text(`${min} min`)
        )
    );
});