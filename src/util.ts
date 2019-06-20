import * as prettier from "prettier";
import * as _ from "lodash";

export const toLuaObject = (obj: any, padding = 0) => {
  const pad = "    ".repeat(padding),
    padn1 = padding > 0 ? "    ".repeat(padding - 1) : "";
  if (typeof obj === "object" && obj !== null) {
    if (Array.isArray(obj)) {
      const isComplex = obj.some(v => typeof v === "object") ? obj.length > 3 : obj.length > 10;
      if (isComplex) {
        const raw = obj.map(v => toLuaObject(v, padding + 1)).join(`, \n${pad}`);
        return "{\n" + pad + raw + "\n" + padn1 + "}";
      } else {
        const raw = obj.map(v => toLuaObject(v, padding)).join(", ");
        return "{" + raw + "}";
      }
    } else {
      const arr = _.filter(obj, v => v !== null);
      const isComplex = arr.length > 2 || arr.some(v => typeof v === "object");
      const content = _.map(obj, (v, k) => {
        if (v === null) return null;
        if (isComplex) {
          if (k.match(/^\w[\d\w]*$/)) return pad + `${k} = ${toLuaObject(v, padding + 1)},\n`;
          else return pad + `["${k}"] = ${toLuaObject(v)},\n`;
        } else {
          if (k.match(/^\w[\d\w]*$/)) return `${k} = ${toLuaObject(v, padding + 1)}, `;
          else return `["${k}"] = ${toLuaObject(v)}, `;
        }
      }).filter(v => v !== null);
      if (isComplex) return `{\n${content.join("")}${padn1}}`;
      else return `{ ${content.join("")}}`;
    }
  }
  return JSON.stringify(obj);
};

export const convertObjectToLua = (
  arr: { name: string }[],
  name: string,
  dataname = (name.endsWith("ies") ? name.substr(0, name.length - 3) + "y" : name.endsWith("s") ? name.substr(0, name.length - 1) : name) + "Data"
) => {
  const charList = arr.map(c => `["${c.name}"] = ${toLuaObject(c, 3)}`);
  const tmpl = `-- AUTOMATIC GENERATED, DO NOT EDIT
-- see https://github.com/pa001024/arks

local ${dataname} = {
    ["${name}"] = {
        ${charList.join(",\n        ")}
    },
}
return ${dataname}`;
  return tmpl;
};

export const formatJSON = (src: any) => {
  return prettier.format(typeof src === "string" ? src : JSON.stringify(src), { parser: "json" });
};

export const isEmpty = (obj: object) => {
  if (Array.isArray(obj)) return obj.every(v => isEmpty(v));
  return !obj || (typeof obj === "object" && !Object.keys(obj).length);
};

export const firstCase = (src: string) => {
  return src[0].toUpperCase() + src.substr(1);
};

export const purge = <T>(a: T) => {
  Object.keys(a).forEach(v => a[v] !== 0 && !a[v] && delete a[v]);
  return a;
};
