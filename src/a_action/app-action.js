/**
  一些公共的action可以写在这里，比如用户登录、退出登录、权限查询等
  其他的action可以按模块不同，创建不同的js文件
**/

import Fetchapi from '../util/fetch-api';   // 自己写的工具函数，封装了请求数据的通用接口
import { message } from 'antd';

/**
 * 登录
 * @params: { username, password }
 * **/
export const onLogin = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('login', params);
        return res;
    } catch(err) {
        message.error('网络错误，请重试');
        // vic
        let res = {
            "status": 200,
            "messageId": "0e41da32-40f1-4479-9070-4d7cfe772354",
            "data": {
                "userInfo": {
                    "userId": 1,
                    "userName": "系统管理员"
                },
                "menus": [
                    {
                        "id": 1,
                        "parentId": null,
                        "sort": 1,
                        "name": "首页",
                        "code": "home",
                        "icon": "home",
                        "url": "/home"
                    },
                    {
                        "id": 20,
                        "parentId": null,
                        "sort": 5,
                        "name": "基础配置",
                        "code": "config",
                        "icon": "tool",
                        "url": "/config"
                    },
                    {
                        "id": 37,
                        "parentId": null,
                        "sort": 6,
                        "name": "订单管理",
                        "code": "order",
                        "icon": "file-search",
                        "url": "/order"
                    },
                    {
                        "id": 36,
                        "parentId": null,
                        "sort": 7,
                        "name": "业务管理",
                        "code": "carnie",
                        "icon": "profile",
                        "url": "/carnie"
                    },
                    {
                        "id": 47,
                        "parentId": null,
                        "sort": 10,
                        "name": "萌萌",
                        "code": "MM",
                        "icon": "user",
                        "url": "/mm"
                    },
                    {
                        "id": 34,
                        "parentId": null,
                        "sort": 10,
                        "name": "审核业务",
                        "code": "audit",
                        "icon": "security-scan",
                        "url": "/audit"
                    },
                    {
                        "id": 2,
                        "parentId": null,
                        "sort": 99,
                        "name": "系统管理",
                        "code": "home:system",
                        "icon": "setting",
                        "url": "/system"
                    },
                    {
                        "id": 3,
                        "parentId": 2,
                        "sort": 1,
                        "name": "员工管理",
                        "code": "home:system:user",
                        "icon": "user",
                        "url": "/user"
                    },
                    {
                        "id": 4,
                        "parentId": 2,
                        "sort": 2,
                        "name": "角色管理",
                        "code": "home:system:role",
                        "icon": "team",
                        "url": "/role"
                    },
                    {
                        "id": 6,
                        "parentId": 2,
                        "sort": 4,
                        "name": "菜单管理",
                        "code": "home:system:menu",
                        "icon": "bars",
                        "url": "/menu"
                    },
                    {
                        "id": 33,
                        "parentId": 2,
                        "sort": 10,
                        "name": "登录日志",
                        "code": "loginLog",
                        "icon": "solution",
                        "url": "/loginLog"
                    },
                    {
                        "id": 46,
                        "parentId": 20,
                        "sort": 1,
                        "name": "卡片管理",
                        "code": "bank",
                        "icon": "layout",
                        "url": "/bank"
                    },
                    {
                        "id": 44,
                        "parentId": 20,
                        "sort": 1,
                        "name": "标签管理",
                        "code": "tag",
                        "icon": "tag",
                        "url": "/tag"
                    },
                    {
                        "id": 21,
                        "parentId": 20,
                        "sort": 5,
                        "name": "敏感词语",
                        "code": "sensitive",
                        "icon": "exclamation-circle",
                        "url": "/sensitive"
                    },
                    {
                        "id": 35,
                        "parentId": 34,
                        "sort": 1,
                        "name": "技能认证",
                        "code": "skill",
                        "icon": "thunderbolt",
                        "url": "/skill"
                    },
                    {
                        "id": 39,
                        "parentId": 34,
                        "sort": 10,
                        "name": "订单申诉",
                        "code": "orderAppeal",
                        "icon": "file-sync",
                        "url": "/orderAppeal"
                    },
                    {
                        "id": 45,
                        "parentId": 36,
                        "sort": 1,
                        "name": "提现管理",
                        "code": "withdraw",
                        "icon": "pay-circle",
                        "url": "/withdraw"
                    },
                    {
                        "id": 41,
                        "parentId": 36,
                        "sort": 5,
                        "name": "用户管理",
                        "code": "userInfo",
                        "icon": "team",
                        "url": "/userInfo"
                    },
                    {
                        "id": 40,
                        "parentId": 36,
                        "sort": 10,
                        "name": "意见反馈",
                        "code": "feedback",
                        "icon": "api",
                        "url": "/feedback"
                    },
                    {
                        "id": 42,
                        "parentId": 36,
                        "sort": 20,
                        "name": "大神管理",
                        "code": "anchor",
                        "icon": "audit",
                        "url": "/anchor"
                    },
                    {
                        "id": 43,
                        "parentId": 36,
                        "sort": 21,
                        "name": "字典管理",
                        "code": "dictionary",
                        "icon": "audit",
                        "url": "/dictionary"
                    },
                    {
                        "id": 38,
                        "parentId": 37,
                        "sort": 10,
                        "name": "订单信息",
                        "code": "list",
                        "icon": "ordered-list",
                        "url": "/list"
                    },
                    {
                        "id": 48,
                        "parentId": 47,
                        "sort": 1,
                        "name": "公告管理",
                        "code": "notice",
                        "icon": "share-alt",
                        "url": "/notice"
                    }
                ],
                "permissions": [
                    {
                        "id": 31,
                        "name": "修改员工",
                        "code": "user:modify"
                    },
                    {
                        "id": 32,
                        "name": "员工授权",
                        "code": "user:auth"
                    },
                    {
                        "id": 29,
                        "name": "修改角色",
                        "code": "role:modify"
                    },
                    {
                        "id": 30,
                        "name": "角色授权",
                        "code": "role:auth"
                    },
                    {
                        "id": 23,
                        "name": "新增菜单",
                        "code": "menu:add"
                    },
                    {
                        "id": 25,
                        "name": "编辑菜单",
                        "code": "menu:modify"
                    },
                    {
                        "id": 26,
                        "name": "删除菜单",
                        "code": "menu:delete"
                    },
                    {
                        "id": 24,
                        "name": "新增权限",
                        "code": "permission:add"
                    },
                    {
                        "id": 27,
                        "name": "修改权限",
                        "code": "permission:modify"
                    },
                    {
                        "id": 28,
                        "name": "删除权限",
                        "code": "permission:delete"
                    }
                ]
            },
            "message": "操作成功",
            "timestamp": 1562053191007
        }
        console.log('res',res);
        return res;
    }
};

/**
 * 退出登录
 * @params: null
 * **/
export const onLogout = (params = {}) => async(dispatch) => {
    try {
        Fetchapi.newGet("loginOut",null);
        await dispatch({
            type: 'APP.onLogout',
            payload: null,
        });
        sessionStorage.removeItem('userinfo');
        return 'success';
    } catch(err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 设置用户信息
 * @params: userinfo
 * **/
export const setUserInfo = (params = {}) => async(dispatch) => {
    try {
        await dispatch({
            type: 'APP.setUserInfo',
            payload: params,
        });
        return 'success';
    } catch(err) {
        message.error('网络错误，请重试');
    }
};