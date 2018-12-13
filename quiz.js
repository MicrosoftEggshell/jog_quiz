let data
let og_data
let curr_question
let curr_question_id
let curr_answered = false
let answered_questions = {}
let num_good_ans = 0
let num_ans = 0

document.addEventListener('keydown', event => {
    const keyName = event.key;
    switch (keyName) {
        case "1":
            isGoodAns("a")
            break

        case "2":
            isGoodAns("b")
            break

        case "3":
            isGoodAns("c")
            break

        case "4":
            isGoodAns("d")
            break

        case "Enter":
            next()
            break
    
        default:
            break;
    }
  });

isGoodAns = answer => {
    if(!curr_answered) {
        changeBgClass("#ans-"+answer, "bad-ans")
        changeBgClass("#ans-"+curr_question.answer, "good-ans")

        curr_answered = true
        changeNextBtnState(false)
        curr_question.my_answer = answer

        if(curr_question.answer == answer) num_good_ans++
        num_ans++
    }
}

next = () => {
    if(curr_answered) {
        answered_questions[curr_question_id] = curr_question
        init_question()
    }
}

displayCurrQuestion = () => {
    $('#question').html(curr_question.question)
    $('#ans-a').html(curr_question.a)
    $('#ans-b').html(curr_question.b)
    $('#ans-c').html(curr_question.c)
    $('#ans-d').html(curr_question.d)
    $('#num-good-ans').html(num_good_ans)
    $('#num-ans').html(num_ans)
    $('#num-percentage').html(num_good_ans / num_ans * 100)
}

changeNextBtnState = new_state => {
    $("#nextBtn").prop("disabled", new_state)

    if(new_state)
        $("#nextBtn").addClass("nextBtn-disabled")
    else 
        $("#nextBtn").removeClass("nextBtn-disabled")
}

changeBgClass = (elem, new_class) => {
    $(elem).removeClass("empty-ans good-ans bad-ans").addClass(new_class)
}

init_question = () => {
    if(!isEmpty(data)) {
        curr_question_id = randomPropertyKey(data)
        curr_question = data[curr_question_id]
        delete data[curr_question_id]

        displayCurrQuestion()

        changeNextBtnState(true)
        curr_answered = false

        changeBgClass("#ans-a", "empty-ans")
        changeBgClass("#ans-b", "empty-ans")
        changeBgClass("#ans-c", "empty-ans")
        changeBgClass("#ans-d", "empty-ans")
    }
    else {
        alert("The end")
    }
}

randomPropertyKey = obj => {
    let keys = Object.keys(obj)
    return keys[ keys.length * Math.random() << 0]
}

isEmpty = map => {
    for(var key in map) {
        if (map.hasOwnProperty(key)) return false
    }

    return true;
}




$.get("https://cors.io/?https://pastebin.com/raw/gw6NDUh3", json => {
    
    og_data = JSON.parse(json)
    data = og_data

    init_question()    

})
