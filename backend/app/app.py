from flask import Flask
from flask_cors import CORS
from app.config.config import get_config_by_name
from app.initialize_functions import initialize_db, initialize_swagger
from app.routes.expense_api import api as expense_api
from app.routes.auth import auth_bp as auth_api
from flask_jwt_extended import JWTManager


def create_app(config=None) -> Flask:
    """
    Create a Flask application.

    Args:
        config: The configuration object to use.

    Returns:
        A Flask application instance.
    """
    app = Flask(__name__)
    if config:
        app.config.from_object(get_config_by_name(config))

    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": ["http://localhost:3000"],
                "methods": ["GET", "POST", "PUT", "DELETE"],
                "allow_headers": ["Content-Type", "Authorization"],
                "supports_credentials": True,
            }
        },
    )
    jwt = JWTManager(app)
    blueprints = [expense_api, auth_api]
    for blueprint in blueprints:
        app.register_blueprint(blueprint, url_prefix="/api")
    # Initialize extensions
    initialize_db(app)

    # Initialize Swagger
    initialize_swagger(app)

    return app
