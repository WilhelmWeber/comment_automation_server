import express, { Router } from 'express';
import researchPresentation from '../models/research_presentation.model';
import { verifyToken } from '../libs/verifyToken';

const router: express.Router = Router();

router.post('/', verifyToken, async (req: express.Request, res: express.Response) => {
    const data: any = {
        date: req.body.date,
        title: req.body.title,
        body: req.body.body,
        type: 'research_presentation',
        user: req.userId,
        deletedAt: null,
    };

    const check: any[] = await researchPresentation.find({date: req.body.date, user:req.userId});

    if (check.length!==0) {
        return res.status(400).json({
            message: "既に同じ日付のコメントが登録されています。更新する場合はホーム画面から当該コメントを選択してください。",
        });
    }

    //クライアントのviewを更新するのにidがいるためidをresponseで返す(2024-02-05)
    try {
        const value = await researchPresentation.create(data);
        return res.status(201).json({
            message: "データベースに正常に登録されました",
            documentId: String(value._id),
            data: value,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: "サーバー側のエラーで登録に失敗しました",
            error: error.toString(),
        });
    }
});

router.put('/', verifyToken, async (req: express.Request, res: express.Response) => {
    const id: string = req.body.id;
    const data: any = {
        date: req.body.date,
        title: req.body.title,
        body: req.body.body,
        type: 'research_presentation',
        user: req.userId,
        deletedAt: null,
        updatedAt: new Date(),
    };

    try {
        const value = await researchPresentation.findByIdAndUpdate(id, data);
        return res.status(201).json({
            message: "正常に更新が行われました",
            data: value,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: "サーバー側のエラーで更新に失敗しました",
            error: error.toString(),
        });
    }
});

router.delete('/:id', verifyToken, async (req: express.Request, res: express.Response) => {
    const id: string = req.params.id;

    try {
        await researchPresentation.findByIdAndUpdate(id, {$set: {
            deletedAt: new Date(),
        }});
        return res.status(200).json({
            message: "正常に削除が完了しました",
            documentId: id,
        })
    } catch (error: any) {
        return res.status(500).json({
            message: "サーバー側のエラーで削除に失敗しました",
            error: error.toString(),
        });
    }
});

export default router;