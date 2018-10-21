import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import {
    Form,
    Icon,
    Input,
    InputNumber,
    Button,
    Checkbox,
    Radio,
    Select,
    message,
    Row,
    Col,
    Upload,
    Cascader,
    Divider

} from 'antd'
import I18N from '@/I18N'
import {upload_file} from '@/util'
import './style.scss'

const FormItem = Form.Item

class C extends BaseComponent {

    constructor(props) {
        super(props)

        this.state = {
            avatar_loading: false,
            avatar_url: this.props.user.profile.avatar || '',
            avatar_type: this.props.user.profile.avatarFileType || '',
            avatar_filename: this.props.user.profile.avatarFilename || '',

            removeAttachment: true
        }
    }

    handleSubmit (e) {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.updateUser(values, this.state).then(() => {
                    this.props.getCurrentUser()
                });
                this.props.switchEditMode()
            }
        })
    }

    getInputProps () {

        const {getFieldDecorator} = this.props.form
        const user = this.props.user

        /*
        ****************************************************************************************
        * General
        ****************************************************************************************
         */
        const firstName_fn = getFieldDecorator('firstName', {
            rules: [{required: true, message: 'First name is required'}],
            initialValue: user.profile.firstName
        })
        const firstName_el = (
            <Input />
        )

        const lastName_fn = getFieldDecorator('lastName', {
            rules: [{required: true, message: 'Last name is required'}],
            initialValue: user.profile.lastName
        })
        const lastName_el = (
            <Input />
        )

        const bio_fn = getFieldDecorator('bio', {
            rules: [{required: true, message: 'Biography is required'}],
            initialValue: user.profile.bio
        })
        const bio_el = (
            <Input.TextArea rows={4}/>
        )

        const avatar_fn = getFieldDecorator('avatar', {
            rules: []
        });
        const p_avatar = {
            showUploadList: false,
            customRequest: (info) => {
                this.setState({
                    avatar_loading: true
                });
                upload_file(info.file).then((d) => {
                    const url = d.url;
                    this.setState({
                        avatar_loading: false,

                        avatar_url: url,
                        avatar_type: d.type,
                        avatar_filename: d.filename,

                        removeAttachment: false
                    });
                })
            }
        };
        const avatar_el = (
            <Upload name="logo" listType="picture" {...p_avatar}>
                <div className="link">{'Upload Avatar'}</div>
            </Upload>
        );

        return {
            firstName: firstName_fn(firstName_el),
            lastName: lastName_fn(lastName_el),
            avatar: avatar_fn(avatar_el),
            bio: bio_fn(bio_el),
        }
    }

    removeAttachment = async () => {
        this.setState({
            avatar_loading: false,
            avatar_url: null,
            avatar_type: '',
            avatar_filename: '',

            removeAttachment: true
        })
    }

    ord_render () {
        const {getFieldDecorator} = this.props.form
        const p = this.getInputProps()

        const formItemLayout = {
            colon: false,
            labelCol: {
                xs: {span: 24},
                sm: {span: 8}
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16}
            }
        }

        // const existingTask = this.props.existingTask

        // TODO: terms of service checkbox

        // TODO: react-motion animate slide left

        // TODO: description CKE Editor

        return (
            <div className="c_userProfileFormContainer">
                <Form onSubmit={this.handleSubmit.bind(this)} className="d_taskCreateForm">
                    <Row>
                        <Col sm={{span: 24}} md={{span: 6, offset: 12}}>
                            <FormItem
                                colon={false}
                                labelCol={{ sm: {span: 0}, md: {span: 0} }}
                                wrapperCol={{ sm: {span: 24}, md: {span: 24} }}>
                                {p.avatar}
                            </FormItem>
                        </Col>
                        <Col sm={{span: 24}} md={{span: 6}}>
                            <FormItem
                                colon={false}
                                labelCol={{ sm: {span: 0}, md: {span: 0} }}
                                wrapperCol={{ sm: {span: 24}, md: {span: 24} }}>
                                {p.avatar}
                            </FormItem>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col sm={{span: 24}} md={{span: 12}}>
                            <FormItem label="First Name" {...formItemLayout}>
                                {p.firstName}
                            </FormItem>

                        </Col>
                        <Col sm={{span: 24}} md={{span: 12}}>
                            <FormItem label="Last Name" {...formItemLayout}>
                                {p.lastName}
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem
                        colon={false}
                        labelCol={{ sm: {span: 24}, md: {span: 8} }}
                        wrapperCol={{ sm: {span: 24}, md: {span: 16} }}
                        label="Profile Slogan">
                        {p.bio}
                    </FormItem>
                    <br />
                    <br />
                    <FormItem wrapperCol={{xs: {span: 24, offset: 0}, sm: {span: 12, offset: 10}}}>
                        <Button className="cr-btn" type="primary" htmlType="submit" loading={this.props.loading}>
                            {I18N.get('profile.save')}
                        </Button>
                    </FormItem>
                </Form>
            </div>
        )
    }

}
export default Form.create()(C)
