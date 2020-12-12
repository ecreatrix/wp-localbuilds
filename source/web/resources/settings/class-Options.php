<?php
namespace wa\LocalBuilds\Settings;

use wa\LocalBuilds as Plugin;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {exit;}
if ( ! class_exists( Options::class ) ) {
	class Options {
		public function __construct() {}

		public static function get_field( $field_key = false, $settings_key = false ) {
			$settings = self::get_settings( $settings_key );

			$field = '';
			if ( $settings && array_key_exists( $field_key, $settings ) ) {
				$field = $settings[$field_key];
			}

			return $field;
		}

		// $key = api name to get api specific settings
		public static function get_options_key( $key = false ) {
			if ( ! $key ) {
				$key = 'generic';
			}

			return Plugin\CODENAME . '_settings_' . $key;
		}

		public static function get_settings( $key = false ) {
			$key = self::get_options_key( $key );

			$saved = get_option( $key, [] );

			if ( ! is_array( $saved ) || empty( $saved ) ) { // set options to default if none set
				update_option( $key, [] );
			}

			return wp_parse_args( $saved, [] );
		}

		//Array keys must be whitelisted (IE must be keys of self::$defaults)
		public static function update_settings( $new_settings = [], $key = false ) {
			$key = self::get_options_key( $key );

			if ( ! is_array( $new_settings ) ) {
				$current_settings = self::get_settings( $key );

				return $current_settings;
			}

			$update_successful = update_option( $key, $new_settings );

			return $update_successful;
		}
	}
}
