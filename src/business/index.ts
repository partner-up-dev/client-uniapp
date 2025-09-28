import { API } from "./api";

export class Business {
  static parse<T extends new (...args: any[]) => any>(this: T, data: any): InstanceType<T> {
    const instance = new this();
    Object.assign(instance, data);
    return instance;
  }

  static parseJSON<T extends new (...args: any[]) => any>(this: T, json: string): InstanceType<T> {
    const data = JSON.parse(json);
    const instance = new this();
    Object.assign(instance, data);
    return instance;
  }
}


export class BusinessWithAPI extends API {
  static parse<T extends new (...args: any[]) => any>(this: T, data: any): InstanceType<T> {
    const instance = new this();
    Object.assign(instance, data);
    return instance;
  }

  static parseJSON<T extends new (...args: any[]) => any>(this: T, json: string): InstanceType<T> {
    const data = JSON.parse(json);
    const instance = new this();
    Object.assign(instance, data);
    return instance;
  }
}

