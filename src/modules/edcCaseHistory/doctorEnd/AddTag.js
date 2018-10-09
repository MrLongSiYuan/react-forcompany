// 慢病病历--医生端 新增标签

var React = require('react');
var ReactRouter = require('react-router');

var Tags = require('./PatientTag.js');
var SaveButton = require('./../common/components/SaveButton.js');


module.exports = React.createClass({

    getInitialState: function() {
        var selectedTags = this.props.location.state && this.props.location.state.selectedTags || [];
        var allTags = this.props.location.state && this.props.location.state.allTags || [];
        allTags = this.initAllTags(selectedTags, allTags);
        return {
            allTags: allTags,
            selectedTags: selectedTags
        };
    },

    // 初始化allTags为对象数组
    initAllTags: function (selectedTags, allTags) {
        var tags = [];
        allTags.map(function (allItem, allIndex) {
            var temp = {
                name: allItem,
                selected: false,
                id: allIndex
            };
            tags.push(temp);
        });

        selectedTags.map(function (selectedItem) {
            allTags.map(function (allItem, allIndex) {
                if (selectedItem == allItem) {
                    tags[allIndex].selected = true;
                }
            });
        });

        return tags;
    },

    // 更新选中标签
    updateSelectTag: function () {
        var temp = [];
        this.state.allTags.map(function (value) {
            if (value.selected) {
                temp.push(value.name);
            }
        });
        this.setState({
            selectedTags: temp
        });
    },

    // 添加新标签
    addTag: function (value) {
        var tags = this.state.allTags;
        tags.push(value);
        this.setState({
            allTags: tags
        });
        this.updateSelectTag();
    },

    // 选中标签
    selectTag: function (selectItem) {
        this.state.allTags.map(function (value) {
            if (selectItem.id == value.id) {
                value.selected = !value.selected;
            }
        });
        this.setState({
            allTags: this.state.allTags
        });
        this.updateSelectTag();
    },

    // 保存标签
    saveTags: function () {
        var allTags = [];
        if (this.state.allTags.length > 0) {
            this.state.allTags.map(function (item) {
                allTags.push(item.name)
            });
        }

        window.setSelectedTagsFromChildren(this.state.selectedTags, allTags);
        ReactRouter.hashHistory.goBack();
    },

    render: function() {
        return (
            <div className="scroll-box">
                <div style={styles.container}>
                    <Tags tags={this.state.selectedTags} />
                    <InputableTag tagLength={this.state.allTags.length} addTag={this.addTag.bind(this)} />
                </div>
                <div style={styles.tags}>
                    <p style={{color: '#999'}} onClick={this.selectTag}>所有标签:</p>
                    <ClickableTag tags={this.state.allTags} onSelect={this.selectTag.bind(this)} />
                </div>

                <SaveButton onSave={this.saveTags.bind(this)} />
            </div>
        );
    }
});


// 可输入的标签组件
var InputableTag = React.createClass({

    // 处理输入内容
    handleInput: function (event) {
        if (event.target.value != '' && event.keyCode === 13) {       // 回车键keyCode为13
            if (event.target.value.trim() != '') {
                var name = (event.target.value).replace(/,/g, '，');
                var obj = {name: name, selected: true, id: this.props.tagLength + 1};
                this.props.addTag(obj);
            }

            event.target.value = '';
        }
    },

    render: function() {
        return (
            <div style={{borderRadius: '100px',padding: '5px 20px', margin: '6px 0 3px 0', display: 'inline-block', border: '1px solid #ccc',}}>
                <input style={{border: 0}} maxLength="4" autofocus onKeyDown={this.handleInput.bind(this)} type="text" placeholder="输入标签"/>
            </div>
        );
    }
});


// 可点击的标签组件
var ClickableTag = React.createClass({

    getInitialState: function() {
        return {
            tags: this.props.tags
        };
    },

    // 选中
    select: function (value) {
        this.props.onSelect(value);
    },

    render: function() {
        var _self = this;
        return (
            <div>
                {
                    this.state.tags && this.state.tags.length > 0 && this.state.tags.map(function (value) {
                        return <span style={value.selected ? styles.selected : styles.tag} onClick={_self.select.bind(_self, value)}>{value.name}</span>
                    })
               }
            </div>
        );
    }
});

var styles = {
    container: {
        background: '#fff',
        minHeight: '100px',
        width: '100%',
        padding: '8px 15px',
    },
    tags: {
        margin: '10px 20px'
    },
    tag: {
        color: '#555',
        borderRadius: '100px',
        border: '1px solid #ccc',
        padding: '3px 10px',
        margin: '3px 5px 3px 0',
        display: 'inline-block'
    },
    selected: {
        color: '#fff',
        background: '#9bb1db',
        borderRadius: '100px',
        padding: '3px 10px',
        margin: '3px 5px 3px 0',
        display: 'inline-block'
    },
};