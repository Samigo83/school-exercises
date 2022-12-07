from flask import Flask, request
from flask_cors import CORS
from game import Game
from config import connection
import json

app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

def get_topten():
    sql = f"SELECT * FROM top10 order by score desc"
    query_cursor = connection.cursor()
    query_cursor.execute(sql)
    return query_cursor.fetchall()

def newgame(userinput, location, transport, continent):
    global g
    g = Game(userinput, location, transport, continent)
    data = g
    json_data = json.dumps(data, default=lambda o: o.__dict__, indent=4)
    return json_data

def fly(location, prev_location, transport, continent):
    g.player_status.update(location, prev_location, transport)
    g.update(location, continent)
    data = g
    json_data = json.dumps(data, default=lambda o: o.__dict__, indent=4)
    return json_data

def refresh(location, continent, transport):
    g.player_status.refresh(transport)
    g.update(location, continent)
    data = g
    json_data = json.dumps(data, default=lambda o: o.__dict__, indent=4)
    return json_data

# http://127.0.0.1:5000/game?player=Vesa&loc=EFHK&continent=EU&transport=airplane
@app.route('/game')
def game():
    args = request.args
    player = args.get("player")
    loc = args.get("loc")
    transport = args.get('transport')
    continent = args.get('continent')
    data = newgame(player, loc, transport.upper(), continent.upper())
    return data

# http://127.0.0.1:5000/flyto?loc=EFHA&prevloc=EFHK&continent=EU&transport=airplane
@app.route('/flyto')
def flyto():
    args = request.args
    loc = args.get("loc")
    prevloc = args.get("prevloc")
    transport = args.get('transport')
    continent = args.get('continent')
    data = fly(loc, prevloc, transport.upper(), continent.upper())
    return data

# http://127.0.0.1:5000/refresh?loc=EFHKcontinent=EU&transport=airplane
@app.route('/refresh')
def refresh_game():
    args = request.args
    loc = args.get("loc")
    transport = args.get('transport')
    continent = args.get('continent')
    data = refresh(loc, continent.upper(), transport.upper())
    return data

# http://127.0.0.1:5000/topten
@app.route('/topten')
def get_topten_data():
    data = get_topten()
    json_data = json.dumps(data, default=lambda o: o.__dict__, indent=4)
    return json_data


if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=5000)
