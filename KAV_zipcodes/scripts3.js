


//query.zipcode property set from zipcode form, 
// next task to store value in either cookie, or session, to persist across pages in the site

 const query = {zipcode: null};
//document.cookie = "zipcode=none";
//var cookie = document.cookie;


const url = document.location.href;

var queryUrl = '';

//if statement executes if query.zipcode value, or cookie value, is initialized on page load 
if(query.zipcode && !url.includes(query.zipcode)){
    
    queryUrl = new URL(url);
    let params = new URLSearchParams(queryUrl.search);
    params.set('zipcode', query.zipcode);
    document.location.replace(queryUrl + '?' + params); 
                                                   
    }

function cleanParamsfromUrl(urlstr){
    //deletes string after '?'
    var urlChars = urlstr.split('');
    var index = urlChars.indexOf("?");
    urlChars = urlChars.slice(0, index);
    return urlChars.join("");
    console.log(urlChars.join(""));
    
}



function inputZipcode(){
    
    var zipcodeValue = document.getElementById("zipcode_input").value;
    if(zipcodeValue){
        query.zipcode = zipcodeValue;
//        document.cookie = zipcodeValue

        
    let  queryUrl = new URL(document.location.href);
    let params = new URLSearchParams(queryUrl.search);
        
    if(params.get('zipcode')!== query.zipcode || !params.has('zipcode')){
        params.set('zipcode', query.zipcode);
        
    }
 
    document.location.href = cleanParamsfromUrl(queryUrl.toString()) + '?' + params;
    }
}


var zipcodeForm = document.getElementById("zipcode_button");

if(zipcodeForm){
zipcodeForm.addEventListener("click", inputZipcode); }

// add onChange event listenter to validate text input from user, for zipcode values only 


