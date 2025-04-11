export default () => ({
    database: {
        connectionString: process.env.DB_URI
    },

    jwt: {
        secretKey: process.env.JWT_SECRET,
        jwtExpiration: process.env.JWT_EXPIRATION,
        refreshExpiration: process.env.JWT_REFRESH_EXPIRATION
    },
})