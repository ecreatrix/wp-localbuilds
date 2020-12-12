<?php
namespace wa\LocalBuilds\WP;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {exit;}
if ( ! class_exists( Index::class ) ) {
	class Index {
		public function __construct() {
			$this->rest();
		}

		public function rest() {
			add_filter( 'allowed_http_origin', '__return_true' );
		}
	}
}
