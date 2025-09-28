import { type GeoElement } from "@/components/common/GeoElement/GeoElement";
import { Route, type Coord, RouteItemDatetime } from "@/business/base/route";


export const mockElements: GeoElement[] = [
  {
    type: "route", // Don't FIXME
    value: new Route([
      {
        datetime: new RouteItemDatetime(new Date("2024-09-24 23:15:00")),
        location: "a128acc5d8153c97bb771fccb5efe990",
      },
      {
        datetime: new RouteItemDatetime(),
        location: "1c18c2e3b8dc6f0ffb83b68810bbb29d",
      },
    ]),
  },
  {
    type: "route", // Don't FIXME
    value: new Route([
      {
        datetime: new RouteItemDatetime(new Date("2025-08-15T17:20:36+08:00"), null, null, 20),
        location: "3859b2550b129f143efb4920e4addb73",
      },
      {
        datetime: new RouteItemDatetime(),
        location: "9bd0ac5c8feb2dab5d62e150864f0bc3",
      },
    ]),
  },
]