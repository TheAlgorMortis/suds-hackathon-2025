from app.db_models import (
    Module,
    Registration,
    Requisite,
    Review,
    Tutor,
    User,
    tutor_module,
)
from app.services.db_service import DbService
import json


def load_sample_data(db: DbService, json_file: str = "sample_data.json"):
    sess = db.session
    with open(json_file, "r") as f:
        data = json.load(f)  # pyright: ignore[reportAny]

    # Create users
    users_by_name = {}
    for u in data["users"]:
        user = User(**u)
        sess.add(user)
        users_by_name[u["username"]] = user

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

    for req in data["requisites"]:
        for i in range(len(req["children"])):
            parent_id = modules_by_code[req["parent"]].module_id
            child_id = modules_by_code[req["children"][i]].module_id
            r = Requisite(
                parent_id=parent_id, child_id=child_id, requisite_type=req["reqType"][i]
            )
            sess.add(r)
    for review in data["reviews"]:
        module = modules_by_code[review["module"]]
        user = users_by_name[review["username"]]
        rev = Review(
            user_id=user.user_id,
            module_id=module.module_id,
            title=review["title"],
            text=review["text"],
            rating=review["rating"],
            date=review["date"],
        )
        sess.add(rev)

    for t in data["tutors"]:
        user = users_by_name[t["username"]]
        tutor = Tutor(
            user_id=user.user_id,
            description=t["description"],
            hourly_rate=t["hourlyRate"],
        )
        sess.add(tutor)
        sess.commit()
        sess.refresh(tutor)
        for i in range(len(t["modules"])):
            module = modules_by_code[t["modules"][i]]
            _ = sess.execute(
                tutor_module.insert().values(
                    tutor_id=tutor.tutor_id, module_id=module.module_id
                )
            )

    sess.commit()


if __name__ == "__main__":
    db = DbService()
    db.clear_database()
    load_sample_data(db)
    db.close()
