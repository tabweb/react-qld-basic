/** 敏感词管理 **/

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
    Popconfirm,
    Modal,
    Tooltip,
    Select
} from 'antd';
import tools from '../../../util/tools'; // 工具

// ==================
// 本页面所需action
// ==================

import {
    getList,
    add,
    del,
    check,
    initCache,
} from './action';

// ==================
// Definition
// ==================
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const {Option} = Select;
@connect(
    (state) => ({
        userInfo: state.app.userinfo,           // 用户信息
    }),
    (dispatch) => ({
        actions: bindActionCreators({
            getList, add, del, check, initCache,
        }, dispatch),
    })
)
@Form.create()
export default class SensitiveContainer extends React.Component {
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
            loading: false, // 表格数据是否正在加载中
            searchUsername: undefined, // 搜索 - 角色名
            modalShow: false, // 添加/修改/查看 模态框是否显示
            modalLoading: false, // 添加/修改/查看 是否正在请求中
            pageNum: 1, // 当前第几页
            pageSize: 10, // 每页多少条
            total: 0, // 数据库总共多少条数据
            selectedRow: [],//被选中的id
            selectedRowKeys: [],
            title: '',
            operateType: '',//操作方式
            selectValue: undefined,//验证方式
            checkResult: '',
            replace: '*',
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
        this.props.actions.getList(tools.clearNull(params)).then((res) => {
            if (res.status === 200) {
                this.setState({
                    selectedRow: [],
                    selectedRowKeys: [],
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
        const columns = [
            {
                title: '序号',
                dataIndex: 'serial',
                key: 'serial',
            },
            {
                title: '用户名',
                dataIndex: 'name',
                key: 'name',
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
                name: item.name
            };
        });
    }


    OnDel() {
        if (this.state.selectedRow.length == 0) {
            message.error('请选择需要删除的数据');
        } else {
            this.setState({loading: true});
            const params = {
                ids: this.state.selectedRow,
            };
            this.props.actions.del(params).then((res) => {
                if (res.status === 200) {
                    message.success('删除成功');
                    this.onGetData(this.state.pageNum, this.state.pageSize);
                } else {
                    message.error(res.message);
                }
                this.setState({loading: false});
            }).catch(() => {
                this.setState({loading: false});
            });
        }
    }

    OnRefresh() {
        this.setState({loading: true});
        this.props.actions.initCache().then((res) => {
            if (res.status === 200) {
                message.success('刷新成功');
                this.onGetData(this.state.pageNum, this.state.pageSize);
            } else {
                message.error(res.message);
            }
            this.setState({loading: false});
        }).catch(() => {
            this.setState({loading: false});
        });
    }

    onModalShow = (type) => {
        const {form} = this.props;
        form.resetFields();
        if (type === 'add') { // 新增，需重置表单各控件的值
            this.setState({title: '添加敏感词'});
        } else {
            this.setState({
                title: '验证敏感词',
                checkResult: ''
            });

        }
        this.setState({
            modalShow: true,
            operateType: type,
        });
    };
    /** 新增&修改 模态框关闭 **/
    onClose = () => {
        this.setState({
            modalShow: false,
        });
    };

    onOk = () => {
        const {form} = this.props;
        if (this.state.operateType === 'add') {
            form.validateFields([
                'formTitle',
            ], (err, values) => {
                if (err) {
                    return;
                }
                const params = {
                    word: values.formTitle,
                };
                this.setState({modalLoading: true});
                this.props.actions.add(tools.clearNull(params)).then((res) => {
                    if (res.status === 200) {
                        message.success('添加成功');
                        this.onClose();
                        this.onGetData(this.state.pageNum, this.state.pageSize);
                    } else {
                        message.error(res.message || '添加失败');
                    }
                    this.setState({modalLoading: false});
                }).catch(() => {
                    this.setState({modalLoading: false});
                });
            });
        } else {
            form.validateFields([
                'check',
                'type',
                'replace',
            ], (err, values) => {
                if (err) {
                    return;
                }
                const params = {
                    word: values.check,
                    type: values.type,
                    replace: values.replace,
                };
                this.setState({modalLoading: true});
                this.props.actions.check(tools.clearNull(params)).then((res) => {
                    if (res.status === 200) {
                        this.setState({checkResult: res.data});
                    } else {
                        message.error(res.message || '添加失败');
                    }
                    this.setState({modalLoading: false});
                }).catch(() => {
                    this.setState({modalLoading: false});
                });
            });
        }
    };

    render() {
        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys: selectedRowKeys,
                    selectedRow: selectedRows.map((item) => item.id),
                });
            }
        };
        const {form} = this.props;
        const {getFieldDecorator} = form;
        const formItemLayout = {  // 表单布局
            labelCol: {
                xs: {span: 24},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 19},
            },
        };
        return (
            <div>
                <div className="g-search">
                    <ul className="search-ul">
                        <li>
                            <Button type="primary" onClick={() => this.onModalShow('add')}
                                    icon={"plus-circle"}>添加</Button>
                        </li>
                        <li>
                            <Popconfirm key="3" title="确定删除吗?" onConfirm={() => this.OnDel()}
                                        okText="确定"
                                        cancelText="取消">
                                <Button type="primary" icon={"delete"}>删除</Button>
                            </Popconfirm>
                        </li>
                        <li><Button type="primary" icon={"check-circle"}
                                    onClick={() => this.onModalShow('check')}>验证</Button></li>
                        <li>
                            <Popconfirm key="4" title="刷新缓存耗时可能较长,确定刷新吗?" onConfirm={() => this.OnRefresh()}
                                        okText="确定"
                                        cancelText="取消">
                                <span className="control-btn">
                                    <Tooltip placement="bottom" title="出现词组无效时刷新服务器缓存,耗时较长，慎用!">
                                        <Button type="danger" icon={"sync"}>刷新缓存</Button>
                                    </Tooltip>
                                </span>
                            </Popconfirm>
                        </li>
                        <li><Input placeholder="请输入敏感词" onChange={(e) => this.searchUsernameChange(e)}
                                   value={this.state.key}/>
                        </li>
                        <li><Button icon="search" type="primary" onClick={() => this.onSearch()}>搜索</Button></li>
                    </ul>
                </div>
                <div className="diy-table">
                    <Table
                        columns={this.makeColumns()}
                        loading={this.state.loading}
                        dataSource={this.makeData(this.state.data)}
                        rowSelection={rowSelection}
                        pagination={{
                            total: this.state.total,
                            current: this.state.pageNum,
                            pageSize: this.state.pageSize,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '50', '100', '200'],
                            onShowSizeChange: (current, pageSize) => this.onTablePageChange(current, pageSize),
                            showTotal: (total) => `共 ${total} 条`,
                            onChange: (page, pageSize) => this.onTablePageChange(page, pageSize)
                        }}
                    />
                </div>
                <Modal
                    title={[this.state.title]}
                    visible={this.state.modalShow}
                    onOk={() => this.onOk()}
                    onCancel={() => this.onClose()}
                    confirmLoading={this.state.modalLoading}
                >
                    <Form>
                        <div style={{display: this.state.operateType == 'add' ? 'inline' : 'none'}}>
                            <FormItem
                                label={'敏感词'}
                                {...formItemLayout}
                            >
                                {getFieldDecorator('formTitle', {
                                    initialValue: undefined,
                                    rules: [
                                        {required: true, whitespace: true, message: '请输入敏感词'}
                                    ],
                                })(
                                    <TextArea placeholder="请输入敏感词,多个请用英文逗号分隔" autosize={{minRows: 4, maxRows: 8}}/>
                                )}
                            </FormItem>
                        </div>
                        <div style={{display: this.state.operateType != 'add' ? 'inline' : 'none'}}>
                            <FormItem
                                label={'验证文本'}
                                {...formItemLayout}
                            >
                                {getFieldDecorator('check', {
                                    initialValue: undefined,
                                    rules: [
                                        {required: true, whitespace: true, message: '请输入待验证文本'}
                                    ],
                                })(
                                    <TextArea placeholder="请输入一段待验证的文本" autosize={{minRows: 4, maxRows: 8}}/>
                                )}
                            </FormItem>
                            <FormItem
                                label={'替换文字'}
                                {...formItemLayout}
                            >
                                {getFieldDecorator('replace', {
                                    initialValue: undefined,
                                })(
                                    <Input placeholder="请输入替换文字,默认为*"
                                           onChange={(e) => this.setState({replace: e.target.value == '' ? '*' : e.target.value,})}/>
                                )}
                            </FormItem>
                            <FormItem
                                label={'验证方式'}
                                {...formItemLayout}
                            >
                                {getFieldDecorator('type', {
                                    initialValue: 0,
                                })(
                                    <Select placeholder="请选择验证方式">
                                        <Option key={0} value={0}>提示是否包含敏感词</Option>
                                        <Option key={1} value={1}>提示包含哪些敏感词</Option>
                                        <Option key={2} value={2}>按字替换为{this.state.replace.charAt(0)}</Option>
                                        <Option key={3} value={3}>按词替换为{this.state.replace}</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                label={'验证结果'}
                                {...formItemLayout}
                            >
                                <div style={{color: 'green'}}>{this.state.checkResult}</div>
                            </FormItem>
                        </div>
                    </Form>
                </Modal>
            </div>
        );
    }
}