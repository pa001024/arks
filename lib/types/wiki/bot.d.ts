/// <reference types="node" />
import { AxiosInstance } from "axios";
import * as fs from "fs-extra";
interface AskResult {
    printouts: string[];
    fulltext: string;
    fullurl: string;
    namespace: number;
    exists: string;
    displaytitle: string;
}
interface EditInfo {
    title?: string;
    pageid?: string;
    text: string;
    minor?: boolean;
    nominor?: boolean;
    bot?: boolean;
}
export declare class WikiBot {
    user: string;
    session: string;
    token: string;
    BASE: string;
    readonly API: string;
    readonly RAW: string;
    client: AxiosInstance;
    constructor(wiki: string, user: string, session: string);
    apiPagination(url: string): Promise<any>;
    /** 获取token */
    getToken(): Promise<any>;
    /** 执行ask */
    ask(ask: string, offset?: number, limit?: number): Promise<{
        [key: string]: AskResult;
    }>;
    /** 编辑或创建页面 */
    edit(info: EditInfo): Promise<any>;
    /** 获取页面源码 */
    raw(title: string): Promise<string>;
    /** 删除页面 */
    delete(title: string, reason?: string): Promise<any>;
    /** 为指定标题刷新缓存 */
    purge(options: any): Promise<any>;
    /** 搬运文件 */
    transferFile(filename: string, fileurl: string): Promise<any>;
    uploadFile(filename: string, buffer?: fs.ReadStream): Promise<any>;
    getImageInfo(filename: string): Promise<string>;
}
export {};
//# sourceMappingURL=bot.d.ts.map