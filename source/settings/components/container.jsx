// External dependencies
import classnames from 'classnames/dedupe';
import PropTypes from 'prop-types';

// WordPress dependencies
const { Component, Fragment } = wp.element;

const { __ } = wp.i18n;

const $ = window.jQuery;

// Create admin page content for settings
export default class SettingsContainer extends Component {
    constructor( props ) {
        super( props );

        const {
            project,
        } = props

        // get variable.
        const $_GET = [];
        window.location.href.replace( /[?&]+([^=&]+)=([^&]*)/gi, function( a, name, value ) {
            $_GET[ name ] = value;
        } );

        // Set the default states
        this.state = {
            activePage: $_GET.sub_page ? $_GET.sub_page : Object.keys( props.pages )[ 0 ],
            blocks: {},
        };
    }
    updateAdminPageActiveLink() {
        const {
            project,
        } = this.props

        const {
            activePage,
        } = this.state;

        // disable active link.
        $( `.toplevel_page_${ project } .current` ).removeClass( 'current' );

        // find new active link.
        let $link = $( `.toplevel_page_${ project } [href="admin.php?page=${ project }&sub_page=${ activePage }"]` );

        if ( ! $link.length ) {
            $link = $( `.toplevel_page_${ project } [href="admin.php?page=${ project }"]` );
        }

        $link.parent().addClass( 'current' );

        // change address bar link
        if ( $link.length ) {
            window.history.pushState( document.title, document.title, $link.prop( 'href' ) );
        }
    }

    render() {
        const {
            pages,
            logo,
            project,
            title,
            showTitle,
        } = this.props

        const {
            activePage,
        } = this.state;

        const resultTabs = [];
        let resultContent = '';

        // Get tabs for pages
        Object.keys( pages ).forEach( ( k ) => {
            resultTabs.push(
                <li className='name' key={ k }>
                    <button
                        className={ classnames( `admin-tabs-button`, activePage === k ? `active` : '' ) }
                        onClick={ () => {                            
                            this.setState( {
                                activePage: k,
                            }, () => {
                                this.updateAdminPageActiveLink();
                            } );
                        } }
                    >
                        { pages[ k ].label }
                    </button>
                </li>
            );
        } );

        if ( activePage && pages[ activePage ] ) {
            const NewBlock = pages[ activePage ].block;
            
            resultContent = (
                <NewBlock
                    data={ this.props.data }
                    settings={ this.state.settings }
                    updateSettings={ this.updateSettings }
                />
            );
        }

        return (
            <Fragment>
                <div className={ `${ project }-admin-head admin-head` }>
                    <div className={ `admin-head-wrap` }>
                        <div className={ `admin-project` }>
                            { showTitle || true && <h1>{ title }</h1> }
                        </div>
                        <ul className={ `admin-tabs` }>
                            { resultTabs }
                        </ul>
                    </div>
                </div>
                <div className={ `${ project }-admin-content admin-content` }>
                    { resultContent }
                </div>
            </Fragment>
        );
    }
}

SettingsContainer.propTypes = {
    data: PropTypes.object,
};
