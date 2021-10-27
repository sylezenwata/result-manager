const ResultRow = ({ result, number }) => {
    let { fullname, matno, college, dept, session, semester, level, course, unit, score, grade, grade_point, quality_p, remark } = result;
    return(
        <>
        <tr>
            <td>{number}.</td>
            <td>{fullname}</td>
            <td>{matno}</td>
            <td>{college}</td>
            <td>{dept}</td>
            <td>{session}</td>
            <td>{semester}</td>
            <td>{level}</td>
            <td>{course}</td>
            <td>{unit}</td>
            <td>{score}</td>
            <td>{grade}</td>
            <td>{grade_point}</td>
            <td>{quality_p}</td>
            <td>{remark}</td>
        </tr>
        </>
    )
};

export default ResultRow;