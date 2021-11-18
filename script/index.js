const URL_API = "https://mock-api.driven.com.br/api/v4/buzzquizz";
const main = document.querySelector("main");
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
    console.log(allQuizzes)

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

function items(allQuizzes){
    let item = "";
    for (let i = 0; i<allQuizzes.length; i++){
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
            <input type="text" name="title"  placeholder="Título do seu quizz" />
            <input type="text" name="url" placeholder="URL da imagem do seu quizz" />
            <input type="text" name="amountQuestion" placeholder="Quantidade de perguntas do quizz" />
            <input type="text" name="amountLevel" placeholder="Quantidade de niveis do quizz" />
        </div>
        <button onclick="renderCreateQuiz2();">Prosseguir pra criar perguntas</button>
    </section>    
    `;
}

function renderCreateQuiz2() {
    getAmounts();

    main.innerHTML = `
    <section class="register-quiz">
        <p>Crie suas perguntas</p>

        ${form()}

        ${formClosed(1, amountQuestion)}
        
        <button onclick="renderCreateQuiz3();">Prosseguir pra criar níveis</button>
    </section>
    `;
}

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

function form() {
    return `
    <div class="form">
        <div>
            <span>${'Pergunta 1'}</span>
            <input type="text" placeholder="Texto da pergunta" />
            <input type="text" placeholder="Cor de fundo da pergunta" />
        </div>
        <div>
            <span>Resposta correta</span>
            <input type="text" placeholder="Resposta correta" />
            <input type="text" placeholder="URL da imagem" />
        </div>
        <div>
            <span>Resposta incorretas</span>

            <div>
                <input type="text" placeholder="Resposta incorreta" />
                <input type="text" placeholder="URL da imagem" />
            </div>

            <div>
                <input type="text" placeholder="Resposta incorreta" />
                <input type="text" placeholder="URL da imagem" />
            </div>

            <div>
                <input type="text" placeholder="Resposta incorreta" />
                <input type="text" placeholder="URL da imagem" />
            </div>
        </div>
    </div>
    `
}

function formClosed(flag, amount) {
    let questions = [];

    for (let i = 1; i < amount; i++) {
        questions += `
        <div class="closed" onclick="alert(this)">
            <span>${flag === 1 ? `Pergunta ${i + 1}` : `Nível ${i + 1}`}</span>
            <img src="img/pencil.png" />
        </div>
    `;
    }

    return questions;
}

function getAmounts() {
    amountQuestion = document.querySelector('.register-quiz .form input[name="amountQuestion"').value;
    amountLevel = document.querySelector('.register-quiz .form input[name="amountLevel"').value;
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
    console.log(vw);
}

function quizPage(element) {
    main.innerHTML = `
        <p>Essa página ainda não foi construída</p>
        <p>Mas sei que você apertou no no quiz ${element.id}</p>
    `;
}