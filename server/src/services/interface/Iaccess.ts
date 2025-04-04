interface SignUpParams {
    name: string;
    email: string;
    password: string;
    roles: []; // Assuming roles is an array of strings, adjust if necessary
}
interface LoginParams extends Pick<SignUpParams, 'email' | 'password'> {
    refreshToken: string;
}
interface handlerTokenParams {
    refreshToken: string;
    user: string;
    keyStore: string;
}
interface Iaccount_lock {
    foundShop : any ;
    match: boolean;
    email: string;
}
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
};
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    keyStore: 'keyStore'
};

export {
    Iaccount_lock,
    SignUpParams,
    LoginParams,
    handlerTokenParams,
    RoleShop,
    HEADER,
}
