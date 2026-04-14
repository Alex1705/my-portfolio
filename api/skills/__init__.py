import azure.functions as func
import json
from datetime import datetime

def main(req: func.HttpRequest) -> func.HttpResponse:

    # api/skills/__init__.py — приклад структури відповіді:
    skills = [
        {'name': 'Python',        'level': 80},
        {'name': 'Microsoft Azure','level': 65},
        {'name': 'Linux',          'level': 70},
        {'name': 'Git / GitHub',   'level': 85},
        {'name': 'SQL',            'level': 60},
    ]
    # level — від 0 до 100 (відсоток заповнення progress bar)

    return func.HttpResponse(
        body    = json.dumps({"skills": skills}, ensure_ascii=False),
        mimetype= "application/json",
        headers = {"Access-Control-Allow-Origin": "*"}
    )
