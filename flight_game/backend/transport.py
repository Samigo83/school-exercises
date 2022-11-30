class Transport:

    def __init__(self, name):
        self.name = name
        if self.name == 'AIRPLANE':
            self.consumption = 275
            self.speed = 600
            self.airports_to_land = 'small_airport', 'closed', 'medium_airport', 'large_airport'
