window.onload = () => {
  formSubmit = document.getElementById("submit");
  formSubmit.addEventListener("click", validation);

  function validation() {
    //Taking card details from form
    let cardnum = String(document.forms["payForm"]["cardnum"].value);
    let expmonth = document.forms["payForm"]["expmonth"].value;
    let expyear = document.forms["payForm"]["expyear"].value;
    let cvv = String(document.forms["payForm"]["cvv"].value);

    console.log(cardnum, expmonth, expyear, cvv);

    let valcard = parseInt(cardnum.slice(0, 2));

    // Used later to validate the year, making sure the card is not expired
    let year = new Date().getFullYear();


    //Validation for card number, expiration date and security code, checking all things the specification requires
    if (cardnum.length !== 16) {
      alert("Please enter a number that is 16 characters long");
      return false;
    }

    if (valcard < 51 || valcard > 55) {
      alert("Please enter a valid card number");
      return false;
    }

    if (expmonth > 12 || expmonth < 1) {
      alert("Please enter a valid number for the month");
      return false;
    }

    if (expyear < year) {
      alert("Please enter a valid year");
      return false;
    }

    if (cvv.length < 3 || cvv.length > 4) {
      alert("Incorrect security code");
      return false;
    }

    //Success code after passing validation
    document.getElementById("response").innerHTML =
      "Details accepted, thank you for your payment";
    const url = "https://mudfoot.doc.stu.mmu.ac.uk/node/api/creditcard";


    //data that will be transferred to JSON and passed to server
    const creditcard = {
      master_card: parseInt(cardnum),
      exp_year: parseInt(expyear),
      exp_month: parseInt(expmonth),
      cvv_code: cvv,
    };


    /*TypeError: Failed to fetch
    Appears to be an issue with either the link or headers/body, but am unable to figure out how or why */

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(creditcard),
    })

    //Would check if response from server is an error or success
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else if (response.status === 400) {
          throw "Bad data sent to server";
        } else {
          throw "Something went wrong";
        }
      })
      //Displays errors when fetch is wrong, mainly TypeError as of now
      .catch((error) => {
        alert(error);
      });
  }
};
