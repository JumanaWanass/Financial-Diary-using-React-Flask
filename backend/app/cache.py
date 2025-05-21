import json
import sys
import redis
from functools import wraps
import os
from flask import Response
import logging


redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    db=0,
    decode_responses=True,
)

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)

CACHE_EXPIRATION = 300  # in seconds, that's 5 minutes


def cache_user_expenses(f):
    @wraps(f)
    # kwargs is keyword arguments, args is positional arguments
    def decorated_function(*args, **kwargs):
        user_id = args[0]

        if not user_id:
            return f(*args, **kwargs)  # can't cache without user_id

        cache_key = f"user:{user_id}:expenses"
        cached_data = redis_client.get(cache_key)

        if cached_data:
            logger.info(
                f"Cache hit for user {user_id}: Returning expenses from Redis cache"
            )
            # Deserialize the cached data
            return Response(cached_data, mimetype="application/json")

        response = f(*args, **kwargs)  # if not in cache, call the original function

        if response:
            try:
                response_data = response.get_data(as_text=True)
                redis_client.setex(cache_key, CACHE_EXPIRATION, response_data)
                logger.info(
                    f"Cache miss for user {user_id}: Stored expenses in Redis cache"
                )
            except TypeError as e:
                logger.error(f"Cache error: Could not serialize data: {e}")

        return response

    return decorated_function


def delete_expenses_cache(user_id):
    cache_key = f"user:{user_id}:expenses"
    redis_client.delete(cache_key)
    logger.info(f"Cache invalidated for user {user_id}")
