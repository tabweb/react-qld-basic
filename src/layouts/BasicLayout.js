/** 基础页面结构 - 有头部，有底部，有侧边导航 **/

// ==================
// 必需的各种插件
// ==================
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import P from 'prop-types';
import {Route, Switch, Redirect} from 'react-router-dom';

import zh_CN from 'antd/lib/locale-provider/zh_CN';

// ==================
// 路由子页面
// ==================
import Bundle from '../a_component/bundle';
import lazeNotFound from 'bundle-loader?lazy&name=notfound!../a_container/ErrorPages/404';
import lazeHome from 'bundle-loader?lazy&name=home!../a_container/home';
import lazeMenuAdmin from 'bundle-loader?lazy&name=menuadmin!../a_container/System/MenuAdmin';
import lazeRoleAdmin from 'bundle-loader?lazy&name=roleadmin!../a_container/System/RoleAdmin';
import lazeUserAdmin from 'bundle-loader?lazy&name=useradmin!../a_container/System/UserAdmin';

const NotFound = (props) => (<Bundle load={lazeNotFound}>{(Com) => <Com {...props} />}</Bundle>);
const Home = (props) => (<Bundle load={lazeHome}>{(Com) => <Com {...props} />}</Bundle>);
const MenuAdmin = (props) => (<Bundle load={lazeMenuAdmin}>{(Com) => <Com {...props} />}</Bundle>);
const RoleAdmin = (props) => (<Bundle load={lazeRoleAdmin}>{(Com) => <Com {...props} />}</Bundle>);
const UserAdmin = (props) => (<Bundle load={lazeUserAdmin}>{(Com) => <Com {...props} />}</Bundle>);


//配置页面
import lazeSensitive from 'bundle-loader?lazy&name=sensitive!../a_container/config/sensitive';
const Sensitive = (props) => (<Bundle load={lazeSensitive}>{(Com) => <Com {...props} />}</Bundle>);
// ==================
// 所需的所有组件
// ==================
import {Layout, LocaleProvider, message} from 'antd';
import Header from '../a_component/Header';
import Menu from '../a_component/Menu';
import Footer from '../a_component/Footer';
import Bread from '../a_component/Bread';
import css from './BasicLayout.scss';

// ==================
// 本页面所需action
// ==================

import {onLogout, setUserInfo} from '../a_action/app-action';

// ==================
// Class
// ==================
const {Content} = Layout;
@connect(
    (state) => ({
        userInfo: state.app.userinfo,
        menus: state.app.menus,
    }),
    (dispatch) => ({
        actions: bindActionCreators({onLogout, setUserInfo}, dispatch),
    })
)
export default class AppContainer extends React.Component {
    static propTypes = {
        location: P.any,
        history: P.any,
        actions: P.any,
        userInfo: P.any,
        menus: P.array,
    };

    constructor(props) {
        super(props);
        this.state = {
            collapsed: false, // 侧边栏是否收起
        };
    }

    componentDidMount() {

    }

    /** 点击切换菜单状态 **/
    onToggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    /**
     * 退出登录
     * **/
    onLogout = () => {
        this.props.actions.onLogout().then(() => {
            message.success('退出成功');
            this.props.history.push('/login');
        });
    };

    /** 切换路由时触发 **/
    onEnter(Component, props) {
        /**
         * 检查当前用户是否有该路由页面的权限
         * 没有则跳转至401页
         * **/
        return <Component {...props} />;
    }

    render() {
        return (
            <Layout className={css.page}>
                <Menu
                    data={this.props.menus}
                    collapsed={this.state.collapsed}
                    location={this.props.location}
                />
                <Layout>
                    <Header
                        collapsed={this.state.collapsed}
                        userinfo={this.props.userInfo}
                        onToggle={this.onToggle}
                        onLogout={this.onLogout}
                        getNews={this.getNews}
                        clearNews={this.clearNews}
                        newsData={this.state.newsData}
                        newsTotal={this.state.newsTotal}
                        popLoading={this.state.popLoading}
                        clearLoading={this.state.clearLoading}
                    />
                    <Bread
                        menus={this.props.menus}
                        location={this.props.location}
                    />
                    <Content className={css.content}>
                        <LocaleProvider locale={zh_CN}>
                            <Switch>
                                <Redirect exact from="/" to="/home" replace/>
                                <Route exact path="/home" render={(props) => this.onEnter(Home, props)} replace/>
                                <Route exact path="/system/menu" render={(props) => this.onEnter(MenuAdmin, props)} replace/>
                                <Route exact path="/system/role" render={(props) => this.onEnter(RoleAdmin, props)} replace/>
                                <Route exact path="/system/user" render={(props) => this.onEnter(UserAdmin, props)} replace/>
                                <Route exact path="/config/sensitive" render={(props) => this.onEnter(Sensitive, props)} replace/>
                                <Route exact render={NotFound} replace/>
                            </Switch>
                        </LocaleProvider>
                    </Content>
                    <Footer/>
                </Layout>
            </Layout>
        );
    }
}