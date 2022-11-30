from geopy import distance
from config import connection
import random

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

    def __init__(self, ident, transport, continent, active=True):
        self.ident = ident
        self.active = active
        self.transport = transport
        self.continent = continent
        self.distance = 0

        sql = f"SELECT airport.name, airport.ident, airport.latitude_deg, airport.longitude_deg FROM airport, country " \
              f"WHERE country.iso_country = airport.iso_country " \
              f"and airport.ident = '{ident}'"
        query_cursor = connection.cursor()
        query_cursor.execute(sql)
        result = query_cursor.fetchall()
        for i in result:
            self.name = i[0]
            self.latitude = i[2]
            self.longitude = i[3]

    def airport_by_continent_and_transport(self):
        sql = f"SELECT airport.name, airport.ident, airport.type, airport.latitude_deg, airport.longitude_deg FROM airport, country " \
              f"WHERE country.iso_country = airport.iso_country " \
              f"and airport.continent = '{self.continent}' and airport.type in {self.transport.airports_to_land}"
        query_cursor = connection.cursor()
        query_cursor.execute(sql)
        result = query_cursor.fetchall()
        airport_list = []
        for airport in result:
            if airport[1] != self.ident:
                distance = self.distance_to(airport[3], airport[4])
                data = {'name': airport[0], 'ident': airport[1], 'latitude': airport[3],
                        'longitude': airport[4], 'distance': distance, 'weather': ' Here call weather for this airport',
                        'active': False}
                airport_list.append(data)
        return random.choices(airport_list, k=20)

    def distance_to(self, x, y):
        coords_1 = (self.latitude, self.longitude)
        coords_2 = (x, y)
        dist = distance.distance(coords_1, coords_2).km
        return int(dist)

    # Weather function
