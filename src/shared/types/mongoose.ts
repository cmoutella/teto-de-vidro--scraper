import { ObjectId } from 'mongoose';

export type LeanDoc<T> = T & {
  _id: ObjectId;
  __v?: number;
};
