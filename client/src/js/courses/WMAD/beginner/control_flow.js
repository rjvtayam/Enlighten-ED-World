function checkAge() {
    const ageInput = document.getElementById('ageInput');
    const ageResult = document.getElementById('ageResult');
    const age = parseInt(ageInput.value);

    if (age < 0) {
        ageResult.textContent = "Invalid age! Age cannot be negative.";
        ageResult.style.color = "red";
    } else if (age < 18) {
        ageResult.textContent = "You are a minor.";
        ageResult.style.color = "blue";
    } else if (age >= 18 && age < 60) {
        ageResult.textContent = "You are an adult.";
        ageResult.style.color = "green";
    } else {
        ageResult.textContent = "You are a senior.";
        ageResult.style.color = "purple";
    }
}

function checkDay() {
    const daySelect = document.getElementById('daySelect');
    const dayResult = document.getElementById('dayResult');
    const day = daySelect.value;

    switch (day) {
        case "1":
            dayResult.textContent = "It's Monday! Start of the work week.";
            break;
        case "2":
            dayResult.textContent = "It's Tuesday! Keep pushing forward.";
            break;
        case "3":
            dayResult.textContent = "It's Wednesday! Halfway through the week.";
            break;
        case "4":
            dayResult.textContent = "It's Thursday! Almost there!";
            break;
        case "5":
            dayResult.textContent = "It's Friday! Weekend is near!";
            break;
        case "6":
            dayResult.textContent = "It's Saturday! Time to relax.";
            break;
        case "7":
            dayResult.textContent = "It's Sunday! Rest and recharge.";
            break;
        default:
            dayResult.textContent = "Invalid day selected.";
    }
}