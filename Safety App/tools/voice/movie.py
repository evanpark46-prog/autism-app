"""Record the Hero Movies' lines, one natural Kokoro voice per character.

Run (same setup as generate.py):
    node tools/build-movie-lines.js
    .venv-voice/Scripts/python tools/voice/movie.py [--model-dir DIR]

Writes audio/movie/<lang>/<key>.mp3 + index.json. Resumable: existing clips
are skipped. Voices are a little slower than normal so every line is easy to
follow. Lines without a clip fall back to the device voice in the app.
"""
import argparse, json, os, sys, time
import numpy as np, lameenc

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from generate import say_fix, ensure_model, MODEL_DIR, FILES  # same pronunciation fixes

ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
OUT = os.path.join(ROOT, 'audio', 'movie')
# who -> {lang: (voice, kokoro lang code, speed)}
CAST = {
    'narrator': {'en': ('af_heart', 'en-us', 0.86), 'es': ('ef_dora', 'es', 0.88)},
    'alex':     {'en': ('af_jessica', 'en-us', 0.9), 'es': ('ef_dora', 'es', 0.95)},
    'nutty':    {'en': ('am_puck', 'en-us', 0.95), 'es': ('em_alex', 'es', 1.0)},
    'goat':     {'en': ('am_michael', 'en-us', 0.88), 'es': ('em_alex', 'es', 0.88)},
    'dad':      {'en': ('am_eric', 'en-us', 0.9), 'es': ('em_alex', 'es', 0.9)},
    'bear':     {'en': ('am_onyx', 'en-us', 0.86), 'es': ('em_santa', 'es', 0.86)},
    'hero':     {'en': ('bm_fable', 'en-gb', 0.88), 'es': ('em_santa', 'es', 0.92)},
}
# Voice shaping (ffmpeg Rubber Band). A child has a higher voice AND a smaller
# vocal tract: shift formants a little (formant=shifted) and pitch a little more
# (formant=preserved). Alex lands near 285 Hz, a 5-6 year old's speaking pitch.
SHAPE = {
    ('alex', 'en'): 'rubberband=pitch=1.18:formant=shifted:pitchq=quality,rubberband=pitch=1.15:formant=preserved:pitchq=quality',
    ('alex', 'es'): 'rubberband=pitch=1.2:formant=shifted:pitchq=quality,rubberband=pitch=1.33:formant=preserved:pitchq=quality',
    ('nutty', 'en'): 'rubberband=pitch=1.3:formant=shifted:pitchq=quality,rubberband=pitch=1.4:formant=preserved:pitchq=quality',
    ('nutty', 'es'): 'rubberband=pitch=1.3:formant=shifted:pitchq=quality,rubberband=pitch=1.3:formant=preserved:pitchq=quality',
    ('dad', 'es'): 'rubberband=pitch=0.9:formant=shifted:pitchq=quality',
    ('goat', 'es'): 'rubberband=pitch=1.07:formant=preserved:pitchq=quality',
}
VERSION = {'alex': 2, 'nutty': 3, 'goat': 2}   # bump to force re-recording a character after changing its voice

def encode(samples, sr, path, af):
    import subprocess
    pcm = (np.clip(samples, -1, 1) * 32767).astype(np.int16).tobytes()
    cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-f', 's16le', '-ar', str(sr), '-ac', '1', '-i', '-']
    if af: cmd += ['-af', af]
    cmd += ['-ar', '24000', '-ac', '1', '-b:a', '40k', '-f', 'mp3', path]
    subprocess.run(cmd, input=pcm, check=True)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--model-dir', default=MODEL_DIR)
    a = ap.parse_args()
    ensure_model(a.model_dir)
    from kokoro_onnx import Kokoro
    k = Kokoro(os.path.join(a.model_dir, FILES[0]), os.path.join(a.model_dir, FILES[1]))
    rows = json.load(open(os.path.join(HERE, 'movie-lines.json'), encoding='utf-8'))
    done = 0
    for r in rows:
        d = os.path.join(OUT, r['lang']); os.makedirs(d, exist_ok=True)
        path = os.path.join(d, r['key'] + '.mp3')
        ver = VERSION.get(r['who'], 1); os.makedirs(os.path.join(HERE, 'movie-stamps'), exist_ok=True); stamp = os.path.join(HERE, 'movie-stamps', r['lang'] + '-' + r['key'] + '.v')
        if os.path.exists(path) and (ver == 1 or os.path.exists(stamp + str(ver))): continue
        voice, code, speed = CAST.get(r['who'], CAST['narrator'])[r['lang']]
        text = say_fix(r['lang'], r['text']).replace('“', '').replace('”', '').replace('...', ', ')
        samples, sr = k.create(text, voice=voice, speed=speed, lang=code)
        loud = np.where(np.abs(samples) > 0.01)[0]
        if len(loud): samples = samples[max(0, loud[0] - int(sr * 0.05)): loud[-1] + int(sr * 0.12)]
        encode(samples, sr, path + '.part', SHAPE.get((r['who'], r['lang'])))
        if ver > 1: open(stamp + str(ver), 'w').close()
        for i in range(8):
            try: os.replace(path + '.part', path); break
            except PermissionError: time.sleep(0.5 * (i + 1))
        done += 1
        print(f"{r['lang']} {r['who']:8} {len(samples) / sr:4.1f}s  {r['text'][:60]}", flush=True)
    for lang in ('en', 'es'):
        d = os.path.join(OUT, lang)
        if os.path.isdir(d):
            json.dump(sorted(f[:-4] for f in os.listdir(d) if f.endswith('.mp3')), open(os.path.join(d, 'index.json'), 'w'), separators=(',', ':'))
    print('recorded', done, 'new clips')

if __name__ == '__main__':
    main()
