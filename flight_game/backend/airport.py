from geopy import distance
from config import connection
import random


class Airport:

    def __init__(self, ident):
        self.ident = ident
        self.distance = 0

        sql = f"SELECT airport.name, airport.ident, airport.latitude_deg, airport.longitude_deg, airport.iso_country " \
              f"FROM airport, country " \
              f"WHERE country.iso_country = airport.iso_country " \
              f"AND airport.ident = '{ident}'"
        query_cursor = connection.cursor()
        query_cursor.execute(sql)
        result = query_cursor.fetchall()
        for i in result:
            self.name = i[0]
            self.latitude = i[2]
            self.longitude = i[3]
            self.country = i[4]

    def airport_by_continent_and_transport_country(self, continent, transport):
        sql = f"SELECT airport.name, airport.ident, airport.type, airport.latitude_deg, airport.longitude_deg, " \
              f"continent.code, airport.iso_country " \
              f"FROM airport, country, continent " \
              f"WHERE country.iso_country = airport.iso_country AND country.continent = continent.code " \
              f"and airport.continent = '{continent}' and airport.type in ({transport.airports_to_land}) " \
              f"and airport.iso_country='{self.country}'"
        query_cursor = connection.cursor()
        query_cursor.execute(sql)
        result = query_cursor.fetchall()
        print(result)
        airport_list = []
        if len(result) > 0:
            for airport in result:
                if airport[1] != self.ident:
                    distance = self.distance_to(airport[3], airport[4])
                    data = {'name': airport[0], 'ident': airport[1], 'latitude': airport[3],
                            'longitude': airport[4], 'distance': distance, 'continent': airport[5],
                            'iso_country': airport[6]
                            }
                    airport_list.append(data)
        if len(airport_list) > 40:
            return random.choices(airport_list, k=40)
        else:
            return airport_list

    def airport_by_continent_and_transport(self, continent, transport):
        sql = f"SELECT airport.name, airport.ident, airport.type, airport.latitude_deg, airport.longitude_deg, " \
              f"continent.code " \
              f"FROM airport, country, continent " \
              f"WHERE country.iso_country = airport.iso_country AND country.continent = continent.code " \
              f"and airport.continent = '{continent}' and airport.type in ({transport.airports_to_land})"
        query_cursor = connection.cursor()
        query_cursor.execute(sql)
        result = query_cursor.fetchall()
        airport_list = []
        if len(result) > 0:
            for airport in result:
                if airport[1] != self.ident:
                    distance = self.distance_to(airport[3], airport[4])
                    data = {'name': airport[0], 'ident': airport[1], 'latitude': airport[3],
                            'longitude': airport[4], 'distance': distance, 'continent': airport[5]
                            }
                    airport_list.append(data)
        if len(airport_list) > 20:
            return random.choices(airport_list, k=20)
        else:
            return airport_list

    def continent_coords(self, continent):
        sql = f"SELECT latitude, longitude, code FROM continent WHERE code='{continent}'"
        query_cursor = connection.cursor()
        query_cursor.execute(sql)
        coords = query_cursor.fetchone()
        return coords

    def distance_to(self, x, y):
        coords_1 = (self.latitude, self.longitude)
        coords_2 = (x, y)
        dist = distance.distance(coords_1, coords_2).km
        return int(dist)

