const API_KEY = "cfTs3_TbZz-Yz5vHmNzLzwd1wsg";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener('click', e => postForm(e));

function displayException(err) {
// exception template returned from JSON: {"error":"No or invalid API key","error_no":3,"status_code":403}
    statusCodeString = `The API returned status code: ${err.status_code} <br>`;
    errNoString = `Error number: <strong>${err.error_no}</strong> <br>`;
    ErrTextString = `Error text: <strong>${err.error}</strong> <br>`;
    document.getElementById("resultsModalTitle").innerHTML = `<h3>An exception occured</h3>`;
    document.getElementById("results-content").innerHTML = `${statusCodeString}${errNoString}${ErrTextString}`;
    resultsModal.show();
}


function processOptions(form) {

    let temptArray = [];

    for (let entry of form.entries()) {
        if (entry[0] === "options") {
            temptArray.push(entry[1]);
        }
    }
    
    form.delete("options");
    form.append("options", temptArray.join());
    return form;

}

async function postForm(e) {
    const form = processOptions(new FormData(document.getElementById("checksform")));
    for (let entry of form.entries()) {
        console.log(entry);
    }

    const response = await fetch(API_URL, 
                        {
                        method: "POST",
                        headers: {"Authorization": API_KEY,},
                        body: form,
                        });
                const data = await response.json();
                
                if (response.ok) {
                    displayErrors(data);
                } else {
                    displayException(data);
                    throw new Error(data.error);
                }

}

function displayErrors(data) {
    let heading = `JSHINT results for ${data.file}`;
    let results = ``;

    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Tatal Errors: <span> class="error_count">${data.total_errors}</span></div>"`
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class"column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        } 
    }
    document.getElementById("resultsModalTitle").innerHTML = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
}

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        console.log(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }
    displayStatus(data);
}

function displayStatus(data) {
    document.getElementById("resultsModalTitle").innerHTML = "<h3>API Key status</h3>";
    document.getElementById("results-content").textContent = `Your key is valid until ${data.expiry}`;
    resultsModal.show();
}


