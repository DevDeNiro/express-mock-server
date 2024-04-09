function getDefaultJwtClaim(user) {
    if (user) {
        return {
            username: user.email,
            userId: user.id,
            authorities: user.authorities || ["AUTH_1"]
        };
    } else {

        return {
            "username": "test@test.com",
            "userId": 1,
            "authorities": ["AUTH_1"]
        };
    }
}

export default getDefaultJwtClaim;