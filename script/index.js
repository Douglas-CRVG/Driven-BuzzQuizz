const URL_API = "https://mock-api.driven.com.br/api/v4/buzzquizz";
const main = document.querySelector("main");
let createQuiz = {};
let answers = [];
let count = 0;
let countCorrect = 0;
let qntQuestions;
let numberQuestions;
let levelsQuiz;
let currentId;
let currentQuizId;
let err = false;
let itemForm = [];
let vw;
let amountQuestion;
let amountLevel;
let levelUserQuiz = [];
let myQuiz;

getQuizzes()
function getQuizzes() {
    axios.get(`${URL_API}/quizzes`).then(renderHome);
}

// div.user-quiz ainda será fraciona a uma função a parte, mas só acontecerá após a parte de o usuário criar seu próprio quiz
function renderHome(props) {
    window.scrollTo(0, 0);
    const allQuizzes = props.data;
    
    let quizzesAll;
    let listMyQuizzes = [];
    let list = JSON.parse(localStorage.getItem('myQuiz'));

    if (list.length > 0) {

        quizzesAll = allQuizzes.filter(quiz =>{
            let count = 0;
            for(let i=0; i<list.length; i++){
                
                if(quiz.id === list[i].id){
                    count++;
                }
            }

            if (count === 0){
                return quiz
            } else {
                listMyQuizzes.push(quiz)
            }
        })
       
        console.log(quizzesAll);
        console.log(listMyQuizzes);
    }
    
    main.innerHTML = `
        <section class="quiz-list">
            ${renderMyQuizzes(listMyQuizzes)}          
            <br />
            <h1>Todos os Quizzes</h1>
            <div class="all-quizzes">
                ${renderQuiz(quizzesAll === undefined? allQuizzes : quizzesAll)}
            </div >
        </section >
        `;
}

function renderMyQuizzes(quiz) {

    if (quiz.length <= []) {
        return `
            <div class="user-quiz">
                <div>
                    <p>Você não criou nenhum quizz ainda :(</p>
                    <button onclick="renderCreateQuiz()">Criar Quizz</button>
                </div>
            </div>
        `
    } else {
        return `
            <div class="my-quizzes">
                <h1>Seus Quizzes</h1>
                <ion-icon name="add-circle" onclick="renderCreateQuiz()"></ion-icon>
            </div>

            <div class="all-quizzes">
                ${renderQuiz(quiz)}
             </div>
        `
    }
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
        <div id = ${id} class="quiz"  style = "background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 65.1%, #000000 100%), url(${image})" onclick="getQuiz(this);" >
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
function renderCreateQuiz2(number) {
    main.innerHTML = `
        <section class="register-quiz">
            <p>Crie suas perguntas</p>

        ${renderQuestions(number == undefined ? 1 : number, amountQuestion, 1)}

    <button onclick="validationQuiz2(this);">Prosseguir pra criar níveis</button>
    </section>
        `;
}

function checkFormConfirmation(element) {
    itemsForm = []

    if (element.localName == 'button') {
        itemsForm.push(element.parentNode.querySelectorAll(".form input"));
        itemsForm.push(element.parentNode.querySelectorAll(".form span"));
    } else {
        itemsForm.push(document.querySelectorAll('.form input'))
        itemsForm.push(document.querySelectorAll('.form span'));
    }
}

function validationQuiz2(element) {
    err = false;

    // Verifica se o elemento clicado é um button
    checkFormConfirmation(element);

    let inputs = itemsForm[0];
    let errors = itemsForm[1];

    //validação das respostas
    validationAnswers(inputs, errors);

    if (!err) {
        if (element.localName == 'button') {
            if (createQuiz.questions.length < 2) {
                alert('Você precisa de no mínimo 3 questões cadastradas para ir para a próxima etapa.')

            } else {
                question = {
                    title: inputs[0].value,
                    color: inputs[1].value,
                    answers
                }
                createQuiz["questions"].push(question);
                renderCreateQuiz3();

            }
        } else {
            // Se clicar no button ele vai pra prox page se não ele abre o form que esta fechado.
            question = {
                title: inputs[0].value,
                color: inputs[1].value,
                answers
            }
            createQuiz["questions"].push(question);
            renderCreateQuiz2(element.id);

        }
    }

    console.log(createQuiz)
}

function renderQuestions(x, amount, flag) {
    let forms = '';

    for (let i = 1; i <= amount; i++) {
        if (i == x) {
            forms += flag == 1 ? form(x) : formLevel(x)
        } else {
            forms += formClosed(flag, i)
        }
    }

    return forms;
}

function validationAnswers(inputs, errors) {
    count = 0;
    answers = [];
    err = false;

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

    // Verifica se tem 0 respostas erradas
    if (count == 0) {
        alert('Informe no mínimo uma resposta errada.')
        answers = [];
        err = true;
    }

    // Verifica se tem erro em algum input
    if (err) {
        answers = [];
        err = true;
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
            count++;

            if (!err) {
                answers.push({
                    text: inputText.value,
                    image: inputUrl.value,
                    isCorrectAnswer: false
                });
            }
        } else {
            hiddenError(inputUrl, span);
        }
    }
}

// Tela 3
function renderCreateQuiz3(number) {
    getScreenWidth();

    main.innerHTML = `
        <section class="register-quiz">
            <p>Agora, decida os níveis</p>

        ${renderQuestions(number === undefined ? 1 : number, amountLevel, 2)}

    <button onclick="validationLevelUser(this);">Finalizar Quizz</button>
    </section >
        `;

    main.scrollIntoView();
}

function formLevel(x) {
    return `
        <div class="form">
            <div>
                <span>Nível ${x}</span>
                <input type="text" placeholder="Título do nível" />
                <span></span>
                <input type="number" placeholder="% de acerto mínima" min="0" max="100" />
                <span></span>
                <input type="text" placeholder="URL da imagem do nível" />
                <span></span>
                ${renderInputOrTextArea()}
                <span></span>
            </div>
    </div >
        `;
}

function validationLevelTitle(input, span) {
    if (input.value.split('').length < 10) {
        span.innerHTML = 'Mínimo de 10 caracteres';
        err = showError(input, span);
    } else {
        hiddenError(input, span);
    }
}

function validationMinValue(input, span) {
    if (!(input.value >= 0 && input.value <= 100) || input.value === "") {
        span.innerHTML = 'A porcentagem de acerto deve ser um número entre 0 e 100';
        err = showError(input, span);
    } else {
        hiddenError(input, span);
    }
}

function validationDescription(input, span) {
    if (input.value.split('').length < 30) {
        span.innerHTML = 'Mínimo de 30 caracteres';
        err = showError(input, span);
    } else {
        hiddenError(input, span);
    }
}

function validationLevelUser(element) {
    err = false;
    let percents = [];

    // Verifica se o elemento clicado é um button
    checkFormConfirmation(element);

    let inputs = itemsForm[0];
    let errors = itemsForm[1];

    let inputTitle = inputs[0];
    let spanTitle = errors[1];

    //verifica tamanho do título do nível
    validationLevelTitle(inputTitle, spanTitle);

    let inputPercent = inputs[1];
    let spanPercent = errors[2];

    //verifica percentual de acerto
    validationMinValue(inputPercent, spanPercent);

    let inputUrl = inputs[2];
    let spanUrl = errors[3];

    //verifica URL
    validationUrl(inputUrl, spanUrl);

    let inputDescription = document.querySelector("#description");
    let spanDescription = errors[4];

    validationDescription(inputDescription, spanDescription);

    if (!err) {
        if (element.localName == 'button') {
            if (createQuiz.levels.length < 1) {
                alert('Você precisa de no mínimo 2 níveis cadastrados para concluir o quiz.')

            } else {
                // Verifica se tem algum percentual 0 
                if ((createQuiz.levels.filter(level => level.minValue == 0).length > 0) || inputPercent.value == 0) {
                    level = {
                        title: inputTitle.value,
                        image: inputUrl.value,
                        text: inputDescription.value,
                        minValue: inputPercent.value
                    };

                    createQuiz["levels"].push(level);
                    renderCreateQuiz4();

                } else {
                    alert('Deve ter pelo menos um percentual com valor 0');
                }
            }

        } else {
            level = {
                title: inputTitle.value,
                image: inputUrl.value,
                text: inputDescription.value,
                minValue: inputPercent.value
            };

            createQuiz["levels"].push(level);
            renderCreateQuiz3(element.id);
        }
        console.log(createQuiz)
    }
}

// Tela 4
function renderCreateQuiz4() {
    postQuizUser();

    main.innerHTML = `
        <div class="loading">
            <img src="img/loading.png" />
            <p>Carregando</p>
        </div>
    `

    setTimeout(function () {
        main.innerHTML = `
        <section class="register-quiz">
            <p>Seu quizz está pronto!</p>
            <div class="quizz-image-sucess">
                <img src="${myQuiz.image}" />
                <p>${myQuiz.title}</p>
            </div>
            
            <button class="button-create-quiz" onclick="getQuiz(this)" id=${myQuiz.id}>Acessar Quizz</button>
            <span class="link-back-home" onclick="getQuizzes()">Voltar pra home</span>
        </section>
        `;

        document.querySelector("header").scrollIntoView();
    }, 2000);

}

// Formularios
function form(number) {
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
        <div class="closed" onclick = "${flag === 1 ? `validationQuiz2(this)` : `validationLevelUser(this)`}" id = ${count}>
            <span>${flag === 1 ? `Pergunta ${count}` : `Nível ${count}`}</span>
            <img src="img/pencil.png" />
        </div>
        `;
}

function renderInputOrTextArea() {
    if (vw <= 375) {
        return `<textarea id = "description" placeholder = "Descrição do nível"></textarea> `
    } else {
        return `<input id = "description" type = "text" placeholder = "Descrição do nível" /> `
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

function getQuiz(element) {
    axios.get(`${URL_API}/quizzes/${element.id} `).then(quizPage)
}

function postQuizUser() {
    axios.post(URL_API + "/quizzes", createQuiz).then((props) => {

        myQuiz = {
            id: props.data.id,
            key: props.data.key,
            title: props.data.title,
            image: props.data.image
        }
        submit(myQuiz)
    });
}

function submit(obj) {
    let abc = [];
    let dataLS = JSON.parse(localStorage.getItem('myQuiz'));
    if (dataLS !== null && dataLS != {}) {
        dataLS.map(item => abc.push(item))
    }

    abc.push(obj);
    localStorage.setItem('myQuiz', JSON.stringify(abc));

    console.log(JSON.stringify(abc));
    console.log('getItem: ', dataLS);
}

function quizPage(props) {
    console.log(props.data.questions);
    const {
        id,
        image,
        levels,
        questions,
        title
    } = props.data;

    qntQuestions = questions.length;
    numberQuestions = questions.length;
    levelsQuiz = levels;
    currentId = id;

    main.innerHTML = `
        <section class="open-quiz">
            <div class="title" style="background: linear-gradient(0deg, rgba(0, 0, 0, 0.57), rgba(0, 0, 0, 0.57)), url(${image});">
                <p>${title}</p>
            </div>
            <div class="container-questions">
                ${questionQuiz(questions)}
            </div>
        </section>
        `;

    window.scrollTo(0, 0);
}

function comparador() {
    return Math.random() - 0.5;
}

function questionQuiz(props) {
    let html = "";

    props.map(prop => {
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

function answer(props) {
    let html = "";
    props.map(prop => {
        const {
            image,
            isCorrectAnswer,
            text
        } = prop;

        html += `
        <div id = "${isCorrectAnswer}" class="answers" onclick="reply(this)">
            <img src="${image}" alt="${text}">
                <p>${text}</p>
        </div>
        `;
    });
    return html;
}

function reply(element) {
    const {
        id,
        parentNode,
    } = element;

    for (let i = 0; i < parentNode.childElementCount; i++) {
        let checked = parentNode.children[i];

        checked.classList.add("block", `${checked.id}`);

        if (checked !== element) {
            checked.classList.add("opacity");
        }
    }

    if (id === "true") {
        countCorrect++;
    }

    qntQuestions--;

    setTimeout(scrollNext, 2000, element);
}

function scrollNext(element) {
    let nextQuestion = element.parentNode.parentNode.nextElementSibling;

    if (qntQuestions === 0) {
        levelQuiz();
        document.querySelector(".level-quiz").scrollIntoView();
        currentQuizId = currentId;
        resetQuiz();
    } else {
        nextQuestion.scrollIntoView();
    }
}

function levelQuiz() {
    let successPercent = ((countCorrect / numberQuestions) * 100);
    let levelCorrect;

    for (let i = 0; i < levelsQuiz.length; i++) {
        let level = levelsQuiz[i];
        if (level.minValue <= successPercent) {
            levelCorrect = level;
        }
    }

    const {
        image,
        text,
        title
    } = levelCorrect;

    const section = document.querySelector(".open-quiz");

    section.innerHTML += `
        <div class="level-quiz">
        <div class="title-level-quiz">
            <p>${successPercent.toFixed(0)}% de acerto: ${title}</p>
        </div>
        <div class="description-level-quiz">
            <img src="${image}" alt="${text}">
            <p>${text}</p>
        </div>
    </div>
        <div class="finish-quiz">
            <button onclick="restartQuiz()">Reiniciar Quizz</button>
            <button onclick="getQuizzes()">Voltar pra home</button>
        </div>
    `;
}

function restartQuiz() {
    let quiz = {
        id: currentQuizId
    };
    getQuiz(quiz)
}

function resetQuiz() {
    countCorrect = 0;
    qntQuestions = undefined;
    numberQuestions = undefined;
    levelsQuiz = undefined;
    currentId = undefined;
}