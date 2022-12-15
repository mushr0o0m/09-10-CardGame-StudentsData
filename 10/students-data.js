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
            birthDate.textContent = getCorrectBirthDayInfo(student.birthDate);
            console.log(new Date().getFullYear() - student.studyStart)
            studyStart.textContent = `${student.studyStart} (${(new Date().getFullYear() - student.studyStart) + (new Date().getMonth() > 8 ? 1 : 0)} курс)`;

            row.append(fullName, department, birthDate, studyStart);
            console.log(row);
            table.append(row);
        }

    }

    function getCorrectBirthDayInfo(birthDate) {
        const yearsNum = new Date().getFullYear() - birthDate.getFullYear();
        const correctMonth = (birthDate.getMonth() + 1 < 10 ? "0" : "") + (birthDate.getMonth() + 1);
        const correctBirthDate = `${birthDate.getDate()}.${correctMonth}.${birthDate.getFullYear()}`;
        return `${correctBirthDate} (${yearsNum} лет)`
    }

    function createStudentsData() {
        let students = []
        const addStudentBtn = document.getElementById("addStudent");
        addStudentBtn.addEventListener("click", () => {
            students.push(addStudent())
            generateTable(students);
        });
    }

    function addStudent() {
        const form = document.forms.student;

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