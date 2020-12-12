<?php
namespace wa\LocalBuilds\Settings;

use wa\LocalBuilds as Plugin;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {exit;}
if ( ! class_exists( Index::class ) ) {
	class Index {
		public function __construct() {
			$this->init_classes();

			add_filter( Plugin\CODENAME . '_get_dev', [$this, 'get_dev'] );
		}

		public function get_dev() {
			return Options::get_field( 'devMode' );
		}

		public function init_classes() {
			if ( class_exists( rest::class ) ) {
				new rest();
			}

			if ( class_exists( Options::class ) ) {
				new Options();
			}

			if ( class_exists( Pages::class ) ) {
				new Pages();
			}
		}
	}
}
