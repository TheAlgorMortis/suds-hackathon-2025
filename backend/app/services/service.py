class Service:
    """
    Grouping of all application services to inject into endpoints.
    """

    def __init__(self):
        # self.agent: AgentService = AgentService(OPENAI_KEY)
        #
        # self.db: DbService = DbService()
        # self.email: EmailService = EmailService()
        self.db: str = "hi"

    def stop(self):
        pass
