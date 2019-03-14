/* 主页 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import {connect} from 'react-redux';
import P from 'prop-types';

// ==================
// 所需的所有组件
// ==================

// ==================
// 本页面所需action
// ==================


@connect(
    (state) => ({}),
)
export default class HomePageContainer extends React.Component {

    static propTypes = {
        location: P.any,
        history: P.any,
        actions: P.any,
    };

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
    }

    render() {
        return (
            <div>
                首页
            </div>
        );
    }
}