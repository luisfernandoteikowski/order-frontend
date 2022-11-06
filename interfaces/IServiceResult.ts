import { IErrorResultDetail } from "./IErrorResultDetail";

export interface IServiceResult<T> {
    codeId: number,
    message: string,
    isSuccess: boolean,
    data: T,
    errors: IErrorResultDetail[]
}