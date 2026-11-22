"""Record the app's read-aloud sentences with a natural neural voice.

Uses Kokoro-82M (Apache-2.0, https://huggingface.co/hexgrad/Kokoro-82M) via
kokoro-onnx, fully offline, no account or API key. Voices: af_heart (English),
ef_dora (Spanish).

Setup (once, any Python 3.10+):
    python -m venv .venv-voice
    .venv-voice/Scripts/python -m pip install kokoro-onnx lameenc numpy
    # model files (~350 MB) -- downloaded automatically into tools/voice/model/

Run:
    node tools/build-voice-list.js            # list every sentence the app says
    .venv-voice/Scripts/python tools/voice/generate.py [--workers 3] [--max-priority 2]
    node tools/build-voice-list.js --index    # (generate.py also does this)

It is resumable: sentences that already have an .mp3 are skipped, so you can
stop it any time and run it again later. Anything not recorded yet simply
falls back to the device's own voice in the app.
"""
import argparse, json, os, re, sys, time, urllib.request
from multiprocessing import Pool

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
OUT = os.path.join(ROOT, 'audio', 'voice')
MODEL_DIR = os.path.join(HERE, 'model')
MODEL_URL = 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/'
FILES = ['kokoro-v1.0.onnx', 'voices-v1.0.bin']

VOICES = {'en': ('af_heart', 'en-us', 0.92), 'es': ('ef_dora', 'es', 0.95)}
BITRATE = 32

def say_fix(lang, text):
    """Small pronunciation helps (the on-screen text is unchanged)."""
    if lang == 'en':
        text = re.sub(r'\b911\b', 'nine one one', text)
        text = text.replace('&', ' and ').replace('grown-up', 'grown up')
    else:
        text = re.sub(r'\b911\b', 'nueve uno uno', text)
        text = text.replace('&', ' y ')
    return text

def ensure_model(model_dir):
    os.makedirs(model_dir, exist_ok=True)
    for f in FILES:
        p = os.path.join(model_dir, f)
        if not os.path.exists(p):
            print('downloading', f, '...', flush=True)
            urllib.request.urlretrieve(MODEL_URL + f, p + '.part')
            os.replace(p + '.part', p)

_k = None
def init_worker(model_dir, threads):
    global _k
    import onnxruntime as ort
    from kokoro_onnx import Kokoro
    opts = ort.SessionOptions()
    opts.intra_op_num_threads = threads
    sess = ort.InferenceSession(os.path.join(model_dir, FILES[0]), opts, providers=['CPUExecutionProvider'])
    _k = Kokoro.from_session(sess, os.path.join(model_dir, FILES[1]))

def record(row):
    import numpy as np, lameenc
    lang, key, text = row['lang'], row['key'], row['text']
    path = os.path.join(OUT, lang, key + '.mp3')
    if os.path.exists(path):
        return 0.0
    voice, code, speed = VOICES[lang]
    try:
        samples, sr = _k.create(say_fix(lang, text), voice=voice, speed=speed, lang=code)
    except Exception as e:  # odd input: skip, the app falls back to the device voice
        print('  skip', repr(text), e, flush=True)
        return 0.0
    # Trim long leading/trailing silence, keep a short natural pad.
    loud = np.where(np.abs(samples) > 0.01)[0]
    if len(loud):
        pad = int(sr * 0.06)
        samples = samples[max(0, loud[0] - pad): loud[-1] + pad]
    enc = lameenc.Encoder()
    enc.set_bit_rate(BITRATE); enc.set_in_sample_rate(sr); enc.set_channels(1); enc.set_quality(2)
    data = enc.encode((np.clip(samples, -1, 1) * 32767).astype(np.int16).tobytes()) + enc.flush()
    tmp = path + '.part'
    with open(tmp, 'wb') as fh:
        fh.write(data)
    # Windows can briefly lock a new file (antivirus, indexers): retry, then skip
    # this clip rather than stopping the whole run (a later run picks it up).
    for attempt in range(8):
        try:
            os.replace(tmp, path)
            return len(samples) / sr
        except PermissionError:
            time.sleep(0.5 * (attempt + 1))
    print('  could not save', path, flush=True)
    return 0.0

def write_index():
    for lang in VOICES:
        d = os.path.join(OUT, lang)
        if not os.path.isdir(d):
            continue
        keys = sorted(f[:-4] for f in os.listdir(d) if f.endswith('.mp3'))
        with open(os.path.join(d, 'index.json'), 'w') as fh:
            json.dump(keys, fh, separators=(',', ':'))

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--workers', type=int, default=3)
    ap.add_argument('--threads', type=int, default=4, help='CPU threads per worker')
    ap.add_argument('--max-priority', type=int, default=9, help='0 games, 1 words, 2 level-1 lessons, 3 level 2, 4 level 3+, 5 villains/heroes, 6 UI')
    ap.add_argument('--lang', choices=['en', 'es'])
    ap.add_argument('--model-dir', default=MODEL_DIR)
    a = ap.parse_args()
    ensure_model(a.model_dir)
    rows = json.load(open(os.path.join(HERE, 'sentences.json'), encoding='utf-8'))
    rows = [r for r in rows if r['p'] <= a.max_priority and (not a.lang or r['lang'] == a.lang)]
    for lang in VOICES:
        os.makedirs(os.path.join(OUT, lang), exist_ok=True)
    todo = [r for r in rows if not os.path.exists(os.path.join(OUT, r['lang'], r['key'] + '.mp3'))]
    print(len(rows), 'sentences,', len(todo), 'to record', flush=True)
    t0 = time.time(); secs = 0.0
    with Pool(a.workers, initializer=init_worker, initargs=(a.model_dir, a.threads)) as pool:
        for i, d in enumerate(pool.imap(record, todo, chunksize=4), 1):
            secs += d
            if i % 100 == 0 or i == len(todo):
                write_index()
                el = time.time() - t0
                print(f'{i}/{len(todo)}  {secs/60:.1f} min of audio  {el/60:.1f} min elapsed  eta {el/i*(len(todo)-i)/60:.0f} min', flush=True)
    write_index()
    print('done', flush=True)

if __name__ == '__main__':
    main()
