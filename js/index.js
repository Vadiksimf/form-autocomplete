// --------------------------------- Configs -----------------------------------------
const autocompleteResultsQuantity = 4;
const urlRequestsMax = 3;


// --------------------------------- Callback search ----------------------------------
// Запрос на данные в поисковике json(p)

let keyValue;
let dataBase = [];

let urlCounter = 0;
const startSearch = function () {
    // Счетчик количества запросов url
    urlCounter += 1;
    if (urlCounter === urlRequestsMax) return urlCounter = 0;

    let url = {
        "1": `https://sitesearch-suggest.yandex.ru/v1/suggest?usebigdictionary=1&format=jsonp&search_id=2315434&lang=ru&callback=displayFunction&text=${request.value}`,
        "2": `https://sitesearch-suggest.yandex.ru/v1/suggest?usebigdictionary=1&format=jsonp&search_id=2315434&lang=ru&callback=displayFunction&text=${request.value}`,
        "3": `https://sitesearch-suggest.yandex.ru/v1/suggest?usebigdictionary=1&format=jsonp&search_id=2315434&lang=ru&callback=displayFunction&text=${request.value}`,
        "4": `https://sitesearch-suggest.yandex.ru/v1/suggest?usebigdictionary=1&format=jsonp&search_id=2315434&lang=ru&callback=displayFunction&text=${request.value}`
    };

    const s = document.createElement("script");
    s.src = url[urlCounter];
    document.head.appendChild(s);

    return keyValue = request;
}

// Callback
function displayFunction(myObj) {

    if (myObj[1] != null) {
        for (let el of myObj[1]) {
            if (!dataBase.includes(el)) dataBase.push(el)
        };
    }
    if (dataBase.length < autocompleteResultsQuantity) startSearch()

    
    // ------------------ Autocomplete -----------------------------

    let currentFocus;
    function renderAuto(arr, obj) {

        let a, b, i, val = obj.value;

        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", obj.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        obj.parentNode.appendChild(a);
        /*for each item in the array...*/
        let autocompleteCounter = 0;

        for (i = 0; i < arr.length; i++) {
            if (autocompleteCounter == autocompleteResultsQuantity) break
            // Проверка, совпадают ли начальные значения
            // if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            
            // Проверка, на наличие вводимых символов в поиске
            let regexp = new RegExp(val, "gi");
            if (regexp.test(arr[i])) {
                autocompleteCounter += 1;
                b = document.createElement("DIV");
                // Добавление полужирного шрифта при совпадении
                // b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";

                b.innerHTML += arr[i];
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                    b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    document.getElementById("request").value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values, (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
          }
        }
    };

    renderAuto(dataBase, keyValue);

    /*execute a function presses a key on the keyboard:*/
    document.getElementById("request").addEventListener("keydown", function(e) {

        let x = document.getElementById(this.id + "autocomplete-list");

        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed, increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed, decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    // Закрыть все autocomplete-items
    function closeAllLists(elmnt) {
        const x = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != document.getElementById("request")) {
            x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });

};

document.getElementById("request").addEventListener("input", function(e) {
    startSearch()
});

// --------------------------------- localStorage ----------------------------------
let req, phone;

const btnClear = document.querySelector('.btn--clear');
const btnSubmit = document.querySelector('.btn--submit');

let reqValue = document.querySelector('#request');
let phoneValue = document.querySelector('#phone');

// Подгрузка значений сохраненных в localStorage в форму
localStorage.getItem('request') ? reqValue.value = localStorage.getItem('request') : "";
localStorage.getItem('phone') ? phoneValue.value = localStorage.getItem('phone') : "";

// Сохранение данных в localStorage
btnSubmit.addEventListener('click', () => {
    req = localStorage.setItem('request', reqValue.value);
    phone = localStorage.setItem('phone', phoneValue.value);
});

// Удаление данных из localStorage и очистка формы
btnClear.addEventListener('click', () => {
    localStorage.clear();
    reqValue.value = "";
    phoneValue.value = "";
});

// Тестирование отправленных значений:
let form = document.querySelector('.form');
form.addEventListener('submit', event => {
    alert("Данные успешно отправлены")
    // console.log(form.elements.request.value, form.elements.phone.value)
});