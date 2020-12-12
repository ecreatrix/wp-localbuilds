<?php
namespace wa\LocalBuilds\Settings;

use wa\LocalBuilds as Plugin;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {exit;}
if ( ! class_exists( Rest::class ) ) {
	class Rest {
		public function __construct() {
			add_action( 'rest_api_init', [$this, 'register_routes'] );
		}

		public function edit_theme_permission() {
			if ( ! current_user_can( 'edit_theme_options' ) ) {
				return self::response_warning( __( 'User doesn\'t have permissions to change options.', 'wa' ), 'user_dont_have_permission' );
			}

			return true;
		}

		public static function get_settings_route( \WP_REST_Request $request ) {
			$settings = Options::get_settings( Options::get_options_key() );

			return self::response_success( json_encode( $settings ) );
		}

		public function manage_options_permission() {
			if ( ! current_user_can( 'manage_options' ) ) {
				return self::response_warning( __( 'User doesn\'t have permissions to change options.', 'wa' ), 'user_dont_have_permission' );
			}

			return true;
		}

		public function register_routes() {
			$namespace = Plugin\CODENAME . '/v1';

			register_rest_route( $namespace, '/settings/', [
				'methods'             => \WP_REST_Server::EDITABLE,
				'callback'            => [$this, 'update_settings_route'],
				'args'                => [],
				'permission_callback' => [$this, 'manage_options_permission']
			] );

			register_rest_route( $namespace, '/settings/', [
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => [$this, 'get_settings_route'],
				'permission_callback' => [$this, 'manage_options_permission']
			] );
		}

		public static function response_success( $returned = [], $message = 'Settings were updated' ) {
			return new \WP_REST_Response(
				[
					'message'  => $message,
					'type'     => 'success',
					'returned' => wp_json_encode( $returned )
				],
				200
			);
		}

		public static function response_warning( $returned = [], $message = 'Failed to update settings' ) {
			return new \WP_REST_Response(
				[
					'message'  => $message,
					'type'     => 'warning',
					'returned' => wp_json_encode( $returned )
				],
				200
			);
		}

		public static function update_settings_route( \WP_REST_Request $request ) {
			$new_settings = $request->get_param( 'values' );
			$reset = $request->get_param( 'reset' );

			$update_successful = Options::update_settings( $new_settings );

			if ( $reset ) {
				return self::response_success( [], 'Settings were reset' );
			} else if ( $update_successful ) {
				return self::response_success( $new_settings );
			} else if ( ! $update_successful ) {
				return self::response_warning( $new_settings, 'No new data provided, settings do not need to be updated' );
			} else {
				return self::response_warning( $new_settings, 'Failed to update settings' );
			}
		}
	}
}
