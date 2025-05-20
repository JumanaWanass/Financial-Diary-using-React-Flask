from werkzeug.security import generate_password_hash, check_password_hash
from app.db.db import db
from app.models.user import User


class UserService:
    @staticmethod
    def get_by_username(username):
        user = User.query.filter_by(username=username).first()
        return user

    @staticmethod
    def authenticate(username, password):
        user = UserService.get_by_username(username)
        if user and user.check_password(password):
            return user
        return None

    @staticmethod
    def create_user(data):
        if UserService.get_by_username(data["username"]):
            raise ValueError("Username exists")
        hashed_pw = generate_password_hash(data["password"])

        user = User(
            username=data["username"], hashed_password=hashed_pw, name=data["name"]
        )
        try:
            db.session.add(user)
            db.session.commit()
            return user
        except Exception as e:
            db.session.rollback()
            return None
