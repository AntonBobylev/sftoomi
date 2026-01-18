export default class Permissions
{
    private readonly storageKey: string = 'permissions';

    public set(permissions: string[]): void
    {
        sessionStorage.setItem(this.storageKey, permissions.join(','));
    }

    public get(): string[]
    {
        let permissions: string | null = sessionStorage.getItem(this.storageKey);

        return permissions
            ? permissions.split(',')
            : [];
    }

    public isAllowed(permissionName?: string): boolean
    {
        if (!permissionName) {
            return true;
        }

        let permissions: string[] = this.get();
        if (permissions.includes('*')) {
            return true;
        }

        return this.get().includes(permissionName);
    }
}
