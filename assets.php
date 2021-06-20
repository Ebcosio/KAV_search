<?php

function get_theForm(){
   return '
   <form id="zipForm" style="display: none; text-align: left;" onsubmit="zipSub(event)">

   <input type="radio" id="state-search" name="state-search" value="state-only" checked onchange="changeForm(event)">
  <label for="state-search" style="width: 10em;">Search by State</label><br>

  <input type="radio" id="zipcode-search" name="zipcode-search" value="zip-only" onchange="changeForm(event)">
  <label for="zipcode-search" style="width: 10em;">Search by Zipcode</label><br>

  <input type="radio" id="address-search" name="addr-search" value="full-address" onchange="changeForm(event)">
  <label for="address-search" style="width: 10em;">Search nearby Address</label>


  <div id="address1" style="">
    <label for="street-address">Enter Street Address:</label>
    <input id="street-address" type="text" placeholder="street address" name="address" value="" required />
    <label for="city">Enter City:</label>
    <input id="city" type="text"  placeholder="city" name="city" value="" required />
    </div>
  <div id="address2" style="">
    <label for="choose-state">Select your State:</label>
     <select name="state"  id="choose-state">
     <option value="">choose:</option>
     </select><br/>
     </div>
     <div id="address3" style="">
   <label for="userZip">Enter 5 digit Zipcode</label>
   <input id="userZip" placeholder="zipdcode" name="zipcode" value="" type="text"  maxlength="5" minlength="5"
  style="width: 10em;"  required/>
  </div>
   <button type="submit" style="margin: 5px; font-weight: bold;">Submit Zipcode</button>
   </form>

    <div id="vso-results">
  <h6><a target="blank" alt="VA information for your state"></a></h6>
  <p><a target="_blank" aria-hidden="true"></a></p>

    </div>
    <div id="zip-results">
      <p id="status-message" style="font-size: 16px;"></p>
      <div id="zip-table-wrapper"></div>
    </div>
  <script>
  // states array should be in external JS; if it reads, function called below to build form options
  if(states){
    renderFormMenu(states);
  }
  </script>
    <noscript>You need Javascript enabled in your browser to utilize VA Facilities Search Form</noscript>
   ';


}

 ?>
