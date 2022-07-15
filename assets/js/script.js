var questions = [
    {
        question: "Commonly Used data types DO NOT include:",
        choices: ["stings", "alerts", "booleans", "numbers"],
        answer: "alerts"
    },
    {
        question: "The condition in an if / else statment is enclosed within _____.",
        choices: ["parentheses", "quotes", "curly brackets", "square brackets"],
        answer: "parentheses"
    },
    {
        question: "What javascipt method can we use to select an html element?",
        choices: ["document.queryselector()", "document.getElementChild", "document.getElementById", "Both 1 and 3"],
        answer: "Both 1 and 3"
    },
    {
        question: "What html tag is NOT included in the HEAD tag?",
        choices: ["link", "meta", "title", "header"],
        answer: "header"
    },
    {
        question: "What attribute is used in html to decorate content?",
        choices: ["css", "class", "src", "style"],
        answer: "style"
    }
];


$(document).ready(function () {
    // all of the variables that I may or may not need
    var welcomeBox = $("#welcome");
    var questionBox = $("#question");
    var endingScoreBox = $("#endingScoreBox");
    var highScoresBox = $("#highScores");
    var scores = JSON.parse(localStorage.getItem("scores") || "[]");

    var questionTxtEl = $("#questionTxt");
    var answerBtn1 = $("#choice1");
    var answerBtn2 = $("#choice2");
    var answerBtn3 = $("#choice3");
    var answerBtn4 = $("#choice4");
    var feedbackEl = $("#feedback");
    var getStartedBtn = $("#getStarted");
    var highScoresBtn = $("#highScoreBtn");
    var currentQuestion = 0;
    // create timer
    var timer = 500;
    var timerCountdownEl = $("#timerCountdown");
    var timerReference = undefined;

    // initial settings of the divs
    welcomeBox.show();
    questionBox.hide();
    endingScoreBox.hide();
    highScoresBox.hide();

    // when the page loads, the questions get shuffled.
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = questions[i];
        questions[i] = questions[j];
        questions[j] = temp;
    }

    //shows the endingScoreBox if you finish the quiz or when you click on High Scores button
    function showScore() {
        questionBox.hide();
        endingScoreBox.show();
        $("#endingScore").text("Ending Score: " + timer);
        window.clearInterval(timerReference);
    }

    //this will run when you click Save or click on the button for high scores.
    function showHighScores() {
        welcomeBox.hide();
        questionBox.hide();
        endingScoreBox.hide();
        highScoresBox.show();
        $("#highScoresList").empty();
        $.each(scores, function (index, value) {
            var initials = value[0];
            var score = value[1];
            var eachScore = $("<li>");
            eachScore.text(initials + "      " + score);
            $("#highScoresList").append(eachScore);
        });
    }
  
    //when you click on getStarted, the welcomeBox hides, and first round of question shows.
    getStartedBtn.click(function () {
        //hide various boxes and show question box.
        welcomeBox.hide();
        questionBox.show();
        //this picks the first question of the questions array and puts it in the local variable, question1. 
        var question1 = questions[0];
        //this makes the h3 text, var question1's question value.
        questionTxtEl.text(question1.question);
        //create a local variable with the choices of question 1. 
        var question1choices = question1.choices;
        //fill in each button with a choice from the array
        answerBtn1.text(question1choices[0]);
        answerBtn2.text(question1choices[1]);
        answerBtn3.text(question1choices[2]);
        answerBtn4.text(question1choices[3]);
        //start countdown
        timerReference = window.setInterval(function () {
            timer--;
            if (timer == 0) {
                //When timer hits 0, move immediately to score screen.
                showScore();
            } else {
                timerCountdownEl.text(timer);
            };
        }, 1000);

    });
    //when an answerBtn is clicked, it is either correct or false. If correct, feedback=Correct!, pause for 0.5 second, and continue.
    $(".answer").on("click", function (event) {
        event.preventDefault();
        var correctAnswer = questions[currentQuestion].answer;
        var theirAnswer = event.target.innerText;
        if (theirAnswer == correctAnswer) {
            feedbackEl.text("Correct!").show();
        } else {
            //deduct 10 seconds, and go to next question.
            feedbackEl.text("Wrong!").show();
            timer -= 10;
        }
        //pause for 0.5 second, then go to next question.
        window.setTimeout(function () {
            //goes to next question
            showNextQuestionOrScore();
        }, 500);
    });

    function showNextQuestionOrScore() {
        currentQuestion++;
        // when currentQuestion reaches 10/max number of questions
        if (currentQuestion == questions.length) {
            showScore();
        } else {
            feedbackEl.hide();
            var question1 = questions[currentQuestion];
            //this makes the h3 text, var question1's question value.
            questionTxtEl.text(question1.question);
            //create a local variable with the choices of question 1. 
            var question1choices = question1.choices;
            //fill in each button with a choice from the array
            answerBtn1.text(question1choices[0]);
            answerBtn2.text(question1choices[1]);
            answerBtn3.text(question1choices[2]);
            answerBtn4.text(question1choices[3]);
        }
    }

    var saveInitials = $("#saveInitials");
    //Save key value pairs to local storage: Initials => Score
    //does not allow duplicate initials/score tho
    saveInitials.on("click", function (event) {
        var multipleInitial = $("#initials").val();
        // multipleInitial and timer must be set in scores array
        scores.push([multipleInitial, timer]);
        //sort the array first.
        scores.sort(function (first, second) {
            if (first[1] > second[1]) {
                return -1;
            } else if (first[1] < second[1]) {
                return 1;
            }
            return 0;
        });
        //this saves it to local storage.
        localStorage.setItem("scores", JSON.stringify(scores));
        showHighScores();
    });

    highScoresBtn.on("click", function () {
        window.clearInterval(timerReference);
        showHighScores();
    });

    //clears local storage
    $("#clearScores").on("click", function () {
        scores = [];
        localStorage.setItem("scores", JSON.stringify(scores));
        //remove all of the list's children
        $("#highScoresList").empty();
    });

    //start over button
    $("#startOver").on("click", function () {
        location.reload();
    });

});