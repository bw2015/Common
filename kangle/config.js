window.onload = e => {
    let elems = document.body.querySelectorAll("div[title^='server ip']"),
        elem = {},
        iplist = [];

    elems.forEach(el => {
        let ip = el.innerText;
        iplist.push(ip);
        if (elem[ip]) {
            elem[ip].push(el);
        } else {
            elem[ip] = [el];
        }
    });

    let data = Array.from(new Set(iplist));

    // 请求远程IP地址
    !function () {
        var myHeaders = new Headers();
        myHeaders.append("Connection", "keep-alive");
        myHeaders.append("Pragma", "no-cache");
        myHeaders.append("Cache-Control", "no-cache");
        myHeaders.append("sec-ch-ua", "\"Google Chrome\";v=\"95\", \"Chromium\";v=\"95\", \";Not A Brand\";v=\"99\"");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("sec-ch-ua-mobile", "?0");
        myHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36");
        myHeaders.append("sec-ch-ua-platform", "\"Windows\"");
        myHeaders.append("Accept", "*/*");
        myHeaders.append("Origin", "chrome-extension://coohjcphdfgbiolnekdpbcijmhambjff");
        myHeaders.append("Sec-Fetch-Site", "none");
        myHeaders.append("Sec-Fetch-Mode", "cors");
        myHeaders.append("Sec-Fetch-Dest", "empty");
        myHeaders.append("Accept-Language", "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7,th;q=0.6");
        myHeaders.append("Accept-Encoding", "deflate, gzip");
        var raw = JSON.stringify(data);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://api.a8.to:8443/IP/Address", requestOptions)
            .then(response => response.json())
            .then(res => {
                for (let ip in res.info) {
                    if (!elem[ip]) return;
                    let address = res.info[ip];
                    elem[ip].forEach(el => {
                        el.innerHTML = ip + `<p style="font-size:12px; color:#ccc;margin:0px;padding:0px;">${address}</p>`;
                    });
                }
            })
            .catch(error => console.log('error', error));
    }();

};