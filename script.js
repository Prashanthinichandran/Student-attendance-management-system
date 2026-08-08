let students = JSON.parse(localStorage.getItem("students")) || [];

function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

function addStudent() {
    const name = document.getElementById("studentName").value.trim();
    const registerNumber = document.getElementById("registerNumber").value.trim();

    if (name === "" || registerNumber === "") {
        alert("Please enter student name and register number.");
        return;
    }

    const existingStudent = students.find(
        student => student.registerNumber === registerNumber
    );

    if (existingStudent) {
        alert("This register number already exists.");
        return;
    }

    const student = {
        name: name,
        registerNumber: registerNumber,
        present: 0,
        total: 0
    };

    students.push(student);

    saveStudents();

    document.getElementById("studentName").value = "";
    document.getElementById("registerNumber").value = "";

    displayStudents();
}

function markAttendance(index, status) {
    students[index].total++;

    if (status === "Present") {
        students[index].present++;
    }

    saveStudents();
    displayStudents();
}

function deleteStudent(index) {
    if (confirm("Are you sure you want to delete this student?")) {
        students.splice(index, 1);
        saveStudents();
        displayStudents();
    }
}

function displayStudents() {
    const table = document.getElementById("studentTable");

    table.innerHTML = "";

    students.forEach((student, index) => {

        let percentage = student.total === 0
            ? 0
            : Math.round((student.present / student.total) * 100);

        table.innerHTML += `
            <tr>
                <td>${index + 1}</td>

                <td>${student.name}</td>

                <td>${student.registerNumber}</td>

                <td>
                    ${student.present} / ${student.total}
                </td>

                <td>
                    ${percentage}%
                </td>
                <td>
    ${
        student.total === 0
        ? '<span class="not-marked">Not Marked</span>'
        : percentage >= 75
        ? '<span class="good">Good</span>'
        : '<span class="low">Low</span>'
    }
</td>

                <td>
                    <button onclick="markAttendance(${index}, 'Present')">
                        Present
                    </button>

                    <button class="absent-btn"
                        onclick="markAttendance(${index}, 'Absent')">
                        Absent
                    </button>
                </td>

                <td>
                    <button class="delete-btn"
                        onclick="deleteStudent(${index})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });

    updateDashboard();
}

function updateDashboard() {

    document.getElementById("totalStudents").textContent =
        students.length;

    let totalPresent = students.reduce(
        (sum, student) => sum + student.present,
        0
    );

    let totalAbsent = students.reduce(
        (sum, student) => sum + (student.total - student.present),
        0
    );

    document.getElementById("presentStudents").textContent =
        totalPresent;

    document.getElementById("absentStudents").textContent =
        totalAbsent;
}

function searchStudent() {

    const searchValue = document
        .getElementById("search")
        .value
        .toLowerCase();

    const rows = document.querySelectorAll("#studentTable tr");

    rows.forEach(row => {

        const name = row.children[1]
            .textContent
            .toLowerCase();

        row.style.display =
            name.includes(searchValue) ? "" : "none";
    });
}

function resetAttendance() {
    if (students.length === 0) {
        alert("No students available.");
        return;
    }

    if (confirm("Are you sure you want to reset today's attendance?")) {

        students.forEach(student => {
            student.present = 0;
            student.total = 0;
        });

        saveStudents();
        displayStudents();
    }
}

function showDate() {
    const today = new Date();

    const options = {
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    document.getElementById("currentDate").textContent =
        today.toLocaleDateString("en-IN", options);
}

showDate();
displayStudents();