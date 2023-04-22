const searchBtn=document.querySelector('#search-btn');
const loadingDiv=document.querySelector('.loading');
const errorDiv=document.querySelector('.error');
const profileCardDiv=document.querySelector('.profile-card');
const reposCardDiv = document.querySelector('.repos-card');
const inputSearch = document.querySelector('#search-text');
const headerDiv = document.querySelector('.container-header');
const searchingDiv = document.querySelector('#searching-user');
const outputdiv=document.querySelector(".search-result-card");
const APIURL='https://api.github.com/users/';

let userFound=false;

function getURL(username){
    return APIURL + username;
}

function getRepoURL(username){
    return APIURL + username + "/repos";
}

function findUser(username){
    fetch(getURL(username)).then(
        response =>{
            if(!response.ok){
                const responseError = {
                    statusText: response.statusText,
                    status: response.status
                };
                throw responseError;
            }
            return response.json()
        })
        .then(json => {
            console.log(json)
            userFound=true;
            loadingDiv.style.display = "none";
            profileCardDiv.innerHTML = renderProfileCard(json.avatar_url,json.login,json.followers,json.following,json.html_url)
            // reposCardDiv.innerHTML = renderRepos(json.)

        }).catch(errorHandler);
}

function errorHandler(error){
    userFound=false;
    if(error.status == 404){
        loadingDiv.style.display="none";
        headerDiv.style.marginTop = "2rem"
        errorDiv.innerHTML = '<div class="error-div"><div class="error-msg"> Oops! User Not Found :( </div></div>';
    }

    if(error.status == 403){
        loadingDiv.style.display="none";
        headerDiv.style.marginTop = "2rem"
        errorDiv.innerHTML = '<div class="error-div"><div class="error-msg"> Oops! Rate limit exceeded! Try again later :( </div></div>';
    }

    console.log(error.status, error.statusText)
}

function getRepos(username){
    fetch(getRepoURL(username))
    .then(response => {
        if(!response.ok){
            const responseError = {
                statusText:response.statusText,
                status: response.status
            };
            throw responseError;
        }
        return response.json()
    })
    .then(json => {
        
        loadingDiv.style.display = "none";
        headerDiv.style.marginTop = "2rem";
        if(json.length >=2){
            //console.log(json);
            // json= shuffleArray(json);
            // console.log(json);
            reposCardDiv.innerHTML = renderRepos(json);
            window.scrollTo({left:0,top:document.body.scrollHeight,behavior:"smooth"});
        }
        else if(json.length === 0 && userFound){
            reposCardDiv.innerHTML = `
                <div class="error-div no-repo-error-div">
                    <div class="error-msg"> No Repos :( </div>
                </div>
            
            `
        }
    })
    .catch(errorHandler);
}

function shuffleArray(array){
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [array[i],array[j]] = array[j],array[i];
    }
    return array;
}

function clickHandler(){
    errorDiv.innerHTML="";
    reposCardDiv.innerHTML="";
    profileCardDiv.innerHTML="";
    loadingDiv.style.display="block";
    //  inputSearch.value="searching " + inputSearch.value + "...";
    //searchingDiv.inneText="hello"
    setTimeout(()=>{
        findUser(inputSearch.value);
        getRepos(inputSearch.value);
    },1500)
}

searchBtn.addEventListener("click",clickHandler);

function renderProfileCard(profileImage, profileUserName, followrs, following, html_url){

    return `
        <a href="${html_url}">
            <img src="${profileImage}" alt="profile pic" class="profile-image">
        </a>  
        <a href="${html_url}">
            <div class="profile-username">${profileUserName}</div>
        </a>

        <div class="profile-stats">
            <div class='followcount'>${followrs} &nbsp;  
            <span> Followers &nbsp; &nbsp; </span>
             ${following}&nbsp; 
            <span> Following </span> </div>
        </div>
    `;
}

function renderRepos(repoObj){
    // console.log(repoObj[0].name);
    return `
        <h3> Some Repos </h3>
        <div class="Repo-card"> 
            <div class="Repo-title">
            <div class="repo-name">${repoObj[0].name}</div>
            </div>
        </div>

        <div class="Repo-card"> 
            <div class="Repo-title">
            <div class="repo-name">${repoObj[1].name}</div>
            </div>
        </div>

        <div class="Repo-card"> 
            <div class="Repo-title">
            <div class="repo-name">${repoObj[2].name}</div>
            </div>
        </div>

    `;
}