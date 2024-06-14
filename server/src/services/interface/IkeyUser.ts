interface User {
    userID: string;
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