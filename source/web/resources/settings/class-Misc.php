<?php
namespace wa\LocalBuilds\Settings;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {exit;}

if ( ! class_exists( Misc::class ) ) {
	class Misc {
		public function __construct() {}

		public static function mod_image( $key ) {
			$id = get_theme_mod( $key );
			if ( $id ) {
				// Some theme mods give the image url instead of id
				$url_to_id = attachment_url_to_postid( $id );
				if ( $url_to_id ) {
					$id = $url_to_id;
				}

				return wp_get_attachment_image( $id, 'full' );
			}

			return false;
		}
	}
}
