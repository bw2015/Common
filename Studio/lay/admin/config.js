layui.define(['laytpl', 'layer', 'element', 'util'], function (exports) {
    exports('setter', {
        // 语言
        language: layui.cache.language || "CHN"
        , container: 'LAY_app' //容器ID
        , base: layui.cache.base //记录layuiAdmin文件夹所在路径
        , views: layui.cache.views || (layui.cache.base + 'views/') //视图所在目录
        , entry: 'index' //默认视图文件名
        , engine: '.html' //视图文件后缀名
        , pageTabs: layui.cache.pageTabs === undefined ? true : layui.cache.pageTabs //是否开启页面选项卡功能。单页面专业版不推荐开启
        , name: layui.cache.name || 'layuiAdmin'
        , tableName: layui.cache.tableName || 'layuiAdmin' //本地存储表名
        , MOD_NAME: 'admin' //模块事件名
        , getUrl: layui.cache.getUrl || function (url) { return url }
        , debug: true //是否开启调试模式。如开启，接口异常时会抛出异常 URL 等信息

        , interceptor: false //是否开启未登入拦截

        //自定义请求字段
        , request: {
            //自动携带 token 的字段名。可设置 false 不携带。
            tokenName: layui.cache.request && layui.cache.request.tokenName || "Token",
            getToken: layui.cache.request && layui.cache.request.getToken || undefined,
            removeToken: layui.cache.request && layui.cache.request.removeToken || undefined,
            // 提交的类型（如果为json则使用JSON格式提交）
            type: layui.cache.request && layui.cache.request.type || undefined,
            headers: layui.cache.request && layui.cache.request.headers || null
        }

        //自定义响应字段
        , response: {
            statusName: 'success' //数据状态的字段名称
            , statusCode: {
                ok: 1, //数据状态一切正常的状态码
                faild: 0,
                //登录状态失效的状态码
                logout: function (res) {
                    return !res.success && res.info && (res.info.Error === "Login" || res.info.ErrorType === "Login" || res.info.ErrorType === "Authorization");
                }
            }
            , msgName: 'msg' //状态信息的字段名称
            , dataName: 'info' //数据详情的字段名称
        }
        //独立页面路由，可随意添加（无需写参数）
        , indPage: layui.cache.indPage || [
            '/user/login',
            '/user/register',
            '/user/forget'
        ],
        // 自定义的布局框架
        layout: layui.cache.layout || []
        //扩展的第三方模块
        , extend: [
            'echarts', //echarts 核心包
            'echartsTheme' //echarts 主题
        ]
        //主题配置
        , theme: {
            //配色方案，如果用户未设置主题，第一个将作为默认
            color: [{
                main: '#20222A' //主题色
                , selected: '#009688' //选中色
                , alias: 'default' //默认别名
            }]
        }
    });
});
