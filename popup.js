// adding a new bookmark row to the popup
import { getActiveTab } from "./utils.js";


const addNewBookmark =  (bookmark,bookmarkselement) => { 
    
    let bookmarkstitle = document.createElement('div');
    let newbookmarkselement = document.createElement("div");
    let FormatedTime = document.createElement("spam")

    FormatedTime.innerHTML = `${bookmark.FormatedTime}`

    let controle = document.createElement('div')
    controle.className = 'bookmark-controls'
    
    bookmarkstitle.className = 'bookmark-title';
    bookmarkstitle.innerHTML = `${bookmark.desc}`;
    
    newbookmarkselement.id = 'bookmark-' + bookmark.time
    newbookmarkselement.setAttribute('timestamp', bookmark.time);
    newbookmarkselement.className= 'bookmark'
    newbookmarkselement.appendChild(bookmarkstitle)
    newbookmarkselement.appendChild(FormatedTime)
    newbookmarkselement.appendChild(controle)
    bookmarkselement.appendChild(newbookmarkselement);

    setBookmarkAttributes("play", onPlay, controle);
    setBookmarkAttributes("delete", onDelete, controle);

   

};


const viewBookmarks = async(data) => {
    let bookmarkselement = document.querySelector('.bookmarks')
    bookmarkselement.innerHTML = '';
    
    if (data.length > 0) {
        for (let bokm in data) {

            addNewBookmark(data[bokm], bookmarkselement);

        }
    } else {

        let container = document.getElementsByClassName("container")[0];
        let div = document.createElement('div');
        div.className = 'bookmarks';
        div.innerHTML = "No bookmarks yet";
        container.appendChild(div);
        
    }
};

const onPlay = async e => {
   let  bookmarktime = e.target.parentNode.parentNode.getAttribute('timestamp');

   
    const activetab = await getActiveTab();
    chrome.tabs.sendMessage(activetab.id, {
        type: 'play',
        value : bookmarktime
    })
};

const onDelete = async e => {

    let  bookmarktime = e.target.parentNode.parentNode.getAttribute('timestamp');
    let element = document.getElementById('bookmark-' + bookmarktime);

    element.parentNode.removeChild(element);
   
    const activetab = await getActiveTab();
    chrome.tabs.sendMessage(activetab.id, {
        type: 'delete',
        value : bookmarktime
    })

};

const setBookmarkAttributes = (src, eventlestener, controles) => { 


    let controleelemente = document.createElement('img');
    controleelemente.src = 'assets/' + src + '.png';
    controleelemente.title = src;
    controleelemente.className = 'bookmark-controls img'
    controles.appendChild(controleelemente);

    controleelemente.addEventListener('click',eventlestener)


};


document.addEventListener("DOMContentLoaded",async () => {

    const activetab = await getActiveTab();
    const queryParameters = activetab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters); 

    const currentVideo = urlParameters.get("v");

    chrome.tabs.sendMessage(activetab.id, {
        type: 'refrech',
        value : currentVideo
    })
    

    if (activetab.url.includes('youtube.com/watch') && currentVideo) {
        const fetchbokmarks =  () => {
            return new Promise((Resolve) => (
                chrome.storage.sync.get([currentVideo], (obj) => {
                    Resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : [])
                })           
            ))
        }

        const data = await fetchbokmarks();

        viewBookmarks(data);


               
    } else {
        let container = document.getElementsByClassName("container")[0];
        container.innerHTML ="<div class='title'>this is not a youtube vidio</div>";
    }

});






//future  feature

// let cache = {
//     "date_for": ""
// };
// const getfetch = async()=>{
//     const url = 'https://muslimsalat.p.rapidapi.com/berkane.json';
//     const options = {
//         method: 'GET',
//         headers: {
//             'x-rapidapi-key': 'e8e149c837mshc2d60c26caca19cp19b813jsne724dd010ed3',
//             'x-rapidapi-host': 'muslimsalat.p.rapidapi.com'
//         }
//     };
    
//     try {
//         const response = await fetch(url, options);
//         const result = await response.json();
//         cache = {
//             "date_for": result.items[0]["date_for"]
//         }
//         return result.items[0];
//     } catch (error) {
//         console.error(error);
//     }
// }


// let timings = '';
// let timeElement = document.querySelector('.prayer-time');
// setInterval(async() => {

//     let date = new Date();
//     let format = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate()
//     if (cache.date_for != format) {
//         timings = await getfetch();
//         timeElement.innerHTML = '';
   
//         for (let wa9t in timings) {
//             let time = document.createElement('div');
//             time.innerHTML = `${wa9t}  :  ${timings[wa9t]}`;
//             timeElement.appendChild(time);
//         }
//     }
// }, (2000));


