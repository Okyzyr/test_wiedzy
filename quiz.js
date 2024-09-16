document.addEventListener("DOMContentLoaded", function () {
    let currentQuestionIndex = 0;
    let score = 0;
    let answeredQuestions = 0;
    let questions = [];

    fetch('odpowiedzi.json')
        .then(response => {
            console.log("Pobieranie danych JSON...");
            return response.json();
        })
        .then(data => {
            console.log("Dane załadowane:", data);
            questions = data;
            shuffleArray(questions);  // Przetasowujemy listę pytań zaraz po załadowaniu
            displayQuestion();
        })
        .catch(error => {
            console.error("Błąd podczas ładowania pliku JSON:", error);
            document.getElementById('question').textContent = "Nie udało się załadować pytań.";
        });

    function displayQuestion() {
        if (questions.length === 0) {
            console.error("Brak pytań do wyświetlenia.");
            document.getElementById('question').textContent = "Brak pytań do wyświetlenia.";
            return;
        }

        const question = questions[currentQuestionIndex];
        console.log("Wyświetlanie pytania:", question);
        const answers = [question.correct_answer, ...question.incorrect_answers];
        shuffleArray(answers);

        document.getElementById('question').textContent = question.question;
        const answersHtml = answers.map(answer => `<li onclick="selectAnswer(this, '${answer}', '${question.correct_answer}')">${answer}</li>`).join('');
        document.getElementById('answers').innerHTML = answersHtml;
    }

    window.selectAnswer = function(element, answer, correctAnswer) {
        if (element.parentNode.querySelector('.answered')) return;

        element.classList.add('answered');
        answeredQuestions++;

        let resultText = 'Niepoprawna odpowiedź!';
        if (answer === correctAnswer) {
            score++;
            resultText = 'Poprawna odpowiedź!';
            element.classList.add('correct');
        } else {
            element.classList.add('incorrect');
            highlightCorrectAnswer(correctAnswer);
        }
        // document.getElementById('result').textContent = resultText;
        updateScore();
    };

    function updateScore() {
        document.getElementById('score').textContent = `Wynik: ${score}/${answeredQuestions}`;
    }

    function highlightCorrectAnswer(correctAnswer) {
        const answers = document.querySelectorAll('#answers li');
        answers.forEach(answer => {
            if (answer.textContent === correctAnswer) {
                answer.classList.add('correct');
            }
        });
    }

    window.nextQuestion = function() {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
            document.getElementById('result').textContent = '';
        } else {
            document.getElementById('quiz-container').innerHTML = `<h1>Koniec quizu! Twój wynik to: ${score}/${answeredQuestions}</h1>`;
        }
    };

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
});