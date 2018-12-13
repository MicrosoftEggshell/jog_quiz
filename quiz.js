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
        init_stats()
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

initStartQuestions = (keys) => {
    for(let key in data) {
        document.getElementById("start-questions").innerHTML += `<input type="checkbox" name="${key}" class="sq-checks" checked>${key}  ${data[key].question}<br>`
    }
}

checkAll = e => {
    $(".sq-checks").attr("checked", e)
}

$("#start-questions").submit(function( event ) {
    let values = $(this).serializeArray()
    let keys = []
    
    let questions = {}
    values.forEach(e => {
        questions[e["name"]] = data[e["name"]]
    });
    
    data = questions
    
    $("#start").addClass("hidden")
    $("#quiz").removeClass("hidden")
    init_question()
    
    event.preventDefault()
})

init_stats = () => {
    $("#quiz").addClass("hidden")
    $("#endscreen").removeClass("hidden")

    let good = []
    let bad = []

    for(let key in answered_questions) {
        let a = answered_questions[key].answer == answered_questions[key].my_answer
        if(a) good.push(answered_questions[key])
        else bad.push({"key": key, "ans": answered_questions[key]})
    }

    good.forEach(e => {
        $("#end-good").append(`<tr><td>${e.key}</td><td>${e.ans.question}</td></tr>`)
    })

    bad.forEach(e => {
        $("#end-bad").append(`<tr><td>${e.key}</td><td>${e.ans.question}</td></tr>`)
    })
}






$.get("https://cors.io/?https://pastebin.com/raw/gw6NDUh3", json => {
    
    og_data = JSON.parse(json)
    data = og_data

    initStartQuestions()
    // init_question()    

})
