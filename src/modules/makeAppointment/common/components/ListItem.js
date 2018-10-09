// 预约--医生端&患者端 列表单项

var React = require('react');
var ReactRouter = require('react-router');
var AntdMobile = require('./../../../../antdMobile/antdMobile.js');
var Flex = AntdMobile.Flex;
var ListView = AntdMobile.ListView;
var RefreshControl = AntdMobile.RefreshControl;
var Moment = require('moment');

var Util = require('./../Util.js');


module.exports = React.createClass({

    getInitialState: function () {
        var dataSource = new ListView.DataSource({
            rowHasChanged: function (row1, row2) {
                return row1 !== row2;
            },
        });

        var initData = this.props.list || [];

        return {
            dataSource: dataSource.cloneWithRows(initData),
            refreshing: false,
        };
    },

    // 接受新数据，更新list
    componentWillReceiveProps: function(nextProps) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(nextProps.list),
            refreshing: false,
        });
    },

    // 跳转到详情
    goToDetail: function (item) {
        ReactRouter.hashHistory.pushState({item: item}, '/make_appointment/' + this.props.type);
    },

    getTime: function (item) {
        if (this.props.type == 'doctor') {
            // 预约单状态(2-待确认 3-已确认 5-完成 6-取消)
            switch (item.status) {
                case 2:
                    return this.calculatePeriodsOfTime(item.startTime, item.endTime);
                    break;
                case 3:
                case 4:
                case 5:
                case 6:
                    return this.calculateDayOfWeek(item.checkStartTime);
                    break;
            }
        } else {
            return Moment(item.startTime).format('YYYY-MM-DD');
        }
    },

    // 下拉刷新，执行回调
    onRefresh: function () {
        this.setState({ refreshing: true });
        if (this.props.onRefreshList) {
            this.props.onRefreshList();
        }
    },

    // 返回时间段
    calculatePeriodsOfTime: function(startTime, endTime) {
        startTime = Moment(startTime);
        endTime = Moment(endTime);
        return startTime.format('YYYY-MM-DD') + '至' + endTime.format('YYYY-MM-DD');
    },

    // 处理所选择的日期
    calculateDayOfWeek: function(moment) {
        moment = Moment(moment);
        return moment.format('YYYY-MM-DD') + ' (' + Util.calculateWeekName(moment.day()) + ') ' + moment.format('HH:mm');
    },

    render: function () {
        var props = this.props,
            length = props.list.length;

        // 列表项数据
        var row = function (rowData, sectionID, rowID) {
            return (
                <div key={rowID} onClick={this.goToDetail.bind(this, rowData)} style={{position: 'relative', background: '#fff', padding: '15px', marginBottom: rowID == (length - 1) ? '55px' : '10px'}} >
                    <Flex style={styles.flex} justify="start" align="center">
                        <div style={styles.minWidth}>
                            服务地点：
                        </div>
                        <Flex.Item className="appointment-info-item">
                            {rowData.hospitalName}
                        </Flex.Item>
                    </Flex>

                    <Flex style={styles.flex} justify="start" align="center">
                        <div style={styles.minWidth}>
                            预约时间：
                        </div>
                        <Flex.Item className="appointment-info-item">
                            {this.getTime(rowData)}
                        </Flex.Item>
                    </Flex>

                    <Flex style={styles.flex} justify="start" align="center">
                        <div style={styles.minWidth}>
                            <span style={{letterSpacing: '32px'}}>姓</span>名：
                        </div>
                        <Flex.Item className="appointment-info-item" >
                            {rowData.patientName}
                        </Flex.Item>
                    </Flex>

                    <Flex justify="start" align="center">
                        <div style={styles.minWidth}>
                            预约内容：
                        </div>
                        <Flex.Item className="appointment-info-item">
                            {rowData.checkContent}
                        </Flex.Item>
                    </Flex>

                    {
                        props.type == 'doctor' &&
                        <img style={{
                            position: 'absolute',
                            right: '15px',
                            top: 0,
                            height: '40px',
                            width: '75px',
                        }} src={Util.showStatus(rowData)} />
                    }
                </div>
            );
        }.bind(this);

        return (
            <ListView
                dataSource={this.state.dataSource}
                renderRow={row}
                initialListSize={length}
                pageSize={length}
                scrollRenderAheadDistance={500}
                scrollEventThrottle={20}
                style={{
                    height: document.documentElement.clientHeight,
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                    />
                }
            />
        );
    }
});

var styles = {
    flex: {
        marginBottom: '5px',
    },
    minWidth: {
        minWidth: '80px',
        color: '#6c6c6c',
    },
    img:{
        maxWidth:'230px',
        maxHight:'120px',
    },
};