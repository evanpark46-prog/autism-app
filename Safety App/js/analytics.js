/* ==========================================================================
   Safety Scouts — local-only usage analytics
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

function trackEvent(topicId, action, meta){
  if (!topicId) return;
  const data = loadAnalytics();
  if (!data.topics[topicId]){
    data.topics[topicId] = { opens: 0, levelStarts: 0, levelCompletes: 0, flashcardOpens: 0, videoOpens: 0, lastVisited: null };
  }
  const entry = data.topics[topicId];
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

function clearAnalytics(){
  try { localStorage.removeItem(ANALYTICS_KEY); } catch (e) { /* ignore */ }
}
