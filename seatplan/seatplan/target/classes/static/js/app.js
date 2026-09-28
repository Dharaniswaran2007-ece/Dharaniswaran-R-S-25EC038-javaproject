// =====================================================
//                    SEATPLAN JAVASCRIPT
// =====================================================

const API = (window.location.origin && window.location.origin !== "null" && !window.location.origin.startsWith("file:"))
    ? window.location.origin
    : "http://localhost:4040";


// =====================================================
//                    COMMON FUNCTIONS
// =====================================================

async function getData(url) {

    const response = await fetch(API + url);

    if (!response.ok) {

        const errorText = await response.text();

        throw new Error(
            errorText || "Request failed"
        );
    }

    return await response.json();
}


async function postData(url, data) {

    const options = {
        method: "POST"
    };

    if (data !== undefined && data !== null) {

        options.headers = {
            "Content-Type": "application/json"
        };

        options.body = JSON.stringify(data);
    }

    const response = await fetch(
        API + url,
        options
    );

    if (!response.ok) {

        const errorText = await response.text();

        throw new Error(
            errorText || "Request failed"
        );
    }

    return await response.json();
}


async function putData(url, data) {

    const response = await fetch(
        API + url,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)
        }
    );

    if (!response.ok) {

        const errorText = await response.text();

        throw new Error(
            errorText || "Request failed"
        );
    }

    return await response.json();
}


async function deleteData(url) {

    const response = await fetch(
        API + url,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {

        const errorText = await response.text();

        throw new Error(
            errorText || "Delete failed"
        );
    }

    return true;
}


// =====================================================
//                    DELETE RECORD
// =====================================================

async function deleteRecord(url, reloadFunction) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this record?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        await deleteData(url);

        alert("Record deleted successfully.");

        if (reloadFunction) {
            reloadFunction();
        }

    }
    catch (error) {

        console.error(
            "Delete error:",
            error
        );

        alert(
            "Unable to delete record.\n\n" +
            error.message
        );
    }
}


// =====================================================
//                         HALLS
// =====================================================

async function loadHalls() {

    try {

        const halls =
            await getData("/halls");


        // Hall table

        const tableBody =
            document.getElementById(
                "hallTableBody"
            );


        if (tableBody) {

            tableBody.innerHTML = "";


            halls.forEach(function(hall) {

                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>${hall.id}</td>

                    <td>${hall.hallName}</td>

                    <td>${hall.rowCount}</td>

                    <td>${hall.columnCount}</td>

                    <td>${hall.capacity}</td>

                    <td>

                        <button
                            class="delete-button"
                            onclick="deleteRecord(
                                '/halls/${hall.id}',
                                loadHalls
                            )">

                            Delete

                        </button>

                    </td>

                `;


                tableBody.appendChild(row);

            });

        }


        // Hall dropdown in seating page

        const select =
            document.getElementById(
                "hallSelect"
            );


        if (select) {

            select.innerHTML = `

                <option value="">
                    Select Hall
                </option>

            `;


            halls.forEach(function(hall) {

                const option =
                    document.createElement("option");


                option.value =
                    hall.id;


                option.textContent =
                    hall.hallName +
                    " (Capacity: " +
                    hall.capacity +
                    ")";


                select.appendChild(option);

            });

        }

    }
    catch (error) {

        console.error(
            "Hall loading error:",
            error
        );


        const tableBody =
            document.getElementById(
                "hallTableBody"
            );


        if (tableBody) {

            tableBody.innerHTML = `

                <tr>

                    <td colspan="6">
                        Unable to load halls.
                    </td>

                </tr>

            `;

        }

    }
}


// =====================================================
//                      ADD HALL
// =====================================================

async function addHall() {

    const hallName =
        document.getElementById(
            "hallName"
        )?.value.trim();


    const rowCount =
        document.getElementById(
            "rowCount"
        )?.value;


    const columnCount =
        document.getElementById(
            "columnCount"
        )?.value;


    const capacity =
        document.getElementById(
            "capacity"
        )?.value;


    if (
        !hallName ||
        !rowCount ||
        !columnCount ||
        !capacity
    ) {

        alert(
            "Please fill all hall fields."
        );

        return;
    }


    if (
        parseInt(capacity) >
        parseInt(rowCount) *
        parseInt(columnCount)
    ) {

        alert(
            "Capacity cannot be greater than rows × columns."
        );

        return;
    }


    try {

        const hall = {

            hallName: hallName,

            rowCount:
                parseInt(rowCount),

            columnCount:
                parseInt(columnCount),

            capacity:
                parseInt(capacity)

        };


        await postData(
            "/halls",
            hall
        );


        alert(
            "Hall added successfully."
        );


        document.getElementById(
            "hallName"
        ).value = "";


        document.getElementById(
            "rowCount"
        ).value = "";


        document.getElementById(
            "columnCount"
        ).value = "";


        document.getElementById(
            "capacity"
        ).value = "";


        loadHalls();

    }
    catch (error) {

        console.error(
            "Add hall error:",
            error
        );

        alert(
            "Unable to add hall.\n\n" +
            error.message
        );
    }
}


// =====================================================
//                       STUDENTS
// =====================================================

async function loadStudents() {

    try {

        const students =
            await getData("/students");


        const tableBody =
            document.getElementById(
                "studentTableBody"
            );


        if (!tableBody) {
            return;
        }


        tableBody.innerHTML = "";


        students.forEach(function(student) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>${student.id}</td>

                <td>${student.name}</td>

                <td>${student.registerNumber}</td>

                <td>${student.className}</td>

                <td>${student.section}</td>

                <td>

                    <button
                        class="delete-button"
                        onclick="deleteRecord(
                            '/students/${student.id}',
                            loadStudents
                        )">

                        Delete

                    </button>

                </td>

            `;


            tableBody.appendChild(row);

        });

    }
    catch (error) {

        console.error(
            "Student loading error:",
            error
        );

    }
}


// =====================================================
//                    ADD STUDENT
// =====================================================

async function addStudent() {

    const name =
        document.getElementById(
            "name"
        )?.value.trim();


    const registerNumber =
        document.getElementById(
            "registerNumber"
        )?.value.trim();


    const className =
        document.getElementById(
            "className"
        )?.value.trim();


    const section =
        document.getElementById(
            "section"
        )?.value.trim();


    if (
        !name ||
        !registerNumber ||
        !className ||
        !section
    ) {

        alert(
            "Please fill all student fields."
        );

        return;
    }


    try {

        const student = {

            name: name,

            registerNumber:
            registerNumber,

            className:
            className,

            section:
            section

        };


        await postData(
            "/students",
            student
        );


        alert(
            "Student added successfully."
        );


        document.getElementById(
            "name"
        ).value = "";


        document.getElementById(
            "registerNumber"
        ).value = "";


        document.getElementById(
            "className"
        ).value = "";


        document.getElementById(
            "section"
        ).value = "";


        loadStudents();

    }
    catch (error) {

        console.error(
            "Add student error:",
            error
        );

        alert(
            "Unable to add student.\n\n" +
            error.message
        );
    }
}


// =====================================================
//                    EXAM SESSIONS
// =====================================================

async function loadSessions() {

    try {

        const sessions =
            await getData(
                "/exam-sessions"
            );


        // Session table

        const tableBody =
            document.getElementById(
                "sessionTableBody"
            );


        if (tableBody) {

            tableBody.innerHTML = "";


            sessions.forEach(function(session) {

                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>${session.id}</td>

                    <td>${session.examName}</td>

                    <td>${session.subject}</td>

                    <td>${session.examDate}</td>

                    <td>

                        <button
                            class="delete-button"
                            onclick="deleteRecord(
                                '/exam-sessions/${session.id}',
                                loadSessions
                            )">

                            Delete

                        </button>

                    </td>

                `;


                tableBody.appendChild(row);

            });

        }


        // Session dropdown

        const select =
            document.getElementById(
                "sessionSelect"
            );


        if (select) {

            select.innerHTML = `

                <option value="">
                    Select Exam Session
                </option>

            `;


            sessions.forEach(function(session) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    session.id;


                option.textContent =
                    session.examName +
                    " - " +
                    session.subject +
                    " (" +
                    session.examDate +
                    ")";


                select.appendChild(option);

            });

        }

    }
    catch (error) {

        console.error(
            "Session loading error:",
            error
        );

    }
}


// =====================================================
//                  ADD EXAM SESSION
// =====================================================

async function addExamSession() {

    const examName =
        document.getElementById(
            "examName"
        )?.value.trim();


    const subject =
        document.getElementById(
            "subject"
        )?.value.trim();


    const examDate =
        document.getElementById(
            "examDate"
        )?.value;


    if (
        !examName ||
        !subject ||
        !examDate
    ) {

        alert(
            "Please fill all exam session fields."
        );

        return;
    }


    try {

        const session = {

            examName:
            examName,

            subject:
            subject,

            examDate:
            examDate

        };


        await postData(
            "/exam-sessions",
            session
        );


        alert(
            "Exam session added successfully."
        );


        document.getElementById(
            "examName"
        ).value = "";


        document.getElementById(
            "subject"
        ).value = "";


        document.getElementById(
            "examDate"
        ).value = "";


        loadSessions();

    }
    catch (error) {

        console.error(
            "Add session error:",
            error
        );

        alert(
            "Unable to add exam session.\n\n" +
            error.message
        );
    }
}


// =====================================================
//                 GENERATE SEATING PLAN
// =====================================================

async function generateSeating() {

    const hallSelect =
        document.getElementById(
            "hallSelect"
        );


    const sessionSelect =
        document.getElementById(
            "sessionSelect"
        );


    if (!hallSelect || !sessionSelect) {

        alert(
            "Seating page elements were not found."
        );

        return;
    }


    const hallId =
        hallSelect.value;


    const sessionId =
        sessionSelect.value;


    if (!hallId) {

        alert(
            "Please select an examination hall."
        );

        return;
    }


    if (!sessionId) {

        alert(
            "Please select an exam session."
        );

        return;
    }


    try {

        const seats =
            await postData(
                "/seating/generate/" +
                sessionId +
                "/" +
                hallId
            );


        displaySeatingPlan(
            seats
        );

    }
    catch (error) {

        console.error(
            "Seating generation error:",
            error
        );

        alert(
            "Unable to generate seating plan.\n\n" +
            error.message
        );
    }
}


// =====================================================
//                DISPLAY SEATING PLAN
// =====================================================

function displaySeatingPlan(seats) {

    const seatingSection =
        document.getElementById(
            "seatingSection"
        );


    const grid =
        document.getElementById(
            "seatingGrid"
        );


    const title =
        document.getElementById(
            "planTitle"
        );


    if (
        !seatingSection ||
        !grid ||
        !title
    ) {

        return;
    }


    grid.innerHTML = "";


    seatingSection.style.display =
        "block";


    if (
        !seats ||
        seats.length === 0
    ) {

        grid.innerHTML = `

            <p>
                No seats were generated.
            </p>

        `;

        return;
    }


    const hall =
        seats[0].hall;


    const session =
        seats[0].examSession;


    title.textContent =
        hall.hallName +
        " - " +
        session.subject;


    const columns =
        parseInt(
            hall.columnCount
        );


    grid.style.gridTemplateColumns =
        `repeat(
            ${columns},
            minmax(130px, 1fr)
        )`;


    seats.forEach(function(seat) {

        const seatCard =
            document.createElement(
                "div"
            );


        seatCard.className =
            "seat-card";


        if (seat.student) {

            seatCard.innerHTML = `

                <div class="seat-number">
                    ${seat.seatNumber}
                </div>

                <div class="student-name">
                    ${seat.student.name}
                </div>

                <div class="register-number">
                    ${seat.student.registerNumber}
                </div>

                <div class="student-class">
                    ${seat.student.className}
                    -
                    ${seat.student.section}
                </div>

            `;

        }
        else {

            seatCard.classList.add(
                "empty-seat"
            );


            seatCard.innerHTML = `

                <div class="seat-number">
                    ${seat.seatNumber}
                </div>

                <div class="student-name">
                    Empty
                </div>

            `;

        }


        grid.appendChild(
            seatCard
        );

    });

}


// =====================================================
//                    SEARCH STUDENT
// =====================================================

async function searchStudent() {

    const input =
        document.getElementById(
            "registerNumber"
        );


    const resultSection =
        document.getElementById(
            "resultSection"
        );


    const studentResult =
        document.getElementById(
            "studentResult"
        );


    if (
        !input ||
        !resultSection ||
        !studentResult
    ) {

        return;
    }


    const registerNumber =
        input.value.trim();


    if (!registerNumber) {

        alert(
            "Please enter a register number."
        );

        return;
    }


    try {

        const seats =
            await getData(
                "/seating/student/" +
                encodeURIComponent(
                    registerNumber
                )
            );


        displayStudentResult(
            seats
        );

    }
    catch (error) {

        console.error(
            "Student search error:",
            error
        );


        resultSection.style.display =
            "block";


        studentResult.innerHTML = `

            <p>
                Student seating details
                could not be found.
            </p>

        `;

    }
}


// =====================================================
//              DISPLAY STUDENT SEARCH RESULT
// =====================================================

function displayStudentResult(seats) {

    const resultSection =
        document.getElementById(
            "resultSection"
        );


    const studentResult =
        document.getElementById(
            "studentResult"
        );


    if (
        !resultSection ||
        !studentResult
    ) {

        return;
    }


    resultSection.style.display =
        "block";


    if (
        !seats ||
        seats.length === 0
    ) {

        studentResult.innerHTML = `

            <p>
                No seating details found
                for this student.
            </p>

        `;

        return;
    }


    let html = "";


    seats.forEach(function(seat) {

        const student =
            seat.student;


        const hall =
            seat.hall;


        const session =
            seat.examSession;


        html += `

            <div class="student-result-card">

                <h3>
                    ${student.name}
                </h3>

                <p>
                    <strong>
                        Register Number:
                    </strong>

                    ${student.registerNumber}
                </p>

                <p>
                    <strong>
                        Class:
                    </strong>

                    ${student.className}
                </p>

                <p>
                    <strong>
                        Section:
                    </strong>

                    ${student.section}
                </p>

                <hr>

                <p>
                    <strong>
                        Exam:
                    </strong>

                    ${session.examName}
                </p>

                <p>
                    <strong>
                        Subject:
                    </strong>

                    ${session.subject}
                </p>

                <p>
                    <strong>
                        Exam Date:
                    </strong>

                    ${session.examDate}
                </p>

                <p>
                    <strong>
                        Hall:
                    </strong>

                    ${hall.hallName}
                </p>

                <p>
                    <strong>
                        Seat:
                    </strong>

                    ${seat.seatNumber}
                </p>

                <p>
                    <strong>
                        Row:
                    </strong>

                    ${seat.rowNumber}
                </p>

                <p>
                    <strong>
                        Column:
                    </strong>

                    ${seat.columnNumber}
                </p>

            </div>

        `;

    });


    studentResult.innerHTML =
        html;
}


// =====================================================
//                  PAGE INITIALIZATION
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        // Hall page

        if (
            document.getElementById(
                "hallTableBody"
            )
        ) {

            loadHalls();

        }


        // Student page

        if (
            document.getElementById(
                "studentTableBody"
            )
        ) {

            loadStudents();

        }


        // Exam session page

        if (
            document.getElementById(
                "sessionTableBody"
            )
        ) {

            loadSessions();

        }


        // Seating page

        if (
            document.getElementById(
                "hallSelect"
            )
        ) {

            loadHalls();

        }


        if (
            document.getElementById(
                "sessionSelect"
            )
        ) {

            loadSessions();

        }

    }
);