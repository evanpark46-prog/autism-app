/* ==========================================================================
   Safety Superheroes — local-only usage analytics
   Everything here reads/writes localStorage on the current browser only.
   Nothing is sent anywhere — there is no server. This exists so a parent
   checking this device can see which lessons a learner has been using.
   ========================================================================== */

const ANALYTICS_KEY = 'safetylib_analytics_v1';

function loadAnalytics(){
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && parsed.topics && parsed.recent) return parsed;
  } catch (e) { /* ignore corrupt data, fall through to fresh store */ }
  return { topics: {}, recent: [] };
}

function saveAnalytics(data){
  try { localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data)); } catch (e) { /* storage full/blocked */ }
}

function ensureTopicEntry(data, topicId){
  if (!data.topics[topicId]){
    data.topics[topicId] = { opens: 0, levelStarts: 0, levelCompletes: 0, flashcardOpens: 0, videoOpens: 0, lastVisited: null, inSitu: [] };
  }
  if (!data.topics[topicId].inSitu) data.topics[topicId].inSitu = [];
  return data.topics[topicId];
}

function trackEvent(topicId, action, meta){
  if (!topicId) return;
  const data = loadAnalytics();
  const entry = ensureTopicEntry(data, topicId);
  entry.lastVisited = new Date().toISOString();
  if (action === 'topic_open') entry.opens += 1;
  else if (action === 'level_start') entry.levelStarts += 1;
  else if (action === 'level_complete') entry.levelCompletes += 1;
  else if (action === 'flashcards_open') entry.flashcardOpens += 1;
  else if (action === 'video_open') entry.videoOpens += 1;

  data.recent.unshift({ ts: Date.now(), topicId, action, level: meta && meta.level });
  data.recent = data.recent.slice(0, 200);
  saveAnalytics(data);
}

// The real-world half of Behavioral Skills Training: whether the learner
// actually performed the skill in the real environment (a real crosswalk,
// a real doorbell), not just in the app. Kept as a history, not one flag --
// a single check today doesn't guarantee the skill holds up next month, and
// a caregiver re-checking later needs somewhere for that result to go too.
// `result` is one of 'independent' | 'coached' | 'not-yet'.
function recordInSitu(topicId, result, note){
  if (!topicId) return;
  const data = loadAnalytics();
  const entry = ensureTopicEntry(data, topicId);
  entry.inSitu.unshift({ date: new Date().toISOString(), result, note: note || '' });
  entry.inSitu = entry.inSitu.slice(0, 50);
  saveAnalytics(data);
}

function getInSituHistory(topicId){
  const data = loadAnalytics();
  return (data.topics[topicId] && data.topics[topicId].inSitu) || [];
}

function clearAnalytics(){
  try { localStorage.removeItem(ANALYTICS_KEY); } catch (e) { /* ignore */ }
}
