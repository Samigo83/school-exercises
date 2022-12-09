from dotenv import load_dotenv
import mysql.connector
import os

load_dotenv()

connection = mysql.connector.connect(
    host=os.environ.get('HOST'),
    port=3306,
    database=os.environ.get('DB_NAME'),
    user=os.environ.get('DB_USER'),
    password=os.environ.get('DB_PASS'),
    autocommit=True,
    )

ow_apikey=os.environ.get('OW_APIKEY')

