<?php
namespace wa\LocalBuilds\Scripts;
use wa\LocalBuilds as Plugin;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {exit;}
if ( ! class_exists( Assets::class ) ) {
    class Assets {
        public function __construct() {
            //General scripts and styles
            add_action( 'wp_enqueue_scripts', [$this, 'frontend'], 10 );

            add_action( 'admin_enqueue_scripts', [$this, 'settings'] );
            add_action( 'admin_enqueue_scripts', [$this, 'backend'] );
        }

        public function backend() {
            $name = 'admin';
            Enqueue::add_assets( $name, 'js' );
            Enqueue::add_assets( $name, 'css' );
        }

        public function frontend() {
            $name = 'main';
            Enqueue::add_assets( $name, 'js' );
            Enqueue::add_assets( $name, 'css' );
        }

        public function settings() {
            $name = 'settings';
            Enqueue::add_assets( $name, 'css' );

            $requirements = ['jquery', 'wp-editor', 'wp-i18n', 'wp-element', 'wp-edit-post', 'wp-compose', 'underscore', 'wp-components', 'wp-api-request', 'wp-api-fetch'];

            $settings = [
                'ajax_url'    => admin_url( 'admin-ajax.php' ),
                'settings'    => Plugin\Settings\Options::get_settings(),
                'currentPage' => admin_url( 'admin.php?page=' . $_GET['page'] )
            ];
            Enqueue::add_assets( $name, 'js', $requirements, $settings );
        }
    }
}
