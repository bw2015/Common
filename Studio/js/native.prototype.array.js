// 数组扩展
!function () {

    // 数组中是否存在
    Array.prototype.any = function (predicate) {
        let list = this;
        for (let index = 0; index < list.length; index++) {
            if (predicate.apply(list, [list[i]])) {
                return true;
            }
        }
        return false;
    };

    // 返回前多少行
    Array.prototype.take = function (count) {
        let array = this;
        return array.filter((item, index) => index < count);
    };

    // 跳过前多少个
    Array.prototype.take = function(count){
        let array = this;
        return array.filter((item,index)=>item>=count);
    };

}();