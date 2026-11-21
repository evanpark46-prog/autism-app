"""Build reports/Safety-Superheroes-Scenarios.xlsx from the app's lesson content.

Every scenario question and answer choice, in all 31 lessons x 3 levels, in
English and Spanish, plus an Overview of counts (live formulas) and a list of
lesson videos.

Update it any time lessons change:
    node tools/build-content.js          # after editing js/data.js
    python tools/build-scenario-sheet.py
"""
import datetime
import json
import os
import subprocess
import sys

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, 'reports')
OUT = os.path.join(OUT_DIR, 'Safety-Superheroes-Scenarios.xlsx')

LEVELS = {
    'en': ['Pre-K – Kindergarten', '1st – 3rd grade', '4th grade & up'],
    'es': ['Preescolar – Kínder', '1.º – 3.º grado', '4.º grado en adelante'],
}
TYPE_NAMES = {
    'en': {'decision': 'Choice', 'dialogue': 'Conversation', 'sequence': 'What comes next?', 'matching': 'Matching'},
    'es': {'decision': 'Elección', 'dialogue': 'Conversación', 'sequence': '¿Qué sigue?', 'matching': 'Emparejar'},
}
RESULT = {
    'en': {'right': 'Correct', 'wrong': 'Wrong', 'pair': 'Match pair'},
    'es': {'right': 'Correcta', 'wrong': 'Incorrecta', 'pair': 'Pareja'},
}
HEADERS = {
    'en': ['Lesson ID', 'Lesson', 'Level', 'Grade band', 'Question #', 'Question type', 'Story so far',
           'Question', 'Answer choice', 'Result', 'Feedback shown', 'What happens next (wrong answers)', 'New question? (1 = first row of a question)'],
    'es': ['ID de lección', 'Lección', 'Nivel', 'Grado', 'Pregunta #', 'Tipo de pregunta', 'La historia hasta ahora',
           'Pregunta', 'Opción de respuesta', 'Resultado', 'Retroalimentación', 'Lo que pasa después (respuestas incorrectas)', '¿Pregunta nueva? (1 = primera fila)'],
}

FONT = 'Arial'
HEADER_FILL = PatternFill('solid', fgColor='1E7FD8')
TITLE_FONT = Font(name=FONT, size=16, bold=True, color='13385E')
HEADER_FONT = Font(name=FONT, size=10, bold=True, color='FFFFFF')
BODY_FONT = Font(name=FONT, size=10)
BOLD_FONT = Font(name=FONT, size=10, bold=True)
RIGHT_FILL = PatternFill('solid', fgColor='E3F5E8')
WRONG_FILL = PatternFill('solid', fgColor='FFF0E9')
THIN = Side(style='thin', color='D0D7DE')
WRAP = Alignment(wrap_text=True, vertical='top')


def load_lessons():
    raw = subprocess.check_output(['node', os.path.join(ROOT, 'tools', 'export-content-json.js')], cwd=ROOT)
    return json.loads(raw.decode('utf-8'))


def question_text(step):
    if step['type'] == 'dialogue':
        return '\n'.join(f"{l.get('speaker') + ': ' if l.get('speaker') else ''}{l['text']}" for l in step['lines'])
    if step['type'] == 'sequence' and step.get('stepsSoFar'):
        done = '\n'.join(f'{i + 1}. {s}' for i, s in enumerate(step['stepsSoFar']))
        return f"{done}\n→ {step.get('text', '')}"
    return step.get('text', '')


def scenario_rows(lesson, lang):
    content = lesson[lang]
    rows = []
    for li, level in enumerate(content['story']['levels']):
        story_so_far = ''
        qnum = 0
        for step in level['steps']:
            if step['type'] == 'narrative':
                story_so_far = step.get('text', '')
                continue
            if step['type'] == 'matching':
                qnum += 1
                for pi, pair in enumerate(step['pairs']):
                    rows.append([lesson['id'], content['title'], li + 1, LEVELS[lang][li], qnum,
                                 TYPE_NAMES[lang]['matching'], story_so_far, step.get('text', ''),
                                 f"{pair['left']} → {pair['right']}", RESULT[lang]['pair'], '', '', 1 if pi == 0 else 0])
                continue
            if not step.get('choices'):
                continue
            qnum += 1
            for ci, choice in enumerate(step['choices']):
                outcome = choice.get('outcome') or []
                rows.append([lesson['id'], content['title'], li + 1, LEVELS[lang][li], qnum,
                             TYPE_NAMES[lang].get(step['type'], step['type']), story_so_far, question_text(step),
                             choice['text'], RESULT[lang]['right' if choice.get('correct') else 'wrong'],
                             choice.get('feedback', ''), '  →  '.join(outcome), 1 if ci == 0 else 0])
    return rows


def style_header(ws, row, ncols):
    for c in range(1, ncols + 1):
        cell = ws.cell(row=row, column=c)
        cell.font = HEADER_FONT
        cell.fill = HEADER_FILL
        cell.alignment = Alignment(wrap_text=True, vertical='center')
        cell.border = Border(bottom=THIN)


def build_scenarios_sheet(wb, title, lessons, lang):
    ws = wb.create_sheet(title)
    ws.append(HEADERS[lang])
    style_header(ws, 1, len(HEADERS[lang]))
    ws.row_dimensions[1].height = 42
    right, wrong = RESULT[lang]['right'], RESULT[lang]['wrong']
    for lesson in lessons:
        for r in scenario_rows(lesson, lang):
            ws.append(r)
            row = ws.max_row
            fill = RIGHT_FILL if r[9] == right else WRONG_FILL if r[9] == wrong else None
            for c in range(1, len(r) + 1):
                cell = ws.cell(row=row, column=c)
                cell.font = BODY_FONT
                cell.alignment = WRAP
                cell.border = Border(bottom=THIN)
            if fill:
                ws.cell(row=row, column=10).fill = fill
                ws.cell(row=row, column=9).fill = fill
    widths = [20, 26, 7, 18, 10, 16, 40, 44, 40, 11, 40, 60, 14]
    for i, w in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = w
    ws.freeze_panes = 'C2'
    ws.auto_filter.ref = f'A1:{get_column_letter(len(widths))}{ws.max_row}'
    return ws


def build_overview(wb, lessons, en_title):
    ws = wb.active
    ws.title = 'Overview'
    S = f"'{en_title}'"
    ws['A1'] = 'Safety Superheroes — Scenario & Answer Library'
    ws['A1'].font = TITLE_FONT
    ws['A2'] = ('Every story question and answer choice across all lessons and levels. Counts below are live formulas '
                f'over the {en_title} tab. Spanish has the same questions (see the Spanish tab).')
    ws['A2'].font = BODY_FONT
    ws['A3'] = f'Generated from the app content on {datetime.date.today().isoformat()} — see the "How to update" tab.'
    ws['A3'].font = Font(name=FONT, size=9, italic=True, color='52645F')

    ws['A5'] = 'At a glance'; ws['A5'].font = BOLD_FONT
    first, last = 14, 14 + len(lessons) - 1
    glance = [
        ('Lessons', f'=COUNTA(A{first}:A{last})'),
        ('Levels per lesson (Pre-K–K, 1st–3rd, 4th+)', 3),
        ('Story questions (per language)', f'=SUM(F{first}:F{last})'),
        ('Answer choices (per language)', f'=SUM(G{first}:G{last})'),
        ('Wrong answers with a “what happens next” story', f'=SUM(I{first}:I{last})'),
        ('Languages', 2),
    ]
    for i, (label, val) in enumerate(glance):
        ws.cell(row=6 + i, column=1, value=label).font = BODY_FONT
        c = ws.cell(row=6 + i, column=2, value=val)
        c.font = BOLD_FONT
        c.number_format = '#,##0'
        if not str(val).startswith('='):
            c.font = Font(name=FONT, size=10, bold=True, color='0000FF')  # hardcoded input
    ws.cell(row=7, column=3, value='Fixed by app design: each lesson has 3 grade-level stories.').font = Font(name=FONT, size=9, italic=True, color='52645F')
    ws.cell(row=11, column=3, value='English and Spanish, fully translated.').font = Font(name=FONT, size=9, italic=True, color='52645F')

    hdr = ['Lesson', 'Lesson ID', 'Level 1 questions', 'Level 2 questions', 'Level 3 questions', 'Total questions',
           'Answer choices', 'Wrong answers', 'Wrong answers with “what happens next”', 'Lesson video']
    hrow = first - 1
    for i, h in enumerate(hdr, 1):
        ws.cell(row=hrow, column=i, value=h)
    style_header(ws, hrow, len(hdr))
    ws.row_dimensions[hrow].height = 42
    for i, lesson in enumerate(lessons):
        r = first + i
        ws.cell(row=r, column=1, value=lesson['en']['title'])
        ws.cell(row=r, column=2, value=lesson['id'])
        for lv in (1, 2, 3):
            ws.cell(row=r, column=2 + lv, value=f'=SUMIFS({S}!$M:$M,{S}!$A:$A,$B{r},{S}!$C:$C,{lv})')
        ws.cell(row=r, column=6, value=f'=SUM(C{r}:E{r})')
        ws.cell(row=r, column=7, value=f'=COUNTIFS({S}!$A:$A,$B{r},{S}!$J:$J,"<>Match pair")')
        ws.cell(row=r, column=8, value=f'=COUNTIFS({S}!$A:$A,$B{r},{S}!$J:$J,"Wrong")')
        ws.cell(row=r, column=9, value=f'=COUNTIFS({S}!$A:$A,$B{r},{S}!$J:$J,"Wrong",{S}!$L:$L,"<>")')
        vid = (lesson['en'].get('video') or {}).get('youtubeId')
        if vid:
            c = ws.cell(row=r, column=10, value='Watch on YouTube')
            c.hyperlink = f'https://www.youtube.com/watch?v={vid}'
            c.font = Font(name=FONT, size=10, color='1E7FD8', underline='single')
        for c in range(1, 10):
            ws.cell(row=r, column=c).font = BODY_FONT
            ws.cell(row=r, column=c).border = Border(bottom=THIN)
        for c in range(3, 10):
            ws.cell(row=r, column=c).number_format = '#,##0'
    tr = last + 1
    ws.cell(row=tr, column=1, value='Total').font = BOLD_FONT
    for c in range(3, 10):
        col = get_column_letter(c)
        cell = ws.cell(row=tr, column=c, value=f'=SUM({col}{first}:{col}{last})')
        cell.font = BOLD_FONT
        cell.number_format = '#,##0'
        cell.border = Border(top=Side(style='medium', color='13385E'))
    ws.cell(row=tr, column=1).border = Border(top=Side(style='medium', color='13385E'))
    for i, w in enumerate([34, 22, 11, 11, 11, 11, 11, 11, 18, 18], 1):
        ws.column_dimensions[get_column_letter(i)].width = w
    ws.freeze_panes = f'A{first}'


def build_videos(wb, lessons):
    ws = wb.create_sheet('Videos')
    hdr = ['Lesson', 'Lesson ID', 'Video (in-app title)', 'YouTube link', 'Pause-and-answer questions']
    ws.append(hdr)
    style_header(ws, 1, len(hdr))
    for lesson in lessons:
        v = lesson['en'].get('video') or {}
        ws.append([lesson['en']['title'], lesson['id'], v.get('title', ''), '', len(v.get('checkpoints') or [])])
        r = ws.max_row
        if v.get('youtubeId'):
            url = f"https://www.youtube.com/watch?v={v['youtubeId']}"
            c = ws.cell(row=r, column=4, value=url)
            c.hyperlink = url
        for c in range(1, 6):
            ws.cell(row=r, column=c).font = BODY_FONT
        ws.cell(row=r, column=4).font = Font(name=FONT, size=10, color='1E7FD8', underline='single')
    for i, w in enumerate([34, 22, 40, 46, 14], 1):
        ws.column_dimensions[get_column_letter(i)].width = w
    ws.freeze_panes = 'A2'


def build_howto(wb):
    ws = wb.create_sheet('How to update')
    lines = [
        ('How to update this spreadsheet', TITLE_FONT),
        ('This file is generated from the app’s lesson content, so it always matches what learners see.', BODY_FONT),
        ('', BODY_FONT),
        ('1. Edit lessons in js/data.js (both the English and Spanish blocks).', BODY_FONT),
        ('2. Run:  node tools/build-content.js', BODY_FONT),
        ('3. Run:  python tools/build-scenario-sheet.py', BODY_FONT),
        ('4. Open reports/Safety-Superheroes-Scenarios.xlsx — every tab is rebuilt.', BODY_FONT),
        ('', BODY_FONT),
        ('Tabs', BOLD_FONT),
        ('Overview — counts per lesson (live formulas over the Scenarios tab) and video links.', BODY_FONT),
        ('Scenarios (English) / Scenarios (Spanish) — one row per answer choice. Use the filter arrows to view one lesson or level.', BODY_FONT),
        ('Videos — the YouTube video used in each lesson.', BODY_FONT),
        ('', BODY_FONT),
        ('Column guide (Scenarios tabs)', BOLD_FONT),
        ('Result — Correct (green) or Wrong (peach). Matching questions list each correct pair as “Match pair”.', BODY_FONT),
        ('What happens next — for wrong answers, the short story the app plays out before “rewinding” to the lesson.', BODY_FONT),
        ('New question? — 1 on the first row of each question; the Overview uses it to count questions.', BODY_FONT),
        ('', BODY_FONT),
        ('Note: edits made directly in this spreadsheet are not sent back to the app — change the lessons in js/data.js, then rebuild.', Font(name=FONT, size=10, italic=True, color='A1150B')),
    ]
    for i, (text, font) in enumerate(lines, 1):
        c = ws.cell(row=i, column=1, value=text)
        c.font = font
    ws.column_dimensions['A'].width = 120


def main():
    lessons = load_lessons()
    wb = Workbook()
    en_title, es_title = 'Scenarios (English)', 'Scenarios (Spanish)'
    build_overview(wb, lessons, en_title)
    build_scenarios_sheet(wb, en_title, lessons, 'en')
    build_scenarios_sheet(wb, es_title, lessons, 'es')
    build_videos(wb, lessons)
    build_howto(wb)
    # No cached values are written for formulas, so ask Excel/Sheets to
    # compute everything when the file opens.
    from openpyxl.workbook.properties import CalcProperties
    wb.calculation = CalcProperties(fullCalcOnLoad=True)
    os.makedirs(OUT_DIR, exist_ok=True)
    wb.save(OUT)
    print(OUT)


if __name__ == '__main__':
    sys.exit(main())
