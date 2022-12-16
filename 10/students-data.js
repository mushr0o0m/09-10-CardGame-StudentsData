(() => {
    function generateTable(students) {
        let table = document.querySelector("table > tbody");
        table.innerHTML = "";
        for (let student of students) {
            let row = document.createElement("tr");
            let fullName = document.createElement("td");
            let department = document.createElement("td");
            let birthDate = document.createElement("td");
            let studyStart = document.createElement("td");

            fullName.textContent = [student.name, student.surname, student.middleName].join(" ");
            department.textContent = student.department;
            birthDate.textContent = getCorrectBirthDateInfo(student.birthDate);
            studyStart.textContent = getCorrectStudyStartDateInfo(student.studyStart);

            row.append(fullName, department, birthDate, studyStart);
            table.append(row);
        }

    }

    function getCorrectBirthDateInfo(birthDate) {
        const yearsNum = new Date().getFullYear() - birthDate.getFullYear();
        const correctMonth = (birthDate.getMonth() + 1 < 10 ? "0" : "") + (birthDate.getMonth() + 1);
        const correctBirthDate = `${birthDate.getDate()}.${correctMonth}.${birthDate.getFullYear()}`;
        return `${correctBirthDate} (${yearsNum} лет)`
    }

    function getCorrectStudyStartDateInfo(studyStart) {
        const courseNum = (new Date().getFullYear() - studyStart)
            + (new Date().getMonth() > 8 ? 1 : 0);
        return `${studyStart}-${studyStart + 4} (${courseNum} курс)`;
    }

    function createStudentsData() {
        let students = []
        const addStudentBtn = document.getElementById("addStudent");
        addStudentBtn.addEventListener("click", () => {
            const form = document.forms.student;
            if (validateForm(form)) {
                students.push(addStudent(form));
                generateTable(students);
            }
        });
    }

    function validateBirthDate(birthDateStr) {
        const birthDate = new Date(birthDateStr);
        const dateNow = new Date();
        return (dateNow.getFullYear() - birthDate.getFullYear() > 0)
            || (dateNow.getFullYear() - birthDate.getFullYear() === 0
                && dateNow.getMonth() - birthDate.getMonth() > 0)
            || (dateNow.getFullYear() - birthDate.getFullYear() === 0
                && dateNow.getMonth() - birthDate.getMonth() === 0
                && dateNow.getDay() - birthDate.getDay() >= 0);
    }

    function validateStudyStart(studyStart) {
        const dateNow = new Date();
        return !isNaN(studyStart) && studyStart.length === 4
            && studyStart - 2000 > 0 && dateNow.getFullYear() - studyStart >= 0;
    }

    function validateForm(form) {
        const btn = form.querySelector("button");
        const errorMessage = document.createElement("p");
        const birthDate = form.elements.birthDate.value;
        const studyStart = form.elements.studyStart.value;
        let errorMessageText = "";
        errorMessage.classList.add("text-danger", "mb-3", "text-left")
        let isCorrect = true;
        for (let element of form.querySelectorAll("div > input")) {
            if (element.value.trim() === "") {
                errorMessageText += "Все поля должны быть заполнены! ";
                isCorrect = false;
                break;
            }
        }

        if (!validateBirthDate(birthDate)) {
            isCorrect = false;
            errorMessageText += (errorMessageText === "" ? "" : "<br>")
                + "Введите коректную дату рождения! ";
        }

        if (!validateStudyStart(studyStart)) {
            isCorrect = false;
            errorMessageText += (errorMessageText === "" ? "" : "<br>")
                + "Введите корректный год начала обучения! ";
        }

        if (isCorrect && form.querySelector("p") != null)
            form.querySelector("p").remove();
        else if (!isCorrect) {
            if (form.querySelector("p") === null) {
                errorMessage.innerHTML = errorMessageText;
                form.insertBefore(errorMessage, btn);
            }
            else
                form.querySelector("p").innerHTML = errorMessageText;

        }

        return isCorrect;
    }

    function addStudent(form) {
        const name = form.elements.name;
        const surname = form.elements.surname;
        const middleName = form.elements.middleName;
        const department = form.elements.department;
        const birthDate = form.elements.birthDate;
        const studyStart = form.elements.studyStart;

        return {
            name: name.value,
            surname: surname.value,
            middleName: middleName.value,
            department: department.value,
            birthDate: new Date(birthDate.value),
            studyStart: studyStart.value,
        };
    }

    document.addEventListener("DOMContentLoaded", () => {
        createStudentsData();
    });
})();