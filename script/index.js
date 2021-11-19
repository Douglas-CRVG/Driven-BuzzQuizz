const URL_API = "https://mock-api.driven.com.br/api/v4/buzzquizz";
const main = document.querySelector("main");
let createQuiz = {};

let err = false;
let vw;
let amountQuestion;
let amountLevel;

getQuizzes()
function getQuizzes() {
    axios.get(`${URL_API}/quizzes`).then(renderHome);
}

// div.user-quiz ainda será fraciona a uma função a parte, mas só acontecerá após a parte de o usuário criar seu próprio quiz
function renderHome(props) {
    const allQuizzes = props.data;

    main.innerHTML = `
        <section class="quiz-list">
            <div class="user-quiz">
                <p>Você não criou nenhum quizz ainda :(</p>
                <button onclick="renderCreateQuiz();">Criar Quizz</button>
            </div>
            <h1>Todos os Quizzes</h1>
            <div class="all-quizzes">
                ${items(allQuizzes)}
            </div>
        </section>
    `;
}

function items(allQuizzes) {
    let item = "";
    for (let i = 0; i < allQuizzes.length; i++) {
        item += renderQuiz(allQuizzes[i])
    }

    return item;
}

function renderQuiz(props) {
    const {
        image,
        title,
        id
    } = props;

    return `
        <div id=${id} class="quiz"  style="background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 65.1%, #000000 100%), url(${image})" onclick="quizPage(this);">
            <p>${title}</p>
        </div>
    `;
}

function renderCreateQuiz() {
    main.innerHTML = `
    <section class="register-quiz">
        <p>Comece pelo começo</p>
        <div class="form">
            <input type="text" name="title" placeholder="Título do seu quizz" />
            <span></span>
            <input type="text" name="url" placeholder="URL da imagem do seu quizz" />
            <span></span>
            <input type="number" name="amountQuestion" placeholder="Quantidade de perguntas do quizz" />
            <span></span>
            <input type="number" name="amountLevel" placeholder="Quantidade de niveis do quizz" />
            <span></span>
        </div>
        <button onclick="validationQuiz();">Prosseguir pra criar perguntas</button>
    </section>    
    `;
}

function validationQuiz() {
    err = false;
    let inputs = document.querySelectorAll('.register-quiz .form input');
    let errors = inputs[0].parentNode.querySelectorAll('span');

    //Validando o title
    let spanTitle = errors[0];
    let inputTitle = inputs[0];

    validationTitle(inputTitle, spanTitle);

    //Validando URL com regex
    let spanUrl = errors[1];
    let inputUrl = inputs[1];

    validationUrl(inputUrl, spanUrl);

    //Validando quantidade de perguntas
    amountQuestion = document.querySelector('.register-quiz .form input[name="amountQuestion"]').value;

    let spanQuestions = errors[2];
    let inputQuestions = inputs[2];

    validationQuestions(inputQuestions, spanQuestions);

    // Validando quantidade de niveis
    amountLevel = document.querySelector('.register-quiz .form input[name="amountLevel"]').value;

    let spanLevels = errors[3];
    let inputLevels = inputs[3];

    validationLevel(inputLevels, spanLevels);

    if (!err) {
        createQuiz = {
            title: inputTitle.value,
            image: inputUrl.value,
            questions: [],
            levels: [],
        }

        renderCreateQuiz2();
    }
}

function renderCreateQuiz2() {
    main.innerHTML = `
    <section class="register-quiz">
        <p>Crie suas perguntas</p>

        ${form()}

        ${formClosed(1, amountQuestion)}
        
        <button onclick="renderCreateQuiz3();">Prosseguir pra criar níveis</button>
    </section>
    `;
}

function validationQuiz2() {
    let inputs = document.querySelectorAll('.form input');
    let errors = document.querySelectorAll('.form span');

    //Validando pergunta
    let spanQuestion = errors[1];
    let inputQuestion = inputs[0];

    //function texto de pergunta maior que 19 caracteres
    validationQuestion(inputQuestion, spanQuestion);

    //Cor vem pronta
    let spanColor = errors[2];
    let inputColor = inputs[1];

    //function cor não pode ser #ffffff
    validationColor(inputColor, spanColor);

    //validação das respostas
    answers = validationAnswers(inputs, errors);

    question = {
        title: inputQuestion.value,
        color: inputColor.value,
        answers
    }

    createQuiz["questions"].push(question);

    console.log(question)
    console.log(createQuiz)

}

function validationAnswers(inputs, errors) {
    let answers = [];

    //resposta correta
    let spanCorrect = errors[4];
    let inputCorrect = inputs[2];
    // function resposta não pode estar vazia obrigatoriamente preenchida

    validationCorrectAnswer(inputCorrect, spanCorrect);

    //Validando URL com regex resposta correta
    let spanUrl = errors[5];
    let inputUrl = inputs[3];

    validationUrl(inputUrl, spanUrl);

    answers.push({
        text: inputCorrect.value,
        image: inputUrl.value,
        isCorrectAnswer: true
    });

    //respostas erradas
    let spanIncorrect1 = errors[4];
    let inputIncorrect1 = inputs[4];
    // function resposta não pode estar vazia

    //Validando URL com regex resposta correta
    let spanUrlinc = errors[5];
    let inputUrlinc = inputs[5];

    //validationUrl(inputUrl, spanUrl);

    answers.push({
        text: inputIncorrect1.value,
        image: inputUrlinc.value,
        isCorrectAnswer: false
    });

    console.log(answers)
    return answers;
}

// Tela 3
function renderCreateQuiz3() {
    getScreenWidth();

    main.innerHTML = `
    <section class="register-quiz">
        <p>Agora, decida os níveis</p>

        <div class="form">
            <div>
                <span>Nível 1</span>
                <input type="text" placeholder="Título do nível" />
                <input type="text" placeholder="% de acerto mínima" />
                <input type="text" placeholder="URL da imagem do nível" />
                ${renderInputOrTextArea()}
            </div>
        </div>

        ${formClosed(2, amountLevel)}
        
        <button onclick="renderCreateQuiz4();">Prosseguir pra criar níveis</button>
    </section>
    `;

    main.scrollIntoView();
}

// Tela 4
function renderCreateQuiz4() {
    main.innerHTML = `
    <section class="register-quiz">
        <p>Seu quizz está pronto!</p>
        <div class="quizz-image-sucess">
            <img src="https://revistacarro.com.br/wp-content/uploads/2021/06/Fiat-Pulse_1.jpg" />
            <p>Titulo aqui</p>
        </div>
        
        <button class="button-create-quiz">Acessar Quizz</button>
        <span class="link-back-home" onclick="getQuizzes();">Voltar pra home</span>
    </section>
    `;

    document.querySelector("header").scrollIntoView();
}

// Formularios
function form() {
    return `
    <div class="form">
        <div>
            <span>${'Pergunta 1'}</span>
            <input type="text" placeholder="Texto da pergunta" />
            <span></span>
            <input type="color" placeholder="Cor de fundo da pergunta" />
            <span></span>
        </div>
        <div>
            <span>Resposta correta</span>
            <input type="text" placeholder="Resposta correta" />
            <span></span>
            <input type="text" placeholder="URL da imagem" />
            <span></span>
        </div>
        <div>
            <span>Resposta incorretas</span>

            <div>
                <input type="text" placeholder="Resposta incorreta" />
                <span></span>
                <input type="text" placeholder="URL da imagem" />
                <span></span>
            </div>

            <div>
                <input type="text" placeholder="Resposta incorreta" />
                <span></span>
                <input type="text" placeholder="URL da imagem" />
                <span></span>
            </div>

            <div>
                <input type="text" placeholder="Resposta incorreta" />
                <span></span>
                <input type="text" placeholder="URL da imagem" />
                <span></span>
            </div>
        </div>
    </div>
    `
}

function formClosed(flag, amount) {
    let questions = [];

    for (let i = 1; i < amount; i++) {
        questions += `
        <div class="closed" onclick="validationQuiz2()">
            <span>${flag === 1 ? `Pergunta ${i + 1}` : `Nível ${i + 1}`}</span>
            <img src="img/pencil.png" />
        </div>
    `;
    }

    return questions;
}

function renderInputOrTextArea() {
    if (vw <= 375) {
        return `<textarea placeholder="Descrição do nível"></textarea>`
    } else {
        return `<input type="text" placeholder="Descrição do nível" />`
    }
}

function getScreenWidth() {
    vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
}

// Validacao dos errors
function validationTitle(input, span) {
    if (input.value.split('').length < 19 || input.value.split('').length > 65) {
        span.innerHTML = 'Título inválido';
        err = showError(input, span);
    } else {
        hiddenError(input, span);
    }
}

function validationUrl(input, span) {
    let expression = /([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i;
    let regex = new RegExp(expression);

    if (!input.value.match(regex)) {
        span.innerHTML = 'URL inválida';
        err = showError(input, span);
    } else {
        hiddenError(input, span);
    }
}

function validationQuestions(input, span) {
    if (amountQuestion < 3) {
        span.innerHTML = 'Quantidade de perguntas tem que ser no mínimo três';
        err = showError(input, span);

    } else {
        hiddenError(input, span);
    }
}

function validationLevel(input, span) {
    if (amountLevel < 2) {
        span.innerHTML = 'Quantidade de níveis tem que ser no minímo duas';
        err = showError(input, span);

    } else {
        hiddenError(input, span);
    }
}

function validationQuestion(input, span) {
    if (input.value.split('').length < 20) {
        span.innerHTML = 'A pergunta deve ter no mínimo 20 caracteres';
        err = showError(input, span);
    } else {
        hiddenError(input, span);
    }
}

function validationColor(input, span) {
    if (input.value === "#ffffff") {
        span.innerHTML = 'A cor não pode ser #FFFFFF';
        err = showError(input, span);
    } else {
        hiddenError(input, span);
    }
}

function validationCorrectAnswer(input, span) {
    if (input.value.split('').length == "") {
        span.innerHTML = 'A resposta não pode ficar vazia';
        err = showError(input, span);
    } else {
        hiddenError(input, span);
    }
}

function showError(input, span) {
    input.value = '';
    input.classList.add('border-error', 'fade-in');
    span.classList.add('span-error', 'fade-in');

    return true;
}

function hiddenError(input, span) {
    span.innerHTML = '';
    input.classList.remove('border-error');

    return false;
}

function quizPage(element) {
    main.innerHTML = `
        <p>Essa página ainda não foi construída</p>
        <p>Mas sei que você apertou no no quiz ${element.id}</p>
    `;
}