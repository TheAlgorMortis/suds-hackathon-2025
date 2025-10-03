from app.services.db_service import DbService


class Service:
    """
    Grouping of all application services to inject into endpoints.
    """

    def __init__(self):
        self.db: DbService = DbService()

    def stop(self):
        self.db.close()
