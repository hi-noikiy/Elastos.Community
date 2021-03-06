import React from 'react';
import BaseAdmin from '../BaseAdmin';
import {createContainer} from '@/util';

import Navigator from '../shared/Navigator/Component'
import { Breadcrumb, Col, Icon, Row, Spin } from 'antd';
import TeamService from '@/service/TeamService';

import TeamDetail from '@/module/shared/team_detail/Component';

const Component = class extends BaseAdmin {
    state = {
        loading: true,
        data: {}
    }

    ord_renderContent() {
        return (
            <div className="p_admin_index ebp-wrap">
                <div className="ebp-header-divider" />
                <div className="d_box">
                    <div className="p_admin_breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item href="/">
                                <Icon type="home" />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>Admin</Breadcrumb.Item>
                            <Breadcrumb.Item>Teams</Breadcrumb.Item>
                            <Breadcrumb.Item>{this.state.data && this.state.data.name}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="p_admin_content">
                        <Row>
                            <Col span={4} className="admin-left-column wrap-box-navigator">
                                <Navigator selectedItem={'teams'}/>
                            </Col>
                            <Col span={20} className="admin-right-column h-center">
                                {this.renderDetail()}
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }

    renderDetail() {
        if (this.state.loading) {
            return (
                <Spin size="large" />
            );
        }

        return (
            <TeamDetail data={this.state.data} canEdit={true} />
        )
    }

    async componentDidMount() {
        await super.componentDidMount()

        const teamId = this.$getParam('teamId')
        const d = await this.props.detail(teamId)
        this.setState({
            data: d,
            loading: false
        });
    }
};

export default createContainer(Component, () => {
    return {};
}, () => {
    const teamService = new TeamService()

    return {
        async detail(teamId) {
            return teamService.get(teamId)
        }
    }
})
