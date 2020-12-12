// External dependencies
import classnames from 'classnames/dedupe';
import PropTypes from 'prop-types';

// WordPress dependencies
const { Component, Fragment } = wp.element

// Create admin page content for settings
export default class ContainerBlock extends Component {
    constructor( props ) {
        super( props )

        this.state = {
            activeCategory: this.props.activeCategory,
        }
    }

    activeclass( id ) {
        let {
            activeCategory,
        } = this.state

        return activeCategory === id ? 'active' : 'inactive'
    }

    render() {
        let {
            sections,
            labelExtras,
        } = this.props

        let {
            activeCategory,
        } = this.state

        const resultTabs = []
        let resultContent = ''

        let labels = []
        let contents = []

        Object.keys( sections ).forEach( ( key, i ) => {
            let section = sections[ key ]

            let id = section.label.replace(/\s+/g, '-').toLowerCase()

            if ( typeof( section.show ) !== 'undefined' && section.show != null && !section.show ) {
                return; // skip section if 'show' is set to false
            }

            let activeClass = this.activeclass( id );

            labels.push(
                <li className={ classnames(
                    activeCategory,
                    id,
                    'label',
                    activeClass
                ) } key={ `section-${ i }` }>
                <button className={ classnames(
                    'section-button',
                    activeClass
                ) } 
                    onClick={ () => {
                        this.setState( {
                            activeCategory: id
                        } )
                        
                        activeClass = this.activeclass( id )
                    } }
                    >
                        { section.label }
                    </button>
                </li>
                )

            let blocks = [];

            section.blocks.forEach( ( item, blockIndex ) => {
                blocks.push( <div key={ `block-${ blockIndex }` } className={ `block` }>{ item }</div> )
            } )

            contents.push(
                <li className={ classnames(
                    id,
                    'content',
                    activeClass
                    ) } key={ `section-${ i }-content` }>
                { blocks }
                </li>
            )
        } )

        return (
            <Fragment>
                <div className="labels">
                    <ul className="sections">
                        { labels }
                    </ul>
                    <div className="extra">{ labelExtras ? labelExtras : '' }</div>
                </div>

                <div className="contents">
                    <ul className="items">
                        { contents }
                    </ul>
                </div>
            </Fragment>
        )
    }
}

ContainerBlock.propTypes = {
    labelExtras: PropTypes.object,
};
