// Types of Component:TripPreferenceEditor

import { type Route, Transportation, trip_preference_default, type TripPreference } from "@/types/partner_request/trip";
import { route_default } from "@/types/partner_request/trip/edit";
import { type PropType } from "vue";
import { type FormItemRule } from "wot-design-uni/components/wd-form/types";
import { useTranslate } from '@/locale/use';

export const { domain_t, t } = useTranslate('partner_request.trip.preference_editor');

export const TripPreferenceEditorProps = {
    modelValue: {
        type: Object as PropType<TripPreference>,
        default: trip_preference_default
    },
    route: {
        type: Array as PropType<Route>,
        default: route_default
    },
    transportation: {
        type: String as PropType<Transportation>,
        default: Transportation.RideHailing
    }
}

export const TripPreferenceEditorEmits = {
    'change': (field_name: string) => true
}


export const TripPreferenceRules: Record<keyof TripPreference, FormItemRule[]> = {
    luggage: [
        // only integer
        {
            message: domain_t('luggage.only_integer'),
            validator: (value: number) => {
                if (value === null || value === undefined) return true;
                return Number.isInteger(value) && value >= 0;
            }
        }
    ],
    purpose: [],
    flight: [],
    railway: []
}