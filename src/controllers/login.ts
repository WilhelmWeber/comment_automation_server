import express, { Router } from 'express';
import config from '../libs/jwt.config'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import usersModel from '../models/users.model';

const router: express.Router = Router();

router.post('/', async (req: express.Request, res: express.Response) => {
    const username: string = req.body.username;
    const password: string = req.body.password;

    const db_res: any[] = await usersModel.find({username: username});

    if (db_res.length === 0) {
        return res.status(400).json({
            isSuccess: false,
            message: "ユーザー名またはパスワードが違います。",
        });
    } else if (await bcrypt.compare(password, db_res[0].password)) {
        const payload = {
            userId: username,
        };
        const token: string = jwt.sign(payload, config.jwt.secret, config.jwt.options);

        res.cookie('token', token, { httpOnly: true });

        return res.status(201).json({
            isSuccess: true,
            message: "認証に成功しました",
            user: username,
        });
    } else {
        return res.status(400).json({
            isSuccess: false,
            message: "ユーザー名またはパスワードが違います。",
        });
    }
});

export default router;