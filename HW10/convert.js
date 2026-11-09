
window.addEventListener("DOMContentLoaded", domLoaded);

function domLoaded() {
   const cInput = document.getElementById("cInput");
   const fInput = document.getElementById("fInput");
   const errorMessage = document.getElementById("errorMessage");
   const weatherImage = document.getElementById("weatherImage");

   cInput.addEventListener("input", function() {
      fInput.value = "";
   });
   fInput.addEventListener("input", function() {
      cInput.value = "";
   });
   document.getElementById("convertButton").addEventListener("click", function() {
      let fahrenheit;
      let input;

      if (cInput.value !== "") {
         input = cInput.value;
         fahrenheit = convertCtoF(parseFloat(input));
         fInput.value = fahrenheit;
      }
      else {
         input = fInput.value;
         fahrenheit = parseFloat(input);
         cInput.value = convertFtoC(fahrenheit);
      }

      if (isNaN(fahrenheit)) {
         errorMessage.textContent = input + " is not a number";
      }
      else {
         errorMessage.textContent = "";

         if (fahrenheit < 32) {
            weatherImage.src = "cold.png";
         }
         else if (fahrenheit <= 50) {
            weatherImage.src = "cool.png";
         }
         else {
            weatherImage.src = "warm.png";
         }
      }
   });
}
function convertCtoF(degreesCelsius) {
   return degreesCelsius * 9 / 5 + 32;
}
function convertFtoC(degreesFahrenheit) {
   return (degreesFahrenheit - 32) * 5 / 9;
}
