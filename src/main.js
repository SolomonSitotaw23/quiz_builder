import './style.css';

const iframe = document.getElementById('preview');
const buildBtn = document.getElementById('buildQuiz');
const addQBtn = document.getElementById('addQuestion');
const questionList = document.getElementById('questionList');

// Utility: Create a new question UI block
function createQuestionBlock(index) {
  const wrapper = document.createElement('div');
  wrapper.className = 'p-4 border rounded bg-white shadow-sm';
  wrapper.innerHTML = `
    <label class="block font-semibold mb-1">Question ${index + 1}</label>
    <input type="text" class="question-text w-full p-2 border rounded mb-2" placeholder="Question text" />

    <div class="space-y-2">
      ${[0, 1, 2, 3]
        .map(
          (i) => `
        <div>
          <input type="radio" name="correct-${index}" value="${i}" class="mr-2">
          <input type="text" class="option w-3/4 p-1 border rounded" placeholder="Option ${
            i + 1
          }" />
        </div>
      `
        )
        .join('')}
    </div>
  `;
  return wrapper;
}

// Add new question
addQBtn.addEventListener('click', () => {
  const count = questionList.children.length;
  const block = createQuestionBlock(count);
  questionList.appendChild(block);
});

// Build and send config
buildBtn.addEventListener('click', () => {
  const title = document.getElementById('quizTitle').value;
  const theme = document.getElementById('quizTheme').value;

  const questions = [];
  let hasError = false;

  Array.from(questionList.children).forEach((block, qIndex) => {
    // Clear previous error
    const existingError = block.querySelector('.error-message');
    if (existingError) existingError.remove();

    const questionText = block.querySelector('.question-text').value.trim();
    const optionInputs = block.querySelectorAll('.option');
    const options = Array.from(optionInputs).map((opt) => opt.value.trim());
    const correctRadio = block.querySelector(
      `input[name="correct-${qIndex}"]:checked`
    );
    const answer = correctRadio ? parseInt(correctRadio.value) : -1;

    const showError = (msg) => {
      const error = document.createElement('p');
      error.className = 'error-message text-red-600 mt-2 text-sm';
      error.textContent = msg;
      block.appendChild(error);
    };

    if (!questionText) {
      showError(`Question ${qIndex + 1} is missing text.`);
      hasError = true;
      return;
    }

    if (options.some((opt) => !opt)) {
      showError(`Question ${qIndex + 1} has an empty option.`);
      hasError = true;
      return;
    }

    if (answer === -1) {
      showError(`Please select a correct answer for Question ${qIndex + 1}.`);
      hasError = true;
      return;
    }

    questions.push({ question: questionText, options, answer });
  });

  if (hasError) return;

  const config = { title, theme, questions };

  const textarea = document.getElementById('config');
  if (textarea) {
    textarea.value = JSON.stringify(config, null, 2);
  }

  iframe.contentWindow.postMessage(config, '*');
});
