/** 头部 **/
import React from 'react';
import P from 'prop-types';
import {Link} from 'react-router-dom';
import {
    Layout,
    Icon,
    Tooltip,
    Menu,
    Dropdown,
    Form,
    Input,
    Modal, message
} from 'antd';
import c from 'classnames';
import css from './index.scss';

import {modifyPwd} from '../../a_action/sys-action';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

const FormItem = Form.Item;
const {Header} = Layout;
@connect(
    (state) => ({
        permissions: state.app.permissions,
    }),
    (dispatch) => ({
        actions: bindActionCreators({modifyPwd}, dispatch),
    })
)
@Form.create()
export default class Com extends React.PureComponent {
    static propTypes = {
        onToggle: P.func,   // 菜单收起与展开状态切换
        collapsed: P.bool,  // 菜单的状态
        onLogout: P.func,   // 退出登录
        userinfo: P.object, // 用户信息
        form: P.any,
    };

    constructor(props) {
        super(props);
        this.state = {
            modalShow: false
        };
    }

    /** 点击左侧按钮时触发 **/
    toggle = () => {
        this.props.onToggle();
    };

    /**
     * 退出登录
     * **/
    onMenuClick = (e) => {
        if (e.key === 'logout') {   // 退出按钮被点击
            this.props.onLogout();
        } else if (e.key == 'modifyPwd') {
            this.props.form.resetFields();
            this.setState({
                modalShow: true,
            });
        }
    };

    onOk = () => {
        const me = this;
        const {form} = me.props;

        if (this.state.operateType === 'see') {  // 是查看
            this.onClose();
            return;
        }

        form.validateFields([
            'formOldPassword',
            'formPassword',
            'formConfirmPassword',
        ], (err, values) => {
            if (err) {
                return false;
            }
            me.setState({modalLoading: true});
            const params = {
                id: me.props.userinfo.userId,
                password: values.formPassword,
                oldPassword: values.formOldPassword,
            };
            me.props.actions.modifyPwd(params).then((res) => {
                if (res.status === 200) {
                    message.success('修改成功');
                    this.onClose();
                } else {
                    message.error(res.message);
                }
                me.setState({modalLoading: false});
            }).catch(() => {
                me.setState({modalLoading: false});
            });

        });
    }

    /** 模态框关闭 **/
    onClose = () => {
        this.setState({
            modalShow: false,
        });
    }

    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (form.getFieldValue('formConfirmPassword') && form.getFieldValue('formPassword') && form.getFieldValue('formConfirmPassword') !== form.getFieldValue('formPassword')) {
            callback('两次密码输入不一致！');
        } else {
            callback();
        }
    }
    pwdBlur = (rule, value, callback) => {
        const form = this.props.form;
        form.getFieldValue('formConfirmPassword') && form.validateFields([
                'formConfirmPassword',
            ], (err) => {
                if (err) {
                    return false;
                }
            }
        );
        callback();
    }


    render() {
        const u = this.props.userinfo;
        const {getFieldDecorator} = this.props.form;
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
        return (
            <Header className={css.header}>
                <Tooltip
                    placement="bottom"
                    title={this.props.collapsed ? '展开菜单' : '收起菜单'}
                >
                    <Icon
                        className={c(css.trigger, {[css.fold]: !this.props.collapsed}, 'flex-none')}
                        type={'menu-unfold'}
                        onClick={this.toggle}
                    />
                </Tooltip>
                <div className={c(css.rightBox, 'flex-auto flex-row flex-je flex-ac')}>
                    {
                        u ? (
                            <Dropdown
                                overlay={
                                    <Menu className={css.menu} selectedKeys={[]} onClick={this.onMenuClick}>
                                        {/* <Menu.Item><Icon type="user" />个人中心</Menu.Item>*/}
                                        <Menu.Item key="modifyPwd"><Icon type="unlock"/>修改密码</Menu.Item>
                                        <Menu.Divider/>
                                        <Menu.Item key="logout"><Icon type="logout"/>退出登录</Menu.Item>
                                    </Menu>
                                }
                                placement="bottomRight"
                            >
                                <div className={c(css.userhead, 'flex-row flex-ac')}>
                                    <Icon type="bulb"/>
                                    <span className={css.username}>{u.userName}</span>
                                </div>
                            </Dropdown>
                        ) : (
                            <Tooltip
                                placement="bottom"
                                title="点击登录"
                            >
                                <div className={css.full}>
                                    <Link to="/login">未登录</Link>
                                </div>
                            </Tooltip>
                        )
                    }
                </div>
                <Modal
                    title={'修改密码'}
                    visible={this.state.modalShow}
                    onOk={this.onOk}
                    onCancel={this.onClose}
                    confirmLoading={this.state.modalLoading}
                >
                    <Form>
                        <FormItem
                            label="原密码"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('formOldPassword', {
                                initialValue: undefined,
                                rules: [
                                    {required: true, whitespace: true, message: '请输入原密码'},
                                    {min: 6, message: '最少输入6位字符'},
                                    {max: 18, message: '最多输入18位字符'}
                                ],
                            })(
                                <Input.Password placeholder="请输入原密码"/>
                            )}
                        </FormItem>
                        <FormItem
                            label="新密码"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('formPassword', {
                                initialValue: undefined,
                                validateFirst: true,
                                rules: [
                                    {required: true, whitespace: true, message: '请输入新密码'},
                                    {min: 6, message: '最少输入6位字符'},
                                    {max: 18, message: '最多输入18位字符'},
                                    {validator: this.pwdBlur}
                                ],
                            })(
                                <Input.Password placeholder="请输入新密码"/>
                            )}
                        </FormItem>
                        <FormItem
                            label="确认密码"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('formConfirmPassword', {
                                initialValue: undefined,
                                validateFirst: true,
                                rules: [
                                    {required: true, whitespace: true, message: '请再次输入新密码'},
                                    {min: 6, message: '最少输入6位字符'},
                                    {max: 18, message: '最多输入18位字符'},
                                    {validator: this.checkPassword}
                                ],
                            })(
                                <Input.Password placeholder="请再次输入新密码"/>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </Header>
        );
    }
}
