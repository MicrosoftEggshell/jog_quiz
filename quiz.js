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
let shuffleQuestions = false

let og_endscreen = ""
let og_start = ""
let og_quiz = ""

document.addEventListener('keydown', event => {
    if(!document.getElementById("start").classList.contains("hidden")) // quiz not started yet
        return

    const keyName = event.key;
    const answerOptions = document.getElementById("answer-options").children
    switch (keyName) {
        case "1":
            answerOptions[0].onclick()
            break

        case "2":
            answerOptions[1].onclick()
            break

        case "3":
            answerOptions[2].onclick()
            break

        case "4":
            answerOptions[3].onclick()
            break

        case " ":
        case "Enter":
            next()
            break
    
        default:
            break
    }
})


isGoodAns = answer => {
    if(!curr_answered) {
        changeBgClass("#ans-"+answer, "btn-danger")
        changeBgClass("#ans-"+curr_question.answer, "btn-success")


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
    if(document.getElementById("random-answer-order").checked) {
        const answerOptions = document.getElementById("answer-options").children
        let shuffledAns = shuffle(answerOptions)

        document.getElementById("answer-options").innerHTML = ""
        shuffledAns.forEach(e => document.getElementById("answer-options").innerHTML += e.outerHTML)
    }

    $('#question').html(curr_question.question)
    $('#ans-a').html(curr_question.a)
    $('#ans-b').html(curr_question.b)
    $('#ans-c').html(curr_question.c)
    $('#ans-d').html(curr_question.d)
    $('#num-good-ans').html(num_good_ans)
    $('#num-ans').html(num_ans)
    if(num_ans > 0)
        $('#num-percentage').html(parseFloat(num_good_ans / num_ans * 100).toFixed(2))
    $('#num-remaining').html(Object.keys(data).length)
}

changeNextBtnState = new_state => {
    $("#nextBtn").prop("disabled", new_state)

    if(new_state) {
        $("#nextBtn").attr("disabled", true)
        $("#nextBtn").addClass("btn-secondary").removeClass("btn-info")
    } else { 
        $("#nextBtn").attr("disabled", false)
        $("#nextBtn").removeClass("btn-secondary").addClass("btn-info")
    }
}

changeBgClass = (elem, new_class) => {
    $(elem).removeClass("btn-outline-secondary btn-success btn-danger").addClass(new_class)
}

init_question = () => {
    if(!isEmpty(data)) {
        if(document.getElementById("random-question-order").checked)
            curr_question_id = randomPropertyKey(data)
        else
            curr_question_id = Object.keys(data)[0]
        curr_question = data[curr_question_id]
        delete data[curr_question_id]

        displayCurrQuestion()

        changeNextBtnState(true)
        curr_answered = false

        changeBgClass("#ans-a", "btn-outline-secondary")
        changeBgClass("#ans-b", "btn-outline-secondary")
        changeBgClass("#ans-c", "btn-outline-secondary")
        changeBgClass("#ans-d", "btn-outline-secondary")
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

    let categories = new Set()

    for(let key in h_data) {
        categories.add(h_data[key].b)
    }

    Array.from(categories).sort((a,b)=>{return b-a}).forEach(i => {
        document.getElementById("start-questions").innerHTML += `
            <div>
                <details id="bad-${i}" open>
                    <summary>
                        <h3>${i}x elhibázva 
                            <button type="button" class="btn btn-outline-info checkBtn" onclick="checkAllInside(true, '#bad-${i}')"><i class="fas fa-check"></i> Mindet ezen belül</button>
                            <button type="button" class="btn btn-outline-secondary checkBtn" onclick="checkAllInside(false, '#bad-${i}')"><i class="fas fa-times"></i> Mindet ezen belül</button>
                        </h3>
                    </summary>
                </details>
            </div>`
    })

    for(let key in og_data) {
        document.getElementById(`bad-${h_data[key].b}`).innerHTML += `
            <input type="checkbox" id="check-for-${key}" name="${key}" class="sq-checks" checked>
            <label for="check-for-${key}">
                ${key}. ${og_data[key].question}
            </label>
            <br>`
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

checkRange = (from, to, e) => {
    for(let i = from; i <= to; i += 1) {
        $("#check-for-" + i).attr("checked", e)
    }
}

checkRangeOnClick = e => {
    let from = parseInt(document.getElementById("from-text").value, 10)
    let to = parseInt(document.getElementById("to-text").value, 10)

    checkRange(from, to, e)
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
        $("#end-good").append(`<li value="${e.key}">${e.ans.question}</li>`)
        if(h_data[e.key].g) h_data[e.key].g += 1
        else h_data[e.key].g = 1
    })

    bad.forEach(e => {
        $("#end-bad").append(`<li value="${e.key}">${e.ans.question}</li>`)
        if(h_data[e.key].b) h_data[e.key].b += 1
        else h_data[e.key].b = 1
    })

    // Displaying the overall statistics
    document.getElementById("end-num-good-ans").innerHTML = num_good_ans
    document.getElementById("end-num-ans").innerHTML = num_ans
    document.getElementById("end-num-percentage").innerHTML = parseFloat(num_good_ans / num_ans * 100).toFixed(2)

    // Writing the historical data to cookie
    write_cookie()
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

eraseCookie = name => {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}

reset_h_data = () => {
    h_data = {}

    let keys = Object.keys(og_data)
    keys.forEach(key => {
        h_data[key] = {g: 0, b: 0}
    })
}

load_cookie = () => {
    let h_cookie_data = getCookie("h_data")

    if(h_cookie_data != null)
        h_data = JSON.parse(h_cookie_data)
    else {  
       reset_h_data()
    }
}

write_cookie = () => {
    let cookie_data = JSON.stringify(h_data)
    setCookie("h_data", cookie_data, 100000)
}

reset_cookie = () => {
    eraseCookie("h_data")
    reset_h_data()
    write_cookie()

    init_quiz()
}

$('#importModal').on('shown.bs.modal', function () {
    document.getElementById("importModal-ta").value = ""
})

$('#exportModal').on('shown.bs.modal', function () {
    let export_modal = document.getElementById("exportModal-ta")
    export_modal.value = btoa(getCookie("h_data"))
    export_modal.focus()
    export_modal.select()
})

$('#confirmModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var trigger = button.data('trigger') // Extract info from data-* attributes

    var modal = $(this)

    switch (trigger) {
        case "restart":
            modal.find('.modal-title').text("Biztosan újra akarod indítani a quizt?")
            modal.find('.modal-footer #submit-modal').attr("onclick", "init_quiz()")
        break;

        case "reset-data":
            modal.find('.modal-title').text("Biztosan ki akarod törölni a metett adatokat? (Ez újra fogja indítani a quiz-t)")
            modal.find('.modal-footer #submit-modal').attr("onclick", "reset_cookie()")
        break;
    
        default:
        break;
    }
})

import_h_data = () => {
    if(window.confirm("Biztosan importálni akarod ezeket az adatokat? (Ez újra fogja indítani a quiz-t)")) {
        let cookie_data = atob(document.getElementById("importModal-ta").value)
        setCookie("h_data", cookie_data, 100000)
        load_cookie()
        init_quiz()
    }
}

restart_quiz = () => {
    if(window.confirm("Biztosan újra akarod indítani a quizt?")) {
        init_quiz()
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
    }
}

shuffle = obj => {
    let array = Object.keys(obj).map(function(val) { return obj[val] })

    var currentIndex = array.length, temporaryValue, randomIndex

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        // And swap it with the current element.
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    }

    return array;
}



og_data = JSON.parse(quiz_data)

save_og_states()

init_quiz()
