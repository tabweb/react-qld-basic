/** User 系统管理/用户管理 **/

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import P from 'prop-types';
import {
    Form,
    Button,
    Input,
    Table,
    message,
    Select,
} from 'antd';
import tools from '../../../util/tools'; // 工具
import moment from 'moment'

import {
    loginLog
} from '../../../a_action/sys-action';

// ==================
// Definition
// ==================
@connect(
    (state) => ({
        permissions: state.app.permissions,           // 用户信息
    }),
    (dispatch) => ({
        actions: bindActionCreators({
            loginLog
        }, dispatch),
    })
)
@Form.create()
export default class LoginLogContainer extends React.Component {
    static propTypes = {
        location: P.any,
        history: P.any,
        actions: P.any,
    };

    constructor(props) {
        super(props);
        this.state = {
            data: [], // 当前页面全部数据
            loading: false, // 表格数据是否正在加载中
            searchUsername: undefined, // 搜索 - 角色名
            searchConditions: undefined,    // 搜索 - 状态
            pageNum: 1, // 当前第几页
            pageSize: 10, // 每页多少条
            total: 0, // 数据库总共多少条数据
        };
    }

    componentDidMount() {
        this.onGetData(this.state.pageNum, this.state.pageSize);
    }

    // 查询当前页面所需列表数据
    onGetData(pageNum, pageSize) {
        const params = {
            pageNum,
            pageSize,
            key: this.state.key,
            status: this.state.status,
        };
        this.setState({loading: true});
        this.props.actions.loginLog(tools.clearNull(params)).then((res) => {
            if (res.status === 200) {
                this.setState({
                    data: res.data.list,
                    total: res.data.total,
                    pageNum,
                    pageSize,
                });
            } else {
                message.error(res.message);
            }
            this.setState({loading: false});
        }).catch(() => {
            this.setState({loading: false});
        });
    }

    // 搜索 - 名称输入框值改变时触发
    searchUsernameChange(e) {
        if (e.target.value.length < 20) {
            this.setState({
                key: e.target.value,
            });
        }
    }

    // 搜索 - 状态下拉框选择时触发
    searchConditionsChange(v) {
        this.setState({
            status: v,
        });
    }

    // 搜索
    onSearch() {
        this.onGetData(1, this.state.pageSize);
    }

    // 表单页码改变
    onTablePageChange(page, pageSize) {
        this.onGetData(page, pageSize);
    }

    // 构建字段
    makeColumns() {
        const p = this.props.permissions;
        const columns = [
            {
                title: '序号',
                dataIndex: 'serial',
                key: 'serial',
            },
            {
                title: '用户名',
                dataIndex: 'userName',
                key: 'userName',
            },
            {
                title: '姓名',
                dataIndex: 'nikeName',
                key: 'nikeName',
            },
            {
                title: '登录时间',
                dataIndex: 'timestamp',
                key: 'timestamp',
                render:(text)=>{
                    return moment(text).format('YYYY-MM-DD HH:mm:ss');
                }
            },
            {
                title: '邮箱',
                dataIndex: 'ip',
                key: 'ip',
            }
        ];
        return columns;
    }

    // 构建table所需数据
    makeData(data) {
        return data.map((item, index) => {
            return {
                key: index,
                id: item.id,
                serial: (index + 1) + (this.state.pageNum - 1) * this.state.pageSize,
                userName: item.userName,
                nikeName: item.nikeName,
                ip: item.ip,
                timestamp: item.timestamp,
            };
        });
    }

    render() {
        return (
            <div>
                <div className="g-search">
                    <ul className="search-ul">
                        <li><Input placeholder="用户名、姓名、手机号" onChange={(e) => this.searchUsernameChange(e)}
                                   value={this.state.key}/></li>
                        <li>
                            <Select placeholder="请选择状态" allowClear style={{width: '200px'}}
                                    onChange={(e) => this.searchConditionsChange(e)}
                                    value={this.state.status}>
                                <Option value={1}>启用</Option>
                                <Option value={0}>禁用</Option>
                            </Select>
                        </li>
                        <li><Button icon="search" type="primary" onClick={() => this.onSearch()}>搜索</Button></li>
                    </ul>
                </div>
                <div className="diy-table">
                    <Table
                        columns={this.makeColumns()}
                        loading={this.state.loading}
                        dataSource={this.makeData(this.state.data)}
                        pagination={{
                            total: this.state.total,
                            current: this.state.pageNum,
                            pageSize: this.state.pageSize,
                            showTotal: (total, range) => `共 ${total} 条`,
                            onChange: (page, pageSize) => this.onTablePageChange(page, pageSize)
                        }}
                    />
                </div>
            </div>
        );
    }
}