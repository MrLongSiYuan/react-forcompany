// 预约--医生端&患者端 下拉菜单

var React = require('react');
var AntdMobile = require('./../../../antdMobile/antdMobile.js');
var Flex = AntdMobile.Flex;

module.exports = React.createClass({

    getInitialState: function () {
        var items = this.initItem(this.props.items);
        return {
            items: items || [],
            isShowItem: false,
            selectedItem: ''
        };
    },

    componentDidMount: function () {
        this.changeTitle();
    },

    // 初始化列表项
    initItem: function (items) {
        var defaultIndex = this.props.defaultIndex || 0;
        if (items && items.length > 0) {
            items.map(function (item, index) {
                // 默认选第一项
                if (index == defaultIndex) {
                    item.selected = true;
                } else {
                    item.selected = false;
                }
            }.bind(this))
        }

        return items;
    },

    // 显示mask背景和列表项
    show: function () {
        this.setState({
            isShowItem: !this.state.isShowItem
        });
    },

    // 选择列表项
    select: function (item, index) {
        var items = this.state.items;
        for (var i = 0; i < items.length; i++) {
            items[i].selected = false;
        }

        if (items[index]) {
            items[index].selected = true;
        }
        this.setState({
            selectedItem: item,
            items: items,
            isShowItem: false
        });

        if (this.props.onRefresh) {
            this.props.onRefresh(item.key);
        }
    },

    // 根据选择项改变title
    changeTitle: function () {
        var items = this.state.items;
        if (items && items.length) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].selected) {
                    this.setState({
                        selectedItem: items[i]
                    });
                    break;
                }
            }
        }
    },

    // 根据是否选中来显示相应颜色图标
    renderIcon: function (item) {
        var icon = item.icon.replace('gray', 'blue');
        return item.selected ? icon : item.icon;
    },

    // 隐藏mask背景和列表项
    hide: function () {
        this.setState({
            isShowItem: false
        });
    },

    render: function() {
        var isShowItem = this.state.isShowItem;
        var selectedItem = this.state.selectedItem;
        var items = this.state.items;
        var arrow = isShowItem ? 'icon_triangleUp@2x.png' : 'icon_triangleDown@2x.png';
        return (
            <div>
                {
                    isShowItem && <div style={styles.mask} onClick={this.hide.bind(this)} />
                }
                <div style={styles.wrap}>
                    <div style={styles.bar} onClick={this.show.bind(this)}>
                        {selectedItem && selectedItem.name}
                        <img style={{marginLeft: '4px', height: '12px', width: '12px'}} src={require('./../common/images/' + arrow)} />
                    </div>
                    {
                        isShowItem && items && items.length > 0 && items.map(function (item, index) {
                            return (
                                <Flex onClick={this.select.bind(this, item, index)}>
                                    <span style={styles.itemIcon} >
                                        <img style={{height: '18px', width: '18px'}} src={require('./../common/images/' + this.renderIcon(item))} />
                                    </span>
                                    <Flex.Item style={styles.content} >
                                        <span style={{color: item.selected ? '#52a7e8' : ''}}>{item.name}</span>
                                        {
                                            item.selected &&
                                            <span style={styles.selected} >
                                                <img style={{height: '14px', width: '14px'}} src={require('./../common/images/icon_tick_select@2x.png')} />
                                            </span>
                                        }
                                    </Flex.Item>
                                </Flex>
                            );
                        }.bind(this))
                    }
                </div>
            </div>
        );
    }
});

var styles = {
    mask: {
        position: 'fixed',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        height: '100%',
        zIndex: '999',
        backgroundColor: 'rgba(0,0,0,.5)',
    },
    wrap: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: '999',
        backgroundColor: '#fff',
    },
    bar: {
        textAlign: 'center',
        fontSize: '16px',
        color: '#52a7e8',
        background: '#fafcfa',
        height: '44px',
        lineHeight: '44px',
        borderBottom: '1px solid #eee',
    },
    itemIcon: {
        display: 'inline-block',
        height: '45px',
        width: '45px',
        lineHeight: '53px',
        textAlign: 'center',
    },
    content: {
        margin: 0,
        position: 'relative',
        height: '45px',
        lineHeight: '45px',
        borderBottom: '1px solid #eee',
    },
    selected: {
        position: 'absolute',
        right: '15px',
        height: '45px',
        width: '45px',
        lineHeight: '45px',
        textAlign: 'center',
    }
};
