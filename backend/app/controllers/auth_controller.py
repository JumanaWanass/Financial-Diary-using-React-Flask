from flask import jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
)
from app.services.user_service import UserService


class AuthController:
    @staticmethod
    def register(data):
        if UserService.get_by_username(data["username"]):
            return jsonify({"error": "Username exists"}), 400
        user = UserService.create_user(data)
        return jsonify({"message": "User created", "user": user.to_dict()}), 201

    @staticmethod
    def login(data):
        user = UserService.authenticate(data["username"], data["password"])
        if not user:
            return jsonify({"error": "Invalid credentials"}), 401
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        return jsonify(
            {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "user": user.to_dict(),
            }
        )

    @staticmethod
    @jwt_required()
    def logout():
        return jsonify({"message": "Logged out"})
