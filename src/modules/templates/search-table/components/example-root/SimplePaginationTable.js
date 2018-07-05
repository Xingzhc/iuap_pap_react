import React, { Component } from 'react'
import PaginationTable from 'components/PaginationTable'
import {BpmButtonSubmit,BpmButtonRecall} from 'yyuap-bpm';
import { actions } from 'mirrorx';
import { Button,Message } from 'tinper-bee';
import moment from "moment/moment";
import Header from 'components/Header';
import ExampleForm from '../example-form';

export default class SimplePaginationTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            // 表格中所选中的数据，拿到后可以去进行增删改查
            selectData: [],
            step: 10
        }
    }
    componentWillMount(){
        this.setState({ step: this.props.pageSize })
        actions.searchTable.loadList();//table数据
    }
    tabelSelect = (data) => {//tabel选中数据
        this.setState({
            selectData: data
        })
    }
    /**
     * 编辑,详情，增加
     */

    onAdd = async (record, editFlag)=>{
        await actions.searchTable.updateState({rowData:{}});
        actions.routing.push(
            {
                pathname: 'example-edit',
                detailObj: record,
                editFlag: !!editFlag
            }
        )
    }

    cellClick = async (record, editFlag) => {
        await actions.searchTable.updateState({rowData:record});
        actions.routing.push(
            {
                pathname: 'example-edit',
                editFlag: !!editFlag
            }
        )
    }
    delItem = (record, index) => {
        actions.searchTable.delItem({
            param: [record],
            index: index
        });
    }
    onTableSelectedData = data => {
        
        this.setState({
            selectData: data
        })
    }
    onPageSizeSelect = (index, value) => {
        actions.searchTable.loadList({
            pageSize: value
        })
    }
    onPageIndexSelect = value => {
        actions.searchTable.loadList({
            pageIndex: value
        })
    }

    onSubmitSuc = async ()=>{
        await actions.searchTable.loadList();
        actions.searchTable.updateState({showLine:false});
        Message.create({content: '单据提交成功', color: 'success'});
        
    }
    // 提交操作初始执行操作
    onSubmitStart = ()=>{
        actions.searchTable.updateState({showLine:true});
        
    }
    // 提交失败回调函数
    onSubmitFail = (error)=>{
        actions.searchTable.updateState({showLine:false});
        Message.create({content: error.msg, color: 'danger'});
        
    }

    // 撤回成功，失败，开始回调函数
    onRecallSuc = async ()=>{
        console.log("onRecallSuc 成功进入recall回调");
        await actions.searchTable.loadList();
        actions.searchTable.updateState({showLine:false});
        Message.create({content: '单据撤回成功', color: 'success'});
        
    }
    onRecallFail = (error)=>{
        actions.searchTable.updateState({showLine:false});
        Message.create({content: error.msg, color: 'danger'});
        
    }
    onRecallStart = ()=>{
        actions.searchTable.updateState({showLine:true});
    }

    //查看方法
    onExamine = async (text, record, index)=> {
        console.log("record", record);
        await actions.searchTable.updateState({rowData:record});
        await actions.routing.push(
            {
                pathname: 'example-edit',
                detailObj: record,
            }
        )
    }

    // 清空selectData
    clearSelData = ()=>{
        this.setState({
            selectData:[]
        })
    }

    render(){
        const self=this;
        let { list, showLoading, pageIndex, pageSize, totalPages } = this.props;
        let {selectData} = this.state;
        console.log("selectData",selectData)
        console.log("${GROBAL_HTTP_CTX}",`${GROBAL_HTTP_CTX}`);
        const column = [
            {
                title: "序号",
                dataIndex: "index",
                key: "index",
                width: 100,
                render(record, text, index) {
                    return index + 1;
                }
            },
            {
                title: "订单编号",
                dataIndex: "orderCode",
                key: "orderCode",
                width: 250,
                className:"td-detail",
                onCellClick: (record) => this.cellClick(record, false)
            },
            {
                title: "供应商名称",
                dataIndex: "supplierName",
                key: "supplierName",
                width: 300
            },
            {
                title: "类型",
                dataIndex: "type_name",
                key: "type_name",
                width: 100
            },
            {
                title: "采购组织",
                dataIndex: "purchasing",
                key: "purchasing",
                width: 100
            },
            {
                title: "采购组",
                dataIndex: "purchasingGroup",
                key: "purchasingGroup",
                width: 100
            },
            {
                title: "凭证日期",
                dataIndex: "voucherDate",
                key: "voucherDate",
                width: 100,
                render(record, text, index) {
                    return moment(text).format('YYYY-MM-DD')
                }
            },
            {
                title: "审批状态",
                dataIndex: "approvalState_name",
                key: "approvalState_name",
                width: 100
            },
            {
                title: "确认状态",
                dataIndex: "confirmState_name",
                key: "confirmState_name",
                width: 100
            },
            {
                title: "关闭状态",
                dataIndex: "closeState_name",
                key: "closeState_name",
                width: 100
            },
            {
                title: "操作",
                dataIndex: "d",
                key: "d",
                width:100,
                fixed: "right",
                render(text, record, index) {
                    return (
                        <div className='operation-btn'>
                            <Button size='sm' className='edit-btn' onClick={() => { self.onExamine(text, record, index) }}>查看</Button>
                            <Button size='sm' className='edit-btn' onClick={() => { self.cellClick(record, true) }}>编辑</Button>
                            <Button size='sm' className='del-btn' onClick={() => { self.delItem(record, index) }}>删除</Button>
                        </div>
                    )
                }
            }
        ];
        return (
            <div className='example-root'>
                <Header title='简单分页表格示例'/>
                <ExampleForm { ...this.props }/>
                <div className='table-header'>
                    <Button size='sm' shape="border" onClick={() => { self.onAdd({}, true) }}>
                        新增
                    </Button>
                    <BpmButtonSubmit
                        className="ml5 "
                        checkedArray = {selectData}
                        funccode = "react"
                        nodekey = "003"
                        url = {`${GROBAL_HTTP_CTX}/sany_order/submit`}
                        onSuccess = {this.onSubmitSuc}
                        onError = {this.onSubmitFail}
                        onStart={this.onSubmitStart}
                    />
                    <BpmButtonRecall
                        className="ml5 "
                        checkedArray = {selectData}
                        url = {`${GROBAL_HTTP_CTX}/sany_order/recall`}
                        onSuccess = {this.onRecallSuc}
                        onError = {this.onRecallFail}
                        onStart = {this.onRecallStart}
                    />
                </div>
                <PaginationTable
                    data={list}
                    showLoading={showLoading}
                    pageIndex={pageIndex}
                    pageSize={this.state.step}
                    totalPages={totalPages}
                    columns={column}
                    getSelectedDataFunc={this.tabelSelect}
                    onTableSelectedData={this.onTableSelectedData}
                    onPageSizeSelect={this.onPageSizeSelect}
                    onPageIndexSelect={this.onPageIndexSelect}
                    scroll={{ x: 1550, y: 200}}
                />
            </div>

        )

    }
}