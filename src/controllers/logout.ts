import express, { Router } from 'express';
import { verifyToken } from '../libs/verifyToken';

const router: express.Router = Router();

router.delete('/', verifyToken, (req: express.Request, res: express.Response) => {
    res.clearCookie('token');
    res.status(200).json({success: true, message:'Cookiesを削除しました。'});
});

export default router;