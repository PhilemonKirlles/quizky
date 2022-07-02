// //attach questions' opject file to the main js script
// var questions = document.createElement("script");
// questions.type = "text/javascript";
// questions.src = "./assets/js/questions.js";
// questions.async = true;
// $("head").append(script);

// var questions = [
//   {
//       title: "Commonly Used data types DO NOT include:",
//       choices: ["stings", "alerts", "booleans", "numbers"],
//       answer: "alerts"
//   },
//   {
//       title: "The condition in an if / else statment is enclosed within _____.",
//       choices: ["parentheses", "quotes", "curly brackets", "square brackets"],
//       answer: "parentheses"
//   },
//   {
//       title: "What javascipt method can we use to select an html element?",
//       choices: ["document.queryselector()", "document.getElementChild", "document.getElementById", "Both 1 and 3"],
//       answer: "Both 1 and 3"
//   },
//   {
//       title: "What html tag is NOT included in the HEAD tag?",
//       choices: ["link", "meta", "title", "header"],
//       answer: "header"
//   },
//   {
//       title: "What attribute is used in html to decorate content?",
//       choices: ["css", "class", "src", "style"],
//       answer: "style"
//   }
// ]

// DOM elements

let questionsEl = document.querySelector("#questions");
let timerEl = document.querySelector("#time");
let choicesEl = document.querySelector("#choices");
let submitBtn = document.querySelector("#submit");
let initialsEl = document.querySelector("#initials");
let feedbackEl = document.querySelector("#feedback");

// states of quistions' var.
// hide start screen and un hide quistion
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

function startQuiz() {
  var startScreenEl = document.getElementById("start-screen");
  startScreenEl.setAttribute("class", "hide");

 
  questionsEl.removeAttribute("class");

  // timer display starting time 
  timerId = setInterval(clockTick, 1000);
  timerEl.textContent = time;

  getQuestion();
}
// get current object from array, load next quistion, clear  and choices
function getQuestion() {
  
  var currentQuestion = questions[currentQuestionIndex];

  
  var titleEl = document.getElementById("question-title");
  titleEl.textContent = currentQuestion.title;

// clear out any old question choices and loop
// create new button for each choice
  choicesEl.innerHTML = "";

  currentQuestion.choices.forEach(function(choice, i) {

    var choiceNode = document.createElement("button");
    choiceNode.setAttribute("class", "choice");
    choiceNode.setAttribute("value", choice);

    choiceNode.textContent = i + 1 + ". " + choice;

    // attach event listeners and appendChild
    choiceNode.onclick = questionClick;
    choicesEl.appendChild(choiceNode);
  });
}

// is it the wrong choice? and penalty of time and feedback
function questionClick() {
  
    if (this.value !== questions[currentQuestionIndex].answer) {
  
      time -= 15;
  
      if (time < 0) {
        time = 0;
      }
      timerEl.textContent = time;
      feedbackEl.textContent = "Wrong!";
      feedbackEl.style.color = "red";
      feedbackEl.style.fontSize = "400%";
    } else {
      feedbackEl.textContent = "Correct!";
      feedbackEl.style.color = "green";
      feedbackEl.style.fontSize = "400%";
    }
  
    feedbackEl.setAttribute("class", "feedback");
    setTimeout(function() {
      feedbackEl.setAttribute("class", "feedback hide");
    }, 1000);
  
    // next question and time check
    currentQuestionIndex++;
  
    if (currentQuestionIndex === questions.length) {
      quizEnd();
    } else {
      getQuestion();
    }
  }
  //endquiz and stop timmer
  function quizEnd() {
   
    clearInterval(timerId);
  
    // end screen/final score 
    var endScreenEl = document.getElementById("end-screen");
    endScreenEl.removeAttribute("class");
  
    var finalScoreEl = document.getElementById("final-score");
    finalScoreEl.textContent = time;
  
    //set attribute name: hide
    questionsEl.setAttribute("class", "hide");
  }
  //check time statues
  function clockTick() {
  
    time--;
    timerEl.textContent = time;
  
  
    if (time <= 0) {
      quizEnd();
    }
  }
  
  function saveHighscore() {
    // get value, get saved score from storage, rewrite score and save to localstorage.
    var initials = initialsEl.value.trim();
    //if not, set to empty array
    if (initials !== "") {

        var highscores =
        JSON.parse(window.localStorage.getItem("highscores")) || [];
  
      var newScore = {
        score: time,
        initials: initials
      };
  
      // save to localstorage
      highscores.push(newScore);
      window.localStorage.setItem("highscores", JSON.stringify(highscores));
  
      // point to score.html
      window.location.href = "score.html";
    }
  }
  function checkForEnter(event) {
    // "13" represents the enter key
    if (event.key === "Enter") {
      saveHighscore();
    }
  }
  
  // submit initials
  submitBtn.onclick = saveHighscore;
  
  // start quiz
  startBtn.onclick = startQuiz;
  
  initialsEl.onkeyup = checkForEnter;

