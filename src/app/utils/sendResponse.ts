import { Response } from 'express';

type TMeta = {
  limit: number;
  page: number;
  totalDoc: number;
  totalPage: number;
};

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
  meta?: TMeta;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data.success,
    message: data.message,
    data: data?.data,
    meta: data?.meta,
  });
};

export default sendResponse;
