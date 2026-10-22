// ability to add new student (email as id, first name, and last name)
// display student list (with ability to remove student)
// server component fetches students list from Neon, client component displays it, server action saves to Neon

const StudentPage = () => {

    return (
        <div>
            <h1>Students</h1>
            <p>description</p>

            <button>
                + New Student
            </button>

            <div>
                {
                    // map the student list onto a grid
                }
            </div>
        </div>
    )

}

export default StudentPage