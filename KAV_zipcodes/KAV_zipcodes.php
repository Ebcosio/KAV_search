<?php
/*
 * Plugin Name: KAV Zipcodes
 * Description: Add user zipcode search to the page url.
 * Version: 1.0
 * Author: Eric Cosio
 */

 defined('ABSPATH') || die;

define('KAV_ZIPCODES', '1.0.0');
define('KAV_ZIPCODES', plugin_dir_path( __FILE__ ) );
define('KAV_ZIPCODES', 'kav-zipcodes-plugin');


add_action('wp_enqueue_scripts', function() {
    wp_enqueue_script('kav_zipcode_url', plugins_url( '/scripts3.js' , __FILE__ ), [], null, TRUE );
});

// Add Shortcode
function zipcode_form_shortcode( ) {

  ob_start();

?>

<div class="search-form-wrapper">
        
         <form method="get" id="zipcodes" class="search-form">
                        	
                        		<input type="text" name="s" id="zipcode_input" class="form-control input-sm">
                            	<input type="button" id="zipcode_button" value="search zipcode">
                        
                       		
         </form>
        
    
</div>

<?php
    $ob_str = ob_get_contents();
    ob_end_clean();
    return $ob_str;
}



//add_shortcode( 'ces_events', 'ces_events_shortcode' );

add_shortcode( 'zipcode_form', 'zipcode_form_shortcode' );
?>
