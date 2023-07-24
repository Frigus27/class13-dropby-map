let urlStudentFile = "resources/data/student.json"

let divButtonContainer = document.getElementById("button-container");
let divStudentCardContainer = document.getElementById("div-student-card-collection");

let collectionMapArea = Array.from(document.getElementsByClassName("pathMapAreaDisabled"));
let collectionMapAreaClickable = []
let collectionMapAreaButton = []

let spanLastChoice = document.getElementById("spanLastChoice");

let btnReset = document.getElementById("btnReset");
lastSelected = ""
let jsonData = {}

btnReset.addEventListener("click", function (e) {
    clearChosen();
    removeCards();
});

fetch(urlStudentFile)
    .then((response) => {
        if (!response.ok) {
            throw new Error("HTML 错误：${response.status}");
        }
        return response.json();
    })
    .then((json) => initialize(json))
    .catch((error) => {
        alert("${error}");
    });


// Functions
function initialize(jsonStudentData) {
    univInfo = jsonStudentData["ByUniversity"];
    for (let i = 0; i < univInfo.length; i++) {
        for (j = 0; j < collectionMapArea.length; j++) {
            if (collectionMapArea[j].id == univInfo[i]["Province"]) {
                if (collectionMapAreaClickable.indexOf(collectionMapArea[j]) == -1) {
                    collectionMapArea[j].setAttribute("class", "pathMapArea");
                    collectionMapAreaClickable.push(collectionMapArea[j]);
                    collectionMapArea[j].addEventListener("click", function (e) {
                        handlePathClick(this);
                    });
                }
            }
        }
    }
    for (let i = 0; i < collectionMapAreaClickable.length; i++) {
        var button = createMapAreaButton(collectionMapAreaClickable[i].id, collectionMapAreaClickable[i].id);
        collectionMapArea.push(button);
        divButtonContainer.appendChild(button);
    }
    jsonData = jsonStudentData;
}

function createMapAreaButton(areaId, text) {
    var button = document.createElement("button");
    button.innerHTML = text;
    button.setAttribute("id", "btn" + areaId);
    button.setAttribute("class", "button buttonSimulate");
    button.addEventListener("click", function (e) {
        simulateClick(this.id.substring(3, this.id.length));
    });
    return button;
}

function clearChosen() {
    spanLastChoice.innerHTML = "-请点击省份-";
    for (j = 0; j < collectionMapAreaClickable.length; j++) {
        collectionMapAreaClickable[j].setAttribute("class", "pathMapArea");
    }
}

function handlePathClick(pathClicked) {
    clearChosen();
    pathClicked.setAttribute("class", "pathMapAreaChosen");
    lastSelected = pathClicked.id;
    spanLastChoice.innerHTML = lastSelected;
    showCardsByProvince(pathClicked.id);
}

function simulateClick(id) {
    for (j = 0; j < collectionMapAreaClickable.length; j++) {
        if (collectionMapAreaClickable[j].id == id) {
            let event = new Event("click", { "bubbles": true, "cancelable": true });
            collectionMapAreaClickable[j].dispatchEvent(event);
        }
    }
}

// format: "ByStudent" one
function createCard(studentDataPiece) {
    // Get data ready
    studentName = studentDataPiece.Name;
    university = studentDataPiece.University;
    univName = university.Name;
    univProvince = university.Province;
    univCity = university.City;
    isMetropolis = (univProvince == univCity);
    studentMajor = studentDataPiece.Major;

    // Compute the data ready to fill in
    fillName = studentName;
    fillIcon = "resources/icon/unknown.jpg";
    fillUnivName = univName;
    fillCityName = "（）";
    if (isMetropolis) {
        fillCityName = "（" + univCity + "）";
    }
    else {
        fillCityName = "（" + univProvince + univCity + "）";
    }
    fillMajor = studentMajor;

    /* Create the card and fill data. The template is like
    <div class="div-student-card">
        <div class="div-student-card-name">
            <img src="resources/icon/unknown.jpg" class="img-student-card"></img>
            <span class="span-student-card-name">金浩源</span>
            <span>（上海市）</span>
        </div>
        <div class="div-student-card-detail">
            <div class="div-student-card-detail-group-left">
                <span class="span-bold">院校</span>
                <span>上海交通大学</span>
            </div>
            <div class="div-student-card-detail-group-right">
                <span class="span-bold">专业</span>
                <span>原神</span>
            </div>
        </div>
    </div>
    */
    var newDivStudentCard = document.createElement("div");
    newDivStudentCard.setAttribute("class", "div-student-card");

    var newDivStudentCardName = document.createElement("div");
    newDivStudentCardName.setAttribute("class", "div-student-card-name");

    var newStudentCardImg = document.createElement("img");
    newStudentCardImg.setAttribute("class", "img-student-card");
    newStudentCardImg.setAttribute("src", fillIcon);
    newDivStudentCardName.appendChild(newStudentCardImg)

    var newSpanStudentCardName = document.createElement("span");
    newSpanStudentCardName.setAttribute("class", "span-student-card-name");
    newSpanStudentCardName.innerHTML = fillName;
    newDivStudentCardName.appendChild(newSpanStudentCardName);

    var newSpanLocation = document.createElement("span");
    newSpanLocation.innerHTML = fillCityName;
    newDivStudentCardName.appendChild(newSpanLocation);

    newDivStudentCard.appendChild(newDivStudentCardName);

    var newDivStudentCardDetail = document.createElement("div");
    newDivStudentCardDetail.setAttribute("class", "div-student-card-detail");

    var newDivStudentCardDetailGroupLeft = document.createElement("div");
    newDivStudentCardDetailGroupLeft.setAttribute("class", "div-student-card-detail-group-left");

    var newSpanBold1 = document.createElement("span");
    newSpanBold1.innerHTML = "院校";
    newSpanBold1.setAttribute("class", "span-bold");
    newDivStudentCardDetailGroupLeft.appendChild(newSpanBold1);

    var newSpanNormal1 = document.createElement("span");
    newSpanNormal1.innerHTML = fillUnivName;
    newDivStudentCardDetailGroupLeft.appendChild(newSpanNormal1);

    newDivStudentCardDetail.appendChild(newDivStudentCardDetailGroupLeft);

    var newDivStudentCardDetailGroupRight = document.createElement("div");
    newDivStudentCardDetailGroupRight.setAttribute("class", "div-student-card-detail-group-right");

    var newSpanBold2 = document.createElement("span");
    newSpanBold2.innerHTML = "专业";
    newSpanBold2.setAttribute("class", "span-bold");
    newDivStudentCardDetailGroupRight.appendChild(newSpanBold2);

    var newSpanNormal2 = document.createElement("span");
    newSpanNormal2.innerHTML = fillMajor;
    newDivStudentCardDetailGroupRight.appendChild(newSpanNormal2);

    newDivStudentCardDetail.appendChild(newDivStudentCardDetailGroupRight);

    newDivStudentCard.appendChild(newDivStudentCardDetail);

    return newDivStudentCard;
}

// format: "ByUniversity" one
function createCardBySimpleData(univData, studentName) {
    // get the student info
    studentInfo = {}
    for (let i = 0; i < univData.Students.length; i ++) {
        if (univData.Students[i].Name == studentName) {
            studentInfo = univData.Students[i];
            break;
        }
    }
    studentInfo.University = univData;
    
    // create card
    return createCard(studentInfo);
}

function createCardSetByUniversity(univData) {
    var divUnivCardContainer = document.createElement("div");
    divUnivCardContainer.setAttribute("class", "div-univ-card-container");

    var newSpanUnivName = document.createElement("h4");
    newSpanUnivName.innerHTML = univData.Name;
    divUnivCardContainer.appendChild(newSpanUnivName);

    for (let i = 0; i < univData.Students.length; i ++) {
        var newCard = createCardBySimpleData(univData, univData.Students[i].Name);
        divUnivCardContainer.appendChild(newCard);
    }
    return divUnivCardContainer;
}

function removeCards() {
    while (divStudentCardContainer.hasChildNodes()) {
        divStudentCardContainer.removeChild(divStudentCardContainer.firstChild);
    }
}

function showCardsByProvince(province) {
    removeCards();
    let shownCityList = []
    //arrangedInfo = arrangeInfoByLocation(province);
    for (let i = 0; i < jsonData.ByUniversity.length; i++) {
        if (jsonData.ByUniversity[i].Province == province) {
            if (shownCityList.indexOf(jsonData.ByUniversity[i].City) == -1) {
                shownCityList.push(jsonData.ByUniversity[i].City);
                createCityInfoCard(jsonData.ByUniversity[i].City);
            }
        }
    }
}

// TODO: finish the "sort by city" function

function createCityInfoCard(city) {
    univList = []
    for (let i = 0; i < jsonData.ByUniversity.length; i ++) {
        if (city == jsonData.ByUniversity[i].City) {
            univList.push(jsonData.ByUniversity[i]);
        }
    }

    console.log(univList);

    var newDivCity = document.createElement("div");
    newDivCity.setAttribute("class", "div-city-container");

    // get city info
    var newSpanCityName = document.createElement("h3");
    newSpanCityName.innerHTML = city;
    newDivCity.appendChild(newSpanCityName);
    for (let i = 0; i < univList.length; i++) {
        console.log(i)
        var newDivUnivCardContainer = createCardSetByUniversity(univList[i]);
        newDivCity.appendChild(newDivUnivCardContainer);
        console.log(i)
    }
    divStudentCardContainer.appendChild(newDivCity);
    return newDivCity;
}