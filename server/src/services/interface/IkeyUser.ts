interface User {
    userID: any;
    publicKey: string;
    privateKey: string;
    refreshToken: string;
}
type updateToken = {
    refreshToken: string; refreshTokensUsed: string; userID: string;
};

export {
    User,updateToken
}