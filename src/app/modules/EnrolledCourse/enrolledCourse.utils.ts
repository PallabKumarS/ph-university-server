export const calculateGradeAndPoints = (totalMarks: number) => {
  let result = {
    grade: 'NA',
    gradePoints: 0,
  };

  if (totalMarks >= 0 && totalMarks <= 39) {
    result = {
      grade: 'F',
      gradePoints: 0.0,
    };
  } else if (totalMarks >= 40 && totalMarks <= 44) {
    result = {
      grade: 'D',
      gradePoints: 2.0,
    };
  } else if (totalMarks >= 45 && totalMarks <= 49) {
    result = {
      grade: 'D+',
      gradePoints: 2.25,
    };
  } else if (totalMarks >= 50 && totalMarks <= 54) {
    result = {
      grade: 'C',
      gradePoints: 2.5,
    };
  } else if (totalMarks >= 55 && totalMarks <= 59) {
    result = {
      grade: 'C+',
      gradePoints: 2.75,
    };
  } else if (totalMarks >= 60 && totalMarks <= 64) {
    result = {
      grade: 'B',
      gradePoints: 3.0,
    };
  } else if (totalMarks >= 65 && totalMarks <= 69) {
    result = {
      grade: 'B+',
      gradePoints: 3.25,
    };
  } else if (totalMarks >= 70 && totalMarks <= 74) {
    result = {
      grade: 'A-',
      gradePoints: 3.5,
    };
  } else if (totalMarks >= 75 && totalMarks <= 79) {
    result = {
      grade: 'A',
      gradePoints: 3.75,
    };
  } else if (totalMarks >= 80 && totalMarks <= 100) {
    result = {
      grade: 'A+',
      gradePoints: 4.0,
    };
  } else {
    result = {
      grade: 'NA',
      gradePoints: 0,
    };
  }

  return result;
};
