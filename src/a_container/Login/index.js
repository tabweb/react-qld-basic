/** 登录页 **/

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import P from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import tools from '../../util/tools';
import c from 'classnames';
import css from './index.scss';
// ==================
// 所需的所有组件
// ==================
import Vcode from 'react-vcode';
import {Form, Input, Button, Icon, Checkbox, message} from 'antd';
import CanvasBack from '../../a_component/CanvasBack';
import LogoImg from '../../assets/logo.png';

// ==================
// 本页面所需action
// ==================

import {onLogin, setUserInfo} from '../../a_action/app-action';
// ==================
// Definition
// ==================
const FormItem = Form.Item;
@connect(
    (state) => ({}),
    (dispatch) => ({
        actions: bindActionCreators({onLogin, setUserInfo}, dispatch),
    })
)
@Form.create()
export default class LoginContainer extends React.Component {

    static propTypes = {
        location: P.any,
        history: P.any,
        form: P.any,
        actions: P.any,
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: false, // 是否处于正在登录状态
            rememberPassword: false, // 是否记住密码
            codeValue: '00000', // 当前验证码的值
            show: false,  // 加载完毕时触发动画
        };
    }

    UNSAFE_componentWillMount() {

    }

    componentDidMount() {
        // 进入登陆页时，判断之前是否保存了用户名和密码
        const form = this.props.form;
        let userLoginInfo = localStorage.getItem('userLoginInfo');
        if (userLoginInfo) {
            userLoginInfo = JSON.parse(userLoginInfo);
            this.setState({
                rememberPassword: true,
            });
            form.setFieldsValue({
                userName: userLoginInfo.userName,
                password: tools.uncompile(userLoginInfo.password),
            });
        }
        if (!userLoginInfo) {
            document.getElementById('userName').focus();
        } else {
            document.getElementById('vcode').focus();
        }
        this.setState({
            show: true,
        });
    }


    // 用户提交登录
    onSubmit() {
        const form = this.props.form;
        form.validateFields((error, values) => {
            if (error) {
                return;
            }
            let params={
                userName:values.userName,
                password:values.password
            };
            this.setState({loading: true});
            this.props.actions.onLogin(params).then((res) => {
                if (res.status === 200) {
                    message.success('登录成功');
                    if (this.state.rememberPassword) {
                        localStorage.setItem('userLoginInfo', JSON.stringify({
                            username: values.username,
                            password: tools.compile(values.password)
                        })); // 保存用户名和密码
                    } else {
                        localStorage.removeItem('userLoginInfo');
                    }
                    /** 将这些信息加密后存入localStorage,并存入store **/
                    localStorage.setItem('userinfo', tools.compile(JSON.stringify(res.data)));
                    this.props.actions.setUserInfo(res.data);
                    setTimeout(() => this.props.history.replace('/'));  // 跳转到主页,用setTimeout是为了等待上一句设置用户信息完成
                } else {
                    message.error(res.message);
                this.setState({loading: false});
                }
            }).catch((err) => {
                this.setState({loading: false});
            });
        });
    }

    // 记住密码按钮点击
    onRemember(e) {
        this.setState({
            rememberPassword: e.target.checked,
        });
    }

    // 验证码改变时触发
    onVcodeChange(code) {
        const form = this.props.form;
        form.setFieldsValue({
            vcode: code,  // 开发模式自动赋值验证码，正式环境，这里应该赋值''
        });
        this.setState({
            codeValue: code,
        });
    }

    render() {
        const me = this;
        const {getFieldDecorator} = this.props.form;
        return (
            <div className={css.page}>
                <div className={css.canvasBox}>
                    <CanvasBack row={12} col={8}/>
                </div>
                <div className={c(css.loginBox, {[css.show]: this.state.show}, 'all_trans5')}>
                    <Form>
                        <div className={css.title}>
                            <img src={LogoImg} alt="logo"/>
                            <span>猫屋</span>
                        </div>
                        <div>
                            <FormItem>
                                {getFieldDecorator('userName', {
                                    rules: [{max: 12, message: '最大长度为12位字符'}, {
                                        required: true,
                                        whitespace: true,
                                        message: '请输入账号'
                                    }],
                                })(
                                    <Input
                                        prefix={<Icon type="user" style={{fontSize: 13}}/>}
                                        size="large"
                                        id="userName"   // 为了获取焦点
                                        placeholder="请输入账号"
                                        onPressEnter={() => this.onSubmit()}
                                    />
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('password', {
                                    rules: [{required: true, message: '请输入密码'}, {max: 18, message: '最大长度18个字符'}],
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={{fontSize: 13}}/>}
                                        size="large"
                                        type="password"
                                        placeholder="请输入密码"
                                        onPressEnter={() => this.onSubmit()}
                                    />
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('vcode', {
                                    rules: [
                                        {
                                            validator: (rule, value, callback) => {
                                                const v = tools.trim(value);
                                                if (v) {
                                                    if (v.length > 4) {
                                                        callback('验证码为4位字符');
                                                    } else if (v.toLowerCase() !== me.state.codeValue.toLowerCase()) {
                                                        callback('验证码错误');
                                                    } else {
                                                        callback();
                                                    }
                                                } else {
                                                    callback('请输入验证码');
                                                }
                                            }
                                        }
                                    ],
                                })(
                                    <Input
                                        style={{width: '200px'}}
                                        size="large"
                                        id="vcode"   // 为了获取焦点
                                        placeholder="请输入验证码"
                                        onPressEnter={() => this.onSubmit()}
                                    />
                                )}
                                <Vcode
                                    height={40}
                                    width={150}
                                    onChange={(code) => this.onVcodeChange(code)}
                                    className={css.vcode}
                                    options={{
                                        lines: 16,
                                    }}
                                />
                            </FormItem>
                            <div style={{lineHeight: '40px'}}>
                                <Checkbox className={css.remember} checked={this.state.rememberPassword}
                                          onChange={(e) => this.onRemember(e)}>记住密码</Checkbox>
                                <Button
                                    className={css['submit-btn']}
                                    size="large"
                                    type="primary"
                                    loading={this.state.loading}
                                    onClick={() => this.onSubmit()}
                                >
                                    {this.state.loading ? '请稍后' : '登录'}
                                </Button>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}