
function changeForm(e){
		e.preventDefault();
		let state = document.getElementById("state-search");
		let zipcode = document.getElementById("zipcode-search");
		let full = document.getElementById("address-search");

	if(e.target.value === "state-only"){
    zipcode.checked = false;
		full.checked = false;
  enableFormInputs(e.target.value);
	}
	if (e.target.value === "zip-only"){
     state.checked = false;
		 full.checked = false;
    enableFormInputs(e.target.value);
	}
	if (e.target.value === "full-address"){
		zipcode.checked = false;
		state.checked = false;
		  enableFormInputs(e.target.value);
	}
}

function zipSub(e){
	e.preventDefault();
  var arr = jQuery("#zipForm").serializeArray();

		if(arr[1].name === "state"){
					if(arr[1].value === ""){return alert("please choose a state");}
					else {
					var state = states.getStateAbbr.call(states, arr[1].value) || '';
					
					buildVa(createLinkState(arr[1].value.trim()), state );

				}
		}
		if(arr[1].name === "zipcode"){

			if(arr[1].value === ""){return alert("zipcode value is blank or invalid");}
			else if (isNaN(arr[1].value)){return alert("enter 5 digit zipcode with numbers only");}
			else {
                
				var state = states.getzipState.call(states, arr[1].value).long || '';
                
				 if(arr[2].value === "within-zip"){
                            
				    buildVa(createLinkZip(arr[1].value.trim()), state); }
                 else {
                     // pass state var as arg to both createNearby and queryNearby functions
				  	  queryNearby(createNearbyZipLink(arr[1].value.trim(), state), state);
					}
			}
		}

		if(arr[1].name === "address"){
			var state = states.getStateAbbr.call(states, arr[3].value) || '';
			 queryNearby(createNearbyLink(arr), state);
		}

};

//adds params for nearby with zip only query; other queries an empty string
const createNearbyZipLink = (zipStr, _state) => {
let	link = 'https://api.va.gov/services/va_facilities/v0/nearby?'+
    'street_address=blankblank&city=blank&state='+ _state +'&zip=' + zipStr + '&drive_time=90';
return link;
}

//adds params for nearby street address
const createNearbyLink = (_queryArr) => {
	if(_queryArr.length > 2 ){
	let	link = 'https://api.va.gov/services/va_facilities/v0/nearby?street_address='+_queryArr[1].value.trim()+'&city='+_queryArr[2].value.trim()+'&state='+_queryArr[3].value.trim()+'&zip='+_queryArr[4].value.trim()+'&drive_time=90';
    return link;
	}
	else{jQuery("#status-message").html('the search form has incomplete information');}

}
// add params with id string
const createLinkIDs = (_idStr) => {
   let link = 'https://api.va.gov/services/va_facilities/v0/facilities?ids=' + _idStr +'&per_page=20';
	return link;
}
// add params with zip, etc...
const createLinkZip = (_zip) => {
	let link =	'https://api.va.gov/services/va_facilities/v0/facilities?zip=' + _zip + '&per_page=20';
	return link;
}

const createLinkState = (state) => {
	let link =	'https://api.va.gov/services/va_facilities/v0/facilities?state=' + state + '&per_page=20';
	return link;
}

function hideOrDisableVAButtons(hide){
	//hide arg is a boolean
var paginationRow = document.getElementsByClassName("va-table-pagination")[0];
var messageRow = document.getElementsByClassName("va-table-message")[0];
	if(paginationRow && messageRow){
		if(hide){paginationRow.classList.add("va-hide"); messageRow.classList.remove("va-hide");}
		if(!hide){paginationRow.classList.remove("va-hide"); messageRow.classList.add("va-hide");}
	}
}

const queryNearby = (_link, _statename) => {

	jQuery("#status-message").html('Searching VA facilities.  This may take a moment...');
	  jQuery.ajax({
	    type: "POST",
			timeout: 6000,
			async: true,
	   url: the_ajax_script.ajaxurl,
	   data: {
	       action : 'the_ajax_hook', // wp_ajax_*, wp_ajax_nopriv_*
           link : _link,
		   getTable : "false",
	       nonce_data : the_ajax_script.nonce
	   }
	 })
	 .done(function (response) {
			jQuery("#status-message").html('');
             //Va response contains facility id's in each Json array element
            let parsed = JSON.parse(response);
						// check for errors message, no data property, or no id property in first element of data array
						if(parsed.errors || !parsed.data){
							jQuery("#status-message").html(parsed.errors ? parsed.errors[0].title : 'server error'); return;
								}
						else if(!parsed.data[0].id){ jQuery("#status-message").html('no local VA facilities found'); return; }
						else{
						 // we may eventually need to store idArray values in DOM, for further querying of API
						 let idArray = parsed.data.map(el => {return el.id;});
			    	 let idStr = idArray.join(',');
             buildVa(createLinkIDs(idStr), _statename);
					}
	}).fail(function (errorThrown){
	jQuery("#status-message").html(errorThrown.status + ' ' + errorThrown.statusText);})
}

const buildVa = (_link, statename) => {

jQuery("#status-message").html('loading...');
	hideOrDisableVAButtons(true);
    jQuery.ajax({
    type: "POST",
		timeout: 6000,
		async: true,
   url: the_ajax_script.ajaxurl,

   data: {
       action : 'the_ajax_hook', // wp_ajax_*, wp_ajax_nopriv_*
       link : _link,
       getTable : 'true',
       state: statename ? statename : 'none' ,
       nonce_data : the_ajax_script.nonce
   }

 }).done(function (response) {
			jQuery("#status-message").html('');
			jQuery("#zip-results").html(response);
        	hideOrDisableVAButtons(false);
})
    .done(function(){
        // form with hidden fields included in html response, values now used synchronously in this callback
     if(!jQuery("#state-va-data")) {return;}
     else {
       var hiddenData = jQuery("#state-va-data").serializeArray();
        if(hiddenData[0].value === "yes"){
            vso(hiddenData);
           }
         // buildVA is called during pagination next and prev; no statename arg passed, change nothing
        if(hiddenData[0].value === "no" && !statename){return;}
         // if no state CPT data found in server but statename arg passed, reset to empty html
        if(hiddenData[0].value === "no" && statename){jQuery('#vso-results').html('');}
         
        }
    
    })    
    .fail(function (errorThrown){
	hideOrDisableVAButtons(false);
	// error thrown from .fail will be from JQuery ajax error
		jQuery("#status-message").html(errorThrown.status + ' ' + errorThrown.statusText);})

};

const vso = (_stateArr) => {
    
    jQuery('#vso-results').html( 
       '<h2>Contact Information for your State Veterans Services Organization '+'('+'VSO' + ')' + ' office</h2>' + 
       
        '<p>Below is the contact information for the main State Veterans Service office for the state you searched:</p>' +
      
        '<h3>'+ _stateArr[1].value +'</h3>' +
        '<p>The state VSO website may also display information for various VSOs by county</p>' + 
        vso_helper(_stateArr[2].value, _stateArr[3].value) +
        '<p>Other contact info: <p>' +
        '<div>'+ _stateArr[4].value +'</div>'
         
    )
};

function vso_helper(webname, webaddr){
    if(webname && webaddr){
        return '<a href=" ' + webaddr + ' " target="_blank"  title="external link to '+ webname +' "> '+ webname +'</a>' +
            '<p>website address:  </p><a href=" ' + webaddr + ' " aria-hidden="true" target="_blank">' + webaddr + '</a>';
    }
    if(webname && !webaddr){
        return '<p>website name: '+ webname +'</p>' + '<p>no web address available</p>';
    }
    if(!webname && !webaddr){
        return '';
    }
    
}
//currently unused function, may incorporate at a later time for outputting Auntbertha results
/*const buildAuntBerta = (zip) => {
	var ab = document.getElementsByClassName('auntbertha');

	for (var i = 0; i < ab.length; i++) {
		let classlist = ab[i].classList;
		const url =`https://www.auntbertha.com/search/text?term=${classlist[0]}&postal=${zip}`;
		ab[i].innerHTML = `<a href="${url}" target="_blank">Find ${classlist[0]} resources near ${zip}
		<i class="fas fa-external-link-alt" aria-hidden="true"></i></a>`
		classlist.add("card-text")
	}
};*/



const getPage = (e) => {
	e.preventDefault();

  // href of anchor pagination cells initialized with url string from database response, now the target event
	let link = e.srcElement.attributes.href.value;
	if (link === '#') {
		e.preventDefault();
		return;
	}
	else{
	buildVa(link);}

};

function renderFormMenu(_states){
		let form = document.getElementById("zipForm");
		if(form){
			//use inline display: none; to hide form on initial page load.  This catches any errors in case JS file doesn't load
		form.removeAttribute("style");
		   }
		let selectState = document.getElementById("choose-state");
		if(selectState){
			var opt;
			_states.forEach(state => {
                // this is a rough way to eliminate the 2nd TX entry in the states obj
                if(state.min !== 75000){
			  opt = document.createElement("OPTION");
				// set value of each menu option to state abbreviation, from states array
				opt.setAttribute('value', state.code);
				opt.innerText = state.long;
				selectState.appendChild(opt); }

			})
			// initial state of form is for search by state
			enableFormInputs("state-only");
		}

}
function enableFormInputs(which){

	let statediv = document.getElementById("address2");
	let stateinput = document.getElementById("choose-state");

	let streetdiv = document.getElementById("address1");
	let streetinput = document.getElementById("street-address");
	let cityinput = document.getElementById("city");

	let zipdiv = document.getElementById("address3");
	let zipinput = document.getElementById("userZip");

	let zipOptions = document.getElementById("zip-options");
	let zipnearby = document.getElementById("zip-nearby");
	let zipwithin = document.getElementById("within-zip");

	switch(which) {
  case "state-only":

		statediv.classList.remove("va-hide");
		streetdiv.classList.add("va-hide");
		zipdiv.classList.add("va-hide");
		zipOptions.classList.add("va-hide");
		// when hiding the zip options div with va-hide, must remove va-radio-buttons which has display: flex
		zipOptions.classList.remove("va-radio-buttons");

    stateinput.removeAttribute("disabled");
		streetinput.setAttribute("disabled", true);
		cityinput.setAttribute("disabled", true);
		zipinput.setAttribute("disabled", true);
		zipnearby.setAttribute("disabled", true);
		zipwithin.setAttribute("disabled", true);

    break;
  case "zip-only":

	statediv.classList.add("va-hide");
	streetdiv.classList.add("va-hide");
	zipdiv.classList.remove("va-hide");
  zipOptions.classList.remove("va-hide");
	zipOptions.classList.add("va-radio-buttons");

	stateinput.setAttribute("disabled", true);
	streetinput.setAttribute("disabled", true);
	cityinput.setAttribute("disabled", true);
	zipinput.removeAttribute("disabled");
	zipnearby.removeAttribute("disabled");
	zipwithin.removeAttribute("disabled");
    break;

	case "full-address":

	statediv.classList.remove("va-hide");
	streetdiv.classList.remove("va-hide");
	zipdiv.classList.remove("va-hide");
	zipOptions.classList.add("va-hide");
	zipOptions.classList.remove("va-radio-buttons");

	stateinput.removeAttribute("disabled");
	cityinput.removeAttribute("disabled");
	streetinput.removeAttribute("disabled");
	zipinput.removeAttribute("disabled");
	zipnearby.setAttribute("disabled", true);
	zipwithin.setAttribute("disabled", true);

	cityinput.setAttribute("required", true);
	streetinput.setAttribute("required", true);
	zipinput.setAttribute("required", true);
  stateinput.setAttribute("required", true);

			break;
     default:
     break;
}


}

if(states !== undefined || states !== null){
 renderFormMenu(states.all);
}

