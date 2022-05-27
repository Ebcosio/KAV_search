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



 include_once('assets.php');
 include_once('actions.php');

// enqueue and localise scripts

// go ahead and enqueu this in the header for every page; may need for other entry forms
wp_register_script('states-js', plugin_dir_url( __FILE__ ) . 'statesobj.js', array( 'jquery' ), '1', true);


// conditional enqueue the below script/style only if page contains the shortcode.  Place in footer
wp_register_script('my-ajax-handle', plugin_dir_url( __FILE__ ) . 'search_ajax.js', array( 'jquery' ), '2', true);

wp_register_style( 'results-styling', plugins_url( 'results.css' , __FILE__ ));

function localize_ajax_functions() {
      $post = get_page(get_the_ID());
      wp_enqueue_script('states-js');
      if( has_shortcode( $post->post_content, 'zipcode_form_kav') ) {

     wp_enqueue_script('my-ajax-handle');
     wp_enqueue_style('results-styling');
    wp_localize_script( 'my-ajax-handle', 'the_ajax_script',
    array( 'ajaxurl' => admin_url( 'admin-ajax.php' ), 'nonce' => wp_create_nonce( 'kav-zipcode-nonce' )));
          }
      unset($post);
}

 add_action( 'wp_enqueue_scripts', 'localize_ajax_functions' );
 add_action( 'wp_ajax_the_ajax_hook', 'the_action_function' );
 add_action( 'wp_ajax_nopriv_the_ajax_hook', 'the_action_function' ); // need this to serve non logged in users

 // ACTION FUNCTIONS
 function the_action_function(){
check_ajax_referer( 'kav-zipcode-nonce', 'nonce_data' );
 //$link = $domain . $_POST['link'];
 $link = $_POST['link'];
 $getTable = $_POST['getTable'];
 $statename = $_POST['state'];
     
 if(isset($link)){
       if($getTable == 'true'){
        $table = query_VA_api_buildTable($link, $statename);
         echo $table;
         unset($table);
          }
      else if($getTable == 'false') {
     $data = query_VA_api_fullResponse($link);
        echo $data;
       unset($data);
            }
      else {echo 'server error';}
      }
  else { echo 'server error';}
  // will die() if client nonce does not check out
 die();// wordpress may print out a spurious zero without this - can be particularly bad if using json
 }

 // ADD A FORM TO THE PAGE
 function hello_world_kav(){
$the_form = get_theForm();
 return $the_form;
 }

 add_shortcode("zipcode_form_kav", "hello_world_kav");

 ?>
