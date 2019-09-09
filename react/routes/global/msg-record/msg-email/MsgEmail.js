/**
 * Created by hulingfangzi on 2018/8/24.
 */
// eslint-disable-next-line max-classes-per-file
import React, { Component, useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Table as OldTable, Tooltip, IconSelect, Menu, Dropdown } from 'choerodon-ui';
import { Table } from 'choerodon-ui/pro';
import classnames from 'classnames';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { axios, Content, Header, TabPage, Permission, Breadcrumb } from '@choerodon/master';
import './MsgEmail.less';
import MouseOverWrapper from '../../../../components/mouseOverWrapper';
import StatusTag from '../../../../components/statusTag';
import { handleFiltersParams } from '../../../../common/util';
import { useStore } from '../stores';
// 公用方法类
// class MsgRecordType {
//   constructor(context) {
//     context = context;
//     const { AppState } = context.props;
//     data = AppState.currentMenuType;
//     const { type, id, name } = data;
//     const codePrefix = type === 'organization' ? 'organization' : 'global';
//     code = `${codePrefix}.msgrecord`;
//     values = { name: name || 'Choerodon' };
//     type = type;
//     orgId = id;
//   }
// }

// @withRouter
// @injectIntl
// @inject('AppState')
// @observer
const { Column } = Table;
function APITest(props) {
  const context = useStore();
  const { AppState, intl, permissions, MsgRecordStore } = context;
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [sort, setSort] = useState({
    columnKey: 'id',
    order: 'descend',
  });
  const [filters, setFilters] = useState({});
  const [params, setParams] = useState([]);

  function loadMsgRecord(paginationIn, sortIn, filtersIn, paramsIn) {
    const newPagination = paginationIn || pagination;
    const newSort = sortIn || sort;
    const newFilters = filtersIn || filters;
    const newParams = paramsIn || params;
    // 防止标签闪烁
    setFilters(newFilters);
    setLoading(true);
    // 若params或filters含特殊字符表格数据置空
    const isIncludeSpecialCode = handleFiltersParams(newParams, newFilters);
    if (isIncludeSpecialCode) {
      MsgRecordStore.setData([]);
      // setState({
      //   pagination: {
      //     total: 0,
      //   },
      //   loading: false,
      //   sort,
      //   params,
      // });
      setPagination(
        {
          ...newPagination,
          total: 0,
        },
      );
      setLoading(false);
      setSort(newSort);
      setParams(newParams);
      return;
    }
    const { type, id: orgId } = AppState.currentMenuType;
    MsgRecordStore.loadData(newPagination, newFilters, newSort, newParams, type, orgId).then((data) => {
      MsgRecordStore.setData(data.list || []);
      // setState({
      //   pagination: {
      //     current: data.pageNum,
      //     pageSize: data.pageSize,
      //     total: data.total,
      //   },
      //   loading: false,
      //   sort,
      //   filters,
      //   params,
      // });
      setPagination({
        current: data.pageNum,
        pageSize: data.pageSize,
        total: data.total,
      });
      setLoading(false);
      setSort(newSort);
      setFilters(newFilters);
      setParams(newParams);
    }).catch((error) => {
      Choerodon.handleResponseError(error);
      setLoading(false);
    });
  }

  function getPermission() {
    const { type } = AppState.currentMenuType;
    let retryService = ['notify-service.send-setting-site.update'];
    if (type === 'organization') {
      retryService = ['notify-service.send-setting-org.update'];
    }
    return retryService;
  }

  const handlePageChange = (newPagination, newFilters, newSorter, newParams) => {
    loadMsgRecord(newPagination, newSorter, newFilters, newParams);
  };

  // 重发
  function retry(record) {
    const { type, id: orgId } = AppState.currentMenuType;
    MsgRecordStore.retry(record.get('id'), type, orgId).then((data) => {
      let msg = intl.formatMessage({ id: 'msgrecord.send.success' });
      if (data.failed) {
        msg = data.message;
      }
      Choerodon.prompt(msg);
      loadMsgRecord();
    }).catch(() => {
      Choerodon.prompt(intl.formatMessage({ id: 'msgrecord.send.failed' }));
    });
  }

  useEffect(() => {
    loadMsgRecord();
  }, []);

  const renderDropDown = ({ text, action, disabled }) => {
    const menu = (
      <Menu>

        <Menu.Item onClick={action}>
          {text}
        </Menu.Item>
      </Menu>
    );
    return (
      disabled ? (
        <Dropdown overlay={menu} trigger={['click']}>
          <Button size="small" shape="circle" style={{ color: '#000' }} icon="more_vert" />
        </Dropdown>
      ) : null
    );
  };
  const StatusCard = ({ value }) => (
    <div
      className={classnames('c7n-msgrecord-status',
        value === 'FAILED' ? 'c7n-msgrecord-status-failed'
          : 'c7n-msgrecord-status-completed')}
    >
      <FormattedMessage id={value.toLowerCase()} />
      {/* 失败 */}
    </div>
  );
  function renderStatus({ value }) {
    // console.log(value);
    return StatusCard(value);
  }
  const renderEmail = ({ value, record }) => {
    const action = {
      text: <FormattedMessage id="msgrecord.resend" />,
      action: retry.bind(this, record),
      disabled: record.get('status') === 'FAILED' && record.get('isManualRetry'),
    };
    return (
      <React.Fragment>
        <span>{value}</span>
        <div>{renderDropDown(action)}</div>
      </React.Fragment>
    );
  };

  function render() {
    const { msgRecordDataSet } = context;
    const retryService = getPermission();
    // const { sort: { columnKey, order }, filters, params, pagination, loading } = state;
    const columns = [

      {
        title: <FormattedMessage id="msgrecord.email" />,
        dataIndex: 'email',
        key: 'email',
        width: '20%',
        filters: [],
        filteredValue: filters.email || [],
        render: text => (
          <MouseOverWrapper text={text} width={0.2}>
            {text}
          </MouseOverWrapper>
        ),
      },
      {
        title: '',
        width: '50px',
        key: 'action',
        align: 'right',
        // render: (_text, record) => (
        //   record.status === 'FAILED' && record.isManualRetry ? (
        //     <Tooltip
        //       title={<FormattedMessage id="msgrecord.resend" />}
        //       placement="bottom"
        //     >
        //       <Button
        //         size="small"
        //         icon="redo"
        //         shape="circle"
        //         onClick={retry.bind(this, record)}
        //       />
        //     </Tooltip>
        //   ) : ''
        // ),
        render: (text, record) => {
          const action = {
            text: <FormattedMessage id="msgrecord.resend" />,
            action: retry.bind(this, record),
            disabled: record.status === 'FAILED' && record.isManualRetry,
          };
          return renderDropDown(action);
        },
      },
      {
        title: <FormattedMessage id="msgrecord.status" />,
        dataIndex: 'status',
        key: 'status',
        render: status => (<StatusTag name={intl.formatMessage({ id: status.toLowerCase() })} colorCode={status} />),
        filters: [{
          value: 'COMPLETED',
          text: '完成',
        }, {
          value: 'FAILED',
          text: '失败',
        }],
        filteredValue: filters.status || [],
      },
      {
        title: <FormattedMessage id="msgrecord.templateType" />,
        dataIndex: 'templateType',
        key: 'templateType',
        width: '15%',
        filters: [],
        filteredValue: filters.templateType || [],
        render: text => (
          <MouseOverWrapper text={text} width={0.1}>
            {text}
          </MouseOverWrapper>
        ),
      },
      {
        title: <FormattedMessage id="msgrecord.failedReason" />,
        dataIndex: 'failedReason',
        key: 'failedReason',
        width: '20%',
        filters: [],
        filteredValue: filters.failedReason || [],
        render: text => (
          <MouseOverWrapper text={text} width={0.2}>
            {text}
          </MouseOverWrapper>
        ),
      },
      {
        title: <FormattedMessage id="msgrecord.send.count" />,
        dataIndex: 'retryCount',
        key: 'retryCount',
      },
      {
        title: <FormattedMessage id="msgrecord.creationDate" />,
        dataIndex: 'creationDate',
        key: 'creationDate',
      },
    ];

    return (
      <TabPage
        className="c7n-msgrecord"
        service={permissions}
      >
        <Breadcrumb title="" />
        <Content
          values={{ name: AppState.getSiteInfo.systemName || 'Choerodon' }}
        >
          {/* <Table
            columns={columns}
            dataSource={MsgRecordStore.getData}
            pagination={pagination}
            onChange={handlePageChange}
            filters={params}
            loading={loading}
            rowKey="id"
            filterBarPlaceholder={intl.formatMessage({ id: 'filtertable' })}
            
          /> */}
          <Table dataSet={msgRecordDataSet}>
            <Column name="email" renderer={renderEmail} />
            <Column align="center" width={130} name="status" renderer={StatusCard} />
            <Column name="templateType" />
            <Column name="failedReason" />
            <Column name="retryCount" />
            <Column name="creationDate" />
          </Table>
        </Content>
      </TabPage>
    );
  }
  return render();
}
export default observer(APITest);
