import jwt from 'jsonwebtoken';
import config from './jwt.config';
import express from 'express';

declare global {
	namespace Express {
		interface Request {
            userId: string,
		}
	}
}

const verifyToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token: any = req.cookies.token;

    if (token) {
        jwt.verify(token, config.jwt.secret, function (error: any, decoded: any){
            if (error) {
                return res.status(403).send({
                    isSuccess: false,
                    message: 'トークンの認証に失敗しました',
                });
            } else {
                req.userId = decoded.userId,
                next();
            }
        });
    } else {
        return res.status(401).send({
            isSuccess: false,
            message: 'トークンがありません',
        });
    }
}

export { verifyToken };