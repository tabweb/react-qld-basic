/** 左侧导航 **/
import React from 'react';
import P from 'prop-types';
import { Layout, Icon, Menu } from 'antd';
import { Link } from 'react-router-dom';
import c from 'classnames';
import css from './index.scss';
import ImgLogo from '../../assets/logo.png';

const { Sider } = Layout;
const { SubMenu, Item } = Menu;
export default class Com extends React.PureComponent {
    static propTypes = {
        data: P.array,      // 所有的菜单数据
        collapsed: P.bool,  // 菜单咱开还是收起
        location: P.any,
    };

    constructor(props) {
        super(props);
        this.state = {
            chosedKey: [],  // 当前选中
            openKeys: [],   // 当前需要被展开的项
            sourceData: [], // 菜单数据（层级）
            treeDom: [],    // 生成的菜单结构
        };
    }

    componentDidMount() {
        this.makeSourceData(this.props.data);
        this.nowChosed(this.props.location);
    }

    UNSAFE_componentWillReceiveProps(nextP) {
        if (this.props.data !== nextP.data) {
            this.makeSourceData(nextP.data);
        }
        if (this.props.location !== nextP.location) {
            this.nowChosed(nextP.location);
        }
    }

    /** 处理当前选中 **/
    nowChosed(location) {
        const paths = location.pathname.split('/').filter((item) => !!item);
        if (paths.length > 2){
            //三级菜单做特殊处理
            this.setState({
                chosedKey: ['/'+paths[0]+'/'+paths[1]],  // 当前选中
                openKeys: ['/'+paths[0],'/'+paths[1]],   // 当前需要被展开的项
            });
        }else{
            this.setState({
                chosedKey: [location.pathname],
                openKeys: paths.map((item) => `/${item}`)
            });
        }
    }

    /** 菜单展开和关闭时触发 **/
    onOpenChange(keys) {
        this.setState({
            openKeys: keys,
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
        const treeDom = this.makeTreeDom(sourceData, '');
        this.setState({
            sourceData,
            treeDom
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

    /** 构建树结构 **/
    makeTreeDom(data, key) {
        return data.map((item, index) => {
            const newKey = `${key}/${item.url.replace(/\//,'')}`;
            if (item.children) {
                return (
                    <SubMenu key={newKey} title={item.icon ? <span><Icon type={item.icon} /><span>{item.name}</span></span> : item.name}>
                        { this.makeTreeDom(item.children, newKey) }
                    </SubMenu>
                );
            } else {
                return <Item key={newKey}><Link to={newKey}>{item.icon ? <Icon type={item.icon} /> : null}<span>{item.name}</span></Link></Item>;
            }

        });
    }

    render() {
        return (
            <Sider
                width={256}
                className={css.sider}
                trigger={null}
                collapsible
                theme="light"
                collapsed={this.props.collapsed}
            >
                <div className={this.props.collapsed ? c(css.menuLogo, css.hide) : css.menuLogo }>
                    <Link to='/'>
                        <img src={ImgLogo} />
                        <div></div>
                    </Link>
                </div>
                <Menu
                    /*theme="light"*/
                    mode="inline"
                    selectedKeys={this.state.chosedKey}
                    {... this.props.collapsed ? {} : { openKeys: this.state.openKeys}}
                    onOpenChange={(e) => this.onOpenChange(e)}
                >
                    {this.state.treeDom}
                </Menu>
            </Sider>
        );
    }
}