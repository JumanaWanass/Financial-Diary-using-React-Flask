from flask import Flask
from flasgger import Swagger
from app.db.db import db


def initialize_db(app: Flask):
    with app.app_context():
        db.init_app(app)
        db.create_all()


def initialize_swagger(app: Flask):
    with app.app_context():
        swagger = Swagger(app)
        return swagger
