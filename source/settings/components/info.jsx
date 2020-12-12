// WordPress dependencies
const { Component } = wp.element;

export default class Info extends Component {
    render() {
        return (
            <div className="settings-info">
                { this.props.children }
            </div>
        );
    }
}
