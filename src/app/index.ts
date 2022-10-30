import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { route } from './route';
import { logging } from './logging';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

logging(app);
route(app);

export default app;
