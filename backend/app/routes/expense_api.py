import sys
from flask import Blueprint, request, jsonify
from app.controllers.expense_controller import ExpenseController
from app.cache import cache_user_expenses, delete_expenses_cache, redis_client
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
)
import logging
import redis

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)

api = Blueprint("expense_api", __name__)


@api.route("/expenses", methods=["GET"])
@jwt_required()
def get_user_expenses():
    """
    Get all expenses for the authenticated user
    ---
    tags:
      - Expenses
    security:
      - BearerAuth: []
    responses:
      200:
        description: A list of expenses for the authenticated user
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
                description: The expense ID
              amount:
                type: number
                description: The expense amount
              description:
                type: string
                description: The expense description
              date:
                type: string
                format: date
                description: The date of the expense
      401:
        description: Unauthorized - JWT token is missing or invalid
    """
    user_id = get_jwt_identity()
    try:
        # redis_client.ping()
        # logger.info(f"Redis ping successful for user {user_id}")

        cache_key = f"user:{user_id}:expenses"
        exists = redis_client.exists(cache_key)
        logger.info(f"Cache exists check for {user_id}: {exists}")

        @cache_user_expenses
        def cached_expenses(uid):
            return ExpenseController.get_user_expenses(uid)

        result = cached_expenses(user_id)
        return result

    except Exception as e:
        logger.error(f"Redis error: {e}")
        return ExpenseController.get_user_expenses(user_id)


@api.route("/expenses", methods=["POST"])
@jwt_required()
def add_expenses():
    user_id = get_jwt_identity()
    expense_data = request.get_json()
    expense_data["user_id"] = user_id
    expense = ExpenseController.add_expense(expense_data)

    delete_expenses_cache(user_id)

    if not expense:
        return {}
    return expense
