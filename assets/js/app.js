// Initialize Firebase
var config = {
    apiKey: "AIzaSyCldbbntQPixeTvDkXfqA5jNe5AlNA6Fq0",
    authDomain: "trainschedule-bb150.firebaseapp.com",
    databaseURL: "https://trainschedule-bb150.firebaseio.com/",
    projectId: "trainschedule-bb150",
    storageBucket: "",
    messagingSenderId: "219222311637"
  };
  firebase.initializeApp(config);
  
  var database = firebase.database();
  
  
  $("#submit").on("click", function () {
    event.preventDefault();
    //store the data from the form fields
    var name = $("#newTrain").val().trim() //the selector grabs the form input id
    var destination = $("#newDestination").val().trim()
    var firstTrainTime = $("#newFirstTrainTime").val().trim()
    var frequency = $("#newFrequency").val().trim()
  
    database.ref().push({
      name: name,
      destination: destination,
      firstTrainTime: firstTrainTime,
      frequency: frequency
    })
  
  })
  
  database.ref().on("child_added", function (snapshot) {

    // Assumptions
    var tFrequency = snapshot.val().frequency;

    // Time is 3:30 AM
    var firstTime = snapshot.val().firstTrainTime;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    var nextTrainFormatted = moment(nextTrain).format("hh:mm");
  
  
    $("tbody").append("<tr><th>" + snapshot.val().name + "</th><th>" + snapshot.val().destination + "</th><th>" +
      snapshot.val().frequency + "</th><th>" + nextTrainFormatted + "</th><th>" + tMinutesTillTrain + "</th></tr>")
  })