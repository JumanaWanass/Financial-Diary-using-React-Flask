from flask import Blueprint, request

from flask_jwt_extended import (
    JWTManager,
    jwt_required,
    create_access_token,
    get_jwt_identity,
)

from app.controllers.expense_controller import ExpenseController

api = Blueprint("expense_api", __name__)


@api.route("/expenses", methods=["GET"])
@jwt_required()
def get_user_expenses():
    user_id = get_jwt_identity()
    expenses = ExpenseController.get_user_expenses(user_id)
    if not expenses:
        return None
    return expenses


@api.route("/expenses", methods=["POST"])
@jwt_required()
def add_expenses():
    user_id = get_jwt_identity()
    expense_data = request.get_json()
    expense_data["user_id"] = user_id
    expense = ExpenseController.add_expense(expense_data)
    if not expense:
        return None
    return expense
