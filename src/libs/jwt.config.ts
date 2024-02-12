import jwt from 'jsonwebtoken';

interface JWTConfig {
    jwt : {
        secret: jwt.Secret,
        options: jwt.SignOptions
    }
}

const config: JWTConfig = {
    jwt: {
        secret: 'secretCusisine1234',
        options: {
            algorithm: 'HS256',
            expiresIn: '24h',
        }
    }
};

export default config;