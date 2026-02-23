import { Response } from "express";

interface ResponseServer {
	success: Object | boolean;
	message?: string;
	data?: Object | any;
	count?: number;
}

type Responses = Response<ResponseServer>;
export default Responses;
