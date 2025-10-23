// Types of Component:Base:RouteEditor

import type { FormItemRule } from "wot-design-uni/components/wd-form/types";
import type { RouteItem } from "@/types/partner_request/trip";
import { useTranslate } from "@/locale/use";

export const { domain_t } = useTranslate('base.route_editor');

/**
 * @name 基础性路线规则
 */
export const BasicRouteRules: FormItemRule[] = [
    // location required
    {
        message: domain_t('rules.location_required'),
        validator(value: RouteItem[]) {
            // if route is null
            if (!value || value.length === 0)
                return false;

            for (let i = 0; i < value.length; i++) {
                if (!value[i].location)
                    return false;
            }
            return true;
        }
    },
    // datetime can't be earilier than now
    {
        message: domain_t('rules.datetime_after_now'),
        validator(value: RouteItem[]) {
            if (!value[0].datetime[0]) return true;
            return value[0].datetime[0] > Number(new Date());
        }
    },
    // datetime order
    {
        message: domain_t('rules.datetime_orderly'),
        validator(value: RouteItem[]) {
            let last_datetime = value[0].datetime[0];
            for (let i = 1; i < value.length; i++) {
                if (!value[i].datetime[0]) continue;  // 0, null, undefined
                if ((value[i].datetime[0] ?? 0) < (last_datetime ?? 0)) {
                    return false;
                }
                last_datetime = value[i].datetime[0];
            }
            return true;
        }
    },
]

/**
 * @name 严格路线规则
 */
export const StrictRouteRules: FormItemRule[] = [
    // departure_datetime required
    {
        message: domain_t('rules.departure_datetime_required'),
        validator(value: RouteItem[]) {
            if (value[0].datetime[0] === null) {
                return false;
            }
            return true;
        }
    },
]
