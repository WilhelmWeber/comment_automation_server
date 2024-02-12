//管理画面用のコントローラー
//1. 全ユーザーのコメント情報を返す
//2. WordPressAPIを経由してブログにコメントを投稿する
import express, { Router } from 'express';
import paperReading from '../models/paper_reading.model';
import bookReview from '../models/book_review.model';
import researchPresentation from '../models/research_presentation.model';
import adminModel from '../models/admin.model';
import ejs from 'ejs';
import axios from 'axios';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import 'cross-fetch/polyfill';
import { verifyToken } from '../libs/verifyToken';

const router: express.Router = Router();

router.get('/', verifyToken, async (req: express.Request, res: express.Response) => {
    const userId: string = req.userId;
    const db_res: any[] = await adminModel.find({username: userId});

    if (db_res.length === 0) {
        return res.status(401).json({
            message: "管理ユーザー以外には認可されていません"
        });
    } else {
        try {
            const paper_reading: Promise<any[]> = paperReading.find({deletedAt: null});
            const book_review: Promise<any[]> = bookReview.find({deletedAt: null});
            const reseach_presentation: Promise<any[]> = researchPresentation.find({deletedAt: null});
    
            const responses: any[][] = await Promise.all([paper_reading, book_review, reseach_presentation]);
            //各コメントが登録されている日付をユニークな値で取得
            const dates: any[] = Array.from(new Set(responses.flat(Infinity).map(elem => elem.date)));
            let datas: any[] = [];
            for (let date of dates) {
                let data = {
                    date: date,
                    paper_reading: responses[0].find(elem => elem.date===date),
                    book_review: responses[1].find(elem => elem.date===date),
                    research_presentation: responses[2].find(elem => elem.date===date),
                };
                datas.push(data);
            }
            return res.status(200).json({
                datas: datas,
            });
        } catch (error: any) {
            return res.status(500).json({
                message: "サーバー側のエラーで取得ができませんでした",
                error: error.toString(),
            });
        }
    }
});

router.post('/', verifyToken, async (req: express.Request, res: express.Response) => {
    const userId: string = req.userId;
    const db_res: any[] = await adminModel.find({username: userId});

    if (db_res.length === 0) {
        return res.status(401).json({
            message: "管理ユーザー以外には認可されていません"
        });
    } else {
        const { paper_reading, book_review, research_presentation } = req.body;
        const template: string = fs.readFileSync(path.resolve(__dirname, '../views/template.ejs'), 'utf8');
        const date: Date = new Date(paper_reading.date);
    
        const content: string = ejs.render(template, {
            paper_uri: paper_reading.url,
            paper_title: paper_reading.title,
            paper_comment: paper_reading.body,
            reviewed_book_url: book_review.book_url,
            reviewed_book_title: book_review.title,
            review_url: book_review.review_url,
            review_info: book_review.info,
            review_comment: book_review.body,
            research_title: research_presentation.title,
            research_comment: research_presentation.body,
        });
        //認証情報
        const credentials: string = process.env.API_USER + ':' + process.env.API_PASSWORD;
        const token: string = Buffer.from(credentials).toString('base64');
        const title: string = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
        const slug: string = `${date.getFullYear()}`.slice(2, 4) + `${date.getMonth() + 1}` + `${date.getDate()}`;
    
        const data = {
            title: title,
            content: content,
            slug: slug,
            status: 'draft',
        };
    
        //axiosを使ってwordpressAPIにポスト
        console.log(data);

        const PRdelete = paperReading.findByIdAndUpdate(paper_reading.id, {$set: {deletedAt: new Date()}});
        const BRdelete = bookReview.findByIdAndUpdate(book_review.id, {$set: {deletedAt: new Date()}});
        const RPdelete = researchPresentation.findById(research_presentation.id, {$set: {deletedAt: new Date()}});

        Promise
          .all([PRdelete, BRdelete, RPdelete])
          .then(() => {
            return res.status(201).json({
                message: '成功しました',
            });
          })
          .catch((error: any) => {
            return res.status(500).json({
                message: '失敗しました',
                error: error.toString(),
            })
          });
        
        /*
        try {
            await axios.post(`${process.env.BLOG_URL}`, data, {
                headers : {
                    Authorization: `Basic ${token}`,
                },
            });
            return res.status(201).json({
                message: "WordPressに下書きを投稿しました",
            });
        } catch (error: any) {
            return res.status(500).json({
                message: "サーバー側のエラーで投稿ができませんでした",
                error: error.toString();
            });
        }
        */
    }
});

export default router;