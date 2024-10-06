(async () => {
    
    
    let youtubeLeftControls, youtubePlayer;
    let currentVideo = '';
    let currentVideoBookmarks = [];
    const FormatedTime = (T) => {
        let date = new Date(0);
        date.setSeconds(T);
        return date.toISOString().substr(11, 8)
    }

    await injectModal();

    
   

    chrome.runtime.onMessage.addListener(async (obj, sender, response) => {
        const { type, value, videoId } = obj;
      
        if (type == "refrech") {
          
            currentVideo = value;
            newVideoLoaded()
        }
        
        if (type === "NEW") {
            currentVideo = videoId;
            console.log(currentVideo);
           
            newVideoLoaded();
        }

        if (type == "play") {
            youtubePlayer = document.getElementsByClassName("video-stream")[0];
            youtubePlayer.currentTime = value;
        }

        if (type == "delete") {

            currentVideoBookmarks = await fetchbokmarks();
            

            const afterdelete = currentVideoBookmarks.filter((e) => e.time != value)

            chrome.storage.sync.set({
                [currentVideo]: JSON.stringify(afterdelete.sort((a, b) => a.time - b.time))
            });
        }
    })

    const fetchbokmarks = () => {
        return new Promise((Resolve) => (
            chrome.storage.sync.get([currentVideo], (obj) => {
                Resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : [])
            })           
        ))
    }
    
    const newVideoLoaded =  async() => {
        const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
        console.log(bookmarkBtnExists);
        if (!bookmarkBtnExists ) {
            const bookmarkBtn = document.createElement("img");
            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.className = "ytp-button " + "bookmark-btn";
            bookmarkBtn.title = "Click to bookmark current timestamp";
            
            youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
            youtubePlayer = document.getElementsByClassName("video-stream")[0];
            
            youtubeLeftControls.append(bookmarkBtn);
            bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
        }
        console.log(bookmarkBtnExists);
        console.log(currentVideo);
    }

   
    
    const addNewBookmarkEventHandler = async () => {

        
       
        let modal = document.querySelector(".Mymodal")
        const currentTime = youtubePlayer.currentTime;
        console.log(modal);
        if (modal) {
            modal.removeAttribute("hidden");
            const Cancel_Btn = document.querySelector(".Mymodal_Cancel")
            Cancel_Btn.addEventListener("click", () => {
                modal.setAttribute("hidden", "");
                document.querySelector(".Mymodal_textbox").value = "";
            })
            const Add_Btn = document.querySelector(".Mymodal_Add")
            Add_Btn.addEventListener("click", async () => {
                const title = document.querySelector(".Mymodal_textbox").value;
                modal.setAttribute("hidden", "");
                const newBookmark = {
                    time: currentTime,
                    desc: title ,
                    FormatedTime : FormatedTime(currentTime)
                };
                currentVideoBookmarks = await fetchbokmarks();
                document.querySelector(".Mymodal_textbox").value = "";
                console.log(newBookmark);
                chrome.storage.sync.set({
                    [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time))
                });
                console.log(currentVideoBookmarks);
            })
            
        }
        
    }






async function injectModal() {
    // Inject Tailwind CSS if not already present
    if (!document.getElementById('tailwindcss')) {
      const tailwindLink = document.createElement('link');
      tailwindLink.id = 'tailwindcss';
      tailwindLink.rel = 'stylesheet';
      tailwindLink.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css'; // You can adjust the version as needed
      document.head.appendChild(tailwindLink);
    }
  
    // Modal HTML
    const modalHTML = `
    <div class="modal-container"  style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.5); z-index: 1000;">
      <div class="modal-content" style="background: white; padding: 20px; border-radius: 8px; width: 80%; max-width: 600px;">
        <h3 style="font-size: 2rem; margin-bottom: 15px;">Deactivate Account</h3>
         <div class="col-span-full">
          
          <div class="mt-2">
            <textarea   id="about" style="font-size: 2rem; line-height: 1.5" name="about" rows="3" class="block w-full Mymodal_textbox rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
          </div>
          
        </div>
        <div style="margin-top: 30px; text-align: right;">
          <button  class="Mymodal_Add" style="background-color: #4f46e5; color: white; font-size: 1.25rem; padding: 12px 24px; border: none; border-radius: 5px; margin-right: 10px;">Add</button>
          <button class="Mymodal_Cancel" style="background-color: grey; color: white; font-size: 1.25rem; padding: 12px 24px; border: none; border-radius: 5px;">Cancel</button>
        </div>
      </div>
    </div>
  `;

  const modalDiv = document.createElement('div');
    modalDiv.innerHTML = modalHTML;
    modalDiv.setAttribute("hidden", "true");
    modalDiv.className = "Mymodal";

  // Append modal to the body
  document.body.appendChild(modalDiv);
  }
  
  // Execute the function

  // Example usage: Load and append the file `content.html`
 
    


})();




