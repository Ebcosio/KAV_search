<?php
include_once('keys.php');
include_once('actions_helpers.php');


function query_VA_api_fullResponse($_link){
    $mykey = getVAkey();
    $response = wp_remote_get( $_link,
    array( 'timeout' => 5,
              'headers' => array( 'apikey' => $mykey)
                )
    );
    if( is_wp_error( $response ) ) {
        $data = '{"errors" : "VA.gov server error"}';
        return $data;

    }
    else{
    $data = wp_remote_retrieve_body( $response );
      return $data;
    }
}

function query_VA_api_buildTable($_link, $statename){
  $mykey = getVAkey();
  $response = wp_remote_get( $_link,
  array( 'timeout' => 5,
            'headers' => array( 'apikey' => $mykey)
              )
  );
  if( is_wp_error( $response ) ) {
      return 'VA.gov server error';
  }
  else{
//  'post_type' => 'kav-vso',
    // code to get data from VA API response
    $body = wp_remote_retrieve_body( $response );
    $data = json_decode($body, true);
    // check for 'errors' property if sent from Va. gov
    //if so, return a string with the error message, not JSON
      if($data['errors']){return $data['errors'][0]['title'] ? $data['errors'][0]['title'] : 'VA.gov server error';}
      else {
    $facilities = $data['data'];
    $total_pages = $data['meta']['pagination']['total_pages'];
    $current_page = $data['meta']['pagination']['current_page'];
    $total_entries = $data['meta']['pagination']['total_entries'];
    $prev = $data['links']['prev'];
    $next = $data['links']['next'];

    // code to get state vso data from KAV custom post type, by title of post which is the state name
    if($statename && $statename !== 'none'){
        $args = array('numberposts' => 1, 'post_type' => 'kav-vso', 'title' => $statename,  'fields' => 'ids');
        $stateCPT_id = get_posts( $args );
        if(isset($stateCPT_id))
        { 
            $content = get_post_field('post_content', $stateCPT_id[0]); 
            $vso_title = get_post_field('post_title', $stateCPT_id[0]); 
            $webaddress = get_post_meta( $stateCPT_id[0], 'webaddress', true );
            $webname = get_post_meta( $stateCPT_id[0], 'webname', true );
        }
        
    }

  ob_start();
  ?>
  
      <form id="state-va-data" style="display: none;">
          <?php  if( $webname){
            ?>
           <input type="hidden" name="StateVSOData" value="yes">
           <input type="hidden" name="title" value="<?php echo  $vso_title ? $vso_title : '';  ?>">
           <input type="hidden" name="webname" value="<?php echo  $webname ? $webname : '';  ?>">
           <input type="hidden" name="webaddress" value="<?php echo   $webaddress ? $webaddress : '';  ?>">
           <input type="hidden" name="content" value="<?php echo   $content ? $content : '';  ?>">
            
             <?php } else {  ?>
             <input type="hidden" name="StateVSOData" value="no">
             <?php } ?>
             
      </form>
      
  
     <?php // if( $statename === "none"){echo 'no state entered!!!';}   ?>
     
  <h4 style="text-align: center;"><?php echo $total_entries; ?> facilities located. 20 per page.</h4>
  <h5 style="text-align: center;">Page <?php  echo $current_page;  ?> of <?php  echo $total_pages;  ?></h5>
  <div id="va-table-wrapper" tabindex="0">

<table class="va-results-table">
<tbody>
  <?php
  foreach ($facilities as $fac):

  $name = $fac['attributes']['name'];
  $fac_type = $fac['attributes']['facility_type'];
  $address = $fac['attributes']['address']['physical'];

  $isOpen = $fac['attributes']['operating_status']['code'];
  $mainPhone = $fac['attributes']['phone']['main'];
  $website = $fac['attributes']['website'];
  $mobile = $fac['attributes']['mobile'];

  $lat = $fac['attributes']['lat'];
  $long = $fac['attributes']['long'];

  ?>
  <tr>
    <td><?php echo get_fac_name($name, $website); echo '<p>Facility type: '.get_fac_type($fac_type).'</p><br/>';
    ?></td>
      <td><?php
         echo $mobile ? '<p style="font-weight: bold;">This is a mobile facility</p>' : ' ' ;
        echo '<p>'.$address['address_1'] . ' ' . $address['address_2'].'</p>'.
         '<p>'.$address['city'].', '.$address['state'].' '.$address['zip'].'</p>';?></td>
        <td>
        <?php echo '<p>Operating Status: '.$isOpen.'</p>'; echo '<p>Main Tel: <a class="va-phone" href="tel: '.$mainPhone.' "> '.$mainPhone.'</a></p>';
       echo get_googlemaps($lat, $long, $name);
        ?>
        </td>
  </tr>
<?php  endforeach; ?>
</tbody>
</table>

</div> <!-- closes va tabel  container  -->
<div class="pagination-wrapper" role="navigation" aria-label="VA results navigation">
  <div class="va-table-message va-hide" role="alert">
    Loading results, please wait...
  </div>
  <div class="va-table-pagination">
    <span id="va-prev"><?php if($prev){ echo '  <a role="button" alt="scroll to previous results page" href="'.$prev.'" onclick="getPage(event)"><< Prev</a>';  }  ?></span>
    <span id="va-page-number">Page <?php  echo $current_page;  ?> of <?php  echo $total_pages;  ?></span>
    <span id="va-next"><?php if($next){ echo '  <a role="button" alt="scroll to next results page"  href="'.$next.'" onclick="getPage(event)">Next >></a>';  }  ?></span>
  </div>
</div>

  <?php
  $_table = ob_get_clean();
  return $_table;
      } // closes inner else statement encapsulating the table html code


   }// closes outer else statement

} // closes function


 ?>
