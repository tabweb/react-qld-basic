/** 菜单管理页 **/

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import {connect} from 'react-redux';
import c from 'classnames';
import tools from '../../../util/tools';
import {bindActionCreators} from 'redux';
import P from 'prop-types';
import {Link, hashHistory} from 'react-router';
import css from './index.scss';
// ==================
// 所需的所有组件
// ==================

import {
    Tree,
    Button,
    Table,
    Tooltip,
    Icon,
    Popconfirm,
    Modal,
    Form,
    Select,
    Input,
    InputNumber,
    message,
    Divider, LocaleProvider
} from 'antd';
import {Icons} from '../../../util/json';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
// ==================
// 本页面所需action
// ==================

import {addMenu, getMenus, upMenu, delMenu, getPermissions} from '../../../a_action/sys-action';

// ==================
// Definition
// ==================
const {TreeNode} = Tree;
const FormItem = Form.Item;
const {Option} = Select;

@connect(
    (state) => ({
        permissions: state.app.permissions,
    }),
    (dispatch) => ({
        actions: bindActionCreators({addMenu, getMenus, upMenu, delMenu, getPermissions}, dispatch),
    })
)
@Form.create()
export default class MenuAdminContainer extends React.Component {

    static propTypes = {
        location: P.any,
        history: P.any,
        actions: P.any,
        form: P.any,
    };

    constructor(props) {
        super(props);
        this.state = {
            data: [],   // 所有的菜单数据（未分层级）
            sourceData: [], // 所有的菜单数据（分层级）
            loading: false,   // 页面主要数据是否正在加载中
            tableData: [],   // 表格所需数据 （所选tree节点的直接子级）
            treeSelect: {title: '根节点', id: '0', level: '0'},   // 当前Menu树被选中的节点id值
            nowData: null,  // 当前选中的那条数据
            operateType: 'add',  // 操作类型 add新增，up修改, see查看
            modalShow: false,   // 新增&修改 模态框是否显示
            modalLoading: false,// 新增&修改 模态框是否正在执行请求
            menuAddButton: 'inline',
            permissionButton: 'none',
            selectValue: undefined,
            modelTitle: undefined,
            urlRequired: true,
            menuAddDiv: 'inline',
            addMenu: 1,//添加菜单 1菜单 2权限
        };
    }

    componentDidMount() {
        this.getData();
        this.getPermissions();
    }

    /** 获取本页面所需数据 **/
    getData() {
        this.setState({
            loading: true,
        });
        this.props.actions.getMenus().then((res) => {
            if (res.status === 200) {
                this.setState({
                    data: res.data,
                });
                this.makeSourceData(res.data);
            }
            this.setState({
                loading: false,
            });
        }).catch(() => {
            this.setState({
                loading: false,
            });
        });

    };

    searchChange(e) {
        this.setState({selectValue: e,});
        this.getPermissions(this.state.treeSelect.id, e);
    }

    getPermissions(id, type) {
        this.setState({
            loading: true,
        });
        const params = {
            parentId: id,
            type: type,
        };
        this.props.actions.getPermissions(tools.clearNull(params)).then((res) => {
            if (res.status === 200) {
                this.setState({
                    tableData: res.data,
                });
            }
            this.setState({
                loading: false,
            });
        }).catch(() => {
            this.setState({
                loading: false,
            });
        });
    }

    /** 处理原始数据，将原始数据处理为层级关系 **/
    makeSourceData(data) {
        const d = data;
        // 按照sort排序
        d.sort((a, b) => {
            return a.sort - b.sort;
        });
        const sourceData = this.dataToJson(null, d) || [];
        this.setState({
            sourceData,
        });
    }

    /** 工具 - 递归将扁平数据转换为层级数据 **/
    dataToJson(one, data) {
        let kids;
        if (!one) { // 第1次递归
            kids = data.filter((item) => !item.parentId);
        } else {
            kids = data.filter((item) => item.parentId === one.id);
        }
        kids.forEach((item) => item.children = this.dataToJson(item, data));
        return kids.length ? kids : null;
    }

    /** 递归构建树结构 **/
    makeTreeDom(data) {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.name} key={`${item.id}`} level={item.level} icon={<Icon type={item.icon}/>}>
                        {this.makeTreeDom(item.children)}
                    </TreeNode>
                );
            } else {
                return <TreeNode title={item.name} key={`${item.id}`} level={item.level}
                                 icon={<Icon type={item.icon}/>}/>;
            }
        });
    }

    /** 点击树目录时触发 **/
    onTreeSelect = (keys, e) => {
        let treeSelect = {title: '根节点', id: '0', level: '0'};
        if (e.selected) {   // 选中
            const p = e.node.props;
            treeSelect = {title: p.title, id: p.eventKey, level: e.node.props.level};
        }
        this.setState({
            treeSelect,
            selectValue: undefined,
        });
        let level = treeSelect.level;
        if (level < 2) {
            this.setState({menuAddButton: 'inline'});
        } else {
            this.setState({menuAddButton: 'none'});
        }
        if (level > 0) {
            this.setState({permissionButton: 'inline'});
        } else {
            this.setState({permissionButton: 'none'});
        }
        this.getPermissions(treeSelect.id, null);
    };

    /** 新增&修改 模态框出现 **/
    onModalShow = (menu, type, record) => {
        const {form} = this.props;
        let data = null;
        if (type === 'add') { // 新增，需重置表单各控件的值
            form.resetFields();
        } else {  // 查看或修改，需设置表单各控件的值为当前所选中行的数据
            const params = {id: record.id};
            this.props.actions.getPermissions(params).then((res) => {
                if (res.status === 200) {
                    data = res.data[0];
                    form.setFieldsValue({
                        formCode: data.code,
                        formIcon: data.icon,
                        formSorts: data.sort,
                        formTitle: data.name,
                        formUrl: data.url,
                    });
                    this.setState({
                        nowData: data,
                    });
                } else {
                    message.error(res.message);
                }
            });
        }

        this.setState({
            modalShow: true,
            operateType: type,
            modelTitle: menu == 1 ? "菜单" : "权限",
            menuAddDiv: menu == 1 ? 'inline' : 'none',
            urlRequired: menu == 1 ? true : false,
            addMenu: menu,
        });
    };

    /** 新增&修改 模态框关闭 **/
    onClose = () => {
        this.setState({
            modalShow: false,
        });
    };

    /** 新增&修改 提交 **/
    onOk = () => {
        const {form} = this.props;
        form.validateFields([
            'formTitle',
            'formUrl',
            'formIcon',
            'formCode',
            'formSorts',
        ], (err, values) => {
            if (err) {
                return;
            }
            const params = {
                name: values.formTitle,
                url: values.formUrl,
                icon: values.formIcon,
                parentId: Number(this.state.treeSelect.id) || null,
                type: this.state.addMenu,
                sort: values.formSorts,
                code: values.formCode,
            };
            if (this.state.operateType === 'add') { // 新增
                this.props.actions.addMenu(tools.clearNull(params)).then((res) => {
                    if (res.status === 200) {
                        message.success('添加成功');
                        this.getData();
                        this.getPermissions(this.state.treeSelect.id, null);
                        this.onClose();
                    } else {
                        message.error(res.message || '添加失败');
                    }
                    this.setState({modalLoading: false});
                }).catch(() => {
                    this.setState({modalLoading: false});
                });
            } else {    // 修改
                params.id = this.state.nowData.id;
                this.props.actions.upMenu(tools.clearNull(params)).then((res) => {
                    if (res.status === 200) {
                        message.success('保存成功');
                        this.getData();
                        this.getPermissions(this.state.treeSelect.id, null);
                        this.onClose();
                    } else {
                        message.error(res.message || '修改失败');
                    }
                    this.setState({modalLoading: false});
                }).catch(() => {
                    this.setState({modalLoading: false});
                });
            }

            this.setState({modalLoading: true});
        });
    };

    /** 删除一条数据 **/
    onDel = (record) => {
        const params = {id: record.id};
        this.props.actions.delMenu(params).then((res) => {
            if (res.status === 200) {
                this.getData();
                this.getPermissions(this.state.treeSelect.id, null);
                message.success('删除成功');
            } else {
                message.error(res.message);
            }
        });
    };

    /** 构建表格字段 **/
    makeColumns = () => {
        const p = this.props.permissions;
        const columns = [
            {
                title: '图标',
                dataIndex: 'icon',
                key: 'icon',
                render: (text) => {
                    return text ? <Icon type={text}/> : '';
                }
            },
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '类型',
                dataIndex: 'type',
                key: 'type',
                render: (text) => text == 1 ? <span style={{color: 'green'}}>菜单</span> :
                    <span style={{color: 'blue'}}>按钮</span>
            },
            {
                title: '编码',
                dataIndex: 'code',
                key: 'code',
            },
            {
                title: '路径',
                dataIndex: 'url',
                key: 'url',

            },
            {
                title: '排序',
                dataIndex: 'sort',
                key: 'sort',
            },
            {
                title: '操作',
                key: 'control',
                width: 120,
                render: (text, record) => {
                    let controls = [];
                    if (record.type == 1) {
                        p.includes("menu:modify") && controls.push(
                            <span key="1" className="control-btn blue"
                                  onClick={() => this.onModalShow(record.type, 'up', record)}>
                            <Tooltip placement="top" title="修改">
                                <Icon type="edit"/>
                            </Tooltip>
                        </span>
                        );
                        p.includes("menu:delete") && controls.push(
                            <Popconfirm key="2" title="确定删除吗?" okText="确定" cancelText="取消"
                                        onConfirm={() => this.onDel(record)}>
                            <span className="control-btn red">
                                <Tooltip placement="top" title="删除">
                                    <Icon type="delete"/>
                                </Tooltip>
                            </span>
                            </Popconfirm>
                        );
                    }
                    if (record.type == 2) {
                        p.includes("permission:modify") && controls.push(
                            <span key="1" className="control-btn blue"
                                  onClick={() => this.onModalShow(record.type, 'up', record)}>
                            <Tooltip placement="top" title="修改">
                                <Icon type="edit"/>
                            </Tooltip>
                        </span>
                        );
                        p.includes("permission:modify") && controls.push(
                            <Popconfirm key="2" title="确定删除吗?" okText="确定" cancelText="取消"
                                        onConfirm={() => this.onDel(record)}>
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
                            result.push(<Divider key={`line${index}`} type="vertical"/>,);
                        }
                        result.push(item);
                    });
                    return result;
                },
            }
        ];
        return columns;
    };

    /** 构建表格数据 **/
    makeData(data) {
        if (!data) {
            return [];
        }
        return data.map((item, index) => {
            return {
                key: index,
                id: item.id,
                icon: item.icon,
                code: item.code,
                name: item.name,
                url: item.url,
                sort: item.sort,
                type: item.type,
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
        const p = this.props.permissions;
        return (
            <div className={c(css.page, 'flex-row')}>
                <div className={c(css.l)}>
                    <div className={css.title}>菜单目录123</div>
                    <div>
                        <Tree
                            defaultExpandedKeys={['0']}
                            onSelect={this.onTreeSelect}
                            selectedKeys={[String(this.state.treeSelect.id)]}
                            showIcon
                            switcherIcon={<Icon type="down"/>}
                        >
                            <TreeNode title="根节点" key="0" level='0' icon={<Icon type="menu-unfold"/>}>
                                {this.makeTreeDom(this.state.sourceData)}
                            </TreeNode>
                        </Tree>
                    </div>
                </div>
                <div className={c(css.r, 'flex-auto')}>
                    <div className={css.searchBox}>
                        <ul className={'flex-row'}>
                            <li>
                                {p.includes('menu:add') && (
                                    <div style={{display: this.state.menuAddButton}}>
                                        <Button
                                            type="primary"
                                            icon="plus-circle-o"
                                            onClick={() => this.onModalShow(1, 'add', null)}
                                        >
                                            {`添加${this.state.treeSelect.title || ''}子菜单`}
                                        </Button>
                                        <Divider type="vertical"/>
                                    </div>)
                                }
                                {p.includes('permission:add') && (
                                    <div style={{display: this.state.permissionButton}}>
                                        <Button
                                            type="primary"
                                            icon="plus-square-o"
                                            onClick={() => this.onModalShow(2, 'add')}
                                        >
                                            {`添加${this.state.treeSelect.title || ''}子权限`}
                                        </Button>
                                        <Divider type="vertical"/>
                                    </div>)
                                }
                                <Select placeholder="请选择权限类型" allowClear style={{width: '150px'}}
                                        onChange={(e) => this.searchChange(e)} value={this.state.selectValue}>
                                    <Option value={1}>菜单</Option>
                                    <Option value={2}>权限</Option>
                                </Select>
                            </li>
                        </ul>
                    </div>
                    <LocaleProvider locale={zh_CN}>
                        <Table
                            className={'diy-table'}
                            columns={this.makeColumns()}
                            loading={this.state.loading}
                            dataSource={this.makeData(this.state.tableData)}
                            pagination={{
                                pageSize: this.state.pageSize,
                                showTotal: (total, range) => `共 ${total} 条`,
                            }}
                        />
                    </LocaleProvider>
                </div>
                {/** 查看&新增&修改用户模态框 **/}
                <Modal
                    title={{
                        add: '新增' + this.state.modelTitle,
                        up: '修改' + this.state.modelTitle
                    }[this.state.operateType]}
                    visible={this.state.modalShow}
                    onOk={this.onOk}
                    onCancel={this.onClose}
                    confirmLoading={this.state.modalLoading}
                >
                    <Form>
                        <FormItem
                            label={this.state.modelTitle + '名称'}
                            {...formItemLayout}
                        >
                            {getFieldDecorator('formTitle', {
                                initialValue: undefined,
                                rules: [
                                    {required: true, whitespace: true, message: '必填'},
                                    {max: 20, message: '最多输入20位字符'}
                                ],
                            })(
                                <Input placeholder="请输入名称"/>
                            )}
                        </FormItem>
                        <FormItem
                            label={this.state.modelTitle + '编码'}
                            {...formItemLayout}
                        >
                            {getFieldDecorator('formCode', {
                                initialValue: undefined,
                                rules: [
                                    {required: true, whitespace: true, message: '必填'},
                                    {max: 20, message: '最多输入20位字符'}
                                ],
                            })(
                                <Input placeholder="请输入编码"/>
                            )}
                        </FormItem>
                        <div style={{display: this.state.menuAddDiv}}>
                            <FormItem
                                label="URL"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('formUrl', {
                                    initialValue: undefined,
                                    rules: [
                                        {required: this.state.urlRequired, whitespace: true, message: '必填'},
                                    ],
                                })(
                                    <Input placeholder="请输入URL"/>
                                )}
                            </FormItem>
                            <FormItem
                                label="图标"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('formIcon', {
                                    initialValue: undefined,
                                })(
                                    <Select
                                        dropdownClassName={css.iconSelect}
                                    >
                                        {
                                            Icons.map((item, index) => {
                                                return <Option key={index} value={item}><Icon type={item}/></Option>;
                                            })
                                        }
                                    </Select>
                                )}

                            </FormItem>
                        </div>
                        <FormItem
                            label="排序"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('formSorts', {
                                initialValue: 1,
                                rules: [{required: true, message: '请输入排序号'}],
                            })(
                                <InputNumber min={0} max={99999} style={{width: '100%'}}/>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
}
