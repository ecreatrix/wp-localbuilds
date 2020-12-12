<?php
namespace wa\LocalBuilds\Scripts;

use wa\LocalBuilds as Plugin;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {exit;}
if ( ! class_exists( Index::class ) ) {
    class Index {
        public function __construct() {
            $this->init_enqueues();
        }

        public function init_enqueues() {
            if ( class_exists( Assets::class ) && class_exists( Enqueue::class ) ) {
                new Assets();
            }
        }
    }
}