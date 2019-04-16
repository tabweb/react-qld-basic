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
    Avatar,
    Icon,
    Divider,
    Modal,
    Tooltip,
    Popconfirm,
    Popover
} from 'antd';
import tools from '../../../util/tools'; // 工具
import moment from 'moment'

import {
    getList, audit
} from './action';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const {Option} = Select;
import css from './index.scss';

// ==================
// Definition
// ==================
@connect(
    (state) => ({
        permissions: state.app.permissions,           // 用户信息
    }),
    (dispatch) => ({
        actions: bindActionCreators({
            getList, audit
        }, dispatch),
    })
)
@Form.create()
export default class SkillAuditContainer extends React.Component {
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
            skillCode: undefined, // 数据库总共多少条数据
            modalShow: false, // 添加/修改/查看 模态框是否显示
            modalLoading: false, // 添加/修改/查看 是否正在请求中
            selectId:undefined
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
            rate: this.state.rate,
            code: this.state.skillCode,
        };
        this.setState({loading: true});
        this.props.actions.getList(tools.clearNull(params)).then((res) => {
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
            rate: v,
        });
    }

    skillCodeConditionsChange(v) {
        this.setState({
            skillCode: v,
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

    showImage(url) {
        Modal.info({
            title: '查看图片附件',
            content: <img src={url} className={css.auditImage}/>,
            width: 800,

        });
    }

    showAudio(url) {
        Modal.info({
            title: '查看音频附件',
            content: <audio src={url} controls/>,
        });
    }

    audit(id, rate, reason) {
        const params = {
            id: id,
            rate: rate,
            reason: reason,
        };
        this.setState({loading: true});
        this.props.actions.audit(tools.clearNull(params)).then((res) => {
            if (res.status === 200) {
                message.success('操作成功');
                this.onGetData(1, this.state.pageSize);
            } else {
                message.error(res.message);
                this.setState({loading: false});
            }
        }).catch(() => {
            this.setState({loading: false});
        });
    }
    onModalShow = (id) => {
        const {form} = this.props;
        form.resetFields();
        this.setState({
            modalShow: true,
            selectId:id,
        });
    };
    // 构建字段
    makeColumns() {
        const p = this.props.permissions;
        const columns = [
            {
                title: '类型',
                dataIndex: 'type',
                key: 'type',
                render: (text) => {
                    return text == 2 ? "修改" : "新增";
                }
            },
            {
                title: '头像',
                dataIndex: 'icon',
                key: 'icon',
                render: (text) => {
                    return <Avatar src={text}></Avatar>
                }
            },
            {
                title: '用户名',
                dataIndex: 'userName',
                key: 'userName',
                render: (text) => {
                    return <Tooltip placement="top" title={text}><span
                        className={css.cellHidden}>{text}</span></Tooltip>;
                },
                width: 100,
            },
            {
                title: '服务名',
                dataIndex: 'serviceName',
                key: 'serviceName',
            },
            {
                title: '等级',
                dataIndex: 'levelName',
                key: 'levelName',
            },
            {
                title: '提交时间',
                dataIndex: 'timestamp',
                key: 'timestamp',
                render: (text) => {
                    return moment(text).format('MM-DD HH:mm');
                }
            },
            {
                title: '附件',
                dataIndex: 'images',
                key: 'images',
                render: (text, record) => {
                    let button = [];
                    button.push(<span key="1" className="control-btn blue"><Icon type="picture"
                                                                                 onClick={() => this.showImage(record.imageUrl)}/></span>)
                    button.push(<Divider type="vertical"/>);
                    button.push(<span key="2" className="control-btn blue"><Icon type="customer-service"
                                                                                 onClick={() => this.showAudio(record.audioUrl)}/></span>)
                    return button;
                }
            },
            {
                title: '自我介绍',
                dataIndex: 'introduction',
                key: 'introduction',
                render: (text) => {
                    return <Tooltip placement="top" title={text}><span
                        className={css.cellHidden}>{text}</span></Tooltip>;
                },
            },
            {
                title: '状态',
                dataIndex: 'rate',
                key: 'rate',
                render: (text) => {
                    if (text == 2) {
                        return "待审核";
                    }
                    if (text == 3) {
                        return "已通过";
                    }
                    if (text == 4) {
                        return "未通过";
                    }
                },
            },
            {
                title: '操作',
                key: 'control',
                width: 120,
                render: (text, record) => {
                    let controls = [];
                    if (record.rate == 2) {
                        controls.push(
                            <span key="1" className="control-btn">
                                <Popconfirm key="3" title="确定通过审核吗?" onConfirm={() => this.audit(record.id, 3, null)}
                                            okText="确定" cancelText="取消">
                                    <Tooltip placement="top" title="通过审核!">
                                        <Icon theme="twoTone" twoToneColor="#52c41a" type="check-circle"/>
                                      </Tooltip>
                                    </Popconfirm>
                            </span>
                        );
                        controls.push(<Divider key={"l1"} type="vertical"/>);

                        controls.push(
                            <span key="2" className="control-btn blue"
                                  onClick={() => this.onModalShow(record.id)}>
                              <Tooltip placement="top" title="不通过审核!">
                                <Icon type="close-circle"/>
                              </Tooltip>
                            </span>
                        );
                    }
                    if (record.rate == 4) {
                        controls.push(
                                <span key="3" className="control-btn blue">
                            <Popover content={record.reason} title="未通过原因">
                                    <Icon type="info-circle"/>
                             </Popover>
                                </span>
                        );
                    }
                    return controls;
                },
            }

        ];
        return columns;
    }

    onOk() {
        const {form} = this.props;
        form.validateFields([
            'reason',
        ], (err, values) => {
            if (err) {
                return;
            }
            const params = {
                id: this.state.selectId,
                rate: 4,
                reason: values.reason,
            };
            this.setState({loading: true});
            this.props.actions.audit(tools.clearNull(params)).then((res) => {
                if (res.status === 200) {
                    message.success('操作成功');
                    this.onGetData(1, this.state.pageSize);
                } else {
                    message.error(res.message);
                }
                this.setState({modalLoading: false,loading: true});
            }).catch(() => {
                this.setState({modalLoading:false,loading: true});
            });
        });
    };

    /** 新增&修改 模态框关闭 **/
    onClose() {
        this.setState({
            selectId:undefined,
            modalShow: false,
        });
    };

    // 构建table所需数据
    makeData(data) {
        return data.map((item, index) => {
            return {
                key: index,
                id: item.id,
                userName: item.userName,
                icon: item.icon,
                serviceName: item.serviceName,
                levelName: item.levelName,
                introduction: item.introduction,
                imageUrl: item.imageUrl,
                audioUrl: item.audioUrl,
                rate: item.rate,
                type: item.type,
                timestamp: item.timestamp,
                reason: item.reason,
            };
        });
    }

    render() {
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
                        {/*<li><Input placeholder="用户名、姓名、手机号" onChange={(e) => this.searchUsernameChange(e)}
                                   value={this.state.key}/></li>*/}
                        <li>
                            <Select key="1" placeholder="请选择服务类型" allowClear style={{width: '200px'}}
                                    onChange={(e) => this.skillCodeConditionsChange(e)}
                                    value={this.state.skillCode}>
                                <Option value={'king'}>王者荣耀</Option>
                                <Option value={'pubg'}>刺激战场</Option>
                                <Option value={'lol'}>英雄联盟</Option>
                            </Select>
                        </li>
                        <li>
                            <Select key="2" placeholder="请选择状态" allowClear style={{width: '200px'}}
                                    onChange={(e) => this.searchConditionsChange(e)}
                                    value={this.state.rate}>
                                <Option value={2}>待审核</Option>
                                <Option value={3}>已通过</Option>
                                <Option value={4}>未通过</Option>
                            </Select>
                        </li>
                        <li><Button className={"auditImage"} icon="search" type="primary"
                                    onClick={() => this.onSearch()}>搜索</Button></li>
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
                <Modal
                    title={'不通过审核'}
                    visible={this.state.modalShow}
                    onOk={() => this.onOk()}
                    onCancel={() => this.onClose()}
                    confirmLoading={this.state.modalLoading}
                >
                    <Form>
                        <FormItem
                            label={'拒绝说明'}
                            {...formItemLayout}
                        >
                            {getFieldDecorator('reason', {
                                initialValue: undefined,
                                rules: [
                                    {required: true, whitespace: true, message: '请输入不通过原因'}
                                ],
                            })(
                                <TextArea placeholder="请输入不通过原因" autosize={{minRows: 4, maxRows: 8}}/>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
}