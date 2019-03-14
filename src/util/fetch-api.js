import React from 'react';
import {baseUrl} from '../config';
import reqwest from 'reqwest';  // 封装了ajax请求的库
import $ from 'jquery'
export default class ApiService extends React.Component {

    // ajax请求
    static newUpload(url, bodyObj) {
        return reqwest({
            url: `${baseUrl}/${url}`,         // URL
            method: 'post',                   // 请求方式
            crossOrigin: true,                // 开启CORS跨域
            withCredentials: true,            // 请求头中是否带cookie，有利于后端开发保持他们需要的session
            processData: false,  //必须false才会避开jQuery对 formdata 的默认处理
            contentType: false,
            data: bodyObj
        }).catch(e => {
            if (e.status === 401) {
                //this.loginOut();
            }
        });
    }

    static newPost(url, bodyObj = {}) {
        this.setTime(bodyObj);
        return reqwest({
            url: `${baseUrl}/${url}`,         // URL
            method: 'post',                   // 请求方式
            contentType: 'application/json;charset=utf-8',  // 消息主体数据类型 JSON
            crossOrigin: true,                // 开启CORS跨域
            withCredentials: true,            // 请求头中是否带cookie，有利于后端开发保持他们需要的session
            data: JSON.stringify(bodyObj),    // 参数，弄成json字符串
            type: 'json'
        }).catch(e => {
            if (e.status === 401) {
                this.loginOut();
            }
        });
    }

    static newPut(url, bodyObj = {}) {
        this.setTime(bodyObj);
        return reqwest({
            url: `${baseUrl}/${url}`,         // URL
            method: 'put',                   // 请求方式
            contentType: 'application/json;charset=utf-8',  // 消息主体数据类型 JSON
            crossOrigin: true,                // 开启CORS跨域
            withCredentials: true,            // 请求头中是否带cookie，有利于后端开发保持他们需要的session
            data: JSON.stringify(bodyObj),    // 参数，弄成json字符串
            type: 'json'
        }).catch(e => {
            if (e.status === 401) {
                this.loginOut();
            }
        });
    }

    static newDelete(url, bodyObj = {}) {
        this.setTime(bodyObj);
        return reqwest({
            url: `${baseUrl}/${url}`,         // URL
            method: 'delete',                   // 请求方式
            contentType: 'application/json;charset=utf-8',  // 消息主体数据类型 JSON
            crossOrigin: true,                // 开启CORS跨域
            withCredentials: true,            // 请求头中是否带cookie，有利于后端开发保持他们需要的session
            data: JSON.stringify(bodyObj),    // 参数，弄成json字符串
            type: 'json'
        }).catch(e => {
            if (e.status === 401) {
                this.loginOut();
            }
        });
    }

    static newGet(url, bodyObj = {}) {
        this.setTime(bodyObj);
        return reqwest({
            url: `${baseUrl}/${url}`,         // URL
            method: 'get',                   // 请求方式
            traditional: false,
            contentType: 'application/json;charset=utf-8',  // 消息主体数据类型 JSON
            crossOrigin: true,                // 开启CORS跨域
            withCredentials: true,            // 请求头中是否带cookie，有利于后端开发保持他们需要的session
            data: (bodyObj != null) && $.param(bodyObj,true)
        }).catch(e => {
            if (e.status === 401) {
                this.loginOut();
            }
        });
    }

    static setTime(bodyObj) {
        if (bodyObj == null) {
            bodyObj = {};
        }
        bodyObj.timestamp = (new Date()).valueOf();
    }

    static loginOut() {
        localStorage.removeItem('userinfo');
        window.location.href = '/login';
    }
}
