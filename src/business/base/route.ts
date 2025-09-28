import { computed, type ComputedRef, ref, type Ref, watch } from "vue";
import { BusinessWithAPI, Business } from "..";
import { decompressPolyline, QQMapSDK } from "@/utils/lbs/index.js";
import { QQMapDirectionMode, type QQMapDirectionResult } from "@/utils/lbs/types";
import log from "@/utils/log";
import { errorReport } from "@/utils/vendor";
import { useTranslate } from "@/locale/use";
import { useBaseLocationStore } from "@/store/base/location";
import store from "@/store";

const { dt: domain_t } = useTranslate('route');

export type LocationRef = string;

export class Location extends BusinessWithAPI {
  static MODULE_PREFIX: string = '/base/location';
  static locationStore = useBaseLocationStore(store);


  constructor(
    public address: string[],
    public friendly_address: string,
    public lat: number,
    public lng: number,
    public _id?: LocationRef,
  ) {
    super();
  }

  protected put() {
    Location.requestAPI({
      method: "PUT",
      endpoint: '',
      data: {
        address: this.address,
        friendly_address: this.friendly_address,
        lat: this.lat,
        lng: this.lng,
      }
    }).then(({ data }) => {
      this._id = (data as Location)._id;
    });
  }

  static async get(id: LocationRef): Promise<Location> {
    const cachedLocation = this.locationStore.fetchById(id);
    if (cachedLocation) {
      return cachedLocation;
    }

    // 没有缓存，通过 API 获取
    return this.requestAPI({
      method: "GET",
      endpoint: `/${id}`,
    }).then(({ data }) => {
      const location = this.parse(data);
      this.locationStore.upsert(location);
      return location;
    })
  }

  public getCoordString(separator: string = ","): string {
    return `${this.lat}${separator}${this.lng}`;
  }
}

export class POI extends Business {
  constructor() {
    super();
  }
}

export class RouteItemDatetime extends Business {
  constructor(
    public datetime: Date | null = null,
    public time: string | null = null,
    public bring_ahead: number | null = null,
    public put_off: number | null = null,
  ) {
    super();
  }
}

export class RouteItem extends Business {
  constructor(
    public datetime: RouteItemDatetime = new RouteItemDatetime(),
    public location: LocationRef,
  ) {
    super();
  }

  static use(routeItem: RouteItem) {
    const _routeItem = ref<RouteItem>(routeItem);
    const _location = ref<Location>();
    const loading = ref(false);

    const location = computed((): Location | undefined => {
      if (_location.value === undefined) {
        loading.value = true;
        Location.get(_routeItem.value.location).then(loc => {
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

export interface Coord {
  latitude: number;
  longitude: number;
}

export class RoutePlan extends Business {

  constructor(
    public distance: number,
    public duration: number,
    public polyline: Coord[],
    public waypoints?: Location[]
  ) {
    super();
  }

}

export class RoutePlanning extends Business {
  constructor(
    public mode: QQMapDirectionMode = QQMapDirectionMode.Driving,
    public plans?: RoutePlan[],
  ) {
    super();
  }

  static use(routeRef: Ref<Route>, mode?: QQMapDirectionMode) {
    const _planning = ref<RoutePlanning>(new RoutePlanning(mode));
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
                  return new RoutePlan(
                    plan_route.distance,
                    plan_route.duration,
                    decompressPolyline(plan_route.polyline),
                    plan_route.waypoints?.map(wp => new Location(
                      [],
                      wp.title,
                      wp.location.lat,
                      wp.location.lng
                    ))
                  );
                });
              } else {
                errorReport(domain_t('toast.fail_to_plan'));
              }
              loading.value = false;
            },
            fail: (errors: any) => {
              loading.value = false;
              log.error(errors);
              errorReport(domain_t('toast.fail_to_plan'));
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

export class Route extends Business {
  constructor(
    public items: RouteItem[],
  ) {
    super();
    if (this.items.length < 2) {
      this.items = [
        new RouteItem(new RouteItemDatetime(), ""),
        new RouteItem(new RouteItemDatetime(), "")
      ];
    }
  }

  get startItem(): RouteItem {
    return this.items[0];
  }

  get waypoints(): RouteItem[] {
    return this.items.slice(1, this.items.length - 1);
  }

  get endItem(): RouteItem {
    return this.items[this.items.length - 1];
  }

  get length(): number {
    return this.items.length;
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
        const { location } = RouteItem.use(ri);
        return location;
      })
    }, { immediate: true });

    return {
      locations, _route
    }

  }

}