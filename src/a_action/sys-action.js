/**
 * 系统模块action
 * **/
import Fetchapi from '../util/fetch-api';   // 自己写的工具函数，封装了请求数据的通用接口
import {message} from 'antd';


/**
 * 获取所有菜单
 * **/
export const getMenus = (params = {}) => async (dispatch) => {
    try {
        const res = await Fetchapi.newGet('system/permission/tree', params);
        return res;
    } catch (err) {
        message.error('网络错误，请重试');
    }
};

export const getPermissions = (params = {}) => async (dispatch) => {
    try {
        if (params.parentId === '0') {
            delete params['parentId'];
        }
        const res = await Fetchapi.newGet('system/permission', params);
        return res;
    } catch (err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 添加菜单
 * @params: {
    'name',
    'url',
    'parent',
    'icon',
    'desc',
    'sorts',
    'conditions',
 * }
 * **/
export const addMenu = (params = {}) => async (dispatch) => {
    try {
        const res = await Fetchapi.newPost('system/permission', params);
        return res;
    } catch (err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 修改菜单
 * **/
export const upMenu = (params = {}) => async (dispatch) => {
    try {
        const res = await Fetchapi.newPut('system/permission', params);
        return res;
    } catch (err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 删除菜单
 * **/
export const delMenu = (params = {}) => async (dispatch) => {
    try {
        const res = await Fetchapi.newDelete('system/permission/' + params.id, params);
        return res;
    } catch (err) {
        message.error('网络错误，请重试');
    }
};


/**
 * 分页查询角色数据
 * **/
export const getRoles = (params = {}) => async (dispatch) => {
    try {
        const res = await Fetchapi.newGet('system/role', params);
        return res;
    } catch (err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 查询所有角色数据
 * **/
export const getUserRoles = (params = {}) => async (dispatch) => {
    try {
        const res = await Fetchapi.newGet('system/user/roles/'+params.id, null);
        return res;
    } catch (err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 添加员工角色
 * **/
export const addUserRoles = (params = {}) => async (dispatch) => {
    try {
        const res = await Fetchapi.newPost('system/user/roles', params);
        return res;
    } catch (err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 添加角色
 * **/
export const addRole = (params = {}) => async (dispatch) => {
    try {
        const res = await Fetchapi.newPost('system/role', params);
        return res;
    } catch (err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 修改角色
 * **/
export const upRole = (params = {}) => async (dispatch) => {
    try {
        const res = await Fetchapi.newPut('system/role', params);
        return res;
    } catch (err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 删除角色
 * **/
export const delRole = (params = {}) => async (dispatch) => {
    try {
        const res = await Fetchapi.newDelete('system/role/' + params.id, null);
        return res;
    } catch (err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 删除角色
 * **/
export const disabledRole = (params = {}) => async (dispatch) => {
    try {
        const res = await Fetchapi.newPut('system/role/disabled/' + params.id, null);
        return res;
    } catch (err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 获取所有的菜单及权限详细信息
 * **/
export const getRolePermissions = (params = {}) => async (dispatch) => {
    try {
        const res = await Fetchapi.newGet('system/role/permissions/' + params.id, null);
        return res;
    } catch (err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 通过角色ID给指定角色设置菜单及权限
 * **/
export const setPowersByRoleId = (params = {}) => async (dispatch) => {
    try {
        const res = await Fetchapi.newPost('system/role/permissions', params);
        return res;
    } catch (err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 条件分页查询用户列表
 * **/
export const getUserList = (params = {}) => async (dispatch) => {
    try {
        const res = await Fetchapi.newGet('system/user', params);
        return res;
    } catch (err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 添加用户
 * **/
export const addUser = (params = {}) => async (dispatch) => {
    try {
        const res = await Fetchapi.newPost('system/user', params);
        return res;
    } catch (err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 修改用户
 * **/
export const upUser = (params = {}) => async (dispatch) => {
    try {
        const res = await Fetchapi.newPut('system/user', params);
        return res;
    } catch (err) {
        message.error('网络错误，请重试');
    }
};

/**
 * 删除用户
 * **/
export const delUser = (params = {}) => async (dispatch) => {
    try {
        const res = await Fetchapi.newDelete('system/user/' + params.id, null);
        return res;
    } catch (err) {
        message.error('网络错误，请重试');
    }
};

export const disabledUser = (params = {}) => async (dispatch) => {
    try {
        const res = await Fetchapi.newPut('system/user/disabled/' + params.id, null);
        return res;
    } catch (err) {
        message.error('网络错误，请重试');
    }
};