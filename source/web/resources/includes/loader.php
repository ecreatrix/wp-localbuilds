<?php
/* Default loader
 * V0.1
 */
namespace wa;

// Exit if accessed directly.

if ( ! defined( 'ABSPATH' ) ) {exit;}

if ( ! function_exists( 'wa\\loader' ) ) {
	function loader( $class, $base_dir, $prefix, $show_debug = false ) {
		// does the class use the namespace prefix?
		$len = strlen( $prefix );

		if ( strncmp( $prefix, $class, $len ) !== 0 ) {
			// no, move to the next registered autoloader

			return;
		}

		// get the relative class name
		$relative_class = substr( $class, $len );

		// replace the namespace prefix with the base directory, replace namespace separators with directory separators in the relative class name
		$relative_class = str_replace( '\\', '/', $relative_class );

		// if there is a subdirectory add 'class-' after last one, otherwise add to start of relative class
		$last_directory_pos = strrpos( $relative_class, '/' ) ? strrpos( $relative_class, '/' ) + 1 : 0;

		$relative_class = strtolower( substr( $relative_class, 0, $last_directory_pos ) )
		. 'class-' . substr( $relative_class, $last_directory_pos );

		// append filename with .php
		$file = $base_dir . $relative_class . '.php';

		// if the file exists, require it
		$debug = '';

		if ( file_exists( $file ) ) {
			$debug = '<br>Loaded file: ' . $file . '<br> for class: ' . $class;

			require_once $file;
		} else {
			$debug = '<br>Could not load file: ' . $file . '<br> for class: ' . $class;
		}

		if ( $show_debug ) {
			// Print debug text if required
			var_dump( $debug );
		}
	}
}
