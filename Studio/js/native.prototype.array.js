// 数组扩展
!function () {

    Array.nativeVersion = "1.0.0";

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
    Array.prototype.take = function (count) {
        let array = this;
        return array.filter((item, index) => item >= count);
    };

    // 在数组中随机选取一个
    Array.prototype.getRandom = function () {
        let array = this,
            index = Math.floor(Math.random() * array.length);
        return array[index];
    };

    // 在数组中随机取N个
    Array.prototype.getRandomList = function (count) {
        let array = this;
        array = array.sort(() => Math.random() - 0.5);
        return array.take(count);
    };
}();