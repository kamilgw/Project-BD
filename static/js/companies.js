class Model {
    static async read() {
        let options = {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch("/api/firmy", options);
        return await response.json();
    }

    static async readOne(NIP) {
        let options = {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/firmy/${NIP}`, options);
        return await response.json();
    }

    static async create(firmy) {
        let options = {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(firmy)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/firmy`, options);
        return await response.json();
    }

    static async update(companies) {
        let options = {
            method: "PUT",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(companies)
        };
        let response = await fetch(`/api/firmy/${companies.NIP}`, options);
        return await response.json();
    }

    static async delete(NIP) {
        let options = {
            method: "DELETE",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        return await fetch(`/api/firmy/${NIP}`, options);
    }

    static async user_company(NIP) {
        let options = {
            method: "PUT",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        return await fetch(`/api/firmy/firma-uzytkownika/${NIP}`, options);
    }


    static async wagon_company(NIP) {
        let options = {
            method: "PUT",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        return await fetch(`/api/firmy/firma-wagonow/${NIP}`, options);
    }
}


class View {
    constructor() {
        this.table = document.querySelector(".flex-auto table");
        this.error = document.querySelector(".error");
        this.name = document.getElementById("name");
        this.phone = document.getElementById("phone");
        this.NIP = document.getElementById("NIP");
        this.email = document.getElementById("email");
        this.address = document.getElementById("address");
        this.city = document.getElementById("city");
        this.country = document.getElementById("country");
        this.postcode = document.getElementById("postcode");
    }

    reset() {
        this.name.value = "";
        this.phone.value = "";
        this.NIP.value = "";
        this.email.value = "";
        this.address.value = "";
        this.city.value = "";
        this.country.value = "";
        this.postcode.value = "";
        this.NIP.focus();
    }

    updateEditor(company) {
        this.name.value = company.nazwa;
        this.phone.value = company.telefon;
        this.NIP.value = company.NIP;
        this.email.value = company.email;
        this.address.value = company.adres;
        this.city.value = company.miasto;
        this.country.value = company.kraj;
        this.postcode.value = company.kod_pocztowy;
        this.NIP.focus();
    }

    buildTable(company) {
        let tbody,
            html = "";
        company.forEach((company) => {
            html += `
            <tr data-name="${company.name}" data-NIP="${company.NIP}" data-phone="${company.phone}" data-email="${company.email}" data-address="${company.address}" data-city="${company.city}" data-country="${company.country}" data-postcode="${company.postcode}">
                <td class="name">${company.name}</td>
                <td class="NIP">${company.NIP}</td>
                <td class="phone">${company.phone}</td>
                <td class="email">${company.email}</td>
                <td class="address">${company.address}</td>
                <td class="city">${company.city}</td>
                <td class="country">${company.country}</td>
                <td class="postcode">${company.postcode}</td>
            </tr>`;
        });
        if (this.table.tBodies.length !== 0) {
            this.table.removeChild(this.table.getElementsByTagName("tbody")[0]);
        }
        tbody = this.table.createTBody();
        tbody.innerHTML = html;
    }

    errorMessage(message) {
        this.error.innerHTML = message;
        this.error.classList.add("visible");
        this.error.classList.remove("hidden");
        setTimeout(() => {
            this.error.classList.add("hidden");
            this.error.classList.remove("visible");
        }, 2000);
    }
}


class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.initialize();
    }

    async initialize() {
        await this.initializeTable();
        this.initializeTableEvents();
        this.initializeCreateEvent();
        this.initializeUpdateEvent();
        this.initializeDeleteEvent();
        this.initializeResetEvent();
        this.initializeUserCompanyEvent();
        this.initializeWagonsCompanyEvent();
    }

    async initializeTable() {
        try {
            let urlCompanyId = +document.getElementById("url_company_id").value,
                company = await Model.read();

            this.view.buildTable(company);
            if (urlCompanyId) {
                let company = await Model.readOne(urlCompanyId);
                this.view.updateEditor(company);
            } else {
                this.view.reset();

            }
            this.initializeTableEvents();
        } catch (err) {
            this.view.errorMessage(err);
        }
    }

    initializeTableEvents() {
        document.querySelector("table tbody").addEventListener("click", (evt) => {
            let target = evt.target.parentElement,
                name = target.getAttribute("data-name"),
                NIP = target.getAttribute("data-NIP"),
                phone = target.getAttribute("data-phone"),
                email = target.getAttribute("data-email"),
                address = target.getAttribute("data-address"),
                city = target.getAttribute("data-city"),
                country = target.getAttribute("data-country"),
                postcode = target.getAttribute("data-postcode");

            this.view.updateEditor({
                name: name,
                NIP: NIP,
                email: email,
                phone: phone,
                address: address,
                city: city,
                country: country,
                postcode: postcode
            });
        });
    }

    initializeCreateEvent() {
        document.getElementById("create").addEventListener("click", async (evt) => {
            let name = document.getElementById("name").value,
                phone = document.getElementById("phone").value,
                NIP = document.getElementById("NIP").value,
                email = document.getElementById("email").value,
                address = document.getElementById("address").value,
                city = document.getElementById("city").value,
                country = document.getElementById("country").value,
                postcode = document.getElementById("postcode").value;

            evt.preventDefault();
            try {
                await Model.create({
                    name: name,
                    phone: phone,
                    NIP: NIP,
                    email: email,
                    address: address,
                    city: city,
                    country: country,
                    postcode: postcode
                });
                await this.initializeTable();
            } catch (err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeUpdateEvent() {
        document.getElementById("update").addEventListener("click", async (evt) => {
            let name = +document.getElementById("name").value,
                NIP = document.getElementById("NIP").value,
                phone = document.getElementById("phone").value,
                email = document.getElementById("email").value,
                address = document.getElementById("address").value,
                city = document.getElementById("city").value,
                country = document.getElementById("country").value,
                postcode = document.getElementById("postcode").value;


            evt.preventDefault();
            try {
                await Model.update({
                    name: name,
                    NIP: NIP,
                    phone: phone,
                    email: email,
                    address: address,
                    city: city,
                    country: country,
                    postcode: postcode
                });
                await this.initializeTable();
            } catch (err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeDeleteEvent() {
        document.getElementById("delete").addEventListener("click", async (evt) => {
            let NIP = +document.getElementById("NIP").value;

            evt.preventDefault();
            try {
                await Model.delete(NIP);
                await this.initializeTable();
            } catch (err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeUserCompanyEvent() {
        document.getElementById("user_company").addEventListener("click", async (evt) => {
            let NIP = +document.getElementById("NIP").value;

            evt.preventDefault();
            try {
                await Model.user_company(NIP);
                await this.initializeTable();
            } catch (err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeWagonsCompanyEvent() {
        document.getElementById("wagon_company").addEventListener("click", async (evt) => {
            let NIP = +document.getElementById("NIP").value;

            evt.preventDefault();
            try {
                await Model.wagon_company(NIP);
                await this.initializeTable();
            } catch (err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeResetEvent() {
        document.getElementById("reset").addEventListener("click", async (evt) => {
            evt.preventDefault();
            this.view.reset();
        });
    }
}

const model = new Model();
const view = new View();
const controller = new Controller(model, view);
