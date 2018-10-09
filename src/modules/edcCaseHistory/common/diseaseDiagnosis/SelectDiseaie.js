'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var AntdMobile = require('./../../../../antdMobile/antdMobile.js');
var ApiFactory = require('./../../../../cmp/ApiFactory.js');
var Fetch = require('./../../../../fetch/fetch.js');
var SearchBar = AntdMobile.SearchBar;
var List = AntdMobile.List;
var Checkbox = AntdMobile.Checkbox;
var CheckboxItem = Checkbox.CheckboxItem;


module.exports = React.createClass({

	getInitialState: function(){
		return {
			illList: [],
			keyword: ''
		};
	},

	// 搜索
    onSearch: function(text) {
        var config = {
            url: ApiFactory.caseHistory.findDiseaseByName,
            data: {
                access_token: localStorage.getItem('access_token'),
                name: text
            }
        };
        Fetch(config).then(function (result) {
            if (result && result.length > 0) {
                this.setState({
                    illList: result
                })
            }
        }.bind(this));
    },

    // 疾病点击
    onSelect: function(item, e) {
        if(e && e.stopPropagation) {
            e.stopPropagation();
        }
        window.selectDiseaseCallback(item);
        ReactRouter.hashHistory.goBack();
    },

    componentDidMount: function() { 
        this.refs.SearchBar.refs.searchInput.focus();
    },

    componentWillUnmount: function() {
        // 移除输入法
        this.refs.SearchBar.onBlur();
    },

    goBack: function() {
        ReactRouter.hashHistory.goBack()
    },

	render: function() {
		return (
			<div style={{width: '100%', height: '100%'}}>
                <div style={style.searchBar_wrapper}>
                    <div style={style.searchBar} className="am-search-start">
        				<SearchBar
                            ref="SearchBar"
                            placeholder="搜索"
                            onCancel={this.goBack.bind(this)}
                            onSubmit={this.onSearch.bind(this)}/>
                    </div>

                    <div style={style.result}>搜索结果</div>
                </div>
                <div style={style.illList_wrapper} className="ill-list-wrapper">
                    {
                        !this.state.illList.length > 0 ? (
                            <div style={style.no_data}>
                                <img src={require('./../../../images/search.png')} style={{width: '120px'}}/>
                                <div style={{color: '#aaa'}}>无数据</div>
                            </div>
                        ) : (
                            <List className="select-disease-wapper">
                                {
                                    this.state.illList.map(function(item) {
                                        return (
                                            <CheckboxItem key={item.id} onChange={this.onSelect.bind(this, item)}>
                                                {item.name}
                                            </CheckboxItem>
                                        )
                                    }.bind(this))
                                }
                            </List>
                        )
                    }
                </div>
			</div>
		)
	}
});

var clientHeight = document.body.clientHeight;
var style = {
    searchBar_wrapper: {
        width: '100%'
    },
    searchBar: {
        width: '100%'
    },
    result: {
        fontSize: '12px',
        height: '20px',
        lineHeight: '20px',
        paddingLeft: '10px',
        borderBottom: '1px solid #d9d9d9',
        color: '#aaa',
        boxSizing: 'border-box',
        backgroundColor: '#f5f5f9'
    },
    illList_wrapper: {
        width: '100%',
        height: clientHeight - 64 + 'px',
        paddingTop: '0',
        marginTop: '0',
        overflow: 'auto',
        boxSizing: 'border-box'
    },
    no_data: {
        textAlign: 'center',
        position: 'relative',
        top: '50%',
        marginTop: '-78px'
    }
};
