from app.db.db import db
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    name = db.Column(db.String, nullable=True)
    hashed_password = db.Column(db.String(256), nullable=False)

    def __init__(self, **kwargs):
        password = kwargs.pop("password", None)
        super().__init__(**kwargs)
        if password:
            self.hashed_password = generate_password_hash(password)

    def to_dict(self):
        return {"id": self.id, "username": self.username, "name": self.name}

    def check_password(self, password):
        return check_password_hash(self.hashed_password, password)
