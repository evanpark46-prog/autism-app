"""Build reports/Safety-Superheroes-Image-Prompts.xlsx (+ .csv) — one
ready-to-paste image-generation prompt for every story scene and every
answer choice, each with the exact filename the app looks for.

Workflow:
  1. Paste the MASTER STYLE PROMPT (tab "Start here") into the image tool once.
  2. For each row, paste the row's prompt, generate, and save the image as the
     row's "Save as" path inside the app folder (any of .webp / .png / .jpg).
  3. Run:  node tools/build-choice-images.js   (registers the new files)
     The app shows each picture automatically; rows without a picture keep
     the current artwork.

Re-run this after editing lessons:
    node tools/build-content.js
    python tools/build-image-prompts.py
"""
import csv
import json
import os
import subprocess

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, 'reports')
XLSX = os.path.join(OUT_DIR, 'Safety-Superheroes-Image-Prompts.xlsx')
CSV = os.path.join(OUT_DIR, 'Safety-Superheroes-Image-Prompts.csv')

LEVEL_AGE = ['Pre-K to Kindergarten', '1st to 3rd grade', '4th grade and up']

MASTER_STYLE = """You are illustrating a children's safety picture book called "Safety Superheroes" for autistic kids ages 4–12. I will send you one scene at a time. Keep EVERY image in this exact same style and with the same main character.

STYLE
- Warm, flat children's-book illustration with soft rounded shapes, clean dark outlines, and gentle shading. Bright but calm colors (sky blue, sunny yellow, grass green, soft coral). Simple, uncluttered backgrounds with only the objects that matter to the scene.
- Landscape 4:3. Characters large and easy to read; faces show clear, simple emotions (happy, unsure, worried, proud).
- NO words, letters, numbers, signs with writing, speech bubbles, or logos anywhere in the image.

MAIN CHARACTER — "Alex" (must look identical in every image)
- A gender-neutral child about 7 years old, warm medium-brown skin, short curly dark-brown hair, round friendly face.
- Always wears: a mustard-yellow hoodie with a small white star on the chest, blue jeans, red sneakers.
- Other people: ordinary, friendly-looking, diverse adults and kids. Helpers wear clear uniforms (police, firefighter, lifeguard, store worker with a name tag, teacher with a lanyard). Strangers look like normal everyday people — never creepy, scary, or villain-like.

SAFETY RULES FOR EVERY IMAGE (very important)
- Nothing frightening: no injuries, blood, weapons, crying in pain, fire touching a person, or a child in close-up danger.
- Show consequences gently through body language and setting: a worried face, a grown-up looking around for Alex, a car stopping with Alex safely on the curb, smoke in a hallway seen from a distance, a phone screen glowing.
- Body-safety, secrets, and dating scenes: everyone is fully clothed; show only faces, posture, and distance (for example a child holding up a hand to say stop, or talking to a trusted grown-up). No touching beyond a handshake, a high-five, or a hand on a shoulder.
- "Right answer" images feel safe and proud. "Wrong answer" images feel uh-oh / unsure, never scary.

Reply to each scene with only the image."""

HOW_TO = [
    ('1', 'Open your image tool (ChatGPT with image generation, Gemini, Midjourney, etc.).'),
    ('2', 'Paste the MASTER STYLE PROMPT below once at the start of the chat. Upload your first good Alex picture back into the chat later if the character starts to drift.'),
    ('3', 'Go to the "Prompts" tab. Work top to bottom (Priority 1 first: what happens after wrong answers).'),
    ('4', 'Copy a row\'s "Prompt" cell, paste it, and generate.'),
    ('5', 'Save the picture into the app folder using that row\'s "Save as" path, e.g. img/choices/fire-safety/L1-S02-C1.webp (.webp, .png or .jpg all work). Type "x" in the Done column.'),
    ('6', 'After saving a batch, run:  node tools/build-choice-images.js  — then the app shows the new pictures automatically. Rows you skip keep today\'s picture.'),
    ('Tip', 'Smaller files load faster for kids: aim for about 1024×768 and compress (e.g. squoosh.app → WebP).'),
    ('Tip', 'If lessons are edited, regenerate this sheet: node tools/build-content.js, then python tools/build-image-prompts.py. Filenames stay the same for unchanged scenes.'),
]


def load_content():
    raw = subprocess.check_output(['node', os.path.join(ROOT, 'tools', 'export-content-json.js')], cwd=ROOT)
    return json.loads(raw.decode('utf-8'))


def clean(s):
    return ' '.join(str(s or '').replace('“', '"').replace('”', '"').split())


def sent(s):
    """Text as a sentence that ends with exactly one period-like mark."""
    s = clean(s).rstrip()
    return s if not s or s[-1] in '.!?"’' else s + '.'


def bare(s):
    return clean(s).rstrip(' .')


def scene_context(steps, i):
    """The story leading into step i: previous narration + this step's setup."""
    step = steps[i]
    parts = []
    prev = steps[i - 1] if i > 0 else None
    if prev and prev.get('type') == 'narrative' and step.get('type') != 'narrative':
        parts.append(sent(prev.get('text')))
    if step.get('type') == 'dialogue':
        parts.append(' '.join(f'{clean(l.get("speaker"))} says: "{clean(l.get("text"))}"' for l in step.get('lines', [])))
    elif step.get('type') == 'sequence':
        so_far = step.get('stepsSoFar') or []
        if so_far:
            parts.append('What already happened: ' + ' Then '.join(clean(x) for x in so_far))
    elif step.get('type') == 'narrative':
        parts.append(sent(step.get('text')))
    return ' '.join(p for p in parts if p)


def build_rows(data):
    rows = []
    for topic in data:
        tid = topic['id']
        title = clean(topic['en'].get('title'))
        for li, level in enumerate(topic['en']['story']['levels']):
            steps = level.get('steps', [])
            for si, step in enumerate(steps):
                stype = step.get('type')
                if stype == 'matching':
                    continue
                base = f'img/choices/{tid}/L{li + 1}-S{si + 1:02d}'
                ctx = scene_context(steps, si)
                question = clean(step.get('text')) if stype != 'narrative' else ''
                age = LEVEL_AGE[min(li, 2)]
                # Scene picture (shown before an answer is picked)
                scene_prompt = (f'Scene for the lesson "{title}" ({age}). {ctx}'
                                + (f' The moment just before Alex decides: "{bare(question)}?"' if question and not bare(question).endswith('?') else (f' The moment just before Alex decides: "{bare(question)}"' if question else ''))
                                + ' Show the setting and the people involved, with Alex in the middle of the moment. Same style and Alex as always. No text in the image.')
                rows.append(dict(priority=3, kind='Scene', lesson=title, id=tid, level=li + 1, step=si + 1, choice='',
                                 result='', answer='', save=f'{base}-scene.webp', prompt=scene_prompt))
                for ci, choice in enumerate(step.get('choices') or []):
                    text = clean(choice.get('text'))
                    if choice.get('correct'):
                        why = clean(choice.get('feedback'))
                        prompt = (f'Scene for the lesson "{title}" ({age}). {ctx} '
                                  f'The SAFE answer is: "{bare(text)}." '
                                  f'Show the happy, safe version of this moment{": " + bare(why) if why else ""}. '
                                  'Alex looks calm and proud; any grown-ups look pleased. Same style and Alex as always. No text in the image.')
                        rows.append(dict(priority=2, kind='Right answer', lesson=title, id=tid, level=li + 1, step=si + 1, choice=ci + 1,
                                         result='Right', answer=text, save=f'{base}-C{ci + 1}.webp', prompt=prompt))
                    else:
                        beats = [clean(b) for b in (choice.get('outcome') or [])]
                        nxt = ' Then '.join(sent(b) for b in beats[:2]) if beats else sent(choice.get('feedback'))
                        prompt = (f'Scene for the lesson "{title}" ({age}). {ctx} '
                                  f'The UNSAFE answer picked is: "{bare(text)}." '
                                  f'Show what happens next: {nxt} '
                                  'Keep it gentle and not scary: show the "uh-oh" moment through Alex\'s unsure or worried face, body language, and the setting. No injuries. Same style and Alex as always. No text in the image.')
                        rows.append(dict(priority=1, kind='Wrong answer → what happens', lesson=title, id=tid, level=li + 1, step=si + 1, choice=ci + 1,
                                         result='Wrong', answer=text, save=f'{base}-C{ci + 1}.webp', prompt=prompt))
    rows.sort(key=lambda r: (r['priority'], r['id'], r['level'], r['step'], r['choice'] or 0))
    return rows


def write_csv(rows):
    with open(CSV, 'w', newline='', encoding='utf-8-sig') as f:
        w = csv.writer(f)
        w.writerow(['priority', 'kind', 'lesson', 'lesson_id', 'level', 'step', 'choice', 'result', 'answer_text', 'save_as', 'prompt'])
        for r in rows:
            w.writerow([r['priority'], r['kind'], r['lesson'], r['id'], r['level'], r['step'], r['choice'], r['result'], r['answer'], r['save'], r['prompt']])


def write_xlsx(rows):
    wb = Workbook()
    head_font = Font(name='Arial', bold=True, color='FFFFFF')
    head_fill = PatternFill('solid', fgColor='2F6FD6')
    body = Font(name='Arial', size=10)
    wrap = Alignment(wrap_text=True, vertical='top')

    ws = wb.active
    ws.title = 'Start here'
    ws['A1'] = 'Safety Superheroes — picture prompts'
    ws['A1'].font = Font(name='Arial', size=16, bold=True)
    ws['A2'] = f'{len(rows)} pictures: every answer choice and every story scene, in all 31 lessons and 3 levels.'
    ws['A2'].font = body
    r = 4
    ws.cell(r, 1, 'How to use').font = Font(name='Arial', size=12, bold=True)
    for step, text in HOW_TO:
        r += 1
        ws.cell(r, 1, step).font = Font(name='Arial', bold=True)
        c = ws.cell(r, 2, text)
        c.font = body
        c.alignment = wrap
    r += 2
    ws.cell(r, 1, 'Progress').font = Font(name='Arial', size=12, bold=True)
    last = len(rows) + 1
    for label, formula in [
        ('Pictures done', f"=COUNTIF(Prompts!L2:L{last},\"x\")"),
        ('Pictures total', f"=COUNTA(Prompts!K2:K{last})"),
        ('Percent done', f"=IF(B{r + 2}=0,0,B{r + 1}/B{r + 2})"),
        ('Priority 1 left (wrong answers)', f"=COUNTIFS(Prompts!A2:A{last},1,Prompts!L2:L{last},\"<>x\")"),
        ('Priority 2 left (right answers)', f"=COUNTIFS(Prompts!A2:A{last},2,Prompts!L2:L{last},\"<>x\")"),
        ('Priority 3 left (scenes)', f"=COUNTIFS(Prompts!A2:A{last},3,Prompts!L2:L{last},\"<>x\")"),
    ]:
        r += 1
        ws.cell(r, 1, label).font = body
        c = ws.cell(r, 2, formula)
        c.font = body
        if label == 'Percent done':
            c.number_format = '0.0%'
    r += 2
    ws.cell(r, 1, 'MASTER STYLE PROMPT (paste once at the start)').font = Font(name='Arial', size=12, bold=True)
    r += 1
    c = ws.cell(r, 1, MASTER_STYLE)
    c.font = Font(name='Arial', size=10)
    c.alignment = wrap
    ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=2)
    ws.row_dimensions[r].height = 409
    ws.column_dimensions['A'].width = 34
    ws.column_dimensions['B'].width = 110

    ps = wb.create_sheet('Prompts')
    headers = ['Priority', 'Picture for', 'Lesson', 'Lesson ID', 'Level', 'Step', 'Choice', 'Right/Wrong', 'Answer text', 'Prompt (copy this)', 'Save as', 'Done (x)']
    for ci, h in enumerate(headers, 1):
        c = ps.cell(1, ci, h)
        c.font = head_font
        c.fill = head_fill
        c.alignment = Alignment(vertical='center', wrap_text=True)
    fill_wrong = PatternFill('solid', fgColor='FFF1E6')
    fill_right = PatternFill('solid', fgColor='EAF8EF')
    for ri, row in enumerate(rows, 2):
        vals = [row['priority'], row['kind'], row['lesson'], row['id'], row['level'], row['step'], row['choice'], row['result'], row['answer'], row['prompt'], row['save'], '']
        for ci, v in enumerate(vals, 1):
            c = ps.cell(ri, ci, v)
            c.font = body
            c.alignment = wrap
            if row['result'] == 'Wrong':
                c.fill = fill_wrong
            elif row['result'] == 'Right':
                c.fill = fill_right
    widths = [8, 16, 22, 20, 6, 6, 7, 10, 34, 90, 34, 8]
    for ci, w in enumerate(widths, 1):
        ps.column_dimensions[get_column_letter(ci)].width = w
    ps.freeze_panes = 'A2'
    ps.auto_filter.ref = f'A1:L{len(rows) + 1}'
    wb.calculation.fullCalcOnLoad = True
    wb.save(XLSX)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    rows = build_rows(load_content())
    write_csv(rows)
    write_xlsx(rows)
    counts = {}
    for r in rows:
        counts[r['kind']] = counts.get(r['kind'], 0) + 1
    print(XLSX)
    print(CSV)
    print(len(rows), counts)


if __name__ == '__main__':
    main()
