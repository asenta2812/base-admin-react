declare namespace Auth {
    type CurrentUser = {
        id: string;
        email: string;
        name: string;
        role: string;
        isEmailVerified: boolean;
        permissions: [
            {
                document: string;
                actions: string[];
            }
        ];
    }
    type LoginRequest = {
        email?: string;
        password?: string;
    };
    type LoginResponse = {
        data: {
            user: CurrentUser;
        } & Token;
    } & API.ResponseBase;

    type Token = {
        access: {
            token: string;
            expires: Date;
        },
        refresh: {
            token: string;
            expires: Date;
        }
    }

    type LogoutRequest = {
        refreshToken: string
    }
}