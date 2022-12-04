from flask import Flask, request
from flask_cors import CORS
from game import Game
from airport import Airport
from transport import Transport
from player import Player
from weather import Weather
import json

app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


def newgame(userinput, location, transport, continent):
    global g
    g = Game()
    global player
    player = Player()
    player.location = location
    player.name = userinput
    data = {'player_status': player,
            'location': Airport(location),
            'continent': Airport(location).continent_coords(continent),
            'goals': g.get_weather_goals(),
            'weather': Weather(Airport(location).latitude, Airport(location).longitude, g, player),
            'airports': Airport(location).airport_by_continent_and_transport(continent, Transport(transport))
    }
    json_data = json.dumps(data, default=lambda o: o.__dict__, indent=4)
    return json_data

def fly(location, prev_location, transport, continent):
    player.update_dist_budget_time_score(location, prev_location)
    data = {'player_status': player,
            'location': Airport(location),
            'continent': Airport(location).continent_coords(continent),
            'goals': g.goals,
            'weather': Weather(Airport(location).latitude, Airport(location).longitude, g, player),
            'airports': Airport(location).airport_by_continent_and_transport(continent, Transport(transport))
            }
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


# http://127.0.0.1:5000/flyto?loc=EFHK&continent=EU&transport=airplane
@app.route('/flyto')
def flyto():
    args = request.args
    loc = args.get("loc")
    prevloc = args.get("prevloc")
    transport = args.get('transport')
    continent = args.get('continent')
    data = fly(loc, prevloc, transport.upper(), continent.upper())
    return data


if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=5000)
