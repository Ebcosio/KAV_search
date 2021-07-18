<?php
function get_fac_type($str){
if($str === 'vet_center'){return 'Vet Center';}
else  if($str === 'va_health_facility'){return 'Health Facility';}
else  if($str === 'va_benefits_facility'){return 'VA Benefits Facility';}
else{return 'other';}
}

function get_fac_name($namestr, $href){
   if(!$href && $namestr){
   return '<p id="facility-name">'.$namestr.'</p>';
   }
   if($href && $namestr){
  //  include unique alt text
      return '<p><a target="_blank" alt="link to ' . $namestr . '"  href="' . $href . ' ">'.$namestr.'</a></p>';
   }
   if(!$href && !$namestr){return 'facility name not available';}

}

function get_googlemaps($_lat, $_long, $namestr){
    if($_lat && $_long){
      // include unique alt text for accessibility guidelines
    return  '<a target="_blank" alt="google maps location of '. $namestr . '" href="https:'. '//maps.google.com/?q=' . $_lat . ',' . $_long . ' " >Google maps location</a>';

    }
    else {return ' ';}

}


 ?>
