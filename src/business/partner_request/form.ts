import { V, nullable, limit_string, instance } from "../index";
import * as v from 'valibot';
import { Route } from "../base/route";
import { TripPreference } from "./trip";

export class PartnerRequestForm extends V.class(v.object({
  title: nullable(limit_string(3, 12)),
  introduction: nullable(limit_string(3, 60)),
  route: v.optional(instance(Route)),
  trip_preference: v.optional(instance(TripPreference)),
})) {

  /**
   * 验证表单数据
   * @returns Promise that resolves if valid, rejects with error message if invalid
   */
  validate(): Promise<void> {
    return new Promise((resolve, reject) => {
      const errors: string[] = [];
      
      // Validate title if provided
      if (this.title !== null && this.title !== "") {
        if (this.title.length < 3 || this.title.length > 12) {
          errors.push("标题长度必须在 3-12 个字符之间");
        }
      }
      
      // Validate introduction if provided
      if (this.introduction !== null && this.introduction !== "") {
        if (this.introduction.length < 3 || this.introduction.length > 60) {
          errors.push("简介长度必须在 3-60 个字符之间");
        }
      }
      
      // At least one field must be provided
      if ((this.title === null || this.title === "") && (this.introduction === null || this.introduction === "")) {
        errors.push("请填写标题或简介");
      }
      
      if (errors.length > 0) {
        reject(new Error(errors.join("; ")));
      } else {
        resolve();
      }
    });
  }
}
