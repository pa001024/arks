import * as prettier from "prettier";
import * as _ from "lodash";

export const toLuaObject = (obj: any, padding = 0) => {
  const pad = "    ".repeat(padding),
    padn1 = padding > 0 ? "    ".repeat(padding - 1) : "";
  if (typeof obj === "object" && obj !== null) {
    if (Array.isArray(obj)) {
      const hasObject = obj.some(v => typeof v === "object");
      if (hasObject && obj.length > 1) {
        const raw = obj.map(v => toLuaObject(v, padding + 1)).join(", ");
        return "{\n" + pad + raw + "\n" + padn1 + "}";
      } else {
        const raw = obj.map(v => toLuaObject(v, padding)).join(", ");
        return "{" + raw + "}";
      }
    } else {
      const content = _.map(obj, (v, k) => {
        if (v === null) return null;
        if (k.match(/^\w[\d\w]*$/)) return pad + `${k} = ${toLuaObject(v, padding + 1)},\n`;
        else return pad + `["${k}"] = ${toLuaObject(v)}\n`;
      }).filter(v => v !== null);
      return `{\n${content.join("")}${padn1}}`;
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
  return !obj || Object.keys(obj).length;
};

export const firstCase = (src: string) => {
  return src[0].toUpperCase() + src.substr(1);
};

export const purge = <T>(a: T) => {
  Object.keys(a).forEach(v => a[v] !== 0 && !a[v] && delete a[v]);
  return a;
};
