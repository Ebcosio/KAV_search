<?php

function get_theForm(){

ob_start();
?>
<form class="va-search-form" id="zipForm" onsubmit="zipSub(event)" style="display: none;">
<h4 style="text-align: center;">Search VA.gov for Facilities</h4>
<p>Search Nearby Address or Nearby Zipcode finds VA facilities within estimated 90 minutes drive time.  You may use a home address,
or any full street address.
</p>
<div class="va-radio-buttons">

<div>
<label for="state-search">Search by State</label><br/>
<input type="radio" id="state-search" name="state-search" value="state-only" checked onchange="changeForm(event)">
</div>
<div>
<label for="zipcode-search" >Search by Zipcode</label><br/>
<input type="radio" id="zipcode-search" name="zipcode-search" value="zip-only" onchange="changeForm(event)">
</div>
<div>
<label for="address-search">Search nearby Address</label><br/>
<input type="radio" id="address-search" name="addr-search" value="full-address" onchange="changeForm(event)">
</div>
</div> <!-- closes va-radio-buttons div -->

<div id="address1" style="" class="va-form-inputgroup">
<p>Enter any full street address to find facilities within estimated 90 minutes drive time.</p>
 <label for="street-address">Enter Street Address:</label>
 <input id="street-address" type="text" placeholder="street address" name="address" value="" required />
 <label for="city">Enter City:</label>
 <input id="city" type="text"  placeholder="city" name="city" value="" required />
 </div>
<div id="address2" style="" class="va-form-inputgroup">
 <label for="choose-state">Select your State:</label>
  <select name="state"  id="choose-state">
  <option value="">choose:</option>
  </select><br/>
  </div>
  <div id="address3" class="va-form-inputgroup">

<label for="userZip">Enter 5 digit Zipcode: </label>
<input id="userZip" placeholder="zipcode" name="zipcode" value="" type="text"  maxlength="5" minlength="5"
     required/>
  </div>
  <div id="zip-options" class="va-form-inputgroup va-radio-buttons" >
    <p>Choose "Search nearby Zipcode" to find facilities within estimated 90 minutes drive time.</p>
    <div>
  <label for="zip-nearby" style="width: auto;">Search nearby Zipcode</label>
  <input type="radio" id="zip-nearby" name="withinOrNearby" value="zip-nearby" checked>
</div>
<div>
  <label for="within-zip" style="width: auto;" >Search within Zipcode</label>
  <input type="radio" id="within-zip" name="withinOrNearby" value="within-zip" >
</div>
</div>
<p style="text-align: center;">
<input type="submit" id="va-search-submit" style="" value="Submit VA search" /></p>
</form>

 <div id="vso-results">

 </div>
 <p id="status-message" role="alert" style="font-size: 16px; min-height: 1.5em; margin: 1px;"></p>
 <div id="zip-results" role="region" aria-label="VA search results will display here">


 </div>

<script>
// states array should be in external JS; if it reads, function is called below to build form options
if(states !== undefined || states !== null){
 renderFormMenu(states);
}
</script>
 <noscript>You need Javascript enabled in your browser to utilize VA Facilities Search Form</noscript>
<?php
$theForm = ob_get_clean();
return $theForm;

}

 ?>
