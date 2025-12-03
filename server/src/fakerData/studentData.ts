import { faker } from "@faker-js/faker";

// ---------- TYPES ----------
export interface MonthlyScore {
  month: string;
  avgScore: number;
}

export interface GradeDistribution {
  Exceptional: number;
  Proficient: number;
  Developing: number;
  Emerging: number;
  "Needs Attention": number;
}

export type SubmissionStatus = "Submitted" | "Pending" | "Late";

export interface TaskDetail {
  taskId: string;
  taskName: string;
  score: number;
  classAvg: number;
  submissionStatus: SubmissionStatus;
  evaluatedOn: Date;
  remarks: string;
  grade: keyof GradeDistribution;
}

export interface Student {
  id: string;
  studentName: string;
  totalActiveClasses: number;
  totalTasksCompleted: number;
  avgScore: number;
  monthlyScores: MonthlyScore[];
  gradeDistribution: GradeDistribution;
  taskDetails: TaskDetail[];
}

// ---------- HELPERS ----------
const getGradeCategory = (score: number): keyof GradeDistribution => {
  if (score >= 90) return "Exceptional";
  if (score >= 75) return "Proficient";
  if (score >= 60) return "Developing";
  if (score >= 45) return "Emerging";
  return "Needs Attention";
};

const getSubmissionStatus = (): SubmissionStatus => {
  const statuses: SubmissionStatus[] = ["Submitted", "Pending", "Late"];
  return faker.helpers.arrayElement(statuses);
};

const getRemark = (score: number): string => {
  if (score >= 90) {
    return faker.helpers.arrayElement([
      "Outstanding performance! Keep it up.",
      "Excellent work with great consistency.",
      "Exceptional understanding of the topic.",
      "Perfect execution and deep insight shown.",
      "Superb work — you set the benchmark high.",
    ]);
  } else if (score >= 75) {
    return faker.helpers.arrayElement([
      "Good job! You’ve clearly understood the material.",
      "Very solid performance — just a bit more polish needed.",
      "Well done! Keep aiming for excellence.",
      "Strong work with minor areas for improvement.",
      "Great effort — consistent and reliable output.",
    ]);
  } else if (score >= 60) {
    return faker.helpers.arrayElement([
      "Decent effort, but there’s room for improvement.",
      "You’re getting there — review weak areas for better results.",
      "Fair performance — try to revise key concepts.",
      "Satisfactory, but can improve with more practice.",
      "Needs more focus on fundamentals to reach the next level.",
    ]);
  } else if (score >= 45) {
    return faker.helpers.arrayElement([
      "Needs significant improvement — focus on basics.",
      "Incomplete understanding — revisit core topics.",
      "Below average — you can do better with consistent practice.",
      "Effort is visible, but outcomes are weak.",
      "Try revising and seeking help on difficult areas.",
    ]);
  } else {
    return faker.helpers.arrayElement([
      "Poor performance — immediate improvement needed.",
      "Lacks basic understanding — needs personal attention.",
      "Very low score — reattempt and focus required.",
      "Struggling with fundamentals — must revise thoroughly.",
      "Needs major improvement — consider extra practice sessions.",
    ]);
  }
};

// ---------- GENERATOR ----------
export const generateStudentData = (id: string = faker.string.uuid()): Student => {
  const totalActiveClasses = faker.number.int({ min: 3, max: 6 });
  const totalTasksCompleted = faker.number.int({ min: 15, max: 40 });
  const avgScore = faker.number.int({ min: 40, max: 100 });

  const monthlyScores: MonthlyScore[] = Array.from({ length: 12 }, () => ({
    month: faker.date.month({ abbreviated: true }),
    avgScore: faker.number.int({ min: 45, max: 100 }),
  }));

  const gradeDistribution: GradeDistribution = {
    Exceptional: faker.number.int({ min: 10, max: 30 }),
    Proficient: faker.number.int({ min: 20, max: 40 }),
    Developing: faker.number.int({ min: 10, max: 25 }),
    Emerging: faker.number.int({ min: 5, max: 15 }),
    "Needs Attention": faker.number.int({ min: 5, max: 10 }),
  };

  // ✅ Ensure task count matches totalTasksCompleted
  const taskDetails: TaskDetail[] = Array.from({ length: totalTasksCompleted }, () => {
    const score = faker.number.int({ min: 40, max: 100 });
    return {
      taskId: faker.string.uuid(),
      taskName: `${faker.hacker.verb()} ${faker.hacker.noun()}`,
      score,
      classAvg: faker.number.int({ min: 45, max: 95 }),
      submissionStatus: getSubmissionStatus(),
      evaluatedOn: faker.date.past({ years: 1 }),
      remarks: getRemark(score),
      grade: getGradeCategory(score),
    };
  });

  return {
    id,
    studentName: faker.person.fullName(),
    totalActiveClasses,
    totalTasksCompleted,
    avgScore,
    monthlyScores,
    gradeDistribution,
    taskDetails,
  };
};

// ---------- EXPORT MULTIPLE ----------
export const studentData: Student[] = Array.from({ length: 25 }, () => generateStudentData());

export default studentData;
