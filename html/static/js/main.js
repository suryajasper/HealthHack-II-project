var somethingWentWrong = false;
var parent = document.getElementById("stuff");
var brandedParent = document.getElementById("branded");
var foodDict = {};
var eatHistory = [];
var vegetables = "amaranth leaves/arrowroot/artichoke/arugula/asparagus/bamboo shoots/green beans/beets/belgian endive/bitter melon/bok choy/broadbeans/broccoli/broccoli rabe/brussel sprouts/green cabbage/red cabbage/carrot/cassava/cauliflower/celeriac/celery/chayote/chicory/collards/corn/crookneck/cucumber/daikon/dandelion greens/eggplant/fennel/fiddleheads/ginger root/horseradish/jicama/kale/kohlrabi/leeks/iceberg lettuce/leaf lettuce/mushrooms/mustard greens/okra/onion/parsnip/peas/pepper/potato/pumpkin/radicchio/radishes/rutabaga/salsify/shallots/snow peas/sorrel/spaghetti squash/spinach/squash/sugar snap peas/sweat potato/swiss chard/tomatillo/tomato/turnip/watercress/yam root/zucchini";
var fruits = "acerola/apple/apricot/avocado/banana/blackberry/blackcurrant/blueberry/breadfruit/cantaloupe/carambola/cherimoya/cherry/clementine/coconut/cranberry/custard-apple/date/durian/elderberry/feijoa/figs/gooseberry/grapefruit/grape/guava/honeydew melon/jackfruit/java plum/jujube fruit/kiwi/kumquat/lemon/longan/loquat/lychee/mandarin/mango/mangosteen/mulberry/nectarine/olive/orange/papaya/passion fruit/peaches/pear/persimmon/pitaya/pineapple/pitanga/plantain/plum/pomegranate/prickly pear/prune/pummelo/quince/raspberry/rhubarb/rose apple/sapodilla/sapote/soursop/strawberry/sugar apple/tamarind/tangerine/watermelon";
var dairy = "Baked Milk/Bulgarian Yogurt/Butter/Buttermilk/Camel Milk/Cheese/Cornish Clotted Cream/Condensed Milk/Cottage Cheese/Cream/Cream Cheese/Curd/Custard/Evaporated Milk/Frozen Custard/Frozen Yoghurt/Gelato/Goat's Milk/Horse Milk/Ice Cream/Ice Milk/Kefir/Khoa/Kulfi/Kumiss/Lassi/Milk/Moose Milk/Paneer/Pomazankove Maslo/Powdered Milk/Processed Cheese/Reindeer Milk/Ryazhenka/Semifreddo/Sheep's Milk Yogurt/Soft Serve/Sour Cream/Strained Yogurt/Whipped Cream/Yogurt";
var grain = "Amaranth/Barley/Brown Rice/Brown Rice Bread/Brown Rice Tortilla/Buckwheat/Cracked Wheat/Farro/Flaxseed/Millet/Oats/Oat Bread/Oat Cereal/Oatmeal/Popcorn/Whole Wheat Cereal Flakes/Muesli/Rolled Oats/Quinoa/Rye/Sorghum/Spelt/Teff/Triticale/Whole Grain Barley/Wheat Berries/Whole Grain Cornmeal/Whole Rye/Whole Wheat Bread/Whole Wheat Couscous/Whole Wheat Crackers/Whole Wheat Pasta/Whole Wheat Pita Bread/Whole Wheat Sandwich Buns And Rolls/Whole Wheat Tortillas/Wild Rice/Cornbread/Corn Tortillas/Couscous/Crackers/Flour Tortillas/Grits/Noodles/Spaghetti/Macaroni";
var meats = "Anchovy/Bacon/Beef/Buffalo/Caribou/Catfish/Chicken/Clams/Cod/Cornish Game Hen/Crab/Duck/Eel/Emu/Goat/Goose/Grouse/Halibut/Ham/Kangaroo/Lamb/Lobster/Mackerel/Mahi Mahi/Octopus/Ostrich/Oysters/Pheasant/Pork/Quail/Rabbit/Salmon/Sardines/Scallops/Shark/Shrimp/Snake/Squab/Squid/Swordfish/Tilapia/Tuna/Turkey/Veal/Venison/Anasazi Beans/Black Beans/Black-Eyed Peas/Butter Beans/Cannellini Beans/Flageolet Beans/Garbanzo Beans/Chickpeas/Desi/Bengal Gram/Chana Dal/Great Northern Beans/Kidney Beans/Lentils/Lupini Beans/Marrow Beans/Moth Beans/Mung Beans/Navy Beans/Pigeon Pea/Pink Beans/Pinto Beans/Rice Beans/Scarlet Runner Beans/Soybean/Soya Bean/Spanish Tolosana Beans/Split Peas";

var filters = [document.getElementById("fruits"), document.getElementById("vegetables"),document.getElementById("grains"),document.getElementById("dairy"),document.getElementById("meat/beans")];

var itemIn = document.getElementById("itemIn");
var searchButton = document.getElementById("searchButton");

var filterTable = document.getElementById("filterTable");

var firebaseConfig = {
  apiKey: "AIzaSyC6BBIddvML8T57p5wRnM66Bh2iPCLJayM",
  authDomain: "advanced-dieting.firebaseapp.com",
  databaseURL: "https://advanced-dieting.firebaseio.com",
  projectId: "advanced-dieting",
  storageBucket: "advanced-dieting.appspot.com",
  messagingSenderId: "1040427605146",
  appId: "1:1040427605146:web:951764d0785b5292f89323",
  measurementId: "G-KD9YWTH1CS"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();
var rootUser = database.ref("users");

showAuth();

searchButton.onclick = function() {
  var rawFilters = [];
  for (var i = 0; i < filters.length; i++) {
    if (filters[i].checked) {
      rawFilters.push(filters[i].value);
      searchFor(filters[i].value);
    }
  }
  if (itemIn.value != "") {
    searchFor(itemIn.value);
  }
}

function hideOrShowFilters() {
  console.log("HERE");
  if (filterTable.style.visibility === "collapse") {
    filterTable.style.visibility = "visible";
  }
  else {
    filterTable.style.visibility = "collapse";
  }
}

async function getInfoSpecific(rawItem, isCommon) {
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "https://trackapi.nutritionix.com/v2/natural/nutrients", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  var userID = somethingWentWrong ? "987cfd3d" : "48455876";
  var userKey = somethingWentWrong ? "af94bd50dcd0de267ab673e08e4cd649" : "060a6724c37307eaf9836fbd94ea6195";
  xhttp.setRequestHeader("x-app-id", userID);
  xhttp.setRequestHeader("x-app-key", userKey);
  xhttp.setRequestHeader("x-remote-user-id", "0");
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState>3 && xhttp.status==200) {
      searched(xhttp.responseText, isCommon);
    }
  };
  xhttp.send('{"query":"'+rawItem+'","timezone": "US/Western"}');
}

function processInfoJSON(json) {
  console.log(json);
  var common = json["common"];
  var branded = json["branded"];

  var foodRawArr = "";
  var brandedArr = "";

  for (var i = 0; i < common.length; i++) {
    var foodName = common[i].food_name;
    foodRawArr += foodName + "/";
  }
  for (var i = 0; i < branded.length; i++) {
    var foodName = branded[i].food_name;
    brandedArr += foodName + "/";
  }

  getInfoSpecific(foodRawArr, true);
  getInfoSpecific(brandedArr, false);
}

async function getInfo(rawItem, debugMode) {

  var userID = somethingWentWrong ? "987cfd3d" : "48455876";
  var userKey = somethingWentWrong ? "af94bd50dcd0de267ab673e08e4cd649" : "060a6724c37307eaf9836fbd94ea6195";

  const response = await axios.get(('https://trackapi.nutritionix.com/v2/search/instant?query=' + rawItem), {
    headers: {
      'x-app-id': userID,
      'x-app-key': userKey,
    }
  });

  processInfoJSON(response["data"]);
}


function sendToServer(item) {
  /*
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/eatHistory", true);
  xhttp.send(JSON.stringify(item));
  */
  var userId = firebase.auth().currentUser.uid;

  var postData = item;

  var updates = {};

  updates['/eatHistory/' + userId + '/' + item.name] = postData;

  firebase.database().ref().update(updates);
}

/*
function getFromServer() {
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/userPreferences", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState>3 && xhttp.status==200) {
      var json = JSON.parse(xhttp.responseText);
      var toLose = json[1];
      var toGain = json[2];
    }
  };
}*/

function searchFor(food) {
  if (food === "fruits") {
    var json = getInfo(fruits, true);
  }
  else if (food === "vegetables") {
    var json = getInfo(vegetables, true);
  }
  else if (food === "dairy") {
    var json = getInfo(dairy, true);
  }
  else if (food === "grains") {
    var json = getInfo(grain, true);
  }
  else if (food === "meat/beans") {
    var json = getInfo(meats, true);
  }
  else {
    var json = getInfo(food, true);
  }
}
function addToDictionary(food) {
  tempFood = new Food(food["food_name"]);
  tempFood.setCalories(food["nf_calories"]);
  tempFood.setCholesterol(food["nf_cholesterol"]);
  tempFood.setDietaryFiber(food["nf_dietary_fiber"]);
  tempFood.setPotassium(food["nf_potassium"]);
  tempFood.setProtein(food["nf_protein"]);
  tempFood.setSatFat(food["nf_saturated_fat"]);
  tempFood.setSodium(food["nf_sodium"]);
  tempFood.setSugar(food["nf_sugars"]);
  tempFood.setCarb(food["nf_total_carbohydrate"]);
  tempFood.setFat(food["nf_total_fat"]);
  tempFood.setImage(food["photo"]["highres"]);
  tempFood.setServingQuantity(food["serving_qty"]);
  var intfoodgroup = food["tags"]["food_group"];
  var realfoodgroup = null;
  var temparr = ["Dairy", "Protein", "Fruit", "Vegetable", "Grain"];
  if (intfoodgroup > 5)
    realfoodgroup = "Other";
  else {
    realfoodgroup = temparr[intfoodgroup-1];
  }
  tempFood.setFoodGroup(realfoodgroup);
  console.log(tempFood.foodGroup);
  foodDict[food["food_name"]] = tempFood;
}
function createButton(item_name, item) {
  var cell = document.createElement('div');
  cell.classList.add( "col-xs-6" );
  cell.classList.add( "col-sm-4" );
  cell.classList.add( "col-lg-3" );
  cell.classList.add( "cellFormat" );

  var well = document.createElement('div');
  well.classList.add('well');

  var button = document.createElement('button');
  var link = document.createTextNode(item_name + " details");
  button.appendChild(link);

  var image = document.createElement("IMG");
  image.src = foodDict[item_name].img;
  image.onclick = function() {
    window.location = '../templates/foodDetails.html?foodName='+item_name;
  };
  well.appendChild( image );

  var br = document.createElement('br');
  well.appendChild(br);

  var eatButton = document.createElement('button');
  var eatText = document.createTextNode("eat " + item_name);
  eatButton.appendChild(eatText);
  eatButton.style.display = "inline-block";

  eatButton.onclick = function() {
    eatHistory.push(foodDict[item_name]);
    console.log(foodDict[item_name].foodGroup);
    sendToServer(foodDict[item_name]);
  }
  well.appendChild( eatButton );

  button.onclick = function() {
    var fid = foodDict[item_name];

    var namesOfVars = ["calories", "cholesterol", "dietary fibers", "potassium", "protein", "saturated fat", "sodium", "sugar", "carb", "total fat"];
    var thingsToAdd = [fid.cal, fid.cholesterol, fid.dietaryfiber, fid.potassium, fid.protein, fid.satFat, fid.sodium, fid.sugar, fid.carb, fid.fat, fid.servingQty];

    for (var i = 0; i < namesOfVars.length; i++) {
      var h4 = document.createElement("h4");
      let measurement = namesOfVars[i] === "calories"? "cal" : (namesOfVars[i]==="potassium" || namesOfVars[i]==="sodium")?"mg":"g";
      h4.innerHTML = (namesOfVars[i] + ": " + thingsToAdd[i].toString() + measurement);
      button.parentNode.insertBefore(h4, button.nextSibling);
    }
  }

  button.style.display = "inline-block";
  well.appendChild(button);

  cell.appendChild(well);

  return cell;
}
function eraseResults() {
  while (parent.firstNode) {
    parent.removeChild(parent.firstNode);
  }
}

function searched(json, isCommon) {
  if (json != undefined) {
    eraseResults();
    console.log(json);
    json = JSON.parse(json);
    console.log(json);
    for (var i = 0; i < json["foods"].length; i++) {
      var item_name = json["foods"][i]["food_name"];
      if (json["foods"][i]["photo"]["highres"] != undefined) {
        addToDictionary(json["foods"][i]);
        var cell = createButton(item_name);
        if (isCommon) {
          parent.appendChild(cell);
        }
        else {
          brandedParent.appendChild(cell);
        }
      }
    }
    console.log(foodDict);
  }
}
