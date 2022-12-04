from config import connection
from geopy import distance
from transport import Transport


class Player:
    def __init__(self):
        self.name = ''
        self.score = 0
        self.co2_budget = 10000
        self.distance = 0
        self.travel_time = 0
        self.coordinates = []
        self.goals = []
        self.transport = Transport('AIRPLANE')

    def update_dist_budget_time_score(self, location, prevlocation):
        sql = f"SELECT airport.latitude_deg, airport.longitude_deg FROM airport, country " \
              f"WHERE country.iso_country = airport.iso_country " \
              f"and airport.ident = '{location}' UNION SELECT airport.latitude_deg, airport.longitude_deg " \
              f"FROM airport, country " \
              f"WHERE country.iso_country = airport.iso_country " \
              f"and airport.ident = '{prevlocation}'"
        query_cursor = connection.cursor()
        query_cursor.execute(sql)
        self.coordinates = query_cursor.fetchall()

        if len(self.coordinates) >= 2:
            dist = distance.distance(self.coordinates[0], self.coordinates[1]).km
            self.distance += round(float(dist), 1)

            self.co2_budget -= int(dist * 2 * self.transport.consumption * self.transport.speed / 1000)
            if self.co2_budget < 0:
                self.co2_budget = 0

            self.travel_time += round(float(dist / self.transport.speed), 1)

            self.score += int(self.co2_budget * (1 / self.travel_time ))

