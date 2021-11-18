const URL_API = "https://mock-api.driven.com.br/api/v4/buzzquizz";
const main = document.querySelector("main");

getQuizzes()
function getQuizzes(){
    axios.get(`${URL_API}/quizzes`).then(renderHome);
}

// div.user-quiz ainda será fraciona a uma função a parte, mas só acontecerá após a parte de o usuário criar seu próprio quiz
function renderHome(props){
    const allQuizzes = props.data;
    console.log(allQuizzes)
    
    main.innerHTML = `
        <section class="quiz-list">
            <div class="user-quiz">
                <p>Você não criou nenhum quizz ainda :(</p>
                <button onclick="createQuiz();">Criar Quizz</button>
            </div>
            <h1>Todos os Quizzes</h1>
            <div class="all-quizzes">
                ${allQuizzes.map(renderQuiz)}
            </div>
        </section>
    `;
}

function renderQuiz(props){
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

function createQuiz(){
    main.innerHTML=`
        <p>Essa página ainda não foi construída</p>
    `;
}

function quizPage(element){
    main.innerHTML=`
        <p>Essa página ainda não foi construída</p>
        <p>Mas sei que você apertou no no quiz ${element.id}</p>
    `;
}