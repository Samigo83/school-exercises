from config import connection
from geopy import distance
from transport import Transport


class Player:

    def __init__(self, name, transport):
        self.name = name
        self.score = 0
        self.co2_budget = 10000
        self.distance = 0
        self.travel_time = 0
        self.coordinates = []
        self.flight_coords = []
        self.goals = []
        self.transport = Transport(transport)
        self.to_topten = False

    def update(self, location, prevlocation, transport):
        sql = f"SELECT airport.latitude_deg, airport.longitude_deg FROM airport, country " \
              f"WHERE country.iso_country = airport.iso_country " \
              f"and airport.ident = '{location}' UNION SELECT airport.latitude_deg, airport.longitude_deg " \
              f"FROM airport, country " \
              f"WHERE country.iso_country = airport.iso_country " \
              f"and airport.ident = '{prevlocation}'"
        query_cursor = connection.cursor()
        query_cursor.execute(sql)
        self.coordinates = query_cursor.fetchall()
        self.transport = Transport(transport)

        if len(self.coordinates) >= 2:

            self.flight_coords = []
            dist = distance.distance(self.coordinates[0], self.coordinates[1]).km
            self.distance += round(float(dist), 1)
            self.travel_time += round(float(dist / self.transport.speed), 1)
            self.score += int(self.co2_budget * (1 / self.travel_time ))

            self.co2_budget -= int(dist * 2 * self.transport.consumption * self.transport.speed / 1000)
            if self.co2_budget < 0:
                self.co2_budget = 0
                self.check_for_topten()

            flight_vector_x_multip = self.coordinates[0][0] - self.coordinates[1][0]
            flight_vector_y_multip = self.coordinates[0][1] - self.coordinates[1][1]

            u_vector_x_multip = self.coordinates[1][0]
            u_vector_y_multip = self.coordinates[1][1]

            for i in range(100, 0, -1):
                x = u_vector_x_multip + (1/i * flight_vector_x_multip)
                y = u_vector_y_multip + (1/i * flight_vector_y_multip)
                coords = [x, y]
                self.flight_coords.append(coords)

    def refresh(self, transport):
        self.flight_coords = []
        self.transport = Transport(transport)

    def check_for_topten(self):
        sql = f"SELECT id, name, score FROM top10 WHERE score in " \
              f"(SELECT min(score) FROM top10) order by id desc"
        sql2 = f"SELECT * FROM top10"
        query_cursor = connection.cursor()
        query_cursor.execute(sql)
        lowest_score = query_cursor.fetchall()
        query_cursor2 = connection.cursor()
        query_cursor2.execute(sql2)
        query_cursor2.fetchall()
        if query_cursor2.rowcount < 10 and self.score > 0:
            sql = f"INSERT INTO top10 (name, score) VALUES ('{self.name}', '{self.score}')"
            query_cursor = connection.cursor()
            query_cursor.execute(sql)
            self.to_topten = True
        elif query_cursor2.rowcount == 10 and self.score > lowest_score[0][2]:
            sql = f"UPDATE top10 SET name = '{self.name}', score = '{self.score}' WHERE ID = {lowest_score[0][0]}"
            query_cursor = connection.cursor()
            query_cursor.execute(sql)
            self.to_topten = True
        else:
            self.to_topten = False






