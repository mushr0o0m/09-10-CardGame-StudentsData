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

            fullName.textContent = [student.surname, student.name, student.middleName].join(" ");
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
        return `${correctBirthDate} (${yearsNum} лет)`;
    }

    function getCorrectStudyStartDateInfo(studyStart) {
        const courseNum = (new Date().getFullYear() - studyStart)
            + (new Date().getMonth() > 8 ? 1 : 0);
        const coursInfo = (courseNum > 4) ? "закончил" : `${courseNum} курс`;
        return `${studyStart}-${Number(studyStart) + 4} (${coursInfo})`;
    }

    function addTableFilters(students) {
        const form = document.forms.filter;
        const fullNameFilter = form.elements.filter__fullName;
        const departmentFilter = form.elements.filter__department;
        const yearEnrolmentFilter = form.elements.filter__year_enrolment;
        const graduationYearFilter = form.elements.filter__graduation_year;

        const filterInput = (student) => {
            return ([student.surname, student.name, student.middleName].join(" ").indexOf(fullNameFilter.value) != -1
                || fullNameFilter.value === "")
                && (student.department.indexOf(departmentFilter.value) != -1 || departmentFilter.value === "")
                && (student.studyStart === yearEnrolmentFilter.value || yearEnrolmentFilter.value === "")
                && (Number(student.studyStart) + 4 === Number(graduationYearFilter.value) || graduationYearFilter.value === "")
        }
        [...form.querySelectorAll('input')].forEach(input => input.addEventListener("input", () => {
            setTimeout(() => generateTable(students.filter(filterInput)), 1000);
        }));

    }

    function addTableSortings(students) {
        const fullNameTitle = document.getElementById("fullName-title");
        const departmentTitle = document.getElementById("department-title");
        const birthDateTitle = document.getElementById("birthDate-title");
        const studyStartTitle = document.getElementById("studyStart-title");
        fullNameTitle.addEventListener("click", () => {
            generateTable(students.slice().sort((a, b) => {
                if ([a.surname, a.name, a.middleName].join("") > [b.surname, b.name, b.middleName].join(""))
                    return 1;
                if ([a.surname, a.name, a.middleName].join("") < [b.surname, b.name, b.middleName].join(""))
                    return -1;
                return 0;
            }));
        });

        departmentTitle.addEventListener("click", () => {
            generateTable(students.slice().sort((a, b) => {
                if (a.department > b.department)
                    return 1;
                if (a.department < b.department)
                    return -1;
                return 0;
            }));
        });

        birthDateTitle.addEventListener("click", () => {
            generateTable(students.slice().sort((a, b) => {
                if (a.birthDate > b.birthDate)
                    return 1;
                if (a.birthDate < b.birthDate)
                    return -1;
                return 0;
            }));
        });

        studyStartTitle.addEventListener("click", () => {
            generateTable(students.slice().sort((a, b) => a.studyStart - b.studyStart));
        });
    }

    function createStudentsData() {
        let students = [];
        const addStudentBtn = document.getElementById("addStudent");
        addTableSortings(students);
        addTableFilters(students);
        addStudentBtn.addEventListener("click", () => {
            const form = document.forms.student;
            if (validateForm(form)) {
                students.push(addStudent(form));
                generateTable(students);
                [...form.querySelectorAll('input')].map((input) => input.value = '');
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