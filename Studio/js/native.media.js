// 多媒体处理扩展类
Fx.media = new Object();
!function (ns) {
    // 获取视频截图，返回 blob 对象
    ns.getBlob = (video, type) => {
        if (!type) type = "image/png";
        let canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);  // 图片大小和视频分辨率一致
        let strDataURL = canvas.toDataURL(type);   // canvas中video中取一帧图片并转成dataURL
        let arr = strDataURL.split(','),
            arrMatch = arr[0].match(/:(.*?);/);
        if (!arrMatch) return null;
        let mime = arrMatch[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        let blob = new Blob([u8arr], {
            type: mime
        });
        canvas.remove();
        canvas = null;
        return blob;
    };

}(Fx.media);