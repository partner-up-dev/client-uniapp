import { type AccountRef } from "../account";
import { Business } from "../index";

export enum PRStatus {
    Draft = "draft",
    Joinable = "joinable",
    Ready = "ready",
    Performing = "performing",
    Settling = "settling",
    Closed = "closed",
    Cancelled = "cancelled",
    Merged = "merged",
}
export const PRStatusOrder: Record<PRStatus, number> = {
    [PRStatus.Draft]: 0,
    [PRStatus.Joinable]: 1,
    [PRStatus.Ready]: 2,
    [PRStatus.Performing]: 3,
    [PRStatus.Settling]: 4,
    [PRStatus.Closed]: 5,
    [PRStatus.Cancelled]: 6,
    [PRStatus.Merged]: 7
}

export enum PRL1Type {
    Undefined = "undefined",
    Trip = "trip",
    Travel = "travel",
}

export enum PRType {
    Undefined = "undefined",
    /** 通勤搭子 */
    Commute = "commute",
    /** 网约车搭子 */
    RideHailing = "ride_hailing",
    /** 便车搭子 */
    Hitchhiking = "hitchhiking",
    /** 电驴搭子 */
    Moped = "moped",
    /** 旅游搭子 */
    Travel = "travel",
}

const PRType2L1Type: Record<PRType, PRL1Type> = {
    [PRType.Undefined]: PRL1Type.Undefined,
    [PRType.Commute]: PRL1Type.Trip,
    [PRType.RideHailing]: PRL1Type.Trip,
    [PRType.Hitchhiking]: PRL1Type.Trip,
    [PRType.Moped]: PRL1Type.Trip,
    [PRType.Travel]: PRL1Type.Travel,
}

export type PRRef = number;

export class PartnerRequest extends Business {
    constructor(
        public _id: PRRef,
        public created_at: Date,
        public created_by: AccountRef,
        public type: PRType,
        public status: PRStatus,
        public title: string | null = null,
        public introduction: string | null = null,
        public chat: number | null = null,
        public contract: number
    ) {
        super();
    }

    public getL1Type(type: PRType): PRL1Type {
        return PRType2L1Type[type] || PRL1Type.Undefined;
    }
}
