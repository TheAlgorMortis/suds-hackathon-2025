from app.db_models import Module, Registration, User
from app.services.db_service import DbService
import json
from sqlalchemy.orm import Session


def load_sample_data(db: DbService, json_file: str = "sample_data.json"):
    sess = db.session
    with open(json_file, "r") as f:
        data = json.load(f)  # pyright: ignore[reportAny]

    # Create users
    users_by_name = {}
    for u in data["users"]:
        user = User(**u)
        sess.add(user)
        users_by_name[u["name"]] = user

    # Create modules
    modules_by_code = {}
    for m in data["modules"]:
        module = Module(**m)
        sess.add(module)
        modules_by_code[m["code"]] = module

    sess.flush()  # assign IDs before using them in registrations

    # Create registrations
    for r in data["registrations"]:
        user = users_by_name[r["user"]]
        module = modules_by_code[r["module"]]
        registration = Registration(user=user, module=module, status=r["status"])
        sess.add(registration)

    sess.commit()


if __name__ == "__main__":
    db = DbService()
    load_sample_data(db)
    db.close()
