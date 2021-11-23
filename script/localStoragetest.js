function postQuizUser(){
    axios.post(URL_API + "/quizzes", createQuiz).then((props)=>{
        const myQuiz = {
            id: props.data.id,
            key: props.data.key
        }
        submit(myQuiz)
    });
}

function submit(obj){
    let abc = [];
    let dataLS = JSON.parse(localStorage.getItem('myQuiz'));
    if (dataLS !== null && dataLS != {}){
        dataLS.map(item=> abc.push(item))
    }

    abc.push(obj);
    localStorage.setItem('myQuiz', JSON.stringify(abc));

    console.log(JSON.stringify(abc));
    console.log(dataLS);
}