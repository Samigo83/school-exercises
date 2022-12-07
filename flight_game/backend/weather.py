import requests
from config import ow_apikey


class Weather:

    def __init__(self, x, y):
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




