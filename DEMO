<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Social Steps Preview</title>
  <style>
    body {
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f8f9fa;
      color: #333333;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }
    header {
      text-align: center;
      padding: 25px 15px;
      background-color: #ffffff;
      width: 100%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      margin-bottom: 20px;
    }
    header h1 {
      margin: 0;
      font-size: 1.8rem;
      color: #2c3e50;
    }
    header p {
      margin: 5px 0 0 0;
      font-size: 0.95rem;
      color: #7f8c8d;
    }
    main {
      width: 100%;
      max-width: 550px;
      padding: 0 15px 40px 15px;
      box-sizing: border-box;
    }
    .screen {
      display: none;
    }
    .screen.active {
      display: block;
    }
    /* Pathway Styles */
    .level-card {
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.02);
    }
    .level-card.level-1 {
      background-color: #e3f2fd;
      border-left: 8px solid #0d47a1;
    }
    .level-card.level-2 {
      background-color: #e8f5e9;
      border-left: 8px solid #1b5e20;
    }
    .level-title {
      margin: 0 0 8px 0;
      font-size: 1.2rem;
    }
    .level-1 .level-title { color: #0d47a1; }
    .level-2 .level-title { color: #1b5e20; }
    .level-desc {
      margin: 0 0 15px 0;
      font-size: 0.9rem;
      color: #555555;
      line-height: 1.4;
    }
    .lesson-btn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 12px 15px;
      background-color: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.95rem;
      font-weight: 600;
      color: #2d3748;
      text-align: left;
    }
    .lesson-btn.completed {
      background-color: #f0fdf4;
      border-color: #bbf7d0;
      color: #166534;
    }
    /* Card Styles for Lesson & Quiz */
    .card {
      background-color: #ffffff;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .progress-bar-bg {
      width: 100%;
      height: 8px;
      background-color: #edf2f7;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 10px;
    }
    .progress-bar-active {
      height: 100%;
      background-color: #4299e1;
      width: 0%;
      transition: width 0.3s ease;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .back-btn {
      background: none;
      border: none;
      color: #4a5568;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 600;
      padding: 0;
    }
    .step-text {
      font-size: 0.8rem;
      color: #718096;
      font-weight: 600;
    }
    .phrase-display {
      text-align: center;
      padding: 20px 10px;
      background-color: #f7fafc;
      border-radius: 12px;
      border: 1px solid #edf2f7;
    }
    .phrase-text {
      font-size: 1.35rem;
      margin: 0 0 15px 0;
      color: #2d3748;
      line-height: 1.4;
    }
    .speak-btn {
      background-color: #edf2f7;
      border: 1px solid #cbd5e0;
      border-radius: 20px;
      padding: 6px 14px;
      font-size: 0.85rem;
      font-weight: 600;
      color: #4a5568;
      cursor: pointer;
    }
    .info-box {
      border-left: 4px solid;
      padding: 10px 14px;
      border-radius: 0 8px 8px 0;
      font-size: 0.9rem;
    }
    .info-box.context {
      background-color: #fffaf0;
      border-color: #dd6b20;
    }
    .info-box.hint {
      background-color: #ebf8ff;
      border-color: #3182ce;
    }
    .info-box strong {
      display: block;
      margin-bottom: 3px;
    }
    .info-box.context strong { color: #dd6b20; }
    .info-box.hint strong { color: #3182ce; }
    .info-box p {
      margin: 0;
      color: #4a5568;
      line-height: 1.4;
    }
    .primary-btn {
      background-color: #3182ce;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      padding: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      text-align: center;
      margin-top: 10px;
    }
    .primary-btn:disabled {
      background-color: #cbd5e0;
      cursor: not-allowed;
    }
    /* Quiz Specific */
    .option-btn {
      display: block;
      width: 100%;
      padding: 12px;
      margin-bottom: 10px;
      border-radius: 8px;
      border: 2px solid #e2e8f0;
      background-color: #ffffff;
      cursor: pointer;
      text-align: left;
      font-size: 0.9rem;
      color: #2d3748;
    }
    .option-btn.selected {
      border-color: #3182ce;
      background-color: #ebf8ff;
      color: #2b6cb0;
      font-weight: 600;
    }
    .option-btn.correct {
      border-color: #48bb78;
      background-color: #f0fdf4;
      color: #22543d;
      font-weight: 600;
    }
    .option-btn.incorrect {
      border-color: #f56565;
      background-color: #fff5f5;
      color: #742a2a;
    }
    .feedback-text {
      font-weight: 600;
      margin: 5px 0;
      font-size: 0.95rem;
    }
    .feedback-text.correct { color: #2f855a; }
    .feedback-text.incorrect { color: #c53030; }
    /* Completion Screen */
    .complete-card {
      text-align: center;
      padding: 30px 20px;
      background-color: #ffffff;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .complete-icon {
      font-size: 3rem;
      margin-bottom: 10px;
    }
    .complete-card h2 {
      margin: 0 0 10px 0;
      color: #2d3748;
    }
    .complete-card p {
      color: #4a5568;
      font-size: 0.95rem;
      line-height: 1.4;
      margin: 0 0 20px 0;
    }
  </style>
</head>
<body>

  <header>
    <h1>Social Steps</h1>
    <p>A calm space to learn and practice everyday conversations.</p>
  </header>

  <main>
    <!-- SCREEN 1: PATHWAY -->
    <div id="screen-pathway" class="screen active">
      <div class="level-card level-1">
        <h2 class="level-title">Level 1: Everyday Greetings</h2>
        <p class="level-desc">Learn basic ways to say hello and start a conversation comfortably.</p>
        <button class="lesson-btn" id="btn-lesson-1" onclick="startLesson(0)">
          <span id="label-lesson-1">Saying Hello</span>
          <span style="color:#3182ce;" id="status-lesson-1">Start →</span>
        </button>
      </div>

      <div class="level-card level-2">
        <h2 class="level-title">Level 2: Asking for a Break</h2>
        <p class="level-desc">Learn clear ways to advocate for your needs when feeling overwhelmed.</p>
        <button class="lesson-btn" id="btn-lesson-2" onclick="startLesson(1)">
          <span id="label-lesson-2">Requesting a Break</span>
          <span style="color:#3182ce;" id="status-lesson-2">Start →</span>
        </button>
      </div>
    </div>

    <!-- SCREEN 2: PHRASE STUDY -->
    <div id="screen-lesson" class="screen">
      <div class="card">
        <div class="progress-bar-bg">
          <div id="lesson-progress" class="progress-bar-active"></div>
        </div>
        <div class="card-header">
          <button class="back-btn" onclick="showScreen('pathway')">← Quit Lesson</button>
          <span id="step-indicator" class="step-text"></span>
        </div>
        <div class="phrase-display">
          <h2 id="phrase-text" class="phrase-text">""</h2>
          <button class="speak-btn" onclick="speakCurrentPhrase()">🔊 Listen to Phrase</button>
        </div>
        <div class="info-box context">
          <strong>When to use:</strong>
          <p id="context-text"></p>
        </div>
        <div class="info-box hint">
          <strong>Helpful Hint:</strong>
          <p id="hint-text"></p>
        </div>
        <button class="primary-btn" onclick="handleNextPhrase()">Next Step →</button>
      </div>
    </div>

    <!-- SCREEN 3: QUIZ -->
    <div id="screen-quiz" class="screen">
      <div class="card">
        <div class="progress-bar-bg">
          <div class="progress-bar-active" style="width: 90%;"></div>
        </div>
        <div class="card-header">
          <button class="back-btn" onclick="showScreen('pathway')">← Quit Lesson</button>
          <span class="step-text">Check Your Understanding</span>
        </div>
        <h3 id="quiz-question" style="margin: 5px 0 10px 0; font-size:1.1rem; line-height: 1.4;"></h3>
        <div id="quiz-options"></div>
        <div id="quiz-feedback" style="display:none; flex-direction:column; gap:10px;">
          <p id="feedback-message" class="feedback-text"></p>
          <button class="primary-btn" id="quiz-next-btn" onclick="finishLesson()">Finish Lesson 🎉</button>
        </div>
        <button class="primary-btn" id="quiz-check-btn" onclick="checkAnswer()" disabled>Check Answer</button>
      </div>
    </div>

    <!-- SCREEN 4: COMPLETE -->
    <div id="screen-complete" class="screen">
      <div class="complete-card">
        <div class="complete-icon">🌟</div>
        <h2 id="complete-title">Great Job!</h2>
        <p id="complete-message"></p>
        <button class="primary-btn" onclick="showScreen('pathway')">Back to Pathway</button>
      </div>
    </div>
  </main>

  <script>
    // Data Database
    const DATA = [
      {
        id: 'saying-hello',
        title: 'Saying Hello',
        phrases: [
          {
            text: "Hello, how are you?",
            context: "Use this to greet someone you know or are meeting for the first time.",
            hint: "Try to make brief eye contact if comfortable, or look near their forehead."
          },
          {
            text: "I am doing well, thank you. How are you?",
            context: "Use this when someone asks how you are doing. It is polite to ask them back.",
            hint: "Keep your tone friendly and calm."
          }
        ],
        quiz: {
          question: "Someone walks up to you and says, 'Hello, how are you?' What is a polite way to reply?",
          options: [
            "I don't want to talk.",
            "I am doing well, thank you. How are you?",
            "Goodbye."
          ],
          correct: "I am doing well, thank you. How are you?"
        }
      },
      {
        id: 'needing-space',
        title: 'Requesting a Break',
        phrases: [
          {
            text: "I need to take a short break, please.",
            context: "Use this in school, work, or social situations when the environment feels too loud or busy.",
            hint: "You can say this calmly and step away to a quieter area."
          },
          {
            text: "I am feeling a bit overwhelmed. I will be back in a few minutes.",
            context: "Use this to explain why you are stepping away so others understand.",
            hint: "This helps prevent people from worrying about you."
          }
        ],
        quiz: {
          question: "If a room becomes too noisy or bright, what is a helpful phrase to use?",
          options: [
            "I need to take a short break, please.",
            "Please turn off all the lights right now.",
            "You are being too loud."
          ],
          correct: "I need to take a short break, please."
        }
      }
    ];

    // State Variables
    let currentLessonIdx = 0;
    let currentPhraseIdx = 0;
    let selectedOption = null;
    const completedLessons = {};

    // Navigation Helper
    function showScreen(screenId) {
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      document.getElementById('screen-' + screenId).classList.add('active');
    }

    // Text to Speech
    function speakCurrentPhrase() {
      const phrase = DATA[currentLessonIdx].phrases[currentPhraseIdx].text;
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.rate = 0.8; // Calming, slightly slower rate
        window.speechSynthesis.speak(utterance);
      }
    }

    // Lesson Setup
    function startLesson(idx) {
      currentLessonIdx = idx;
      currentPhraseIdx = 0;
      loadPhrase();
      showScreen('lesson');
    }

    function loadPhrase() {
      const lesson = DATA[currentLessonIdx];
      const phrase = lesson.phrases[currentPhraseIdx];
      
      document.getElementById('phrase-text').textContent = `"${phrase.text}"`;
      document.getElementById('context-text').textContent = phrase.context;
      document.getElementById('hint-text').textContent = phrase.hint;
      document.getElementById('step-indicator').textContent = `Phrase ${currentPhraseIdx + 1} of ${lesson.phrases.length}`;
      
      const progressPercent = ((currentPhraseIdx + 1) / (lesson.phrases.length + 1)) * 100;
      document.getElementById('lesson-progress').style.width = progressPercent + '%';
    }

    function handleNextPhrase() {
      const lesson = DATA[currentLessonIdx];
      if (currentPhraseIdx < lesson.phrases.length - 1) {
        currentPhraseIdx++;
        loadPhrase();
      } else {
        setupQuiz();
      }
    }

    // Quiz Setup
    function setupQuiz() {
      const quiz = DATA[currentLessonIdx].quiz;
      document.getElementById('quiz-question').textContent = quiz.question;
      
      const optionsContainer = document.getElementById('quiz-options');
      optionsContainer.innerHTML = '';
      selectedOption = null;
      
      // Hide Feedback, Show Check Button
      document.getElementById('quiz-feedback').style.display = 'none';
      document.getElementById('quiz-check-btn').style.display = 'block';
      document.getElementById('quiz-check-btn').disabled = true;

      quiz.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.onclick = () => selectOption(btn, opt);
        optionsContainer.appendChild(btn);
      });
      
      showScreen('quiz');
    }

    function selectOption(buttonElement, optionText) {
      document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
      buttonElement.classList.add('selected');
      selectedOption = optionText;
      document.getElementById('quiz-check-btn').disabled = false;
    }

    function checkAnswer() {
      const quiz = DATA[currentLessonIdx].quiz;
      const isCorrect = selectedOption === quiz.correct;
      
      document.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === quiz.correct) {
          btn.classList.add('correct');
        } else if (btn.textContent === selectedOption) {
          btn.classList.add('incorrect');
        }
      });

      const feedbackMsg = document.getElementById('feedback-message');
      if (isCorrect) {
        feedbackMsg.textContent = "Good choice! That is a safe and helpful response.";
        feedbackMsg.className = "feedback-text correct";
      } else {
        feedbackMsg.textContent = `Not quite. The expected choice is: "${quiz.correct}"`;
        feedbackMsg.className = "feedback-text incorrect";
      }

      document.getElementById('quiz-check-btn').style.display = 'none';
      document.getElementById('quiz-feedback').style.display = 'flex';
    }

    // Completion Setup
    function finishLesson() {
      const lesson = DATA[currentLessonIdx];
      completedLessons[lesson.id] = true;
      
      // Update main pathway screen state visually
      const btnId = `btn-lesson-${currentLessonIdx + 1}`;
      const statusId = `status-lesson-${currentLessonIdx + 1}`;
      
      document.getElementById(btnId).classList.add('completed');
      document.getElementById(statusId).textContent = "✓ Finished";
      document.getElementById(statusId).style.color = "#15803d";

      document.getElementById('complete-title').textContent = "Great Job!";
      document.getElementById('complete-message').innerHTML = `You have successfully completed the <strong>${lesson.title}</strong> lesson. Keep practicing!`;

      showScreen('complete');
    }
  </script>
</body>
</html>
