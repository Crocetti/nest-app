export enum Role {
    User = 'User',
    Admin = 'Admin',
}

type RoleString = keyof typeof Role;

export const stringToRole = (name: string): Role => {
    return Role[name as RoleString];
};

export const roleToString = (role: Role): string => {
    switch (role) {
        case Role.User:
            return 'User';
        case Role.Admin:
            return 'Admin';
        default:
            return 'unknown';
    }
};
