/**
 * 敏感词
 * **/
import Fetchapi from '../../../util/fetch-api';   // 自己写的工具函数，封装了请求数据的通用接口
import {message} from 'antd';


/**
 * 获取敏感词列表
 * **/
export const getList = (params = {}) => async (dispatch) => {
    try {
        const res = await Fetchapi.newGet('spacecraft/sensitive', params);
        return res;
    } catch (err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 初始化敏感词redis缓存
 * @param params
 * @returns {Function}
 */
export const initCache = () => async (dispatch) => {
    try {
        const res = await Fetchapi.newGet('spacecraft/sensitive/init', null);
        return res;
    } catch (err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 添加敏感词
 *
 * @param params
 * @returns {Function}
 */
export const add = (params = {}) => async (dispatch) => {
    try {
        const res = await Fetchapi.newPost('spacecraft/sensitive', params);
        return res;
    } catch (err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 删除敏感词
 *
 * @param params
 * @returns {Function}
 */
export const del = (params = {}) => async (dispatch) => {
    try {
        const res = await Fetchapi.newDelete('spacecraft/sensitive', params);
        return res;
    } catch (err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 验证敏感词
 *
 * @param params
 * @returns {Function}
 */
export const check = (params = {}) => async (dispatch) => {
    try {
        const res = await Fetchapi.newPost('spacecraft/sensitive/check', params);
        return res;
    } catch (err) {
        message.error('网络错误，请重试');
    }
};