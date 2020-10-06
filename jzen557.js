const NEWS_ITEM_LIST_ID = "news"
let userNameLog="";
let userPasswordLog="";
let logIn="false";




function request(url, payload) {
    return new Promise(function (resolve, reject) {
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var result = this.responseText;
                if (payload["json"]) {
                    result = JSON.parse(this.responseText);
                }
                resolve(result);
            }
        };
        xhttp.open(payload["Method"], url, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.send(JSON.stringify(payload["Data"]));
    });
}

function postUserCrentials(){
         
    let userName = document.getElementById("userName").value;
    let passWord = document.getElementById("userPassword").value;
    let passwordAgain= document.getElementById("userPasswordAgain").value;
    if (passWord!=passwordAgain){
        document.getElementById("info").innerHTML="The password you re-entered is not the same as the password you enter first, please make sure they are same";
    }
    else if (passWord==""){
        document.getElementById("info").innerHTML="Password can't be empty";
    }
    else{
        let xhr = new XMLHttpRequest();
        const uri="http://localhost:8188/DairyService.svc/register";
        xhr.open("POST", uri, true);
        xhr.onload = () =>{      
            document.getElementById("info").innerHTML=xhr.responseText;

        }
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        let userDetail = JSON.stringify({Name:userName, Password: passWord});
        
        xhr.send(userDetail);

    }
   

 
}








function fetchAndBuildNewsNodes() {
    fetchNews().then(function (value) {
        buildAllNewNodes(value, NEWS_ITEM_LIST_ID);
    });
}

function fetchNews() {
    const url = "http://localhost:8188/DairyService.svc/news";

    const payload = {
        "Method": "GET",
        "json": true
    };

    return request(url, payload);
}

function buildAllNewNodes(newsList, parentNodeId) {
    for (var i = 0; i < newsList.length; i++) {
        var item = newsList[i];
        buildNewsNode(item, parentNodeId);
    }
}

function buildNewsNode(newItem, parentNodeId) {
    let newsParent = document.getElementById(parentNodeId);

    // container
    let divNode = document.createElement("div");
    divNode.setAttribute('id', newItem['guidField']);
    divNode.setAttribute('class', 'post');

    // link
    let anchorNode = document.createElement("a");
    anchorNode.setAttribute('href', newItem['linkField']);

    // title
    let h3Node = document.createElement("h3");
    let titleNode = document.createTextNode(newItem["titleField"]);
    h3Node.setAttribute('class', 'title');
    h3Node.appendChild(titleNode);

    // image
    let imgNode = document.createElement("img");
    imgNode.setAttribute('src', newItem['enclosureField']['urlField']);

    // description
    let pNode = document.createElement("p");
    let descNode = document.createTextNode(newItem["descriptionField"]);
    pNode.setAttribute('class', 'description');
    pNode.appendChild(descNode);

    // public date
    let spanNode = document.createElement("span");
    spanNode.setAttribute('class', 'publishDate');
    let dateNode = document.createTextNode("Published on " + newItem["pubDateField"]);
    spanNode.appendChild(dateNode);



    anchorNode.appendChild(h3Node);
    anchorNode.appendChild(imgNode);
    divNode.appendChild(anchorNode);

    divNode.appendChild(pNode);
    divNode.appendChild(spanNode);

    newsParent.appendChild(divNode);
}






function sendComment(name, comment, callback) {
    const url = "http://localhost:8188/DairyService.svc/comment?name=" + name;
    const payload = {
        "Method": "POST",
        "Data": comment
    };

    request(url, payload).then(callback);
}



function submitCommentForm(formId, iframeOfCommentsId) {
    const fields = jsonTransfer(formId);
        sendComment(fields.name, fields.comment, function (values) {
            //After comment is submitted, we reload the iframe
            if (iframeOfCommentsId != null)
                reloadIFrame(iframeOfCommentsId);
        });
        formTransfer(formId);
    

}



/* jsonTransfer function transfer form to a json object
*/
function jsonTransfer(formId) {
    const formElement = document.getElementById(formId);
    let formObj = {};

    for (let i = formElement.elements.length - 1; i >= 0; i = i - 1) {
        let currentElement = formElement.elements[i];
        if (currentElement.name == null || currentElement.name === "")
            continue;
        formObj[currentElement.name] = currentElement.value;
    }
    return formObj;
}

/*formTransfer transfer json object back to form
*/

function formTransfer(formId) {
    const formElement = document.getElementById(formId);
    for (var i = formElement.elements.length - 1; i >= 0; i = i - 1) {
        var currentElement = formElement.elements[i];
        if (currentElement.name == null || currentElement.name === "")
            continue;
        currentElement.value = "";
    }
}

function reloadIFrame(iframeId) {
    document.getElementById(iframeId).src = document.getElementById(iframeId).src;
}









/*
function formComment(){
    let name=document.getElementById("customerNameInput").value;
    let comment=document.getElementById("customerTextArea").value;
    document.getElementById("newComment").innerhtml=name+"--"+comment;
}
*/



const extractInformation = (data) => {
  //console.log(data);
   const sentenceArray=data.split("\n");

   const phoneNumberArray=sentenceArray[3].split(":");
   const phoneNumber=phoneNumberArray[1];
    
   const addressArray=sentenceArray[4].split(";");
   const address=addressArray[4];

   const emailArray=sentenceArray[5].split(":");
   const email=emailArray[1];

   let content="<a href=adr:"+address+">" +address+"</a>"+"<br>";
   content+="<a href=mailto:" + email +">"+ email+"</a>"+"<br>";
   content+="<a href=tel:" + phoneNumber+ ">"+phoneNumber+"</a>"+"<br>";
   content+="<a href="+"http://localhost:8188/DairyService.svc/vcard>"+"add us to your address book</a>";
  

   document.getElementById("information").innerHTML=content;


}
const getVcard = () => {
    const fetchPromise = fetch("http://localhost:8188/DairyService.svc/vcard");
   
   const streamPromise = fetchPromise.then((response) => response.text());

    streamPromise.then((data) => extractInformation(data));

}




const showFilteredResult= () => {
    let x = document.getElementById("userInput").value;

    getFilteredProducts(x);


}



const showProductDetail = (products) => {

   // console.log(products);
  


    const productTable = document.getElementById("productTable");
    let tableContent = "<tr><th>" + "Product Image" + "</th><th>" + "Product Detail" + "</th></tr>";



    const addProducts = (product) => {
        let imageUrl = "http://localhost:8188/DairyService.svc/itemimg?id=" + product.ItemId.toString();
      

        tableContent += "<tr><td>" + "<img src=" + imageUrl + ">" + "</td><td>" + product.Title + "<br>" + "Origin: " + product.Origin +
         "<br>" + "Type: " + product.Type + "<br>" + "Price: " + product.Price+"<br>" + "<button onclick=buyProductWithCredential("+product.ItemId+")"+">buy now</button>"+"</td></tr>" ;
         
         //<button onclick="myFunction()">Click me</button>;

     
       


    }
    products.forEach(addProducts);

    productTable.innerHTML = tableContent;
}

/*

buy product
*/





const buyProduct = (id) => {
  
   
    //alert("buy now");
    
    //const xhr= new XMLHttpRequest();
    
    const uri="http://localhost:8189/Service.svc/buy?id="+id;
    window.open(uri);
   /* xhr.open("GET", uri, true);
    xhr.onload = () => {
        alert(xhr.responseText);
        ID=xhr.responseText;
    }
    xhr.send(null);
    */

    
}

const buyProductWithCredential=(id) =>{
    if (userNameLog==""||userPasswordLog==""){
        alert("please log in first");
        showLog();
  
    }
    else{
    
    const xhr=new XMLHttpRequest();
    
    const uri="http://localhost:8189/Service.svc/buy?id="+id;
    xhr.open("GET", uri, true, userNameLog, userPasswordLog); xhr.withCredentials=true;
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onload = () => {
        let value=xhr.responseText;
        value = value.replace(/\"/g, "");
        alert(value);
        
        
    }
    xhr.send(null);
}
    

}























    /*

    const fetchPromise = fetch("http://redsox.uoa.auckland.ac.nz/dsa/Service.svc/id", {
        headers: {
            'Accept': 'application/json'
        }
    });
    const streamPromise = fetchPromise.then((response) => response.json());

    streamPromise.then((id) => {
         alert(id);
    });
    /*

    const fetchPromise2=fetch("http://redsox.uoa.auckland.ac.nz/dsa/Service.svc/buy?id="+ID, {
        headers: {
            'Accept': 'application/json'
        }
    });

    const streamPromise2 = fetchPromise2.then((response2)=>response2.json());

    streamPromise2.then((info)=>alert(info));
    */
    












const getProducts = () => {
    const fetchPromise = fetch("http://localhost:8188/DairyService.svc/items", {
        headers: {
            'Accept': 'application/json'
        }
    });
    const streamPromise = fetchPromise.then((response) => response.json());

    streamPromise.then((j) => showProductDetail(j));


}


const getFilteredProducts = (userInput) => {
    let url = "http://localhost:8188/DairyService.svc/search?term=" + userInput.toString();

    const fetchPromise = fetch(url, {
        headers: {
            'Accept': 'application/json'
        }
    });
    const streamPromise = fetchPromise.then((response) => response.json());

    streamPromise.then((j) => showProductDetail(j));
}



const showHome = () => {
    document.getElementById("Home").style.display = "block";
    document.getElementById("Products").style.display = "none";
    document.getElementById("Location").style.display = "none";
    document.getElementById("News").style.display = "none";
    document.getElementById("GuestBook").style.display = "none";
    document.getElementById("Registration").style.display="none";
    document.getElementById("Log").style.display="none";

    document.getElementById("HomeTap").style.backgroundColor = "RoyalBlue";
    document.getElementById("ProductsTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("LocationTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("NewsTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("GuestBookTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("RegistrationTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("LogTap").style.backgroundColor="DodgerBlue";

}
const showProducts = () => {
    document.getElementById("Home").style.display = "none";
    document.getElementById("Products").style.display = "block";
    document.getElementById("Location").style.display = "none";
    document.getElementById("News").style.display = "none";
    document.getElementById("GuestBook").style.display = "none";
    document.getElementById("Registration").style.display="none";
    document.getElementById("Log").style.display="none";

    document.getElementById("HomeTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("ProductsTap").style.backgroundColor = "RoyalBlue";
    document.getElementById("LocationTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("NewsTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("GuestBookTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("RegistrationTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("LogTap").style.backgroundColor="DodgerBlue";
    window.onload = getProducts;

}
const showLocation = () => {
    document.getElementById("Home").style.display = "none";
    document.getElementById("Products").style.display = "none";
    document.getElementById("Location").style.display = "block";
    document.getElementById("News").style.display = "none";
    document.getElementById("GuestBook").style.display = "none";
    document.getElementById("Registration").style.display="none";
    document.getElementById("Log").style.display="none";

    document.getElementById("HomeTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("ProductsTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("LocationTap").style.backgroundColor = "RoyalBlue";
    document.getElementById("NewsTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("GuestBookTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("RegistrationTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("LogTap").style.backgroundColor="DodgerBlue";
}
const showNews = () => {
    document.getElementById("Home").style.display = "none";
    document.getElementById("Products").style.display = "none";
    document.getElementById("Location").style.display = "none";
    document.getElementById("News").style.display = "block";
    document.getElementById("GuestBook").style.display = "none";
    document.getElementById("Registration").style.display="none";
    document.getElementById("Log").style.display="none";

    document.getElementById("HomeTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("ProductsTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("LocationTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("NewsTap").style.backgroundColor = "RoyalBlue";
    document.getElementById("GuestBookTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("RegistrationTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("LogTap").style.backgroundColor="DodgerBlue";
}


const showGuestBook = () => {
    document.getElementById("Home").style.display = "none";
    document.getElementById("Products").style.display = "none";
    document.getElementById("Location").style.display = "none";
    document.getElementById("News").style.display = "none";
    document.getElementById("GuestBook").style.display = "block";
    document.getElementById("Registration").style.display="none";
    document.getElementById("Log").style.display="none";

    document.getElementById("HomeTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("ProductsTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("LocationTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("NewsTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("GuestBookTap").style.backgroundColor = "RoyalBlue";
    document.getElementById("RegistrationTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("LogTap").style.backgroundColor="DodgerBlue";

}

const showRegistration = () => {
    document.getElementById("Home").style.display = "none";
    document.getElementById("Products").style.display = "none";
    document.getElementById("Location").style.display = "none";
    document.getElementById("News").style.display = "none";
    document.getElementById("GuestBook").style.display = "none";
    document.getElementById("Registration").style.display="block";
    document.getElementById("Log").style.display="none";

    document.getElementById("HomeTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("ProductsTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("LocationTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("NewsTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("GuestBookTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("RegistrationTap").style.backgroundColor = "RoyalBlue";
    document.getElementById("LogTap").style.backgroundColor="DodgerBlue";

}

const showLog = () => {
    document.getElementById("Home").style.display = "none";
    document.getElementById("Products").style.display = "none";
    document.getElementById("Location").style.display = "none";
    document.getElementById("News").style.display = "none";
    document.getElementById("GuestBook").style.display = "none";
    document.getElementById("Registration").style.display="none";
    document.getElementById("Log").style.display="block";

    document.getElementById("HomeTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("ProductsTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("LocationTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("NewsTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("GuestBookTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("RegistrationTap").style.backgroundColor = "DodgerBlue";
    document.getElementById("LogTap").style.backgroundColor="RoyalBlue";


}



const storeUserCrentials = () => {
     userNameLog=document.getElementById("userNameLog").value;
     userPasswordLog=document.getElementById("userPasswordLog").value;
     if (userNameLog==""||userPasswordLog==""){
        document.getElementById("infoDisplay").innerHTML="your username or password can not be empty";
     }
     else{
        const uri = "http://localhost:8189/Service.svc/user";
        const xhr = new XMLHttpRequest();
        xhr.open("GET", uri, true, userNameLog, userPasswordLog); xhr.withCredential=true;
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onload = function() { // Call a function when the state changes.
           if (this.readyState === XMLHttpRequest.DONE && this.status === 401) {
               document.getElementById("infoDisplay").innerHTML="Your credentials are wrong, please provide right credentials";
               //alert("please provide right crendentials");
               userNameLog.value="";
               userPasswordLog.value="";
           }
           else {
               //alert(xhr.responseText);
               document.getElementById("infoDisplay").innerHTML="you have successfully logged in";
               document.getElementById("logHeader").innerHTML="Welcome "+userNameLog;
               document.getElementById("log").style.display="none";
               //alert("you have successfully logged in");
           }
       }
         
       xhr.send(null);
     }
     //check if the credential is right or not
     


}

const logout = () => {
    document.getElementById("userNameLog").value="";
    document.getElementById("userPasswordLog").value="";
    userNameLog="";
    userPasswordLog="";

    document.getElementById("logHeader").innerHTML="please provide your name and password to log in";
    document.getElementById("infoDisplay").innerHTML="";
    document.getElementById("inform").innerHTML="";
    document.getElementById("log").style.display="block";
    

}

     
     
     





/*
function register() {
    let form = document.getElementById('RegisterForm');

    
        var userName = document.getElementById('userName');
        var passWord = document.getElementById('userPassword');

        fetch("http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/register", {
            method: 'POST',
            body: 'data'
            })
            
        
        .then(results => results.json())
        .then(console.log);

    }

window.onload=register();
*/
window.onload=fetchAndBuildNewsNodes();

window.onload = getProducts();
window.onload=getVcard();
window.onload=showHome();




/*
JSON.stringify({
    Address: "any",
    Name: userName,
    Password: passWord

*/



