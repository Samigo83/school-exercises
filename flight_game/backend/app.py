import json

from flask import Flask, request
from flask_cors import CORS

import config


app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


'''
# http://127.0.0.1:5000/flyto?game=fEC7n0loeL95awIxgY7M&dest=EFHK&consumption=123
@app.route('/flyto')
def flyto():
    args = request.args
    id = args.get("game")
    dest = args.get("dest")
    consumption = args.get("consumption")
    json_data = fly(id, dest, consumption)
    print("*** Called flyto endpoint ***")
    return json_data
'''

# http://127.0.0.1:5000/game?player=Vesa&loc=EFHK&continent=EU&transport=airplane
@app.route('/game')
def game():
    args = request.args
    player = args.get("player")
    loc = args.get("loc")
    transport = args.get('transport')
    continent = args.get('continent')
    json_data = {'playername': player, 'location': loc, 'transport': transport, 'continent': continent}
    return json_data

if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=5000)
