
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
					var state = getStateAbbr(arr[1].value, states);
					vso(state);
					buildVa(createLinkState(arr[1].value.trim()));

				}
		}
		if(arr[1].name === "zipcode"){

			if(arr[1].value === ""){return alert("zipcode value is blank or invalid");}
			else if (isNaN(arr[1].value)){return alert("enter 5 digit zipcode with numbers only");}
			else {
					var state = getzipState(arr[1].value, states);
						if(arr[2].value === "within-zip"){
			  		vso(state);
				  	buildVa(createLinkZip(arr[1].value.trim())); }
					else {
							vso(state);
				  	queryNearby(createNearbyZipLink(arr[1].value.trim()));
					}
			}
		}

		if(arr[1].name === "address"){
			var state = getStateAbbr(arr[3].value, states);
			vso(state);
			 queryNearby(createNearbyLink(arr));
		}

};

//adds params for nearby with zip only query; other queries an empty string
const createNearbyZipLink = (zipStr) => {
let	link = 'https://api.va.gov/services/va_facilities/v0/nearby?street_address=na&city=na&state=na&zip=' + zipStr + '&drive_time=90';
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

const queryNearby = (_link) => {

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
	      nonce_data : the_ajax_script.nonce,
	   }
	 })
	 .done(function (response) {
			jQuery("#status-message").html('');
             //Va response contains facility id's in each Json array element
            let parsed = JSON.parse(response);
						// check for errors message, no data property, or no id property in first element of data array
						if(parsed.errors || !parsed.data){
							jQuery("#status-message").html(parsed.errors ? parsed.errors : 'server error'); return;
								}
						else if(!parsed.data[0].id){ jQuery("#status-message").html('no local VA facilities found'); return; }
						else{
						 // we may eventually need to store idArray values in DOM, for further querying of API
						 let idArray = parsed.data.map(el => {return el.id;});
			    	 let idStr = idArray.join(',');
             buildVa(createLinkIDs(idStr));
					}
	}).fail(function (errorThrown){
	jQuery("#status-message").html(errorThrown.status + ' ' + errorThrown.statusText);})
}

const buildVa = (_link) => {

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
			 getTable : "true",
       nonce_data : the_ajax_script.nonce,
   }

 }).done(function (response) {
			jQuery("#status-message").html('');
			jQuery("#zip-results").html(response);
     	hideOrDisableVAButtons(false);
}).fail(function (errorThrown){
	hideOrDisableVAButtons(false);
	// error thrown from .fail will be from JQuery ajax error
		jQuery("#status-message").html(errorThrown.status + ' ' + errorThrown.statusText);})

};

const vso = (_state) => {

if(_state){
	jQuery('#vso-results').html(
		'<p id="state-vet-link">Department of Veterans Affairs website for <a target="blank" href='+  _state.svao +'>'+ _state.long + '</a></p>'
	//	'<p><a href=" '+ _state.svao +' " target="_blank" aria-hidden="true">'+ _state.svao +'</a></p>'
	)

}
};
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
/*	let chunk = link.substring(
		link.lastIndexOf("state="),
		link.lastIndexOf("&page")
	)
var statechunk = chunk.split("=");
let stateAbbr = chunk.split("=")[1];
let fullstate = getFullState(stateAbbr, states);*/
	// use above code if need to extract state value from the url string!

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
			  opt = document.createElement("OPTION");
				// set value of each menu option to state abbreviation, from states array
				opt.setAttribute('value', state.code);
				opt.innerText = state.long;
				selectState.appendChild(opt);

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

var states = [
	{ min: 35000, max: 36999, code: "AL", long: "Alabama", svao: "https://va.alabama.gov/serviceofficer/" },
	{ min: 99500, max: 99999, code: "AK", long: "Alaska", svao: "http://veterans.alaska.gov/VSO" },
	{ min: 85000, max: 86999, code: "AZ", long: "Arizona", svao: "https://dvs.az.gov/contact-us" },
	{ min: 71600, max: 72999, code: "AR", long: "Arkansas", svao: "http://www.veterans.arkansas.gov/benefits" },
	{ min: 90000, max: 96699, code: "CA", long: "California", svao: "https://www.calvet.ca.gov/VetServices/pages/cvso-locations.aspx" },
	{ min: 80000, max: 81999, code: "CO", long: "Colorado", svao: "https://www.colorado.gov/pacific/vets/county-veterans-service-offices" },
	{ min: 6000, max: 6999, code: "CT", long: "Connecticut", svao: "https://portal.ct.gov/DVA/Pages/Office-of-Advocacy-and-Assistance/Contact" },
	{ min: 19700, max: 19999, code: "DE", long: "Delaware", svao: "https://vets.delaware.gov/service-officers/" },
	{ min: 32000, max: 34999, code: "FL", long: "Florida", svao: "https://floridavets.org/benefits-services/" },
	{ min: 30000, max: 31999, code: "GA", long: "Georgia", svao: "https://veterans.georgia.gov/services/benefits-assistance" },
	{ min: 96700, max: 96999, code: "HI", long: "Hawaii", svao: "http://dod.hawaii.gov/ovs/contact/" },
	{ min: 83200, max: 83999, code: "ID", long: "Idaho", svao: "http://www.veterans.idaho.gov/service-officers" },
	{ min: 60000, max: 62999, code: "IL", long: "Illinois", svao: "https://www2.illinois.gov/veterans/benefits/Pages/benefits-assistance.aspx" },
	{ min: 46000, max: 47999, code: "IN", long: "Indiana", svao: "https://www.in.gov/dva/2370.htm" },
	{ min: 50000, max: 52999, code: "IA", long: "Iowa", svao: "https://va.iowa.gov/counties" },
	{ min: 66000, max: 67999, code: "KS", long: "Kansas", svao: "https://kcva.ks.gov/veteran-services/office-locations" },
	{ min: 40000, max: 42999, code: "KY", long: "Kentucky", svao: "https://veterans.ky.gov/Benefits/fieldreps/Pages/default.aspx" },
	{ min: 70000, max: 71599, code: "LA", long: "Louisiana", svao: "https://www.vetaffairs.la.gov/locations/" },
	{ min: 3900, max: 4999, code: "ME", long: "Maine",svao: "https://www.maine.gov/veterans/" },
	{ min: 20600, max: 21999, code: "MD", long: "Maryland", svao: "https://veterans.maryland.gov/maryland-department-of-veterans-affairs-service-benefits-program/" },
	{ min: 1000, max: 2799, code: "MA", long: "Massachusetts", svao: "https://massvetsadvisor.org/" },
	{ min: 48000, max: 49999, code: "MI", long: "Michigan", svao: "https://www.michiganveterans.com/find-benefits-counselor" },
	{ min: 55000, max: 56999, code: "MN", long: "Minnesota", svao: "https://www.macvso.org/find-a-cvso.html" },
	{ min: 38600, max: 39999, code: "MS", long: "Mississippi", svao: "https://www.msva.ms.gov/serviceofficers" },
	{ min: 63000, max: 65999, code: "MO", long: "Missouri", svao: "https://mvc.dps.mo.gov/service/serviceofficer/" },
	{ min: 59000, max: 59999, code: "MT", long: "Montana", svao: "http://montanadma.org/montana-veterans-affairs" },
	{ min: 27000, max: 28999, code: "NC", long: "North Carolina", svao: "http://www.nc4vets.com/service-locator" },
	{ min: 58000, max: 58999, code: "ND", long: "North Dakota", svao: "http://www.nd.gov/veterans/service-officers" },
	{ min: 68000, max: 69999, code: "NE", long: "Nebraska", svao: "http://www.vets.state.ne.us/cvso.html" },
	{ min: 88900, max: 89999, code: "NV", long: "Nevada", svao: "http://veterans.nv.gov/benefits-and-services/veterans-service-officers/" },
	{ min: 3000, max: 3899, code: "NH", long: "New Hampshire", svao: "http://www.nh.gov/nhveterans/visitation/index.htm" },
	{ min: 7000, max: 8999, code: "NJ", long: "New Jersey", svao: "http://www.state.nj.us/military/veterans/programs.html" },
	{ min: 87000, max: 88499, code: "NM", long: "New Mexico", svao: "http://www.nmdvs.org/field-offices/" },
	{ min: 10000, max: 14999, code: "NY", long: "New York" , svao: "http://www.veterans.ny.gov/content/starting-claim"},
	{ min: 43000, max: 45999, code: "OH", long: "Ohio", svao: "https://dvs.ohio.gov/wps/portal/gov/dvs/what-we-do/find-a-cvso/" },
	{ min: 73000, max: 74999, code: "OK", long: "Oklahoma", svao: "https://okvets.ok.gov/find-a-service-officer/" },
	{ min: 97000, max: 97999, code: "OR", long: "Oregon", svao: "http://www.oregon.gov/odva/VSODIRECT/pages/locator.aspx" },
	{ min: 15000, max: 19699, code: "PA", long: "Pennsylvania", svao: "http://www.dmva.pa.gov/veteransaffairs/Pages/Outreach-and-Reintegration/County-Directors.aspx" },
	{ min: 300, max: 999, code: "PR", long: "Puerto Rico", svao: "https://www.benefits.va.gov/SanJuan/veterans-services-orgs.asp" },
	{ min: 2800, max: 2999, code: "RI", long: "Rhode Island", svao: "http://www.vets.ri.gov/contact/" },
	{ min: 29000, max: 29999, code: "SC", long: "South Carolina", svao: "https://scdva.sc.gov/claims-assistance" },
	{ min: 57000, max: 57999, code: "SD", long: "South Dakota", svao: "http://vetaffairs.sd.gov/veteransserviceofficers/locatevso.aspx" },
	{ min: 37000, max: 38599, code: "TN", long: "Tennessee", svao: "https://www.tn.gov/veteran/contact-us/state-veterans-services-offices.html" },
	{ min: 75000, max: 79999, code: "TX", long: "Texas", svao: "https://www.texvet.org/va-claims-assistance" },
	{ min: 88500, max: 88599, code: "TX", long: "Texas", svao: "https://www.texvet.org/va-claims-assistance" },
	{ min: 84000, max: 84999, code: "UT", long: "Utah", svao: "http://veterans.utah.gov/va-benefits-claims-assistance/" },
	{ min: 5000, max: 5999, code: "VT", long: "Vermont", svao: "http://veterans.vermont.gov/special/vso" },
	{ min: 22000, max: 24699, code: "VA", long: "Virginia", svao: "https://www.dvs.virginia.gov/dvs/locations" },
	{ min: 20000, max: 20599, code: "DC", long: "Washington DC", svao: "https://www.dvs.virginia.gov/dvs/locations" },
	{ min: 98000, max: 99499, code: "WA", long: "Washington", svao: "https://www.dva.wa.gov/resources/county-map" },
	{ min: 24700, max: 26999, code: "WV", long: "West Virginia", svao: "http://www.veterans.wv.gov/field-office/Pages/default.aspx" },
	{ min: 53000, max: 54999, code: "WI", long: "Wisconsin", svao: "http://wicvso.org/locate-your-cvso/" },
	{ min: 82000, max: 83199, code: "WY", long: "Wyoming", svao: "http://wyomilitary.wyo.gov/veterans/service-officers/" },
];

const getzipState = (zip, _states) => {
	var state = _states.filter(function (s) {
		return s.min <= zip && s.max >= zip;
	});
// unlikely event of bad values entered
	if (state.length == 0) {
		return false;
	} else if (state.length > 1) {
	  return false;
	}
	else {
	return { code: state[0].code, long: state[0].long, svao: state[0].svao };}
};

const getStateAbbr = (abbr, _states) => {

  	let state = _states.filter(function (s) {
  		return s.code === abbr;
  	});
  // in unlikely event of bad state abbreviation value passed in, returns false or empty string
  	if (state.length == 0) {
  		return false;
  	} else if (state.length > 1) {
  		return false;
  	}
  	else{

   return { code: state[0].code, long: state[0].long, svao: state[0].svao };
   }
};
