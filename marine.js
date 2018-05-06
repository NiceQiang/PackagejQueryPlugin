/**
 * 这里演示如何封装一个完整额jquery插件，用作记录、学习
 */
+ function ($) {
    'user strict';

    /**
     * 构造函数
     */
    var marine = function (element, options) {
        return this.init(element, options);
    }

    /**
     * 指定允许外部调用的函数
     */
    marine.allowedMethods = [
        'getDefaults', 
        'getRace', 
        'getOptions']


    /**
     * 支持的事件列表
     */
    marine.events = {
        'all': 'onAll', // 全部事件
        'init.begin': 'onInitBegin',
        'init.end': 'onInitEnd',
    }

    /**
     * 默认设置
     */
    marine.prototype.defaults = {
        field1: 'this is field1 default',
        field2: 'this is field2 default',
        onInitBegin: function (name, args) {
            console.log('onInitBegin');
            return false;
        },
        onInitEnd: function (name, args) {
            console.log('onInitEnd');
            return false;
        }
    }

    marine.prototype.getDefaults = function () {
        return this.defaults;
    }

    /**
     * 初始化函数，可以定义些插件属性，成员等
     * @param {*} element 
     * @param {*} options 
     */
    marine.prototype.init = function (element, options) {
        this.$element = $(element);
        // 合并配置参数
        this.options = $.extend({}, this.getDefaults(), this.$element.data(), options);
        this.trigger('init.begin');

        this.race = 'terran';
        this.$element.html('hahaha');

        this.trigger('init.end');

        // 返回初始化后的插件对象
        return this;
    }

    marine.prototype.getOptions = function () {
        return this.options;
    }

    /**
     * 定义函数
     * @param {*} arg1 
     * @param {*} arg2 
     */
    marine.prototype.getRace = function (arg1, arg2) {
        return this.race;
    }

    /**
     * 事件触发器
     * @param {*} name 
     */
    marine.prototype.trigger = function (name) {
        var args = Array.prototype.slice.call(arguments, 1);
        this.options[marine.events[name]].apply(this.options, args);
    };

    function plugin(options) {
        var value;
        var args = Array.prototype.slice.call(arguments, 1);

        this.each(function () {
            var $this = $(this);
            var data = $this.data('marine');
            if (!data) {
                data = new marine(this, options);
                $this.data('marine', data);
            }

            // 调用函数
            if (typeof options === 'string') {
                if ($.inArray(options, marine.allowedMethods) < 0) {
                    throw new Error("Unknown method: " + options);
                }

                if (!data) {
                    return;
                }
                value = data[options].apply(data, args);
            }
        });

        return typeof value === 'undefined' ? this : value;
    }

    // 以插件的方式加入到jquery中
    $.fn.marine = plugin;
    $.fn.marine.constructor = marine;
}(jQuery)