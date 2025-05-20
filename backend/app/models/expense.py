from decimal import Decimal
from app.db.db import db
from app.models.user import User


class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float(10, 2), nullable=False)
    category = db.Column(db.String, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    created_on = db.Column(db.String, nullable=False)
    name = db.Column(db.String, nullable=True)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        return {
            "id": self.id,
            "amount": (
                float(self.amount) if isinstance(self.amount, Decimal) else self.amount
            ),
            "category": self.category,
            "user_id": self.user_id,
            "created_on": self.created_on,
            "name": self.name,
        }
