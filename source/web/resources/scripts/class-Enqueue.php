<?php
namespace wa\LocalBuilds\Scripts;

use wa\LocalBuilds as Plugin;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {exit;}

if ( ! class_exists( Enqueue::class ) ) {
    class Enqueue {
        public function __construct() {}

        public static function add_assets( $file, $extension = false, $requirements = [], $parameters = [] ) {
            if ( ! $extension ) {
                // Set default extension of none given
                $extension = 'css';
            }

            $shortname = Plugin\SHORTNAME . $file;
            $codename = Plugin\CODENAME . '_' . $file;
            $file = self::filename( $file, $extension );

            $uri = Plugin\URI . $file;
            $time = filemtime( Plugin\PATH . $file );

            if ( 'css' === $extension ) {
                wp_enqueue_style( $shortname, $uri, $requirements, $time );
            } else if ( 'js' === $extension ) {
                wp_enqueue_script( $shortname, $uri, $requirements, $time, true );

                if ( ! empty( $parameters ) ) {
                    // Add localized content if provided
                    wp_localize_script( $shortname, $codename, $parameters );
                }
            }
        }

        public static function filename( $file, $extension ) {
            // Only allow style, or script as directory
            $directory = 'styles';
            if ( 'js' === $extension ) {
                $directory = 'scripts';
            }

            $file = 'assets/' . $directory . '/' . $file;

            $file_dev = $file . '.min.' . $extension;
            $file_prod = $file . '.' . $extension;

            // Show dev version of files if theme settings' dev mode enabled
            $dev = apply_filters( Plugin\CODENAME . '_get_dev', false );

            if ( $dev && file_exists( Plugin\PATH . $file_dev ) ) {
                $file = $file_dev;
            } else if ( file_exists( Plugin\PATH . $file_prod ) ) {
                // Use min if not set as dev project
                $file = $file_prod;
            } else {
                // Stop if neither version of file is available

                return '';
            }

            return $file;
        }
    }
}
