const extensionsId = "phnhdoaolljdeohmagpngbijbjbiecde";

const uuid = (): string => {
    return 'generate-uuid-4you-seem-professional'.replace(
        /[genratuidyosmpfl]/g, function (c) {
            const r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
};

const packMsgReq = (type: string, url: string, data: any, options: any | undefined): any => {
    return {
        uuid: uuid(),
        type,
        url,
        data,
        options,
        timestamps: Date.now()
    };
}

declare const chrome: any;


class Http {
    // 是否安装了插件
    isInstall: boolean | null = null;
    // 当前版本
    version: number = 0;
    // 需要的最低版本
    requiredVersion: number = 1.01;

    async sendMessage(message: any) {
        if (!this.isInstall) {
            console.error(`未检测到 ${extensionsId} 插件`);
            return;
        }

        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(extensionsId, message, {},
                (response: any) => {
                    if (!response) {
                        console.error(`未安装 ${extensionsId} 插件`);
                        reject(null);
                    } else if (response.status === 200) {
                        resolve(response);
                    } else {
                        reject(response);
                    }
                }
            );
        });
    }

    constructor() {
        try {
            chrome.runtime.sendMessage(extensionsId, {
                type: "version"
            }, {},
                (response: any) => {
                    this.isInstall = true;
                }
            );
        } catch (ex) {
            console.error(ex);
            this.isInstall = false;
        } finally {
            setTimeout(() => {
                console.log(`插件检测完成 => ${this.isInstall}`);
            }, 3000);
        }
    }

    async request(method: string, url: string, data: any, options: any | undefined): Promise<any> {
        if (!options) options = {};
        options.url = url;
        let message = packMsgReq(method, url, data, options);

        return this.sendMessage(message);
    }


    async get(url: string, options: any): Promise<any> {
        return await this.request("get", url, null, options);
    }

    async post(url: string, data: any, options: any | undefined): Promise<any> {
        return await this.request("post", url, data, options);
    }
}

const http: Http = new Http();

export default http;