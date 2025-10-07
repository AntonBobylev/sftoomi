export default class Auth
{
    private authorized: boolean = false;

    private sessionId: string | null = null;
    private userId:    number | null = null;

    public isAuthorized(): boolean
    {
        return this.authorized;
    }

    public authorize(sessionId: string, userId: number): void
    {
        this.authorized = true;
        this.sessionId = sessionId;
        this.userId = userId;
    }

    public unAuthorize(): void
    {
        this.authorized = false;
        this.sessionId = null;
        this.userId = null;
    }
}
