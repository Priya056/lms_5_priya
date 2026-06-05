// localStorage utilities with "fa_" prefix

export const storage = {
  get: (key) => {
    try {
      const val = localStorage.getItem(`fa_${key}`);
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(`fa_${key}`, JSON.stringify(value));
    } catch {}
  },
  remove: (key) => {
    try {
      localStorage.removeItem(`fa_${key}`);
    } catch {}
  },
};

export const getSession = () => storage.get('session');
export const setSession = (s) => storage.set('session', s);
export const clearSession = () => storage.remove('session');

export const getUsers = () => storage.get('users') || [];
export const saveUsers = (users) => storage.set('users', users);

export const getSubmissions = () => storage.get('submissions') || [];
export const saveSubmissions = (subs) => storage.set('submissions', subs);

export const getXP = () => storage.get('xp') || { total: 0, level: 0, lastUpdated: null, weeklyXP: 0, weekStart: null };
export const saveXP = (xp) => storage.set('xp', xp);

export const getStreak = () => storage.get('streak') || { count: 0, lastDate: null };
export const saveStreak = (s) => storage.set('streak', s);

export const getBadges = () => storage.get('badges') || [];
export const saveBadges = (b) => storage.set('badges', b);

export const getFlashcardsDone = () => storage.get('flashcards_done') || {};
export const saveFlashcardsDone = (d) => storage.set('flashcards_done', d);

export const getNotes = (pageType, pageId) => storage.get(`notes_${pageType}_${pageId}`) || '';
export const saveNotes = (pageType, pageId, content) => storage.set(`notes_${pageType}_${pageId}`, content);

export const getChatHistory = (problemId) => storage.get(`chat_${problemId}`) || [];
export const saveChatHistory = (problemId, history) => storage.set(`chat_${problemId}`, history);

export const getQuizResult = (courseId, weekNum) => storage.get(`quiz_${courseId}_${weekNum}`);
export const saveQuizResult = (courseId, weekNum, result) => storage.set(`quiz_${courseId}_${weekNum}`, result);

export const getPomodoroToday = () => {
  const today = new Date().toISOString().slice(0, 10);
  const data = storage.get('pomodoro_today') || { date: today, count: 0 };
  if (data.date !== today) return { date: today, count: 0 };
  return data;
};
export const savePomodoroToday = (data) => storage.set('pomodoro_today', data);

export const getLastVisited = () => storage.get('last_visited') || {};
export const saveLastVisited = (courseId, route) => {
  const lv = getLastVisited();
  lv[courseId] = route;
  storage.set('last_visited', lv);
};
