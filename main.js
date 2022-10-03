let countspan=document.querySelector(".quiz-info .count span");
let bulletSpanCountainer=document.querySelector(".bullets .spans");
let quizeArea=document.querySelector(".quize-area");
let answerArea=document.querySelector(".answer-area");
let sumitButton=document.querySelector(".sumbit-button");
let Bullets=document.querySelector(".bullets");
let resultCountainer=document.querySelector(".results");
let countdownSpan=document.querySelector(".countdwon");
let currentIndex=0
let rightAnswers=0;
let countDownInterval;
function getQuestion(){
    let myrequest=new XMLHttpRequest();
    myrequest.onreadystatechange=function(){
        if(this.readyState===4 && this.status===200){
           // console.log(this.responseText);
            let questionObject= JSON.parse(this.responseText)
            let questionCount=questionObject.length;
            console.log(questionCount)
            //create bullets +set question coun
            createbulltes(questionCount);
            //add question data
            addQuestion(questionObject[currentIndex],questionCount)
            //start countTime
            countdown(5,questionCount)
            //click on sumit
            sumitButton.onclick=()=>{
                //get right answer
                let therightAnswer=questionObject[currentIndex].right_answer;
                //increase index
                currentIndex++;


                //check answer
                checkAnswer(therightAnswer,questionCount);
                //remove previous question
                quizeArea.innerHTML=" ";
                answerArea.innerHTML=" ";
                //add question data
                addQuestion(questionObject[currentIndex],questionCount)
                //handle bullets
                handleBullets();
                clearInterval(countDownInterval)
                countdown(5,questionCount)
                //show results
                showResult(questionCount);
            }

        };
    }
    myrequest.open("GET","question.json",true);
    myrequest.send();
}
getQuestion();
function createbulltes(num){
    countspan.innerHTML=num;
    for(let i=0;i<num;i++){

        //craete bullets
        let thebullets=document.createElement("span")
        //check frist question

        if(i ===0){
            thebullets.className="on"
        }
        //append child to main bullets container
        bulletSpanCountainer.appendChild(thebullets)

    }

}
function addQuestion(obj,count)
{
    if(currentIndex<count){

    
    //create h2 question
    let questionTitle=document.createElement("h2");
    let questionText=document.createTextNode(obj.title);
    questionTitle.appendChild(questionText);
    quizeArea.appendChild(questionTitle);
    //craete answer;
    for (let i=1; i<=4 ;i++) {
    
        //create main div answer
        let MainD=document.createElement("div");
        //add class to main div
        MainD.className="answer";
        //create radio input
        let radioInput=document.createElement("input");
        //add type + id +name+dataAttrbue
        radioInput.name="question";
        radioInput.id=`answer_${i}`;
        radioInput.type="radio";
        radioInput.dataset.answer=obj[`answer_${i}`];

        //mainfrist option selected
        if(i===1)
        {
            radioInput.checked=true;
        }
        //create label
        let Thelabel=document.createElement("label");
        //add attribute for
        Thelabel.htmlFor=`answer_${i}`;
        //create label text
        let ThelabelText=document.createTextNode(obj[`answer_${i}`]);
        Thelabel.appendChild(ThelabelText);
        //add input+label to main div
        MainD.appendChild(radioInput);
        MainD.appendChild(Thelabel);
        //append all div to answer
        answerArea.appendChild(MainD);



    };
}
}

    function   checkAnswer(therightAnswer,count){
        let answers=document.getElementsByName("question")
        let chooseAnswer;
        for(let i=0;i<answers.length;i++){
            if(answers[i].checked){
                chooseAnswer=answers[i].dataset.answer;
            }
        }
    if(therightAnswer===chooseAnswer)
    {
        rightAnswers++;
    }
}
function handleBullets(){
        let bulletsSpan=document.querySelectorAll(".bullets .spans span");
        let arrSpans=Array.from(bulletsSpan);
        bulletsSpan.forEach((span,index)=>
        {
            if(currentIndex===index){
                span.className="on"
            }
        })


}
function showResult(count){
    let theResult;
    if(currentIndex===count){
        quizeArea.remove();
        answerArea.remove();
        sumitButton.remove();
        Bullets.remove();
        if((rightAnswers>count/2) && rightAnswers<count){
            theResult=`<span class="good>GOOD</span>,${rightAnswers} from ${count} is good answer`
        }
        else if(rightAnswers===count){
            theResult=`<span class="perfect">VERY DOOD</span>,${rightAnswers} from ${count} is very good answer`
        }
        else{
            theResult=`<span class="bad">BAD</span>,${rightAnswers} from ${count} is bad answer`
        }
    
        resultCountainer.innerHTML=theResult;

    }
}
function countdown(duration,count){
    if(currentIndex<count){
        let minutes, second;
        countDownInterval=setInterval(function(){
            minutes=parseInt(duration/60);
            second=parseInt(duration%60);
            minutes=minutes<10?`0${minutes}`:minutes;
            second=second<10?`0${second}`:second;
            countdownSpan.innerHTML=`${minutes}:${second}`;
            if(--duration<0){
                clearInterval(countDownInterval);
                sumitButton.click();
                
            }
        },1000)
    }
}

