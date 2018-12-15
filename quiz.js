let data
let og_data

let h_data = {}

let curr_question
let curr_question_id
let curr_answered = false
let answered_questions = {}
let num_good_ans = 0
let num_ans = 0

let quiz_complete = false

let og_endscreen = ""
let og_start = ""
let og_quiz = ""

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
            break
    }
})


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
    else if(!quiz_complete){
        quiz_complete = true
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

initStartQuestions = () => {
    $("#start").removeClass("hidden")
    $("#endscreen").addClass("hidden")
    $("#quiz").addClass("hidden")

    /*document.getElementById("start").innerHTML = `<form id="start-questions" action="javascript:void(0);">
            <button>Start quiz</button>
            <button type="button" onclick="checkAll(true)">Check all</button>
            <button type="button" onclick="checkAll(false)">Uncheck all</button>
            <button type="button" onclick="reset_cookie()">Reset data</button>
            <br>
        </form>`*/

    let categories = new Set() 

    for(let key in h_data) {
        categories.add(h_data[key].bad)
    }

    Array.from(categories).sort((a,b)=>{return b-a}).forEach(i => {
        document.getElementById("start-questions").innerHTML += `<div id="bad-${i}"><h3>Missed ${i} times <button type="button" onclick="checkAllInside(true, '#bad-${i}')">Check all</button><button type="button" onclick="checkAllInside(false, '#bad-${i}')">Uncheck all</button></h3></div>`
    })

    for(let key in og_data) {
        document.getElementById(`bad-${h_data[key].bad}`).innerHTML += `<input type="checkbox" name="${key}" class="sq-checks" checked>${key}  ${og_data[key].question}<br>`
    }

    $('.sq-checks').click(e => {
        $(e.target).attr('checked', e.target.checked)
    })

    $("#start-questions").submit(function( event ) {
        let values = $(this).serializeArray()
        let keys = []
        
        let questions = {}
        values.forEach(e => {
            questions[e["name"]] = data[e["name"]]
        });
        
        data = questions
        
        $("#start").addClass("hidden")
        $("#endscreen").addClass("hidden")
        $("#quiz").removeClass("hidden")
        init_question()
        
        event.preventDefault()
    })
}


checkAll = e => {
    $(".sq-checks").attr("checked", e)
}

checkAllInside = (e,id) => {
    $(id + " .sq-checks").attr("checked", e)
}



init_stats = () => {
    // Hiding the quiz and making the stat-screen visible
    $("#quiz").addClass("hidden")
    $("#start").addClass("hidden")
    $("#endscreen").removeClass("hidden")

    // Separating the good and bad answers
    let good = []
    let bad = []

    for(let key in answered_questions) {
        let a = answered_questions[key].answer == answered_questions[key].my_answer
        let value = {key: key, ans: answered_questions[key]}

        if(a) good.push(value)
        else bad.push(value)
    }

    // Printing and saving the good and bad answers
    good.forEach(e => {
        $("#end-good").append(`<tr><td>${e.key}</td><td>${e.ans.question}</td></tr>`)
        if(h_data[e.key].good) h_data[e.key].good += 1
        else h_data[e.key].good = 1
    })

    bad.forEach(e => {
        $("#end-bad").append(`<tr><td>${e.key}</td><td>${e.ans.question}</td></tr>`)
        if(h_data[e.key].bad) h_data[e.key].bad += 1
        else h_data[e.key].bad = 1
    })

    // Displaying the overall statistics
    document.getElementById("end-num-good-ans").innerHTML = num_good_ans
    document.getElementById("end-num-ans").innerHTML = num_ans
    document.getElementById("end-num-percentage").innerHTML = num_good_ans / num_ans * 100

    // Writing the historical data to cookie
    write_cookie()
}

reset_h_data = () => {
    h_data = {}

    let keyes = Object.keys(og_data)
    keyes.forEach(key => {
        h_data[key] = {good: 0, bad: 0}
    })
}

load_cookie = () => {
    let h_cookie_data = document.cookie.replace(/(?:(?:^|.*;\s*)h_data\s*\=\s*([^;]*).*$)|^.*$/, "$1")

    if(h_cookie_data != "")
        h_data = JSON.parse(h_cookie_data)
    else {  
       reset_h_data()
    }
}

write_cookie = () => {
    let cookie_data = JSON.stringify(h_data)
    document.cookie = `h_data=${cookie_data}; expires=${new Date(1000000000000000).toUTCString()}`;
}

reset_cookie = () => {
    if(window.confirm("Biztosan ki akarod törölni a mentett adatokat?")) {
        reset_h_data()
        write_cookie()

        initStartQuestions()
    }
}

init_quiz_data = () => {
    data = og_data
    curr_answered = false
    answered_questions = {}
    num_good_ans = 0
    num_ans = 0
    quiz_complete = false

    load_cookie()
}

init_quiz = () => {
    init_quiz_data()

    load_og_state("all")

    initStartQuestions()
}

save_og_states = () => {
    og_start = document.getElementById("start").innerHTML
    og_endscreen = document.getElementById("endscreen").innerHTML
    og_quiz = document.getElementById("quiz").innerHTML
}

load_og_state = id => {
    switch (id) {
        case "og_start":
            document.getElementById("start").innerHTML = og_start
            break

        case "og_endscreen":
            document.getElementById("endscreen").innerHTML = og_endscreen
            break

        case "og_quiz":
            document.getElementById("quiz").innerHTML = og_quiz
            break
        
        case "all":
            document.getElementById("start").innerHTML = og_start
            document.getElementById("endscreen").innerHTML = og_endscreen
            document.getElementById("quiz").innerHTML = og_quiz
            break

        default:
            break
    }
}




$.get("https://cors.io/?https://pastebin.com/raw/gw6NDUh3", json => {
    
    og_data = JSON.parse(json)

    save_og_states()

    init_quiz()

    // init_question()    

})
