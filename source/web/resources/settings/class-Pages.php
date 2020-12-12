<?php
namespace wa\LocalBuilds\Settings;

use wa\LocalBuilds as Plugin;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {exit;}
if ( ! class_exists( Pages::class ) ) {
	class Pages {
		public function __construct() {
			add_action( 'admin_menu', [$this, 'register_menu'], 0 );
		}

		// Add admin page to theme menu
		public static function admin_page_info( $info = [] ) {
			$new_info = [
				'menu_slug'        => self::get_menu_slug(),
				'menu_position'    => 90,
				'submenu_position' => 0,
				'page_title'       => self::get_menu_title(),
				'menu_title'       => self::get_menu_title(),
				'capability'       => 'manage_options'
			];

			return array_merge( $info, $new_info );
		}

		public function content() {
			echo '<div class="' . Plugin\CODENAME . '-admin-page wa-admin-page"></div>';

			return '';
		}

		public static function get_admin_page() {
			return admin_url( 'admin.php?page=' . $_GET['page'] );
		}

		public static function get_menu_slug() {
			return Plugin\SHORTNAME;
		}

		public static function get_menu_title() {
			return esc_html__( Plugin\NAME, 'walbd' );
		}

		public function register_menu() {
			$admin_page_info = self::admin_page_info();
			$function = [$this, 'content'];

			add_menu_page( $admin_page_info['page_title'], $admin_page_info['menu_title'], $admin_page_info['capability'], $admin_page_info['menu_slug'], $function, '', $admin_page_info['menu_position'] );
			add_submenu_page( $admin_page_info['menu_slug'], 'Dashboard', 'Dashboard', $admin_page_info['capability'], $admin_page_info['menu_slug'], $function, $admin_page_info['submenu_position'] );
		}
	}
}