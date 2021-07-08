<?php
include_once('keys.php');

function query_VA_api($_link){
    $mykey = getVAkey();
    $response = wp_remote_get( $_link,
    array( 'timeout' => 5,
              'headers' => array( 'apikey' => $mykey)
                )
    );
    if( is_wp_error( $response ) ) {
        $data = '{"error": "server error"}';
        return $data;
    }
    else{
    $data = wp_remote_retrieve_body( $response );
    return $data;
     }
}


 ?>
