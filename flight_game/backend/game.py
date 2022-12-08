from config import connection
from goal import Goal
from player import Player
from airport import Airport
from weather import Weather


def get_weather_goals():
    goals = []
    sql = "SELECT * FROM goal"
    query_cursor = connection.cursor()
    query_cursor.execute(sql)
    result = query_cursor.fetchall()
    for r in result:
        goal = Goal(r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7])
        goals.append(goal)
    return goals

class Game:

    def __init__(self, userinput, location, transport, continent):
        self.player_status = Player(userinput, transport)
        self.location = Airport(location)
        self.continent = Airport(location).continent_coords(continent)
        self.weather = Weather(self.location.latitude, self.location.longitude)
        self.airports = Airport(location).airport_by_continent_and_transport(continent, self.player_status.transport)
        self.goals = get_weather_goals()

    def get_weather_goals(self):
        goals = []
        sql = "SELECT * FROM goal"
        query_cursor = connection.cursor()
        query_cursor.execute(sql)
        result = query_cursor.fetchall()
        for r in result:
            goal = Goal(r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7])
            goals.append(goal)
        return goals

    def check_weather_goals(self):
        for goal in self.goals:
            if goal.target == "TEMP":
                # temperature rule
                if self.weather.temp >= goal.target_minvalue and self.weather.temp <= goal.target_maxvalue:
                    self.weather.meets_goals.append(goal.goalid)
            elif goal.target == "WEATHER":
                # weather type rule
                if self.weather.main == goal.target_text:
                    self.weather.meets_goals.append(goal.goalid)
            elif goal.target == "WIND":
                # wind rule
                if self.weather.wind["speed"] >= goal.target_minvalue and self.wind["speed"] <= goal.target_maxvalue:
                    self.weather.meets_goals.append(goal.goalid)

        for goal in self.goals:
            if not goal.reached and goal.goalid in self.weather.meets_goals:
                self.player_status.goals.append(goal)
                goal.reached = True
        return

    def update(self, location, continent):
        self.location = Airport(location)
        self.continent = Airport(location).continent_coords(continent)
        self.weather = Weather(self.location.latitude, self.location.longitude)
        self.airports = self.location.airport_by_continent_and_transport(continent, self.player_status.transport)
