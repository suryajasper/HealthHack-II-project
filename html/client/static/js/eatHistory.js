var socket = io();
initializeFirebase();

var parent = document.getElementById('stuff');

function replaceAll(string, part, newPart) {
  string = string.replace(part, newPart);
  while (string.indexOf(part) !== -1) {
    string = string.replace(part, newPart);
  }
  return string;
}

function clamp(x, a, b) {
  return Math.min(Math.max(x, a), b);
}

function graceClamp(x, grace) {
  return (clamp(x, 0.5, grace)/grace - 0.5/grace) / (1-0.5/grace);
}

function rgbToString(rgb) {
  return 'rgb(' + rgb.r.toString() + ',' + rgb.g.toString() + ',' + rgb.b.toString() + ')';
}

function isGood(food, byAmount) {
  var goodTotal = 0, badTotal = 0;

  if (byAmount) {
    for (var good of food.good) {
      var amount = good.amount;
      if (amount.replace(/[0-9]/g, '') === 'g') {
        goodTotal += parseFloat(amount.replace( /\D/g, ''));
      } else if (amount.replace(/[0-9]/g, '') === 'mg') {
        goodTotal += parseFloat(amount.replace( /\D/g, ''))/1000;
      } else if (amount.replace(/[0-9]/g, '') === 'µg') {
        goodTotal += parseFloat(amount.replace( /\D/g, ''))/1000000;
      }
    }

    for (var bad of food.bad) {
      var amount = bad.amount;
      if (amount.replace(/[0-9]/g, '') === 'g') {
        badTotal += parseFloat(amount.replace( /\D/g, ''));
      } else if (amount.replace(/[0-9]/g, '') === 'mg') {
        badTotal += parseFloat(amount.replace( /\D/g, ''))/1000;
      } else if (amount.replace(/[0-9]/g, '') === 'µg') {
        badTotal += parseFloat(amount.replace( /\D/g, ''))/1000000;
      }
    }
  } else {
    for (var good of food.good) {
      goodTotal += parseInt(good.percentOfDailyNeeds);
    }
    for (var bad of food.bad) {
      badTotal += parseInt(bad.percentOfDailyNeeds);
    }
  }

  console.log(goodTotal + ' ' + badTotal);

  return badTotal / goodTotal;
}

var goodrgb = {r: 56, g: 166, b: 90};
var badrgb = {r: 166, g: 72, b: 56};

function proportionToRGB(number) {
  number = graceClamp(number, 4);
  console.log(number);
  var _r = goodrgb.r + (badrgb.r - goodrgb.r)*number;
  var _g = goodrgb.g + (badrgb.g - goodrgb.g)*number;
  var _b = goodrgb.b + (badrgb.b - goodrgb.b)*number;
  return {r: _r, g: _g, b: _b};
}

firebase.auth().onAuthStateChanged(function(user) {
  showAuth();
  var id = user.uid;
  socket.emit('getEatHistory', id);
  socket.on('eatHistoryRes', function(history) {
    console.log(history);
    for (var date of Object.keys(history).reverse()) (function(date) {
      var dateheading = document.createElement('h3');
      dateheading.style.display = 'block';
      dateheading.style.color = 'rgb(0, 0, 0)';
      dateheading.innerHTML = replaceAll(date, ' ', '/');
      parent.appendChild(dateheading);

      var ul = document.createElement('ul');
      for (var food of Object.values(history[date])) (function(food) {
        if (food !== null) {
          var li = document.createElement('li');
          li.style.display = 'block';

          var sectDiv = document.createElement('div');
          sectDiv.classList.add('eatHistorySect');
          sectDiv.style.backgroundColor = rgbToString(proportionToRGB(isGood(food, true)));

          var p = document.createElement('p');
          p.style.color = "rgb(52, 52, 52)";
          p.style.display = 'inline-block';
          p.classList.add('alignleft');
          p.innerHTML = food.name;
          sectDiv.appendChild(p);

          var deleteButton = document.createElement('button');
          deleteButton.classList.add('alignright');
          deleteButton.classList.add('eatHistoryDelete');
          deleteButton.innerHTML = 'Remove';
          deleteButton.onclick = function() {
            socket.emit('removeFromEatHistory', id, date, food);
            li.remove();
          }
          sectDiv.appendChild(deleteButton);

          var clearDiv = document.createElement('div');
          clearDiv.style.clear = 'both';
          sectDiv.appendChild(clearDiv);

          li.appendChild(sectDiv);
          ul.appendChild(li);
        }
      })(food)
      parent.appendChild(ul);
    })(date)
  })
})
