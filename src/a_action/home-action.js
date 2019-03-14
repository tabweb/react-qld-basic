/**
 * 首页
 * **/
import Fetchapi from '../util/fetch-api';   // 自己写的工具函数，封装了请求数据的通用接口
import {message} from 'antd';


/**
 * 获取增量 按类型
 * **/
export const getIncrementType = (params = {}) => async (dispatch) => {
    try {
        const res = await Fetchapi.newGet('report/increment/home/'+params.type, null);
        return res;
    } catch (err) {
        message.error('网络错误，请重试');
    }
};
/**
 * 获取增量
 * **/
export const getIncrement = () => async (dispatch) => {
    try {
        const res = await Fetchapi.newGet('report/increment/home', null);
        return res;
    } catch (err) {
        message.error('网络错误，请重试');
    }
};