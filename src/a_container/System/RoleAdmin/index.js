/** Role 系统管理/角色管理 **/

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
import tools from '../../../util/tools'; // 工具
import TreeTable from '../../../a_component/TreeChose/PowerTreeTable';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

// ==================
// 所需的所有组件
// ==================


// ==================
// 本页面所需action
// ==================

import {
    getRolePermissions,
    getRoles,
    addRole,
    upRole,
    delRole,
    disabledRole,
    setPowersByRoleId,
} from '../../../a_action/sys-action';

// ==================
// Definition
// ==================
const FormItem = Form.Item;
const {TextArea} = Input;
const {Option} = Select;
@connect(
    (state) => ({
        permissions: state.app.permissions,
    }),
    (dispatch) => ({
        actions: bindActionCreators({
            getRolePermissions,
            getRoles,
            addRole,
            upRole,
            delRole,
            disabledRole,
            setPowersByRoleId,
        }, dispatch),
    })
)
@Form.create()
export default class RoleAdminContainer extends React.Component {
    static propTypes = {
        location: P.any,
        history: P.any,
        actions: P.any,
        powers: P.array,
        form: P.any,
    };

    constructor(props) {
        super(props);
        this.state = {
            data: [], // 当前页面全部数据
            operateType: 'add',  // 操作类型 add新增，up修改, see查看
            loading: false, // 表格数据是否正在加载中
            key: undefined, // 搜索 - 角色名
            status: undefined,    // 搜索 - 状态
            modalShow: false, // 添加/修改/查看 模态框是否显示
            modalLoading: false, // 添加/修改/查看 是否正在请求中
            nowData: null, // 当前选中用户的信息，用于查看详情、修改、分配菜单
            powerTreeData: [],
            powerTreeShow: false, // 菜单树是否显示
            pageNum: 1, // 当前第几页
            pageSize: 10, // 每页多少条
            total: 0, // 数据库总共多少条数据
            treeLoading: false, // 控制树的loading状态，因为要先加载当前role的菜单，才能显示树
            treeOnOkLoading: false, // 是否正在分配菜单
        };
    }

    componentDidMount() {
        this.onGetData(this.state.pageNum, this.state.pageSize);
    }

    // 查询当前页面所需列表数据
    onGetData(pageNum, pageSize) {
        const p = this.props.powers;
        //if (!p.includes('role:query')){ return; }

        const params = {
            pageNum,
            pageSize,
            key: this.state.key,
            status: this.state.status,
        };
        this.setState({loading: true});
        this.props.actions.getRoles(tools.clearNull(params)).then((res) => {
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

    // 删除某一条数据
    onDel(id) {
        this.setState({loading: true});
        this.props.actions.delRole({id}).then((res) => {
            if (res.status === 200) {
                message.success('删除成功');
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
        this.props.actions.disabledRole({id}).then((res) => {
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

    // 搜索 - 名称输入框值改变时触发
    searchTitleChange(e) {
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
            form.resetFields();
        } else {  // 查看或修改，需设置表单各控件的值为当前所选中行的数据
            form.resetFields();
            const params = {id: data.id};
            this.props.actions.getRoles(tools.clearNull(params)).then((res) => {
                if (res.status === 200) {
                    data = res.data.list[0];
                    form.setFieldsValue({
                        formName: data.name,
                        formCode: data.code,
                        formDesc: data.description,
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
        form.validateFields([
            'formName',
            'formCode',
            'formDesc',
        ], (err, values) => {
            if (err) {
                return false;
            }
            me.setState({modalLoading: true});
            const params = {
                name: values.formName,
                code: values.formCode,
                description: values.formDesc,
            };
            if (this.state.operateType === 'add') { // 新增
                me.props.actions.addRole(params).then((res) => {
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
                me.props.actions.upRole(params).then((res) => {
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

    /** 模态框关闭 **/
    onClose() {
        this.setState({
            modalShow: false,
        });
    }

    /** 分配权限按钮点击，权限控件出现 **/
    onAllotPowerClick(record) {
        const params = {id: record.id};
        this.props.actions.getRolePermissions(tools.clearNull(params)).then((res) => {
            if (res.status === 200) {
                this.setState({
                    powerTreeData: res.data,
                    nowData: record,
                    powerTreeShow: true,
                });
            } else {
                message.error(res.message);
            }
        });
    }

    // 关闭菜单树
    onMenuTreeClose() {
        this.setState({
            powerTreeShow: false,
        });
    }

    // 菜单树确定 给角色分配菜单
    onMenuTreeOk(arr) {
        const params = {
            roleId: this.state.nowData.id,
            menuIds: arr.menuIds,
            permissionIds: arr.permissionIds,
        };
        this.setState({
            treeOnOkLoading: true,
        });
        this.props.actions.setPowersByRoleId(params).then((res) => {
            if (res.status === 200) {
                message.success('权限分配成功');
                this.onGetData(this.state.pageNum, this.state.pageSize);
                this.onMenuTreeClose();
            } else {
                message.error(res.message || '权限分配失败');
            }
            this.setState({
                treeOnOkLoading: false,
            });
        }).catch(() => {
            this.setState({
                treeOnOkLoading: false,
            });
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
                title: '角色名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '角色编码',
                dataIndex: 'code',
                key: 'code',
            },
            {
                title: '角色描述',
                dataIndex: 'description',
                key: 'description',
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
                    const controls = [];
                    if (record.code != 'admin' && p.includes("role:modify")) {
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
                        if (record.status === 1) {
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
                    }
                    p.includes("role:auth") && controls.push(
                        <span key="2" className="control-btn blue" onClick={() => this.onAllotPowerClick(record)}>
                                <Tooltip placement="top" title="分配权限">
                                    <Icon type="tool"/>
                                </Tooltip>
                            </span>
                    );
                    if (record.code != 'admin' && p.includes("role:modify")) {
                        (record.allowed === 1) && controls.push(
                            <Popconfirm key="3" title="确定删除吗?" onConfirm={() => this.onDel(record.id)} okText="确定"
                                        cancelText="取消">
                            <span className="control-btn red">
                                <Tooltip placement="top" title="删除">
                                    <Icon type="delete"/>
                                </Tooltip>
                            </span>
                            </Popconfirm>
                        );
                    }

                    const result = [];
                    controls.forEach((item, index) => {
                        if (index) {
                            result.push(<Divider key={`line${index}`} type="vertical"/>);
                        }
                        result.push(item);
                    });
                    return result;
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
                name: item.name,
                code: item.code,
                allowed: item.allowed,
                status: item.status,
                description: item.description,
                control: item.id,
            };
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
                    {p.includes("role:modify") &&
                    <ul className="search-func">
                        <li><Button type="primary" onClick={() => this.onModalShow(null, 'add')}><Icon
                            type="plus-circle-o"/>添加角色</Button></li>
                    </ul>
                    }
                    {p.includes("role:modify") && (
                        < Divider type="vertical"/>
                    )
                    }
                    <ul className="search-ul">
                        <li><Input placeholder="角色名称或编码" onChange={(e) => this.searchTitleChange(e)}
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
                    <Form>
                        <FormItem
                            label="角色名"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('formName', {
                                initialValue: undefined,
                                rules: [
                                    {required: true, whitespace: true, message: '请输入角色名'},
                                    {max: 25, message: '最多输入25位字符'}
                                ],
                            })(
                                <Input placeholder="请输入角色名"/>
                            )}
                        </FormItem>
                        <FormItem
                            label="角色编码"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('formCode', {
                                initialValue: undefined,
                                rules: [
                                    {required: true, whitespace: true, message: '请输入角色编码'},
                                    {max: 25, message: '最多输入25位字符'}
                                ],
                            })(
                                <Input placeholder="请输入角色编码"/>
                            )}
                        </FormItem>
                        <FormItem
                            label="描述"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('formDesc', {
                                initialValue: undefined,
                                rules: [
                                    {max: 50, message: '最多输入50个字符'}
                                ],
                            })(
                                <TextArea
                                    rows={4}
                                    placeholoder="请输入描述"
                                    autosize={{minRows: 2, maxRows: 6}}
                                />
                            )}
                        </FormItem>
                    </Form>
                </Modal>
                <TreeTable
                    title={this.state.nowData ? `角色授权：${this.state.nowData.name}` : '分配权限'}
                    data={this.state.powerTreeData}
                    initloading={this.state.treeLoading}
                    loading={this.state.treeOnOkLoading}
                    modalShow={this.state.powerTreeShow}
                    onOk={(arr) => this.onMenuTreeOk(arr)}
                    onClose={() => this.onMenuTreeClose()}
                />
            </div>
        );
    }
}