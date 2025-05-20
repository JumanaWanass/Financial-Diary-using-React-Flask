from flask import jsonify
from app.services.expense_service import ExpenseService
from datetime import date, datetime


class ExpenseController:
    @staticmethod
    def get_user_expenses(user_id):
        expenses = ExpenseService.get_user_expenses(user_id)
        if not expenses:
            return jsonify({"message": "No expenses found for this user"})

        return jsonify([expense.to_dict() for expense in expenses])

    @staticmethod
    def add_expense(expense_data):
        if not expense_data["amount"]:
            return jsonify({"error": "Expense is missing amount"})

        if not expense_data["user_id"]:
            return jsonify({"error": "Expense is missing user's id"})

        if not expense_data["created_on"]:
            return jsonify({"error": "Expense is missing creation date"})

        created_on = expense_data["created_on"]
        try:

            dt = datetime.fromisoformat(created_on.replace("Z", "+00:00"))
            expense_data["created_on"] = dt.isoformat()

        except ValueError:
            print("Invalid isoformat string")

        expense = ExpenseService.add_user_expense(expense_data)
        if not expense:
            return jsonify({"error": "Task was not added"})

        return jsonify(expense.to_dict())
