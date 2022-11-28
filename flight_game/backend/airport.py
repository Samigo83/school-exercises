import random
import config
from weather import Weather
from geopy import distance
from config import connection

'''
class Airport:
    # lisätty data, jottei tartte jokaista lentokenttää hakea erikseen
    def __init__(self, ident, active=False, data=None):
        self.ident = ident
        self.active = active

        # vältetään kauhiaa määrää hakuja
        if data is None:
            # find airport from DB
            sql = "SELECT ident, name, latitude_deg, longitude_deg FROM Airport WHERE ident='" + ident + "'"
            print(sql)
            cur = config.conn.cursor()
            cur.execute(sql)
            res = cur.fetchall()
            if len(res) == 1:
                # game found
                self.ident = res[0][0]
                self.name = res[0][1]
                self.latitude = float(res[0][2])
                self.longitude = float(res[0][3])
        else:
            self.name = data['name']
            self.latitude = float(data['latitude'])
            self.longitude = float(data['longitude'])


    def find_nearby_airports(self):
        # print("Testing geopy...")
        # self.distanceTo(1, 2)
        lista = []
        # haetaan kaikki tiedot kerralla
        sql = "SELECT ident, name, latitude_deg, longitude_deg FROM Airport"
        print(sql)
        cur = config.conn.cursor()
        cur.execute(sql)
        res = cur.fetchall()
        for r in res:
            if r[0] != self.ident:
                # lisätty data, jottei jokaista kenttää tartte hakea
                # uudestaan konstruktorissa
                data = {'name': r[1], 'latitude': r[2], 'longitude': r[3]}
                nearby_apt = Airport(r[0], False, data)
                nearby_apt.distance = self.distanceTo(nearby_apt)
                lista.append(nearby_apt)
                nearby_apt.co2_consumption = self.co2_consumption(nearby_apt.distance)
        return lista

    def fetchWeather(self, game):
        self.weather = Weather(self, game)
        return

    def distanceTo(self, target):

        coords_1 = (self.latitude, self.longitude)
        coords_2 = (target.latitude, target.longitude)
        dist = distance.distance(coords_1, coords_2).km
        return int(dist)

    def co2_consumption(self, km):
        consumption = config.co2_per_flight + km * config.co2_per_km
        return consumption
'''

class Airport:

    def __init__(self, ident, active=False):
        self.ident = ident
        self.active = active

    def airport_by_continent_and_transport(self, continent, transport):
        sql = f"SELECT airport.name, airport.ident, airport.type, airport.latitude, airport.longitude FROM airport, country " \
              f"WHERE country.iso_country = airport.iso_country " \
              f"and airport.continent = '{continent}' and airport.type in ({transport})"
        query_cursor = connection.cursor()
        query_cursor.execute(sql)
        result = query_cursor.fetchall()
        return result
    def airport_by_ident(self):
        sql = f"SELECT airport.name, airport.ident, airport.latitude, airport.longitude FROM airport, country " \
              f"WHERE country.iso_country = airport.iso_country " \
              f"and airport.ident = '{self.ident}')"
        query_cursor = connection.cursor()
        query_cursor.execute(sql)
        result = query_cursor.fetchall()
        return result
