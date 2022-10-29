/**

 @Name：layuiAdmin 公共业务
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：LPPL
    
 */
layui.define(function (exports) {
    var $ = layui.$,
        layer = layui.layer,
        laytpl = layui.laytpl,
        setter = layui.setter,
        view = layui.view,
        form = layui.form,
        admin = layui.admin;

    // 退出
    admin.events.logout = function () {
        //执行退出接口
        admin.req({
            url: '/Admin/Logout',
            success: function (res) {
                if (res.success) {
                    //清空本地记录的 token，并跳转到登入页
                    admin.exit();
                }
            }
        });
    };

    // 修改头像
    admin.events.avatar = function () {
        let elem = this;            
        var avatar = function () {
            let saveUrl = elem.getAttribute("data-save") || "/manage/account/SaveFace";
            SP.Avatar({
                url: form.config.upload.url,
                before: xhr => {
                    if (layui.setter.request.headers) {
                        let headers = layui.setter.request.headers();
                        for (let key in headers) {
                            xhr.setRequestHeader(key, headers[key]);
                        }
                    }
                    let tokenName = layui.setter.request.tokenName;
                    if (layui.setter.request.getToken && typeof layui.setter.request.getToken === "function") {
                        xhr.setRequestHeader(tokenName, layui.setter.request.getToken(tokenName));
                    } else {
                        xhr.setRequestHeader(tokenName, layui.data(layui.setter.tableName)[tokenName] || '');
                    }
                },
                callback: function (res) {
                    if (layui.form.config.upload.parse) {
                        res = layui.form.config.upload.parse(res);
                    }
                    if (res.code !== 0) {
                        layer.msg(res.msg, {
                            icon: 2
                        });
                        return;
                    }
                    layer.msg("头像修改成功", {
                        icon: 1
                    });
                    if (document.getElementById("layout-face")) {
                        document.getElementById("layout-face").src = res.data.src;
                    }
                    admin.req({
                        url: saveUrl,
                        data: res.data
                    });
                }
            });
        };

        if (window["SP"] && SP.Avatar) {
            avatar();
        } else {
            $.ajaxSetup({
                cache: true
            });
            $.getScript("//studio.a8.to/js/sp/avatar.js", avatar);
        }
    };

    //对外暴露的接口
    exports('common', {});
});