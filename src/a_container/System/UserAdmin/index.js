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
    Icon,
    Input,
    Table,
    message,
    Popconfirm,
    Modal,
    Tooltip,
    Divider,
    Select,
    LocaleProvider
} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import c from 'classnames';
import tools from '../../../util/tools'; // 工具

// ==================
// 所需的所有组件
// ==================

import RoleTree from '../../../a_component/TreeChose/RoleTree';

// ==================
// 本页面所需action
// ==================

import {
    getUserRoles,
    addUser,
    upUser,
    delUser,
    disabledUser,
    addUserRoles,
    setPowersByRoleId,
    getUserList,
} from '../../../a_action/sys-action';

// ==================
// Definition
// ==================
const FormItem = Form.Item;
const {Option} = Select;
@connect(
    (state) => ({
        permissions: state.app.permissions,           // 用户信息
    }),
    (dispatch) => ({
        actions: bindActionCreators({
            getUserRoles,
            addUser,
            upUser,
            delUser,
            disabledUser,
            addUserRoles,
            setPowersByRoleId,
            getUserList,
        }, dispatch),
    })
)
@Form.create()
export default class RoleAdminContainer extends React.Component {
    static propTypes = {
        location: P.any,
        history: P.any,
        actions: P.any,
        form: P.any,
    };

    constructor(props) {
        super(props);
        this.state = {
            data: [], // 当前页面全部数据
            roleData: [],   // 所有的角色数据
            operateType: 'add',  // 操作类型 add新增，up修改, see查看
            loading: false, // 表格数据是否正在加载中
            searchUsername: undefined, // 搜索 - 角色名
            searchConditions: undefined,    // 搜索 - 状态
            modalShow: false, // 添加/修改/查看 模态框是否显示
            modalLoading: false, // 添加/修改/查看 是否正在请求中
            nowData: null, // 当前选中用户的信息，用于查看详情、修改、分配菜单
            roleTreeShow: false, // 角色树是否显示
            roleTreeDefault: [], // 用于菜单树，默认需要选中的项
            pageNum: 1, // 当前第几页
            pageSize: 10, // 每页多少条
            total: 0, // 数据库总共多少条数据
            treeLoading: false, // 控制树的loading状态，因为要先加载当前role的菜单，才能显示树
            treeOnOkLoading: false, // 是否正在分配菜单
            required: true,
            pwdMessage: '请输入密码',
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
        this.props.actions.getUserList(tools.clearNull(params)).then((res) => {
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

    /**
     * 添加/修改/查看 模态框出现
     * @item: 当前选中的那条数据
     * @type: add添加/up修改/see查看
     * **/
    onModalShow(data, type) {
        const {form} = this.props;
        if (type === 'add') { // 新增，需重置表单各控件的值
            this.setState({required: true, pwdMessage: '请输入密码'});
            form.resetFields();
        } else {  // 查看或修改，需设置表单各控件的值为当前所选中行的数据
            this.setState({required: false, pwdMessage: '为空时不修改密码'});
            form.resetFields();
            const params = {id: data.id};
            this.props.actions.getUserList(tools.clearNull(params)).then((res) => {
                if (res.status === 200) {
                    data = res.data.list[0];
                    form.setFieldsValue({
                        formUsername: data.userName,
                        formName: data.name,
                        formPhone: data.phone,
                        formEmail: data.email
                    });
                } else {
                    message.error(res.message);
                }
            });
        }
        this.setState({
            modalShow: true,
            nowData: data,
            operateType: type,
        });
    }

    /** 模态框确定 **/
    onOk() {
        const me = this;
        const {form} = me.props;

        if (this.state.operateType === 'see') {  // 是查看
            this.onClose();
            return;
        }

        form.validateFields([
            'formUsername',
            'formPassword',
            'formPhone',
            'formEmail',
            'formName'
        ], (err, values) => {
            if (err) {
                return false;
            }
            me.setState({modalLoading: true});
            const params = {
                userName: values.formUsername,
                password: values.formPassword,
                phone: values.formPhone,
                email: values.formEmail,
                name: values.formName
            };
            if (this.state.operateType === 'add') { // 新增
                me.props.actions.addUser(params).then((res) => {
                    if (res.status === 200) {
                        message.success('添加成功');
                        this.onGetData(this.state.pageNum, this.state.pageSize);
                        this.onClose();
                    } else {
                        message.error(res.message);
                    }
                    me.setState({modalLoading: false});
                }).catch(() => {
                    me.setState({modalLoading: false});
                });
            } else {    // 修改
                params.id = this.state.nowData.id;
                me.props.actions.upUser(params).then((res) => {
                    if (res.status === 200) {
                        message.success('保存成功');
                        this.onGetData(this.state.pageNum, this.state.pageSize);
                        this.onClose();
                    } else {
                        message.error(res.message);
                    }
                    me.setState({modalLoading: false});
                }).catch(() => {
                    me.setState({modalLoading: false});
                });
            }
        });
    }

    // 删除某一条数据
    onDel(id) {
        this.setState({loading: true});
        this.props.actions.delUser({id}).then((res) => {
            if (res.status === 200) {
                message.success('操作成功');
                this.onGetData(this.state.pageNum, this.state.pageSize);
            } else {
                message.error(res.message);
                this.setState({loading: false});
            }
        }).catch(() => {
            this.setState({loading: false});
        });
    }

    onDisabled(id) {
        this.setState({loading: true});
        this.props.actions.disabledUser({id}).then((res) => {
            if (res.status === 200) {
                message.success('操作成功');
                this.onGetData(this.state.pageNum, this.state.pageSize);
            } else {
                message.error(res.message);
                this.setState({loading: false});
            }
        }).catch(() => {
            this.setState({loading: false});
        });
    }

    /** 模态框关闭 **/
    onClose() {
        this.setState({
            modalShow: false,
        });
    }

    /** 分配角色按钮点击，权限控件出现 **/
    onTreeShowClick(record) {
        const params = {id: record.id};
        this.props.actions.getUserRoles(tools.clearNull(params)).then((res) => {

            if (res.status === 200) {
                this.setState({
                    roleData: res.data,
                    roleTreeDefault: res.data.filter((item) => item.checked).map((item) => item.id),
                    nowData: record,
                    roleTreeShow: true,
                });
            } else {
                message.error(res.message);
                this.setState({loading: false});
            }
        });

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
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '电话',
                dataIndex: 'phone',
                key: 'phone',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
                key: 'email',
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (text, record) => text === 1 ? <span style={{color: 'green'}}>启用</span> :
                    <span style={{color: 'red'}}>禁用</span>
            },
            {
                title: '操作',
                key: 'control',
                width: 200,
                render: (text, record) => {
                    if (record.userName != 'admin' && p.includes("user:modify")) {
                        const controls = [];

                        (record.status === 0) && controls.push(
                            <Popconfirm key="5" title="确定启用吗?" onConfirm={() => this.onDisabled(record.id)} okText="确定"
                                        cancelText="取消">
                            <span className="control-btn blue">
                                <Tooltip placement="top" title="启用">
                                    <Icon type="unlock"/>
                                </Tooltip>
                            </span>
                            </Popconfirm>
                        );
                        if (record.status === 1 && p.includes("user:modify")) {
                            controls.push(
                                <Popconfirm key="4" title="确定停用吗?" onConfirm={() => this.onDisabled(record.id)}
                                            okText="确定"
                                            cancelText="取消">
                            <span className="control-btn blue">
                                <Tooltip placement="top" title="停用">
                                    <Icon type="lock"/>
                                </Tooltip>
                            </span>
                                </Popconfirm>
                            );
                            controls.push(
                                <span key="1" className="control-btn blue"
                                      onClick={() => this.onModalShow(record, 'up')}>
                            <Tooltip placement="top" title="修改">
                                <Icon type="edit"/>
                            </Tooltip>
                        </span>
                            );
                        }
                        record.status === 1 && p.includes("user:auth") && controls.push(
                            <span key="2" className="control-btn blue" onClick={() => this.onTreeShowClick(record)}>
                                <Tooltip placement="top" title="分配角色">
                                    <Icon type="tool"/>
                                </Tooltip>
                            </span>
                        );
                        p.includes("user:modify") && (record.allowed === 1) && controls.push(
                            <Popconfirm key="3" title="确定删除吗?" onConfirm={() => this.onDel(record.id)} okText="确定"
                                        cancelText="取消">
                        <span className="control-btn red">
                            <Tooltip placement="top" title="删除">
                                <Icon type="delete"/>
                            </Tooltip>
                        </span>
                            </Popconfirm>
                        );
                        const result = [];
                        controls.forEach((item, index) => {
                            if (index) {
                                result.push(<Divider key={`line${index}`} type="vertical"/>);
                            }
                            result.push(item);
                        });
                        return result;
                    }
                },
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
                name: item.name,
                phone: item.phone,
                email: item.email,
                desc: item.desc,
                status: item.status,
                allowed: item.allowed,
                control: item.id,
                roles: item.roles
            };
        });
    }

    // 分配角色确定
    onRoleOk(keys, objs) {
        const params = {
            id: this.state.nowData.id,
            objectIds: keys.map((item) => Number(item))
        };
        this.setState({
            roleTreeLoading: true,
        });
        this.props.actions.addUserRoles(params).then((res) => {
            if (res.status === 200) {
                message.success('操作成功');
                this.onRoleClose();
            } else {
                message.error(res.message);
            }
            this.setState({
                roleTreeLoading: false,
            });
        }).catch(() => {
            this.setState({
                roleTreeLoading: false,
            });
        });
    }

    // 分配角色树关闭
    onRoleClose() {
        this.setState({
            roleTreeShow: false,
        });
    }

    render() {
        const me = this;
        const {form} = me.props;
        const {getFieldDecorator} = form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 19},
            },
        };
        const p = this.props.permissions;
        return (
            <div>
                <div className="g-search">
                    {p.includes("user:modify") && <ul className="search-func">
                        <li><Button type="primary" onClick={() => this.onModalShow(null, 'add')}><Icon type="user-add"/>添加员工</Button>
                        </li>
                    </ul>}
                    {p.includes("user:modify") && <Divider type="vertical"/>}
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
                    <LocaleProvider locale={zh_CN}>
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
                    </LocaleProvider>
                </div>
                {/* 新增&修改&查看 模态框 */}
                <Modal
                    title={{add: '新增', up: '修改', see: '查看'}[this.state.operateType]}
                    visible={this.state.modalShow}
                    onOk={() => this.onOk()}
                    onCancel={() => this.onClose()}
                    confirmLoading={this.state.modalLoading}
                >
                    <Form autoComplete='off'>
                        <FormItem
                            label="用户名"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('formUsername', {
                                initialValue: undefined,
                                rules: [
                                    {required: true, whitespace: true, message: '请输入用户名'},
                                    {max: 25, message: '最多输入25位字符'}
                                ],
                            })(
                                <Input placeholder="请输入用户名" disabled={this.state.operateType === 'see'}/>
                            )}
                        </FormItem>
                        <FormItem
                            label="姓名"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('formName', {
                                initialValue: undefined,
                                rules: [
                                    {required: true, whitespace: true, message: '请输入姓名'},
                                    {max: 15, message: '最多输入15位字符'}
                                ],
                            })(
                                <Input placeholder="请输入姓名" disabled={this.state.operateType === 'see'}/>
                            )}
                        </FormItem>
                        {(this.state.operateType === "add") || (this.state.operateType === "up") ? (
                            <FormItem
                                label="密码"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('formPassword', {
                                    initialValue: undefined,
                                    rules: [
                                        {required: this.state.required, whitespace: true, message: '请输入密码'},
                                        {min: 6, message: '最少输入6位字符'},
                                        {max: 18, message: '最多输入18位字符'}
                                    ],
                                })(
                                    <Input.Password placeholder={this.state.pwdMessage}/>
                                )}
                            </FormItem>) : ("")

                        }
                        <FormItem
                            label="电话"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('formPhone', {
                                initialValue: undefined,
                                rules: [
                                    {
                                        validator: (rule, value, callback) => {
                                            const v = value;
                                            if (v) {
                                                if (!tools.checkPhone(v)) {
                                                    callback('请输入有效的手机号码');
                                                }
                                            }
                                            callback();
                                        }
                                    },
                                ],
                            })(
                                <Input placeholder="请输入手机号" disabled={this.state.operateType === 'see'}/>
                            )}
                        </FormItem>
                        <FormItem
                            label="邮箱"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('formEmail', {
                                initialValue: undefined,
                                rules: [
                                    {
                                        validator: (rule, value, callback) => {
                                            const v = value;
                                            if (v) {
                                                if (!tools.checkEmail(v)) {
                                                    callback('请输入有效的邮箱地址');
                                                }
                                            }
                                            callback();
                                        }
                                    },
                                ],
                            })(
                                <Input placeholder="请输入邮箱地址" disabled={this.state.operateType === 'see'}/>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
                <RoleTree
                    title={'员工授权'}
                    data={this.state.roleData}
                    visible={this.state.roleTreeShow}
                    defaultKeys={this.state.roleTreeDefault}
                    loading={this.state.roleTreeLoading}
                    onOk={(v) => this.onRoleOk(v)}
                    onClose={() => this.onRoleClose()}
                />
            </div>
        );
    }
}