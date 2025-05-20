from app.models.expense import Expense
from app.db.db import db


class ExpenseService:
    @staticmethod
    def get_user_expenses(user_id):
        user_expenses = Expense.query.filter_by(user_id=user_id).all()
        if not user_expenses:
            raise ValueError("No expenses for this user")

        return user_expenses  # this is a list of expenses

    # we need to set the expense's user_id from the route
    @staticmethod
    def add_user_expense(expense_data):

        expense = Expense(
            amount=expense_data["amount"],
            category=expense_data["category"],
            user_id=expense_data["user_id"],
            created_on=expense_data["created_on"],
            name=expense_data["expense_name"],
        )
        try:
            db.session.add(expense)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return None

        return expense
