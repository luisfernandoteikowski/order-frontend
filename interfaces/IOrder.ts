import { IPart } from "./IPart";

export interface IOrder {
    id: number;
    total: number;
    parts: IPart[];
}