import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { actions } from "mirrorx";
import { Loading, Button, Col, Row, Icon, InputGroup, FormControl, Checkbox, Modal, Panel, PanelGroup, Label, Message, Select,Radio } from "tinper-bee";
import Form from 'bee-form';
import { BpmButtonSubmit, BpmButtonRecall } from 'yyuap-bpm';
import Pagination from 'bee-pagination';
import 'bee-pagination/build/Pagination.css';
import Table from 'bee-table';
import multiSelect from "bee-table/build/lib/newMultiSelect";
import Header from "components/Header";
import SearchPanel from 'components/SearchPanel';
import './list.less';
const MultiSelectTable = multiSelect(Table, Checkbox);
const FormItem = Form.FormItem;


class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectData: [],
        }
    }
    componentDidMount() {
        actions.role.loadList();
    }
    search = (pageObj,error,values) => {//查询
        values.pageIndex=pageObj.pageIndex||this.props.pageIndex||1,
        values.pageSize=pageObj.pageSize||this.props.pageSize||10,
        actions.role.loadList(values);
    }
    tabelSelect = (data) => {//tabel选中数据
        this.setState({
            selectData: data
        })
    }
    getList=(pageObj)=>{
        //获得表单数据
        this.props.form.validateFields((err, values) => {
            this.search(pageObj, err, values);
        });
    }

    onPageSelect = (value) => {
        this.getList({
            pageIndex: value ,
            pageSize:this.props.pageSize
        })
    }
    dataNumSelect = (value) => {
        let pageSize = (value + 1) * 5;//针对于5条/10条/15条/20条选项
        this.getList({
            pageSize: pageSize,
            pageIndex: 1
        })
    }
    edit=(editFlag,record)=>{
        actions.routing.push({
            pathname:'roleedit',
            editObj:record||{},
            editFlag:editFlag
        })
    }
    delItem=(record,index)=>{
        actions.role.delItem({
            param:[{id:record.id}],
            index:index
        });
    }
    toGroupM=(record)=>{
        console.log('角色组管理。。。');
    }
    toGroupP=(record)=>{
        console.log('角色权限管理。。。');
    }
    render() {
        const self = this;
        const column = [
            {
                title: "角色组管理",
                dataIndex: "groupM",
                key: "groupM",
                render(text,record,index){
                    return (
                        <a onClick={()=>{self.toGroupM(record)}}>角色组管理</a>
                    )
                }
            },
            {
                title: "角色权限管理",
                dataIndex: "groupP",
                key: "groupP",
                render(text,record,index){
                    return (
                        <a onClick={()=>{self.toGroupP(record)}}>角色权限管理</a>
                    )
                }
            },
            {
                title: "角色编码",
                dataIndex: "roleCode",
                key: "roleCode",
            },
            {
                title: "角色名称",
                dataIndex: "roleName",
                key: "roleName",
            },
            {
                title: "角色描述",
                dataIndex: "roleDescribe",
                key: "roleDescribe",
            },
            {
                title: "操作",
                dataIndex: "e",
                key: "e",
                render(text,record,index){
                    return (
                        <div className='operation-btn'>
                            <Button size='sm' className='edit-btn' onClick={()=>{self.edit(true,record)}}>编辑</Button>
                            <Button size='sm' className='del-btn' onClick={()=>{self.delItem(record,index)}}>删除</Button>
                            <Button size='sm' className='detail-btn' onClick={()=>{self.edit(false,record)}}>查看</Button>
                        </div>
                    )
                }
            },

        ];
        let { form, list, pageSize, pageIndex, totalPages,orderTypes,showLoading } = this.props;
        const { getFieldProps, getFieldError } = form;
        return (
            <div className='role-list'>
                <Header title='角色管理' back={true} />
                <SearchPanel form={form} search={(error,values)=>{this.search({},error,values)}}>
                    <Row>
                        <Col md={4} xs={6}>
                            <FormItem>
                                <Label>角色编码：</Label>
                                <FormControl
                                    {
                                    ...getFieldProps('roleCode', {
                                        initialValue: '',
                                    })
                                    }
                                />
                            </FormItem>
                        </Col>
                        <Col md={4} xs={6}>
                            <FormItem>
                                <Label>角色名称：</Label>
                                <FormControl
                                    {
                                    ...getFieldProps('roleName', {
                                        initialValue: '',
                                    })
                                    }
                                />
                            </FormItem>
                        </Col>
                        <Col md={4} xs={6}>
                            <FormItem>
                                <Label>角色描述：</Label>
                                <FormControl
                                    {
                                    ...getFieldProps('roleDescribe', {
                                        initialValue: '',
                                    })
                                    }
                                />
                            </FormItem>
                        </Col>
                    </Row>
                </SearchPanel>
                <div className='table-list'>
                    <div className='table-header'>
                        <Button size='sm' shape="border" onClick={()=>{this.edit(true,{})}}>
                           新增
                        </Button>
                        <BpmButtonSubmit
                            className="ml5 "
                            checkedArray={this.state.selectData}
                            funccode="react"
                            nodekey="003"
                            url={`${GROBAL_HTTP_CTX}/sany_order/submit`}
                            urlAssignSubmit={`${GROBAL_HTTP_CTX}/sany_order/assignSubmit`}
                            onSuccess={this.onSubmitSuc}
                            onError={this.onSubmitFail}
                            onStart={this.onSubmitStart}
                            onEnd={this.onSubmitEnd}
                        />
                        <BpmButtonRecall
                            className="ml5 "
                            checkedArray={this.state.selectData}
                            url={`${GROBAL_HTTP_CTX}/sany_order/recall`}
                            onSuccess={this.onRecallSuc}
                            onError={this.onRecallFail}
                            onStart={this.onRecallStart}
                            onEnd={this.onSubmitEnd}
                        />
                    </div>
                    <MultiSelectTable
                        loading={{show:showLoading,loadingType:"line"}}
                        rowKey={(r,i)=>i}
                        columns={column}
                        data={list}
                        multiSelect={{ type: "checkbox" }}
                        getSelectedDataFunc={this.tabelSelect}
                    />
                    <div className='pagination'>
                        <Pagination
                            first
                            last
                            prev
                            next
                            boundaryLinks
                            items={totalPages}
                            activePage={pageIndex}
                            onDataNumSelect={this.dataNumSelect}
                            onSelect={this.onPageSelect}
                            showJump={true}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default Form.createForm()(List);
