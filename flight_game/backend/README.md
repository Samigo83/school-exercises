# Demopeli

Create .env file and add correct host, database, username and password

```
HOST=localhost
DB_NAME=somename
DB_USER=someuser
DB_PASS=somepassword
OW_APIKEY=someapikey
```
You have to add additional table to your flight_game database:

This creates table for continent geolocations.
http://bboxfinder.com/ was used to get the approximation of each continent's center.

CREATE TABLE continent(
code varchar(40),
latitude float,
longitude float,
primary key (code));

INSERT INTO continent(code, latitude, longitude)
VALUES
("EU",58.836490,39.418945),
("AF",-0.131836,17.006836),
("OC",-34.052659,148.227539),
("AS",22.715390,106.391602),
("AN",-77.561042,26.103516),
("NA",51.672555,-108.896484),
("SA",-17.308688,-58.886719);

ALTER TABLE country
ADD FOREIGN KEY (continent) REFERENCES continent(code);