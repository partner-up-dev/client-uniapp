import { V, nullable, limit_string, instance } from "../index";
import * as v from 'valibot';
import { PRRefV } from ".";
import { PartnerForm } from "./partner";

export class PartnerRequestForm extends V.formClass(v.object({
  _id: v.optional(PRRefV),
  title: nullable(limit_string(3, 12)),
  introduction: nullable(limit_string(3, 60)),
  // partners: v.optional(
  //   v.pipe(v.array(instance(PartnerForm)), v.minLength(2, "至少两名搭子")),
  //   () => {
  //     return [
  //       new PartnerForm({}),
  //       new PartnerForm({}),
  //     ]
  //   },
  // )
})) {

  public create(): Promise<any> {
    throw new Error("Use typed form");
  }
  public update(): Promise<any> {
    throw new Error("Use typed form");
  }

}
