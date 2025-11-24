import { type GeoElement } from "@/components/common/GeoElement/GeoElement";
import { Route, RouteItemDatetime } from "@/business/base/route";


export const mockElements: GeoElement[] = [
  new Route([
    {
      datetime: new RouteItemDatetime({
        datetime: new Date("2024-09-24 23:15:00"),
        time: null,
        bring_ahead: null,
        put_off: null,
      }),
      location: "a128acc5d8153c97bb771fccb5efe990",
    },
    {
      datetime: new RouteItemDatetime({
        datetime: null,
        time: null,
        bring_ahead: null,
        put_off: null,
      }),
      location: "1c18c2e3b8dc6f0ffb83b68810bbb29d",
    },
  ],
  ),
  new Route([
    {
      datetime: new RouteItemDatetime({
        datetime: new Date("2025-08-15T17:20:36+08:00"),
        time: null,
        bring_ahead: null,
        put_off: 20,
      }),
      location: "3859b2550b129f143efb4920e4addb73",
    },
    {
      datetime: new RouteItemDatetime({
        datetime: null,
        time: null,
        bring_ahead: null,
        put_off: null,
      }),
      location: "9bd0ac5c8feb2dab5d62e150864f0bc3",
    },
  ],
  ),

]