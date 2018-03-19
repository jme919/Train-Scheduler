
console.log("Im alive!!!")
//  Initialize Firebase//
var config = {
    apiKey: "AIzaSyBNRhs6TkdxUe0n_xnBF8vC4gzmYiPzqV4",
    authDomain: "train-scheduler-835bf.firebaseapp.com",
    databaseURL: "https://train-scheduler-835bf.firebaseio.com",
    projectId: "train-scheduler-835bf",
    storageBucket: "",
    messagingSenderId: "136933943921"
  };
  firebase.initializeApp(config);

var database = firebase.database();

// Button for adding train
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input//
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTime = moment($("#first-input").val().trim(), "HH:mm").format("X");
  var frequency = $("#frequency-input").val().trim();

  // Creates local object for holding train data//
  var newTrain = {
    name: trainName,
    destination: destination,
    first: firstTime,
    frequency: frequency,
  };

  // Uploads train data to the database//
  database.ref().push(newTrain);

  // Logs everything to console//
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.first);
  console.log(newTrain.frequency);

  // Alert//
  alert("New Train Has Been Added");

  // Clears all of the text-boxes//
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-input").val("");
  $("#frequency-input").val("");
});

//  Create Firebase event for adding new train to the database and a row in the html when a user adds an entry//
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable//
  var trainName = childSnapshot.val().name;
  var destination = childSnapshot.val().destination;
  var firstTime = childSnapshot.val().first;
  var frequency = childSnapshot.val().frequency;

  // Train Info//
  console.log(trainName);
  console.log(destination);
  console.log(firstTime);
  console.log(frequency);

   var firstTimePretty = moment.unix(firstTime).format("HH:mm");

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
  frequency + "</td><td>" +  moment(nextTrain).format("HH:mm") + "</td><td>" + tMinutesTillTrain + "</td></tr>");
});


