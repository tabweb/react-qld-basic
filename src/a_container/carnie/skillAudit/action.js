import Fetchapi from '../../../util/fetch-api';   // 自己写的工具函数，封装了请求数据的通用接口
import {message} from 'antd';


/**
 * 获取列表
 */
export const getList = (params = {}) => async (dispatch) => {
    try {
        const res = await Fetchapi.newGet('skill/audit', params);
        return res;
    } catch (err) {
        message.error('网络错误，请重试');
        // vic
        let res = {
            "status": 200,
            "messageId": "bd3de995-3948-4f8e-8a90-278d2de5140a",
            "data": {
                "total": 4916,
                "pages": 0,
                "list": [
                    {
                        "id": 75037501345792,
                        "userName": "玄烨",
                        "icon": "https://thirdqq.qlogo.cn/qqapp/1108195067/5FA736745135FF043B948D433DCE7636/100",
                        "serviceName": "王者荣耀",
                        "levelName": "永恒钻石",
                        "introduction": "我随意你无敌，知心小哥哥",
                        "imageUrl": "http://imgmiaozhua.xiyouchat.com/cuteplay/authenticating/75035274854400/skill/1562053125291.png?Expires=1562654564&OSSAccessKeyId=LTAIKCq2lnpFmtT6&Signature=8HTpRxP8Y2Y1GsNU3IXtDzpn8nk%3D&x-oss-process=image%2Fresize%2Cw_800%2Fauto-orient%2C1%2Fquality%2CQ_90%2Fsharpen%2C1%2Fformat%2Cjpg",
                        "audioUrl": "http://imgmiaozhua.xiyouchat.com/cuteplay/authenticating/75035274854400/voice/1562053125794.mp3?Expires=1562414564&OSSAccessKeyId=LTAIKCq2lnpFmtT6&Signature=SL9nD%2BRIQro%2FN%2F23JjFGONtMm4M%3D",
                        "rate": 2,
                        "type": 1,
                        "timestamp": 1562053127238,
                        "reason": null
                    },
                    {
                        "id": 75006405536768,
                        "userName": "✎﹏毒๑药づ",
                        "icon": "https://thirdqq.qlogo.cn/qqapp/1108195067/A3BD4B1D15ABFF5F847ACB289802549A/100",
                        "serviceName": "和平精英",
                        "levelName": "超级王牌",
                        "introduction": "新人，技术嘛...还行吧，挣钱买手机……加油＾０＾~",
                        "imageUrl": "http://imgmiaozhua.xiyouchat.com/cuteplay/authenticating/50119091651584/skill/1562049327745.jpg?Expires=1562654564&OSSAccessKeyId=LTAIKCq2lnpFmtT6&Signature=m4PcwCDOq4u5PHCVtpB%2BUyudSKk%3D&x-oss-process=image%2Fresize%2Cw_800%2Fauto-orient%2C1%2Fquality%2CQ_90%2Fsharpen%2C1%2Fformat%2Cjpg",
                        "audioUrl": "http://imgmiaozhua.xiyouchat.com/cuteplay/authenticating/50119091651584/voice/1562049328805.mp3?Expires=1562414564&OSSAccessKeyId=LTAIKCq2lnpFmtT6&Signature=%2BlFYQR50cPQCFZWwoptdrI%2BWkW8%3D",
                        "rate": 2,
                        "type": 1,
                        "timestamp": 1562049331363,
                        "reason": null
                    },
                    {
                        "id": 74951320095744,
                        "userName": "꯭꯭꯭花꯭",
                        "icon": "http://imgmiaozhua.xiyouchat.com/cuteplay/50219383276544/header/1559023689334.jpg?Expires=1562654564&OSSAccessKeyId=LTAIKCq2lnpFmtT6&Signature=KwSW2VvHmd8JJttnruYM8Tl4SEM%3D&x-oss-process=image%2Fresize%2Cw_200%2Ch_200%2Fauto-orient%2C1%2Fquality%2CQ_90%2Fsharpen%2C1%2Fformat%2Cjpg",
                        "serviceName": "王者荣耀",
                        "levelName": "永恒钻石",
                        "introduction": "在线陪玩",
                        "imageUrl": "http://imgmiaozhua.xiyouchat.com/cuteplay/authenticating/50219383276544/skill/1562042609504.png?Expires=1562654564&OSSAccessKeyId=LTAIKCq2lnpFmtT6&Signature=bN76KeqlevUSXM70ymr05pQJ7iA%3D&x-oss-process=image%2Fresize%2Cw_800%2Fauto-orient%2C1%2Fquality%2CQ_90%2Fsharpen%2C1%2Fformat%2Cjpg",
                        "audioUrl": "http://imgmiaozhua.xiyouchat.com/cuteplay/authenticating/50219383276544/voice/1562042610883.mp3?Expires=1562414564&OSSAccessKeyId=LTAIKCq2lnpFmtT6&Signature=A3BTFRDuyznzA6RVH39TQqDDkKI%3D",
                        "rate": 2,
                        "type": 1,
                        "timestamp": 1562042607066,
                        "reason": null
                    },
                    {
                        "id": 74950286322688,
                        "userName": "来自火星的男朋友",
                        "icon": "https://thirdqq.qlogo.cn/qqapp/1108195067/4CC3CDB9899302F183EF7034A404C96D/100",
                        "serviceName": "英雄联盟",
                        "levelName": "璀璨钻石",
                        "introduction": "啥都能玩，长期稳定在线。",
                        "imageUrl": "http://imgmiaozhua.xiyouchat.com/cuteplay/authenticating/74946235329536/skill/1562042445734.jpg?Expires=1562654564&OSSAccessKeyId=LTAIKCq2lnpFmtT6&Signature=LQuZN3NO08KCWM8pU1ksi%2BqqXWI%3D&x-oss-process=image%2Fresize%2Cw_800%2Fauto-orient%2C1%2Fquality%2CQ_90%2Fsharpen%2C1%2Fformat%2Cjpg",
                        "audioUrl": "http://imgmiaozhua.xiyouchat.com/cuteplay/authenticating/74946235329536/voice/1562042479175.mp3?Expires=1562414564&OSSAccessKeyId=LTAIKCq2lnpFmtT6&Signature=qh8%2FyAlZRLPY18xlNMT%2BHvSs1HM%3D",
                        "rate": 2,
                        "type": 1,
                        "timestamp": 1562042480873,
                        "reason": null
                    },
                    {
                        "id": 74910166413312,
                        "userName": "︿(￣︶￣)︿",
                        "icon": "http://imgmiaozhua.xiyouchat.com/cuteplay/50780236721152/header/1559092096624.jpg?Expires=1562654564&OSSAccessKeyId=LTAIKCq2lnpFmtT6&Signature=cZbBXmts0oqfDNQBCacQbD9aGkE%3D&x-oss-process=image%2Fresize%2Cw_200%2Ch_200%2Fauto-orient%2C1%2Fquality%2CQ_90%2Fsharpen%2C1%2Fformat%2Cjpg",
                        "serviceName": "王者荣耀",
                        "levelName": "百星王者",
                        "introduction": "一起开黑不咯。输赢都脾气很好的那种喔",
                        "imageUrl": "http://imgmiaozhua.xiyouchat.com/cuteplay/authenticating/50780236721152/skill/1562037580221.jpg?Expires=1562654564&OSSAccessKeyId=LTAIKCq2lnpFmtT6&Signature=bcVnYXHnJPv5MPWqpbrJT8O1Z1Y%3D&x-oss-process=image%2Fresize%2Cw_800%2Fauto-orient%2C1%2Fquality%2CQ_90%2Fsharpen%2C1%2Fformat%2Cjpg",
                        "audioUrl": "http://imgmiaozhua.xiyouchat.com/cuteplay/authenticating/50780236721152/voice/1562037582664.mp3?Expires=1562414564&OSSAccessKeyId=LTAIKCq2lnpFmtT6&Signature=tfkJk%2FP0EX20A4jo9BC%2FqNkOLkM%3D",
                        "rate": 2,
                        "type": 1,
                        "timestamp": 1562037583423,
                        "reason": null
                    },
                    {
                        "id": 74618072608768,
                        "userName": "长歌",
                        "icon": "https://thirdqq.qlogo.cn/qqapp/1108195067/A99748B82379BD59C3F4B5BE2FBF9F60/100",
                        "serviceName": "王者荣耀",
                        "levelName": "至尊星耀",
                        "introduction": "不厉害",
                        "imageUrl": "http://imgmiaozhua.xiyouchat.com/cuteplay/authenticating/74616979247104/skill/1562001924990.jpg?Expires=1562654564&OSSAccessKeyId=LTAIKCq2lnpFmtT6&Signature=9TBHXHTOsNp9%2FoBV4M1RMmZPK%2BU%3D&x-oss-process=image%2Fresize%2Cw_800%2Fauto-orient%2C1%2Fquality%2CQ_90%2Fsharpen%2C1%2Fformat%2Cjpg",
                        "audioUrl": "http://imgmiaozhua.xiyouchat.com/cuteplay/authenticating/74616979247104/voice/1562001925862.mp3?Expires=1562414564&OSSAccessKeyId=LTAIKCq2lnpFmtT6&Signature=HGOg9C0ZL64V2dSHtCiugUsY9TU%3D",
                        "rate": 2,
                        "type": 1,
                        "timestamp": 1562001927441,
                        "reason": null
                    },
                    {
                        "id": 74543307665408,
                        "userName": "september",
                        "icon": "https://thirdqq.qlogo.cn/qqapp/1108195067/2617E2D0A7AE494B1F48C4DFFC2BACC5/100",
                        "serviceName": "王者荣耀",
                        "levelName": "永恒钻石",
                        "introduction": "emmm中单或者辅助还可以，别的不很ok",
                        "imageUrl": "http://imgmiaozhua.xiyouchat.com/cuteplay/authenticating/49075456304128/skill/1561992797633.jpg?Expires=1562654564&OSSAccessKeyId=LTAIKCq2lnpFmtT6&Signature=l62Km1M7IqlXVXxjgJYex6fd0xw%3D&x-oss-process=image%2Fresize%2Cw_800%2Fauto-orient%2C1%2Fquality%2CQ_90%2Fsharpen%2C1%2Fformat%2Cjpg",
                        "audioUrl": "http://imgmiaozhua.xiyouchat.com/cuteplay/authenticating/49075456304128/voice/1561992798949.mp3?Expires=1562414564&OSSAccessKeyId=LTAIKCq2lnpFmtT6&Signature=jA82H%2B9EO5vMcY0jiky6mkr583Y%3D",
                        "rate": 2,
                        "type": 1,
                        "timestamp": 1561992800861,
                        "reason": null
                    },
                    {
                        "id": 74518726520832,
                        "userName": "千百枝",
                        "icon": "https://thirdqq.qlogo.cn/qqapp/1108195067/C3E1586D1E55BDF846C7573AE54F23D1/100",
                        "serviceName": "王者荣耀",
                        "levelName": "至尊星耀",
                        "introduction": "打游戏加我",
                        "imageUrl": "http://imgmiaozhua.xiyouchat.com/cuteplay/authenticating/74517102600192/skill/1561989786483.png?Expires=1562654564&OSSAccessKeyId=LTAIKCq2lnpFmtT6&Signature=hmwYP1TwmPTmD0aTPOpSntCyU%2Bs%3D&x-oss-process=image%2Fresize%2Cw_800%2Fauto-orient%2C1%2Fquality%2CQ_90%2Fsharpen%2C1%2Fformat%2Cjpg",
                        "audioUrl": "http://imgmiaozhua.xiyouchat.com/cuteplay/authenticating/74517102600192/voice/1561989788206.mp3?Expires=1562414564&OSSAccessKeyId=LTAIKCq2lnpFmtT6&Signature=sWF77aPsqOUR8RwibJu3lrvz3ds%3D",
                        "rate": 2,
                        "type": 1,
                        "timestamp": 1561989800233,
                        "reason": null
                    },
                    {
                        "id": 74512026373120,
                        "userName": "凌棱（ '▿ ' ）",
                        "icon": "https://thirdqq.qlogo.cn/qqapp/1108195067/048B3A0669AE9C0B3CC910239C2C25BB/100",
                        "serviceName": "和平精英",
                        "levelName": "不朽星钻",
                        "introduction": "也可能是大坑，但人逗",
                        "imageUrl": "http://imgmiaozhua.xiyouchat.com/cuteplay/authenticating/74485694180352/skill/1561988969923.jpg?Expires=1562654564&OSSAccessKeyId=LTAIKCq2lnpFmtT6&Signature=ENwKX9yq5StnFZY65tBzN%2BKuAbY%3D&x-oss-process=image%2Fresize%2Cw_800%2Fauto-orient%2C1%2Fquality%2CQ_90%2Fsharpen%2C1%2Fformat%2Cjpg",
                        "audioUrl": "http://imgmiaozhua.xiyouchat.com/cuteplay/authenticating/74485694180352/voice/1561988980004.mp3?Expires=1562414564&OSSAccessKeyId=LTAIKCq2lnpFmtT6&Signature=65K4bVvtNFHkqo8WtnOL%2FpEpyJM%3D",
                        "rate": 2,
                        "type": 1,
                        "timestamp": 1561988982344,
                        "reason": null
                    },
                    {
                        "id": 74506844659712,
                        "userName": "ゞ 正在缓冲99%",
                        "icon": "https://thirdqq.qlogo.cn/qqapp/1108195067/90FBC9FD374A507EF64D517A89F1D93D/100",
                        "serviceName": "叫醒",
                        "levelName": "",
                        "introduction": "承接早上叫醒业务，只限小姐姐。。每天起的早。时间你定",
                        "imageUrl": "http://imgmiaozhua.xiyouchat.com/cuteplay/authenticating/74466836466688/skill/1561988348043.jpg?Expires=1562654564&OSSAccessKeyId=LTAIKCq2lnpFmtT6&Signature=EBie%2BaCcH2hmBR2MQuEB5Eib%2Bes%3D&x-oss-process=image%2Fresize%2Cw_800%2Fauto-orient%2C1%2Fquality%2CQ_90%2Fsharpen%2C1%2Fformat%2Cjpg",
                        "audioUrl": "http://imgmiaozhua.xiyouchat.com/cuteplay/authenticating/74466836466688/voice/1561988349153.mp3?Expires=1562414564&OSSAccessKeyId=LTAIKCq2lnpFmtT6&Signature=kwLnUnGaxyLImfO6IBH7ZklsHl0%3D",
                        "rate": 2,
                        "type": 1,
                        "timestamp": 1561988349811,
                        "reason": null
                    }
                ]
            },
            "message": "操作成功",
            "timestamp": 1562054564619
        }
        console.log(res);
        return res;
    }
};
/**
 * 提交结果
 */
export const audit = (params = {}) => async (dispatch) => {
    try {
        const res = await Fetchapi.newPut('skill/audit', params);
        return res;
    } catch (err) {
        message.error('网络错误，请重试');
    }
};