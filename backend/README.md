# Python + FastAPI + Alembic + Docker ReadMe Guide

## Setup to Dev

### Starting

If new dependencies were added:

```bash
uv sync
```

Start docker container with db:

```bash
sudo docker compose up -d
```

(d flag if you want it detached, i.e. not block that terminal. recommended)

Start venv:

```bash
source .venv/bin/activate
```


If there are new db revisions (alembic migrations):

```bash
alembic upgrade head
```

Run backend:

```bash
fastapi dev app/main.py
```

Should be good to dev now.

### Stopping

Stop docker container:
```bash
sudo docker compose down
```
You can add -v to delete all the data in the db too when you run the above command

and Ctrl-C in the fastapi terminal

## Other Commands

**Create a new db revision**
```bash
alembic revision --autogenerate -m "update users table"
```

Remember to run `alembic upgrade head` to apply it to the db (container must be running for this)

```bash

```

```bash
```
```bash
```
