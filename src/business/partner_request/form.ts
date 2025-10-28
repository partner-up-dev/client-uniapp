import { V, nullable, limit_string } from "../index";
import * as v from 'valibot';
import { PRRefV } from ".";

export class PartnerRequestForm extends V.formClass(v.object({
  _id: v.optional(PRRefV),
  title: nullable(limit_string(3, 12)),
  introduction: nullable(limit_string(3, 60))
})) {

  public create(): Promise<any> {
    throw new Error("Use typed form");
  }
  public update(): Promise<any> {
    throw new Error("Use typed form");
  }

}
