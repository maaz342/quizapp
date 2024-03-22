const firebaseConfig = {
  apiKey: "AIzaSyDyAF1DHvKytYJH4yNenHuOVB0CALBebW8",
  authDomain: "quiz-app-87228.firebaseapp.com",
  projectId: "quiz-app-87228",
  storageBucket: "quiz-app-87228.appspot.com",
  messagingSenderId: "333162492360",
  databaseURL:"https://quiz-app-87228-default-rtdb.firebaseio.com/",
  appId: "1:333162492360:web:679e3ebab084ecc3da10fd",
  measurementId: "G-981FL4NLV4"
};
firebase.initializeApp(firebaseConfig);

const database = firebase.database();

let currentQuestionIndex = 0;
let quizData = [];
let score = 0; 


function fetchQuizData() {
    const quizRef = database.ref('quizData');
    quizRef.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            const question = childSnapshot.val();
            quizData.push(question);
        });
        displayQuestion();
    });
}

function displayQuestion() {
    const question = quizData[currentQuestionIndex];
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    questionElement.innerText = question.question;
    optionsElement.innerHTML = '';
    question.options.forEach((option, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <input type="radio" name="answer" id="option_${index + 1}" class="answer" value="${index}">
            <label for="option_${index + 1}" id="option_${index + 1}_label">${option}</label>
        `;
        optionsElement.appendChild(listItem);
    });
}

function nextQuestion() {
  const selectedAnswerIndex = document.querySelector('input[name="answer"]:checked');
  if (!selectedAnswerIndex) {
      alert('Please select an answer before proceeding.');
      return;
  }

  const selectedAnswer = parseInt(selectedAnswerIndex.value);

  const correctAnswerIndex = quizData[currentQuestionIndex].correctAns;

  if (selectedAnswer === correctAnswerIndex) {
      score++; 
  }

  currentQuestionIndex++;
  if (currentQuestionIndex < quizData.length) {
      displayQuestion();
  } else {
      displayResult();
  }
}

function displayResult() {
  document.getElementById('quiz').style.display = 'none';

  const resultElement = document.getElementById('result');
  resultElement.innerText = `Your score: ${score} out of ${quizData.length}`;
  resultElement.style.display = 'block';
}

document.getElementById('next').addEventListener('click', nextQuestion);

window.onload = function() {
    fetchQuizData();
};
 