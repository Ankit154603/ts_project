const getUsername = document.querySelector("#user") as HTMLInputElement;
const formSubmit = document.querySelector("#form") as HTMLInputElement;
const main_container = document.querySelector(".main_container") as HTMLElement;
interface UserData {
    id: number;
    login: string;
    avatar_url: string;
    location: string;
    url: string;
}


//default function call

//resuable fun

 async function myCustomerFetcher<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);
   
    if (!response.ok) {
        throw new Error (
            `Network was not ok - status: ${response.status}`
        );
    }

    const data = await response.json();
    // console.log(data);
    return data; 
}

const showResultUI  = (singleUser: UserData) => {
    const { avatar_url, login, url} = singleUser;
    main_container.insertAdjacentHTML(
        "beforeend",
        `
        <div class="card">
        <img src=${avatar_url} alt=${login} />
        <hr />
        <div class="card-footer>
        <img src = "${avatar_url}" alt = "${login}" />
        <a href = "${url}"> Github </a>
        </div>
        </div>
        `
    );
};  

function fetchUserData(url: string) {
    myCustomerFetcher<UserData[]>(url, {}).then((userInfo) => {
        for(const singleUser of userInfo) {
            showResultUI(singleUser);
            console.log("login " + singleUser.login);
        }
    });
}

fetchUserData("https://api.github.com/users");

// let perform serach fun
formSubmit.addEventListener("submit", async (e) => {
    e.preventDefault();

    const searchTerm = getUsername.value.toLocaleLowerCase();

    try{
        const url = "https://api.github.com/users";

       const allUserData = await myCustomerFetcher<UserData[]>(url, {});

       const matchingusers = allUserData.filter((user) =>{
        return user.login.toLocaleLowerCase().includes(searchTerm);
       });

       // we needd to clear the prevoius data
       main_container.innerHTML = ""; 

       if (matchingusers.length === 0) {
        main_container?.insertAdjacentHTML (
            "beforeend",
            `<p class="empty-msg">No matching  users found.</p>`
        );
       } else {
        for (const singleUser of matchingusers) {
            showResultUI(singleUser);
        }
       }

    } catch (error) {
        console.log(error);
    } 
});