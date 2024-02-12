import express, { Router } from 'express';
import usersModel from '../models/users.model';
import bcrypt from 'bcrypt';

const router: express.Router = Router();

router.post('/', async (req: express.Request, res: express.Response) => {
    const { username, password, repassword } = req.body;

    try {
        const users = await usersModel.find({username: username});

        if (users.length !== 0) {
            return res.status(400).json({
                message: "既に同じユーザーが登録されています",
            });
        } else if (password !== repassword) {
            return res.status(400).json({
                message: "パスワードが一致しません",
            });
        } else {
            const passhash = await bcrypt.hash(password, 10);
            const data: any = {
                username: username,
                password: passhash,
            };
            await usersModel.create(data);
            return res.status(200).json({
                message: "ユーザー登録に成功しました"
            })
        }
    } catch (error: any) {
        return res.status(500).json({
            message: "サーバー側のエラーで登録ができませんでした",
            error: error.toString(),
        });
    }
});

export default router;