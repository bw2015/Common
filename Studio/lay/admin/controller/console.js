/**

 @Name：layuiAdmin 主页控制台
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：LPPL
    
 */


layui.define(function (exports) {
    /*
      下面通过 layui.use 分段加载不同的模块，实现不同区域的同时渲染，从而保证视图的快速呈现
    */

    //区块轮播切换
    layui.use(['admin', 'carousel'], function () {
        var $ = layui.$,
            admin = layui.admin,
            carousel = layui.carousel,
            element = layui.element,
            device = layui.device();

        //轮播切换
        $('.layadmin-carousel').each(function () {
            var othis = $(this);
            carousel.render({
                elem: this,
                width: '100%',
                arrow: 'none',
                interval: othis.data('interval'),
                autoplay: othis.data('autoplay') === true,
                trigger: (device.ios || device.android) ? 'click' : 'hover',
                anim: othis.data('anim')
            });
        });
        element.render('progress');
    });

    layui.use(['table', 'admin', 'jquery'], function () {
        var $ = layui.$,
            admin = layui.admin,
            table = layui.table;

        //即将开始的比赛
        table.render({
            elem: '#LAY-index-startMatch',
            url: '/system/report/match/startmatch' //模拟接口
            ,
            method: "post",
            height: 315,
            page: true,

            cols: [[
                {
                    type: 'numbers',
                    fixed: 'left'
                }
                , {
                    field: 'ID',
                    title: 'ID',
                    width: 80
                }
                , {
                    templet: "<div><a href='javascript:' class='es-link' lay-event='open'>{{ d.Title }}</a></div>",
                    title: '賽事名稱',
                    minWidth: 130
                }
                , {
                    field: 'Category',
                    title: '賽事類型',
                    width: 100
                }
                ,

                {
                    field: 'StartAt',
                    title: '開始時間',
                    sort: true
                }
            ]],
            skin: 'line'
        });

        //即将开始的比赛 - 彈窗
        table.on("tool(LAY-index-startMatch)", function (e) {
            var data = e.data;
            var event = e.event;
            switch (event) {
                case "open":
                    admin.popup({
                        type: 1,
                        id: "match-" + data.ID,
                        title: data.Title,
                        area: ["100%", "100%"],
                        content: "正在加载",
                        success: function () {
                            layui.view(this.id).render("/game/match-info", {
                                ID: data.ID
                            });
                        }
                    });
                    break;
            }
        });

        //高關注度比賽
        table.render({
            elem: '#LAY-index-attentionMatch',
            url: '/system/report/match/attentionmatch' //模拟接口
            ,
            method: "post",
            height: 315,
            page: true,

            cols: [[
                {
                    type: 'numbers',
                    fixed: 'left'
                }
                , {
                    field: 'Title',
                    title: '賽事名稱',
                    width: 220
                }
                , {
                    field: 'BetMoney',
                    title: '下注额度',
                    minWidth: 80
                }
                , {
                    field: 'OrderCount',
                    title: '订单数量',
                    sort: true
                }, {
                    field: 'SiteMoney',
                    title: '盈亏金额',
                    sort: true
                }, {
                    field: 'User',
                    title: '参与人数',
                    sort: true
                }
            ]],
            skin: 'line',

        });

        //用户下注量统计
        table.render({
            elem: '#LAY-index-userBet',
            url: '/system/report/match/userbet' //模拟接口
            ,
            method: "post",
            height: 315,
            page: true,

            cols: [[
                {
                    type: 'numbers',
                    fixed: 'left'
                }
                , {
                    field: 'UserID',
                    title: 'ID',
                    width: 80
                }
                , {
                    field: 'UserName',
                    title: '用户名'
                }, {
                    field: 'BetMoney',
                    title: '投注金额',
                    sort: true
                }, {
                    field: 'BetAmount',
                    title: '有效金额',
                    sort: true
                }, {
                    field: 'Reward',
                    title: '派奖金额',
                    sort: true
                }, {
                    field: 'Money',
                    title: '盈亏金额',
                    sort: true
                }, {
                    field: 'Currency',
                    title: '币种',
                }

            ]],
            skin: 'line',

        });

        //平台下注量统计 
        table.render({
            elem: '#LAY-index-siteBet',
            url: '/system/report/match/sitebet' //模拟接口
            ,
            method: "post",
            height: 315,
            page: true,

            cols: [[
                {
                    type: 'numbers',
                    fixed: 'left'
                }
                , {
                    field: 'SiteID',
                    title: 'ID',
                }
                , {
                    field: 'SiteName',
                    title: '平台名',
                }
                , {
                    field: 'Currency',
                    title: '币种'
                }, {
                    field: 'BetMoney',
                    title: '投注金额',
                    sort: true
                }, {
                    field: 'BetAmount',
                    title: '有效金额',
                    sort: true
                }, {
                    field: 'Reward',
                    title: '派奖金额',
                    sort: true
                }, {
                    field: 'Money',
                    title: '盈亏金额',
                    sort: true
                }
            ]],
            skin: 'line',

        });
    });

    //游戏下注量统计
    layui.use(['carousel', 'echarts'], function () {
        var $ = layui.$,
            carousel = layui.carousel,
            echarts = layui.echarts;

        var echartsApp = [],
            options = [
                {
                    title: {
                        text: '今日游戏投注量概览/下注额度',
                        x: 'center',
                        textStyle: {
                            fontSize: 14
                        }
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'category',
                        data: []
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: [],
                        type: 'bar'
                    }]
                }, {
                    title: {
                        text: '今日游戏投注量概览/盈亏金额',
                        x: 'center',
                        textStyle: {
                            fontSize: 14
                        }
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'category',
                        data: []
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: [],
                        type: 'bar'
                    }]
                },
                //新增的用户量
                {
                    title: {
                        text: '最近一周新增的用户量',
                        x: 'center',
                        textStyle: {
                            fontSize: 14
                        }
                    },
                    tooltip: { //提示框
                        trigger: 'axis',
                        formatter: "{b}<br>賠率＋賠付＋操作人：{c}"
                    },
                    xAxis: [{ //X轴
                        type: 'category',
                        data: []
                    }],
                    yAxis: [{ //Y轴
                        type: 'value'
                    }],
                    series: [{ //内容
                        type: 'line',
                        data: [],
                    }]
                }
            ],
            elemDataView = $('#LAY-index-dataview').children('div'),
            renderDataView = function (index) {
                echartsApp[index] = echarts.init(elemDataView[index], layui.echartsTheme);
                echartsApp[index].setOption(options[index]);
                window.onresize = echartsApp[index].resize;
            };

        //没找到DOM，终止执行
        if (!elemDataView[0]) return;

        //游戏投注报表/下注额度
        $.ajax({
            "url": "/system/report/bet/categorybet",
            "method": "post",
            "success": function (result) {
                options[0].title.text = '游戏类型下注统计（下注额度）';
                layui.each(result.info.list, function (index, item) {
                    options[0].xAxis.data.push(item.Category);
                    options[0].series[0].data.push(item.BetMoney);
                });
                renderDataView(0);
            }
        });

        //游戏投注报表/盈亏金额
        $.ajax({
            "url": "/system/report/bet/categorybet",
            "method": "post",
            "success": function (result) {
                options[1].title.text = '游戏类型下注统计（盈亏金额）';
                layui.each(result.info.list, function (index, item) {
                    options[1].xAxis.data.push(item.Category);
                    options[1].series[0].data.push(item.SiteMoney);
                });
                renderDataView(1);
            }
        });

        //日賠率報表
        $.ajax({
            "url": "/system/report/bet/categorybet",
            "success": function (result) {
                options[2].title.text = '';
                layui.each(result.info.list, function (index, item) {
                    options[2].xAxis[0].data.push(item.Category);
                    options[2].series[0].data.push(item.BetMoney);
                });
                renderDataView(2);
                console.log(options[2]);
            }
        });

        //监听数据概览轮播
        var carouselIndex = 0;
        carousel.on('change(LAY-index-dataview)', function (obj) {
            renderDataView(carouselIndex = obj.index);
        });

        //监听侧边伸缩
        layui.admin.on('side', function () {
            setTimeout(function () {
                renderDataView(carouselIndex);
            }, 300);
        });

        //监听路由
        layui.admin.on('hash(tab)', function () {
            layui.router().path.join('') || renderDataView(carouselIndex);
        });
    });


    exports('console', {})
});