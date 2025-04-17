

document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");

    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");

    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty!");
            return false;
        }
        const regex = /^[a-zA-Z][a-zA-Z0-9._]{2,15}$/;
        const isMatching = regex.test(username);
        if (!isMatching) {
            alert("Invalid username");
        }
        return isMatching;
    }

    async function fetchUsername(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("unable to fetch user details");
            }
            const parseData = await response.json();
            console.log("login data:", parseData);

            displayUserData(parseData);
        } catch (error) {
            statsContainer.innerHTML = `<p>No data found</p>`;
            console.log(error);
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(parseData) {
        const totalSolvedQues = parseData.totalSolved;

        const easySolvedQues = parseData.easySolved;
        const mediumSolvedQues = parseData.mediumSolved;
        const hardSolvedQues = parseData.hardSolved;

        const totalQues = parseData.totalQuestions;

        const totalEasyQues = parseData.totalEasy;
        const totalMediumQues = parseData.totalMedium;
        const totalHardQues = parseData.totalHard;

        updateProgress(easySolvedQues, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(mediumSolvedQues, totalMediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(hardSolvedQues, totalHardQues, hardLabel, hardProgressCircle);

        const cardsData=[
            {label:"overall Submissions",value:parseData.totalSolved},

            {label:"overall Easy Submissions",value:parseData.totalEasy},
            {label:"overall medium Submissions",value:parseData.totalMedium},
            {label:"overall Hard Submissions",value:parseData.totalHard},

        ]
        console.log("card data:",cardsData);

       cardStatsContainer.innerHTML=cardsData.map(data=>{
        return `
           <div class="card">
             <h4>${data.label}</h4>
             <p>${data.value}</p>
           </div>
        `
       }).join('')


    }

    searchButton.addEventListener("click", function () {
        const username = usernameInput.value;
        console.log("username:", username);
        if (validateUsername(username)) {
            fetchUsername(username);
        }
    });
});

