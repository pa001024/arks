export declare const toLuaObject: (obj: any, padding?: number) => any;
export declare const convertObjectToLua: (arr: {
    name: string;
}[], name: string, dataname?: string) => string;
export declare const formatJSON: (src: any) => string;
export declare const isEmpty: (obj: object) => any;
export declare const firstCase: (src: string) => string;
export declare const purge: <T>(a: T) => T;
/** JSON转换为WikiTab格式 */
export declare const json2Tab: (json: any[], title?: string) => {
    license: string;
    description: {
        en: string;
    };
    sources: string;
    schema: {
        fields: unknown[];
    };
    data: any[][];
};
export declare const forEachLimit: <T>(itor: T[], limit: number, func: (t: T) => Promise<void>) => Promise<unknown>;
export declare const imgSizeOf: (file: string) => Promise<{
    width: number;
    height: number;
}>;
//# sourceMappingURL=util.d.ts.map