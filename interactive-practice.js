// Interactive Practice Module for Math Practice PWA

class InteractivePractice {
    constructor() {
        this.currentProblem = 0;
        this.totalProblems = 25;
        this.score = 0;
        this.timeStarted = null;
        this.timeElapsed = 0;
        this.timerInterval = null;
        this.problems = [];
        this.answers = [];
        this.userAnswers = [];
        this.difficulty = 'easy';
        this.concept = 'numbers';
        this.isRunning = false;
    }

    start(difficulty, concept) {
        this.difficulty = difficulty;
        this.concept = concept;
        this.currentProblem = 0;
        this.score = 0;
        this.timeStarted = Date.now();
        this.timeElapsed = 0;
        this.problems = [];
        this.answers = [];
        this.userAnswers = [];
        this.isRunning = true;

        this.generateProblems();
        this.startTimer();
        this.showCurrentProblem();
    }

    stop() {
        this.isRunning = false;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    generateProblems() {
        const settings = window.mathApp.difficultySettings[this.difficulty];
        
        for (let i = 0; i < this.totalProblems; i++) {
            const problem = this.generateProblem(settings.min, settings.max, this.concept);
            this.problems.push(problem);
            this.answers.push(problem.answer);
        }
    }

    generateProblem(min, max, concept) {
        let problem = { question: '', answer: 0, type: concept, visual: '' };

        switch (concept) {
            case 'numbers':
                return this.generateNumbersProblem(min, max);
            case 'patterns':
                return this.generatePatternsProblem(min, max);
            case 'dataHandling':
                return this.generateCountingProblem(min, max);
            case 'measurement':
                return this.generateMeasurementProblem(min, max);
            case 'geometry':
                return this.generateGeometryProblem(min, max);
            default:
                return this.generateNumbersProblem(min, max);
        }
    }

    generateNumbersProblem(min, max) {
        const operators = ['+', '-', '*', '/'];
        const availableOps = this.difficulty === 'easy' ? ['+', '-'] : 
                           this.difficulty === 'medium' ? ['+', '-', '*'] : operators;
        
        const operator = availableOps[MathUtils.getRandomInt(0, availableOps.length - 1)];
        let num1 = MathUtils.getRandomInt(min, max);
        let num2 = MathUtils.getRandomInt(min, max);
        let answer;

        // Adjust for subtraction and division
        if (operator === '-' && num1 < num2) {
            [num1, num2] = [num2, num1];
        } else if (operator === '/') {
            // Ensure clean division
            num2 = MathUtils.getRandomInt(1, Math.min(10, max));
            num1 = num2 * MathUtils.getRandomInt(1, Math.floor(max / num2));
        }

        switch (operator) {
            case '+': answer = num1 + num2; break;
            case '-': answer = num1 - num2; break;
            case '*': answer = num1 * num2; break;
            case '/': answer = num1 / num2; break;
        }

        // Add visual representation for easy level
        let visual = '';
        if (this.difficulty === 'easy' && (operator === '+' || operator === '-')) {
            const start = Math.min(0, num1 - num2, num1 + num2) - 1;
            const end = Math.max(num1, num1 + num2, num1 - num2) + 1;
            visual = MathUtils.generateNumberLine(start, end, null, operator);
        }

        return {
            question: `${num1} ${MathUtils.getOperatorSymbol(operator)} ${num2}`,
            answer: answer,
            type: 'numbers',
            visual: visual
        };
    }

    generatePatternsProblem(min, max) {
        const patternTypes = ['addition', 'subtraction', 'multiplication'];
        const type = patternTypes[MathUtils.getRandomInt(0, patternTypes.length - 1)];
        
        let start = MathUtils.getRandomInt(1, Math.min(10, max));
        let step = MathUtils.getRandomInt(2, 5);
        let sequence = [start];

        for (let i = 1; i < 5; i++) {
            let next;
            switch (type) {
                case 'addition':
                    next = sequence[i-1] + step;
                    break;
                case 'subtraction':
                    next = sequence[i-1] - step;
                    if (next < 0) next = sequence[i-1] + step; // Avoid negatives
                    break;
                case 'multiplication':
                    next = sequence[i-1] * step;
                    if (next > max) {
                        step = 2;
                        next = sequence[i-1] * step;
                    }
                    break;
            }
            sequence.push(next);
        }

        return {
            question: `What comes next? ${sequence.slice(0, 4).join(', ')}, ___`,
            answer: sequence[4],
            type: 'patterns',
            visual: ''
        };
    }

    generateCountingProblem(min, max) {
        const objects = ['🍎', '🍌', '🍇', '🍓', '🍊', '⭐', '🔵', '🔸', '❤️', '🟢'];
        const selectedObject = objects[MathUtils.getRandomInt(0, objects.length - 1)];
        const count = MathUtils.getRandomInt(Math.max(1, min), Math.min(15, max));
        
        let visual = '<div class="counting-objects">';
        for (let i = 0; i < count; i++) {
            visual += `<span class="counting-object" style="animation-delay: ${i * 0.1}s">${selectedObject}</span>`;
        }
        visual += '</div>';

        return {
            question: `How many objects do you see?`,
            answer: count,
            type: 'dataHandling',
            visual: visual
        };
    }

    generateMeasurementProblem(min, max) {
        const measurements = [
            { question: 'How many centimeters are in 1 meter?', answer: 100 },
            { question: 'How many minutes are in 1 hour?', answer: 60 },
            { question: 'How many days are in 1 week?', answer: 7 },
            { question: 'How many wheels does a bicycle have?', answer: 2 },
            { question: 'How many sides does a triangle have?', answer: 3 },
            { question: 'How many fingers do you have on one hand?', answer: 5 }
        ];

        // For higher difficulties, add number comparison problems
        if (this.difficulty !== 'easy') {
            const num1 = MathUtils.getRandomInt(min, max);
            const num2 = MathUtils.getRandomInt(min, max);
            const unit = ['cm', 'kg', 'm'][MathUtils.getRandomInt(0, 2)];
            
            measurements.push({
                question: `Which is larger: ${num1}${unit} or ${num2}${unit}?`,
                answer: Math.max(num1, num2),
                comparison: true
            });
        }

        const selected = measurements[MathUtils.getRandomInt(0, measurements.length - 1)];
        return {
            question: selected.question,
            answer: selected.answer,
            type: 'measurement',
            visual: '',
            comparison: selected.comparison || false
        };
    }

    generateGeometryProblem(min, max) {
        const shapes = [
            { name: 'triangle', sides: 3, vertices: 3, angles: 3 },
            { name: 'square', sides: 4, vertices: 4, angles: 4 },
            { name: 'rectangle', sides: 4, vertices: 4, angles: 4 },
            { name: 'circle', sides: 0, vertices: 0, angles: 0 },
            { name: 'pentagon', sides: 5, vertices: 5, angles: 5 },
            { name: 'hexagon', sides: 6, vertices: 6, angles: 6 }
        ];

        const selectedShape = shapes[MathUtils.getRandomInt(0, shapes.length - 1)];
        const questionTypes = ['sides', 'vertices', 'count'];
        const questionType = questionTypes[MathUtils.getRandomInt(0, questionTypes.length - 1)];

        let question, answer, visual;

        if (questionType === 'count') {
            // Count multiple shapes
            const count = MathUtils.getRandomInt(2, Math.min(8, max));
            visual = '<div class="flex flex-wrap justify-center gap-2 mb-4">';
            for (let i = 0; i < count; i++) {
                visual += MathUtils.createShape(selectedShape.name, 60);
            }
            visual += '</div>';
            question = `How many ${selectedShape.name}s do you see?`;
            answer = count;
        } else {
            visual = '<div class="flex justify-center mb-4">' + MathUtils.createShape(selectedShape.name, 120) + '</div>';
            
            if (questionType === 'sides') {
                question = `How many sides does this ${selectedShape.name} have?`;
                answer = selectedShape.sides;
            } else {
                question = `How many vertices (corners) does this ${selectedShape.name} have?`;
                answer = selectedShape.vertices;
            }
        }

        return {
            question: question,
            answer: answer,
            type: 'geometry',
            visual: visual
        };
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            if (this.isRunning) {
                this.timeElapsed = Math.floor((Date.now() - this.timeStarted) / 1000);
                document.getElementById('timer').textContent = MathUtils.formatTime(this.timeElapsed);
            }
        }, 1000);
    }

    showCurrentProblem() {
        if (this.currentProblem >= this.totalProblems) {
            this.showResults();
            return;
        }

        const problem = this.problems[this.currentProblem];
        const content = document.getElementById('practiceContent');
        
        // Update progress
        document.getElementById('currentQuestion').textContent = this.currentProblem + 1;
        document.getElementById('totalQuestions').textContent = this.totalProblems;
        document.getElementById('score').textContent = this.score;

        let html = `
            <div class="text-center">
                ${problem.visual}
                <div class="problem-display mb-6">
                    ${problem.question} = ?
                </div>
                <div class="flex justify-center items-center gap-4 mb-6">
                    <input type="number" 
                           id="answerInput" 
                           class="answer-input" 
                           placeholder="Your answer"
                           autocomplete="off">
                    <button id="submitAnswer" 
                            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold text-lg">
                        Submit
                    </button>
                </div>
                <div id="feedback" class="text-lg font-semibold min-h-[2rem]"></div>
            </div>
        `;

        content.innerHTML = html;

        // Focus on input
        const input = document.getElementById('answerInput');
        input.focus();

        // Add event listeners
        document.getElementById('submitAnswer').addEventListener('click', () => {
            this.checkAnswer();
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkAnswer();
            }
        });
    }

    checkAnswer() {
        const input = document.getElementById('answerInput');
        const userAnswer = parseFloat(input.value);
        const correctAnswer = this.problems[this.currentProblem].answer;
        const feedback = document.getElementById('feedback');
        
        this.userAnswers.push(userAnswer);

        if (userAnswer === correctAnswer) {
            this.score++;
            feedback.innerHTML = '<span class="text-green-600">✓ Correct! Well done!</span>';
            input.classList.add('correct');
            input.classList.add('feedback-correct');
        } else {
            feedback.innerHTML = `<span class="text-red-600">✗ Not quite. The answer is ${correctAnswer}</span>`;
            input.classList.add('incorrect');
            input.classList.add('feedback-incorrect');
        }

        // Disable input and button
        input.disabled = true;
        document.getElementById('submitAnswer').disabled = true;

        // Update score display
        document.getElementById('score').textContent = this.score;

        // Move to next problem after delay
        setTimeout(() => {
            this.currentProblem++;
            this.showCurrentProblem();
        }, 2000);
    }

    showResults() {
        this.stop();
        const percentage = Math.round((this.score / this.totalProblems) * 100);
        const stars = Math.min(5, Math.max(1, Math.ceil(percentage / 20)));
        
        const content = document.getElementById('practiceContent');
        
        let starHtml = '';
        for (let i = 1; i <= 5; i++) {
            starHtml += `<i class="fas fa-star star ${i <= stars ? 'filled' : ''}" style="animation-delay: ${i * 0.2}s"></i>`;
        }

        const encouragement = this.getEncouragement(percentage);

        content.innerHTML = `
            <div class="results-summary">
                <h2 class="text-3xl font-bold mb-4">🎉 Great Job! 🎉</h2>
                <div class="text-6xl mb-4">${percentage}%</div>
                <div class="text-xl mb-4">You got ${this.score} out of ${this.totalProblems} questions correct!</div>
                <div class="text-lg mb-4">Time taken: ${MathUtils.formatTime(this.timeElapsed)}</div>
                <div class="star-rating mb-4">
                    ${starHtml}
                </div>
                <div class="text-lg mb-6">${encouragement}</div>
                <div class="flex gap-4 justify-center">
                    <button id="practiceAgain" class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold">
                        Practice Again
                    </button>
                    <button id="tryDifferent" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold">
                        Try Different Level
                    </button>
                </div>
            </div>
        `;

        // Add event listeners for result buttons
        document.getElementById('practiceAgain').addEventListener('click', () => {
            this.start(this.difficulty, this.concept);
        });

        document.getElementById('tryDifferent').addEventListener('click', () => {
            window.mathApp.closeModal();
        });
    }

    getEncouragement(percentage) {
        if (percentage >= 90) return "Outstanding! You're a math superstar! ⭐";
        if (percentage >= 80) return "Excellent work! Keep it up! 🌟";
        if (percentage >= 70) return "Great job! You're getting better! 👍";
        if (percentage >= 60) return "Good effort! Practice makes perfect! 💪";
        return "Keep trying! Every practice session makes you stronger! 🚀";
    }
}

// Initialize interactive practice
document.addEventListener('DOMContentLoaded', () => {
    window.interactivePractice = new InteractivePractice();
});