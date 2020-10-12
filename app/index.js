(function () {
  const CONTACTS_API_ENDPOINT = "//localhost:3001/contacts";
  const app = document.getElementById("app");
  const newContactform = document.getElementById("new-contact");
  let isLoading = false;
  let contacts = [];
  let error = null;

  function render() {
    app.innerHTML = null;

    if (isLoading) {
      const paragraph = document.createElement("p");
      paragraph.textContent = "Loading...";

      app.appendChild(paragraph);
    } else if (contacts.length) {
      contacts.forEach(({ name, phone }) => {
        const contactDiv = document.createElement("div");
        const nameSpan = document.createElement("span");
        const phoneLink = document.createElement("a");

        contactDiv.className = "contact";

        nameSpan.textContent = name;
        phoneLink.textContent = phone;
        phoneLink.target = "_blank";
        phoneLink.href = `tel:${phone}`;

        contactDiv.appendChild(nameSpan);
        contactDiv.appendChild(phoneLink);

        app.appendChild(contactDiv);
      });
    } else if (error) {
      const paragraph = document.createElement("p");
      paragraph.textContent = error;

      app.appendChild(paragraph);
    } else {
      const paragraph = document.createElement("p");
      paragraph.textContent = "Contacts List is empty";

      app.appendChild(paragraph);
    }
  }

  async function getContacts() {
    isLoading = true;
    error = null;

    // Promise based with async/await
    try {
      const result = await fetch(CONTACTS_API_ENDPOINT);

      if (result.status > 399) {
        throw new Error(
          JSON.stringify({
            status: result.status,
            message: "Data got lost on it's way. Please try to refresh!",
          })
        );
      }

      contacts = await result.json();
    } catch (err) {
      const errorObj = JSON.parse(err.message);

      error = errorObj.status ? errorObj.message : "Oops! Something went Wrong!";
    }

    isLoading = false;
    render();

    // Promise based with attached callbacs
    // fetch("//localhost:3001/contactss")
    //   .then((result) => {
    // if (result.status > 399) {
    //   throw new Error("Data got lost on it's way. Please try to refresh!");
    // }

    //     return result.json();
    //   })
    //   .then((json) => {
    //     contacts = json;
    //     isLoading = false;
    //     render();
    //   })
    //   .catch((err) => {
    //     isLoading = false;
    //     error = err.message || "Oops! Something went Wrong!";
    //     render();
    //   });
  }

  newContactform.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("new-contact-name").value;
    const phone = document.getElementById("new-contact-phone").value;

    const newContact = { name, phone };

    const response = await fetch(CONTACTS_API_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(newContact),
      headers: {
        "content-type": "application/json",
      },
    });

    contacts = contacts.concat(newContact);
    render();
  });

  getContacts();
  render();
})();
