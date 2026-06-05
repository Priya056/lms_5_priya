import { getXP, saveXP, getStreak, saveStreak, getBadges, saveBadges, getSubmissions } from './storage';
import { badges as badgeDefs } from '../data/badges';
import { problems } from '../data/problems';

export const XP_LEVELS = [
  { name: 'Beginner', min: 0, max: 99, color: '#7070a0' },
  { name: 'Coder', min: 100, max: 299, color: '#14b8a6' },
  { name: 'Hacker', min: 300, max: 699, color: '#8b5cf6' },
  { name: 'Master', min: 700, max: Infinity, color: '#f59e0b' },
];

export function getLevel(xpTotal) {
  return XP_LEVELS.find((l) => xpTotal >= l.min && xpTotal <= l.max) || XP_LEVELS[0];
}

export function getLevelProgress(xpTotal) {
  const level = getLevel(xpTotal);
  const idx = XP_LEVELS.indexOf(level);
  if (idx === XP_LEVELS.length - 1) return 100;
  const next = XP_LEVELS[idx + 1];
  return Math.round(((xpTotal - level.min) / (next.min - level.min)) * 100);
}

export function addXP(amount) {
  const xp = getXP();
  const today = new Date().toISOString().slice(0, 10);
  const weekStart = getWeekStart();

  if (xp.weekStart !== weekStart) {
    xp.weeklyXP = 0;
    xp.weekStart = weekStart;
  }

  xp.total += amount;
  xp.weeklyXP = (xp.weeklyXP || 0) + amount;
  xp.lastUpdated = new Date().toISOString();
  saveXP(xp);

  // Update leaderboard entry
  try {
    const session = JSON.parse(localStorage.getItem('fa_session') || 'null');
    if (session) {
      const subs = getSubmissions().filter(s => s.userId === session.userId && s.passed);
      const solvedIds = [...new Set(subs.map(s => s.problemId))];
      const cs50pSolved = solvedIds.filter(id => id.startsWith('cs50p')).length;
      const cs50aiSolved = solvedIds.filter(id => id.startsWith('cs50ai')).length;
      const topCourse = cs50pSolved >= cs50aiSolved ? 'cs50p' : 'cs50ai';
      const entry = { name: session.name, xp: xp.total, solved: solvedIds.length, topCourse, weeklyXP: xp.weeklyXP };
      localStorage.setItem(`fa_leaderboard_${session.userId}`, JSON.stringify(entry));
    }
  } catch {}

  return xp;
}

export function updateStreak() {
  const streak = getStreak();
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (streak.lastDate === today) return streak;

  if (streak.lastDate === yesterday) {
    streak.count += 1;
  } else if (streak.lastDate !== today) {
    streak.count = 1;
  }
  streak.lastDate = today;
  saveStreak(streak);
  return streak;
}

function getWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day;
  return new Date(now.setDate(diff)).toISOString().slice(0, 10);
}

export function checkAndUnlockBadges({ problemId, courseId, weekNum, passed, hintsOpened, startTime, failCount }) {
  const existingBadges = getBadges();
  const existingIds = new Set(existingBadges.map((b) => b.id));
  const newBadges = [];
  const submissions = getSubmissions();
  const session = JSON.parse(localStorage.getItem('fa_session') || 'null');
  const userSubs = session ? submissions.filter((s) => s.userId === session.userId) : submissions;
  const passedSubs = userSubs.filter((s) => s.passed);
  const passedIds = [...new Set(passedSubs.map((s) => s.problemId))];

  const xpData = getXP();
  const streak = getStreak();
  const now = new Date();
  const hour = now.getHours();

  const checkBadge = (id, condition) => {
    if (!existingIds.has(id) && condition) {
      newBadges.push({ id, unlockedAt: new Date().toISOString() });
    }
  };

  checkBadge('first_blood', passed && passedIds.length === 1);
  checkBadge('on_fire', streak.count >= 5);
  checkBadge('speed_demon', passed && startTime && (Date.now() - startTime) < 60000);
  checkBadge('no_hints', passed && !hintsOpened);
  checkBadge('persistent', passed && failCount >= 3);
  checkBadge('century', xpData.total >= 100);
  checkBadge('night_owl', hour >= 23 || hour < 3);
  checkBadge('debugger', userSubs.length >= 10);
  checkBadge('prolific', userSubs.length >= 25);
  checkBadge('grandmaster', xpData.total >= 700);

  // Perfect week check
  const weekProblems = problems.filter((p) => p.courseId === courseId && p.weekNum === weekNum);
  const weekSolved = weekProblems.every((p) => passedIds.includes(p.id));
  checkBadge('perfect_week', weekSolved && weekProblems.length > 0);

  // Half way / completionist
  const courseProblems = problems.filter((p) => p.courseId === courseId);
  const courseSolved = passedIds.filter((id) => courseProblems.some((p) => p.id === id)).length;
  checkBadge('half_way', courseSolved >= Math.floor(courseProblems.length / 2));
  checkBadge('completionist', courseSolved >= courseProblems.length && courseProblems.length > 0);

  // Double trouble
  const todayStr = new Date().toISOString().slice(0, 10);
  const todaySubs = passedSubs.filter((s) => s.submittedAt && s.submittedAt.startsWith(todayStr));
  const coursesToday = new Set(todaySubs.map((s) => s.courseId));
  checkBadge('double_trouble', coursesToday.size >= 2);

  // Week warrior
  checkBadge('week_warrior', streak.count >= 7);

  if (newBadges.length > 0) {
    saveBadges([...existingBadges, ...newBadges]);
  }

  return newBadges;
}
