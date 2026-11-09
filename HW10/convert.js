window.addEventListener("DOMContentLoaded", domLoaded);

function domLoaded() {
   const cInput = document.getElementById("cInput");
   const fInput = document.getElementById("fInput");
   const convertButton = document.getElementById("convertButton");
   const errorMessage = document.getElementById("errorMessage");
   const weatherImage = document.getElementById("weatherImage");

   cInput.addEventListener("input", function() {
      fInput.value = "";
   });

   fInput.addEventListener("input", function() {
      cInput.value = "";
   });

   convertButton.addEventListener("click", function() {
      let fahrenheit;
      let input;

      if (cInput.value !== "") {
         input = cInput.value;
         const celsius = parseFloat(input);

         if (isNaN(celsius)) {
            errorMessage.textContent = input + " is not a number";
            return;
         }

         fahrenheit = convertCtoF(celsius);
         fInput.value = fahrenheit;
      }
      else {
         input = fInput.value;
         fahrenheit = parseFloat(input);

         if (isNaN(fahrenheit)) {
            errorMessage.textContent = input + " is not a number";
            return;
         }

         cInput.value = convertFtoC(fahrenheit);
      }

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
   });
}

function convertCtoF(degreesCelsius) {
   return degreesCelsius * 9 / 5 + 32;
}

function convertFtoC(degreesFahrenheit) {
   return (degreesFahrenheit - 32) * 5 / 9;
}
