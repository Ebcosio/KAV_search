<?php
 /*
 Plugin Name: KAV VA.gov custom search
  Plugin URI: https://github.com/Ebcosio/KAV_search.git
 Description: Adds zipcode search form and VA API to front-end, use shortcode on certain pages [zipcode_form_kav/].
 pages with shortcode must be either:  titled "Self Help", or be the front page.
 Version: 2.5
 Author: Eric Cosio
 */



defined('ABSPATH') || die;
define('KAV_ZIPCODE_SEARCH', '2.0.0');
define('KAV_ZIPCODE_SEARCH', plugin_dir_path( __FILE__ ) );
define('KAV_ZIPCODE_SEARCH_TRANS', 'kav-zipcode-search-plugin');


 include_once('keys.php');
 include_once('assets.php');

// enqueue and localise scripts
 //wp_enqueue_script( 'my-ajax-handle', plugin_dir_url( __FILE__ ) . 'ajax.js', array( 'jquery' ) );
 wp_register_script('my-ajax-handle', plugin_dir_url( __FILE__ ) . 'search_ajax.js', array( 'jquery' ));

function localize_ajax_functions() {
//  $post = get_page(get_the_ID());
//  if( has_shortcode( $post->post_content, 'zipcode_form_kav') ) {
// below condition will check for various pages within the site, ex. page title or ID or frontpage
// don't load the JS file in pages that dont need it!
if(get_the_title() == "Self Help" || get_the_ID() == "12322"){
 wp_enqueue_script('my-ajax-handle');
wp_localize_script( 'my-ajax-handle', 'the_ajax_script',
array( 'ajaxurl' => admin_url( 'admin-ajax.php' ), 'nonce' => wp_create_nonce( 'kav-zipcode-nonce' )));
//      }
  }
//  unset($post);
}


 add_action( 'wp_enqueue_scripts', 'localize_ajax_functions' );
 add_action( 'wp_ajax_the_ajax_hook', 'the_action_function' );
 add_action( 'wp_ajax_nopriv_the_ajax_hook', 'the_action_function' ); // need this to serve non logged in users

 // ACTION FUNCTIONS
 function the_action_function(){

check_ajax_referer( 'kav-zipcode-nonce', 'nonce_data' );

 $link = $domain . $_POST['link'];
$mykey = getVAkey();
 $response = wp_remote_get( $link,
array( 'timeout' => 5,
      
           'headers' => array( 'apikey' => $mykey)
             )
 );
 if( is_wp_error( $request ) ) {
     echo '{"error": "server error"}';
 }
$data = wp_remote_retrieve_body( $response );
echo $data;
unset($data);
 die();// wordpress may print out a spurious zero without this - can be particularly bad if using json
 }

 // ADD EG A FORM TO THE PAGE
 function hello_world_kav(){
$the_form = get_theForm();
 return $the_form;
 }

 add_shortcode("zipcode_form_kav", "hello_world_kav");

 ?>
