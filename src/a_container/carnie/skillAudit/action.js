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