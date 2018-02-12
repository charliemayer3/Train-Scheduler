$(document).ready(function() { 

var config = {
  apiKey: "AIzaSyAa_zsfE3qasHUp8nnA-SS1AvV2fwc2d80",
  authDomain: "train-scheduler-65eda.firebaseapp.com",
  databaseURL: "https://train-scheduler-65eda.firebaseio.com",
  projectId: "train-scheduler-65eda",
  storageBucket: "train-scheduler-65eda.appspot.com",
  messagingSenderId: "180728656576"
};

firebase.initializeApp(config);

var database = firebase.database();

//creates button click event to add train to table
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  //grabs new train info
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var trainFirst = $("#first-input").val().trim();
  var trainFrequency = $("#frequency-input").val().trim();

  console.log(trainName)
  console.log(trainDestination)
  console.log(trainFirst)
  console.log(trainFrequency)

  //created the new train objects
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    first: trainFirst,
    frequency: trainFrequency
  };

  console.log(newTrain)

  //pushes the new trains to firebase. 
  database.ref().push(newTrain);

  //console log testing
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.first);
  console.log(newTrain.frequency);

  //alerts the train add
  alert("Train successfully added");

  //clears the form
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-input").val("");
  $("#frequency-input").val("");
});

//watches for new objects in firebase
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  //grabs the new object and stores all parts as variables
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainFirst = childSnapshot.val().first;
  var trainFrequency = childSnapshot.val().frequency;

  console.log(trainName);
  console.log(trainDestination);
  console.log(trainFirst);
  console.log(trainFrequency);

  //subtracting a year from my first train time.  code wasn't working properly withouth this.
  var firstTrainConverted = moment(trainFirst, "HH:mm").subtract(1, "years");
  console.log(firstTrainConverted);

  //sets the current time as a variable
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  //finds the difference between the current time and the time of the first train in minutes
  var timeDiff = currentTime.diff(moment(firstTrainConverted), "minutes");
  console.log("Time Difference: " + timeDiff);

  //take the time difference between the first train time and now, and then dives it by the train frequency.  Stores the remainder as a variable
  var tRemainder = timeDiff % trainFrequency;
  console.log(tRemainder);

  //finds the minutes until the next train by subtracting that remainder from the train arrival frequency.
  var minutesUntilArrival = trainFrequency - tRemainder;
  console.log("Until next train: " + minutesUntilArrival);

  //finds the time that the next train arrives by taking current time and adding the minutesUntilArrival
  var nextTrain = moment().add(minutesUntilArrival, "minutes").format("hh:mm A");
  console.log("Arrival Time: " + nextTrain)  //.format("hh:mm A"))

  //adds each train to the train table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
  trainFrequency + "</td><td>" + nextTrain + "</td><td>" + minutesUntilArrival + "</td></tr>");

});

})
