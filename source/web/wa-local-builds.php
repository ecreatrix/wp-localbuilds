<?php
/**
 * @wordpress-plugin
 * Plugin Name: WA Local Build
 * Description: Changes required for local builds only
 * Version:     2.1.0
 * Author:      Alyx Calder
 * License:     GPL-2.0+
 * License URI: http:// www.gnu.org/licenses/gpl-2.0.txt
 * @package   wa-local-builds
 *
 * @author    Alyx Calder
 * @copyright 2020 Alyx Calder
 * @license   GPL-2.0+
 */
namespace wa\LocalBuilds;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    exit;
}

if ( ! class_exists( Plugin::class ) ) {
    defined( __NAMESPACE__ . '\VERSION' ) || define( __NAMESPACE__ . '\VERSION', '2.1.0' );
    defined( __NAMESPACE__ . '\URI' ) || define( __NAMESPACE__ . '\URI', plugin_dir_url( __FILE__ ) );
    defined( __NAMESPACE__ . '\PATH' ) || define( __NAMESPACE__ . '\PATH', plugin_dir_path( __FILE__ ) );

    defined( __NAMESPACE__ . '\NAME' ) || define( __NAMESPACE__ . '\NAME', 'Local Builds' );
    defined( __NAMESPACE__ . '\SHORTNAME' ) || define( __NAMESPACE__ . '\SHORTNAME', 'wa-lcbld' );
    defined( __NAMESPACE__ . '\CODENAME' ) || define( __NAMESPACE__ . '\CODENAME', 'walcbld' );

    $loader = PATH . 'resources/includes/loader.php';
    if ( $loader ) {
        require_once $loader;

        spl_autoload_register( function ( $class ) {
            \wa\loader( $class, PATH . 'resources/', 'wa\\LocalBuilds\\' );
        } );
    }

    class Plugin {
        // Holds the main instance.
        private static $__instance = null;

        // Set basic variables
        public function __construct() {
            add_action( 'plugins_loaded', [$this, 'init_classes'] );

            add_action( 'send_headers', [$this, 'add_cors_http_header'] );
            add_filter( 'allowed_http_origins', [$this, 'add_allowed_origins'] );
        }

        public function add_allowed_origins( $origins ) {
            $origins[] = 'http://localhost:3000/';
            $origins[] = 'http://localhost:3002/';

            return $origins;
        }

        public function add_cors_http_header() {
            header( 'Access-Control-Allow-Origin: http://localhost:3000/' );
            header( 'Access-Control-Allow-Origin: http://localhost:3002/' );
        }

        public function init_classes() {
            $this->scripts();
            $this->wp();
            $this->settings();
        }

        // Get/create the plugin instance.
        public static function instance() {
            if ( empty( self::$__instance ) ) {
                self::$__instance = new Plugin();
            }

            return self::$__instance;
        }

        public function scripts() {
            if ( class_exists( Scripts\Index::class ) ) {
                new Scripts\Index();
            }
        }

        public function settings() {
            if ( class_exists( Settings\Index::class ) ) {
                new Settings\Index();
            }
        }

        public function wp() {
            if ( class_exists( WP\Index::class ) ) {
                new WP\Index();
            }
        }
    }

    Plugin::instance();
}
