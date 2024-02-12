import express from 'express';
import login from './controllers/login';
import signup from './controllers/signup';
import paperReading from './controllers/paper_reading';
import bookReview from './controllers/book_review';
import researchPresentation from './controllers/research_presentation';
import admin from './controllers/admin';
import view from './controllers/view';
import logout from './controllers/logout';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

const app: express.Express = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser());

mongoose.connect(process.env.DB_PATH ? process.env.DB_PATH: "");
mongoose.Promise = global.Promise;

//routing
app.use('/api/v1/login', login);
app.use('/api/v1/logout', logout);
app.use('/api/v1/paper_reading', paperReading);
app.use('/api/v1/book_review', bookReview);
app.use('/api/v1/research_presentation', researchPresentation);
app.use('/api/v1/signup', signup);
app.use('/api/v1/admin', admin);
app.use('/api/v1/view', view);

app.listen(8080, () => {
    console.log('node.js listening at port 8080');
});