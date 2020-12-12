// WordPress dependencies
const { __ } = wp.i18n;

// Internal dependencies
import SettingsContainer from './components/container';
import Pages from './pages';

// Add settings page if settings element exists
window.addEventListener( 'load', () => {
	const admin = document.querySelector( '.walcbld-admin-page' );

    admin ? wp.element.render(
        <SettingsContainer title={ __( 'Local Build' ) } project="walcbld" pages={ Pages } data={ window.walcbld_settings } />,
        admin
    ) : '';
} ); 