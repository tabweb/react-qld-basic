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