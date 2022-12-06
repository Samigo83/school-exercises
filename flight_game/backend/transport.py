class Transport:

    def __init__(self, name):
        self.name = name
        if self.name == 'AIRPLANE':
            self.consumption = 0.275
            self.speed = 600
            self.airports_to_land = "'small_airport', 'closed', 'medium_airport', 'large_airport'"
        elif self.name == 'FIGHTER':
            self.consumption = 0.5
            self.speed = 1200
            self.airports_to_land = "'heliport', 'small_airport', 'closed', 'seaplane_base', 'balloonport' 'medium_airport', 'large_airport'"
        elif self.name == 'HELICOPTER':
            self.consumption = 0.15
            self.speed = 300
            self.airports_to_land = "'heliport'"
        elif self.name == 'GLIDER':
            self.consumption = 0.05
            self.speed = 60
            self.airports_to_land = "'small_airport', 'closed', 'medium_airport', 'large_airport'"
        else:
            self.consumption = 0.01
            self.speed = 50
            self.airports_to_land = "'balloonport'"
