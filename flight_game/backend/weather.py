import requests
from config import ow_apikey

class Weather:

    def check_weather_goals(self, game, player):
        for goal in game.goals:
            if goal.target == "TEMP":
                # temperature rule
                if self.temp >= goal.target_minvalue and self.temp <= goal.target_maxvalue:
                    self.meets_goals.append(goal.goalid)
            elif goal.target == "WEATHER":
                # weather type rule
                if self.main == goal.target_text:
                    self.meets_goals.append(goal.goalid)
            elif goal.target == "WIND":
                # wind rule
                if self.wind["speed"] >= goal.target_minvalue and self.wind["speed"] <= goal.target_maxvalue:
                    self.meets_goals.append(goal.goalid)

        for goal in game.goals:
            if not goal.reached and goal.goalid in self.meets_goals:
                player.goals.append(goal)
                goal.reached = True
        return

    def __init__(self, x, y, game, player):

        request = f"https://api.openweathermap.org/data/2.5/weather?lat={x}" \
                  f"&lon={y}&units=metric&appid={ow_apikey}"
        vastaus = requests.get(request).json()
        self.main = vastaus["weather"][0]["main"]
        self.description = vastaus["weather"][0]["description"]
        self.icon = "https://openweathermap.org/img/wn/" + vastaus["weather"][0]["icon"] + ".png"
        self.temp = vastaus["main"]["temp"]
        self.humidity = vastaus["main"]["humidity"]
        self.wind = {
            "speed": vastaus["wind"]["speed"],
            "deg": vastaus["wind"]["deg"]
        }

        self.meets_goals = []
        self.check_weather_goals(game, player)



