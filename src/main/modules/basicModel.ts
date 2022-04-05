import { WithId } from "mongodb";

export class BasicModel implements WithId<any>{
    _id: any;
}
