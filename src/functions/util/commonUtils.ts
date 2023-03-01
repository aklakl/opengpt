import { HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { util } from 'chai';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import * as humps from 'humps';
import _, { camelCase } from 'lodash';
import moment, { Moment } from 'moment-timezone';
import Sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

let insecureDevelopment;
try {
  insecureDevelopment = require('../../test/test-insecure-development');
} catch (e) { }

export const searchArrayWith = function (
  arr: any[],
  searchKey: string,
  searchValue: string,
  returnKey: string,
): any {
  let res = undefined;
  for (let i = 0; i < arr.length; ++i) {
    const obj = arr[i];
    //console.log("key="+key+"|obj = "+JSON.stringify(obj));
    if (obj[searchKey] === searchValue) {
      res = obj[returnKey];
      //console.log(res);
      break;
    }
  }
  return res;
};

export const uniqueArray = function (arr: any[]) {
  return Array.from(new Set(arr));
};

export const removeItem = function (array: any[], item: any) {
  return array.filter(f => f !== item);
};

//not working for typeorm entity : Could be use Object.assign(b,a);
export const copyObjWhenKeyEqual = function (source: any, dest: any) {
  for (const key in dest) {
    if (source.hasOwnProperty(key)) {
      dest[key] = source[key];
    }
  }
};
// export const copyObjWhenKeyEqual = function (copyFrom: Object, copyTo: Object): Object {
//   const keysTo = Object.keys(copyTo);
//   for (const key of keysTo) {
//       if (copyFrom[key] !== undefined) {
//           copyTo[key] = copyFrom[key];
//       }
//   }
//   return copyTo;
// }

//fix the issue with JSON.stringify got TypeError: Do not know how to serialize a BigInt
export const bigintToString: any = (obj: any) => {
  return JSON.parse(
    JSON.stringify(
      obj,
      (key, value) => (typeof value === 'bigint' ? value.toString() : value), // return everything else unchanged
    ),
  );
};

export const isJsonString: any = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};


//camelizeKeys with camelCase
export const camelizeKey: any = (obj: any) => {
  if (Array.isArray(obj)) {
    return obj.map(v => camelizeKeys(v));
  } else if (obj != null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [camelCase(key)]: camelizeKeys(obj[key]),
      }),
      {},
    );
  }
  return obj;
};

//camelizeKeys with humps refer:https://github.com/domchristie/humps
export const camelizeKeys: any = (obj: any) => {
  return humps.camelizeKeys(obj);
};

export const decamelizeKeys: any = (obj: any) => {
  return humps.decamelizeKeys(obj, { split: /(?=[A-Z0-9])/ });
};

//https://careerkarma.com/blog/converting-circular-structure-to-json/ and https://bobbyhadz.com/blog/javascript-typeerror-converting-circular-structure-to-json
export const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: any, value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

export const isNullOrUndefined = (obj: any) => {
  if (obj == undefined || obj == null) {
    return true;
  } else {
    return false;
  }
};

export const isEmptyObject = function (object) {
  for (const property in object) {
    return false;
  }
  return true;
};

export const isNotEmptyObject = function (object) {
  return !isEmptyObject(object);
};

export const toNumber = (obj: any) => {
  let res = 0;
  if (typeof obj === 'bigint') {
    res = Number(obj.toString());
  } else {
    res = Number(obj.toString());
  }
  return res;
};

export function getMoment(
  date?: string,
  time?: string,
  timezone?: string,
): Moment {
  if (!date) {
    return moment.utc();
  }
  const dateTime = time ? `${date} ${time}` : date;
  return moment.tz(dateTime, timezone ? timezone : 'UTC');
}

export function getDateStr(moment: Moment) {
  return moment.toISOString().substring(0, 10);
}

export function getTimeStr(moment: Moment) {
  return moment.toISOString().substring(11, 16);
}

export const formatDate = (date: any) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
};

export const addDays = (numOfDays: number, date = new Date()) => {
  date.setDate(date.getDate() + numOfDays);
  return date;
};

export const subtractDays = (numOfDays: number, date = new Date()) => {
  date.setDate(date.getDate() - numOfDays);
  return date;
};

export const getDifferenceInDays = (date1: any, date2: any) => {
  const diffInMs = Math.abs(date2 - date1);
  return diffInMs / (1000 * 60 * 60 * 24);
};

export const getDifferenceInHours = (date1: any, date2: any) => {
  const diffInMs = Math.abs(date2 - date1);
  return diffInMs / (1000 * 60 * 60);
};

export const getDifferenceInMinutes = (date1: any, date2: any) => {
  const diffInMs = Math.abs(date2 - date1);
  return diffInMs / (1000 * 60);
};

export const getDifferenceInSeconds = (date1: any, date2: any) => {
  const diffInMs = Math.abs(date2 - date1);
  return diffInMs / 1000;
};

export const simpleUUID = () => {
  return uuidv4().replace(/-/g, '');
};

export const mapChangeObj = map => {
  const obj = {};
  for (const [k, v] of map) {
    obj[k] = v;
  }
  return obj;
};

export const objChangeMap = obj => {
  const map = new Map();
  for (const key in obj) {
    map.set(key, obj[key]);
  }
  return map;
};

const getDataType = data => {
  const temp = Object.prototype.toString.call(data);
  const type = temp.match(/\b\w+\b/g);
  return type.length < 2 ? 'Undefined' : type[1];
};

export const isSameObj = (source, comparison) => {
  return _.isEqual(source, comparison);
};

export const getImageMeta = async url => {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  if (response.status === HttpStatus.OK && response.data) {
    const sharp = Sharp(response.data);
    return await sharp.metadata();
  }
};

export function deserializeArray<T>(
  cls: ClassConstructor<T>,
  json: string | Array<any>,
): T[] {
  if (json) {
    let arr = [];
    if (typeof json === 'string') {
      arr = JSON.parse(json as string);
    } else {
      arr = json as Array<any>;
    }
    if (arr && arr.length > 0) {
      return arr.map(value => plainToInstance(cls, value));
    }
  }
}

/*
//Warning, This method has something wrong. please deprecate it. To Pengqi. could be use lodash library to compare the two objects.
export const isSameObj = (source, comparison) => {
  if (!source && !comparison) {
    return true;
  }
  if ((!source || !comparison) && source != comparison) {
    return false;
  }
  const iterable = data => ['Object', 'Array'].includes(getDataType(data));
  if (!iterable(source)) {
    throw new Error(
      `source should be a Object or Array , but got ${getDataType(source)}`,
    );
  }
  if (getDataType(source) !== getDataType(comparison)) {
    return true;
  }
  const sourceKeys = Object.keys(source);
  const comparisonKeys = Object.keys({ ...source, ...comparison });
  if (sourceKeys.length !== comparisonKeys.length) {
    return true;
  }
  return comparisonKeys.some(key => {
    if (iterable(source[key])) {
      return isSameObj(source[key], comparison[key]);
    } else {
      return source[key] !== comparison[key];
    }
  });
};
*/

//===========================================These utils base on business, could be move out==========================================

export const isSameDelivery = (DeliveryA, DeliveryB) => {
  if (DeliveryA.recurrence != DeliveryB.recurrence!) {
    return false;
  }
  if (DeliveryA.startDate != DeliveryB.startDate!) {
    return false;
  }
  if (DeliveryA.startTime != DeliveryB.startTime!) {
    return false;
  }
  if (DeliveryA.useLocalTime != DeliveryB.useLocalTime!) {
    return false;
  }
  if (!isSameObj(DeliveryA.endRecurrence, DeliveryB.endRecurrence)) {
    return false;
  }
  if (!isSameObj(DeliveryA.frequency, DeliveryB.frequency)) {
    return false;
  }
  return true;
};

//===========================================These utils base on business, could be move out==========================================

export function makeReadable(obj: any): string {
  if (typeof obj === 'string') return obj;
  if (insecureDevelopment) return util.inspect(obj);
  return JSON.stringify(obj);
}
