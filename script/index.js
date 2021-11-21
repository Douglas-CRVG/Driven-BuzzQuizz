const URL_API = "https://mock-api.driven.com.br/api/v4/buzzquizz";
const main = document.querySelector("main");
let createQuiz = {};
let answers = [];
let count = 0;
let countCorrect = 0; // zerar
let qntQuestions; // zerar
let numberQuestions; // zerar
let levelsQuiz; //zerar
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
                ${renderQuiz(allQuizzes)}
            </div>
        </section>
    `;
}

function renderQuiz(props) {
    let html = "";
    props.map(prop => {
        const {
            image,
            title,
            id
        } = prop;
    
        html += `
            <div id=${id} class="quiz"  style="background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 65.1%, #000000 100%), url(${image})" onclick="getQuiz(this);">
                <p>${title}</p>
            </div>
        `;
    });
    return html;
}

// Tela 1
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

// Tela 2
function renderCreateQuiz2(number, obj) {
    main.innerHTML = `
    <section class="register-quiz">
        <p>Crie suas perguntas</p>

        ${renderQuestions(number == undefined ? 1 : number, obj)}
        
        <button onclick="renderCreateQuiz3();">Prosseguir pra criar níveis</button>
    </section>
    `;
}

function validationQuiz2(element) {
    err = false;
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
    validationAnswers(inputs, errors);

    question = {
        title: inputQuestion.value,
        color: inputColor.value,
        answers
    }

    createQuiz["questions"].push(question);

    if (!err) {
        renderCreateQuiz2(element.id);
    }

}

function renderQuestions(x, obj) {
    let forms = '';

    for (let i = 1; i <= amountQuestion; i++) {
        if (i == x) {
            forms += form(x, obj);
        } else {
            forms += formClosed(1, i)
        }
    }

    return forms;
}

function validationAnswers(inputs, errors) {
    count = 0;
    answers = [];
    err = false;

    //resposta correta
    let spanCorrect = errors[4];
    let inputCorrect = inputs[2];
    // function resposta não pode estar vazia obrigatoriamente preenchida

    validationCorrectAnswer(inputCorrect, spanCorrect);

    //Validando URL com regex resposta correta
    let spanUrl = errors[5];
    let inputUrl = inputs[3];

    validationUrl(inputUrl, spanUrl);

    invalidationAnswers(inputs[4], inputs[5], errors[7]);

    invalidationAnswers(inputs[6], inputs[7], errors[8]);

    invalidationAnswers(inputs[8], inputs[9], errors[9]);

    answers.push({
        text: inputCorrect.value,
        image: inputUrl.value,
        isCorrectAnswer: true
    })

    if (err || count == 0) {
        answers = [];
        err = true;
    }

    if (count == 0) {
        alert('Informe no mínimo uma resposta errada.')
    }
}

function invalidationAnswers(inputText, inputUrl, span) {
    if ((inputText.value != '' && inputUrl.value == '') || (inputText.value == '' && inputUrl.value != '')) {
        span.innerHTML = 'Para a resposta ser válida preencha os dois campos.';
        err = showError(inputText.parentNode, span);
    } else {
        hiddenError(inputText.parentNode, span);

        if (inputText.value != '') {
            validationUrl(inputUrl, span);

            if (!err) {
                answers.push({
                    text: inputText.value,
                    image: inputUrl.value,
                    isCorrectAnswer: false
                });

                count++;
            }
        } else {
            hiddenError(inputUrl, span);
        }
    }
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
function form(number, obj) {
    return `
    <div class="form">
        <div>
            <span>Pergunta ${number}</span>
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
                <input type="text" placeholder="URL da imagem" />
                <span></span>
            </div>

            <div>
                <input type="text" placeholder="Resposta incorreta" />
                <input type="text" placeholder="URL da imagem" />
                <span></span>
            </div>

            <div>
                <input type="text" placeholder="Resposta incorreta" />
                <input type="text" placeholder="URL da imagem" />
                <span></span>
            </div>
        </div>
    </div>
    `
}

function formClosed(flag, count) {
    return `
        <div class="closed" onclick="validationQuiz2(this)" id=${count}>
            <span>${flag === 1 ? `Pergunta ${count}` : `Nível ${count}`}</span>
            <img src="img/pencil.png" />
        </div>
    `;
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
    input.classList.add('border-error', 'fade-in');
    span.classList.add('span-error', 'fade-in');

    return true;
}

function hiddenError(input, span) {
    span.innerHTML = '';
    input.classList.remove('border-error', 'fade-in');

    return false;
}

function getQuiz(element){
    axios.get(`${URL_API}/quizzes/${element.id}`).then(quizPage)
}

function quizPage(props) {
    const {
        id,
        image,
        levels,
        questions,
        title
    } = props.data;

    qntQuestions = questions.length;
    numberQuestions = qntQuestions;
    levelsQuiz = levels;

    main.innerHTML = `
        <section class="open-quiz">
            <div id="${id}" class="title" style="background: linear-gradient(0deg, rgba(0, 0, 0, 0.57), rgba(0, 0, 0, 0.57)), url(${image});">
                <p>${title}</p>
            </div>
            <div class="container-questions">
                ${question(questions)}
            </div>
        </section>
    `;

    document.querySelector(".title").scrollIntoView();
}

function comparador() { 
	return Math.random() - 0.5; 
}

function question (props) {
    let html = "";

    props.map(prop =>{
        const {
            answers,
            color,
            title
        } = prop;
    
        answers.sort(comparador);
    
        html += `
        <div class="question">
            <div class="title-question" style="background-color: ${color}">
                    <p>${title}</p>
            </div>
            <div class="container-answers">
                ${answer(answers)}
            </div>
        </div>
        `;
    });
    return html;    
}

function answer(props){
    let html = "";
    props.map(prop => {
        const {
            image,
            isCorrectAnswer,
            text
        } = prop;
        
        html += `
        <div id ="${isCorrectAnswer}" class="answers" onclick="reply(this)">
            <img src="${image}" alt="${text}">
            <p>${text}</p>
        </div>
        `;
    });
    return html;
}

function reply(element){
    const {
        id,
        parentNode,
    } = element;

    for(let i = 0; i < parentNode.childElementCount; i++ ){
        let checked = parentNode.children[i];
        
        checked.classList.add("block", `${checked.id}`);

        if(checked !== element){
            checked.classList.add("opacity");
        }
    }
    
    if(id === "true"){
        countCorrect++;        
    }
    
    qntQuestions--;

    setTimeout(scrollNext, 2000, element);
}

function scrollNext(element){
    let nextQuestion = element.parentNode.parentNode.nextElementSibling;

    if(qntQuestions === 0){
        levelQuiz();
        document.querySelector(".level-quiz").scrollIntoView();                
    } else {
        nextQuestion.scrollIntoView();
    }
}

function levelQuiz(){
    let successPercent = ((countCorrect/numberQuestions)*100);
    let levelCorrect;
    
    for(let i = 0; i < levelsQuiz.length; i++){
        let level = levelsQuiz[i];
        if(level.minValue <= successPercent){
            levelCorrect = level;            
        }
    }

    const {
        image,
        text,
        title
    } = levelCorrect;

    const section = document.querySelector(".open-quiz");
    
    section.innerHTML +=`
    <div class="level-quiz">
        <div class="title-level-quiz">
            <p>${successPercent.toFixed(0)}% de acerto: ${title}</p>
        </div>
        <div class="description-level-quiz">
            <img src="${image}" alt="${text}">
            <p>${text}</p>
        </div>
    </div>
    `;
}