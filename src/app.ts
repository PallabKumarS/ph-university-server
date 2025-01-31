/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';
import config from './app/config';

const app: Application = express();

//parsers
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: [
      (config.local_client as string) || 'http://localhost:5173',
      (config.client as string) || 'https://pks-university.vercel.app',
    ],
    credentials: true,
  }),
);

// application routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('P University Server is running');
});

app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
