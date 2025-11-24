import { Coord } from "@/types/partner_request/trip";
import type { QQMapDirectionResult } from './types';

declare module "@/utils/lbs/index.js" {

    class QQMapSDKClass {

        direction(options: {
            mode: string;
            from: string;
            waypoints: string;
            to: string;
            success: (res: QQMapDirectionResult<string>) => void;
            fail: (error: any) => void;

        }): void;

    }

    export const QQMapSDK: QQMapSDKClass;

    export function decompressPolyline(raw: number[]): Coord[];

    export function getTencentLBSPluginCredentialString(
        key?: string,
        referer?: string
    ): string;
}