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
        $data = '{"error": "server error"}';
        return $data;
    }
    else{
    $data = wp_remote_retrieve_body( $response );
    return $data;
     }
}

function query_VA_api_buildTable($_link){
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
  $body = wp_remote_retrieve_body( $response );
  $data = json_decode($body, true);
  $facilities = $data['data'];
  $total_pages = $data['meta']['pagination']['total_pages'];
  $current_page = $data['meta']['pagination']['current_page'];
  $total_entries = $data['meta']['pagination']['total_entries'];
  $prev = $data['links']['prev'];
  $next = $data['links']['next'];

//  facility.attributes.website;

  ob_start();
  ?>
  <h4 style="text-align: center;"><?php echo $total_entries; ?> facilities located. 20 per page.</h4>
  <h5 style="text-align: center;">Page <?php  echo $current_page;  ?> of <?php  echo $total_pages;  ?></h5>
  <div id="va-table-wrapper" tabindex="0">

<table class="va-results-table">
<tbody>
  <?php
  foreach ($facilities as $fac):
  //$fac = $data['data'][0];
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
        <?php echo '<p>Operating Status: '.$isOpen.'</p>'; echo '<p>Main Tel: '.$mainPhone.'</p>';
       echo get_googlemaps($lat, $long, $name);
        ?>
        </td>
  </tr>
<?php  endforeach; ?>
</tbody>
</table>

</div> <!-- closes va tabel  container  -->
<div class="pagination-wrapper">
  <div class="va-table-message va-hide" style="">
    Loading results, please wait...
  </div>
  <div class="va-table-pagination">
    <span id="va-prev"><?php if($prev){ echo '  <a href="'.$prev.'" onclick="getPage(event)"><< Prev</a>';  }  ?></span>
    <span id="va-page-number">Page <?php  echo $current_page;  ?> of <?php  echo $total_pages;  ?></span>
    <span id="va-next"><?php if($next){ echo '  <a href="'.$next.'" onclick="getPage(event)">Next >></a>';  }  ?></span>
  </div>
</div>

  <?php
  $_table = ob_get_clean();
  return $_table;


  //return $data;
   }

}


 ?>
