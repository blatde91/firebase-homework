// Firebase initialization

var config = {
	apiKey: "AIzaSyCNyDUtQDs3XOIcbpd0bfqpZdVshkAVtQo",
	authDomain: "trains-rule.firebaseapp.com",
	databaseURL: "https://trains-rule.firebaseio.com",
	projectId: "trains-rule",
	storageBucket: "trains-rule.appspot.com",
	messagingSenderId: "67865534003"
};

firebase.initializeApp(config);

var database = firebase.database()

// submit button fxn
$("#submitButt").on("click", function(event){
	// prevent default! very important
	event.preventDefault();
	// collecting user inputs
	var trainName = $("#train").val().trim();
	var destination = $("#where").val().trim();
	var trainTime = moment($("#when").val().trim(), "HH:mm").subtract(10, "years").format("X");
	var frequency = $("#frequency").val().trim();

	// firebase temp object
	var newTrain = {
		name: trainName,
		where: destination,
		when: trainTime,
		howoften: frequency,
	}

	console.log("momenttttt" + trainTime);

	// add newTrain to Firebase
	database.ref().push(newTrain);

	// clear text from inputs
	$("#train").val("");
	$("#where").val("");
	$("#when").val("");
	$("#frequency").val("");

});

// pull from firebase into page
database.ref().on("child_added", function(snapshot, prevChildKey){
	//store data into vars
	var fireTrainName = snapshot.val().name;
	var fireDestination = snapshot.val().where;
	var fireTrainTime = snapshot.val().when;
	var fireFrequency = snapshot.val().howoften;

	// console logs
	console.log(fireTrainName);
	console.log(fireDestination);
	console.log(fireTrainTime);
	console.log(fireFrequency);

	//moment.js vars to calculate time difference
	var convertTime = moment.unix(fireTrainTime);
	var timeDiff = moment().diff(moment(convertTime, "HH:mm"), "minutes");
	var timeRemain = timeDiff % fireFrequency;
	var totalMins = fireFrequency - timeRemain;

	// train time to push into table
	var nextTrain = moment().add(totalMins, "minutes").format("hh:mm A");

	console.log("time difference" + timeDiff);
	console.log("timeRemain" + timeRemain);
	console.log("total minutes" + totalMins);
	console.log(nextTrain);

	//put it in the html!
	$("#timeTable > tbody").append("<tr><td>" + fireTrainName + "</td><td>" + fireDestination + "</td><td>" + fireFrequency + " minutes" + "</td><td>" + nextTrain + "</td><td>" + totalMins + "</td></tr>");


});