import { computed, type ComputedRef, ref, type Ref, watch } from "vue";
import { instance, nullable, V } from "..";
import * as v from 'valibot';
import { decompressPolyline, QQMapSDK } from "@/utils/lbs/index.js";
import { QQMapDirectionMode, type QQMapDirectionResult } from "@/utils/lbs/types";
import log from "@/utils/log";
import { errorReport } from "@/utils/vendor";
import { useTranslate } from "@/locale/use";
import { useBaseLocationStore } from "@/store/base/location";
import store from "@/store";
import { APIClient } from "@/business/api";
import dayjs from "dayjs";
import { DatetimeV } from ".";

const { dt } = useTranslate('base.route_map');

export type LocationRef = string;
export const LocationRefV = v.string();

export class Location extends V.class(v.object({
  address: v.array(v.string()),
  friendly_address: v.string(),
  lat: v.number(),
  lng: v.number(),
  _id: LocationRefV,
})) {
  static api = new APIClient<typeof Location>({
    modulePrefix: '/base/location',
    dt: useTranslate('base.location').dt,
    fallbackSchema: Location,
  });

  static async getById(id: LocationRef): Promise<Location> {
    const locationStore = useBaseLocationStore(store);
    const cachedLocation = locationStore.fetchById(id);
    if (cachedLocation) {
      return cachedLocation;
    }

    // 没有缓存，通过 API 获取
    return this.api.requestHTTP({
      method: "GET",
      endpoint: `/${id}`,
    }).then(({ body }) => {
      const location = body.parsed;
      locationStore.upsert(location);
      return location;
    })
  }

  static use(id?: LocationRef) {
    const _locationId = ref<LocationRef | undefined>(id);
    const _location = ref<Location>();
    const loading = ref(false);

    const location = computed((): Location | undefined => {
      if (_location.value === undefined && _locationId.value !== undefined) {
        loading.value = true;
        Location.getById(_locationId.value).then(loc => {
          _location.value = loc;
        }).finally(() => {
          loading.value = false;
        });
      }
      return _location.value;
    });

    return { location, loading, _locationId };
  }

  public getCoordString(separator: string = ","): string {
    return `${this.lat}${separator}${this.lng}`;
  }
}

export class LocationForm extends V.formClass(v.object({
  address: v.array(v.string()),
  friendly_address: v.string(),
  lat: v.number(),
  lng: v.number(),
  _id: v.optional(LocationRefV, undefined),
})) {
  public async put(): Promise<Location> {
    return Location.api.requestHTTP({
      method: "PUT",
      endpoint: '',
      data: this,
      schema: LocationRefV,
    }).then(({ body }) => {
      return new Location({ ...this, _id: body.parsed });
    });
  }
}

export class POI extends V.class(v.object({})) { }

export class RouteItemDatetime extends V.class(v.object({
  datetime: nullable(DatetimeV),
  time: nullable(v.string()),
  bring_ahead: nullable(v.number()),
  put_off: nullable(v.number()),
})) {

  get dateString(): string | undefined {
    if (this.datetime) {
      return dayjs(this.datetime).format('YYYY.MM.DD');
    }
  }

  get timeRange(): { start?: string; end?: string } {
    if (!this.datetime && !this.time) return { start: undefined, end: undefined };
    const time = dayjs(this.datetime || this.time, "HH:mm");
    return {
      start: time.subtract(this.bring_ahead ?? 0, 'minute').format("HH:mm"),
      end: time.add(this.put_off ?? 0, 'minute').format("HH:mm"),
    }

  }
}

export class RouteItemDatetimeForm extends V.formClass(RouteItemDatetime.V) { }

export class RouteItem extends V.class(v.object({
  datetime: instance(RouteItemDatetime),
  location: LocationRefV,
})) {

  static use(routeItem: RouteItem | { datetime: RouteItemDatetime; location: LocationRef }) {
    const normalize = (ri: RouteItem | { datetime: RouteItemDatetime; location: LocationRef }): RouteItem => {
      return ri instanceof RouteItem ? ri : RouteItem.parse(ri);
    };
    const _routeItem = ref<RouteItem>(normalize(routeItem));
    const _location = ref<Location>();
    const loading = ref(false);

    const location = computed((): Location | undefined => {
      if (_location.value === undefined) {
        loading.value = true;
        Location.getById(_routeItem.value.location).then(loc => {
          _location.value = loc;
        }).finally(() => {
          loading.value = false;
        });
      }
      return _location.value;
    })

    return {
      loading, location
    }
  }
}

export class RouteItemForm extends V.formClass(v.object({
  datetime: v.optional(instance(RouteItemDatetimeForm), () => new RouteItemDatetimeForm({})),
  location: v.optional(LocationRefV, undefined),
})) {
  protected _subclassValidate(): Promise<{ success: boolean; errors: Record<string, string[]> }> {
    return new Promise((resolve, reject) => {
      const errors: Record<string, string[]> = {};
      if (!this.location) {
        errors['location'] = ['地点不能为空'];
      }
      resolve({
        success: Object.keys(errors).length === 0,
        errors
      });
    })

  }
}

export interface Coord {
  latitude: number;
  longitude: number;
}

export class RoutePlan extends V.class(v.object({
  distance: v.number(),
  duration: v.number(),
  polyline: v.array(v.object({ latitude: v.number(), longitude: v.number() })),
  waypoints: v.optional(v.array(Location.V)),
})) {
}

export class RoutePlanning extends V.class(v.object({
  mode: v.picklist(Object.values(QQMapDirectionMode) as [QQMapDirectionMode, ...QQMapDirectionMode[]]),
  plans: v.optional(v.array(RoutePlan.V)),
})) {

  static use(routeRef: Ref<Route>, mode?: QQMapDirectionMode) {
    const _planning = ref<RoutePlanning>(RoutePlanning.parse({ mode: mode ?? QQMapDirectionMode.Driving }));
    const loading = ref(false);

    // Move Route.use logic inside to avoid circular dependencies
    const { locations } = Route.use(routeRef.value);

    const plans = computed((): RoutePlan[] | undefined => {
      if (!_planning.value.plans) {
        loading.value = true;
        if (locations.value !== undefined && locations.value.length >= 2) {
          QQMapSDK.direction({
            mode: _planning.value.mode,
            from: locations.value[0].getCoordString(),
            waypoints: locations.value.slice(1, locations.value.length - 1)
              .map((location) => {
                return location.getCoordString();
              })
              .join(';'),
            to: locations.value[locations.value.length - 1].getCoordString(),
            success: (res: QQMapDirectionResult<typeof _planning.value.mode>) => {
              if (res.status === 0) {
                _planning.value.plans = res.result.routes.map(plan_route => {
                  return RoutePlan.parse({
                    distance: plan_route.distance,
                    duration: plan_route.duration,
                    polyline: decompressPolyline(plan_route.polyline),
                    waypoints: plan_route.waypoints?.map(wp => Location.parse({
                      address: [],
                      friendly_address: wp.title,
                      lat: wp.location.lat,
                      lng: wp.location.lng,
                    }))
                  });
                });
              } else {
                errorReport(dt('toast.fail_to_plan'));
              }
              loading.value = false;
            },
            fail: (errors: any) => {
              loading.value = false;
              log.error(errors);
              errorReport(dt('toast.fail_to_plan'));
            }
          });
        }
      }
      return _planning.value.plans as RoutePlan[] | undefined;
    })

    return {
      loading, plans
    }
  }
}

export class Route extends V.class(v.object({
  items: v.array(instance(RouteItem))
})
) {

  get length(): number {
    return this.items.length;
  }
  get startItem(): RouteItem {
    return this.items[0];
  }

  get waypoints(): RouteItem[] {
    return this.items.slice(1, this.length - 1);
  }

  get endItem(): RouteItem {
    return this.items[this.length - 1];
  }

  public addWaypoint() {
    this.items.splice(this.length - 1, 0, new RouteItem({}));
  }

  static use(route: Route) {
    const _route = ref<Route>(route);
    const _locations = ref<(ComputedRef<Location | undefined>)[]>();

    const locations = computed((): Location[] | undefined => {
      try {
        return _locations.value!.map((locCom) => {
          if (locCom.value === undefined) {
            throw new Error("Location not loaded");
          }
          return locCom.value;
        })
      }
      catch (err) {
        return undefined;
      }
    })

    watch(_route, (newRoute) => {
      _locations.value = newRoute.items.map((ri) => {
        const normalizedItem: RouteItem = RouteItem.parse(ri as unknown);
        const { location } = RouteItem.use(normalizedItem);
        return location;
      })
    }, { immediate: true });

    return {
      locations, _route
    }

  }

}

export class RouteForm extends V.formClass(v.object({
  items: v.pipe(v.optional(
    v.array(instance(RouteItemForm)), () => [new RouteItemForm({}), new RouteItemForm({})]
  ), v.maxLength(4))
})) { }