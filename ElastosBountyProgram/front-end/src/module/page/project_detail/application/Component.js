import React from 'react';
import BaseComponent from '@/model/BaseComponent'
import moment from 'moment'
import {
    message,
    Col,
    Row,
    Tag,
    Icon,
    Carousel,
    Avatar,
    Button,
    Spin,
    Select,
    Table,
    Input,
    Form,
    Divider,
    Modal,
    Upload,
    Badge
} from 'antd'
import {upload_file} from '@/util';
import { TASK_CANDIDATE_STATUS, TASK_CANDIDATE_TYPE, TEAM_USER_STATUS } from '@/constant'
import Comments from '@/module/common/comments/Container'
import I18N from '@/I18N'
import _ from 'lodash'
import './style.scss'

class C extends BaseComponent {
    ord_states() {
        return {
        }
    }

    async componentDidMount() {
        const taskId = this.props.taskId
        await this.props.getTaskDetail(taskId)
        if (this.props.currentUserId) {
            await this.props.getTeams({
                owner: this.props.currentUserId
            })
        }
    }

    componentWillUnmount() {
    }

    isTaskOwner() {
        return this.props.detail.createdBy && this.props.detail.createdBy._id === this.props.currentUserId
    }

    isUserSubscribed() {
        const curDetail = this.props.detail
        const subscribers = curDetail.subscribers || []
        return !!_.find(subscribers, (subscriber) => {
            return subscriber.user && subscriber.user._id === this.props.currentUserId
        })
    }

    linkProfileInfo(userId) {
        this.props.history.push(`/member/${userId}`)
    }

    checkForLoading(followup) {
        return this.props.loading
            ? <div className="valign-wrapper halign-wrapper"><Spin size="large"/></div>
            : _.isFunction(followup) && followup()
    }

    isMemberByUserId(userId) {
        const candidate = _.find(this.props.detail.candidates, (candidate) => {
            if (candidate.type === TASK_CANDIDATE_TYPE.USER) {
                return candidate.user._id === userId
            }
            return false
        })
        if (!candidate) {
            return false
        }
        return this.isMember(candidate._id)
    }

    isMember(taskCandidateId) {
        const candidate = _.find(this.props.detail.candidates, { _id: taskCandidateId })
        if (!candidate) {
            return false
        }
        if (candidate.type === TASK_CANDIDATE_TYPE.USER) {
            return candidate.user._id === this.props.currentUserId
        } else if (candidate.type === TASK_CANDIDATE_TYPE.TEAM) {
            return _.find(this.props.ownedTeams, (item) => item._id === candidate.team._id)
        }
    }

    getCandidateDisplayName(candidate) {
        const fn = candidate.user.profile.firstName
        const ln = candidate.user.profile.lastName
        const un = candidate.user.username

        return _.isEmpty(fn) && _.isEmpty(ln)
            ? un
            : [fn, ln].join(' ')
    }

    approveUser(taskCandidateId) {
        this.props.acceptCandidate(taskCandidateId)
    }

    disapproveUser(taskCandidateId) {
        this.props.rejectCandidate(taskCandidateId)
    }

    withdrawApplication(taskCandidateId) {
        this.props.withdrawCandidate(taskCandidateId)
    }

    removeUser(taskCandidateId) {
        this.props.rejectCandidate(taskCandidateId)
    }

    removeUserByUserId(userId) {
        const candidate = _.find(this.props.detail.candidates, (candidate) => candidate.user._id === userId)
        if (!candidate) {
            return false
        }
        return this.removeUser(candidate._id)
    }

    getApplicant () {
        return (!_.isEmpty(this.props.detail.candidates) &&
            this.props.detail.candidates.find((candidate) => {
                return candidate._id === this.props.taskCandidateId
            }))
    }

    ord_render () {
        const applicant = this.getApplicant()

        return (
            <div className="c_Project c_Detail">
                <div>
                    {this.getHeader()}
                    {this.getDescription()}
                    <Comments type="taskCandidate" reduxType="task" canPost={true} model={applicant}
                        detailReducer={(detail) => _.find(detail.candidates, (candidate) => {
                            return candidate._id === this.props.taskCandidateId
                        })}/>
                </div>
            </div>
        )
    }

    handleApplyWithChange(teamId) {
        const solo = teamId === '$me'

        this.props.updateApplication(this.props.taskId, {
            taskCandidateId: this.props.taskCandidateId,
            user: solo ? this.props.currentUserId : null,
            team: !solo ? teamId : null
        })
    }

    getAvatarWithFallback(avatar) {
        return _.isEmpty(avatar)
            ? '/assets/images/Elastos_Logo.png'
            : avatar
    }

    getApplyWithDropdown() {
        const applicant = this.getApplicant()

        const defaultValue = applicant && applicant.user
            ? '$me'
            : applicant && applicant.team && applicant.team._id

        return (
            <div className="full-width halign-wrapper valign-wrapper">
                <Select className="team-selector" disabled={this.props.loading} defaultValue={defaultValue}
                    onChange={(value) => this.handleApplyWithChange(value)}>
                    <Select.Option value="$me">
                        Apply as myself
                        <Avatar size="small" src={this.getAvatarWithFallback(this.props.currentUserAvatar)}
                            className="pull-right"/>
                    </Select.Option>
                    {_.map(this.props.ownedTeams, (team) =>
                        <Select.Option key={team._id} value={team._id}>
                            Apply with {team.name}
                            {!_.isEmpty(team.pictures)
                                ? <Avatar size="small" src={this.getAvatarWithFallback(team.pictures[0].thumbUrl)}
                                    className="pull-right"/>
                                : <Avatar size="small" src={this.getAvatarWithFallback()} className="pull-right"/>
                            }
                        </Select.Option>
                    )}
                </Select>
            </div>
        )
    }

    getHeader() {
        return (
            <div>
                <div>
                    {this.getApplyWithDropdown()}
                </div>
                <Upload.Dragger name="file" multiple={false}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">If you have a whitepaper ready, drag it or click here.</p>
                    <p className="ant-upload-hint">Use the Comments below to speak to the Project Owner and find out more.</p>
                </Upload.Dragger>
            </div>
        )
    }

    getDescription() {
        return (
            <div>
            </div>
        )
    }
}

export default Form.create()(C)