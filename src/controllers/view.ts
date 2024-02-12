import express, { Router } from 'express';
import paperReading from '../models/paper_reading.model';
import bookReview from '../models/book_review.model';
import researchPresentation from '../models/research_presentation.model';
import { verifyToken } from '../libs/verifyToken';

const router: express.Router = Router();

router.get('/', verifyToken, async (req: express.Request, res: express.Response) => {
    const userId: string = req.userId;

    try {
        const paper_reading: Promise<any[]> = paperReading.find({user: userId, deletedAt: null});
        const book_review: Promise<any[]> = bookReview.find({user: userId, deletedAt: null});
        const reseach_presentation: Promise<any[]> = researchPresentation.find({user: userId, deletedAt: null});

        const _datas: any[][] = await Promise.all([paper_reading, book_review, reseach_presentation]);
        const datas = _datas.flat(Infinity);
        return res.status(200).json({
            datas: datas,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: "サーバー側のエラーで取得ができませんでした",
            error: error.toString(),
        });
    }
});

export default router;