import motor.motor_asyncio
import sys
sys.path.insert(1, './scripts')
import Scheduler as sc
from fastapi import FastAPI
from fastapi_users import FastAPIUsers, models
from fastapi_users.authentication import JWTAuthentication
from fastapi_users.db import MongoDBUserDatabase
from starlette.requests import Request
from fastapi import BackgroundTasks

background_tasks_running = False
DATABASE_URL = "mongodb+srv://admin:RERWw4ifyreSYuiG@cryptoviz-f2rwb.azure.mongodb.net/test?retryWrites=true&w=majority"
SECRET = "|X|Th!5iS@S3CR3t|X|"

class User(models.BaseUser):
    pass


class UserCreate(User, models.BaseUserCreate):
    pass


class UserUpdate(User, models.BaseUserUpdate):
    pass


class UserDB(User, models.BaseUserDB):
    pass


client = motor.motor_asyncio.AsyncIOMotorClient(DATABASE_URL)
db = client["cryptoviz"]
collection = db["users"]
user_db = MongoDBUserDatabase(UserDB, collection)

auth_backends = [
    JWTAuthentication(secret=SECRET, lifetime_seconds=3600),
]

app = FastAPI()
fastapi_users = FastAPIUsers(
    user_db, auth_backends, User, UserCreate, UserUpdate, UserDB, SECRET,
)
app.include_router(fastapi_users.router, prefix="/users", tags=["users"])


@fastapi_users.on_after_register()
def on_after_register(user: User, request: Request):
    print(f"User {user.id} has registered.")


@fastapi_users.on_after_forgot_password()
def on_after_forgot_password(user: User, token: str, request: Request):
    print(f"User {user.id} has forgot their password. Reset token: {token}")

@app.get("/")
async def root(background_tasks: BackgroundTasks):
    global background_tasks_running
    if not background_tasks_running:
        background_tasks_running = True
        background_tasks.add_task(sc.schedule_tasks)
    return {"message": "Hello World"}
