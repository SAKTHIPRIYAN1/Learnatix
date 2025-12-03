// ---------- MOCK CLASSROOM DATA GENERATOR ----------
// Generates consistent classroom and task data with Faker.

import { faker } from "@faker-js/faker";

// ---------- TYPES ----------
export interface MonthlyScore {
  month: string;
  avgScore: number;
}

export interface GradeDistribution {
  A: number;
  B: number;
  C: number;
}

export interface Task {
  taskId: string;
  taskName: string;
  assignedMonth: string;
  classId: string;
  classAvg: number;
  gradeDistribution: GradeDistribution;
  completionRate: number;
  totalSubmissions: number;
}

export interface Classroom {
  classId: string;
  className: string;
  totalStudents: number;
  avgScore: number;
  gradeDistribution: GradeDistribution; // Students' grade spread
  gradeCategory: string; // Class performance level (Exceptional etc.)
  improvement: number;
  activeTasks: number;
  avgCompletionRate: number;
  monthlyScores: MonthlyScore[];
  tasks: Task[];
}

// ---------- CONFIGURATION ----------
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ---------- HELPERS ----------
function getPerformanceCategory(score: number): string {
  if (score >= 90) return "Exceptional";
  if (score >= 75) return "Proficient";
  if (score >= 60) return "Developing";
  if (score >= 45) return "Emerging";
  return "Needs Attention";
}

// Weighted random grade distribution that sums to totalStudents
function generateGradeDistribution(totalStudents: number): GradeDistribution {
  const aRatio = faker.number.float({ min: 0.2, max: 0.4 });
  const bRatio = faker.number.float({ min: 0.3, max: 0.5 });
  const cRatio = 1 - (aRatio + bRatio);

  const A = Math.round(totalStudents * aRatio);
  const B = Math.round(totalStudents * bRatio);
  const C = totalStudents - (A + B);

  return { A, B, C };
}

// Generate class average based on grade distribution
function calculateAverageScore(grades: GradeDistribution): number {
  const totalStudents = grades.A + grades.B + grades.C;
  const avg =
    (grades.A * 90 + grades.B * 75 + grades.C * 60) / totalStudents +
    faker.number.float({ min: -3, max: 3 });
  return Math.min(100, Math.max(40, Number(avg.toFixed(2))));
}

// ---------- TASK GENERATION ----------
function generateTasks(classId: string, months: string[], baseAvg: number): Task[] {
  const numTasks = faker.number.int({ min: 3, max: 6 });
  const tasks: Task[] = [];

  for (let i = 0; i < numTasks; i++) {
    const month = faker.helpers.arrayElement(months);

    // Task average loosely correlated with class performance
    const classAvg = Math.min(100, Math.max(40, baseAvg + faker.number.float({ min: -5, max: 5 })));

    const gradeDistribution: GradeDistribution = {
      A: faker.number.int({ min: 5, max: 12 }),
      B: faker.number.int({ min: 8, max: 15 }),
      C: faker.number.int({ min: 3, max: 8 }),
    };

    tasks.push({
      taskId: faker.string.uuid(),
      taskName: faker.word.words({ count: { min: 1, max: 3 } }),
      assignedMonth: month,
      classId,
      classAvg: Number(classAvg.toFixed(2)),
      gradeDistribution,
      completionRate: Number(faker.number.float({ min: 50, max: 100 }).toFixed(2)),
      totalSubmissions: faker.number.int({ min: 10, max: 50 }),
    });
  }

  return tasks;
}

// ---------- CLASSROOM GENERATION ----------
function generateClassrooms(num = 10): { classData: Classroom[]; taskData: Task[] } {
  const classrooms: Classroom[] = [];
  const allTasks: Task[] = [];

  for (let i = 0; i < num; i++) {
    const classId = faker.string.uuid();
    const className = `${faker.word.adjective()} ${faker.word.noun()} ${faker.number.int({ min: 1, max: 5 })}`;
    const totalStudents = faker.number.int({ min: 30, max: 60 });

    // Grade distribution and average score
    const gradeDistribution = generateGradeDistribution(totalStudents);
    const avgScore = calculateAverageScore(gradeDistribution);

    // Monthly scores follow class average trend
    const monthlyScores: MonthlyScore[] = MONTHS.map((month) => ({
      month,
      avgScore: Math.min(100, Math.max(40, avgScore + faker.number.float({ min: -5, max: 5 }))),
    }));

    // Tasks
    const tasks = generateTasks(classId, MONTHS, avgScore);
    allTasks.push(...tasks);

    const improvement = faker.number.float({ min: -5, max: 10 });
    const avgCompletionRate = faker.number.float({ min: 60, max: 95 });

    classrooms.push({
      classId,
      className,
      totalStudents,
      avgScore: Number(avgScore.toFixed(2)),
      gradeDistribution,
      gradeCategory: getPerformanceCategory(avgScore),
      improvement: Number(improvement.toFixed(2)),
      activeTasks: tasks.length,
      avgCompletionRate: Number(avgCompletionRate.toFixed(2)),
      monthlyScores,
      tasks,
    });
  }

  return { classData: classrooms, taskData: allTasks };
}

// ---------- ANALYTICS FUNCTIONS ----------
export function getTopAndLeastClasses(classes: Classroom[]) {
  const sorted = [...classes].sort((a, b) => b.avgScore - a.avgScore);
  return {
    topClass: sorted[0],
    leastClass: sorted[sorted.length - 1],
  };
}

export function getMonthlyAverages(classes: Classroom[]) {
  const { topClass, leastClass } = getTopAndLeastClasses(classes);

  const overallMonthly = MONTHS.map((month, i) => {
    const avg =
      classes.reduce((acc, c) => acc + c.monthlyScores[i].avgScore, 0) /
      classes.length;
    return { month, avgScore: Number(avg.toFixed(2)) };
  });

  return {
    topClassMonthly: topClass.monthlyScores,
    overallMonthly,
    leastClassMonthly: leastClass.monthlyScores,
  };
}

export function getGradeDistributionByClass(classes: Classroom[]) {
  return classes.map((c) => ({
    className: c.className,
    A: c.gradeDistribution.A,
    B: c.gradeDistribution.B,
    C: c.gradeDistribution.C,
  }));
}


export function getPerformanceCategories(classes: Classroom[]) {
  const categories: Record<string, number> = {
    Exceptional: 0,
    Proficient: 0,
    Developing: 0,
    Emerging: 0,
    "Needs Attention": 0,
  };

  for (const c of classes) {
    const cat = getPerformanceCategory(c.avgScore);
    categories[cat]++;
  }

  // Convert to pieData format
  const pieData = Object.entries(categories).map(([name, value]) => ({
    name,
    value,
  }));

  return pieData;
}


// ---------- EXPORTS ----------
export const { classData, taskData } = generateClassrooms(12);
