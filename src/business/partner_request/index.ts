import * as v from 'valibot';
import { type PropType } from 'vue';


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

export const PRType2L1Type: Record<PRType, PRL1Type> = {
    [PRType.Undefined]: PRL1Type.Undefined,
    [PRType.Commute]: PRL1Type.Trip,
    [PRType.RideHailing]: PRL1Type.Trip,
    [PRType.Hitchhiking]: PRL1Type.Trip,
    [PRType.Moped]: PRL1Type.Trip,
    [PRType.Travel]: PRL1Type.Travel,
}

export type PRRef = number;
export const PRRefProp = Object as PropType<PRRef>
export const PRRefV = v.number();
